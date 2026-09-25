from urllib.parse import urlsplit

from starlette.datastructures import Headers
from starlette.responses import JSONResponse
from starlette.types import (
    ASGIApp,
    Message,
    Receive,
    Scope,
    Send,
)


UNSAFE_METHODS = {
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
}


def normalize_origin(
    origin: str,
) -> str | None:
    """
    Normalize an HTTP(S) origin to:
    scheme://host[:port]

    Returns None when the value is not a valid
    HTTP(S) origin.
    """
    try:
        parsed = urlsplit(origin.strip())
    except ValueError:
        return None

    if parsed.scheme.lower() not in {
        "http",
        "https",
    }:
        return None

    if not parsed.netloc:
        return None

    if parsed.username is not None:
        return None

    if parsed.password is not None:
        return None

    if parsed.path not in {
        "",
        "/",
    }:
        return None

    if parsed.query:
        return None

    if parsed.fragment:
        return None

    hostname = parsed.hostname

    if hostname is None:
        return None

    scheme = parsed.scheme.lower()
    hostname = hostname.lower()

    if parsed.port is not None:
        return (
            f"{scheme}://"
            f"{hostname}:{parsed.port}"
        )

    return f"{scheme}://{hostname}"


def get_request_origin(
    scope: Scope,
    headers: Headers,
) -> str | None:
    """
    Build the API's own origin so same-origin
    tools such as FastAPI Swagger can still
    make requests.

    X-Forwarded-Proto / X-Forwarded-Host are
    considered first because production runs
    behind a reverse proxy.
    """
    forwarded_proto = headers.get(
        "x-forwarded-proto"
    )

    if forwarded_proto:
        scheme = (
            forwarded_proto
            .split(",")[0]
            .strip()
            .lower()
        )
    else:
        scheme = str(
            scope.get(
                "scheme",
                "http",
            )
        ).lower()

    forwarded_host = headers.get(
        "x-forwarded-host"
    )

    if forwarded_host:
        host = (
            forwarded_host
            .split(",")[0]
            .strip()
        )
    else:
        host = headers.get("host")

    if not host:
        return None

    return normalize_origin(
        f"{scheme}://{host}"
    )


class OriginProtectionMiddleware:
    """
    Extra CSRF hardening for state-changing
    browser requests.

    Browser requests that include an Origin
    header are accepted only when the origin
    is:
      - one of the configured frontend origins,
        or
      - the API's own origin.

    Requests without an Origin header remain
    available to trusted non-browser clients,
    command-line tools and server-to-server
    integrations.

    This complements CORS; it does not replace
    authentication, authorization or CORS.
    """

    def __init__(
        self,
        app: ASGIApp,
        allowed_origins: list[str],
    ) -> None:
        self.app = app

        self.allowed_origins = {
            normalized
            for origin in allowed_origins
            if (
                normalized
                := normalize_origin(origin)
            )
            is not None
        }

    async def __call__(
        self,
        scope: Scope,
        receive: Receive,
        send: Send,
    ) -> None:
        if scope["type"] != "http":
            await self.app(
                scope,
                receive,
                send,
            )
            return

        method = str(
            scope.get(
                "method",
                "",
            )
        ).upper()

        if method not in UNSAFE_METHODS:
            await self.app(
                scope,
                receive,
                send,
            )
            return

        headers = Headers(scope=scope)

        origin_header = headers.get("origin")

        # Non-browser tools often do not send
        # Origin. Authentication/authorization
        # still applies normally.
        if origin_header is None:
            await self.app(
                scope,
                receive,
                send,
            )
            return

        request_origin = get_request_origin(
            scope,
            headers,
        )

        normalized_origin = normalize_origin(
            origin_header
        )

        origin_allowed = (
            normalized_origin is not None
            and (
                normalized_origin
                in self.allowed_origins
                or (
                    request_origin is not None
                    and normalized_origin
                    == request_origin
                )
            )
        )

        if not origin_allowed:
            response = JSONResponse(
                status_code=403,
                content={
                    "detail": (
                        "Request origin "
                        "is not allowed."
                    )
                },
            )

            await response(
                scope,
                receive,
                send,
            )
            return

        await self.app(
            scope,
            receive,
            send,
        )


class SecurityHeadersMiddleware:
    """
    Add conservative security headers to API
    responses without breaking FastAPI Swagger.

    HSTS is enabled only in production.
    """

    def __init__(
        self,
        app: ASGIApp,
        production: bool,
    ) -> None:
        self.app = app
        self.production = production

    async def __call__(
        self,
        scope: Scope,
        receive: Receive,
        send: Send,
    ) -> None:
        if scope["type"] != "http":
            await self.app(
                scope,
                receive,
                send,
            )
            return

        async def send_with_headers(
            message: Message,
        ) -> None:
            if message["type"] == (
                "http.response.start"
            ):
                headers = list(
                    message.get(
                        "headers",
                        [],
                    )
                )

                headers.extend(
                    [
                        (
                            b"x-content-type-options",
                            b"nosniff",
                        ),
                        (
                            b"x-frame-options",
                            b"DENY",
                        ),
                        (
                            b"referrer-policy",
                            b"no-referrer",
                        ),
                        (
                            b"permissions-policy",
                            (
                                b"camera=(), "
                                b"microphone=(), "
                                b"geolocation=()"
                            ),
                        ),
                    ]
                )

                if self.production:
                    headers.append(
                        (
                            b"strict-transport-security",
                            (
                                b"max-age=31536000; "
                                b"includeSubDomains"
                            ),
                        )
                    )

                message["headers"] = headers

            await send(message)

        await self.app(
            scope,
            receive,
            send_with_headers,
        )
