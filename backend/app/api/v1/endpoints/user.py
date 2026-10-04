import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete
from sqlmodel import select

from app.api.deps import SessionDep, get_current_user
from app.integrations.shopify.models import ShopifyConnection, ShopifyOAuthState
from app.models.invitation import Invitation
from app.models.organization import Organization
from app.models.refresh_token import RefreshToken
from app.models.user import User

router = APIRouter(tags=["Users"], prefix="/users")


@router.patch("/{user_id}")
async def update_user(user_id: uuid.UUID):
  """Partial update for user profile attributes."""
  pass


@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user(
    user_id: uuid.UUID,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    """Delete the authenticated user and clean up owned resources."""
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Users can only delete their own account",
        )

    organization_id = current_user.organization_id

    if organization_id is not None:
        members = (
            await session.exec(select(User).where(User.organization_id == organization_id))
        ).all()
        is_last_member = len(members) == 1
    else:
        is_last_member = False

    await session.exec(delete(RefreshToken).where(RefreshToken.user_id == current_user.id))

    if is_last_member and organization_id is not None:
        await session.exec(
            delete(ShopifyOAuthState).where(
                ShopifyOAuthState.organization_id == organization_id
            )
        )
        await session.exec(
            delete(ShopifyConnection).where(
                ShopifyConnection.organization_id == organization_id
            )
        )
        await session.exec(
            delete(Invitation).where(Invitation.organization_id == organization_id)
        )

    await session.delete(current_user)

    if is_last_member and organization_id is not None:
        organization = await session.get(Organization, organization_id)
        if organization is not None:
            await session.delete(organization)

    await session.commit()
    return {"message": "User and associated resources deleted"}

@router.post("/invitations/accept")
async def accept_invite(user_id: uuid.UUID):
  pass
