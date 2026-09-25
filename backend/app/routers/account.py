from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    Response,
    status,
)
from sqlalchemy import (
    delete,
    select,
)
from sqlalchemy.orm import Session

from app.account_schemas import (
    DeleteAccountRequest,
)
from app.config import (
    COOKIE_SAMESITE,
    COOKIE_SECURE,
)
from app.db import get_db
from app.models import (
    AuthSession,
    DiagnosticCase,
    User,
)
from app.routers.auth import (
    SESSION_COOKIE_NAME,
    get_current_user,
)


router = APIRouter(
    prefix="/api/account",
    tags=["Account"],
)


def serialize_datetime(
    value: datetime | None,
) -> str | None:
    if value is None:
        return None

    return value.isoformat()


@router.get(
    "/export",
)
def export_account_data(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
) -> dict:
    """
    Export the authenticated user's account
    data and diagnostic history.

    Password hashes, authentication tokens,
    and session hashes are intentionally not
    included.
    """

    diagnostic_cases = (
        db.scalars(
            select(
                DiagnosticCase
            )
            .where(
                DiagnosticCase.user_id
                == current_user.id
            )
            .order_by(
                DiagnosticCase
                .created_at
                .asc()
            )
        )
        .all()
    )

    return {
        "exported_at":
            datetime.now(
                timezone.utc
            ).isoformat(),

        "account": {
            "id":
                current_user.id,
            "email":
                current_user.email,
            "preferred_language":
                current_user
                .preferred_language,
            "account_status":
                current_user
                .account_status,
            "created_at":
                serialize_datetime(
                    current_user
                    .created_at
                ),
            "updated_at":
                serialize_datetime(
                    current_user
                    .updated_at
                ),
        },

        "diagnostic_cases": [
            {
                "case_id":
                    diagnostic_case
                    .case_id,

                "status":
                    diagnostic_case
                    .status,

                "created_at":
                    serialize_datetime(
                        diagnostic_case
                        .created_at
                    ),

                "analyzed_at":
                    serialize_datetime(
                        diagnostic_case
                        .analyzed_at
                    ),

                "input":
                    diagnostic_case
                    .payload,

                "analysis":
                    diagnostic_case
                    .analysis_payload,
            }
            for diagnostic_case
            in diagnostic_cases
        ],
    }


@router.delete(
    "",
    status_code=(
        status.HTTP_204_NO_CONTENT
    ),
)
def delete_account(
    delete_request: DeleteAccountRequest,
    response: Response,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
) -> Response:
    """
    Permanently delete the authenticated
    account and all account-owned data.

    The user ID is obtained exclusively from
    the authenticated session, never from
    client-provided account identifiers.
    """

    user_id = current_user.id

    # Delete owned diagnostic records first.
    db.execute(
        delete(
            DiagnosticCase
        ).where(
            DiagnosticCase.user_id
            == user_id
        )
    )

    # Revoke every login session belonging
    # to this account, including other devices.
    db.execute(
        delete(
            AuthSession
        ).where(
            AuthSession.user_id
            == user_id
        )
    )

    # Finally delete the account itself.
    db.execute(
        delete(
            User
        ).where(
            User.id
            == user_id
        )
    )

    db.commit()

    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        path="/",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
    )

    response.status_code = (
        status.HTTP_204_NO_CONTENT
    )

    return response
