from fastapi import APIRouter
from sqlalchemy import text

from app.core.config import settings
from app.core.database import get_engine

router = APIRouter(tags=["Health"])


@router.get("/health/live")
async def liveness():
    return {"status": "ok", "service": settings.app_name}


@router.get("/health/ready")
async def readiness():
    checks = {"database": "not_configured"}
    if settings.database_url:
        try:
            async with get_engine().connect() as connection:
                await connection.execute(text("SELECT 1"))
            checks["database"] = "ok"
        except Exception:
            checks["database"] = "error"
    ready = checks["database"] == "ok"
    return {"status": "ok" if ready else "degraded", "ready": ready, "checks": checks}
