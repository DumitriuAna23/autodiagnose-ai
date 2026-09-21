from datetime import datetime

from pydantic import BaseModel


class GuestSessionResponse(BaseModel):
    status: str
    expires_at: datetime