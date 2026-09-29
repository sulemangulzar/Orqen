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
    needs_onboarding: bool


class SignupResponse(UserAuthResponse):
    pass


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(UserAuthResponse):
    access_token: str
    token_type: str = "bearer"


class RefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MessageResponse(BaseModel):
    message: str
