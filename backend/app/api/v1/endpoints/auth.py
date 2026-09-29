from fastapi import APIRouter, Cookie, Header, Response, status
from pydantic import BaseModel, EmailStr

from app.api import SessionDep
from app.core.config import settings
from app.repositories import AuthRepository
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    MessageResponse,
    RefreshResponse,
    SignupRequest,
    SignupResponse,
    UserAuthResponse,
)
from app.services import AuthService

router = APIRouter(tags=["Authentication"], prefix="/auth")


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.refresh_token_days * 24 * 60 * 60,
        path="/auth",
    )


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str


class EmailConfirmationRequest(BaseModel):
    token: str


class ResendConfirmationRequest(BaseModel):
    email: EmailStr


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=SignupResponse)
async def register(payload: SignupRequest, session: SessionDep):
    repository = AuthRepository(session)
    service = AuthService(repository)
    return await service.signup(payload)


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, response: Response, session: SessionDep):
    repository = AuthRepository(session)
    service = AuthService(repository)
    login_response, refresh_token = await service.login(payload)
    set_refresh_cookie(response, refresh_token)
    return login_response


@router.post("/refresh", response_model=RefreshResponse)
async def refresh_token(
    response: Response,
    session: SessionDep,
    refresh_token: str | None = Cookie(default=None),
):
    repository = AuthRepository(session)
    service = AuthService(repository)
    refresh_response, new_refresh_token = await service.refresh(refresh_token)
    set_refresh_cookie(response, new_refresh_token)
    return refresh_response


@router.get("/me", response_model=UserAuthResponse)
async def get_current_user(
    session: SessionDep,
    authorization: str | None = Header(default=None),
):
    repository = AuthRepository(session)
    service = AuthService(repository)
    return await service.get_current_user(authorization)


@router.post("/logout", response_model=MessageResponse)
async def logout(
    response: Response,
    session: SessionDep,
    refresh_token: str | None = Cookie(default=None),
):
    repository = AuthRepository(session)
    service = AuthService(repository)
    await service.logout(refresh_token)
    response.delete_cookie(key="refresh_token", path="/auth")
    return MessageResponse(message="Logged out")


@router.post("/confirm-email")
async def confirm_email(payload: EmailConfirmationRequest):
    pass


@router.post("/resend-confirmation")
async def resend_confirmation(payload: ResendConfirmationRequest):
    pass


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    pass


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    pass


@router.post("/change-password")
async def change_password(payload: ChangePasswordRequest):
    pass
