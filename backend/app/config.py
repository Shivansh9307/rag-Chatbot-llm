from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    openai_api_key: str
    openai_chat_model: str = "gpt-4o-mini"
    openai_embedding_model: str = "text-embedding-3-small"

    chroma_persist_dir: str = "./data/chroma"
    sqlite_db_path: str = "./data/app.db"
    upload_dir: str = "./data/uploads"

    chunk_size_tokens: int = 800
    chunk_overlap_tokens: int = 150
    retrieval_top_k: int = 5
    retrieval_min_similarity: float = 0.1

    max_upload_size_mb: int = 25
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
