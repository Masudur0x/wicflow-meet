import logging
import httpx

logger = logging.getLogger(__name__)


async def send_to_google_sheets(
    spreadsheet_url: str,
    api_key: str,
    meeting_name: str,
    date: str,
    attendees: list,
    summary: str,
    action_items: list,
):
    """Append a row to a Google Sheet via Sheets API v4."""
    parts = spreadsheet_url.split("/d/")
    if len(parts) < 2:
        raise ValueError("Invalid Google Sheets URL")
    spreadsheet_id = parts[1].split("/")[0]

    row = [
        meeting_name,
        date,
        ", ".join(attendees),
        summary,
        "\n".join(f"- {item}" for item in action_items),
    ]

    url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/Sheet1!A:E:append"
    params = {
        "valueInputOption": "USER_ENTERED",
        "insertDataOption": "INSERT_ROWS",
        "key": api_key,
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(url, params=params, json={"values": [row]})
        resp.raise_for_status()

    logger.info(f"Appended row to Google Sheet {spreadsheet_id}")


async def send_to_hubspot(
    api_key: str,
    meeting_name: str,
    date: str,
    attendees: list,
    summary: str,
    action_items: list,
):
    """Create a note in HubSpot via v3 API."""
    note_body = f"# {meeting_name}\n\nDate: {date}\nAttendees: {', '.join(attendees)}\n\n{summary}\n\n## Action Items\n"
    note_body += "\n".join(f"- {item}" for item in action_items)

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.hubapi.com/crm/v3/objects/notes",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "properties": {
                    "hs_note_body": note_body,
                    "hs_timestamp": date,
                }
            },
        )
        resp.raise_for_status()

    logger.info(f"Created HubSpot note for {meeting_name}")


async def send_to_airtable(
    api_key: str,
    base_id: str,
    table_name: str,
    meeting_name: str,
    date: str,
    attendees: list,
    summary: str,
    action_items: list,
):
    """Create a record in Airtable."""
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"https://api.airtable.com/v0/{base_id}/{table_name}",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "fields": {
                    "Name": meeting_name,
                    "Date": date,
                    "Attendees": ", ".join(attendees),
                    "Summary": summary,
                    "Action Items": "\n".join(f"- {item}" for item in action_items),
                }
            },
        )
        resp.raise_for_status()

    logger.info(f"Created Airtable record for {meeting_name}")
