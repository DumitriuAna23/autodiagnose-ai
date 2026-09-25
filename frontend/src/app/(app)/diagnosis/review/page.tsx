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
  year: number | null;
  vehicle_match:
    | "exact"
    | "partial";
  reference_model: string | null;
  vehicle_context?: {
    additional_information?: string | null;
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
  primary_category: SymptomCategory;
  description: string;
  created_at: string;
};


type AdaptiveAnswer = {
  question_id: string;
  question?: string;
  answer: string;
  symptom_id: string;
};


type LegacyAnswerRecord = {
  symptom_id: string;
  answers: Record<
    string,
    string
  >;
  completed_at?: string;
};


type DiagnosticCaseResponse = {
  case_id: string;
  status?: string;
  message?: string;
};




const categoryLabels: Record<
  SymptomCategory,
  {
    en: string;
    ro: string;
    code: string;
  }
> = {
  power: {
    en: "Loss of power / acceleration",
    ro: "Lipsă de putere / accelerație",
    code: "PWR",
  },

  starting: {
    en: "Starting / engine running",
    ro: "Pornire / funcționare motor",
    code: "ENG",
  },

  noise: {
    en: "Noise / vibration",
    ro: "Zgomot / vibrații",
    code: "NVH",
  },

  smoke: {
    en: "Smoke / smell",
    ro: "Fum / miros",
    code: "EXH",
  },

  warning: {
    en: "Dashboard warning",
    ro: "Martor în bord",
    code: "MIL",
  },

  brakes: {
    en: "Braking / steering",
    ro: "Frânare / direcție",
    code: "CHS",
  },

  temperature: {
    en: "Temperature / overheating",
    ro: "Temperatură / supraîncălzire",
    code: "TMP",
  },

  other: {
    en: "Other symptom",
    ro: "Alt simptom",
    code: "...",
  },
};


const questionLabels: Record<
  string,
  {
    en: string;
    ro: string;
  }
> = {
  onset: {
    en: "How the problem began",
    ro: "Cum a început problema",
  },

  frequency: {
    en: "How often it happens",
    ro: "Cât de des apare",
  },

  performance_change: {
    en: "Vehicle behavior changed",
    ro: "Comportamentul mașinii s-a schimbat",
  },

  conditions: {
    en: "When the symptom is most noticeable",
    ro: "Când este simptomul cel mai evident",
  },

  warning_light: {
    en: "Dashboard warning light",
    ro: "Martor aprins în bord",
  },

  warning_behavior: {
    en: "Warning light behavior",
    ro: "Comportamentul martorului",
  },

  power_condition: {
    en: "When power loss is noticeable",
    ro: "Când apare lipsa de putere",
  },

  limp_mode: {
    en: "Strong acceleration limitation",
    ro: "Limitare puternică a accelerației",
  },

  crank_behavior: {
    en: "Starting behavior",
    ro: "Comportamentul la pornire",
  },

  temperature_start: {
    en: "Cold / warm starting",
    ro: "Pornire la rece / cald",
  },

  noise_condition: {
    en: "When noise or vibration occurs",
    ro: "Când apare zgomotul sau vibrația",
  },

  smoke_color: {
    en: "Smoke color",
    ro: "Culoarea fumului",
  },

  smoke_location: {
    en: "Smoke location",
    ro: "Locul de unde provine fumul",
  },

  brake_behavior: {
    en: "Braking / steering behavior",
    ro: "Comportamentul frânării / direcției",
  },

  temperature_behavior: {
    en: "Temperature behavior",
    ro: "Comportamentul temperaturii",
  },

  problem_area: {
    en: "Main problem area",
    ro: "Zona principală a problemei",
  },
};


const answerLabels: Record<
  string,
  {
    en: string;
    ro: string;
  }
