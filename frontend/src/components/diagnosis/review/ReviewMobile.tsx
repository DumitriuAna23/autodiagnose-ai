"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  API_BASE_URL,
} from "@/lib/config";


type Language =
  | "en"
  | "ro";


type FuelType =
  | "petrol"
  | "diesel"
  | "hybrid"
  | "electric";


type Vehicle = {
  manufacturer: string;
  manufacturer_verified: boolean;

  model: string;
  model_verified: boolean;

  fuel: FuelType;

  year:
    | number
    | null;

  vehicle_match:
    | "exact"
    | "partial";

  reference_model:
    | string
    | null;

  vehicle_context?: {
    additional_information?:
      | string
      | null;
  };
};


type SymptomCategory =
  | "power"
  | "starting"
  | "noise"
  | "smoke"
  | "warning"
  | "brakes"
  | "temperature"
  | "other";


type SymptomRecord = {
  id: string;

  primary_category:
    SymptomCategory;

  description: string;

  created_at: string;
};


type AdaptiveAnswer = {
  question_id: string;

  question?: string;

  answer: string;

  symptom_id: string;
};


type DiagnosticCaseResponse = {
  case_id: string;

  status?: string;

  message?: string;
};


const categoryLabels:
  Record<
    SymptomCategory,
    {
      en: string;
      ro: string;
      code: string;
    }
  > = {
  power: {
    en:
      "Loss of power / acceleration",

    ro:
      "Lipsă de putere / accelerație",

    code:
      "PWR",
  },

  starting: {
    en:
      "Starting / engine running",

    ro:
      "Pornire / funcționare motor",

    code:
      "ENG",
  },

  noise: {
    en:
      "Noise / vibration",

    ro:
      "Zgomot / vibrații",

    code:
      "NVH",
  },

  smoke: {
    en:
      "Smoke / smell",

    ro:
      "Fum / miros",

    code:
      "EXH",
  },

  warning: {
    en:
      "Dashboard warning",

    ro:
      "Martor în bord",

    code:
      "MIL",
  },

  brakes: {
    en:
      "Braking / steering",

    ro:
      "Frânare / direcție",

    code:
      "CHS",
  },

  temperature: {
    en:
      "Temperature / overheating",

    ro:
      "Temperatură / supraîncălzire",

    code:
      "TMP",
  },

  other: {
    en:
      "Other symptom",

    ro:
      "Alt simptom",

    code:
      "...",
  },
};


const questionLabels:
  Record<
    string,
    {
      en: string;
      ro: string;
    }
  > = {
  onset: {
    en:
      "How the problem began",

    ro:
      "Cum a început problema",
  },

  frequency: {
    en:
      "How often it happens",

    ro:
      "Cât de des apare",
  },

  performance_change: {
    en:
      "Vehicle behavior changed",

    ro:
      "Comportamentul mașinii s-a schimbat",
  },

  conditions: {
    en:
      "When the symptom is most noticeable",

    ro:
      "Când este simptomul cel mai evident",
  },

  warning_light: {
    en:
      "Dashboard warning light",

    ro:
      "Martor aprins în bord",
  },

  warning_behavior: {
    en:
      "Warning light behavior",

    ro:
      "Comportamentul martorului",
  },

  power_condition: {
    en:
      "When power loss is noticeable",

    ro:
      "Când apare lipsa de putere",
  },

  limp_mode: {
    en:
      "Strong acceleration limitation",

    ro:
      "Limitare puternică a accelerației",
  },

  crank_behavior: {
    en:
      "Starting behavior",

    ro:
      "Comportamentul la pornire",
  },

  temperature_start: {
    en:
      "Cold / warm starting",

    ro:
      "Pornire la rece / cald",
  },

  noise_condition: {
    en:
      "When noise or vibration occurs",

    ro:
      "Când apare zgomotul sau vibrația",
  },

  smoke_color: {
    en:
      "Smoke color",

    ro:
      "Culoarea fumului",
  },

  smoke_location: {
    en:
      "Smoke location",

    ro:
      "Locul de unde provine fumul",
  },

  brake_behavior: {
    en:
      "Braking / steering behavior",

    ro:
      "Comportamentul frânării / direcției",
  },

  temperature_behavior: {
    en:
      "Temperature behavior",

    ro:
      "Comportamentul temperaturii",
  },

  problem_area: {
    en:
      "Main problem area",

    ro:
      "Zona principală a problemei",
  },
};


