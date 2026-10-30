from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.user import router as user_router
from app.api.v1.endpoints.organization import router as organization_router
from app.integrations.shopify.router import callback_router as shopify_callback_router
from app.integrations.shopify.router import router as shopify_router
from app.api.v1.endpoints.product import router as product_router
from app.api.v1.endpoints.support import router as support_router
from app.api.v1.endpoints.documents import router as documents_router
from app.api.v1.endpoints.public_chat import router as public_chat_router
from app.api.v1.endpoints.conversations import router as conversations_router
from app.api.v1.endpoints.collections import router as collections_router
from app.api.health import router as health_router

from app.core.config import settings

app = FastAPI(
    title=settings.app_name, version="0.1.0", description="AI Operation Copilot",
)

allowed_origins = list(
    dict.fromkeys(
        [
            settings.frontend_url,
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    )
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(organization_router)
app.include_router(shopify_router)
app.include_router(shopify_callback_router)
app.include_router(product_router, prefix="/api/v1")
app.include_router(support_router, prefix="/api/v1")
app.include_router(documents_router, prefix="/api/v1")
app.include_router(public_chat_router, prefix="/api/v1")
app.include_router(conversations_router, prefix="/api/v1")
app.include_router(collections_router, prefix="/api/v1")
app.include_router(health_router)


@app.get("/scalar", include_in_schema=False)
async def scalar_docs():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=f"{settings.app_name} API Reference",
    )



@app.get("/", tags=["Health"])
def health():
    return {"message": settings.app_name + " is Running"}
