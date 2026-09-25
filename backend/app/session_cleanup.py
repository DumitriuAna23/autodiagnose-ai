from __future__ import annotations

from datetime import datetime, timezone
from threading import Lock
from time import monotonic

from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.models import (
    AuthSession,
    GuestSession,
)


CLEANUP_INTERVAL_SECONDS = 3600

_cleanup_lock = Lock()
_last_cleanup_at = 0.0


def cleanup_expired_sessions(
    db: Session,
    force: bool = False,
) -> int:
    """
    Delete expired authentication and guest
    sessions.

    Cleanup is throttled so normal API traffic
    does not execute DELETE queries on every
    request. By default it runs at most once
    per hour per application instance.

    Returns the number of deleted rows when
    the cleanup runs, otherwise 0.
    """
    global _last_cleanup_at

    current_monotonic = monotonic()

    with _cleanup_lock:
        if (
            not force
            and (
                current_monotonic
                - _last_cleanup_at
            )
            < CLEANUP_INTERVAL_SECONDS
        ):
            return 0

        now = datetime.now(
            timezone.utc
        )

        auth_result = db.execute(
            delete(AuthSession).where(
                AuthSession.expires_at
                <= now
            )
        )

        guest_result = db.execute(
            delete(GuestSession).where(
                GuestSession.expires_at
                <= now
            )
        )

        db.commit()

        _last_cleanup_at = (
            current_monotonic
        )

        deleted_auth = (
            auth_result.rowcount or 0
        )

        deleted_guest = (
            guest_result.rowcount or 0
        )

        return (
            deleted_auth
            + deleted_guest
        )
