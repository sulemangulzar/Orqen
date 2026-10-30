from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class Assistant(SQLModel, table=True):
    __tablename__ = "assistants"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    organization_id: UUID = Field(foreign_key="organizations.id", index=True)
    collection_id: UUID | None = Field(default=None, foreign_key="knowledge_collections.id", index=True)
    public_slug: str = Field(index=True, unique=True, max_length=150)
    title: str = Field(default="Support assistant", max_length=150)
    greeting: str = Field(default="How can we help?", max_length=1000)
    fallback_response: str = Field(default="I don't have enough information to answer that.", max_length=2000)
    support_email: str | None = Field(default=None, max_length=255)
    status: str = Field(default="draft", max_length=32, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