> = {
  sudden: {
    en: "Suddenly",
    ro: "Brusc",
  },

  gradual: {
    en: "Gradually",
    ro: "Treptat",
  },

  after_event: {
    en: "After an event",
    ro: "După un eveniment",
  },

  unknown: {
    en: "Not sure",
    ro: "Nu știu",
  },

  always: {
    en: "Always",
    ro: "Tot timpul",
  },

  intermittent: {
    en: "Intermittently",
    ro: "Intermitent",
  },

  once: {
    en: "Only once",
    ro: "O singură dată",
  },

  yes: {
    en: "Yes",
    ro: "Da",
  },

  no: {
    en: "No",
    ro: "Nu",
  },

  steady: {
    en: "Continuously",
    ro: "Continuu",
  },

  flashing: {
    en: "Flashing",
    ro: "Clipește",
  },

  acceleration: {
    en: "During acceleration",
    ro: "La accelerație",
  },

  uphill: {
    en: "When driving uphill",
    ro: "În rampă",
  },

  high_speed: {
    en: "At higher speed / RPM",
    ro: "La viteză / turație mai mare",
  },

  highway: {
    en: "At higher speed",
    ro: "La viteză mai mare",
  },

  idle: {
    en: "At idle",
    ro: "La ralanti",
  },

  cold_start: {
    en: "During cold start",
    ro: "La pornirea la rece",
  },

  hot_engine: {
    en: "With the engine warm",
    ro: "Cu motorul cald",
  },

  braking: {
    en: "During braking",
    ro: "La frânare",
  },

  turning: {
    en: "While turning",
    ro: "La virare",
  },

  random: {
    en: "No clear pattern",
    ro: "Fără un tipar clar",
  },

  cranks: {
    en: "Engine turns but does not start",
    ro: "Motorul se învârte, dar nu pornește",
  },

  click: {
    en: "Clicking sound",
    ro: "Se aud clicuri",
  },

  nothing: {
    en: "Almost nothing happens",
    ro: "Aproape nu se întâmplă nimic",
  },

  starts_then_stalls: {
    en: "Starts and then stops",
    ro: "Pornește și apoi se oprește",
  },

  cold: {
    en: "Cold",
    ro: "Rece",
  },

  warm: {
    en: "Warm",
    ro: "Caldă",
  },

  both: {
    en: "Both",
    ro: "Ambele",
  },

  speed: {
    en: "Increases with speed",
    ro: "Crește odată cu viteza",
  },

  black: {
    en: "Black",
    ro: "Negru",
  },

  white: {
    en: "White",
    ro: "Alb",
  },

  blue: {
    en: "Blue / blue-grey",
    ro: "Albastru / albăstrui",
  },

  exhaust: {
    en: "Exhaust",
    ro: "Eșapament",
  },

  engine_bay: {
    en: "Engine compartment",
    ro: "Compartimentul motor",
  },

  soft_pedal: {
    en: "Soft brake pedal",
    ro: "Pedală de frână moale",
  },

  hard_pedal: {
    en: "Hard brake pedal",
    ro: "Pedală de frână tare",
  },

  pulling: {
    en: "Vehicle pulls to one side",
    ro: "Mașina trage într-o parte",
  },

  steering: {
    en: "Abnormal steering",
    ro: "Direcție anormală",
  },

  noise: {
    en: "Noise during braking",
    ro: "Zgomot la frânare",
  },

  gauge_high: {
    en: "Temperature gauge rises high",
    ro: "Indicatorul de temperatură urcă mult",
  },

  warning: {
    en: "Temperature warning",
    ro: "Martor de temperatură",
  },

  steam: {
    en: "Steam visible",
    ro: "Se vede abur",
  },

  coolant_loss: {
    en: "Coolant loss",
    ro: "Pierdere lichid de răcire",
  },

  engine: {
    en: "Engine / acceleration",
    ro: "Motor / accelerație",
  },

  driving: {
    en: "While driving",
    ro: "În timpul deplasării",
  },

  electrical: {
    en: "Electrical equipment",
    ro: "Echipamente electrice",
  },

  inside: {
    en: "Inside the cabin",
    ro: "În interiorul mașinii",
  },
};


