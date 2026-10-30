from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class Document(SQLModel, table=True):
    __tablename__ = "documents"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    organization_id: UUID = Field(foreign_key="organizations.id", index=True)
    collection_id: UUID | None = Field(default=None, foreign_key="knowledge_collections.id", index=True)
    uploaded_by: UUID = Field(foreign_key="users.id", index=True)
    filename: str = Field(max_length=255)
    mime_type: str = Field(max_length=120)
    storage_key: str = Field(max_length=500, unique=True)
    checksum: str | None = Field(default=None, index=True, max_length=128)
    state: str = Field(default="uploaded", max_length=32, index=True)
    error_message: str | None = Field(default=None, max_length=2000)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DocumentVersion(SQLModel, table=True):
    __tablename__ = "document_versions"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    document_id: UUID = Field(foreign_key="documents.id", index=True)
    version: int = Field(default=1)
    checksum: str | None = Field(default=None, max_length=128)
    parser_status: str = Field(default="pending", max_length=32)
    page_count: int | None = None
    chunk_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AssistantDocument(SQLModel, table=True):
    __tablename__ = "assistant_documents"

    assistant_id: UUID = Field(foreign_key="assistants.id", primary_key=True)
    document_id: UUID = Field(foreign_key="documents.id", primary_key=True)
    is_published: bool = Field(default=False, index=True)
    published_at: datetime | None = None
