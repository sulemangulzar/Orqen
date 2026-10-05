import re
import secrets
import json
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from fastapi import HTTPException
from cryptography.fernet import Fernet

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


def encrypt_token(token: str) -> str:
    return Fernet(settings.shopify_token_encryption_key.encode()).encrypt(token.encode()).decode()


def exchange_code_for_token(shop: str, code: str) -> dict:
    payload = json.dumps({
        "client_id": settings.shopify_client_id,
        "client_secret": settings.shopify_client_secret,
        "code": code,
    }).encode()
    request = Request(
        f"https://{shop}/admin/oauth/access_token",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=15) as response:
            data = json.loads(response.read())
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Shopify token exchange failed") from exc

    access_token = data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=502, detail="Shopify did not return an access token")
    return data


def token_expiry() -> datetime:
    return datetime.now(timezone.utc) + timedelta(days=365)
