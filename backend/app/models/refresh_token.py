from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING
import uuid

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.user import User


class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_tokens"  # type: ignore[assignment]

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True
    )
    token_hash: str = Field(unique=True, index=True, nullable=False)
    user_id: uuid.UUID = Field(
        foreign_key="users.id", index=True, nullable=False
    )
    expires_at: datetime = Field(index=True, nullable=False)
    revoked_at: datetime | None = Field(default=None)
    user_agent: str | None = Field(default=None, max_length=500)
    ip_address: str | None = Field(default=None, max_length=45)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    user: User | None = Relationship(back_populates="refresh_tokens")
