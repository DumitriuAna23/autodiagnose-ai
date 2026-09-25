from uuid import uuid4

from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
)
from fastapi.middleware.cors import (
    CORSMiddleware,
)

from app.config import (
    FRONTEND_ORIGINS,
)
from app.database import (
    get_diagnostic_analysis_payload,
    get_diagnostic_case_payload,
    initialize_database,
    list_diagnostic_case_records,
    save_diagnostic_analysis,
    save_diagnostic_case,
)
from app.diagnostic_engine import analyze_case
from app.ownership import (
    RequestOwner,
    get_request_owner,
)
from app.routers.account import (
    router as account_router,
)
from app.routers.auth import (
    router as auth_router,
)
from app.routers.guest import (
    router as guest_router,
)
from app.schemas import (
    DiagnosticAnalysisResponse,
    DiagnosticCaseCreate,
    DiagnosticCaseHistoryItem,
    DiagnosticCaseResponse,
)


app = FastAPI(
    title="AutoDiagnose AI API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=(
        FRONTEND_ORIGINS
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth_router
)

app.include_router(
    guest_router
)

app.include_router(
    account_router
)


initialize_database()


@app.get("/")
def root():
    return {
        "message": (
            "AutoDiagnose AI API "
            "is running."
        )
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.post(
    "/api/diagnostic-cases",
    response_model=DiagnosticCaseResponse,
)
def create_diagnostic_case(
    diagnostic_case: DiagnosticCaseCreate,
    owner: RequestOwner = Depends(
        get_request_owner
    ),
) -> DiagnosticCaseResponse:
    case_id = str(
        uuid4()
    )

    save_diagnostic_case(
        case_id=case_id,
        payload=(
            diagnostic_case
            .model_dump_json()
        ),
        user_id=owner.user_id,
        guest_session_id=(
            owner.guest_session_id
        ),
    )

    if diagnostic_case.language == "ro":
        message = (
            "Cazul de diagnostic "
            "a fost creat cu succes."
        )
    else:
        message = (
            "The diagnostic case was "
            "created successfully."
        )

    return DiagnosticCaseResponse(
        case_id=case_id,
        status="received",
        message=message,
    )


@app.get(
    "/api/diagnostic-cases",
    response_model=list[
        DiagnosticCaseHistoryItem
    ],
)
def list_diagnostic_cases(
    owner: RequestOwner = Depends(
        get_request_owner
    ),
) -> list[
    DiagnosticCaseHistoryItem
]:
    records = (
        list_diagnostic_case_records(
            user_id=owner.user_id,
            guest_session_id=(
                owner.guest_session_id
            ),
        )
    )

    history: list[
        DiagnosticCaseHistoryItem
    ] = []

    for record in records:
        try:
            diagnostic_case = (
                DiagnosticCaseCreate
                .model_validate_json(
                    record["payload"]
                )
            )

        except Exception:
            continue

        findings_count = 0
        top_finding = None
        top_score = None

        analysis_payload = (
            record[
                "analysis_payload"
            ]
        )

        if analysis_payload:
            try:
                analysis = (
                    DiagnosticAnalysisResponse
                    .model_validate_json(
                        analysis_payload
                    )
                )

                findings_count = len(
                    analysis.findings
                )

                if analysis.findings:
                    top_result = (
                        analysis.findings[0]
                    )

                    top_finding = (
                        top_result
                        .probable_cause
                    )

                    top_score = (
                        top_result
                        .confidence
                    )

            except Exception:
                pass

        history.append(
            DiagnosticCaseHistoryItem(
                case_id=(
                    record["case_id"]
                ),
                created_at=(
                    record["created_at"]
                ),
                analyzed_at=(
                    record["analyzed_at"]
                ),
                language=(
                    diagnostic_case
                    .language
                ),
                vehicle=(
                    diagnostic_case
                    .vehicle
                ),
                symptom_count=len(
                    diagnostic_case
                    .symptoms
                ),
                dtc_count=len(
                    diagnostic_case
                    .dtc_codes
                ),
                findings_count=(
                    findings_count
                ),
                top_finding=(
                    top_finding
                ),
                top_score=(
                    top_score
                ),
            )
        )

    return history


@app.get(
    "/api/diagnostic-cases/{case_id}",
    response_model=DiagnosticCaseCreate,
)
def get_diagnostic_case(
    case_id: str,
    owner: RequestOwner = Depends(
        get_request_owner
    ),
) -> DiagnosticCaseCreate:
    payload = (
        get_diagnostic_case_payload(
            case_id=case_id,
            user_id=owner.user_id,
            guest_session_id=(
                owner.guest_session_id
            ),
        )
    )

    if payload is None:
        raise HTTPException(
            status_code=404,
            detail=(
                "Diagnostic case "
                "not found."
            ),
        )

    return (
        DiagnosticCaseCreate
        .model_validate_json(
            payload
        )
    )


@app.post(
    "/api/diagnostic-cases/"
    "{case_id}/analyze",
    response_model=(
        DiagnosticAnalysisResponse
    ),
)
def analyze_diagnostic_case(
    case_id: str,
    owner: RequestOwner = Depends(
        get_request_owner
    ),
) -> DiagnosticAnalysisResponse:
    payload = (
        get_diagnostic_case_payload(
            case_id=case_id,
            user_id=owner.user_id,
            guest_session_id=(
                owner.guest_session_id
            ),
        )
    )

    if payload is None:
        raise HTTPException(
            status_code=404,
            detail=(
                "Diagnostic case "
                "not found."
            ),
        )

    saved_analysis = (
        get_diagnostic_analysis_payload(
            case_id=case_id,
            user_id=owner.user_id,
            guest_session_id=(
                owner.guest_session_id
            ),
        )
    )

    if saved_analysis is not None:
        return (
            DiagnosticAnalysisResponse
            .model_validate_json(
                saved_analysis
            )
        )

    diagnostic_case = (
        DiagnosticCaseCreate
        .model_validate_json(
            payload
        )
    )

    (
        findings,
        data_quality_warnings,
        next_best_steps,
    ) = analyze_case(
        diagnostic_case
    )

    analysis = (
        DiagnosticAnalysisResponse(
            case_id=case_id,
            findings=findings,
            data_quality_warnings=(
                data_quality_warnings
            ),
            next_best_steps=(
                next_best_steps
            ),
        )
    )

    analysis_saved = (
        save_diagnostic_analysis(
            case_id=case_id,
            analysis_payload=(
                analysis
                .model_dump_json()
            ),
            user_id=owner.user_id,
            guest_session_id=(
                owner.guest_session_id
            ),
        )
    )

    if not analysis_saved:
        raise HTTPException(
            status_code=404,
            detail=(
                "Diagnostic case "
                "not found."
            ),
        )

    return analysis