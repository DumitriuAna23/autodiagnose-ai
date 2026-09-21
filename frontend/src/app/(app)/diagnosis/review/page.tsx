"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Language = "en" | "ro";

type Vehicle = {
  manufacturer: string;
  manufacturer_verified: boolean;
  model: string;
  model_verified: boolean;
  fuel: "petrol" | "diesel" | "hybrid" | "electric";
  year: number | null;
  vehicle_match: "exact" | "partial";
  reference_model: string | null;

  vehicle_context?: {
    additional_information: string | null;
  } | null;
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

type AnswerMap = Record<string, string>;

type DiagnosticAnswerRecord = {
  symptom_id: string;
  answers: AnswerMap;
  completed_at: string;
};

type DiagnosticCaseResponse = {
  case_id: string;
  status: "received";
  message: string;
};

export default function ReviewPage() {
  const router = useRouter();

  const [language, setLanguage] =
    useState<Language>("en");

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [symptoms, setSymptoms] =
    useState<SymptomRecord[]>([]);

  const [answers, setAnswers] =
    useState<DiagnosticAnswerRecord[]>([]);

  const [dtcCodes, setDtcCodes] =
    useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("language");

    if (
      savedLanguage === "en" ||
      savedLanguage === "ro"
    ) {
      setLanguage(savedLanguage);
    }

    const savedVehicle =
      localStorage.getItem(
        "diagnosticVehicle"
      );

    if (savedVehicle) {
      try {
        setVehicle(
          JSON.parse(savedVehicle)
        );
      } catch {
        setVehicle(null);
      }
    }

    const savedSymptoms =
      localStorage.getItem(
        "diagnosticSymptoms"
      );

    if (savedSymptoms) {
      try {
        const parsedSymptoms =
          JSON.parse(savedSymptoms);

        if (
          Array.isArray(parsedSymptoms)
        ) {
          setSymptoms(parsedSymptoms);
        }
      } catch {
        setSymptoms([]);
      }
    }

    const savedAnswers =
      localStorage.getItem(
        "diagnosticAnswers"
      );

    if (savedAnswers) {
      try {
        const parsedAnswers =
          JSON.parse(savedAnswers);

        if (
          Array.isArray(parsedAnswers)
        ) {
          setAnswers(parsedAnswers);
        }
      } catch {
        setAnswers([]);
      }
    }

    const savedDtcCodes =
      localStorage.getItem(
        "diagnosticDtcCodes"
      );

    if (savedDtcCodes) {
      try {
        const parsedCodes =
          JSON.parse(savedDtcCodes);

        if (
          Array.isArray(parsedCodes)
        ) {
          setDtcCodes(parsedCodes);
        }
      } catch {
        setDtcCodes([]);
      }
    }
  }, []);

  const content = {
    en: {
      step: "DIAGNOSTIC REVIEW",

      title:
        "Check the information before analysis",

      description:
        "AutoDiagnose AI will use the vehicle information, symptoms, DTC codes and your answers together. Review them before starting the diagnostic analysis.",

      vehicle: "Vehicle",
      manufacturer: "Manufacturer",
      model: "Model",
      fuel: "Fuel type",
      year: "Year",
      match: "Vehicle match",

      additionalInfo:
        "Other vehicle information",

      exact: "Exact",
      partial: "Partial",
      unknown: "Unknown",

      symptoms: "Reported symptoms",

      symptom: "Symptom",

      answers:
        "Diagnostic answers",

      noAnswers:
        "No additional answers were recorded.",

      dtc: "DTC codes",

      noDtc:
        "No DTC codes were entered.",

      addSymptom:
        "+ Add another symptom",

      editVehicle:
        "Change vehicle",

      start:
        "Start diagnostic analysis",

      sending:
        "Sending diagnostic case...",

      sendError:
        "The diagnostic case could not be sent. Make sure the backend is running and try again.",

      missing:
        "The diagnostic case is incomplete. Return to vehicle identification and start again.",
    },

    ro: {
      step: "REVIZUIRE DIAGNOZĂ",

      title:
        "Verifică informațiile înainte de analiză",

      description:
        "AutoDiagnose AI va folosi împreună informațiile despre vehicul, simptomele, codurile DTC și răspunsurile tale. Verifică-le înainte de începerea analizei de diagnostic.",

      vehicle: "Vehicul",
      manufacturer: "Marcă",
      model: "Model",
      fuel: "Tip combustibil",
      year: "An",
      match: "Potrivire vehicul",

      additionalInfo:
        "Alte informații despre vehicul",

      exact: "Exact",
      partial: "Partial",
      unknown: "Necunoscut",

      symptoms: "Simptome raportate",

      symptom: "Simptom",

      answers:
        "Răspunsuri de diagnostic",

      noAnswers:
        "Nu au fost înregistrate răspunsuri suplimentare.",

      dtc: "Coduri DTC",

      noDtc:
        "Nu a fost introdus niciun cod DTC.",

      addSymptom:
        "+ Adaugă alt simptom",

      editVehicle:
        "Schimbă vehiculul",

      start:
        "Începe analiza de diagnostic",

      sending:
        "Se trimite cazul de diagnostic...",

      sendError:
        "Cazul de diagnostic nu a putut fi trimis. Verifică dacă backendul este pornit și încearcă din nou.",

      missing:
        "Cazul de diagnostic este incomplet. Revino la identificarea vehiculului și începe din nou.",
    },
  };

  const text =
    content[language];

  const categoryLabels: Record<
    SymptomCategory,
    { en: string; ro: string }
  > = {
    power: {
      en: "Loss of power or poor acceleration",
      ro: "Lipsă de putere sau accelerație slabă",
    },

    starting: {
      en: "Starting or engine running problem",
      ro: "Problemă la pornire sau funcționarea motorului",
    },

    noise: {
      en: "Unusual noise or vibration",
      ro: "Zgomot sau vibrații neobișnuite",
    },

    smoke: {
      en: "Smoke or unusual smell",
      ro: "Fum sau miros neobișnuit",
    },

    warning: {
      en: "Dashboard warning light",
      ro: "Martor aprins în bord",
    },

    brakes: {
      en: "Braking or steering problem",
      ro: "Problemă la frânare sau direcție",
    },

    temperature: {
      en: "Overheating or temperature problem",
      ro: "Supraîncălzire sau problemă de temperatură",
    },

    other: {
      en: "Other problem",
      ro: "Altă problemă",
    },
  };

  const questionLabels: Record<
    string,
    { en: string; ro: string }
  > = {
    onset: {
      en: "How the problem began",
      ro: "Cum a început problema",
    },

    frequency: {
      en: "How often it happens",
      ro: "Cât de des apare",
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

    performance_change: {
      en: "Vehicle behavior changed",
      ro: "Schimbarea comportamentului mașinii",
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
    { en: string; ro: string }
  > = {
    sudden: {
      en: "Suddenly",
      ro: "Brusc",
    },

    gradual: {
      en: "Gradually",
      ro: "Treptat",
    },

    unknown: {
      en: "Not sure",
      ro: "Nu știu",
    },

    always: {
      en: "Almost all the time",
      ro: "Aproape tot timpul",
    },

    intermittent: {
      en: "It comes and goes",
      ro: "Apare și dispare",
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

    idle: {
      en: "While idling",
      ro: "La ralanti",
    },

    braking: {
      en: "During braking",
      ro: "La frânare",
    },

    turning: {
      en: "While turning",
      ro: "În viraje",
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

  const getFuelLabel = () => {
    if (!vehicle) {
      return "-";
    }

    if (
      vehicle.fuel === "petrol"
    ) {
      return language === "ro"
        ? "Benzină"
        : "Petrol";
    }

    if (
      vehicle.fuel === "diesel"
    ) {
      return "Diesel";
    }

    if (
      vehicle.fuel === "hybrid"
    ) {
      return language === "ro"
        ? "Hibrid"
        : "Hybrid";
    }

    return "Electric";
  };

  const getSymptomAnswers = (
    symptomId: string
  ) => {
    return answers.find(
      (record) =>
        record.symptom_id ===
        symptomId
    );
  };

  const handleStartAnalysis =
    async () => {
      if (
        !vehicle ||
        symptoms.length === 0 ||
        isSubmitting
      ) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      const adaptiveAnswers =
        answers.flatMap(
          (record) =>
            Object.entries(
              record.answers
            ).map(
              ([
                questionId,
                answerValue,
              ]) => ({
                question_id:
                  questionId,

                question:
                  questionLabels[
                    questionId
                  ]?.[
                    language
                  ] ??
                  questionId,

                answer:
                  answerValue,

                symptom_id:
                  record.symptom_id,
              })
            )
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
          vehicle.vehicle_context ??
          null,

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
          adaptiveAnswers,

        additional_notes:
          null,
      };

      try {
        const response =
          await fetch(
  "http://127.0.0.1:8000/api/diagnostic-cases",
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    credentials: "include",

    body:
      JSON.stringify(
        diagnosticCase
      ),
  }
);

        if (!response.ok) {
          const errorDetails =
            await response
              .json()
              .catch(
                () => null
              );

          console.error(
            "Diagnostic case error:",
            errorDetails
          );

          throw new Error(
            "The backend rejected the diagnostic case."
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

        setSubmitError(
          text.sendError
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  if (
    !vehicle ||
    symptoms.length === 0
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">

        <div className="max-w-lg text-center">

          <p className="text-zinc-400">
            {text.missing}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/vehicle"
              )
            }
            className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-black"
          >
            {language === "ro"
              ? "Înapoi la vehicul"
              : "Back to vehicle"}
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">

      <div className="mx-auto w-full max-w-4xl">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          {text.step}
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          {text.title}
        </h1>

        <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
          {text.description}
        </p>


        {/* VEHICLE */}

        <section className="mt-10">

          <div className="flex items-center justify-between gap-4">

            <h2 className="text-xl font-semibold">
              {text.vehicle}
            </h2>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/diagnosis/vehicle"
                )
              }
              className="text-sm text-zinc-500 underline underline-offset-4 hover:text-white"
            >
              {text.editVehicle}
            </button>

          </div>


          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

            <h3 className="text-2xl font-bold">
              {
                vehicle.manufacturer
              }{" "}
              {vehicle.model}
            </h3>


            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <div>

                <p className="text-sm text-zinc-500">
                  {text.fuel}
                </p>

                <p className="mt-1 font-medium">
                  {
                    getFuelLabel()
                  }
                </p>

              </div>


              <div>

                <p className="text-sm text-zinc-500">
                  {text.year}
                </p>

                <p className="mt-1 font-medium">
                  {
                    vehicle.year ??
                    text.unknown
                  }
                </p>

              </div>


              <div>

                <p className="text-sm text-zinc-500">
                  {text.match}
                </p>

                <p className="mt-1 font-medium">
                  {vehicle.vehicle_match ===
                  "exact"
                    ? text.exact
                    : text.partial}
                </p>

              </div>

            </div>


            {vehicle.vehicle_context
              ?.additional_information && (

              <div className="mt-6 border-t border-zinc-800 pt-5">

                <p className="text-sm text-zinc-500">
                  {
                    text.additionalInfo
                  }
                </p>

                <p className="mt-2 whitespace-pre-wrap leading-7 text-zinc-300">
                  {
                    vehicle
                      .vehicle_context
                      .additional_information
                  }
                </p>

              </div>
            )}

          </div>

        </section>


        {/* DTC */}

        <section className="mt-10">

          <h2 className="text-xl font-semibold">
            {text.dtc}
          </h2>

          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

            {dtcCodes.length >
            0 ? (

              <div className="flex flex-wrap gap-3">

                {dtcCodes.map(
                  (code) => (
                    <span
                      key={code}
                      className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 font-mono font-semibold"
                    >
                      {code}
                    </span>
                  )
                )}

              </div>

            ) : (

              <p className="text-zinc-500">
                {text.noDtc}
              </p>

            )}

          </div>

        </section>


        {/* SYMPTOMS */}

        <section className="mt-10">

          <div className="flex items-center justify-between gap-4">

            <h2 className="text-xl font-semibold">
              {text.symptoms}
            </h2>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/diagnosis/symptoms"
                )
              }
              className="text-sm text-zinc-500 underline underline-offset-4 hover:text-white"
            >
              {text.addSymptom}
            </button>

          </div>


          <div className="mt-4 space-y-5">

            {symptoms.map(
              (
                symptom,
                index
              ) => {
                const answerRecord =
                  getSymptomAnswers(
                    symptom.id
                  );

                const symptomAnswers =
                  answerRecord?.answers ??
                  {};

                return (
                  <article
                    key={
                      symptom.id
                    }
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
                  >

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {
                        text.symptom
                      }{" "}
                      {index + 1}
                    </p>

                    <h3 className="mt-3 text-xl font-semibold">
                      {
                        categoryLabels[
                          symptom
                            .primary_category
                        ][language]
                      }
                    </h3>

                    <p className="mt-3 leading-7 text-zinc-400">
                      {
                        symptom.description
                      }
                    </p>


                    <div className="mt-6 border-t border-zinc-800 pt-5">

                      <p className="text-sm font-semibold text-zinc-300">
                        {
                          text.answers
                        }
                      </p>

                      {Object.keys(
                        symptomAnswers
                      ).length >
                      0 ? (

                        <div className="mt-4 space-y-3">

                          {Object.entries(
                            symptomAnswers
                          ).map(
                            ([
                              questionId,
                              answerValue,
                            ]) => (

                              <div
                                key={
                                  questionId
                                }
                                className="flex flex-col justify-between gap-1 rounded-xl bg-zinc-950/70 px-4 py-3 sm:flex-row sm:gap-6"
                              >

                                <span className="text-sm text-zinc-500">
                                  {questionLabels[
                                    questionId
                                  ]?.[
                                    language
                                  ] ??
                                    questionId}
                                </span>

                                <span className="text-sm font-medium">
                                  {answerLabels[
                                    answerValue
                                  ]?.[
                                    language
                                  ] ??
                                    answerValue}
                                </span>

                              </div>

                            )
                          )}

                        </div>

                      ) : (

                        <p className="mt-3 text-sm text-zinc-500">
                          {
                            text.noAnswers
                          }
                        </p>

                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>

        </section>


        {/* START ANALYSIS */}

        <div className="mt-10 flex flex-col items-end gap-4">

          {submitError && (
            <p className="max-w-xl text-right text-sm text-red-400">
              {
                submitError
              }
            </p>
          )}

          <button
            type="button"
            onClick={
              handleStartAnalysis
            }
            disabled={
              isSubmitting
            }
            className="rounded-xl bg-white px-7 py-4 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? text.sending
              : text.start}
          </button>

        </div>

      </div>

    </main>
  );
}