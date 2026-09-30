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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
