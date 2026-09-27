from datetime import datetime, timezone
import uuid
from sqlmodel import Field, SQLModel
from enum import Enum

class OrgRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"


class User(SQLModel):
  __tablename__ = "users" #type: ignore

  id: uuid.UUID = Field(
      default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
  )
  email: str = Field(unique=True, index=True, max_length=255, nullable=False)
  hashed_password: str = Field(nullable=False)
  full_name: str | None = Field(default=None, max_length=100)

  # The tenant this user belongs to
  organization_id: uuid.UUID = Field(
      foreign_key="organizations.id", index=True, nullable=False
  )

  role: str = Field(default=OrgRole.MEMBER, nullable=False)
  is_active: bool = Field(default=True, nullable=False)

  created_at: datetime = Field(
      default_factory=lambda: datetime.now(timezone.utc), nullable=False
  )
