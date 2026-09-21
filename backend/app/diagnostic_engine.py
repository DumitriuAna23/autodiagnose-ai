from app.ai_interpreter import extract_case_evidence
from app.knowledge_base import DIAGNOSTIC_RULES
from app.schemas import (
    DataQualityWarning,
    DiagnosticCaseCreate,
    DiagnosticEvidence,
    DiagnosticFinding,
    NextBestDiagnosticStep,
    TechnicalReference,
)


MIN_RELEVANCE_SCORE = 30
MAX_FINDINGS = 5


def normalize_fuel_type(
    fuel_type: str | None,
) -> str | None:
    if not fuel_type:
        return None

    normalized = fuel_type.strip().lower()

    aliases = {
        "petrol": "petrol",
        "gasoline": "petrol",
        "benzină": "petrol",
        "benzina": "petrol",

        "diesel": "diesel",
        "motorină": "diesel",
        "motorina": "diesel",

        "hybrid": "hybrid",
        "hibrid": "hybrid",

        "electric": "electric",
        "ev": "electric",
        "electrică": "electric",
        "electrica": "electric",
    }

    return aliases.get(
        normalized,
        normalized,
    )


def detect_data_quality_warnings(
    fuel_type: str | None,
    vehicle_context_evidence: list[str],
    vehicle_context_text: str,
    language: str,
) -> list[DataQualityWarning]:
    evidence = set(
        vehicle_context_evidence
    )

    raw_context = (
        vehicle_context_text
        .strip()
        .lower()
    )

    warnings: list[
        DataQualityWarning
    ] = []

    messages = {
        "ro": {
            "electric_combustion_conflict": (
                "Vehiculul este selectat ca electric, dar informațiile "
                "suplimentare descriu elemente specifice unui motor termic. "
                "Verifică tipul de propulsie și informațiile vehiculului."
            ),
            "petrol_hybrid_diesel_conflict": (
                "Combustibilul selectat este benzină, dar informațiile "
                "suplimentare descriu un sistem hibrid diesel. "
                "Verifică datele vehiculului."
            ),
            "diesel_hybrid_petrol_conflict": (
                "Combustibilul selectat este diesel, dar informațiile "
                "suplimentare descriu un sistem hibrid pe benzină. "
                "Verifică datele vehiculului."
            ),
            "hybrid_fuel_conflict": (
                "Informațiile vehiculului indică simultan hibrid pe benzină "
                "și hibrid diesel. Verifică motorizarea introdusă."
            ),
            "aspiration_conflict": (
                "Motorul este descris simultan ca aspirat și turbo/biturbo. "
                "Verifică informațiile despre motorizare."
            ),
            "transmission_conflict": (
                "Transmisia este descrisă simultan ca manuală și automată. "
                "Verifică informațiile vehiculului."
            ),
        },
        "en": {
            "electric_combustion_conflict": (
                "The vehicle is selected as electric, but the additional "
                "information describes combustion-engine-specific elements. "
                "Check the powertrain type and vehicle information."
            ),
            "petrol_hybrid_diesel_conflict": (
                "The selected fuel type is petrol, but the additional "
                "information describes a diesel hybrid system. "
                "Check the vehicle data."
            ),
            "diesel_hybrid_petrol_conflict": (
                "The selected fuel type is diesel, but the additional "
                "information describes a petrol hybrid system. "
                "Check the vehicle data."
            ),
            "hybrid_fuel_conflict": (
                "The vehicle information indicates both petrol-hybrid and "
                "diesel-hybrid powertrains. Check the entered engine data."
            ),
            "aspiration_conflict": (
                "The engine is described as both naturally aspirated and "
                "turbo/biturbo. Check the engine information."
            ),
            "transmission_conflict": (
                "The transmission is described as both manual and automatic. "
                "Check the vehicle information."
            ),
        },
    }

    selected_language = (
        language
        if language in messages
        else "en"
    )

    def add_warning(
        code: str,
    ) -> None:
        warnings.append(
            DataQualityWarning(
                code=code,
                level="warning",
                message=messages[
                    selected_language
                ][code],
            )
        )

    combustion_specific_evidence = {
        "turbocharged",
        "biturbo",
        "naturally_aspirated",
        "hybrid_petrol",
        "hybrid_diesel",
        "previous_egr_issue",
        "previous_dpf_issue",
        "previous_turbo_issue",
        "previous_turbo_repair",
        "previous_ignition_issue",
    }

    combustion_keywords = (
        "diesel",
        "motorină",
        "motorina",
        "benzină",
        "benzina",
        "petrol",
        "gasoline",
        "turbo",
        "biturbo",
        "egr",
        "dpf",
        "injector",
        "injectoare",
        "spark plug",
        "bujie",
        "bujii",
        "combustion engine",
        "motor termic",
    )

    has_combustion_text = any(
        keyword in raw_context
        for keyword in combustion_keywords
    )

    if (
        fuel_type == "electric"
        and (
            evidence.intersection(
                combustion_specific_evidence
            )
            or has_combustion_text
        )
    ):
        add_warning(
            "electric_combustion_conflict"
        )

    if (
        fuel_type == "petrol"
        and "hybrid_diesel" in evidence
    ):
        add_warning(
            "petrol_hybrid_diesel_conflict"
        )

    if (
        fuel_type == "diesel"
        and "hybrid_petrol" in evidence
    ):
        add_warning(
            "diesel_hybrid_petrol_conflict"
        )

    if (
        "hybrid_petrol" in evidence
        and "hybrid_diesel" in evidence
    ):
        add_warning(
            "hybrid_fuel_conflict"
        )

    naturally_aspirated_text = any(
        keyword in raw_context
        for keyword in (
            "naturally aspirated",
            "aspirat",
            "aspirated",
        )
    )

    turbo_text = any(
        keyword in raw_context
        for keyword in (
            "turbo",
            "biturbo",
        )
    )

    if (
        (
            "naturally_aspirated"
            in evidence
            and (
                "turbocharged"
                in evidence
                or "biturbo"
                in evidence
            )
        )
        or (
            naturally_aspirated_text
            and turbo_text
        )
    ):
        add_warning(
            "aspiration_conflict"
        )

    manual_text = any(
        keyword in raw_context
        for keyword in (
            "manual transmission",
            "manual gearbox",
            "cutie manuală",
            "cutie manuala",
            "transmisie manuală",
            "transmisie manuala",
        )
    )

    automatic_text = any(
        keyword in raw_context
        for keyword in (
            "automatic transmission",
            "automatic gearbox",
            "cutie automată",
            "cutie automata",
            "transmisie automată",
            "transmisie automata",
        )
    )

    if (
        (
            "automatic_transmission"
            in evidence
            and "manual_transmission"
            in evidence
        )
        or (
            manual_text
            and automatic_text
        )
    ):
        add_warning(
            "transmission_conflict"
        )

    return warnings


