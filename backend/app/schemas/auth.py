from uuid import UUID

from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserAuthResponse(BaseModel):
    user_id: UUID
    email: EmailStr
    full_name: str | None
    organization_id: UUID | None
    is_verified: bool
    needs_onboarding: bool


class SignupResponse(UserAuthResponse):
    pass


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(UserAuthResponse):
    access_token: str
    token_type: str = "bearer"


class GoogleLoginRequest(BaseModel):
    id_token: str


class RefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class EmailConfirmationRequest(BaseModel):
    token: str


class ResendConfirmationRequest(BaseModel):
    email: EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str


class MessageResponse(BaseModel):
    message: str
