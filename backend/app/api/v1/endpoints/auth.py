from fastapi import APIRouter, Cookie, Header, Response, status

from app.api import SessionDep
from app.core.config import settings
from app.repositories import AuthRepository
from app.schemas.auth import (
    ChangePasswordRequest,
    EmailConfirmationRequest,
    ForgotPasswordRequest,
    GoogleLoginRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    RefreshResponse,
    ResendConfirmationRequest,
    ResetPasswordRequest,
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


def get_auth_service(session: SessionDep) -> AuthService:
    return AuthService(AuthRepository(session))


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=SignupResponse)
async def register(payload: SignupRequest, session: SessionDep):
    return await get_auth_service(session).signup(payload)


@router.post("/confirm-email", response_model=MessageResponse)
async def confirm_email(payload: EmailConfirmationRequest, session: SessionDep):
    return await get_auth_service(session).confirm_email(payload.token)


@router.post("/resend-confirmation", response_model=MessageResponse)
async def resend_confirmation(payload: ResendConfirmationRequest, session: SessionDep):
    return await get_auth_service(session).resend_confirmation(str(payload.email))


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, response: Response, session: SessionDep):
    login_response, refresh_token = await get_auth_service(session).login(payload)
    set_refresh_cookie(response, refresh_token)
    return login_response


@router.post("/google", response_model=LoginResponse)
async def google_login(payload: GoogleLoginRequest, response: Response, session: SessionDep):
    login_response, refresh_token = await get_auth_service(session).google_login(payload)
    set_refresh_cookie(response, refresh_token)
    return login_response


@router.post("/refresh", response_model=RefreshResponse)
async def refresh_token(
    response: Response,
    session: SessionDep,
    refresh_token: str | None = Cookie(default=None),
):
    refresh_response, new_refresh_token = await get_auth_service(session).refresh(refresh_token)
    set_refresh_cookie(response, new_refresh_token)
    return refresh_response


@router.get("/me", response_model=UserAuthResponse)
async def get_current_user(
    session: SessionDep,
    authorization: str | None = Header(default=None),
):
    return await get_auth_service(session).get_current_user(authorization)


@router.post("/logout", response_model=MessageResponse)
async def logout(
    response: Response,
    session: SessionDep,
    refresh_token: str | None = Cookie(default=None),
):
    await get_auth_service(session).logout(refresh_token)
    response.delete_cookie(key="refresh_token", path="/auth")
    return MessageResponse(message="Logged out")


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(payload: ForgotPasswordRequest, session: SessionDep):
    return await get_auth_service(session).forgot_password(str(payload.email))


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(payload: ResetPasswordRequest, session: SessionDep):
    return await get_auth_service(session).reset_password(payload.token, payload.new_password)


@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    payload: ChangePasswordRequest,
    session: SessionDep,
    authorization: str | None = Header(default=None),
):
    return await get_auth_service(session).change_password(
        authorization,
        payload.old_password,
        payload.new_password,
    )
