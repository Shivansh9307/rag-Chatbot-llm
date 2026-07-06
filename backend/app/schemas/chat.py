from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ChatSessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    created_at: datetime
    updated_at: datetime


class ChatMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: str
    role: str
    content: str
    citations: list | None
    created_at: datetime


class CreateMessageIn(BaseModel):
    content: str
    document_ids: list[str] | None = None