const answerLabels:
  Record<
    string,
    {
      en: string;
      ro: string;
    }
  > = {
  sudden: {
    en:
      "Suddenly",

    ro:
      "Brusc",
  },

  gradual: {
    en:
      "Gradually",

    ro:
      "Treptat",
  },

  after_event: {
    en:
      "After an event",

    ro:
      "După un eveniment",
  },

  unknown: {
    en:
      "Not sure",

    ro:
      "Nu știu",
  },

  always: {
    en:
      "Always",

    ro:
      "Tot timpul",
  },

  intermittent: {
    en:
      "Intermittently",

    ro:
      "Intermitent",
  },

  once: {
    en:
      "Only once",

    ro:
      "O singură dată",
  },

  yes: {
    en:
      "Yes",

    ro:
      "Da",
  },

  no: {
    en:
      "No",

    ro:
      "Nu",
  },

  steady: {
    en:
      "Continuously",

    ro:
      "Continuu",
  },

  flashing: {
    en:
      "Flashing",

    ro:
      "Clipește",
  },

  acceleration: {
    en:
      "During acceleration",

    ro:
      "La accelerație",
  },

  uphill: {
    en:
      "When driving uphill",

    ro:
      "În rampă",
  },

  high_speed: {
    en:
      "At higher speed / RPM",

    ro:
      "La viteză / turație mai mare",
  },

  highway: {
    en:
      "At higher speed",

    ro:
      "La viteză mai mare",
  },

  idle: {
    en:
      "At idle",

    ro:
      "La ralanti",
  },

  cold_start: {
    en:
      "During cold start",

    ro:
      "La pornirea la rece",
  },

  hot_engine: {
    en:
      "With the engine warm",

    ro:
      "Cu motorul cald",
  },

  braking: {
    en:
      "During braking",

    ro:
      "La frânare",
  },

  turning: {
    en:
      "While turning",

    ro:
      "La virare",
  },

  random: {
    en:
      "No clear pattern",

    ro:
      "Fără un tipar clar",
  },

  cranks: {
    en:
      "Engine turns but does not start",

    ro:
      "Motorul se învârte, dar nu pornește",
  },

  click: {
    en:
      "Clicking sound",

    ro:
      "Se aud clicuri",
  },

  nothing: {
    en:
      "Almost nothing happens",

    ro:
      "Aproape nu se întâmplă nimic",
  },

  starts_then_stalls: {
    en:
      "Starts and then stops",

    ro:
      "Pornește și apoi se oprește",
  },

  cold: {
    en:
      "Cold",

    ro:
      "Rece",
  },

  warm: {
    en:
      "Warm",

    ro:
      "Caldă",
  },

  both: {
    en:
      "Both",

    ro:
      "Ambele",
  },

  speed: {
    en:
      "Increases with speed",

    ro:
      "Crește odată cu viteza",
  },

  black: {
    en:
      "Black",

    ro:
      "Negru",
  },

  white: {
    en:
      "White",

    ro:
      "Alb",
  },

  blue: {
    en:
      "Blue / blue-grey",

    ro:
      "Albastru / albăstrui",
  },

  exhaust: {
    en:
      "Exhaust",

    ro:
      "Eșapament",
  },

  engine_bay: {
    en:
      "Engine compartment",

    ro:
      "Compartimentul motor",
  },

  soft_pedal: {
    en:
      "Soft brake pedal",

    ro:
      "Pedală de frână moale",
  },

  hard_pedal: {
    en:
      "Hard brake pedal",

    ro:
      "Pedală de frână tare",
  },

  pulling: {
    en:
      "Vehicle pulls to one side",

    ro:
      "Mașina trage într-o parte",
  },

  steering: {
    en:
      "Abnormal steering",

    ro:
      "Direcție anormală",
  },

  noise: {
    en:
      "Noise during braking",

    ro:
      "Zgomot la frânare",
  },

  gauge_high: {
    en:
      "Temperature gauge rises high",

    ro:
      "Indicatorul de temperatură urcă mult",
  },

  warning: {
    en:
      "Temperature warning",

    ro:
      "Martor de temperatură",
  },

  steam: {
    en:
      "Steam visible",

    ro:
      "Se vede abur",
  },

  coolant_loss: {
    en:
      "Coolant loss",

    ro:
      "Pierdere lichid de răcire",
  },

  engine: {
    en:
      "Engine / acceleration",

    ro:
      "Motor / accelerație",
  },

  driving: {
    en:
      "While driving",

    ro:
      "În timpul deplasării",
  },

  electrical: {
    en:
      "Electrical equipment",

    ro:
      "Echipamente electrice",
  },

  inside: {
    en:
      "Inside the cabin",

    ro:
      "În interiorul mașinii",
  },
};