def rule_applies_to_vehicle(
    rule: dict,
    fuel_type: str | None,
    vehicle_context_evidence: list[str],
) -> bool:
    applicable_fuel_types = rule.get(
        "applicable_fuel_types"
    )

    # Regulă generală:
    # dacă nu are restricții de combustibil,
    # rămâne disponibilă.
    if not applicable_fuel_types:
        return True

    normalized_allowed = {
        normalize_fuel_type(item)
        for item in applicable_fuel_types
    }

    # Dacă tipul de combustibil nu este cunoscut,
    # nu eliminăm regula doar din lipsă de date.
    if fuel_type is None:
        return True

    # Pentru vehicule normale:
    # petrol, diesel, electric.
    if fuel_type != "hybrid":
        return (
            fuel_type
            in normalized_allowed
        )

    # =====================================================
    # HYBRID
    # =====================================================

    # Dacă regula este explicit compatibilă
    # cu orice vehicul hybrid, o păstrăm.
    if "hybrid" in normalized_allowed:
        return True

    # Dacă AI-ul a identificat explicit
    # un hybrid cu motor pe benzină,
    # permitem regulile petrol.
    if (
        "hybrid_petrol"
        in vehicle_context_evidence
        and "petrol"
        in normalized_allowed
    ):
        return True

    # Dacă AI-ul a identificat explicit
    # un hybrid diesel,
    # permitem regulile diesel.
    if (
        "hybrid_diesel"
        in vehicle_context_evidence
        and "diesel"
        in normalized_allowed
    ):
        return True

    # Dacă utilizatorul a spus doar "hybrid",
    # nu presupunem dacă motorul termic
    # este benzină sau diesel.
    return False


def rule_applies_to_context(
    rule: dict,
    vehicle_context_evidence: list[str],
) -> bool:
    excluded_context = rule.get(
        "excluded_context_evidence",
        [],
    )

    for evidence in vehicle_context_evidence:
        if evidence in excluded_context:
            return False

    return True


