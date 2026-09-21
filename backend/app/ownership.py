from dataclasses import dataclass
from datetime import datetime, timezone

from fastapi import (
    Depends,
    HTTPException,
    Request,
    status,
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_session_token
from app.db import get_db
from app.models import (
    AuthSession,
    GuestSession,
    User,
)
from app.routers.auth import (
    SESSION_COOKIE_NAME,
)
from app.routers.guest import (
    GUEST_COOKIE_NAME,
)


@dataclass(frozen=True)
class RequestOwner:
    user_id: str | None = None
    guest_session_id: str | None = None


def get_request_owner(
    request: Request,
    db: Session = Depends(get_db),
) -> RequestOwner:
    now = datetime.now(
        timezone.utc
    )

    # 1. Prefer an authenticated account.
    auth_token = request.cookies.get(
        SESSION_COOKIE_NAME
    )

    if auth_token is not None:
        auth_token_hash = (
            hash_session_token(
                auth_token
            )
        )

        auth_session = db.scalar(
            select(AuthSession).where(
                AuthSession.token_hash
                == auth_token_hash,
                AuthSession.expires_at
                > now,
            )
        )

        if auth_session is not None:
            user = db.get(
                User,
                auth_session.user_id,
            )

            if user is not None:
                if (
                    user.account_status
                    != "active"
                ):
                    raise HTTPException(
                        status_code=(
                            status.HTTP_403_FORBIDDEN
                        ),
                        detail=(
                            "Account is not active."
                        ),
                    )

                return RequestOwner(
                    user_id=user.id,
                )

    # 2. If there is no valid account
    # session, try Guest Mode.
    guest_token = request.cookies.get(
        GUEST_COOKIE_NAME
    )

    if guest_token is not None:
        guest_token_hash = (
            hash_session_token(
                guest_token
            )
        )

        guest_session = db.scalar(
            select(GuestSession).where(
                GuestSession.token_hash
                == guest_token_hash,
                GuestSession.expires_at
                > now,
            )
        )

        if guest_session is not None:
            return RequestOwner(
                guest_session_id=(
                    guest_session.id
                ),
            )

    raise HTTPException(
        status_code=(
            status.HTTP_401_UNAUTHORIZED
        ),
        detail=(
            "Authentication or guest "
            "session required."
        ),
    )