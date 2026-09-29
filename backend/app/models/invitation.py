from datetime import datetime, timedelta, timezone
from typing import TYPE_CHECKING, Optional
import uuid

from sqlalchemy import DateTime
from sqlmodel import AutoString, Field, Relationship, SQLModel

from app.models.enums import InvitationStatus, UserRole

if TYPE_CHECKING:
    from app.models.organization import Organization


class Invitation(SQLModel, table=True):
    __tablename__ = "invitations"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    organization_id: uuid.UUID = Field(
        foreign_key="organizations.id",
        index=True,
        nullable=False,
    )
    email: str = Field(index=True, max_length=255, nullable=False)
    role: UserRole = Field(
        default=UserRole.MEMBER,
        sa_type=AutoString,
        nullable=False,
    )
    token: str = Field(unique=True, index=True, nullable=False)
    status: InvitationStatus = Field(
        default=InvitationStatus.PENDING,
        sa_type=AutoString,
        nullable=False,
        index=True,
    )
    expires_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc) + timedelta(hours=48),
        sa_type=DateTime(timezone=True),
        nullable=False,
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
        nullable=False,
    )

    organization: Optional["Organization"] = Relationship(back_populates="invitations")
