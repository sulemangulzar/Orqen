import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from app.core.config import settings


class EmailService:
    async def send_email_verification(self, email: str, token: str) -> None:
        link = f"{settings.frontend_url}/confirm-email?token={token}"
        await self._send(email, "Confirm your Orqen email", f"Confirm your email: {link}")

    async def send_password_reset(self, email: str, token: str) -> None:
        link = f"{settings.frontend_url}/reset-password?token={token}"
        await self._send(email, "Reset your Orqen password", f"Reset your password: {link}")

    async def _send(self, to: str, subject: str, text: str) -> None:
        if not settings.resend_api_key:
            print(f"[email dev] to={to} subject={subject} body={text}")
            return

        body = json.dumps(
            {
                "from": settings.email_from,
                "to": [to],
                "subject": subject,
                "text": text,
            }
        ).encode("utf-8")
        request = Request(
            "https://api.resend.com/emails",
            data=body,
            method="POST",
            headers={
                "Authorization": f"Bearer {settings.resend_api_key}",
                "Content-Type": "application/json",
            },
        )

        try:
            with urlopen(request, timeout=10) as response:
                response.read()
        except HTTPError as exc:
            print(f"[email fallback] Resend HTTP {exc.code}. to={to} subject={subject} body={text}")
        except URLError as exc:
            print(f"[email fallback] Resend failed: {exc}. to={to} subject={subject} body={text}")