def build_technical_references(
    rule: dict,
    score_breakdown: list[DiagnosticEvidence],
    language: str,
) -> list[TechnicalReference]:
    rule_id = str(
        rule.get(
            "rule_id",
            "KB-UNKNOWN",
        )
    )

    references: list[
        TechnicalReference
    ] = []

    probable_cause_data = (
        rule.get(
            "probable_cause",
            {},
        )
        or {}
    )

    description_data = (
        rule.get(
            "description",
            {},
        )
        or {}
    )

    rule_title = str(
        probable_cause_data.get(
            language,
            probable_cause_data.get(
                "en",
                rule_id,
            ),
        )
    )

    rule_description = str(
        description_data.get(
            language,
            description_data.get(
                "en",
                "",
            ),
        )
    )

    symptom_names = {
        "ro": {
            "warning": "martor de avertizare",
            "power": "pierdere de putere",
            "starting": "problemă la pornire",
            "noise": "zgomot neobișnuit",
            "temperature": "temperatură / supraîncălzire",
            "braking": "problemă la frânare",
            "steering": "problemă la direcție",
            "smoke": "fum",
            "other": "alt simptom",
        },
        "en": {
            "warning": "warning light",
            "power": "loss of power",
            "starting": "starting problem",
            "noise": "unusual noise",
            "temperature": "temperature / overheating",
            "braking": "braking issue",
            "steering": "steering issue",
            "smoke": "smoke",
            "other": "other symptom",
        },
    }

    evidence_names = {
        "ro": {
            "loss_of_power": "pierdere de putere",
            "under_acceleration": "problemă la accelerație",
            "hesitation": "ezitare",
            "engine_vibration": "vibrații ale motorului",
            "whistling_noise": "șuierat",
            "unusual_noise": "zgomot neobișnuit",
            "hard_start": "pornire dificilă",
            "engine_stall": "oprirea motorului",
            "warning_light": "martor aprins",
            "smoke": "fum",
            "overheating": "supraîncălzire",
            "braking_issue": "problemă la frânare",
            "steering_issue": "problemă la direcție",
            "transmission_issue": "problemă la transmisie",
            "electrical_issue": "problemă electrică",
            "suspension_issue": "problemă la suspensie",
            "fluid_leak": "pierdere de lichid",
            "hvac_issue": "problemă HVAC",
        },
        "en": {
            "loss_of_power": "loss of power",
            "under_acceleration": "under acceleration",
            "hesitation": "hesitation",
            "engine_vibration": "engine vibration",
            "whistling_noise": "whistling noise",
            "unusual_noise": "unusual noise",
            "hard_start": "hard start",
            "engine_stall": "engine stall",
            "warning_light": "warning light",
            "smoke": "smoke",
            "overheating": "overheating",
            "braking_issue": "braking issue",
            "steering_issue": "steering issue",
            "transmission_issue": "transmission issue",
            "electrical_issue": "electrical issue",
            "suspension_issue": "suspension issue",
            "fluid_leak": "fluid leak",
            "hvac_issue": "HVAC issue",
        },
    }

    selected_language = (
        language
        if language in symptom_names
        else "en"
    )

    criteria_parts: list[str] = []

    symptom_weights = (
        rule.get(
            "symptom_weights",
            {},
        )
        or {}
    )

    if symptom_weights:
        readable_symptoms = [
            symptom_names[
                selected_language
            ].get(
                key,
                key,
            )
            for key in symptom_weights.keys()
        ]

        if selected_language == "ro":
            criteria_parts.append(
                "simptome: "
                + ", ".join(
                    readable_symptoms
                )
            )
        else:
            criteria_parts.append(
                "symptoms: "
                + ", ".join(
                    readable_symptoms
                )
            )

    text_evidence_weights = (
        rule.get(
            "text_evidence_weights",
            {},
        )
        or {}
    )

    if text_evidence_weights:
        readable_text_evidence = [
            evidence_names[
                selected_language
            ].get(
                key,
                key,
            )
            for key in text_evidence_weights.keys()
        ]

        if selected_language == "ro":
            criteria_parts.append(
                "descriere interpretată: "
                + ", ".join(
                    readable_text_evidence
                )
            )
        else:
            criteria_parts.append(
                "interpreted description: "
                + ", ".join(
                    readable_text_evidence
                )
            )

    adaptive_weights = (
        rule.get(
            "adaptive_weights",
            {},
        )
        or {}
    )

    if adaptive_weights:
        if selected_language == "ro":
            criteria_parts.append(
                "răspunsuri la întrebările adaptive"
            )
        else:
            criteria_parts.append(
                "adaptive-question answers"
            )

    dtc_weights = (
        rule.get(
            "dtc_weights",
            {},
        )
        or {}
    )

    if dtc_weights:
        if selected_language == "ro":
            criteria_parts.append(
                "coduri DTC: "
                + ", ".join(
                    dtc_weights.keys()
                )
            )
        else:
            criteria_parts.append(
                "DTC codes: "
                + ", ".join(
                    dtc_weights.keys()
                )
            )

    context_weights = (
        rule.get(
            "context_weights",
            {},
        )
        or {}
    )

    if context_weights:
        if selected_language == "ro":
            criteria_parts.append(
                "istoric și context al vehiculului"
            )
        else:
            criteria_parts.append(
                "vehicle history and context"
            )

    if selected_language == "ro":
        kb_title = (
            "Ce reprezintă regula: "
            + rule_title
        )

        kb_note = rule_description

        if criteria_parts:
            kb_note += (
                "\n\nRegula poate lua în calcul: "
                + "; ".join(
                    criteria_parts
                )
                + "."
            )
    else:
        kb_title = (
            "What this rule represents: "
            + rule_title
        )

        kb_note = rule_description

        if criteria_parts:
            kb_note += (
                "\n\nThe rule can consider: "
                + "; ".join(
                    criteria_parts
                )
                + "."
            )

    references.append(
        TechnicalReference(
            reference_type=(
                "knowledge_base_rule"
            ),
            identifier=rule_id,
            title=kb_title,
            note=kb_note,
            matched_in_case=True,
        )
    )

    configured_dtc_codes = list(
        (
            rule.get(
                "dtc_weights",
                {},
            )
            or {}
        ).keys()
    )

    if configured_dtc_codes:
        matched_dtc_codes = {
            evidence.label
            for evidence in score_breakdown
            if evidence.source == "dtc"
        }

        # The evidence label for DTC entries may contain extra text,
        # so detect configured codes inside the generated labels.
        matched_configured_codes = [
            code
            for code in configured_dtc_codes
            if any(
                code in label
                for label in matched_dtc_codes
            )
        ]

        dtc_identifier = ", ".join(
            configured_dtc_codes
        )

        has_matched_dtc = bool(
            matched_configured_codes
        )

        if language == "ro":
            dtc_title = (
                "Mapare DTC OBD-II configurată pentru această regulă"
            )

            if has_matched_dtc:
                dtc_note = (
                    "Cel puțin un cod DTC din această mapare a fost "
                    "prezent în caz și a contribuit la scor."
                )
            else:
                dtc_note = (
                    "Aceste coduri sunt asociate regulii în baza de "
                    "cunoștințe, dar nu au contribuit la acest caz."
                )

            standard_title = (
                "Familie de standarde pentru coduri DTC generice OBD-II"
            )
            standard_note = (
                "Referință de familie: SAE J2012 / ISO 15031-6. "
                "Pentru proceduri specifice unui model trebuie consultată "
                "documentația tehnică a producătorului."
            )
        else:
            dtc_title = (
                "OBD-II DTC mapping configured for this rule"
            )

            if has_matched_dtc:
                dtc_note = (
                    "At least one DTC in this mapping was present in the "
                    "case and contributed to the score."
                )
            else:
                dtc_note = (
                    "These codes are associated with the rule in the "
                    "knowledge base, but they did not contribute to this case."
                )

            standard_title = (
                "Generic OBD-II DTC standards family"
            )
            standard_note = (
                "Standards-family reference: SAE J2012 / ISO 15031-6. "
                "Model-specific procedures require manufacturer service "
                "information."
            )

        references.append(
            TechnicalReference(
                reference_type="obd_dtc",
                identifier=dtc_identifier,
                title=dtc_title,
                note=dtc_note,
                matched_in_case=(
                    has_matched_dtc
                ),
            )
        )

        references.append(
            TechnicalReference(
                reference_type=(
                    "standard_family"
                ),
                identifier=(
                    "SAE J2012 / ISO 15031-6"
                ),
                title=standard_title,
                note=standard_note,
                matched_in_case=False,
            )
        )

    return references


