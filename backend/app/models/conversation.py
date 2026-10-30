from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel


class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    organization_id: UUID = Field(foreign_key="organizations.id", index=True)
    assistant_id: UUID = Field(foreign_key="assistants.id", index=True)
    status: str = Field(default="open", max_length=32, index=True)
    visitor_session_hash: str | None = Field(default=None, index=True, max_length=128)
    needs_handoff: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ConversationMessage(SQLModel, table=True):
    __tablename__ = "conversation_messages"
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    conversation_id: UUID = Field(foreign_key="conversations.id", index=True)
    role: str = Field(max_length=32)
    content: str
    sources: list[dict] | None = Field(default=None, sa_column=Column(JSON, nullable=True))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
