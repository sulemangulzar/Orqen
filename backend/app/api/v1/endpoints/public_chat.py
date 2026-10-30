import hashlib
import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request
from sqlmodel import select

from app.ai.graph import run_support_graph
from app.api.deps import SessionDep
from app.models.assistant import Assistant
from app.models.conversation import Conversation, ConversationMessage
from app.schemas.public_chat import PublicMessageRequest, PublicMessageResponse, PublicSessionResponse
from app.core.rate_limit import public_chat_limiter

router = APIRouter(prefix="/public", tags=["Public chat"])


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


@router.get("/assistants/{public_slug}", response_model=PublicSessionResponse)
async def create_public_session(public_slug: str, session: SessionDep):
    assistant = (await session.exec(select(Assistant).where(Assistant.public_slug == public_slug, Assistant.status == "published"))).first()
    if assistant is None:
        raise HTTPException(status_code=404, detail="Public assistant not found")
    token = secrets.token_urlsafe(32)
    conversation = Conversation(organization_id=assistant.organization_id, assistant_id=assistant.id, visitor_session_hash=token_hash(token))
    session.add(conversation)
    await session.commit()
    return PublicSessionResponse(assistant_id=assistant.id, title=assistant.title, greeting=assistant.greeting, support_email=assistant.support_email, session_token=token)


@router.post("/assistants/{public_slug}/messages", response_model=PublicMessageResponse)
async def public_message(public_slug: str, payload: PublicMessageRequest, request: Request, session: SessionDep):
    client_key = f"{request.client.host if request.client else 'unknown'}:{public_slug}"
    if not public_chat_limiter.allow(client_key):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again shortly.")
    assistant = (await session.exec(select(Assistant).where(Assistant.public_slug == public_slug, Assistant.status == "published"))).first()
    if assistant is None:
        raise HTTPException(status_code=404, detail="Public assistant not found")
    conversation = (await session.exec(select(Conversation).where(Conversation.assistant_id == assistant.id, Conversation.visitor_session_hash == token_hash(payload.session_token), Conversation.status == "open"))).first()
    if conversation is None:
        raise HTTPException(status_code=401, detail="Invalid visitor session")
    prior = (await session.exec(select(ConversationMessage).where(ConversationMessage.conversation_id == conversation.id).order_by(ConversationMessage.created_at))).all()
    history = [{"role": item.role, "content": item.content} for item in prior[-20:]]
    result = await run_support_graph(assistant.organization_id, payload.message, history, session, assistant.id)
    sources = result.get("sources", [])
    session.add(ConversationMessage(conversation_id=conversation.id, role="user", content=payload.message))
    session.add(ConversationMessage(conversation_id=conversation.id, role="assistant", content=result["answer"], sources=sources))
    conversation.needs_handoff = result.get("needs_handoff", False)
    conversation.updated_at = datetime.now(timezone.utc)
    session.add(conversation)
    await session.commit()
    return PublicMessageResponse(conversation_id=conversation.id, answer=result["answer"], sources=sources, needs_handoff=conversation.needs_handoff)
