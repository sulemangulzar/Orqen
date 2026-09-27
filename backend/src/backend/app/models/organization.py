from datetime import datetime, timezone
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field


class Organizations(SQLModel, table=True):

    id: UUID = Field(
          default_factory=uuid4, primary_key=True, index=True, nullable=False
      )
    name : str = Field(nullable=False)
    slug : str = Field(unique=True, nullable=False, index=True)
    plan : str = Field(default="free", nullable=False)
    created_at : datetime = Field(default= lambda : datetime.now(timezone.utc,), nullable=False)
    updated_at : datetime = Field(default= lambda : datetime.now(timezone.utc,), nullable=False)
