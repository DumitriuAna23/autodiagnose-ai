import os

from dotenv import load_dotenv
from sqlalchemy import URL


load_dotenv()


APP_ENV = (
    os.getenv(
        "APP_ENV",
        "development",
    )
    .strip()
    .lower()
)


def env_bool(
    name: str,
    default: bool,
) -> bool:
    raw_value = os.getenv(
        name
    )

    if raw_value is None:
        return default

    return (
        raw_value
        .strip()
        .lower()
        in {
            "1",
            "true",
            "yes",
            "on",
        }
    )


def parse_origins(
    raw_value: str,
) -> list[str]:
    return [
        origin.strip().rstrip("/")
        for origin
        in raw_value.split(",")
        if origin.strip()
    ]


FRONTEND_ORIGINS = (
    parse_origins(
        os.getenv(
            "FRONTEND_ORIGINS",
            (
                "http://localhost:3000,"
                "http://127.0.0.1:3000"
            ),
        )
    )
)


COOKIE_SECURE = env_bool(
    "COOKIE_SECURE",
    APP_ENV == "production",
)


COOKIE_SAMESITE = (
    os.getenv(
        "COOKIE_SAMESITE",
        "lax",
    )
    .strip()
    .lower()
)


if COOKIE_SAMESITE not in {
    "lax",
    "strict",
    "none",
}:
    raise RuntimeError(
        "COOKIE_SAMESITE must be "
        "'lax', 'strict', or 'none'."
    )


if (
    COOKIE_SAMESITE == "none"
    and not COOKIE_SECURE
):
    raise RuntimeError(
        "COOKIE_SAMESITE=none requires "
        "COOKIE_SECURE=true."
    )


raw_database_url = os.getenv(
    "DATABASE_URL"
)


if raw_database_url:
    normalized_database_url = (
        raw_database_url.strip()
    )

    if normalized_database_url.startswith(
        "postgres://"
    ):
        normalized_database_url = (
            "postgresql+psycopg://"
            + normalized_database_url[
                len("postgres://"):
            ]
        )

    elif normalized_database_url.startswith(
        "postgresql://"
    ):
        normalized_database_url = (
            "postgresql+psycopg://"
            + normalized_database_url[
                len("postgresql://"):
            ]
        )

    DATABASE_URL = (
        normalized_database_url
    )

else:
    DB_USER = os.getenv(
        "DB_USER",
        "postgres",
    )

    DB_PASSWORD = os.getenv(
        "DB_PASSWORD"
    )

    DB_HOST = os.getenv(
        "DB_HOST",
        "localhost",
    )

    DB_PORT = int(
        os.getenv(
            "DB_PORT",
            "5432",
        )
    )

    DB_NAME = os.getenv(
        "DB_NAME",
        "autodiagnose",
    )


    if not DB_PASSWORD:
        raise RuntimeError(
            "DATABASE_URL or DB_PASSWORD "
            "is missing. Check backend/.env."
        )


    DATABASE_URL = URL.create(
        drivername=(
            "postgresql+psycopg"
        ),
        username=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
    )
