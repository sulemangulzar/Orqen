from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    hash_token,
    verify_access_token,
    verify_password,
)
from app.models import RefreshToken, User
from app.models.enums import UserRole
from app.repositories import AuthRepository
from app.schemas.auth import LoginRequest, LoginResponse, RefreshResponse, SignupRequest, SignupResponse, UserAuthResponse


class AuthService:
    def __init__(self, repository: AuthRepository) -> None:
        self.repository = repository

    def _user_response(self, user: User) -> UserAuthResponse:
        return UserAuthResponse(
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            organization_id=user.organization_id,
            needs_onboarding=user.organization_id is None,
        )

    async def signup(self, payload: SignupRequest) -> SignupResponse:
        existing_user = await self.repository.get_user_by_email(str(payload.email))
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        user = User(
            email=str(payload.email),
            full_name=payload.full_name,
            hashed_password=hash_password(payload.password),
            role=UserRole.OWNER,
        )

        try:
            user = await self.repository.create_user(user)
        except IntegrityError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database schema is outdated. Make users.organization_id nullable before signup without organization.",
            ) from exc

        response = self._user_response(user)
        return SignupResponse(**response.model_dump())

    async def login(self, payload: LoginRequest) -> tuple[LoginResponse, str]:
        user = await self.repository.get_user_by_email(str(payload.email))
        if user is None or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

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

    async def refresh(self, raw_refresh_token: str | None) -> tuple[RefreshResponse, str]:
        if raw_refresh_token is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")

        refresh_token = await self.repository.get_refresh_token(hash_token(raw_refresh_token))
        if refresh_token is None or refresh_token.revoked_at is not None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        if refresh_token.expires_at < datetime.now(timezone.utc):
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
