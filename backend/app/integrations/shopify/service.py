import re
import secrets
from urllib.parse import urlencode

from fastapi import HTTPException

from app.core.config import settings

SHOPIFY_SCOPES = [
    "read_products",
    "read_orders",
]

def validate_shop_domain(shop : str) -> str:
    shop = shop.strip().lower()

    pattern = r"^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.myshopify\.com$"

    if not re.match(pattern, shop):
        raise HTTPException(
                    status_code=400,
                    detail="Invalid Shopify shop domain",
                )

    return shop


def generate_authorization_url(
    shop: str,
    state: str,
) -> str:
    shop = validate_shop_domain(shop)

    params = {
        "client_id": settings.shopify_client_id,
        "scope": ",".join(SHOPIFY_SCOPES),
        "redirect_uri": settings.shopify_redirect_uri,
        "state": state,
    }

    return (
        f"https://{shop}/admin/oauth/authorize?"
        f"{urlencode(params)}"
    )


def create_oauth_state() -> str:
    return secrets.token_urlsafe(32)