def get_evidence_strength(
    score_breakdown: list[DiagnosticEvidence],
) -> tuple[str, int]:
    evidence_sources = {
        evidence.source
        for evidence in score_breakdown
        if evidence.source != "base"
    }

    source_count = len(
        evidence_sources
    )

    has_dtc = (
        "dtc"
        in evidence_sources
    )

    # DTC + at least one independent source
    # is considered strong evidence.
    if (
        source_count >= 3
        or (
            has_dtc
            and source_count >= 2
        )
    ):
        return (
            "strong",
            source_count,
        )

    if source_count == 2:
        return (
            "moderate",
            source_count,
        )

    return (
        "limited",
        source_count,
    )


def get_rule_urgency(
    rule: dict,
) -> str:
    configured_urgency = rule.get(
        "urgency"
    )

    if configured_urgency in (
        "monitor",
        "service_soon",
        "stop_driving",
    ):
        return configured_urgency

    severity = str(
        rule.get(
            "severity",
            "medium",
        )
    ).lower()

    if severity == "low":
        return "monitor"

    return "service_soon"


def get_safety_message(
    rule: dict,
    language: str,
    urgency: str,
) -> str:
    configured_message = rule.get(
        "safety_message"
    )

    if isinstance(
        configured_message,
        dict,
    ):
        message = (
            configured_message.get(
                language
            )
            or configured_message.get(
                "en"
            )
        )

        if message:
            return str(message)

    default_messages = {
        "ro": {
            "monitor": (
                "Monitorizează problema. Dacă persistă, "
                "se agravează sau apar simptome noi, "
                "programează o verificare."
            ),
            "service_soon": (
                "Vehiculul ar trebui verificat cât mai curând. "
                "Până la diagnosticare, evită solicitarea intensă "
                "și urmărește dacă problema se agravează."
            ),
            "stop_driving": (
                "Nu continua deplasarea dacă această problemă este "
                "prezentă sau se agravează. Oprește vehiculul în "
                "siguranță și solicită asistență."
            ),
        },
        "en": {
            "monitor": (
                "Monitor the problem. If it persists, worsens, "
                "or new symptoms appear, arrange an inspection."
            ),
            "service_soon": (
                "The vehicle should be inspected soon. Until it is "
                "diagnosed, avoid heavy use and watch for worsening symptoms."
            ),
            "stop_driving": (
                "Do not continue driving if this problem is present "
                "or worsening. Stop the vehicle safely and seek assistance."
            ),
        },
    }

    selected_language = (
        language
        if language in default_messages
        else "en"
    )

    return default_messages[
        selected_language
    ][urgency]


