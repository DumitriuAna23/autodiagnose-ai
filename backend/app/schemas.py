from typing import Literal

from pydantic import BaseModel, Field


class VehicleData(BaseModel):
    make: str = Field(min_length=1)
    model: str = Field(min_length=1)
    year: int | None = Field(
        default=None,
        ge=1980,
        le=2100,
    )
    engine: str | None = None
    fuel_type: str | None = None
    mileage_km: int | None = Field(
        default=None,
        ge=0,
    )


class VehicleContext(BaseModel):
    additional_information: str | None = None


class SymptomData(BaseModel):
    id: str
    category: str
    description: str = Field(
        min_length=1
    )


class AdaptiveAnswer(BaseModel):
    question_id: str
    question: str
    answer: str | list[str]
    symptom_id: str | None = None


class DiagnosticCaseCreate(BaseModel):
    language: Literal["ro", "en"]

    vehicle: VehicleData

    vehicle_context: (
        VehicleContext | None
    ) = None

    symptoms: list[
        SymptomData
    ] = Field(
        min_length=1
    )

    dtc_codes: list[str] = Field(
        default_factory=list
    )

    adaptive_answers: list[
        AdaptiveAnswer
    ] = Field(
        default_factory=list
    )

    additional_notes: str | None = None


class DiagnosticCaseResponse(BaseModel):
    case_id: str
    status: Literal["received"]
    message: str


class DiagnosticEvidence(BaseModel):
    label: str
    points: int
    source: str


class DataQualityWarning(BaseModel):
    code: str

    level: Literal[
        "info",
        "warning",
    ] = "warning"

    message: str


class NextBestDiagnosticStep(BaseModel):
    id: str
    priority: int = Field(
        ge=1
    )

    title: str
    action: str
    reason: str

    related_cause: str | None = None


class TechnicalReference(BaseModel):
    reference_type: Literal[
        "knowledge_base_rule",
        "obd_dtc",
        "standard_family",
    ]

    identifier: str
    title: str
    note: str | None = None

    matched_in_case: bool = False


class DiagnosticFinding(BaseModel):
    probable_cause: str
    confidence: int
    raw_score: int
    severity: str
    description: str
    recommended_checks: list[str]

    score_breakdown: list[
        DiagnosticEvidence
    ]

    # Defaults keep older cached analyses compatible.
    urgency: Literal[
        "monitor",
        "service_soon",
        "stop_driving",
    ] = "service_soon"

    safety_message: str = ""

    evidence_strength: Literal[
        "limited",
        "moderate",
        "strong",
    ] = "limited"

    evidence_sources_count: int = 0

    # Stable traceability identifier for the rule that
    # generated this finding.
    rule_id: str = ""

    # Technical traceability metadata. Defaults preserve
    # compatibility with analyses cached before Phase 3.27.
    technical_references: list[
        TechnicalReference
    ] = Field(
        default_factory=list
    )


class DiagnosticAnalysisResponse(BaseModel):
    case_id: str

    findings: list[
        DiagnosticFinding
    ]

    # Default keeps older cached analyses compatible.
    data_quality_warnings: list[
        DataQualityWarning
    ] = Field(
        default_factory=list
    )

    # Deterministic suggestions for what the user should
    # check next. Default keeps old cached analyses valid.
    next_best_steps: list[
        NextBestDiagnosticStep
    ] = Field(
        default_factory=list
    )


class DiagnosticCaseHistoryItem(BaseModel):
    case_id: str

    created_at: str | None = None
    analyzed_at: str | None = None

    language: Literal[
        "ro",
        "en",
    ]

    vehicle: VehicleData

    symptom_count: int = Field(
        ge=0
    )

    dtc_count: int = Field(
        ge=0
    )

    findings_count: int = Field(
        ge=0
    )

    top_finding: str | None = None

    top_score: int | None = Field(
        default=None,
        ge=0,
        le=100,
    )
