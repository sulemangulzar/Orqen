
import hashlib
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

from app.api.deps import SessionDep
from app.integrations.shopify.models import (
    ShopifyConnection,
    ShopifyOAuthState,
)
from app.integrations.shopify.schemas import (
    ShopifyConnectRequest,
    ShopifyConnectResponse,
)
from app.integrations.shopify.service import (
    create_oauth_state,
    generate_authorization_url,
    validate_shop_domain,
)
from app.api.deps import get_current_user
from app.models.enums import UserRole
from app.models.user import User


router = APIRouter(
    prefix="/integrations/shopify",
    tags=["Shopify"],
)


@router.post(
    "/connect",
    response_model=ShopifyConnectResponse,
)
async def connect_shopify(
    data: ShopifyConnectRequest,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    if current_user.organization_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User must belong to an organization",
        )

    if current_user.role not in {UserRole.OWNER, UserRole.ADMIN}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    shop = validate_shop_domain(data.shop_domain)

    existing = (
        await session.exec(
            select(ShopifyConnection).where(ShopifyConnection.shop_domain == shop)
        )
    ).first()

    if existing:
        if existing.organization_id != current_user.organization_id:
            raise HTTPException(
                status_code=409,
                detail="Store belongs to another organization",
            )

        if existing.status == "connected":
            raise HTTPException(
                status_code=409,
                detail="Store is already connected",
            )

    state = create_oauth_state()

    state_hash = hashlib.sha256(
        state.encode()
    ).hexdigest()

    oauth_state = ShopifyOAuthState(
        state_hash=state_hash,
        organization_id=current_user.organization_id,
        shop_domain=shop,
        expires_at=(
            datetime.now(timezone.utc)
            + timedelta(minutes=10)
        ),
    )

    session.add(oauth_state)
    await session.commit()

    authorization_url = generate_authorization_url(
        shop=shop,
        state=state,
    )

    return ShopifyConnectResponse(
        authorization_url=authorization_url,
    )
