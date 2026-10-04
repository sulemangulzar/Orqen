from pydantic import BaseModel


class ShopifyConnectRequest(BaseModel):
    shop_domain: str


class ShopifyConnectResponse(BaseModel):
    authorization_url: str
