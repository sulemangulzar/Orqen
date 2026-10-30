import re
import secrets
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

from app.api.deps import SessionDep, get_current_user
from app.models.assistant import Assistant
from app.models.document import Document, AssistantDocument
from app.models.enums import UserRole
from app.models.invitation import Invitation
from app.models.membership import OrganizationMembership
from app.models.user import User
from app.schemas.product import (
    AssistantCreate, AssistantResponse, AssistantUpdate, DocumentCreate, DocumentResponse,
    InvitationCreate, InvitationResponse, MembershipResponse,
)

router = APIRouter(tags=["Product"])


async def membership(session: SessionDep, user: User, organization_id: uuid.UUID) -> OrganizationMembership:
    result = await session.exec(select(OrganizationMembership).where(
        OrganizationMembership.organization_id == organization_id,
        OrganizationMembership.user_id == user.id,
        OrganizationMembership.status == "active",
    ))
    item = result.first()
    if item is None:
        # Preserve access for organizations created before memberships were introduced.
        if user.organization_id == organization_id:
            item = OrganizationMembership(organization_id=organization_id, user_id=user.id, role=user.role.value)
            session.add(item)
            await session.commit()
            await session.refresh(item)
        else:
            raise HTTPException(status_code=403, detail="You are not a member of this organization")
    return item


def require_manager(item: OrganizationMembership) -> None:
    if item.role not in {UserRole.OWNER.value, UserRole.ADMIN.value}:
        raise HTTPException(status_code=403, detail="Insufficient permissions")


