from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class ConversationSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    assistant_id: UUID
    status: str
    needs_handoff: bool
    created_at: datetime
    updated_at: datetime


class ConversationMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    role: str
    content: str
    sources: list[dict] | None
    created_at: datetime


class ConversationDetail(ConversationSummary):
    model_config = ConfigDict(from_attributes=True)
    messages: list[ConversationMessageResponse]
