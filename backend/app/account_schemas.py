from typing import Literal

from pydantic import (
    BaseModel,
    Field,
)


class DeleteAccountRequest(BaseModel):
    confirmation: Literal["DELETE"] = Field(
        description=(
            "Explicit confirmation required "
            "before permanently deleting "
            "the account."
        )
    )
