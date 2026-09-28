from fastapi import APIRouter, status
from pydantic import BaseModel, EmailStr

router = APIRouter(tags=["Authentication"], prefix="/auth")

# --- Schemas ---


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



@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register():
  """Create user and initial company organization."""
  pass


@router.post("/login")
async def login():
  """Authenticate and return access + refresh tokens."""
  pass


@router.post("/refresh")
async def refresh_token():
  """Exchange a valid refresh token for a new access token."""
  pass


@router.get("/me")
async def get_current_user():
  """Return profile of the authenticated user."""
  pass


@router.post("/logout")
async def logout():
  """Revoke the current session/refresh token in Redis."""
  pass


# --- Email Verification Flow ---


@router.post("/confirm-email")
async def confirm_email(payload: EmailConfirmationRequest):
  """Verify account email via incoming token."""
  pass


@router.post("/resend-confirmation")
async def resend_confirmation(payload: ResendConfirmationRequest):
  """Resend the email verification link."""
  pass


# --- Password Management Flow ---


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
  """Trigger a reset token email.

  Always returns 200 OK even if email does not exist to prevent enumeration
  attacks.
  """
  pass


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
  """Accepts the reset token and updates the password."""
  pass


@router.post("/change-password")
async def change_password(payload: ChangePasswordRequest):
  """Allows an authenticated user to change their password using their current password."""
  pass
