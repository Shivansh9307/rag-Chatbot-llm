from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    filename: str
    content_type: str
    file_ext: str
    size_bytes: int
    status: str
    error_message: str | None
    chunk_count: int
    created_at: datetime
    updated_at: datetime
