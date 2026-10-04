
from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


def utc_now():
    return datetime.now(timezone.utc)


class ShopifyConnection(SQLModel, table=True):
    __tablename__ = "shopify_connections"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    organization_id: UUID = Field(foreign_key="organizations.id", index=True)

    shop_domain: str = Field(unique=True, index=True)
    shopify_shop_id: str | None = None

    access_token_encrypted: str
    refresh_token_encrypted: str

    access_token_expires_at: datetime
    refresh_token_expires_at: datetime

    scopes: str
    status: str = "connected"

    created_at: datetime = Field(default_factory=utc_now)


class ShopifyOAuthState(SQLModel, table=True):
    __tablename__ = "shopify_oauth_states"

    state_hash: str = Field(primary_key=True)

    organization_id: UUID = Field(foreign_key="organizations.id")
    shop_domain: str

    expires_at: datetime
    consumed_at: datetime | None = None
