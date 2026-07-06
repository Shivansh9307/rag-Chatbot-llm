from functools import lru_cache

import chromadb

from app.config import get_settings

settings = get_settings()

_COLLECTION_NAME = "documents"


@lru_cache
def get_client() -> chromadb.ClientAPI:
    return chromadb.PersistentClient(path=settings.chroma_persist_dir)


def get_collection():
    return get_client().get_or_create_collection(
        _COLLECTION_NAME, metadata={"hnsw:space": "cosine"}
    )


def add_chunks(
    document_id: str,
    filename: str,
    chunk_ids: list[str],
    texts: list[str],
    embeddings: list[list[float]],
    metadatas: list[dict],
) -> None:
    collection = get_collection()
    collection.add(
        ids=chunk_ids,
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas,
    )


def query(
    embedding: list[float],
    top_k: int,
    document_ids: list[str] | None = None,
) -> list[dict]:
    collection = get_collection()
    where = {"document_id": {"$in": document_ids}} if document_ids else None
    results = collection.query(
        query_embeddings=[embedding],
        n_results=top_k,
        where=where,
    )

    hits: list[dict] = []
    ids = results.get("ids", [[]])[0]
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for chunk_id, text, metadata, distance in zip(ids, documents, metadatas, distances):
        similarity = 1 - distance
        hits.append(
            {
                "chunk_id": chunk_id,
                "text": text,
                "metadata": metadata,
                "similarity": similarity,
            }
        )
    return hits


def delete_document(document_id: str) -> None:
    collection = get_collection()
    collection.delete(where={"document_id": document_id})
