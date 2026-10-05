from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete

from app.api.deps import SessionDep, get_current_user
from app.integrations.shopify.models import ShopifyConnection, ShopifyOAuthState
from app.models.user import User
from app.repositories.organization import OrganizationRepository
from app.schemas.organization import OrganizationCreate, OrganizationResponse, OrganizationUpdate
from app.services.organization import OrganizationService


router = APIRouter(tags=["Organizations"], prefix="/organizations")


def get_organization_service(session: SessionDep) -> OrganizationService:
    return OrganizationService(OrganizationRepository(session))


@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    payload: OrganizationCreate | str,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    # Accept old clients that submitted the name as the entire JSON value.
    if isinstance(payload, str):
        payload = OrganizationCreate(name=payload)
    return await get_organization_service(session).create(payload, current_user)


@router.get("/me", response_model=OrganizationResponse)
async def get_my_organization(
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    if current_user.organization_id is None:
        raise HTTPException(status_code=404, detail="User does not belong to an organization")
    organization = await OrganizationRepository(session).get_by_id(current_user.organization_id)
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return organization


@router.patch("/me", response_model=OrganizationResponse)
async def update_my_organization(
    payload: OrganizationUpdate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    if current_user.organization_id is None:
        raise HTTPException(status_code=404, detail="User does not belong to an organization")
    organization = await OrganizationRepository(session).get_by_id(current_user.organization_id)
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return await get_organization_service(session).update(organization, payload, current_user)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_organization(
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    if current_user.organization_id is None:
        raise HTTPException(status_code=404, detail="User does not belong to an organization")
    if current_user.role.value != "owner":
        raise HTTPException(status_code=403, detail="Only the organization owner can delete it")
    organization = await OrganizationRepository(session).get_by_id(current_user.organization_id)
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    await session.exec(
        delete(ShopifyOAuthState).where(
            ShopifyOAuthState.organization_id == organization.id
        )
    )
    await session.exec(
        delete(ShopifyConnection).where(
            ShopifyConnection.organization_id == organization.id
        )
    )
    await session.delete(organization)
    await session.commit()
