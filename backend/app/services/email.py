import json
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
        if settings.resend_api_key is None:
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
        with urlopen(request, timeout=10) as response:
            response.read()
