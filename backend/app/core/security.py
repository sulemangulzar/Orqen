import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError

from app.core.config import settings

password_hasher = PasswordHasher()
JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, hashed_password: str | None) -> bool:
    if hashed_password is None:
        return False

    # temporary support for old local SHA-256 hashes created before Argon2
    if len(hashed_password) == 64:
        return hashlib.sha256(password.encode("utf-8")).hexdigest() == hashed_password

    try:
        return password_hasher.verify(hashed_password, password)
    except (VerifyMismatchError, VerificationError):
        return False


def password_needs_rehash(hashed_password: str | None) -> bool:
    if hashed_password is None:
        return False
    if len(hashed_password) == 64:
        return True
    try:
        return password_hasher.check_needs_rehash(hashed_password)
    except Exception:
        return True


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_plain_token() -> str:
    return secrets.token_urlsafe(48)


def create_refresh_token() -> str:
    return secrets.token_urlsafe(64)


def create_access_token(user_id: UUID) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_minutes),
        "type": "access",
    }
    return jwt.encode(payload, settings.auth_secret, algorithm=JWT_ALGORITHM)


def verify_access_token(token: str) -> UUID | None:
    try:
        payload = jwt.decode(token, settings.auth_secret, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            return None
        return UUID(payload["sub"])
    except jwt.PyJWTError:
        return None
    except (KeyError, ValueError):
        return None
