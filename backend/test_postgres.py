from sqlalchemy import text

from app.db import engine


def test_connection() -> None:
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT version();")
        )

        version = result.scalar()

        print("PostgreSQL connection successful!")
        print(version)


if __name__ == "__main__":
    test_connection()