from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional
import uuid

from sqlalchemy import Column, DateTime, Enum as SQLEnum
from sqlmodel import Field, Relationship, SQLModel

from app.models.enums import AuthProvider, UserRole

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.refresh_token import RefreshToken


class User(SQLModel, table=True):
    __tablename__ = "users"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    email: str = Field(unique=True, index=True, max_length=255, nullable=False)
    hashed_password: str | None = Field(default=None, nullable=True)
    full_name: str | None = Field(default=None, max_length=120)

    organization_id: uuid.UUID | None = Field(
        default=None, foreign_key="organizations.id", index=True, nullable=True
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
    auth_provider: AuthProvider = Field(
        default=AuthProvider.EMAIL,
        sa_column=Column(
            SQLEnum(
                AuthProvider,
                name="auth_provider",
                native_enum=False,
                values_callable=lambda enum: [item.value for item in enum],
            ),
            nullable=False,
        ),
    )
    provider_id: str | None = Field(default=None, index=True, max_length=255)

    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)

    email_verification_token_hash: str | None = Field(default=None, index=True, max_length=255)
    email_verification_expires_at: datetime | None = Field(
        default=None, sa_type=DateTime(timezone=True)
    )
    password_reset_token_hash: str | None = Field(default=None, index=True, max_length=255)
    password_reset_expires_at: datetime | None = Field(
        default=None, sa_type=DateTime(timezone=True)
    )

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    organization: Optional["Organization"] = Relationship(back_populates="users")
    refresh_tokens: List["RefreshToken"] = Relationship(
        back_populates="user", cascade_delete=True
    )
