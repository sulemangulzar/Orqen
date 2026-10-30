from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    app_name: str = "Orqen"
    database_url: str | None = None
    auth_secret: str
    access_token_minutes: int
    refresh_token_days: int
    frontend_url: str
    resend_api_key: str | None = None
    email_from: str
    google_client_id: str | None
    shopify_client_id: str
    shopify_client_secret: str
    shopify_redirect_uri: str
    shopify_api_version: str
    shopify_token_encryption_key: str
    openai_api_key: str | None = None
    openai_model: str = "gpt-4.1-mini"
    openai_embedding_model: str = "text-embedding-3-small"
    rag_top_k: int = 5
    ai_max_tokens: int = 800
    pinecone_api_key: str | None = None
    pinecone_collection: str | None = None
    document_storage_path: str = "./storage/documents"

    model_config = SettingsConfigDict(
        env_file=BACKEND_ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
