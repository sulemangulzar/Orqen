import re
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from app.api.deps import SessionDep, get_current_user
from app.models.collection import KnowledgeCollection
from app.models.membership import OrganizationMembership
from app.models.user import User
from app.schemas.collections import CollectionCreate, CollectionResponse

router = APIRouter(prefix="/collections", tags=["Knowledge collections"])


def normalize(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:140] or "knowledge"


async def manager(session: SessionDep, organization_id: uuid.UUID, user: User):
    result = await session.exec(select(OrganizationMembership).where(OrganizationMembership.organization_id == organization_id, OrganizationMembership.user_id == user.id, OrganizationMembership.status == "active"))
    item = result.first()
    if item is None and user.organization_id != organization_id:
        raise HTTPException(status_code=403, detail="You are not a member of this organization")
    if item is not None and item.role not in {"owner", "admin"}:
        raise HTTPException(status_code=403, detail="Only organization managers can manage collections")


@router.get("/organizations/{organization_id}", response_model=list[CollectionResponse])
async def list_collections(organization_id: uuid.UUID, session: SessionDep, current_user: User = Depends(get_current_user)):
    await manager(session, organization_id, current_user)
    return (await session.exec(select(KnowledgeCollection).where(KnowledgeCollection.organization_id == organization_id))).all()


@router.post("/organizations/{organization_id}", response_model=CollectionResponse, status_code=201)
async def create_collection(organization_id: uuid.UUID, payload: CollectionCreate, session: SessionDep, current_user: User = Depends(get_current_user)):
    await manager(session, organization_id, current_user)
    slug = normalize(payload.slug or payload.name)
    if (await session.exec(select(KnowledgeCollection).where(KnowledgeCollection.organization_id == organization_id, KnowledgeCollection.slug == slug))).first():
        raise HTTPException(status_code=409, detail="Collection slug already exists")
    collection = KnowledgeCollection(organization_id=organization_id, name=payload.name, slug=slug, namespace=f"org-{organization_id}-{slug}")
    session.add(collection)
    await session.commit()
    await session.refresh(collection)
    return collection
