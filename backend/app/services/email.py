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
                "Accept": "application/json",
                "User-Agent": "Orqen/0.1 (+https://testiforge.com)",
            },
        )

        try:
            with urlopen(request, timeout=10) as response:
                response_body = response.read().decode("utf-8")
                print(f"[email sent] to={to} subject={subject} response={response_body}")
        except HTTPError as exc:
            error_body = exc.read().decode("utf-8", errors="replace")
            print(
                f"[email fallback] Resend HTTP {exc.code}. "
                f"from={settings.email_from} to={to} subject={subject} "
                f"error={error_body} body={text}"
            )
        except URLError as exc:
            print(
                f"[email fallback] Resend failed: {exc}. "
                f"from={settings.email_from} to={to} subject={subject} body={text}"
            )
