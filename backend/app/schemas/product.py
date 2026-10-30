from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class MembershipResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    user_id: UUID
    organization_id: UUID
    role: str
    status: str


class InvitationCreate(BaseModel):
    email: EmailStr
    role: str = Field(default="member", pattern="^(admin|member|viewer)$")


class InvitationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    organization_id: UUID
    email: EmailStr
    role: str
    status: str
    expires_at: datetime


class AssistantCreate(BaseModel):
    collection_id: UUID | None = None
    title: str = Field(default="Support assistant", min_length=2, max_length=150)
    public_slug: str | None = Field(default=None, max_length=150)
    greeting: str = Field(default="How can we help?", max_length=1000)
    fallback_response: str = Field(default="I don't have enough information to answer that.", max_length=2000)
    support_email: EmailStr | None = None
    document_ids: list[UUID] = Field(default_factory=list)


class AssistantUpdate(BaseModel):
    document_ids: list[UUID] | None = None
    title: str | None = Field(default=None, min_length=2, max_length=150)
    public_slug: str | None = Field(default=None, max_length=150)
    greeting: str | None = Field(default=None, max_length=1000)
    fallback_response: str | None = Field(default=None, max_length=2000)
    support_email: EmailStr | None = None


class AssistantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    organization_id: UUID
    public_slug: str
    title: str
    greeting: str
    fallback_response: str
    support_email: str | None
    status: str
    document_ids: list[UUID] = Field(default_factory=list)


class DocumentCreate(BaseModel):
    filename: str = Field(min_length=1, max_length=255)
    mime_type: str = Field(pattern="^(application/pdf|text/plain)$")
    storage_key: str = Field(min_length=1, max_length=500)
    checksum: str | None = Field(default=None, max_length=128)


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    organization_id: UUID
    uploaded_by: UUID
    filename: str
    mime_type: str
    storage_key: str
    checksum: str | None
    state: str
    error_message: str | None
