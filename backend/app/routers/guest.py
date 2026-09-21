from datetime import (
    datetime,
    timedelta,
    timezone,
)

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import (
    generate_session_token,
    hash_session_token,
)
from app.db import get_db
from app.guest_schemas import (
    GuestSessionResponse,
)
from app.models import GuestSession


router = APIRouter(
    prefix="/api/guest",
    tags=["Guest"],
)


GUEST_COOKIE_NAME = (
    "autodiagnose_guest"
)

GUEST_SESSION_DURATION = timedelta(
    days=7
)


@router.post(
    "/start",
    response_model=GuestSessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def start_guest_session(
    response: Response,
    db: Session = Depends(get_db),
) -> GuestSessionResponse:
    session_token = (
        generate_session_token()
    )

    token_hash = hash_session_token(
        session_token
    )

    expires_at = (
        datetime.now(timezone.utc)
        + GUEST_SESSION_DURATION
    )

    guest_session = GuestSession(
        token_hash=token_hash,
        expires_at=expires_at,
    )

    db.add(guest_session)
    db.commit()

    response.set_cookie(
        key=GUEST_COOKIE_NAME,
        value=session_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=int(
            GUEST_SESSION_DURATION
            .total_seconds()
        ),
        path="/",
    )

    return GuestSessionResponse(
        status="guest",
        expires_at=expires_at,
    )


def get_current_guest_session(
    request: Request,
    db: Session = Depends(get_db),
) -> GuestSession:
    session_token = request.cookies.get(
        GUEST_COOKIE_NAME
    )

    if session_token is None:
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Guest session not found."
            ),
        )

    token_hash = hash_session_token(
        session_token
    )

    now = datetime.now(
        timezone.utc
    )

    guest_session = db.scalar(
        select(GuestSession).where(
            GuestSession.token_hash
            == token_hash,
            GuestSession.expires_at
            > now,
        )
    )

    if guest_session is None:
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Guest session is invalid "
                "or expired."
            ),
        )

    return guest_session


@router.get(
    "/me",
    response_model=GuestSessionResponse,
)
def get_guest_me(
    guest_session: GuestSession = Depends(
        get_current_guest_session
    ),
) -> GuestSessionResponse:
    return GuestSessionResponse(
        status="guest",
        expires_at=(
            guest_session.expires_at
        ),
    )