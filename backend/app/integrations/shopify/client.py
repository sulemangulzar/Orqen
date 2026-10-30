import asyncio
import json
from urllib.request import Request, urlopen

from app.core.config import settings
from app.integrations.shopify.service import decrypt_token


class ShopifyAdminClient:
    def __init__(self, shop_domain: str, encrypted_token: str):
        self.shop_domain = shop_domain
        self.token = decrypt_token(encrypted_token)

    async def _get(self, path: str, params: str = "") -> dict:
        url = f"https://{self.shop_domain}/admin/api/{settings.shopify_api_version}/{path}.json"
        if params:
            url += f"?{params}"
        request = Request(url, headers={"X-Shopify-Access-Token": self.token, "Accept": "application/json"})

        def fetch() -> dict:
            with urlopen(request, timeout=15) as response:
                return json.loads(response.read())

        return await asyncio.to_thread(fetch)

    async def search_products(self, query: str) -> list[dict]:
        data = await self._get("products", "status=active&limit=20")
        terms = {term.lower() for term in query.split() if len(term) > 2}
        products = data.get("products", [])
        if not terms:
            return products[:10]
        return [p for p in products if terms & {str(p.get("title", "")).lower(), str(p.get("handle", "")).lower()}][:10]

    async def find_order(self, query: str) -> list[dict]:
        data = await self._get("orders", "status=any&limit=20&fields=id,name,email,financial_status,fulfillment_status,created_at")
        terms = {term.lower() for term in query.split() if len(term) > 2}
        return [o for o in data.get("orders", []) if not terms or any(term in str(o).lower() for term in terms)][:10]