def get_evidence_label(
    source: str,
    evidence: str,
    language: str,
) -> str:
    labels = {
        "ro": {
            "base":
                "Scor de bază",

            "power": (
                "Simptom raportat: lipsă de putere "
                "sau accelerație slabă"
            ),

            "starting": (
                "Simptom raportat: problemă la pornire "
                "sau funcționarea motorului"
            ),

            "noise": (
                "Simptom raportat: zgomot sau "
                "vibrații neobișnuite"
            ),

            "smoke": (
                "Simptom raportat: fum sau miros "
                "neobișnuit"
            ),

            "warning": (
                "Simptom raportat: martor aprins "
                "în bord"
            ),

            "brakes": (
                "Simptom raportat: problemă la "
                "frânare sau direcție"
            ),

            "temperature": (
                "Simptom raportat: supraîncălzire "
                "sau problemă de temperatură"
            ),

            "other": (
                "Simptom raportat: altă problemă"
            ),

            "performance_change=yes": (
                "Schimbare de performanță raportată"
            ),

            "warning_light=yes": (
                "Martor de avertizare raportat"
            ),

            "frequency=always": (
                "Problema apare permanent"
            ),

            "onset=sudden": (
                "Problema a apărut brusc"
            ),

            # AI symptom evidence

            "loss_of_power": (
                "AI a identificat lipsă de putere "
                "în descriere"
            ),

            "under_acceleration": (
                "AI a identificat că problema apare "
                "la accelerație"
            ),

            "whistling_noise": (
                "AI a identificat un zgomot "
                "de șuierat"
            ),

            "hesitation": (
                "AI a identificat ezitare "
                "la accelerație"
            ),

            "engine_vibration": (
                "AI a identificat vibrații "
                "ale motorului"
            ),

            "warning_light": (
                "AI a identificat un martor "
                "de avertizare"
            ),

            "unusual_noise": (
                "AI a identificat un zgomot "
                "neobișnuit"
            ),

            "hard_start": (
                "AI a identificat dificultăți "
                "la pornirea motorului"
            ),

            "engine_stall": (
                "AI a identificat oprirea "
                "neașteptată a motorului"
            ),

            "smoke": (
                "AI a identificat fum "
                "în descriere"
            ),

            "overheating": (
                "AI a identificat simptome "
                "de supraîncălzire"
            ),

            "braking_issue": (
                "AI a identificat o problemă "
                "la frânare"
            ),

            "steering_issue": (
                "AI a identificat o problemă "
                "la direcție"
            ),

            "transmission_issue": (
                "AI a identificat o problemă "
                "la transmisie"
            ),

            "electrical_issue": (
                "AI a identificat o problemă "
                "la sistemul electric"
            ),

            "suspension_issue": (
                "AI a identificat o problemă "
                "la suspensie"
            ),

            "fluid_leak": (
                "AI a identificat o pierdere "
                "de lichid"
            ),

            "hvac_issue": (
                "AI a identificat o problemă "
                "la climatizare sau ventilație"
            ),

            # Vehicle context

            "turbocharged": (
                "Vehicul raportat cu motor turbo"
            ),

            "biturbo": (
                "Vehicul raportat cu sistem biturbo"
            ),

            "naturally_aspirated": (
                "Vehicul raportat cu motor aspirat"
            ),

            "hybrid_petrol": (
                "Vehicul hibrid cu motor termic "
                "pe benzină raportat"
            ),

            "hybrid_diesel": (
                "Vehicul hibrid cu motor termic "
                "diesel raportat"
            ),

            "stage_1_tune": (
                "Modificare software Stage 1 "
                "raportată"
            ),

            "stage_2_tune": (
                "Modificare software Stage 2 "
                "raportată"
            ),

            "automatic_transmission": (
                "Transmisie automată raportată"
            ),

            "manual_transmission": (
                "Transmisie manuală raportată"
            ),

            "all_wheel_drive": (
                "Tracțiune integrală raportată"
            ),

            "previous_egr_issue": (
                "Problemă EGR raportată în "
                "istoricul vehiculului"
            ),

            "previous_dpf_issue": (
                "Problemă DPF raportată în "
                "istoricul vehiculului"
            ),

            "previous_turbo_issue": (
                "Problemă turbo raportată în "
                "istoricul vehiculului"
            ),

            "previous_turbo_repair": (
                "Reparație anterioară la "
                "sistemul turbo"
            ),

            "recent_battery_replacement": (
                "Înlocuire recentă a bateriei "
                "raportată"
            ),

            "previous_cooling_issue": (
                "Problemă anterioară la "
                "sistemul de răcire"
            ),

            "previous_ignition_issue": (
                "Problemă anterioară la "
                "sistemul de aprindere"
            ),

            "previous_braking_issue": (
                "Problemă anterioară la "
                "sistemul de frânare"
            ),
        },

        "en": {
            "base":
                "Base score",

            "power": (
                "Reported symptom: loss of power "
                "or weak acceleration"
            ),

            "starting": (
                "Reported symptom: starting or "
                "engine running problem"
            ),

            "noise": (
                "Reported symptom: unusual noise "
                "or vibration"
            ),

            "smoke": (
                "Reported symptom: smoke or "
                "unusual smell"
            ),

            "warning": (
                "Reported symptom: dashboard "
                "warning light"
            ),

            "brakes": (
                "Reported symptom: braking or "
                "steering problem"
            ),

            "temperature": (
                "Reported symptom: overheating "
                "or temperature problem"
            ),

            "other": (
                "Reported symptom: another problem"
            ),

            "performance_change=yes": (
                "Performance change reported"
            ),

            "warning_light=yes": (
                "Warning light reported"
            ),

            "frequency=always": (
                "Problem occurs continuously"
            ),

            "onset=sudden": (
                "Problem started suddenly"
            ),

            # AI symptom evidence

            "loss_of_power": (
                "AI identified loss of power "
                "in the description"
            ),

            "under_acceleration": (
                "AI identified that the problem "
                "occurs under acceleration"
            ),

            "whistling_noise": (
                "AI identified a whistling noise"
            ),

            "hesitation": (
                "AI identified hesitation "
                "under acceleration"
            ),

            "engine_vibration": (
                "AI identified engine vibration"
            ),

            "warning_light": (
                "AI identified a warning light"
            ),

            "unusual_noise": (
                "AI identified an unusual noise"
            ),

            "hard_start": (
                "AI identified difficulty "
                "starting the engine"
            ),

            "engine_stall": (
                "AI identified unexpected "
                "engine stalling"
            ),

            "smoke": (
                "AI identified smoke "
                "in the description"
            ),

            "overheating": (
                "AI identified overheating "
                "symptoms"
            ),

            "braking_issue": (
                "AI identified a braking problem"
            ),

            "steering_issue": (
                "AI identified a steering problem"
            ),

            "transmission_issue": (
                "AI identified a transmission problem"
            ),

            "electrical_issue": (
                "AI identified an electrical-system problem"
            ),

            "suspension_issue": (
                "AI identified a suspension problem"
            ),

            "fluid_leak": (
                "AI identified a vehicle fluid leak"
            ),

            "hvac_issue": (
                "AI identified an HVAC problem"
            ),

            # Vehicle context

            "turbocharged": (
                "Vehicle reported with a "
                "turbocharged engine"
            ),

            "biturbo": (
                "Vehicle reported with "
                "a biturbo system"
            ),

            "naturally_aspirated": (
                "Vehicle reported with a "
                "naturally aspirated engine"
            ),

            "hybrid_petrol": (
                "Hybrid vehicle with petrol "
                "combustion engine reported"
            ),

            "hybrid_diesel": (
                "Hybrid vehicle with diesel "
                "combustion engine reported"
            ),

            "stage_1_tune": (
                "Stage 1 software modification "
                "reported"
            ),

            "stage_2_tune": (
                "Stage 2 software modification "
                "reported"
            ),

            "automatic_transmission": (
                "Automatic transmission reported"
            ),

            "manual_transmission": (
                "Manual transmission reported"
            ),

            "all_wheel_drive": (
                "All-wheel drive reported"
            ),

            "previous_egr_issue": (
                "Previous EGR issue reported "
                "in vehicle history"
            ),

            "previous_dpf_issue": (
                "Previous DPF issue reported "
                "in vehicle history"
            ),

            "previous_turbo_issue": (
                "Previous turbo issue reported "
                "in vehicle history"
            ),

            "previous_turbo_repair": (
                "Previous turbo-system "
                "repair reported"
            ),

            "recent_battery_replacement": (
                "Recent battery replacement "
                "reported"
            ),

            "previous_cooling_issue": (
                "Previous cooling-system "
                "issue reported"
            ),

            "previous_ignition_issue": (
                "Previous ignition-system "
                "issue reported"
            ),

            "previous_braking_issue": (
                "Previous braking-system "
                "issue reported"
            ),
        },
    }

    if source == "dtc":
        if language == "ro":
            return (
                f"Cod DTC detectat: {evidence}"
            )

        return (
            f"DTC code detected: {evidence}"
        )

    language_labels = labels.get(
        language,
        labels["en"],
    )

    return language_labels.get(
        evidence,
        evidence.replace(
            "_",
            " ",
        ),
    )


