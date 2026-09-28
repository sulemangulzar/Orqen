from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncEngine, async_sessionmaker, create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings

engine: AsyncEngine | None = None
AsyncSessionFactory: async_sessionmaker[AsyncSession] | None = None


def get_engine() -> AsyncEngine:
    global engine

    if settings.database_url is None:
        raise RuntimeError("DATABASE_URL is not configured. Add it to backend/.env before using the database.")

    if engine is None:
        engine = create_async_engine(
            settings.database_url,
            echo=True,
            future=True,
            pool_size=10,
            max_overflow=5,
            pool_pre_ping=True,
        )

    return engine


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    global AsyncSessionFactory

    if AsyncSessionFactory is None:
        AsyncSessionFactory = async_sessionmaker(
            bind=get_engine(), class_=AsyncSession, expire_on_commit=False
        )

    return AsyncSessionFactory


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with get_session_factory()() as session:
        yield session
