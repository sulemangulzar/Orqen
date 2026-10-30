from uuid import UUID
from pydantic import BaseModel, Field


class PublicSessionResponse(BaseModel):
    assistant_id: UUID
    title: str
    greeting: str
    support_email: str | None
    session_token: str


class PublicMessageRequest(BaseModel):
    session_token: str = Field(min_length=32, max_length=200)
    message: str = Field(min_length=1, max_length=4000)


class PublicMessageResponse(BaseModel):
    conversation_id: UUID
    answer: str
    sources: list[dict]
    needs_handoff: bool
