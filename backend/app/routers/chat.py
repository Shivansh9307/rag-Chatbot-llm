import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.deps import get_db
from app.models.chat import ChatMessage, ChatSession
from app.schemas.chat import ChatMessageOut, ChatSessionOut, CreateMessageIn
from app.services.llm import stream_chat_completion
from app.services.prompt import build_citations, build_messages
from app.services.retrieval import retrieve

router = APIRouter(prefix="/sessions", tags=["chat"])


@router.post("", response_model=ChatSessionOut)
def create_session(db: Session = Depends(get_db)) -> ChatSession:
    session = ChatSession()
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("", response_model=list[ChatSessionOut])
def list_sessions(db: Session = Depends(get_db)) -> list[ChatSession]:
    return db.query(ChatSession).order_by(ChatSession.updated_at.desc()).all()


@router.delete("/{session_id}", status_code=204)
def delete_session(session_id: str, db: Session = Depends(get_db)) -> None:
    session = db.get(ChatSession, session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    db.query(ChatMessage).filter(ChatMessage.session_id == session_id).delete()
    db.delete(session)
    db.commit()


@router.get("/{session_id}/messages", response_model=list[ChatMessageOut])
def list_messages(session_id: str, db: Session = Depends(get_db)) -> list[ChatMessage]:
    session = db.get(ChatSession, session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )


def _sse_event(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"


@router.post("/{session_id}/messages")
def create_message(
    session_id: str, body: CreateMessageIn, db: Session = Depends(get_db)
):
    session = db.get(ChatSession, session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    user_message = ChatMessage(session_id=session_id, role="user", content=body.content)
    db.add(user_message)

    if session.title == "New chat":
        session.title = body.content[:60]

    db.commit()

    history_rows = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    history = [
        {"role": m.role, "content": m.content}
        for m in history_rows
        if m.id != user_message.id
    ]

    def event_stream():
        full_text = ""
        try:
            hits = retrieve(body.content, document_ids=body.document_ids)
            messages = build_messages(body.content, hits, history)
            citations = build_citations(hits)

            for delta in stream_chat_completion(messages):
                full_text += delta
                yield _sse_event({"delta": delta})
        except Exception as exc:  # noqa: BLE001
            yield _sse_event({"error": str(exc)})
            return

        assistant_message = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=full_text,
            citations=citations,
        )
        db.add(assistant_message)
        db.commit()

        yield _sse_event(
            {
                "done": True,
                "message_id": assistant_message.id,
                "citations": citations,
            }
        )

    return StreamingResponse(event_stream(), media_type="text/event-stream")
