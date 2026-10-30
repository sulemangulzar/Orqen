from uuid import UUID

from pydantic import BaseModel, Field


class SupportMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=12000)


class SupportRequest(BaseModel):
    assistant_id: UUID
    conversation_id: UUID | None = None
    message: str = Field(min_length=1, max_length=12000)
    conversation: list[SupportMessage] = Field(default_factory=list, max_length=30)


class Source(BaseModel):
    kind: str
    title: str
    reference: str | None = None


class SupportResponse(BaseModel):
    conversation_id: UUID
    answer: str
    sources: list[Source] = Field(default_factory=list)
    needs_handoff: bool = False
