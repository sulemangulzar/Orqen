from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING
import uuid

from sqlalchemy import Column, Enum as SQLEnum
from sqlmodel import Field, Relationship, SQLModel

from app.models.enums import UserRole

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.refresh_token import RefreshToken


class User(SQLModel, table=True):
    __tablename__ = "users"  # type: ignore[assignment]

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True
    )
    email: str = Field(unique=True, index=True, max_length=255, nullable=False)
    hashed_password: str = Field(nullable=False)
    full_name: str | None = Field(default=None, max_length=120)

    organization_id: uuid.UUID = Field(
        foreign_key="organizations.id", index=True, nullable=False
    )
    role: UserRole = Field(
        default=UserRole.OWNER,
        sa_column=Column(
            SQLEnum(
                UserRole,
                name="user_role",
                native_enum=False,
                values_callable=lambda enum: [item.value for item in enum],
            ),
            nullable=False,
        ),
    )

    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    organization: Organization | None = Relationship(back_populates="users")
    refresh_tokens: list[RefreshToken] = Relationship(
        back_populates="user", cascade_delete=True
    )