function normalizeAnswers(
  value:
    unknown
): AdaptiveAnswer[] {
  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }


  const normalized:
    AdaptiveAnswer[] = [];


  value.forEach(
    (
      item
    ) => {
      if (
        typeof item !==
          "object" ||
        item ===
          null
      ) {
        return;
      }


      const record =
        item as Record<
          string,
          unknown
        >;


      /*
       * Current format:
       * {
       *   question_id,
       *   question,
       *   answer,
       *   symptom_id
       * }
       */

      if (
        typeof record.question_id ===
          "string" &&
        typeof record.answer ===
          "string" &&
        typeof record.symptom_id ===
          "string"
      ) {
        normalized.push({
          question_id:
            record.question_id,

          question:
            typeof record.question ===
            "string"
              ? record.question
              : undefined,

          answer:
            record.answer,

          symptom_id:
            record.symptom_id,
        });


        return;
      }


      /*
       * Legacy format:
       * {
       *   symptom_id,
       *   answers: {
       *     onset: "...",
       *     ...
       *   }
       * }
       */

      if (
        typeof record.symptom_id ===
          "string" &&
        typeof record.answers ===
          "object" &&
        record.answers !==
          null &&
        !Array.isArray(
          record.answers
        )
      ) {
        Object.entries(
          record.answers as Record<
            string,
            unknown
          >
        ).forEach(
          ([
            questionId,
            answerValue,
          ]) => {
            if (
              typeof answerValue !==
              "string"
            ) {
              return;
            }


            normalized.push({
              question_id:
                questionId,

              answer:
                answerValue,

              symptom_id:
                record.symptom_id as string,
            });
          }
        );
      }
    }
  );


  return normalized;
}


