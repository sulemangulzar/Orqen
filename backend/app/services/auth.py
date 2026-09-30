import json
from datetime import datetime, timedelta, timezone
from urllib.parse import quote
from urllib.request import urlopen

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_plain_token,
    create_refresh_token,
    hash_password,
    hash_token,
    verify_access_token,
    verify_password,
)
from app.models import RefreshToken, User
from app.models.enums import AuthProvider, UserRole
from app.repositories import AuthRepository
from app.schemas.auth import (
    GoogleLoginRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    RefreshResponse,
    SignupRequest,
    SignupResponse,
    UserAuthResponse,
)
from app.services.email import EmailService


class AuthService:
    def __init__(self, repository: AuthRepository) -> None:
        self.repository = repository
        self.email_service = EmailService()

    def _user_response(self, user: User) -> UserAuthResponse:
        return UserAuthResponse(
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            organization_id=user.organization_id,
            is_verified=user.is_verified,
            needs_onboarding=user.organization_id is None,
        )

    def _is_expired(self, value: datetime | None) -> bool:
        if value is None:
            return True
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value < datetime.now(timezone.utc)

    async def _issue_session(self, user: User) -> tuple[LoginResponse, str]:
        raw_refresh_token = create_refresh_token()
        refresh_token = RefreshToken(
            user_id=user.id,
            token_hash=hash_token(raw_refresh_token),
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_days),
        )
        await self.repository.create_refresh_token(refresh_token)

        user_data = self._user_response(user).model_dump()
        return LoginResponse(
            access_token=create_access_token(user.id),
            **user_data,
        ), raw_refresh_token

    async def signup(self, payload: SignupRequest) -> SignupResponse:
        existing_user = await self.repository.get_user_by_email(str(payload.email))
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        verification_token = create_plain_token()
        user = User(
            email=str(payload.email),
            full_name=payload.full_name,
            hashed_password=hash_password(payload.password),
            role=UserRole.OWNER,
            auth_provider=AuthProvider.EMAIL,
            is_verified=False,
            email_verification_token_hash=hash_token(verification_token),
            email_verification_expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
        )

        try:
            user = await self.repository.create_user(user)
        except IntegrityError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not create account",
            ) from exc

        await self.email_service.send_email_verification(user.email, verification_token)
        response = self._user_response(user)
        return SignupResponse(**response.model_dump())

    async def confirm_email(self, token: str) -> MessageResponse:
        user = await self.repository.get_user_by_email_verification_token(hash_token(token))
        if user is None or self._is_expired(user.email_verification_expires_at):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

        user.is_verified = True
        user.email_verification_token_hash = None
        user.email_verification_expires_at = None
        user.updated_at = datetime.now(timezone.utc)
        await self.repository.save_user(user)
        return MessageResponse(message="Email confirmed. You can log in now.")

    async def resend_confirmation(self, email: str) -> MessageResponse:
        user = await self.repository.get_user_by_email(email)
        if user is None or user.is_verified:
            return MessageResponse(message="If the account exists, a confirmation email was sent")

        token = create_plain_token()
        user.email_verification_token_hash = hash_token(token)
        user.email_verification_expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
        user.updated_at = datetime.now(timezone.utc)
        await self.repository.save_user(user)
        await self.email_service.send_email_verification(user.email, token)
        return MessageResponse(message="If the account exists, a confirmation email was sent")

    async def login(self, payload: LoginRequest) -> tuple[LoginResponse, str]:
        user = await self.repository.get_user_by_email(str(payload.email))
        if user is None or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is inactive")

        if not user.is_verified:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Please confirm your email before logging in")

        return await self._issue_session(user)

    async def google_login(self, payload: GoogleLoginRequest) -> tuple[LoginResponse, str]:
        google_user = self._verify_google_id_token(payload.id_token)
        provider_id = google_user["sub"]
        email = google_user["email"]
        full_name = google_user.get("name")

        user = await self.repository.get_user_by_provider(AuthProvider.GOOGLE.value, provider_id)
        if user is None:
            user = await self.repository.get_user_by_email(email)

        if user is None:
            user = User(
                email=email,
                full_name=full_name,
                role=UserRole.OWNER,
                auth_provider=AuthProvider.GOOGLE,
                provider_id=provider_id,
                is_verified=True,
            )
            user = await self.repository.create_user(user)
        else:
            user.auth_provider = AuthProvider.GOOGLE
            user.provider_id = provider_id
            user.is_verified = True
            user.updated_at = datetime.now(timezone.utc)
            user = await self.repository.save_user(user)

        return await self._issue_session(user)

    def _verify_google_id_token(self, id_token: str) -> dict:
        if settings.google_client_id is None:
            raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Google auth is not configured")

        try:
            with urlopen(f"https://oauth2.googleapis.com/tokeninfo?id_token={quote(id_token)}", timeout=10) as response:
                data = json.loads(response.read())
        except Exception as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token") from exc

        if data.get("aud") != settings.google_client_id or data.get("email_verified") != "true":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")

        return data

    async def refresh(self, raw_refresh_token: str | None) -> tuple[RefreshResponse, str]:
        if raw_refresh_token is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")

        refresh_token = await self.repository.get_refresh_token(hash_token(raw_refresh_token))
        if refresh_token is None or refresh_token.revoked_at is not None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        if self._is_expired(refresh_token.expires_at):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

        user = await self.repository.get_user_by_id(refresh_token.user_id)
        if user is None or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

        await self.repository.revoke_refresh_token(refresh_token)

        new_raw_refresh_token = create_refresh_token()
        new_refresh_token = RefreshToken(
            user_id=user.id,
            token_hash=hash_token(new_raw_refresh_token),
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_days),
        )
        await self.repository.create_refresh_token(new_refresh_token)

        return RefreshResponse(access_token=create_access_token(user.id)), new_raw_refresh_token

    async def get_current_user(self, access_token: str | None) -> UserAuthResponse:
        if access_token is None or not access_token.startswith("Bearer "):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing access token")

        user_id = verify_access_token(access_token.removeprefix("Bearer ").strip())
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")

        user = await self.repository.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

        return self._user_response(user)

    async def logout(self, raw_refresh_token: str | None) -> None:
        if raw_refresh_token is None:
            return

        refresh_token = await self.repository.get_refresh_token(hash_token(raw_refresh_token))
        if refresh_token is not None and refresh_token.revoked_at is None:
            await self.repository.revoke_refresh_token(refresh_token)

    async def forgot_password(self, email: str) -> MessageResponse:
        user = await self.repository.get_user_by_email(email)
        if user is None:
            return MessageResponse(message="If the account exists, a reset email was sent")

        token = create_plain_token()
        user.password_reset_token_hash = hash_token(token)
        user.password_reset_expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
        user.updated_at = datetime.now(timezone.utc)
        await self.repository.save_user(user)
        await self.email_service.send_password_reset(user.email, token)
        return MessageResponse(message="If the account exists, a reset email was sent")

    async def reset_password(self, token: str, new_password: str) -> MessageResponse:
        user = await self.repository.get_user_by_password_reset_token(hash_token(token))
        if user is None or self._is_expired(user.password_reset_expires_at):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

        user.hashed_password = hash_password(new_password)
        user.password_reset_token_hash = None
        user.password_reset_expires_at = None
        user.auth_provider = AuthProvider.EMAIL
        user.updated_at = datetime.now(timezone.utc)
        await self.repository.save_user(user)
        return MessageResponse(message="Password reset successful")

    async def change_password(self, access_token: str | None, old_password: str, new_password: str) -> MessageResponse:
        current_user = await self.get_current_user(access_token)
        user = await self.repository.get_user_by_id(current_user.user_id)
        if user is None or not verify_password(old_password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid old password")

        user.hashed_password = hash_password(new_password)
        user.updated_at = datetime.now(timezone.utc)
        await self.repository.save_user(user)
        return MessageResponse(message="Password changed")
