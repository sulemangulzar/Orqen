from dataclasses import dataclass, field
from uuid import UUID

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.integrations.shopify.client import ShopifyAdminClient
from app.integrations.shopify.models import ShopifyConnection
from app.integrations.shopify.service import decrypt_token
from app.core.config import settings
from app.models.document import AssistantDocument
from app.ai.pinecone_utils import index_name


@dataclass
class RetrievedContext:
    text: str
    sources: list[dict[str, str]] = field(default_factory=list)


class ContextRetriever:
    """Retrieval boundary for Shopify and document indexes."""

    def __init__(self, session: AsyncSession | None = None, assistant_id: UUID | None = None):
        self.session = session
        self.assistant_id = assistant_id

    async def retrieve(self, organization_id: UUID, query: str) -> RetrievedContext:
        vector_context = await self._retrieve_documents(organization_id, query)
        if self.session is None:
            return vector_context
        connection = (await self.session.exec(select(ShopifyConnection).where(
            ShopifyConnection.organization_id == organization_id,
            ShopifyConnection.status == "connected",
        ))).first()
        if connection is None:
            return vector_context
        try:
            client = ShopifyAdminClient(connection.shop_domain, connection.access_token_encrypted)
            products = await client.search_products(query)
            orders = await client.find_order(query) if any(term in query.lower() for term in ("order", "delivery", "shipment", "tracking")) else []
        except Exception:
            return vector_context
        lines = []
        sources = []
        for product in products:
            lines.append(f"Product: {product.get('title')} | handle: {product.get('handle')} | status: {product.get('status')}")
            sources.append({"kind": "shopify_product", "title": str(product.get("title", "Product")), "reference": str(product.get("id", ""))})
        for order in orders:
            lines.append(f"Order {order.get('name')}: financial status {order.get('financial_status')}, fulfillment status {order.get('fulfillment_status')}, created {order.get('created_at')}")
            sources.append({"kind": "shopify_order", "title": str(order.get("name", "Order")), "reference": str(order.get("id", ""))})
        combined = "\n".join(part for part in (vector_context.text, "\n".join(lines)) if part)
        return RetrievedContext(text=combined, sources=vector_context.sources + sources)

    async def _retrieve_documents(self, organization_id: UUID, query: str) -> RetrievedContext:
        if not settings.pinecone_api_key or not settings.pinecone_collection or not settings.openai_api_key:
            return RetrievedContext(text="", sources=[])
        published_ids: list[str] | None = None
        if self.session is not None and self.assistant_id is not None:
            links = (await self.session.exec(select(AssistantDocument).where(
                AssistantDocument.assistant_id == self.assistant_id,
                AssistantDocument.is_published == True,
            ))).all()
            published_ids = [str(link.document_id) for link in links]
            if not published_ids:
                return RetrievedContext(text="", sources=[])
        try:
            from langchain_openai import OpenAIEmbeddings
            from langchain_pinecone import PineconeVectorStore
            from pinecone import Pinecone

            embeddings = OpenAIEmbeddings(model=settings.openai_embedding_model, api_key=settings.openai_api_key)
            pinecone = Pinecone(api_key=settings.pinecone_api_key)
            index = pinecone.Index(index_name(settings.pinecone_collection))
            store = PineconeVectorStore(index=index, embedding=embeddings, namespace=str(organization_id))
            metadata_filter = {"document_id": {"$in": published_ids}} if published_ids is not None else None
            matches = await store.asimilarity_search_with_score(query, k=settings.rag_top_k, filter=metadata_filter)
        except (ImportError, Exception):
            return RetrievedContext(text="", sources=[])

        lines = []
        sources = []
        for document, score in matches:
            lines.append(document.page_content)
            metadata = document.metadata or {}
            sources.append({
                "kind": "document",
                "title": str(metadata.get("filename", "Support document")),
                "reference": str(metadata.get("document_id", "")),
            })
        return RetrievedContext(text="\n\n".join(lines), sources=sources)
