from app.config import get_settings
from app.services import vectorstore
from app.services.embeddings import embed_query

settings = get_settings()


def retrieve(question: str, document_ids: list[str] | None = None) -> list[dict]:
    embedding = embed_query(question)
    hits = vectorstore.query(
        embedding=embedding,
        top_k=settings.retrieval_top_k,
        document_ids=document_ids,
    )
    return [h for h in hits if h["similarity"] >= settings.retrieval_min_similarity]
