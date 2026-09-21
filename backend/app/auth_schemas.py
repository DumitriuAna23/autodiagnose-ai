from typing import Literal

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
)


class RegisterRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )

    preferred_language: Literal[
        "ro",
        "en",
    ] = "ro"

class LoginRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )
class UserResponse(BaseModel):
    id: str
    email: EmailStr
    preferred_language: str
    account_status: str