function normalizeAnswers(
  value: unknown
): AdaptiveAnswer[] {
  if (!Array.isArray(value)) {
    return [];
  }


  const normalized:
    AdaptiveAnswer[] = [];


  value.forEach(
    (item) => {
      if (
        typeof item !==
          "object" ||
        item === null
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


export default function ReviewPage() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] =
    useState<Language>(
      "en"
    );


  const [
    vehicle,
    setVehicle,
  ] =
    useState<Vehicle | null>(
      null
    );


  const [
    symptoms,
    setSymptoms,
  ] =
    useState<
      SymptomRecord[]
    >([]);


  const [
    answers,
    setAnswers,
  ] =
    useState<
      AdaptiveAnswer[]
    >([]);


  const [
    dtcCodes,
    setDtcCodes,
  ] =
    useState<string[]>(
      []
    );


  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);


  const [
    submitError,
    setSubmitError,
  ] =
    useState<
      string | null
    >(null);


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );


    if (
      savedLanguage ===
        "en" ||
      savedLanguage ===
        "ro"
    ) {
      setLanguage(
        savedLanguage
      );
    }


    const savedVehicle =
      localStorage.getItem(
        "diagnosticVehicle"
      );


    if (savedVehicle) {
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


    if (savedSymptoms) {
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


    if (savedAnswers) {
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


    if (savedDtcCodes) {
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
        "Review the vehicle, reported symptoms, DTC codes and adaptive answers before AutoDiagnose AI builds the diagnostic case.",

      caseReady:
        "CASE READY",

      vehicleProfile:
        "Vehicle profile",

      changeVehicle:
        "Change vehicle",

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

      verified:
        "Verified",

      partialData:
        "Partial data",

      vehicleContext:
        "Additional vehicle context",

      symptoms:
        "Reported symptoms",

      symptom:
        "Symptom",

      addSymptom:
        "Add symptom",

      diagnosticContext:
        "Adaptive context",

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
        "Data signals",

      symptomsCount:
        "Symptoms",

      answersCount:
        "Answers",

      dtcCount:
        "DTC codes",

      start:
        "Start diagnostic analysis",

      sending:
        "Preparing analysis...",

      startHint:
        "The case will be saved to your diagnostic history.",

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
    },

    ro: {
      eyebrow:
        "VERIFICARE CAZ",

      title:
        "Totul este pregătit pentru analiză.",

      description:
        "Verifică vehiculul, simptomele raportate, codurile DTC și răspunsurile adaptive înainte ca AutoDiagnose AI să construiască cazul de diagnostic.",

      caseReady:
        "CAZ PREGĂTIT",

      vehicleProfile:
        "Profil vehicul",

      changeVehicle:
        "Schimbă vehiculul",

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

      verified:
        "Verificat",

      partialData:
        "Date parțiale",

      vehicleContext:
        "Context suplimentar vehicul",

      symptoms:
        "Simptome raportate",

      symptom:
        "Simptom",

      addSymptom:
        "Adaugă simptom",

      diagnosticContext:
        "Context adaptiv",

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
        "Semnale disponibile",

      symptomsCount:
        "Simptome",

      answersCount:
        "Răspunsuri",

      dtcCount:
        "Coduri DTC",

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
    },
  };


  const text =
    content[language];


  const vehicleContext =
    vehicle?.vehicle_context
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
            (answer) =>
              answer.symptom_id
          )
        ).size,
      [answers]
    );


  function getFuelLabel() {
    if (!vehicle) {
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
    symptomId: string
  ) {
    return answers.filter(
      (answer) =>
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
      ]?.[language] ??
      answer.question ??
      answer.question_id
    );
  }


  function formatAnswer(
    value: string
  ) {
    return (
      answerLabels[value]?.[
        language
      ] ??
      value
        .replaceAll("_", " ")
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
          (symptom) => ({
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
          (answer) => ({
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

    } catch (error) {
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
          min-h-screen
          items-center
          justify-center
          bg-[#060912]
          px-6
          text-white
        "
      >
        <div
          className="
            ad-surface
            w-full
            max-w-lg
            rounded-[28px]
            p-8
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-amber-400/15
              bg-amber-400/[0.05]
              text-amber-300
            "
          >
            !
          </div>


          <h1
            className="
              mt-5
              text-xl
              font-semibold
              text-white
            "
          >
            {text.missing}
          </h1>


          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/vehicle"
              )
            }
            className="
              mt-6
              rounded-xl
              bg-blue-500
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-400
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
      <div className="ad-page">

        {/* HEADER */}

        <section
          className="
            ad-surface
            relative
            overflow-hidden
            rounded-[30px]
            p-7
            sm:p-9
            lg:p-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-blue-500/[0.08]
              blur-[95px]
            "
          />


          <div
            className="
              pointer-events-none
              absolute
              right-12
              top-0
              h-40
              w-40
              rounded-full
              bg-cyan-400/[0.035]
              blur-[70px]
            "
          />


          <div
            className="
              relative
              grid
              gap-8
              lg:grid-cols-[minmax(0,1fr)_280px]
              lg:items-center
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-blue-400/15
                  bg-blue-500/[0.055]
                  px-3.5
                  py-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-blue-400
                    shadow-[0_0_12px_rgba(96,165,250,0.7)]
                  "
                />

                <span
                  className="
                    text-[15px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-blue-200/80
                  "
                >
                  {text.caseReady}
                </span>
              </div>


              <p
                className="
                  mt-7
                  text-[15px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-zinc-400
                "
              >
                {text.eyebrow}
              </p>


              <h1
                className="
                  mt-3
                  max-w-3xl
                  text-[2.2rem]
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.04em]
                  text-white
                  sm:text-[2.8rem]
                "
              >
                {text.title}
              </h1>


              <p
                className="
                  mt-4
                  max-w-2xl
                  text-[15px]
                  leading-7
                  text-zinc-400
                "
              >
                {text.description}
              </p>
            </div>


            {/* SIGNAL CORE */}

            <div
              className="
                relative
                mx-auto
                flex
                h-[220px]
                w-full
                max-w-[260px]
                items-center
                justify-center
              "
            >
              <div
                className="
                  absolute
                  h-44
                  w-44
                  rounded-full
                  border
                  border-blue-400/[0.08]
                "
              />

              <div
                className="
                  absolute
                  h-32
                  w-32
                  rounded-full
                  border
                  border-blue-400/[0.13]
                "
              />

              <div
                className="
                  absolute
                  h-20
                  w-20
                  rounded-full
                  border
                  border-blue-300/[0.20]
                  bg-blue-500/[0.05]
                  shadow-[0_0_55px_rgba(59,130,246,0.12)]
                "
              />


              <div
                className="
                  relative
                  text-center
                "
              >
                <p
                  className="
                    text-[34px]
                    font-semibold
                    tracking-[-0.05em]
                    text-white
                  "
                >
                  {totalSignals}
                </p>

                <p
                  className="
                    mt-1
                    text-[15px]
                    font-semibold
                    uppercase
                    tracking-[0.17em]
                    text-blue-200/55
                  "
                >
                  {text.dataSignals}
                </p>
              </div>


              <span
                className="
                  absolute
                  left-5
                  top-9
                  h-2
                  w-2
                  rounded-full
                  bg-cyan-300/70
                  shadow-[0_0_14px_rgba(103,232,249,0.6)]
                "
              />

              <span
                className="
                  absolute
                  bottom-10
                  right-6
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-blue-300/70
                  shadow-[0_0_12px_rgba(147,197,253,0.6)]
                "
              />
            </div>
          </div>
        </section>


        <div
          className="
            mt-7
            grid
            gap-7
            xl:grid-cols-[minmax(0,1fr)_390px]
            xl:items-start
          "
        >

          {/* LEFT COLUMN */}

          <div
            className="
              space-y-6
            "
          >

            {/* VEHICLE */}

            <section
              className="
                ad-surface
                rounded-[28px]
                p-6
                sm:p-7
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-[15px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-blue-200/65
                    "
                  >
                    01 · {text.vehicleProfile}
                  </p>

                  <h2
                    className="
                      mt-2
                      text-2xl
                      font-semibold
                      tracking-[-0.03em]
                      text-white
                    "
                  >
                    {vehicle.manufacturer}{" "}
                    {vehicle.model}
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
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-white/[0.018]
                    px-4
                    py-2.5
                    text-[15px]
                    font-semibold
                    text-zinc-300
                    transition
                    hover:border-white/[0.12]
                    hover:bg-white/[0.035]
                    hover:text-white
                  "
                >
                  {text.changeVehicle}
                </button>
              </div>


              <div
                className="
                  mt-6
                  grid
                  gap-3
                  sm:grid-cols-3
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
                  (item) => (
                    <div
                      key={
                        item.label
                      }
                      className="
                        rounded-2xl
                        border
                        border-white/[0.055]
                        bg-white/[0.015]
                        p-4
                      "
                    >
                      <p
                        className="
                          text-[15px]
                          font-medium
                          uppercase
                          tracking-[0.11em]
                          text-zinc-400
                        "
                      >
                        {item.label}
                      </p>

                      <p
                        className="
                          mt-2
                          text-[15px]
                          font-semibold
                          text-zinc-200
                        "
                      >
                        {item.value}
                      </p>
                    </div>
                  )
                )}
              </div>


              {vehicleContext && (
                <div
                  className="
                    mt-4
                    rounded-2xl
                    border
                    border-white/[0.055]
                    bg-black/15
                    p-4
                  "
                >
                  <p
                    className="
                      text-[15px]
                      font-medium
                      uppercase
                      tracking-[0.11em]
                      text-zinc-400
                    "
                  >
                    {text.vehicleContext}
                  </p>

                  <p
                    className="
                      mt-2
                      whitespace-pre-wrap
                      text-[15px]
                      leading-6
                      text-zinc-400
                    "
                  >
                    {vehicleContext}
                  </p>
                </div>
              )}
            </section>


            {/* DTC */}

            <section
              className="
                ad-surface
                rounded-[28px]
                p-6
                sm:p-7
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-[15px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-blue-200/65
                    "
                  >
                    02 · {text.dtc}
                  </p>

                  <p
                    className="
                      mt-2
                      text-[15px]
                      text-zinc-400
                    "
                  >
                    OBD-II
                  </p>
                </div>


                <span
                  className="
                    rounded-full
                    border
                    border-white/[0.055]
                    bg-white/[0.018]
                    px-2.5
                    py-1
                    text-[15px]
                    font-medium
                    uppercase
                    tracking-[0.10em]
                    text-zinc-400
                  "
                >
                  {text.optional}
                </span>
              </div>


              {dtcCodes.length >
              0 ? (
                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    gap-2.5
                  "
                >
                  {dtcCodes.map(
                    (code) => (
                      <span
                        key={code}
                        className="
                          rounded-xl
                          border
                          border-cyan-300/15
                          bg-cyan-300/[0.045]
                          px-3.5
                          py-2.5
                          font-mono
                          text-[15px]
                          font-semibold
                          tracking-[0.06em]
                          text-cyan-100/85
                        "
                      >
                        {code}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-dashed
                    border-white/[0.07]
                    bg-white/[0.01]
                    px-4
                    py-5
                    text-[15px]
                    text-zinc-400
                  "
                >
                  {text.noDtc}
                </div>
              )}
            </section>


            {/* SYMPTOMS */}

            <section
              className="
                ad-surface
                rounded-[28px]
                p-6
                sm:p-7
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-[15px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-blue-200/65
                    "
                  >
                    03 · {text.symptoms}
                  </p>

                  <p
                    className="
                      mt-2
                      text-[15px]
                      text-zinc-400
                    "
                  >
                    {symptoms.length}{" "}
                    {text.symptomsCount.toLowerCase()}
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
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-white/[0.018]
                    px-4
                    py-2.5
                    text-[15px]
                    font-semibold
                    text-zinc-300
                    transition
                    hover:border-blue-400/15
                    hover:bg-blue-500/[0.035]
                    hover:text-white
                  "
                >
                  + {text.addSymptom}
                </button>
              </div>


              <div
                className="
                  mt-5
                  space-y-3
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
                      <article
                        key={
                          symptom.id
                        }
                        className="
                          overflow-hidden
                          rounded-[22px]
                          border
                          border-white/[0.055]
                          bg-white/[0.012]
                        "
                      >
                        <div
                          className="
                            flex
                            gap-4
                            p-5
                          "
                        >
                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-blue-400/12
                              bg-blue-500/[0.045]
                              text-[15px]
                              font-bold
                              tracking-[0.08em]
                              text-blue-200/75
                            "
                          >
                            {meta.code}
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
                                flex-wrap
                                items-center
                                gap-2
                              "
                            >
                              <span
                                className="
                                  text-[15px]
                                  font-semibold
                                  uppercase
                                  tracking-[0.12em]
                                  text-zinc-400
                                "
                              >
                                {text.symptom}{" "}
                                {index +
                                  1}
                              </span>


                              <span
                                className="
                                  h-1
                                  w-1
                                  rounded-full
                                  bg-zinc-700
                                "
                              />


                              <span
                                className="
                                  text-[15px]
                                  text-zinc-400
                                "
                              >
                                {
                                  symptomAnswers.length
                                }{" "}
                                {text.answersCount.toLowerCase()}
                              </span>
                            </div>


                            <h3
                              className="
                                mt-2
                                text-[17px]
                                font-semibold
                                tracking-[-0.02em]
                                text-zinc-100
                              "
                            >
                              {meta[
                                language
                              ]}
                            </h3>


                            <p
                              className="
                                mt-2
                                text-[15px]
                                leading-6
                                text-zinc-400
                              "
                            >
                              {
                                symptom.description
                              }
                            </p>
                          </div>
                        </div>


                        <div
                          className="
                            border-t
                            border-white/[0.05]
                            bg-black/10
                            px-5
                            py-4
                          "
                        >
                          <p
                            className="
                              text-[15px]
                              font-semibold
                              uppercase
                              tracking-[0.12em]
                              text-zinc-400
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
                                mt-3
                                grid
                                gap-2
                              "
                            >
                              {symptomAnswers.map(
                                (
                                  answer
                                ) => (
                                  <div
                                    key={`${answer.symptom_id}-${answer.question_id}`}
                                    className="
                                      grid
                                      gap-2
                                      rounded-xl
                                      border
                                      border-white/[0.045]
                                      bg-white/[0.012]
                                      px-3.5
                                      py-3
                                      sm:grid-cols-[minmax(0,1fr)_auto]
                                      sm:items-center
                                    "
                                  >
                                    <span
                                      className="
                                        text-[15px]
                                        leading-6
                                        text-zinc-400
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
                                        text-[15px]
                                        font-semibold
                                        text-zinc-200
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
                                mt-3
                                text-[15px]
                                leading-6
                                text-zinc-400
                              "
                            >
                              {text.noAnswers}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </section>

          </div>


          {/* RIGHT COLUMN */}

          <aside
            className="
              space-y-4
              xl:sticky
              xl:top-6
            "
          >
            <section
              className="
                ad-surface
                relative
                overflow-hidden
                rounded-[28px]
                p-6
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-52
                  w-52
                  rounded-full
                  bg-blue-500/[0.10]
                  blur-[75px]
                "
              />


              <div className="relative">
                <p
                  className="
                    text-[15px]
                    font-semibold
                    uppercase
                    tracking-[0.17em]
                    text-blue-200/70
                  "
                >
                  {text.analysisInput}
                </p>


                <div
                  className="
                    mt-5
                    space-y-2
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
                    (item) => (
                      <div
                        key={
                          item.label
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          rounded-xl
                          border
                          border-white/[0.05]
                          bg-white/[0.012]
                          px-3.5
                          py-3
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >
                          <span
                            className={`
                              flex
                              h-6
                              w-6
                              items-center
                              justify-center
                              rounded-full
                              text-[15px]
                              font-bold
                              ${
                                item.active
                                  ? "bg-emerald-400/[0.08] text-emerald-300"
                                  : "bg-white/[0.025] text-zinc-400"
                              }
                            `}
                          >
                            {item.active
                              ? "✓"
                              : "—"}
                          </span>


                          <span
                            className="
                              text-[15px]
                              font-medium
                              text-zinc-300
                            "
                          >
                            {item.label}
                          </span>
                        </div>


                        <span
                          className={`
                            text-[15px]
                            font-medium
                            ${
                              item.active
                                ? "text-emerald-300/65"
                                : "text-zinc-400"
                            }
                          `}
                        >
                          {item.state}
                        </span>
                      </div>
                    )
                  )}
                </div>


                <div
                  className="
                    mt-5
                    grid
                    grid-cols-3
                    gap-2
                  "
                >
                  {[
                    {
                      value:
                        symptoms.length,
                      label:
                        text.symptomsCount,
                    },
                    {
                      value:
                        answers.length,
                      label:
                        text.answersCount,
                    },
                    {
                      value:
                        dtcCodes.length,
                      label:
                        text.dtcCount,
                    },
                  ].map(
                    (item) => (
                      <div
                        key={
                          item.label
                        }
                        className="
                          rounded-xl
                          border
                          border-white/[0.045]
                          bg-black/10
                          px-2
                          py-3
                          text-center
                        "
                      >
                        <p
                          className="
                            text-xl
                            font-semibold
                            tracking-[-0.03em]
                            text-white
                          "
                        >
                          {item.value}
                        </p>

                        <p
                          className="
                            mt-1
                            text-[15px]
                            uppercase
                            tracking-[0.08em]
                            text-zinc-400
                          "
                        >
                          {item.label}
                        </p>
                      </div>
                    )
                  )}
                </div>


                <div
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-blue-400/10
                    bg-blue-500/[0.035]
                    px-4
                    py-3.5
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
                    <span
                      className="
                        text-[15px]
                        font-medium
                        text-zinc-300
                      "
                    >
                      {text.symptomsCount}{" "}
                      +{" "}
                      {text.contextReady}
                    </span>

                    <span
                      className="
                        text-[15px]
                        font-semibold
                        text-blue-200/75
                      "
                    >
                      {symptomsWithAnswers}/
                      {symptoms.length}
                    </span>
                  </div>


                  <div
                    className="
                      mt-3
                      h-1.5
                      overflow-hidden
                      rounded-full
                      bg-white/[0.04]
                    "
                  >
                    <div
                      className="
                        h-full
                        rounded-full
                        bg-blue-400
                        transition-all
                        duration-300
                      "
                      style={{
                        width:
                          symptoms.length >
                          0
                            ? `${Math.round(
                                (symptomsWithAnswers /
                                  symptoms.length) *
                                  100
                              )}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>


            {/* LAUNCH */}

            <section
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-blue-400/15
                bg-[#08101e]
                p-6
                shadow-[0_18px_55px_rgba(0,0,0,0.22)]
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  bottom-0
                  h-52
                  w-52
                  rounded-full
                  bg-blue-500/[0.15]
                  blur-[80px]
                "
              />


              <div className="relative">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-emerald-400
                      shadow-[0_0_12px_rgba(52,211,153,0.6)]
                    "
                  />

                  <span
                    className="
                      text-[15px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-emerald-200/70
                    "
                  >
                    {text.caseReady}
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
                    group
                    mt-5
                    flex
                    min-h-14
                    w-full
                    items-center
                    justify-between
                    gap-4
                    rounded-xl
                    bg-blue-500
                    px-5
                    text-left
                    text-[15px]
                    font-semibold
                    text-white
                    shadow-[0_14px_40px_rgba(37,99,235,0.23)]
                    transition-all
                    duration-200
                    hover:bg-blue-400
                    hover:shadow-[0_18px_48px_rgba(37,99,235,0.28)]
                    disabled:cursor-not-allowed
                    disabled:opacity-55
                  "
                >
                  <span>
                    {isSubmitting
                      ? text.sending
                      : text.start}
                  </span>

                  <span
                    className="
                      text-lg
                      transition-transform
                      duration-200
                      group-hover:translate-x-0.5
                    "
                  >
                    →
                  </span>
                </button>


                <p
                  className="
                    mt-3
                    text-[15px]
                    leading-6
                    text-zinc-400
                  "
                >
                  {text.startHint}
                </p>


                {submitError && (
                  <div
                    className="
                      mt-4
                      rounded-xl
                      border
                      border-red-400/15
                      bg-red-400/[0.055]
                      px-4
                      py-3
                      text-[15px]
                      leading-6
                      text-red-200
                    "
                  >
                    {submitError}
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>

      </div>
    </main>
  );
}