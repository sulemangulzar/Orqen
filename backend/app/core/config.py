from pydantic_settings import BaseSettings, SettingsConfigDict


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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
