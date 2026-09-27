from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Column, Enum as SQLEnum
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.user import User


class OrganizationPlan(str, Enum):
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class Organization(SQLModel, table=True):
    __tablename__ = "organizations"  # type: ignore[assignment]

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True, nullable=False)
    name: str = Field(max_length=255, nullable=False)
    slug: str = Field(max_length=100, unique=True, index=True, nullable=False)
    plan: OrganizationPlan = Field(
        default=OrganizationPlan.FREE,
        sa_column=Column(
            SQLEnum(
                OrganizationPlan,
                name="organization_plan",
                native_enum=False,
                values_callable=lambda enum: [item.value for item in enum],
            ),
            nullable=False,
        ),
    )
    is_active: bool = Field(default=True, nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )

    users: list[User] = Relationship(back_populates="organization")