def slugify(value: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return value[:150] or secrets.token_urlsafe(8).lower()


@router.get("/organizations/{organization_id}/members", response_model=list[MembershipResponse])
async def list_members(organization_id: uuid.UUID, session: SessionDep, current_user: User = Depends(get_current_user)):
    await membership(session, current_user, organization_id)
    result = await session.exec(select(OrganizationMembership).where(OrganizationMembership.organization_id == organization_id))
    return result.all()


@router.post("/organizations/{organization_id}/invitations", response_model=InvitationResponse, status_code=201)
async def create_invitation(organization_id: uuid.UUID, payload: InvitationCreate, session: SessionDep, current_user: User = Depends(get_current_user)):
    item = await membership(session, current_user, organization_id)
    require_manager(item)
    invitation = Invitation(organization_id=organization_id, email=str(payload.email).lower(), role=payload.role, token=secrets.token_urlsafe(32))
    session.add(invitation)
    await session.commit()
    await session.refresh(invitation)
    return invitation


@router.post("/invitations/{token}/accept", response_model=MembershipResponse)
async def accept_invitation(token: str, session: SessionDep, current_user: User = Depends(get_current_user)):
    result = await session.exec(select(Invitation).where(Invitation.token == token))
    invitation = result.first()
    if invitation is None or invitation.status != "pending" or invitation.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired invitation")
    if invitation.email.lower() != current_user.email.lower():
        raise HTTPException(status_code=403, detail="Invitation email does not match the current account")
    existing = await session.exec(select(OrganizationMembership).where(OrganizationMembership.organization_id == invitation.organization_id, OrganizationMembership.user_id == current_user.id))
    membership_item = existing.first() or OrganizationMembership(organization_id=invitation.organization_id, user_id=current_user.id, role=invitation.role)
    membership_item.status = "active"
    session.add(membership_item)
    invitation.status = "accepted"
    session.add(invitation)
    await session.commit()
    await session.refresh(membership_item)
    return membership_item


@router.post("/organizations/{organization_id}/assistants", response_model=AssistantResponse, status_code=201)
async def create_assistant(organization_id: uuid.UUID, payload: AssistantCreate, session: SessionDep, current_user: User = Depends(get_current_user)):
    item = await membership(session, current_user, organization_id)
    require_manager(item)
    slug = slugify(payload.public_slug or payload.title)
    if (await session.exec(select(Assistant).where(Assistant.public_slug == slug))).first():
        raise HTTPException(status_code=409, detail="Assistant slug is already in use")
    selected_ids = list(dict.fromkeys(payload.document_ids))
    documents = (await session.exec(select(Document).where(
        Document.organization_id == organization_id,
        Document.id.in_(selected_ids),
    ))).all() if selected_ids else []
    if len(documents) != len(selected_ids):
        raise HTTPException(status_code=400, detail="One or more selected documents do not belong to this organization")
    not_ready = [document.filename for document in documents if document.state != "indexed"]
    if not_ready:
        raise HTTPException(status_code=409, detail=f"These documents are not indexed yet: {', '.join(not_ready)}")
    assistant = Assistant(organization_id=organization_id, public_slug=slug, **payload.model_dump(exclude={"public_slug", "document_ids"}))
    session.add(assistant)
    await session.commit()
    await session.refresh(assistant)
    for document in documents:
        session.add(AssistantDocument(assistant_id=assistant.id, document_id=document.id, is_published=True, published_at=datetime.now(timezone.utc)))
    await session.commit()
    return {**assistant.model_dump(), "document_ids": selected_ids}


@router.get("/organizations/{organization_id}/assistants", response_model=list[AssistantResponse])
async def list_assistants(organization_id: uuid.UUID, session: SessionDep, current_user: User = Depends(get_current_user)):
    await membership(session, current_user, organization_id)
    assistants = (await session.exec(select(Assistant).where(Assistant.organization_id == organization_id))).all()
    response = []
    for assistant in assistants:
        links = (await session.exec(select(AssistantDocument).where(AssistantDocument.assistant_id == assistant.id, AssistantDocument.is_published == True))).all()
        response.append({**assistant.model_dump(), "document_ids": [link.document_id for link in links]})
    return response


@router.patch("/organizations/{organization_id}/assistants/{assistant_id}", response_model=AssistantResponse)
async def update_assistant(organization_id: uuid.UUID, assistant_id: uuid.UUID, payload: AssistantUpdate, session: SessionDep, current_user: User = Depends(get_current_user)):
    item = await membership(session, current_user, organization_id)
    require_manager(item)
    assistant = await session.get(Assistant, assistant_id)
    if assistant is None or assistant.organization_id != organization_id:
        raise HTTPException(status_code=404, detail="Assistant not found")
    data = payload.model_dump(exclude_unset=True)
    selected_ids = data.pop("document_ids", None)
    if selected_ids is not None:
        selected_ids = list(dict.fromkeys(selected_ids))
        documents = (await session.exec(select(Document).where(Document.organization_id == organization_id, Document.id.in_(selected_ids)))).all() if selected_ids else []
        if len(documents) != len(selected_ids):
            raise HTTPException(status_code=400, detail="One or more selected documents do not belong to this organization")
        if any(document.state != "indexed" for document in documents):
            raise HTTPException(status_code=409, detail="Only indexed documents can be linked to an assistant")
        existing = (await session.exec(select(AssistantDocument).where(AssistantDocument.assistant_id == assistant.id))).all()
        for link in existing:
            if link.document_id not in selected_ids:
                await session.delete(link)
        existing_ids = {link.document_id for link in existing}
        for document_id in selected_ids:
            if document_id not in existing_ids:
                session.add(AssistantDocument(assistant_id=assistant.id, document_id=document_id, is_published=True, published_at=datetime.now(timezone.utc)))
    for key, value in data.items():
        if key == "public_slug" and value is not None:
            value = slugify(value)
        if value is not None:
            setattr(assistant, key, value)
    assistant.updated_at = datetime.now(timezone.utc)
    session.add(assistant)
    await session.commit()
    await session.refresh(assistant)
    return assistant


@router.post("/organizations/{organization_id}/assistants/{assistant_id}/publish", response_model=AssistantResponse)
async def publish_assistant(organization_id: uuid.UUID, assistant_id: uuid.UUID, session: SessionDep, current_user: User = Depends(get_current_user)):
    item = await membership(session, current_user, organization_id)
    require_manager(item)
    assistant = await session.get(Assistant, assistant_id)
    if assistant is None or assistant.organization_id != organization_id:
        raise HTTPException(status_code=404, detail="Assistant not found")
    assistant.status = "published"
    session.add(assistant)
    await session.commit()
    await session.refresh(assistant)
    return assistant


@router.post("/organizations/{organization_id}/documents", response_model=DocumentResponse, status_code=201)
async def create_document(organization_id: uuid.UUID, payload: DocumentCreate, session: SessionDep, current_user: User = Depends(get_current_user)):
    item = await membership(session, current_user, organization_id)
    require_manager(item)
    document = Document(organization_id=organization_id, uploaded_by=current_user.id, **payload.model_dump())
    session.add(document)
    await session.commit()
    await session.refresh(document)
    return document


@router.get("/organizations/{organization_id}/documents", response_model=list[DocumentResponse])
async def list_documents(organization_id: uuid.UUID, session: SessionDep, current_user: User = Depends(get_current_user)):
    await membership(session, current_user, organization_id)
    return (await session.exec(select(Document).where(Document.organization_id == organization_id))).all()


@router.post("/organizations/{organization_id}/assistants/{assistant_id}/documents/{document_id}/publish", response_model=DocumentResponse)
async def publish_document(organization_id: uuid.UUID, assistant_id: uuid.UUID, document_id: uuid.UUID, session: SessionDep, current_user: User = Depends(get_current_user)):
    item = await membership(session, current_user, organization_id)
    require_manager(item)
    assistant = await session.get(Assistant, assistant_id)
    document = await session.get(Document, document_id)
    if assistant is None or document is None or assistant.organization_id != organization_id or document.organization_id != organization_id:
        raise HTTPException(status_code=404, detail="Assistant or document not found")
    if document.state != "indexed":
        raise HTTPException(status_code=409, detail="Document must be indexed before publishing")
    link = await session.get(AssistantDocument, (assistant_id, document_id))
    if link is None:
        link = AssistantDocument(assistant_id=assistant_id, document_id=document_id)
    link.is_published = True
    link.published_at = datetime.now(timezone.utc)
    session.add(link)
    await session.commit()
    await session.refresh(document)
    return document


@router.post("/organizations/{organization_id}/assistants/{assistant_id}/documents/{document_id}/unpublish", response_model=DocumentResponse)
async def unpublish_document(organization_id: uuid.UUID, assistant_id: uuid.UUID, document_id: uuid.UUID, session: SessionDep, current_user: User = Depends(get_current_user)):
    item = await membership(session, current_user, organization_id)
    require_manager(item)
    link = await session.get(AssistantDocument, (assistant_id, document_id))
    if link is None:
        raise HTTPException(status_code=404, detail="Published document link not found")
    session.delete(link)
    await session.commit()
    document = await session.get(Document, document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document
