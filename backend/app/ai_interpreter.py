import json
import logging
import os

from openai import OpenAI


logger = logging.getLogger(__name__)


# =========================================================
# CURRENT SYMPTOM EVIDENCE
# =========================================================

ALLOWED_SYMPTOM_EVIDENCE = [
    # Engine / performance
    "loss_of_power",
    "under_acceleration",
    "hesitation",
    "engine_vibration",
    "whistling_noise",
    "unusual_noise",
    "hard_start",
    "engine_stall",
    "warning_light",
    "smoke",
    "overheating",

    # Safety systems
    "braking_issue",
    "steering_issue",

    # Generic / Other problems
    "transmission_issue",
    "electrical_issue",
    "suspension_issue",
    "fluid_leak",
    "hvac_issue",
]


# =========================================================
# VEHICLE HISTORY / CHARACTERISTICS
# =========================================================

ALLOWED_VEHICLE_CONTEXT_EVIDENCE = [
    "turbocharged",
    "biturbo",
    "naturally_aspirated",

    "hybrid_petrol",
    "hybrid_diesel",

    "stage_1_tune",
    "stage_2_tune",

    "automatic_transmission",
    "manual_transmission",
    "all_wheel_drive",

    "previous_egr_issue",
    "previous_dpf_issue",
    "previous_turbo_issue",
    "previous_turbo_repair",

    "recent_battery_replacement",

    "previous_cooling_issue",
    "previous_ignition_issue",
    "previous_braking_issue",
]


def extract_case_evidence(
    description: str,
    vehicle_context: str,
    language: str,
) -> dict[str, list[str]]:
    if (
        not description.strip()
        and not vehicle_context.strip()
    ):
        return {
            "symptom_evidence": [],
            "vehicle_context_evidence": [],
        }

    api_key = os.getenv(
        "EXPLABS_API_KEY"
    )

    if not api_key:
        logger.warning(
            "AI interpretation skipped: "
            "EXPLABS_API_KEY is not configured."
        )

        return {
            "symptom_evidence": [],
            "vehicle_context_evidence": [],
        }

    try:
        client = OpenAI(
            api_key=api_key,
            base_url=(
                "https://api.experientiallabs.ai/v1"
            ),
        )

        response = (
            client.chat.completions.create(
                model="gpt-5.6-luna",

                messages=[
                    {
                        "role": "system",

                        "content": (
                            "You extract structured automotive evidence. "

                            "Do not diagnose the vehicle. "
                            "Do not guess which component is defective. "
                            "Do not invent information. "

                            "Only return evidence explicitly supported "
                            "by the driver's current symptom description "
                            "or by the additional vehicle information. "

                            "Keep CURRENT symptoms separate from "
                            "VEHICLE HISTORY and vehicle characteristics. "

                            "A previous repair or previous problem must "
                            "not automatically be treated as a current symptom. "

                            "For current symptoms, classify only observable "
                            "behavior described by the driver. "

                            "Use 'transmission_issue' when the driver "
                            "explicitly describes abnormal gear changes, "
                            "delayed engagement, slipping, jerking during "
                            "gear changes, or another transmission-related behavior. "

                            "Use 'electrical_issue' when the driver "
                            "explicitly describes electrical equipment behaving "
                            "abnormally, such as lights flickering, displays "
                            "turning off, or electrical accessories failing. "

                            "Use 'suspension_issue' when the driver explicitly "
                            "describes suspension-related behavior such as "
                            "knocking over bumps, abnormal bouncing, or "
                            "suspension noise. "

                            "Use 'fluid_leak' when the driver explicitly "
                            "reports visible fluid leaking from the vehicle. "

                            "Use 'hvac_issue' when the driver explicitly "
                            "describes heating, ventilation, or air-conditioning "
                            "not working correctly. "

                            "Do not use these generic evidence values unless "
                            "the description clearly supports them. "

                            "If the vehicle is described as a hybrid and "
                            "the combustion fuel is explicitly stated, use "
                            "'hybrid_petrol' or 'hybrid_diesel'. "

                            "Do not infer the hybrid combustion fuel if it "
                            "is not explicitly stated."
                        ),
                    },

                    {
                        "role": "user",

                        "content": (
                            f"Language: {language}\n\n"

                            "CURRENT SYMPTOM DESCRIPTION:\n"
                            f"{description}\n\n"

                            "ADDITIONAL VEHICLE INFORMATION:\n"
                            f"{vehicle_context}"
                        ),
                    },
                ],

                response_format={
                    "type": "json_schema",

                    "json_schema": {
                        "name":
                            "automotive_case_evidence",

                        "strict":
                            True,

                        "schema": {
                            "type": "object",

                            "properties": {
                                "symptom_evidence": {
                                    "type": "array",

                                    "items": {
                                        "type": "string",

                                        "enum":
                                            ALLOWED_SYMPTOM_EVIDENCE,
                                    },
                                },

                                "vehicle_context_evidence": {
                                    "type": "array",

                                    "items": {
                                        "type": "string",

                                        "enum":
                                            ALLOWED_VEHICLE_CONTEXT_EVIDENCE,
                                    },
                                },
                            },

                            "required": [
                                "symptom_evidence",
                                "vehicle_context_evidence",
                            ],

                            "additionalProperties":
                                False,
                        },
                    },
                },
            )
        )

        content = (
            response
            .choices[0]
            .message
            .content
        )

        if not content:
            return {
                "symptom_evidence": [],
                "vehicle_context_evidence": [],
            }

        result = json.loads(
            content
        )

        symptom_evidence = [
            item

            for item in result.get(
                "symptom_evidence",
                [],
            )

            if item
            in ALLOWED_SYMPTOM_EVIDENCE
        ]

        vehicle_context_evidence = [
            item

            for item in result.get(
                "vehicle_context_evidence",
                [],
            )

            if item
            in ALLOWED_VEHICLE_CONTEXT_EVIDENCE
        ]

        return {
            "symptom_evidence":
                symptom_evidence,

            "vehicle_context_evidence":
                vehicle_context_evidence,
        }

    except Exception as error:
        logger.warning(
            "AI interpretation unavailable: %s",
            error,
        )

        return {
            "symptom_evidence": [],
            "vehicle_context_evidence": [],
        }


# =========================================================
# BACKWARD COMPATIBILITY
# =========================================================

# Păstrăm această funcție pentru test_ai.py
# și pentru eventualele utilizări mai vechi.

def extract_text_evidence(
    description: str,
    language: str,
) -> list[str]:
    result = extract_case_evidence(
        description=description,
        vehicle_context="",
        language=language,
    )

    return result[
        "symptom_evidence"
    ]