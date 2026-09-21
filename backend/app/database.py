import json
from datetime import datetime, timezone

from sqlalchemy import select, text

from app.db import SessionLocal, engine
from app.models import DiagnosticCase


def initialize_database() -> None:
    """
    Verifies that PostgreSQL is reachable.

    Database structure is managed through
    Alembic migrations.
    """
    with engine.connect() as connection:
        connection.execute(
            text("SELECT 1")
        )


def validate_owner(
    user_id: str | None,
    guest_session_id: str | None,
) -> None:
    has_user = user_id is not None
    has_guest = guest_session_id is not None

    if has_user == has_guest:
        raise ValueError(
            "A diagnostic case must have "
            "exactly one owner."
        )


def apply_owner_filter(
    statement,
    user_id: str | None,
    guest_session_id: str | None,
):
    validate_owner(
        user_id,
        guest_session_id,
    )

    if user_id is not None:
        return statement.where(
            DiagnosticCase.user_id
            == user_id
        )

    return statement.where(
        DiagnosticCase.guest_session_id
        == guest_session_id
    )


def save_diagnostic_case(
    case_id: str,
    payload: str,
    user_id: str | None,
    guest_session_id: str | None,
) -> None:
    validate_owner(
        user_id,
        guest_session_id,
    )

    payload_data = json.loads(
        payload
    )

    diagnostic_case = DiagnosticCase(
        case_id=case_id,
        user_id=user_id,
        guest_session_id=(
            guest_session_id
        ),
        payload=payload_data,
        status="created",
    )

    with SessionLocal() as session:
        session.add(
            diagnostic_case
        )
        session.commit()


def get_diagnostic_case_payload(
    case_id: str,
    user_id: str | None,
    guest_session_id: str | None,
) -> str | None:
    with SessionLocal() as session:
        statement = select(
            DiagnosticCase
        ).where(
            DiagnosticCase.case_id
            == case_id
        )

        statement = apply_owner_filter(
            statement,
            user_id,
            guest_session_id,
        )

        diagnostic_case = session.scalar(
            statement
        )

        if diagnostic_case is None:
            return None

        return json.dumps(
            diagnostic_case.payload,
            ensure_ascii=False,
        )


def save_diagnostic_analysis(
    case_id: str,
    analysis_payload: str,
    user_id: str | None,
    guest_session_id: str | None,
) -> bool:
    analysis_data = json.loads(
        analysis_payload
    )

    analyzed_at = datetime.now(
        timezone.utc
    )

    with SessionLocal() as session:
        statement = select(
            DiagnosticCase
        ).where(
            DiagnosticCase.case_id
            == case_id
        )

        statement = apply_owner_filter(
            statement,
            user_id,
            guest_session_id,
        )

        diagnostic_case = session.scalar(
            statement
        )

        if diagnostic_case is None:
            return False

        diagnostic_case.analysis_payload = (
            analysis_data
        )

        diagnostic_case.analyzed_at = (
            analyzed_at
        )

        diagnostic_case.status = (
            "completed"
        )

        session.commit()

        return True


def get_diagnostic_analysis_payload(
    case_id: str,
    user_id: str | None,
    guest_session_id: str | None,
) -> str | None:
    with SessionLocal() as session:
        statement = select(
            DiagnosticCase
        ).where(
            DiagnosticCase.case_id
            == case_id
        )

        statement = apply_owner_filter(
            statement,
            user_id,
            guest_session_id,
        )

        diagnostic_case = session.scalar(
            statement
        )

        if diagnostic_case is None:
            return None

        if (
            diagnostic_case.analysis_payload
            is None
        ):
            return None

        return json.dumps(
            diagnostic_case.analysis_payload,
            ensure_ascii=False,
        )


def list_diagnostic_case_records(
    user_id: str | None,
    guest_session_id: str | None,
) -> list[dict]:
    with SessionLocal() as session:
        statement = select(
            DiagnosticCase
        )

        statement = apply_owner_filter(
            statement,
            user_id,
            guest_session_id,
        )

        statement = statement.order_by(
            DiagnosticCase
            .created_at
            .desc()
        )

        diagnostic_cases = (
            session.scalars(
                statement
            )
            .all()
        )

        return [
            {
                "case_id":
                    diagnostic_case.case_id,

                "user_id":
                    diagnostic_case.user_id,

                "guest_session_id":
                    (
                        diagnostic_case
                        .guest_session_id
                    ),

                "payload":
                    json.dumps(
                        diagnostic_case.payload,
                        ensure_ascii=False,
                    ),

                "created_at":
                    (
                        diagnostic_case
                        .created_at
                        .isoformat()
                        if diagnostic_case.created_at
                        else None
                    ),

                "analysis_payload":
                    (
                        json.dumps(
                            diagnostic_case
                            .analysis_payload,
                            ensure_ascii=False,
                        )
                        if diagnostic_case
                        .analysis_payload
                        is not None
                        else None
                    ),

                "analyzed_at":
                    (
                        diagnostic_case
                        .analyzed_at
                        .isoformat()
                        if diagnostic_case.analyzed_at
                        else None
                    ),

                "status":
                    diagnostic_case.status,
            }
            for diagnostic_case
            in diagnostic_cases
        ]