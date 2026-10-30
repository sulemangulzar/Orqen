from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class KnowledgeCollection(SQLModel, table=True):
    __tablename__ = "knowledge_collections"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    organization_id: UUID = Field(foreign_key="organizations.id", index=True)
    name: str = Field(max_length=150)
    slug: str = Field(max_length=150, index=True)
    namespace: str = Field(max_length=150, unique=True)
    status: str = Field(default="active", max_length=32)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
