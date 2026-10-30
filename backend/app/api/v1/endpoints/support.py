from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from app.ai.graph import run_support_graph
from app.ai.schemas import Source, SupportRequest, SupportResponse
from app.api.deps import SessionDep, get_current_user
from app.models.user import User
from app.models.assistant import Assistant
from app.models.conversation import Conversation, ConversationMessage

router = APIRouter(prefix="/support", tags=["Support"])


@router.post("/message", response_model=SupportResponse)
async def support_message(payload: SupportRequest, session: SessionDep, current_user: User = Depends(get_current_user)):
    if current_user.organization_id is None:
        raise HTTPException(status_code=403, detail="User must belong to an organization")
    assistant = await session.get(Assistant, payload.assistant_id)
    if assistant is None or assistant.organization_id != current_user.organization_id or assistant.status != "published":
        raise HTTPException(status_code=404, detail="Published assistant not found")
    conversation = await session.get(Conversation, payload.conversation_id) if payload.conversation_id else None
    if conversation is None:
        conversation = Conversation(organization_id=current_user.organization_id, assistant_id=assistant.id)
        session.add(conversation)
        await session.flush()
    if conversation.organization_id != current_user.organization_id or conversation.assistant_id != assistant.id:
        raise HTTPException(status_code=403, detail="Conversation does not belong to this assistant")
    history = [item.model_dump() for item in payload.conversation]
    if not history:
        prior = (await session.exec(select(ConversationMessage).where(ConversationMessage.conversation_id == conversation.id).order_by(ConversationMessage.created_at))).all()
        history = [{"role": item.role, "content": item.content} for item in prior[-20:]]
    result = await run_support_graph(current_user.organization_id, payload.message, history, session, assistant.id)
    sources = [Source(**source) for source in result.get("sources", [])]
    session.add(ConversationMessage(conversation_id=conversation.id, role="user", content=payload.message))
    session.add(ConversationMessage(conversation_id=conversation.id, role="assistant", content=result["answer"], sources=[source.model_dump() for source in sources]))
    conversation.needs_handoff = result.get("needs_handoff", False)
    conversation.updated_at = datetime.now(timezone.utc)
    session.add(conversation)
    await session.commit()
    return SupportResponse(conversation_id=conversation.id, answer=result["answer"], sources=sources, needs_handoff=conversation.needs_handoff)
