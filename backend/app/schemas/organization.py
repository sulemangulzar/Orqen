from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import PlanTier, SubscriptionStatus


class OrganizationCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    website: str | None = Field(default=None, max_length=255)
    company_size: str | None = Field(default=None, max_length=50)

    @field_validator("name", "website", "company_size", mode="before")
    @classmethod
    def strip_text(cls, value):
        if not isinstance(value, str):
            return value
        normalized = " ".join(value.split())
        return normalized or None


class OrganizationUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=150)
    slug: str | None = Field(default=None, max_length=150)
    website: str | None = Field(default=None, max_length=255)
    company_size: str | None = Field(default=None, max_length=50)

    @field_validator("name", "slug", "website", "company_size", mode="before")
    @classmethod
    def normalize_text(cls, value):
        if not isinstance(value, str):
            return value
        normalized = " ".join(value.split())
        return normalized or None


class OrganizationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    plan: PlanTier
    subscription_status: SubscriptionStatus
    stripe_customer_id: str | None
    stripe_subscription_id: str | None
    website: str | None
    company_size: str | None
    created_at: datetime
    updated_at: datetime
