from pydantic import BaseModel


class ShopifyConnectRequest(BaseModel):
    shop_domain: str


class ShopifyConnectResponse(BaseModel):
    authorization_url: str


class ShopifyStatusResponse(BaseModel):
    connected: bool
    shop_domain: str | None = None
    status: str | None = None
    scopes: str | None = None