export default function ReviewMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );


  const [
    vehicle,
    setVehicle,
  ] = useState<
    Vehicle | null
  >(null);


  const [
    symptoms,
    setSymptoms,
  ] = useState<
    SymptomRecord[]
  >([]);


  const [
    answers,
    setAnswers,
  ] = useState<
    AdaptiveAnswer[]
  >([]);


  const [
    dtcCodes,
    setDtcCodes,
  ] = useState<
    string[]
  >([]);


  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(
    false
  );


  const [
    submitError,
    setSubmitError,
  ] = useState<
    string | null
  >(null);


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );


    if (
      savedLanguage === "en" ||
      savedLanguage === "ro"
    ) {
      setLanguage(
        savedLanguage
      );
    }


    const savedVehicle =
      localStorage.getItem(
        "diagnosticVehicle"
      );


    if (
      savedVehicle
    ) {
      try {
        setVehicle(
          JSON.parse(
            savedVehicle
          )
        );

      } catch {
        setVehicle(
          null
        );
      }
    }


    const savedSymptoms =
      localStorage.getItem(
        "diagnosticSymptoms"
      );


    if (
      savedSymptoms
    ) {
      try {
        const parsedSymptoms =
          JSON.parse(
            savedSymptoms
          );


        if (
          Array.isArray(
            parsedSymptoms
          )
        ) {
          setSymptoms(
            parsedSymptoms
          );
        }

      } catch {
        setSymptoms(
          []
        );
      }
    }


    const savedAnswers =
      localStorage.getItem(
        "diagnosticAnswers"
      );


    if (
      savedAnswers
    ) {
      try {
        setAnswers(
          normalizeAnswers(
            JSON.parse(
              savedAnswers
            )
          )
        );

      } catch {
        setAnswers(
          []
        );
      }
    }


    const savedDtcCodes =
      localStorage.getItem(
        "diagnosticDtcCodes"
      );


    if (
      savedDtcCodes
    ) {
      try {
        const parsedCodes =
          JSON.parse(
            savedDtcCodes
          );


        if (
          Array.isArray(
            parsedCodes
          )
        ) {
          setDtcCodes(
            parsedCodes
          );
        }

      } catch {
        setDtcCodes(
          []
        );
      }
    }
  }, []);


  const content = {
    en: {
      eyebrow:
        "CASE VERIFICATION",

      title:
        "Everything looks ready for analysis.",

      description:
        "Review the information before AutoDiagnose AI builds the diagnostic case.",

      caseReady:
        "CASE READY",

      vehicleProfile:
        "Vehicle",

      changeVehicle:
        "Change",

      fuel:
        "Fuel",

      year:
        "Year",

      match:
        "Match",

      exact:
        "Exact",

      partial:
        "Partial",

      unknown:
        "Unknown",

      vehicleContext:
        "Additional vehicle context",

      symptoms:
        "Reported symptoms",

      symptom:
        "Symptom",

      addSymptom:
        "Add symptom",

      diagnosticContext:
        "Adaptive answers",

      noAnswers:
        "No adaptive answers were recorded for this symptom.",

      dtc:
        "DTC evidence",

      noDtc:
        "No DTC codes entered",

      optional:
        "Optional",

      analysisInput:
        "Analysis input",

      vehicleReady:
        "Vehicle",

      symptomsReady:
        "Symptoms",

      contextReady:
        "Adaptive context",

      dtcReady:
        "DTC evidence",

      ready:
        "Ready",

      captured:
        "Captured",

      notProvided:
        "Not provided",

      dataSignals:
        "data signals",

      symptomsCount:
        "Symptoms",

      answersCount:
        "Answers",

      dtcCount:
        "DTC",

      start:
        "Start diagnostic analysis",

      sending:
        "Preparing analysis...",

      startHint:
        "The case will be saved automatically to your diagnostic history.",

      sendError:
        "The diagnostic case could not be sent.",

      serverError:
        "We could not connect to the diagnostic server. Try again.",

      sessionError:
        "Your session is no longer valid. Sign in again and retry.",

      validationError:
        "Some case data was rejected by the server. Review the information and try again.",

      missing:
        "The diagnostic case is incomplete.",

      backVehicle:
        "Back to vehicle identification",

      question:
        "Question",

      answer:
        "Answer",

      details:
        "Review details",

      contextCoverage:
        "Symptom context",
    },


    ro: {
      eyebrow:
        "VERIFICARE CAZ",

      title:
        "Totul este pregătit pentru analiză.",

      description:
        "Verifică informațiile înainte ca AutoDiagnose AI să construiască cazul de diagnostic.",

      caseReady:
        "CAZ PREGĂTIT",

      vehicleProfile:
        "Vehicul",

      changeVehicle:
        "Schimbă",

      fuel:
        "Combustibil",

      year:
        "An",

      match:
        "Potrivire",

      exact:
        "Exactă",

      partial:
        "Parțială",

      unknown:
        "Necunoscut",

      vehicleContext:
        "Context suplimentar vehicul",

      symptoms:
        "Simptome raportate",

      symptom:
        "Simptom",

      addSymptom:
        "Adaugă simptom",

      diagnosticContext:
        "Răspunsuri adaptive",

      noAnswers:
        "Nu au fost înregistrate răspunsuri adaptive pentru acest simptom.",

      dtc:
        "Dovezi DTC",

      noDtc:
        "Nu au fost introduse coduri DTC",

      optional:
        "Opțional",

      analysisInput:
        "Date pentru analiză",

      vehicleReady:
        "Vehicul",

      symptomsReady:
        "Simptome",

      contextReady:
        "Context adaptiv",

      dtcReady:
        "Dovezi DTC",

      ready:
        "Pregătit",

      captured:
        "Înregistrat",

      notProvided:
        "Neintrodus",

      dataSignals:
        "semnale disponibile",

      symptomsCount:
        "Simptome",

      answersCount:
        "Răspunsuri",

      dtcCount:
        "DTC",

      start:
        "Începe analiza de diagnostic",

      sending:
        "Se pregătește analiza...",

      startHint:
        "Cazul va fi salvat automat în istoricul tău de diagnostic.",

      sendError:
        "Cazul de diagnostic nu a putut fi trimis.",

      serverError:
        "Nu ne putem conecta la serverul de diagnostic. Încearcă din nou.",

      sessionError:
        "Sesiunea nu mai este validă. Autentifică-te din nou și reîncearcă.",

      validationError:
        "Unele date ale cazului au fost respinse de server. Verifică informațiile și încearcă din nou.",

      missing:
        "Cazul de diagnostic este incomplet.",

      backVehicle:
        "Înapoi la identificarea vehiculului",

      question:
        "Întrebare",

      answer:
        "Răspuns",

      details:
        "Detalii verificare",

      contextCoverage:
        "Context simptome",
    },
  };


  const text =
    content[
      language
    ];


  const vehicleContext =
    vehicle
      ?.vehicle_context
      ?.additional_information
      ?.trim() || "";


  const totalSignals =
    1 +
    symptoms.length +
    answers.length +
    dtcCodes.length;


  const symptomsWithAnswers =
    useMemo(
      () =>
        new Set(
          answers.map(
            (
              answer
            ) =>
              answer.symptom_id
          )
        ).size,

      [
        answers,
      ]
    );


  function getFuelLabel() {
    if (
      !vehicle
    ) {
      return "—";
    }


    if (
      vehicle.fuel ===
      "petrol"
    ) {
      return language ===
        "ro"
        ? "Benzină"
        : "Petrol";
    }


    if (
      vehicle.fuel ===
      "diesel"
    ) {
      return "Diesel";
    }


    if (
      vehicle.fuel ===
      "hybrid"
    ) {
      return language ===
        "ro"
        ? "Hibrid"
        : "Hybrid";
    }


    return "Electric";
  }


  function getSymptomAnswers(
    symptomId:
      string
  ) {
    return answers.filter(
      (
        answer
      ) =>
        answer.symptom_id ===
        symptomId
    );
  }


  function formatQuestion(
    answer:
      AdaptiveAnswer
  ) {
    return (
      questionLabels[
        answer.question_id
      ]?.[
        language
      ] ??
      answer.question ??
      answer.question_id
    );
  }


  function formatAnswer(
    value:
      string
  ) {
    return (
      answerLabels[
        value
      ]?.[
        language
      ] ??
      value.replaceAll(
        "_",
        " "
      )
    );
  }


  async function handleStartAnalysis() {
    if (
      !vehicle ||
      symptoms.length ===
        0 ||
      isSubmitting
    ) {
      return;
    }


    setIsSubmitting(
      true
    );


    setSubmitError(
      null
    );


    const diagnosticCase = {
      language,

      vehicle: {
        make:
          vehicle.manufacturer,

        model:
          vehicle.model,

        year:
          vehicle.year,

        engine:
          null,

        fuel_type:
          vehicle.fuel,

        mileage_km:
          null,
      },

      vehicle_context:
        vehicle.vehicle_context ?? {
          additional_information:
            null,
        },

      symptoms:
        symptoms.map(
          (
            symptom
          ) => ({
            id:
              symptom.id,

            category:
              symptom.primary_category,

            description:
              symptom.description,
          })
        ),

      dtc_codes:
        dtcCodes,

      adaptive_answers:
        answers.map(
          (
            answer
          ) => ({
            question_id:
              answer.question_id,

            question:
              formatQuestion(
                answer
              ),

            answer:
              answer.answer,

            symptom_id:
              answer.symptom_id,
          })
        ),

      additional_notes:
        null,
    };


    try {
      const response =
        await fetch(
          `${API_BASE_URL}/api/diagnostic-cases`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body:
              JSON.stringify(
                diagnosticCase
              ),
          }
        );


      if (
        !response.ok
      ) {
        if (
          response.status ===
          401
        ) {
          throw new Error(
            "SESSION_ERROR"
          );
        }


        if (
          response.status ===
          422
        ) {
          const details =
            await response
              .json()
              .catch(
                () =>
                  null
              );


          console.error(
            "Diagnostic validation error:",
            details
          );


          throw new Error(
            "VALIDATION_ERROR"
          );
        }


        const details =
          await response
            .json()
            .catch(
              () =>
                null
            );


        console.error(
          "Diagnostic case error:",
          details
        );


        throw new Error(
          "SEND_ERROR"
        );
      }


      const result:
        DiagnosticCaseResponse =
        await response.json();


      localStorage.setItem(
        "diagnosticCaseId",
        result.case_id
      );


      router.push(
        "/diagnosis/analysis"
      );

    } catch (
      error
    ) {
      console.error(
        "Failed to send diagnostic case:",
        error
      );


      if (
        error instanceof
          Error &&
        error.message ===
          "SESSION_ERROR"
      ) {
        setSubmitError(
          text.sessionError
        );

      } else if (
        error instanceof
          Error &&
        error.message ===
          "VALIDATION_ERROR"
      ) {
        setSubmitError(
          text.validationError
        );

      } else if (
        error instanceof
          TypeError
      ) {
        setSubmitError(
          text.serverError
        );

      } else {
        setSubmitError(
          text.sendError
        );
      }

    } finally {
      setIsSubmitting(
        false
      );
    }
  }


  if (
    !vehicle ||
    symptoms.length ===
      0
  ) {
    return (
      <main
        className="
          flex
          min-h-[70dvh]
          items-center
          justify-center
          bg-[#060912]
          px-4
          text-white
        "
      >
        <div
          className="
            w-full
            max-w-[360px]
            rounded-[18px]
            border
            border-amber-400/10
            bg-[#080d18]
            p-4
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-[10px]
              border
              border-amber-400/15
              bg-amber-400/[0.05]
              text-amber-300
            "
          >
            !
          </div>


          <p
            className="
              mt-3
              text-[11px]
              font-semibold
              text-zinc-300
            "
          >
            {
              text.missing
            }
          </p>


          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/vehicle"
              )
            }
            className="
              mt-3
              min-h-[40px]
              rounded-[10px]
              bg-blue-500
              px-4
              text-[9px]
              font-semibold
              text-white
            "
          >
            ← {text.backVehicle}
          </button>
        </div>
      </main>
    );
  }


  return (
    <main
      className="
        min-h-screen
        bg-[#060912]
        text-white
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[560px]
          px-3.5
          pb-4
          pt-4
        "
      >
        {/* HEADER */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[18px]
            border
            border-blue-400/[0.10]
            bg-[#080d18]
            p-3.5
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-12
              -top-16
              h-32
              w-32
              rounded-full
              bg-blue-500/[0.11]
              blur-[45px]
            "
          />


          <div
            className="
              relative
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-[11px]
                border
                border-blue-400/20
                bg-blue-500/[0.08]
                text-[12px]
                font-bold
                text-blue-200
              "
            >
              ✓
            </div>


            <div
              className="
                min-w-0
                flex-1
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-2
                "
              >
                <p
                  className="
                    text-[6px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-blue-300/55
                  "
                >
                  {
                    text.eyebrow
                  }
                </p>


                <span
                  className="
                    rounded-full
                    border
                    border-emerald-400/10
                    bg-emerald-400/[0.04]
                    px-2
                    py-1
                    text-[5.5px]
                    font-semibold
                    text-emerald-300
                  "
                >
                  {
                    text.caseReady
                  }
                </span>
              </div>


              <h1
                className="
                  mt-1.5
                  text-[20px]
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.04em]
                "
              >
                {
                  text.title
                }
              </h1>


              <p
                className="
                  mt-1.5
                  text-[8px]
                  leading-3.5
                  text-zinc-600
                "
              >
                {
                  text.description
                }
              </p>
            </div>
          </div>


          <div
            className="
              relative
              mt-3
              grid
              grid-cols-4
              divide-x
              divide-white/[0.045]
              overflow-hidden
              rounded-[11px]
              border
              border-white/[0.05]
              bg-black/10
            "
          >
            <div
              className="
                px-1
                py-2
                text-center
              "
            >
              <p
                className="
                  text-[13px]
                  font-semibold
                  text-blue-200
                "
              >
                {
                  totalSignals
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-[5px]
                  uppercase
                  text-zinc-700
                "
              >
                Signals
              </p>
            </div>


            <div
              className="
                px-1
                py-2
                text-center
              "
            >
              <p
                className="
                  text-[13px]
                  font-semibold
                  text-zinc-300
                "
              >
                {
                  symptoms.length
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-[5px]
                  uppercase
                  text-zinc-700
                "
              >
                {
                  text.symptomsCount
                }
              </p>
            </div>


            <div
              className="
                px-1
                py-2
                text-center
              "
            >
              <p
                className="
                  text-[13px]
                  font-semibold
                  text-zinc-300
                "
              >
                {
                  answers.length
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-[5px]
                  uppercase
                  text-zinc-700
                "
              >
                {
                  text.answersCount
                }
              </p>
            </div>


            <div
              className="
                px-1
                py-2
                text-center
              "
            >
              <p
                className="
                  text-[13px]
                  font-semibold
                  text-zinc-300
                "
              >
                {
                  dtcCodes.length
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-[5px]
                  uppercase
                  text-zinc-700
                "
              >
                DTC
              </p>
            </div>
          </div>
        </section>


        {/* VEHICLE */}

        <section
          className="
            mt-2.5
            rounded-[16px]
            border
            border-white/[0.055]
            bg-[#05080e]
            p-3
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div
              className="
                min-w-0
                flex-1
              "
            >
              <p
                className="
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-blue-300/50
                "
              >
                01 · {
                  text.vehicleProfile
                }
              </p>


              <h2
                className="
                  mt-1
                  truncate
                  text-[12px]
                  font-semibold
                  text-zinc-200
                "
              >
                {
                  vehicle.manufacturer
                }{" "}
                {
                  vehicle.model
                }
              </h2>
            </div>


            <button
              type="button"
              onClick={() =>
                router.push(
                  "/diagnosis/vehicle"
                )
              }
              className="
                shrink-0
                rounded-[9px]
                border
                border-white/[0.06]
                px-2.5
                py-1.5
                text-[6.5px]
                font-semibold
                text-zinc-600
              "
            >
              {
                text.changeVehicle
              }
            </button>
          </div>


          <div
            className="
              mt-2
              grid
              grid-cols-3
              divide-x
              divide-white/[0.045]
              overflow-hidden
              rounded-[10px]
              border
              border-white/[0.045]
            "
          >
            {[
              {
                label:
                  text.fuel,

                value:
                  getFuelLabel(),
              },

              {
                label:
                  text.year,

                value:
                  vehicle.year ??
                  text.unknown,
              },

              {
                label:
                  text.match,

                value:
                  vehicle.vehicle_match ===
                  "exact"
                    ? text.exact
                    : text.partial,
              },
            ].map(
              (
                item
              ) => (
                <div
                  key={
                    item.label
                  }
                  className="
                    min-w-0
                    px-2
                    py-2
                  "
                >
                  <p
                    className="
                      text-[5px]
                      uppercase
                      text-zinc-700
                    "
                  >
                    {
                      item.label
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-[7.5px]
                      font-semibold
                      text-zinc-400
                    "
                  >
                    {
                      item.value
                    }
                  </p>
                </div>
              )
            )}
          </div>


          {vehicleContext && (
            <details
              className="
                mt-2
                border-t
                border-white/[0.04]
                pt-2
              "
            >
              <summary
                className="
                  cursor-pointer
                  list-none
                  text-[6.5px]
                  font-semibold
                  text-zinc-600
                "
              >
                + {
                  text.vehicleContext
                }
              </summary>

              <p
                className="
                  mt-2
                  whitespace-pre-wrap
                  text-[7.5px]
                  leading-3.5
                  text-zinc-600
                "
              >
                {
                  vehicleContext
                }
              </p>
            </details>
          )}
        </section>


        {/* DTC */}

        <section
          className="
            mt-2
            rounded-[15px]
            border
            border-white/[0.055]
            bg-[#05080e]
            px-3
            py-2.5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div>
              <p
                className="
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-blue-300/50
                "
              >
                02 · {
                  text.dtc
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-[6px]
                  text-zinc-700
                "
              >
                OBD-II · {
                  text.optional
                }
              </p>
            </div>


            {dtcCodes.length >
            0 ? (
              <div
                className="
                  flex
                  max-w-[65%]
                  flex-wrap
                  justify-end
                  gap-1
                "
              >
                {dtcCodes.map(
                  (
                    code
                  ) => (
                    <span
                      key={
                        code
                      }
                      className="
                        rounded-[7px]
                        border
                        border-cyan-300/10
                        bg-cyan-300/[0.035]
                        px-2
                        py-1
                        font-mono
                        text-[6.5px]
                        font-semibold
                        text-cyan-100
                      "
                    >
                      {code}
                    </span>
                  )
                )}
              </div>
            ) : (
              <span
                className="
                  text-[6.5px]
                  text-zinc-700
                "
              >
                {
                  text.noDtc
                }
              </span>
            )}
          </div>
        </section>


        {/* SYMPTOMS */}

        <section
          className="
            mt-2
            rounded-[16px]
            border
            border-white/[0.055]
            bg-[#05080e]
            p-3
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div>
              <p
                className="
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-blue-300/50
                "
              >
                03 · {
                  text.symptoms
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-[6.5px]
                  text-zinc-700
                "
              >
                {
                  symptoms.length
                }{" "}
                {
                  text.symptomsCount.toLowerCase()
                }
              </p>
            </div>


            <button
              type="button"
              onClick={() =>
                router.push(
                  "/diagnosis/symptoms"
                )
              }
              className="
                rounded-[9px]
                border
                border-white/[0.06]
                px-2.5
                py-1.5
                text-[6.5px]
                font-semibold
                text-blue-300/70
              "
            >
              + {
                text.addSymptom
              }
            </button>
          </div>


          <div
            className="
              mt-2
              space-y-1.5
            "
          >
            {symptoms.map(
              (
                symptom,
                index
              ) => {
                const meta =
                  categoryLabels[
                    symptom
                      .primary_category
                  ];


                const symptomAnswers =
                  getSymptomAnswers(
                    symptom.id
                  );


                return (
                  <details
                    key={
                      symptom.id
                    }
                    className="
                      overflow-hidden
                      rounded-[11px]
                      border
                      border-white/[0.045]
                      bg-black/10
                    "
                  >
                    <summary
                      className="
                        cursor-pointer
                        list-none
                        px-2.5
                        py-2.5
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2.5
                        "
                      >
                        <span
                          className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-[8px]
                            border
                            border-blue-400/10
                            bg-blue-500/[0.035]
                            text-[6px]
                            font-bold
                            tracking-[0.06em]
                            text-blue-200
                          "
                        >
                          {
                            meta.code
                          }
                        </span>


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                            "
                          >
                            <span
                              className="
                                text-[5.5px]
                                uppercase
                                text-zinc-700
                              "
                            >
                              {
                                text.symptom
                              }{" "}
                              {
                                index +
                                1
                              }
                            </span>


                            <span
                              className="
                                h-1
                                w-1
                                rounded-full
                                bg-zinc-800
                              "
                            />


                            <span
                              className="
                                text-[5.5px]
                                text-zinc-700
                              "
                            >
                              {
                                symptomAnswers.length
                              }{" "}
                              {
                                text.answersCount.toLowerCase()
                              }
                            </span>
                          </div>


                          <p
                            className="
                              mt-0.5
                              truncate
                              text-[8.5px]
                              font-semibold
                              text-zinc-400
                            "
                          >
                            {
                              meta[
                                language
                              ]
                            }
                          </p>


                          <p
                            className="
                              mt-0.5
                              truncate
                              text-[6.5px]
                              text-zinc-700
                            "
                          >
                            {
                              symptom.description
                            }
                          </p>
                        </div>


                        <span
                          className="
                            text-[9px]
                            text-zinc-700
                          "
                        >
                          +
                        </span>
                      </div>
                    </summary>


                    <div
                      className="
                        border-t
                        border-white/[0.04]
                        px-2.5
                        py-2.5
                      "
                    >
                      <p
                        className="
                          text-[6px]
                          font-semibold
                          uppercase
                          tracking-[0.1em]
                          text-zinc-700
                        "
                      >
                        {
                          text.diagnosticContext
                        }
                      </p>


                      {symptomAnswers.length >
                      0 ? (
                        <div
                          className="
                            mt-2
                            space-y-1
                          "
                        >
                          {symptomAnswers.map(
                            (
                              answer
                            ) => (
                              <div
                                key={`${answer.symptom_id}-${answer.question_id}`}
                                className="
                                  flex
                                  items-center
                                  justify-between
                                  gap-3
                                  rounded-[8px]
                                  border
                                  border-white/[0.04]
                                  px-2
                                  py-1.5
                                "
                              >
                                <span
                                  className="
                                    min-w-0
                                    flex-1
                                    truncate
                                    text-[6.5px]
                                    text-zinc-600
                                  "
                                >
                                  {
                                    formatQuestion(
                                      answer
                                    )
                                  }
                                </span>


                                <span
                                  className="
                                    shrink-0
                                    text-[6.5px]
                                    font-semibold
                                    text-zinc-300
                                  "
                                >
                                  {
                                    formatAnswer(
                                      answer.answer
                                    )
                                  }
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p
                          className="
                            mt-1.5
                            text-[6.5px]
                            text-zinc-700
                          "
                        >
                          {
                            text.noAnswers
                          }
                        </p>
                      )}
                    </div>
                  </details>
                );
              }
            )}
          </div>
        </section>


        {/* ANALYSIS INPUT */}

        <details
          className="
            mt-2
            overflow-hidden
            rounded-[15px]
            border
            border-white/[0.055]
            bg-[#05080e]
          "
        >
          <summary
            className="
              cursor-pointer
              list-none
              px-3
              py-2.5
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div>
                <p
                  className="
                    text-[7px]
                    font-semibold
                    text-zinc-400
                  "
                >
                  {
                    text.analysisInput
                  }
                </p>

                <p
                  className="
                    mt-0.5
                    text-[5.5px]
                    text-zinc-700
                  "
                >
                  {symptomsWithAnswers}/
                  {
                    symptoms.length
                  }{" "}
                  {
                    text.contextCoverage
                  }
                </p>
              </div>


              <span
                className="
                  text-[9px]
                  text-zinc-700
                "
              >
                +
              </span>
            </div>
          </summary>


          <div
            className="
              border-t
              border-white/[0.04]
              p-3
            "
          >
            <div
              className="
                grid
                grid-cols-2
                gap-1.5
              "
            >
              {[
                {
                  label:
                    text.vehicleReady,

                  state:
                    text.ready,

                  active:
                    true,
                },

                {
                  label:
                    text.symptomsReady,

                  state:
                    text.captured,

                  active:
                    symptoms.length >
                    0,
                },

                {
                  label:
                    text.contextReady,

                  state:
                    answers.length >
                    0
                      ? text.captured
                      : text.notProvided,

                  active:
                    answers.length >
                    0,
                },

                {
                  label:
                    text.dtcReady,

                  state:
                    dtcCodes.length >
                    0
                      ? text.captured
                      : text.notProvided,

                  active:
                    dtcCodes.length >
                    0,
                },
              ].map(
                (
                  item
                ) => (
                  <div
                    key={
                      item.label
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-[9px]
                      border
                      border-white/[0.04]
                      px-2
                      py-2
                    "
                  >
                    <span
                      className={`
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-[6px]
                        font-bold

                        ${
                          item.active
                            ? "bg-emerald-400/[0.07] text-emerald-300"
                            : "bg-white/[0.02] text-zinc-700"
                        }
                      `}
                    >
                      {
                        item.active
                          ? "✓"
                          : "—"
                      }
                    </span>


                    <div
                      className="
                        min-w-0
                      "
                    >
                      <p
                        className="
                          truncate
                          text-[6.5px]
                          font-semibold
                          text-zinc-500
                        "
                      >
                        {
                          item.label
                        }
                      </p>

                      <p
                        className={`
                          mt-0.5
                          text-[5.5px]

                          ${
                            item.active
                              ? "text-emerald-300/60"
                              : "text-zinc-700"
                          }
                        `}
                      >
                        {
                          item.state
                        }
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </details>


        {/* LAUNCH */}

        <section
          className="
            relative
            mt-2.5
            overflow-hidden
            rounded-[17px]
            border
            border-blue-400/[0.14]
            bg-[#08101e]
            p-3
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-14
              bottom-0
              h-32
              w-32
              rounded-full
              bg-blue-500/[0.13]
              blur-[45px]
            "
          />


          <div
            className="
              relative
            "
          >
            <div
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_8px_rgba(52,211,153,0.55)]
                "
              />

              <span
                className="
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-emerald-200/65
                "
              >
                {
                  text.caseReady
                }
              </span>
            </div>


            <button
              type="button"
              onClick={
                handleStartAnalysis
              }
              disabled={
                isSubmitting
              }
              className="
                mt-2
                flex
                min-h-[44px]
                w-full
                items-center
                justify-between
                rounded-[11px]
                bg-blue-500
                px-3.5
                text-[9px]
                font-semibold
                text-white
                shadow-[0_10px_26px_rgba(37,99,235,0.20)]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <span>
                {isSubmitting
                  ? text.sending
                  : text.start}
              </span>

              <span>
                →
              </span>
            </button>


            <p
              className="
                mt-1.5
                text-[6.5px]
                leading-3
                text-zinc-600
              "
            >
              {
                text.startHint
              }
            </p>


            {submitError && (
              <div
                className="
                  mt-2
                  rounded-[9px]
                  border
                  border-red-400/12
                  bg-red-400/[0.045]
                  px-2.5
                  py-2
                  text-[7px]
                  leading-3.5
                  text-red-200
                "
              >
                {
                  submitError
                }
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}