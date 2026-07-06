from openai import OpenAI

from app.config import get_settings

settings = get_settings()
_client = OpenAI(api_key=settings.openai_api_key)

_BATCH_SIZE = 100


def embed_texts(texts: list[str]) -> list[list[float]]:
    embeddings: list[list[float]] = []
    for i in range(0, len(texts), _BATCH_SIZE):
        batch = texts[i : i + _BATCH_SIZE]
        response = _client.embeddings.create(
            model=settings.openai_embedding_model, input=batch
        )
        embeddings.extend(item.embedding for item in response.data)
    return embeddings


def embed_query(text: str) -> list[float]:
    return embed_texts([text])[0]
