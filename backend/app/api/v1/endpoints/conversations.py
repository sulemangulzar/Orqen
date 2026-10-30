import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from app.api.deps import SessionDep, get_current_user
from app.models.conversation import Conversation, ConversationMessage
from app.models.membership import OrganizationMembership
from app.models.user import User
from app.schemas.conversations import ConversationDetail, ConversationMessageResponse, ConversationSummary

router = APIRouter(prefix="/conversations", tags=["Conversations"])


async def authorized(organization_id: uuid.UUID, session: SessionDep, user: User):
    if user.organization_id != organization_id:
        membership = (await session.exec(select(OrganizationMembership).where(OrganizationMembership.organization_id == organization_id, OrganizationMembership.user_id == user.id, OrganizationMembership.status == "active"))).first()
        if membership is None:
            raise HTTPException(status_code=403, detail="You are not a member of this organization")


@router.get("/organizations/{organization_id}", response_model=list[ConversationSummary])
async def list_conversations(organization_id: uuid.UUID, session: SessionDep, current_user: User = Depends(get_current_user)):
    await authorized(organization_id, session, current_user)
    result = await session.exec(select(Conversation).where(Conversation.organization_id == organization_id).order_by(Conversation.updated_at.desc()).limit(100))
    return result.all()


@router.get("/organizations/{organization_id}/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(organization_id: uuid.UUID, conversation_id: uuid.UUID, session: SessionDep, current_user: User = Depends(get_current_user)):
    await authorized(organization_id, session, current_user)
    conversation = await session.get(Conversation, conversation_id)
    if conversation is None or conversation.organization_id != organization_id:
        raise HTTPException(status_code=404, detail="Conversation not found")
    messages = (await session.exec(select(ConversationMessage).where(ConversationMessage.conversation_id == conversation_id).order_by(ConversationMessage.created_at))).all()
    return ConversationDetail(**conversation.model_dump(), messages=[ConversationMessageResponse.model_validate(message) for message in messages])
