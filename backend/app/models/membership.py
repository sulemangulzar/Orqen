from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class OrganizationMembership(SQLModel, table=True):
    __tablename__ = "organization_memberships"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    organization_id: UUID = Field(foreign_key="organizations.id", index=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    role: str = Field(default="member", max_length=32)
    status: str = Field(default="active", max_length=32, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
