import logging
import os

from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.document import Document, DocumentChunk
from app.services import vectorstore
from app.services.chunking import chunk_pages
from app.services.embeddings import embed_texts
from app.services.extractors import extract

logger = logging.getLogger(__name__)
settings = get_settings()


def process_document(document_id: str, path: str, file_ext: str, db_factory) -> None:
    db: Session = db_factory()
    try:
        document = db.get(Document, document_id)
        if document is None:
            return

        try:
            pages = extract(file_ext, path)
            chunks = chunk_pages(
                pages,
                chunk_size_tokens=settings.chunk_size_tokens,
                chunk_overlap_tokens=settings.chunk_overlap_tokens,
            )

            if not chunks:
                document.status = "failed"
                document.error_message = "No extractable text found in document."
                db.commit()
                return

            texts = [c.text for c in chunks]
            embeddings = embed_texts(texts)

            chunk_ids = [f"{document_id}:{i}" for i in range(len(chunks))]
            metadatas = [
                {
                    "document_id": document_id,
                    "filename": document.filename,
                    "chunk_index": i,
                    "page_number": c.page_number if c.page_number is not None else -1,
                }
                for i, c in enumerate(chunks)
            ]

            vectorstore.add_chunks(
                document_id=document_id,
                filename=document.filename,
                chunk_ids=chunk_ids,
                texts=texts,
                embeddings=embeddings,
                metadatas=metadatas,
            )

            for i, c in enumerate(chunks):
                db.add(
                    DocumentChunk(
                        document_id=document_id,
                        chunk_index=i,
                        chroma_id=chunk_ids[i],
                        token_count=c.token_count,
                        page_number=c.page_number,
                    )
                )

            document.status = "ready"
            document.chunk_count = len(chunks)
            db.commit()
        except Exception as exc:  # noqa: BLE001
            logger.exception("Failed to process document %s", document_id)
            document.status = "failed"
            document.error_message = str(exc)
            db.commit()
    finally:
        db.close()
