from fastapi import Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from app.core import get_session
from typing import Annotated


SessionDep = Annotated[AsyncSession, Depends(get_session)]
