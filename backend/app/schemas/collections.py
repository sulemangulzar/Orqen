from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class CollectionCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    slug: str | None = Field(default=None, max_length=150)


class CollectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    organization_id: UUID
    name: str
    slug: str
    namespace: str
    status: str
    created_at: datetime
