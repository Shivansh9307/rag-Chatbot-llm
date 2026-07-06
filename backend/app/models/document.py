import uuid
from datetime import datetime, timezone

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    filename: Mapped[str] = mapped_column(String, nullable=False)
    content_type: Mapped[str] = mapped_column(String, nullable=False)
    file_ext: Mapped[str] = mapped_column(String, nullable=False)
    size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="processing")
    error_message: Mapped[str | None] = mapped_column(String, nullable=True)
    chunk_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(default=_now)
    updated_at: Mapped[datetime] = mapped_column(default=_now, onupdate=_now)


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    document_id: Mapped[str] = mapped_column(String, nullable=False, index=True)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    chroma_id: Mapped[str] = mapped_column(String, nullable=False)
    token_count: Mapped[int] = mapped_column(Integer, nullable=False)
    page_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
