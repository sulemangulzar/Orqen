
import hashlib
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlmodel import select

from app.api.deps import SessionDep
from app.integrations.shopify.models import (
    ShopifyConnection,
    ShopifyOAuthState,
)
from app.integrations.shopify.schemas import (
    ShopifyConnectRequest,
    ShopifyConnectResponse,
    ShopifyStatusResponse,
)
from app.integrations.shopify.service import (
    create_oauth_state,
    generate_authorization_url,
    encrypt_token,
    exchange_code_for_token,
    token_expiry,
    SHOPIFY_SCOPES,
    validate_shop_domain,
)
from app.api.deps import get_current_user
from app.core.config import settings
from app.models.enums import UserRole
from app.models.user import User


router = APIRouter(
    prefix="/integrations/shopify",
    tags=["Shopify"],
)
callback_router = APIRouter(prefix="/shopify", tags=["Shopify"])


@router.get("/status", response_model=ShopifyStatusResponse)
async def shopify_status(
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    if current_user.organization_id is None:
        return ShopifyStatusResponse(connected=False)
    connection = (
        await session.exec(
            select(ShopifyConnection).where(
                ShopifyConnection.organization_id == current_user.organization_id,
                ShopifyConnection.status == "connected",
            )
        )
    ).first()
    if connection is None:
        return ShopifyStatusResponse(connected=False)
    return ShopifyStatusResponse(
        connected=True,
        shop_domain=connection.shop_domain,
        status=connection.status,
        scopes=connection.scopes,
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


@callback_router.get("/callback", include_in_schema=False)
async def shopify_callback(
    code: str,
    shop: str,
    state: str,
    session: SessionDep,
):
    shop = validate_shop_domain(shop)
    state_hash = hashlib.sha256(state.encode()).hexdigest()
    oauth_state = await session.get(ShopifyOAuthState, state_hash)
    if oauth_state is None or oauth_state.consumed_at is not None or oauth_state.shop_domain != shop:
        raise HTTPException(status_code=400, detail="Invalid Shopify OAuth state")
    if oauth_state.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Expired Shopify OAuth state")

    token_data = exchange_code_for_token(shop, code)
    expires_at = token_expiry()
    connection = (
        await session.exec(
            select(ShopifyConnection).where(ShopifyConnection.shop_domain == shop)
        )
    ).first()
    if connection is None:
        connection = ShopifyConnection(
            organization_id=oauth_state.organization_id,
            shop_domain=shop,
            access_token_encrypted=encrypt_token(token_data["access_token"]),
            refresh_token_encrypted=encrypt_token(""),
            access_token_expires_at=expires_at,
            refresh_token_expires_at=expires_at,
            scopes=token_data.get("scope", ",".join(SHOPIFY_SCOPES)),
        )
        session.add(connection)
    else:
        connection.access_token_encrypted = encrypt_token(token_data["access_token"])
        connection.status = "connected"
        connection.access_token_expires_at = expires_at
        connection.scopes = token_data.get("scope", connection.scopes)

    oauth_state.consumed_at = datetime.now(timezone.utc)
    session.add(oauth_state)
    await session.commit()
    return RedirectResponse(url=f"{settings.frontend_url}/dashboard?shopify=connected", status_code=303)
