from fastapi import FastAPI

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.user import router as user_router

from app.core.config import settings

app = FastAPI(
    title=settings.app_name, version="0.1.0", description="AI Operation Copilot",
)

app.include_router(auth_router)
app.include_router(user_router)



@app.get("/", tags=["Health"])
def health():
    return {"message": settings.app_name + " is Running"}