def build_next_best_steps(
    findings: list[DiagnosticFinding],
    diagnostic_case: DiagnosticCaseCreate,
    language: str,
) -> list[NextBestDiagnosticStep]:
    steps: list[
        NextBestDiagnosticStep
    ] = []

    priority = 1

    dtc_codes = [
        code.strip()
        for code in diagnostic_case.dtc_codes
        if code.strip()
    ]

    # If there are no DTC codes, an OBD-II scan can add
    # an independent diagnostic evidence source.
    if not dtc_codes:
        if language == "ro":
            title = (
                "Citește codurile DTC cu un tester OBD-II"
            )
            action = (
                "Conectează un tester OBD-II și verifică dacă "
                "există coduri de eroare memorate sau active."
            )
            reason = (
                "Un cod DTC poate adăuga o sursă independentă de "
                "dovezi și poate ajuta la diferențierea cauzelor "
                "afișate."
            )
        else:
            title = (
                "Read DTC codes with an OBD-II scanner"
            )
            action = (
                "Connect an OBD-II scanner and check for stored "
                "or active diagnostic trouble codes."
            )
            reason = (
                "A DTC can add an independent evidence source and "
                "help distinguish between the displayed causes."
            )

        steps.append(
            NextBestDiagnosticStep(
                id="read_dtc_codes",
                priority=priority,
                title=title,
                action=action,
                reason=reason,
                related_cause=None,
            )
        )

        priority += 1

    # Use the first diagnostic check from the two highest-ranked
    # causes. This keeps the recommendation deterministic and
    # directly linked to the existing knowledge base.
    used_actions: set[str] = set()

    for index, finding in enumerate(
        findings[:2]
    ):
        if not finding.recommended_checks:
            continue

        action = (
            finding
            .recommended_checks[0]
            .strip()
        )

        if (
            not action
            or action.lower()
            in used_actions
        ):
            continue

        used_actions.add(
            action.lower()
        )

        if language == "ro":
            if index == 0:
                title = (
                    "Verifică mai întâi cauza principală"
                )
                reason = (
                    "Aceasta este verificarea recomandată pentru "
                    "cauza cu cel mai mare scor de relevanță și "
                    "poate ajuta la confirmarea sau eliminarea ei."
                )
            else:
                title = (
                    "Diferențiază a doua cauză posibilă"
                )
                reason = (
                    "Această verificare poate ajuta la separarea "
                    "celei de-a doua cauze de rezultatul principal."
                )
        else:
            if index == 0:
                title = (
                    "Check the top-ranked cause first"
                )
                reason = (
                    "This is the recommended check for the cause "
                    "with the highest relevance score and can help "
                    "confirm or rule it out."
                )
            else:
                title = (
                    "Differentiate the second possible cause"
                )
                reason = (
                    "This check can help distinguish the second "
                    "possible cause from the top-ranked result."
                )

        steps.append(
            NextBestDiagnosticStep(
                id=f"finding_check_{index + 1}",
                priority=priority,
                title=title,
                action=action,
                reason=reason,
                related_cause=(
                    finding.probable_cause
                ),
            )
        )

        priority += 1

    return steps[:3]


