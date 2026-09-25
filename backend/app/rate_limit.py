from __future__ import annotations

from collections import defaultdict, deque
from threading import Lock
from time import monotonic

from fastapi import (
    HTTPException,
    Request,
    status,
)


class RateLimiter:
    """
    Small in-memory fixed-window style limiter
    for a single application instance.

    It is intentionally dependency-free and is
    suitable for the current single-instance
    portfolio deployment. If the API is scaled
    to multiple instances later, replace this
    with a shared Redis-backed limiter.
    """

    def __init__(
        self,
        limit: int,
        window_seconds: int,
    ) -> None:
        if limit <= 0:
            raise ValueError(
                "Rate limit must be positive."
            )

        if window_seconds <= 0:
            raise ValueError(
                "Rate-limit window must be "
                "positive."
            )

        self.limit = limit
        self.window_seconds = window_seconds

        self._events: dict[
            str,
            deque[float],
        ] = defaultdict(deque)

        self._lock = Lock()
        self._checks = 0

    def check(
        self,
        key: str,
    ) -> None:
        now = monotonic()
        cutoff = (
            now - self.window_seconds
        )

        with self._lock:
            events = self._events[key]

            while (
                events
                and events[0] <= cutoff
            ):
                events.popleft()

            if len(events) >= self.limit:
                retry_after = max(
                    1,
                    int(
                        self.window_seconds
                        - (
                            now
                            - events[0]
                        )
                    ),
                )

                raise HTTPException(
                    status_code=(
                        status
                        .HTTP_429_TOO_MANY_REQUESTS
                    ),
                    detail=(
                        "Too many requests. "
                        "Please try again later."
                    ),
                    headers={
                        "Retry-After":
                            str(retry_after)
                    },
                )

            events.append(now)

            self._checks += 1

            # Periodically discard empty/stale
            # buckets so the dictionary does
            # not grow forever.
            if self._checks % 100 == 0:
                self._cleanup_locked(
                    cutoff=cutoff
                )

    def reset(
        self,
        key: str,
    ) -> None:
        with self._lock:
            self._events.pop(
                key,
                None,
            )

    def _cleanup_locked(
        self,
        cutoff: float,
    ) -> None:
        stale_keys: list[str] = []

        for key, events in (
            self._events.items()
        ):
            while (
                events
                and events[0] <= cutoff
            ):
                events.popleft()

            if not events:
                stale_keys.append(key)

        for key in stale_keys:
            self._events.pop(
                key,
                None,
            )


def get_client_identifier(
    request: Request,
) -> str:
    """
    Return a stable client identifier.

    Render/Vercel-style reverse proxies forward
    the original address through
    X-Forwarded-For. We use the last address in
    the chain when present, then fall back to
    Starlette's client address.
    """
    forwarded_for = request.headers.get(
        "x-forwarded-for"
    )

    if forwarded_for:
        candidates = [
            part.strip()
            for part
            in forwarded_for.split(",")
            if part.strip()
        ]

        if candidates:
            return candidates[-1]

    if request.client is not None:
        return request.client.host

    return "unknown-client"


# Authentication:
# - broad protection per client
# - narrower protection per client + email
LOGIN_IP_LIMITER = RateLimiter(
    limit=20,
    window_seconds=600,
)

LOGIN_ACCOUNT_LIMITER = RateLimiter(
    limit=8,
    window_seconds=600,
)

# Account creation is naturally much rarer.
REGISTER_IP_LIMITER = RateLimiter(
    limit=10,
    window_seconds=3600,
)

# Guest sessions may be recreated by normal
# browser flows, so the threshold is higher.
GUEST_IP_LIMITER = RateLimiter(
    limit=30,
    window_seconds=3600,
)
