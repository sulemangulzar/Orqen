from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING
import uuid

from sqlalchemy import Column, DateTime
from sqlmodel import AutoString, Field, Relationship, SQLModel

from app.models.enums import PlanTier, SubscriptionStatus

if TYPE_CHECKING:
  from app.models.user import User
  from app.models.invitation  import Invitation


class Organization(SQLModel, table=True):
  __tablename__ = "organizations"  # type: ignore[assignment]

  id: uuid.UUID = Field(
      default_factory=uuid.uuid4, primary_key=True, index=True
  )
  name: str = Field(index=True, max_length=150, nullable=False)
  slug: str = Field(
      unique=True,
      index=True,
      max_length=150,
      description="Subdomain or workspace slug (e.g. acme-corp)",
  )

  plan: PlanTier = Field(
      default=PlanTier.FREE,
      sa_type=AutoString,
      nullable=False,
      index=True,
  )
  subscription_status: SubscriptionStatus = Field(
      default=SubscriptionStatus.ACTIVE,
      sa_type=AutoString,
      nullable=False,
      index=True,
  )

  stripe_customer_id: str | None = Field(
      default=None,
      unique=True,
      index=True,
      max_length=255,
  )
  stripe_subscription_id: str | None = Field(
      default=None,
      unique=True,
      index=True,
      max_length=255,
  )

  website: str | None = Field(default=None, max_length=255)
  company_size: str | None = Field(
      default=None, max_length=50
  )

  # --- Audit Timestamps ---
  created_at: datetime = Field(
      default_factory=lambda: datetime.now(timezone.utc),
      sa_type=DateTime(timezone=True),
      nullable=False,
  )
  updated_at: datetime = Field(
      default_factory=lambda: datetime.now(timezone.utc),
      sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
      sa_type=DateTime(timezone=True),
      nullable=False,
  )

  # --- Relationships ---
  users: list[User] = Relationship(
      back_populates="organization",
      cascade_delete=True,
  )
  invitations: list[Invitation] = Relationship(
      back_populates="organization",
      cascade_delete=True,
  )
