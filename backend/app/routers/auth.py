from datetime import datetime, timedelta, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.auth_schemas import (
    LoginRequest,
    RegisterRequest,
    UserResponse,
)
from app.core.security import (
    generate_session_token,
    hash_password,
    hash_session_token,
    verify_password,
)
from app.db import get_db
from app.models import (
    AuthSession,
    DiagnosticCase,
    GuestSession,
    User,
)
from app.routers.guest import GUEST_COOKIE_NAME


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


SESSION_COOKIE_NAME = (
    "autodiagnose_session"
)

SESSION_DURATION = timedelta(
    days=7
)


def claim_guest_diagnostics(
    request: Request,
    response: Response,
    user: User,
    db: Session,
) -> None:
    """
    If the browser currently has a valid guest
    session, transfer its diagnostic cases to
    the authenticated user.
    """

    guest_token = request.cookies.get(
        GUEST_COOKIE_NAME
    )

    if guest_token is None:
        return

    guest_token_hash = hash_session_token(
        guest_token
    )

    now = datetime.now(
        timezone.utc
    )

    guest_session = db.scalar(
        select(GuestSession).where(
            GuestSession.token_hash
            == guest_token_hash,
            GuestSession.expires_at
            > now,
        )
    )

    if guest_session is None:
        response.delete_cookie(
            key=GUEST_COOKIE_NAME,
            path="/",
            httponly=True,
            secure=False,
            samesite="lax",
        )

        return

    db.execute(
        update(DiagnosticCase)
        .where(
            DiagnosticCase
            .guest_session_id
            == guest_session.id
        )
        .values(
            user_id=user.id,
            guest_session_id=None,
        )
    )

    db.delete(
        guest_session
    )

    db.commit()

    response.delete_cookie(
        key=GUEST_COOKIE_NAME,
        path="/",
        httponly=True,
        secure=False,
        samesite="lax",
    )


def create_auth_session(
    user: User,
    response: Response,
    db: Session,
) -> None:
    """
    Create a new authentication session and
    send its raw token to the browser through
    an HttpOnly cookie.
    """

    session_token = (
        generate_session_token()
    )

    token_hash = hash_session_token(
        session_token
    )

    expires_at = (
        datetime.now(timezone.utc)
        + SESSION_DURATION
    )

    auth_session = AuthSession(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
    )

    db.add(
        auth_session
    )

    db.commit()

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=int(
            SESSION_DURATION
            .total_seconds()
        ),
        path="/",
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    register_data: RegisterRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> UserResponse:
    normalized_email = (
        register_data.email
        .strip()
        .lower()
    )

    existing_user = db.scalar(
        select(User).where(
            User.email
            == normalized_email
        )
    )

    if existing_user is not None:
        raise HTTPException(
            status_code=(
                status.HTTP_409_CONFLICT
            ),
            detail=(
                "An account with this email "
                "already exists."
            ),
        )

    user = User(
        email=normalized_email,
        password_hash=hash_password(
            register_data.password
        ),
        preferred_language=(
            register_data
            .preferred_language
        ),
    )

    db.add(
        user
    )

    db.commit()

    db.refresh(
        user
    )

    # If the person used AutoDiagnose AI
    # as a guest before creating the account,
    # move those diagnostic cases to the
    # newly created account.
    claim_guest_diagnostics(
        request=request,
        response=response,
        user=user,
        db=db,
    )

    # Automatically sign in the new user.
    create_auth_session(
        user=user,
        response=response,
        db=db,
    )

    return UserResponse(
        id=user.id,
        email=user.email,
        preferred_language=(
            user.preferred_language
        ),
        account_status=(
            user.account_status
        ),
    )


@router.post(
    "/login",
    response_model=UserResponse,
)
def login(
    login_data: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> UserResponse:
    normalized_email = (
        login_data.email
        .strip()
        .lower()
    )

    user = db.scalar(
        select(User).where(
            User.email
            == normalized_email
        )
    )

    if user is None:
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Invalid email or password."
            ),
        )

    if not verify_password(
        login_data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Invalid email or password."
            ),
        )

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

    # If this browser previously used Guest
    # Mode, transfer those diagnostics to the
    # existing account.
    claim_guest_diagnostics(
        request=request,
        response=response,
        user=user,
        db=db,
    )

    create_auth_session(
        user=user,
        response=response,
        db=db,
    )

    return UserResponse(
        id=user.id,
        email=user.email,
        preferred_language=(
            user.preferred_language
        ),
        account_status=(
            user.account_status
        ),
    )


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    session_token = request.cookies.get(
        SESSION_COOKIE_NAME
    )

    if session_token is None:
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Not authenticated."
            ),
        )

    token_hash = hash_session_token(
        session_token
    )

    now = datetime.now(
        timezone.utc
    )

    auth_session = db.scalar(
        select(AuthSession).where(
            AuthSession.token_hash
            == token_hash,
            AuthSession.expires_at
            > now,
        )
    )

    if auth_session is None:
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Session is invalid "
                "or expired."
            ),
        )

    user = db.get(
        User,
        auth_session.user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "User no longer exists."
            ),
        )

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

    return user


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
) -> UserResponse:
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        preferred_language=(
            current_user
            .preferred_language
        ),
        account_status=(
            current_user
            .account_status
        ),
    )


@router.post(
    "/logout",
    status_code=(
        status.HTTP_204_NO_CONTENT
    ),
)
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> Response:
    session_token = request.cookies.get(
        SESSION_COOKIE_NAME
    )

    if session_token is not None:
        token_hash = hash_session_token(
            session_token
        )

        auth_session = db.scalar(
            select(AuthSession).where(
                AuthSession.token_hash
                == token_hash
            )
        )

        if auth_session is not None:
            db.delete(
                auth_session
            )

            db.commit()

    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        path="/",
        httponly=True,
        secure=False,
        samesite="lax",
    )

    response.status_code = (
        status.HTTP_204_NO_CONTENT
    )

    return response