def analyze_case(
    diagnostic_case: DiagnosticCaseCreate,
) -> tuple[
    list[DiagnosticFinding],
    list[DataQualityWarning],
    list[NextBestDiagnosticStep],
]:
    findings: list[
        DiagnosticFinding
    ] = []

    language = (
        diagnostic_case
        .language
        .lower()
    )

    if language not in (
        "ro",
        "en",
    ):
        language = "en"

    fuel_type = normalize_fuel_type(
        diagnostic_case
        .vehicle
        .fuel_type
    )

    symptom_categories = [
        symptom
        .category
        .strip()
        .lower()

        for symptom
        in diagnostic_case.symptoms
    ]

    dtc_codes = [
        code
        .strip()
        .upper()

        for code
        in diagnostic_case.dtc_codes
    ]

    adaptive_evidence = [
        f"{item.question_id}={item.answer}"
        .strip()
        .lower()

        for item
        in diagnostic_case.adaptive_answers
    ]

    descriptions = [
        symptom
        .description
        .strip()

        for symptom
        in diagnostic_case.symptoms

        if symptom
        .description
        .strip()
    ]

    combined_description = " ".join(
        descriptions
    )

    vehicle_context_text = ""

    if (
        diagnostic_case.vehicle_context
        and
        diagnostic_case
        .vehicle_context
        .additional_information
    ):
        vehicle_context_text = (
            diagnostic_case
            .vehicle_context
            .additional_information
            .strip()
        )

    # =====================================================
    # AI EVIDENCE EXTRACTION
    # =====================================================

    ai_evidence = extract_case_evidence(
        description=(
            combined_description
        ),
        vehicle_context=(
            vehicle_context_text
        ),
        language=language,
    )

    text_evidence = (
        ai_evidence.get(
            "symptom_evidence",
            [],
        )
    )

    vehicle_context_evidence = (
        ai_evidence.get(
            "vehicle_context_evidence",
            [],
        )
    )

    data_quality_warnings = (
        detect_data_quality_warnings(
            fuel_type=fuel_type,
            vehicle_context_evidence=(
                vehicle_context_evidence
            ),
            vehicle_context_text=(
                vehicle_context_text
            ),
            language=language,
        )
    )

    # =====================================================
    # DIAGNOSTIC RULES
    # =====================================================

    for rule in DIAGNOSTIC_RULES:

        # ---------------------------------------------
        # Fuel / powertrain compatibility
        # ---------------------------------------------

        if not rule_applies_to_vehicle(
            rule=rule,
            fuel_type=fuel_type,
            vehicle_context_evidence=(
                vehicle_context_evidence
            ),
        ):
            continue

        # ---------------------------------------------
        # Vehicle-context exclusions
        # Example:
        # naturally aspirated -> no turbo rules
        # ---------------------------------------------

        if not rule_applies_to_context(
            rule=rule,
            vehicle_context_evidence=(
                vehicle_context_evidence
            ),
        ):
            continue

        score = rule[
            "base_score"
        ]

        has_evidence = False

        score_breakdown: list[
            DiagnosticEvidence
        ] = [
            DiagnosticEvidence(
                label=get_evidence_label(
                    source="base",
                    evidence="base",
                    language=language,
                ),
                points=rule[
                    "base_score"
                ],
                source="base",
            )
        ]

        # =================================================
        # SYMPTOM CATEGORY
        # =================================================

        symptom_weights = rule.get(
            "symptom_weights",
            {},
        )

        for category in symptom_categories:
            if category in symptom_weights:
                points = (
                    symptom_weights[
                        category
                    ]
                )

                score += points
                has_evidence = True

                score_breakdown.append(
                    DiagnosticEvidence(
                        label=(
                            get_evidence_label(
                                source="symptom",
                                evidence=category,
                                language=language,
                            )
                        ),
                        points=points,
                        source="symptom",
                    )
                )

        # =================================================
        # DTC
        # =================================================

        dtc_weights = rule.get(
            "dtc_weights",
            {},
        )

        for code in dtc_codes:
            if code in dtc_weights:
                points = (
                    dtc_weights[
                        code
                    ]
                )

                score += points
                has_evidence = True

                score_breakdown.append(
                    DiagnosticEvidence(
                        label=(
                            get_evidence_label(
                                source="dtc",
                                evidence=code,
                                language=language,
                            )
                        ),
                        points=points,
                        source="dtc",
                    )
                )

        # =================================================
        # ADAPTIVE QUESTIONS
        # =================================================

        adaptive_weights = rule.get(
            "adaptive_weights",
            {},
        )

        for evidence in adaptive_evidence:
            if evidence in adaptive_weights:
                points = (
                    adaptive_weights[
                        evidence
                    ]
                )

                score += points
                has_evidence = True

                score_breakdown.append(
                    DiagnosticEvidence(
                        label=(
                            get_evidence_label(
                                source="adaptive",
                                evidence=evidence,
                                language=language,
                            )
                        ),
                        points=points,
                        source="adaptive",
                    )
                )

        # =================================================
        # AI CURRENT-SYMPTOM EVIDENCE
        # =================================================

        text_evidence_weights = rule.get(
            "text_evidence_weights",
            {},
        )

        for evidence in text_evidence:
            if (
                evidence
                in text_evidence_weights
            ):
                points = (
                    text_evidence_weights[
                        evidence
                    ]
                )

                score += points
                has_evidence = True

                score_breakdown.append(
                    DiagnosticEvidence(
                        label=(
                            get_evidence_label(
                                source="ai_text",
                                evidence=evidence,
                                language=language,
                            )
                        ),
                        points=points,
                        source="ai_text",
                    )
                )

        # =================================================
        # VEHICLE HISTORY / CONTEXT
        # =================================================

        context_weights = rule.get(
            "context_weights",
            {},
        )

        for evidence in (
            vehicle_context_evidence
        ):
            if evidence in context_weights:
                points = (
                    context_weights[
                        evidence
                    ]
                )

                score += points
                has_evidence = True

                score_breakdown.append(
                    DiagnosticEvidence(
                        label=(
                            get_evidence_label(
                                source=(
                                    "vehicle_context"
                                ),
                                evidence=evidence,
                                language=language,
                            )
                        ),
                        points=points,
                        source=(
                            "vehicle_context"
                        ),
                    )
                )

        # Dacă regula nu are nicio dovadă
        # concretă, nu o afișăm.
        if not has_evidence:
            continue

        raw_score = score

        final_score = min(
            raw_score,
            100,
        )

        urgency = get_rule_urgency(
            rule
        )

        safety_message = get_safety_message(
            rule=rule,
            language=language,
            urgency=urgency,
        )

        (
            evidence_strength,
            evidence_sources_count,
        ) = get_evidence_strength(
            score_breakdown
        )

        technical_references = (
            build_technical_references(
                rule=rule,
                score_breakdown=(
                    score_breakdown
                ),
                language=language,
            )
        )

        rule_id = str(
            rule.get(
                "rule_id",
                "KB-UNKNOWN",
            )
        )

        findings.append(
            DiagnosticFinding(
                probable_cause=(
                    rule[
                        "probable_cause"
                    ][language]
                ),

                confidence=(
                    final_score
                ),

                raw_score=(
                    raw_score
                ),

                severity=(
                    rule[
                        "severity"
                    ]
                ),

                description=(
                    rule[
                        "description"
                    ][language]
                ),

                recommended_checks=(
                    rule[
                        "recommended_checks"
                    ][language]
                ),

                score_breakdown=(
                    score_breakdown
                ),

                urgency=urgency,

                safety_message=(
                    safety_message
                ),

                evidence_strength=(
                    evidence_strength
                ),

                evidence_sources_count=(
                    evidence_sources_count
                ),

                rule_id=rule_id,

                technical_references=(
                    technical_references
                ),
            )
        )

    # =====================================================
    # QUALITY GATE
    # =====================================================

    findings = [
        finding
        for finding in findings
        if (
            finding.confidence
            >= MIN_RELEVANCE_SCORE
        )
    ]

    findings.sort(
        key=lambda finding: (
            finding.confidence
        ),
        reverse=True,
    )

    final_findings = findings[
        :MAX_FINDINGS
    ]

    next_best_steps = (
        build_next_best_steps(
            findings=final_findings,
            diagnostic_case=(
                diagnostic_case
            ),
            language=language,
        )
    )

    return (
        final_findings,
        data_quality_warnings,
        next_best_steps,
    )