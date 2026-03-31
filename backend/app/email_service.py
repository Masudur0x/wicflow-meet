import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
import re

logger = logging.getLogger(__name__)


async def send_email_smtp(
    to_emails: list,
    subject: str,
    body_html: str,
    smtp_host: str,
    smtp_port: int,
    smtp_username: str,
    smtp_password: str,
    from_email: str = None,
):
    """Send email via SMTP (works with Gmail, Outlook, any SMTP provider)."""
    msg = MIMEMultipart("alternative")
    msg["From"] = from_email or smtp_username
    msg["To"] = ", ".join(to_emails)
    msg["Subject"] = subject

    # Plain text fallback
    plain_text = body_html.replace("<br>", "\n").replace("</p>", "\n")
    plain_text = re.sub(r"<[^>]+>", "", plain_text)

    msg.attach(MIMEText(plain_text, "plain"))
    msg.attach(MIMEText(body_html, "html"))

    await aiosmtplib.send(
        msg,
        hostname=smtp_host,
        port=smtp_port,
        username=smtp_username,
        password=smtp_password,
        use_tls=smtp_port == 465,
        start_tls=smtp_port == 587,
    )
    logger.info(f"Email sent to {to_emails}")


async def send_email_sendgrid(
    to_emails: list,
    subject: str,
    body_html: str,
    api_key: str,
    from_email: str,
):
    """Send email via SendGrid API."""
    import httpx

    payload = {
        "personalizations": [{"to": [{"email": e} for e in to_emails]}],
        "from": {"email": from_email},
        "subject": subject,
        "content": [
            {"type": "text/html", "value": body_html}
        ],
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.sendgrid.com/v3/mail/send",
            json=payload,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
        )
        resp.raise_for_status()
    logger.info(f"SendGrid email sent to {to_emails}")
