import os
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import SessionLocal
from app.deps import get_db
from app.models.document import Document
from app.schemas.document import DocumentOut
from app.services import vectorstore
from app.services.extractors import EXTRACTORS
from app.services.ingestion import process_document

router = APIRouter(prefix="/documents", tags=["documents"])
settings = get_settings()


@router.get("", response_model=list[DocumentOut])
def list_documents(db: Session = Depends(get_db)) -> list[Document]:
    return db.query(Document).order_by(Document.created_at.desc()).all()


@router.get("/{document_id}", response_model=DocumentOut)
def get_document(document_id: str, db: Session = Depends(get_db)) -> Document:
    document = db.get(Document, document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.post("/upload", response_model=DocumentOut)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile,
    db: Session = Depends(get_db),
) -> Document:
    filename = file.filename or "upload"
    file_ext = os.path.splitext(filename)[1].lower()

    if file_ext not in EXTRACTORS:
        supported = ", ".join(sorted(EXTRACTORS))
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file_ext}'. Supported: {supported}",
        )

    contents = await file.read()
    size_bytes = len(contents)
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if size_bytes > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds max upload size of {settings.max_upload_size_mb}MB",
        )

    document_id = str(uuid.uuid4())
    os.makedirs(settings.upload_dir, exist_ok=True)
    dest_path = os.path.join(settings.upload_dir, f"{document_id}{file_ext}")
    with open(dest_path, "wb") as f:
        f.write(contents)

    document = Document(
        id=document_id,
        filename=filename,
        content_type=file.content_type or "application/octet-stream",
        file_ext=file_ext,
        size_bytes=size_bytes,
        status="processing",
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    background_tasks.add_task(
        process_document, document_id, dest_path, file_ext, SessionLocal
    )

    return document


@router.delete("/{document_id}", status_code=204)
def delete_document(document_id: str, db: Session = Depends(get_db)) -> None:
    document = db.get(Document, document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    vectorstore.delete_document(document_id)

    upload_path = os.path.join(settings.upload_dir, f"{document_id}{document.file_ext}")
    if os.path.exists(upload_path):
        os.remove(upload_path)

    db.delete(document)
    db.commit()
