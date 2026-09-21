"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DiagnosticEvidence = {
  label: string;
  points: number;
  source: string;
};

type TechnicalReference = {
  reference_type:
    | "knowledge_base_rule"
    | "obd_dtc"
    | "standard_family";
  identifier: string;
  title: string;
  note: string | null;
  matched_in_case: boolean;
};

type DiagnosticFinding = {
  probable_cause: string;
  confidence: number;
  raw_score: number;
  severity: string;
  description: string;
  recommended_checks: string[];
  score_breakdown: DiagnosticEvidence[];
  urgency:
    | "monitor"
    | "service_soon"
    | "stop_driving";
  safety_message: string;
  evidence_strength?:
    | "limited"
    | "moderate"
    | "strong";
  evidence_sources_count?: number;
  rule_id?: string;
  technical_references?: TechnicalReference[];
};

type DataQualityWarning = {
  code: string;
  level: "info" | "warning";
  message: string;
};

type NextBestDiagnosticStep = {
  id: string;
  priority: number;
  title: string;
  action: string;
  reason: string;
  related_cause: string | null;
};

type DiagnosticAnalysis = {
  case_id: string;
  findings: DiagnosticFinding[];
  data_quality_warnings?: DataQualityWarning[];
  next_best_steps?: NextBestDiagnosticStep[];
};

type Language = "en" | "ro";

type DiagnosticCase = {
  language: Language;

  vehicle: {
    make: string;
    model: string;
    year: number | null;
    engine: string | null;
    fuel_type: string | null;
    mileage_km: number | null;
  };

  symptoms: {
    id: string;
    category: string;
    description: string;
  }[];

  dtc_codes: string[];

  adaptive_answers: {
    question_id: string;
    question: string;
    answer: string | string[];
    symptom_id: string | null;
  }[];

  additional_notes: string | null;
};


function getSeverityLabel(
  severity: string,
  language: Language
) {
  const labels: Record<
    string,
    { ro: string; en: string }
  > = {
    low: {
      ro: "Scăzută",
      en: "Low",
    },

    medium: {
      ro: "Medie",
      en: "Medium",
    },

    high: {
      ro: "Ridicată",
      en: "High",
    },
  };

  return (
    labels[severity]?.[language] ??
    severity
  );
}


function getSeverityClasses(
  severity: string
) {
  if (severity === "high") {
    return (
      "border-red-900 " +
      "bg-red-950/50 " +
      "text-red-300"
    );
  }

  if (severity === "medium") {
    return (
      "border-amber-900 " +
      "bg-amber-950/50 " +
      "text-amber-300"
    );
  }

  return (
    "border-emerald-900 " +
    "bg-emerald-950/50 " +
    "text-emerald-300"
  );
}


function getUrgencyLabel(
  urgency: DiagnosticFinding["urgency"],
  language: Language
) {
  const labels = {
    monitor: {
      ro: "Monitorizează",
      en: "Monitor",
    },

    service_soon: {
      ro: "Verificare recomandată",
      en: "Service soon",
    },

    stop_driving: {
      ro: "Oprește deplasarea",
      en: "Stop driving",
    },
  };

  return labels[urgency][language];
}


function getUrgencyClasses(
  urgency: DiagnosticFinding["urgency"]
) {
  if (urgency === "stop_driving") {
    return (
      "border-red-800 " +
      "bg-red-950/40 " +
      "text-red-200"
    );
  }

  if (urgency === "service_soon") {
    return (
      "border-amber-800 " +
      "bg-amber-950/30 " +
      "text-amber-200"
    );
  }

  return (
    "border-emerald-800 " +
    "bg-emerald-950/30 " +
    "text-emerald-200"
  );
}


function getEvidenceStrengthLabel(
  strength: DiagnosticFinding["evidence_strength"],
  language: Language
) {
  const labels = {
    limited: {
      ro: "Limitată",
      en: "Limited",
    },

    moderate: {
      ro: "Moderată",
      en: "Moderate",
    },

    strong: {
      ro: "Puternică",
      en: "Strong",
    },
  };

  if (
    strength !== "limited" &&
    strength !== "moderate" &&
    strength !== "strong"
  ) {
    return labels.limited[language];
  }

  return labels[strength][language];
}


function getEvidenceStrengthClasses(
  strength: DiagnosticFinding["evidence_strength"]
) {
  if (strength === "strong") {
    return (
      "border-emerald-800 " +
      "bg-emerald-950/40 " +
      "text-emerald-300"
    );
  }

  if (strength === "moderate") {
    return (
      "border-amber-800 " +
      "bg-amber-950/40 " +
      "text-amber-300"
    );
  }

  return (
    "border-zinc-700 " +
    "bg-zinc-900 " +
    "text-zinc-300"
  );
}


function needsMoreDiagnosticData(
  findings: DiagnosticFinding[]
) {
  if (findings.length === 0) {
    return false;
  }

  return findings.every(
    (finding) =>
      !finding.evidence_strength ||
      finding.evidence_strength === "limited"
  );
}


function getEvidenceSourceCountLabel(
  count: number | undefined,
  language: Language
) {
  const safeCount =
    typeof count === "number"
      ? count
      : 0;

  if (language === "ro") {
    return safeCount === 1
      ? "1 sursă independentă"
      : `${safeCount} surse independente`;
  }

  return safeCount === 1
    ? "1 independent source"
    : `${safeCount} independent sources`;
}


export default function AnalysisPage() {
  const router = useRouter();

  const [language, setLanguage] =
    useState<Language>("en");

  const [caseId, setCaseId] =
    useState<string | null>(null);

  const [
    diagnosticCase,
    setDiagnosticCase,
  ] = useState<DiagnosticCase | null>(
    null
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [hasError, setHasError] =
    useState(false);

  const [analysis, setAnalysis] =
    useState<DiagnosticAnalysis | null>(
      null
    );

  const [
    analysisLoading,
    setAnalysisLoading,
  ] = useState(true);

  const [
    analysisError,
    setAnalysisError,
  ] = useState<string | null>(null);

  const [
    selectedFinding,
    setSelectedFinding,
  ] = useState<DiagnosticFinding | null>(
    null
  );


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("language");

    if (
      savedLanguage === "en" ||
      savedLanguage === "ro"
    ) {
      setLanguage(savedLanguage);
    }

    const savedCaseId =
      localStorage.getItem(
        "diagnosticCaseId"
      );

    if (!savedCaseId) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setCaseId(savedCaseId);

    const loadDiagnosticCase =
      async () => {
        try {
          const response = await fetch(
  `http://127.0.0.1:8000/api/diagnostic-cases/${encodeURIComponent(
    savedCaseId
  )}`,
  {
    credentials: "include",
  }
);

          if (!response.ok) {
            throw new Error(
              "Diagnostic case could not be loaded."
            );
          }

          const data: DiagnosticCase =
            await response.json();

          setDiagnosticCase(data);
          setLanguage(data.language);

          try {
            setAnalysisLoading(true);
            setAnalysisError(null);

            const analysisResponse =
              await fetch(
                `http://127.0.0.1:8000/api/diagnostic-cases/${encodeURIComponent(
                  savedCaseId
                )}/analyze`,
                {
                  method: "POST",
                  credentials: "include",
                }
              );

            if (!analysisResponse.ok) {
              throw new Error(
                "Diagnostic analysis failed."
              );
            }

            const analysisData:
              DiagnosticAnalysis =
                await analysisResponse.json();

            setAnalysis(analysisData);
          } catch (error) {
            console.error(
              "Failed to analyze diagnostic case:",
              error
            );

            setAnalysisError(
              data.language === "ro"
                ? "Nu s-a putut genera diagnosticul."
                : "The diagnostic analysis could not be generated."
            );
          } finally {
            setAnalysisLoading(false);
          }
        } catch (error) {
          console.error(
            "Failed to load diagnostic case:",
            error
          );

          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      };

    loadDiagnosticCase();
  }, []);


  const content = {
    en: {
      loading:
        "Loading diagnostic case...",

      errorTitle:
        "The diagnostic case could not be loaded",

      errorDescription:
        "The case may no longer exist because the backend was restarted. Return to the review page and send it again.",

      back:
        "Return to diagnostic review",

      step:
        "DIAGNOSTIC ENGINE",

      title:
        "Diagnostic case received",

      description:
        "The diagnostic engine successfully loaded the information sent from the review page.",

      caseId:
        "Case ID",

      vehicle:
        "Vehicle",

      symptoms:
        "Reported symptoms",

      dtc:
        "DTC codes",

      answers:
        "Diagnostic answers",

      ready:
        "The diagnostic analysis has been completed.",

      interpretGuide:
        "How do I interpret these results?",

      interpretGuideDescription:
        "See what the score, evidence strength, severity and urgency mean.",

      newDiagnosis:
        "Start a new diagnosis",
    },

    ro: {
      loading:
        "Se încarcă cazul de diagnostic...",

      errorTitle:
        "Cazul de diagnostic nu a putut fi încărcat",

      errorDescription:
        "Este posibil ca acest caz să nu mai existe deoarece backendul a fost repornit. Revino la pagina de revizuire și trimite-l din nou.",

      back:
        "Înapoi la revizuirea diagnosticului",

      step:
        "MOTOR DE DIAGNOSTIC",

      title:
        "Caz de diagnostic primit",

      description:
        "Motorul de diagnostic a încărcat cu succes informațiile trimise din pagina de revizuire.",

      caseId:
        "ID caz",

      vehicle:
        "Vehicul",

      symptoms:
        "Simptome raportate",

      dtc:
        "Coduri DTC",

      answers:
        "Răspunsuri de diagnostic",

      ready:
        "Analiza de diagnostic a fost finalizată.",

      interpretGuide:
        "Cum interpretez aceste rezultate?",

      interpretGuideDescription:
        "Vezi ce înseamnă scorul, puterea dovezilor, severitatea și urgența.",

      newDiagnosis:
        "Începe un diagnostic nou",
    },
  };


  const text = content[language];


  const handleNewDiagnosis = () => {
    Object.keys(localStorage).forEach(
      (key) => {
        if (
          key.startsWith("diagnostic")
        ) {
          localStorage.removeItem(key);
        }
      }
    );

    router.push(
      "/diagnosis/vehicle"
    );
  };


  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <p className="text-zinc-400">
          {text.loading}
        </p>
      </main>
    );
  }


  if (
    hasError ||
    !diagnosticCase ||
    !caseId
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold">
            {text.errorTitle}
          </h1>

          <p className="mt-4 leading-7 text-zinc-400">
            {text.errorDescription}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/review"
              )
            }
            className="mt-7 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            {text.back}
          </button>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-3xl">

        {/* HEADER */}

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          {text.step}
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          {text.title}
        </h1>

        <p className="mt-4 leading-7 text-zinc-400">
          {text.description}
        </p>


        {/* CASE ID */}

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <p className="text-sm text-zinc-500">
            {text.caseId}
          </p>

          <p className="mt-2 break-all font-mono text-sm">
            {caseId}
          </p>
        </section>


        {/* VEHICLE */}

        <section className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <p className="text-sm text-zinc-500">
            {text.vehicle}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {diagnosticCase.vehicle.make}{" "}
            {diagnosticCase.vehicle.model}
          </p>

          {diagnosticCase.vehicle.year && (
            <p className="mt-1 text-zinc-400">
              {
                diagnosticCase
                  .vehicle.year
              }
            </p>
          )}
        </section>


        {/* SUMMARY */}

        <section className="mt-5 grid gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <p className="text-sm text-zinc-500">
              {text.symptoms}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                diagnosticCase
                  .symptoms.length
              }
            </p>
          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <p className="text-sm text-zinc-500">
              {text.dtc}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                diagnosticCase
                  .dtc_codes.length
              }
            </p>
          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <p className="text-sm text-zinc-500">
              {text.answers}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                diagnosticCase
                  .adaptive_answers
                  .length
              }
            </p>
          </div>

        </section>


        {/* DIAGNOSTIC RESULTS */}

        <section className="mt-10">

          <h2 className="text-2xl font-bold">
            {language === "ro"
              ? "Rezultatul diagnosticului"
              : "Diagnostic results"}
          </h2>


          {/* LOADING */}

          {analysisLoading && (
            <p className="mt-4 text-zinc-400">
              {language === "ro"
                ? "Analizăm datele vehiculului..."
                : "Analyzing vehicle data..."}
            </p>
          )}


          {/* ERROR */}

          {analysisError && (
            <div className="mt-5 rounded-xl border border-red-900 bg-red-950/30 px-5 py-4">
              <p className="text-sm text-red-300">
                {analysisError}
              </p>
            </div>
          )}


          {/* DIAGNOSTIC DATA SUFFICIENCY */}

          {!analysisLoading &&
            !analysisError &&
            analysis &&
            needsMoreDiagnosticData(
              analysis.findings
            ) && (
              <div className="mt-5 rounded-2xl border border-sky-900 bg-sky-950/20 p-6">

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">
                  {language === "ro"
                    ? "Mai sunt necesare informații"
                    : "More information is recommended"}
                </p>

                <h3 className="mt-2 text-lg font-semibold text-sky-100">
                  {language === "ro"
                    ? "Rezultatele actuale au dovezi limitate"
                    : "The current results have limited supporting evidence"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-sky-100/80">
                  {language === "ro"
                    ? "AutoDiagnose AI poate afișa posibile cauze, dar datele disponibile nu sunt încă suficiente pentru un rezultat bine susținut. Nu interpreta scorul ca pe o confirmare a defecțiunii."
                    : "AutoDiagnose AI can show possible causes, but the available data is not yet sufficient for a well-supported result. Do not interpret the score as confirmation of a fault."}
                </p>

                <div className="mt-4 rounded-xl border border-sky-900/70 bg-zinc-950/40 p-4">

                  <p className="text-sm font-semibold text-sky-200">
                    {language === "ro"
                      ? "Pentru un rezultat mai bun:"
                      : "For a better result:"}
                  </p>

                  <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-400">

                    <li>
                      •{" "}
                      {language === "ro"
                        ? "Adaugă codurile DTC dacă ai acces la un tester OBD-II."
                        : "Add DTC codes if you have access to an OBD-II scanner."}
                    </li>

                    <li>
                      •{" "}
                      {language === "ro"
                        ? "Descrie exact când apare problema: la rece, la ralanti, la accelerație, la frânare etc."
                        : "Describe exactly when the problem occurs: cold start, idle, acceleration, braking, etc."}
                    </li>

                    <li>
                      •{" "}
                      {language === "ro"
                        ? "Menționează martorii aprinși și schimbările de performanță."
                        : "Mention warning lights and any performance changes."}
                    </li>

                    <li>
                      •{" "}
                      {language === "ro"
                        ? "Adaugă informații relevante despre reparații sau probleme anterioare."
                        : "Add relevant information about previous repairs or problems."}
                    </li>

                  </ul>

                </div>

              </div>
            )}


          {/* NEXT BEST DIAGNOSTIC STEPS */}

          {!analysisLoading &&
            !analysisError &&
            analysis &&
            (analysis.next_best_steps?.length ?? 0) >
              0 && (
              <div className="mt-5 rounded-2xl border border-violet-900 bg-violet-950/20 p-6">

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-400">
                  {language === "ro"
                    ? "Ce verifici în continuare"
                    : "What to check next"}
                </p>

                <h3 className="mt-2 text-lg font-semibold text-violet-100">
                  {language === "ro"
                    ? "Pașii cu cea mai mare valoare diagnostică"
                    : "Highest-value diagnostic steps"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-violet-100/80">
                  {language === "ro"
                    ? "Acești pași sunt aleși determinist din datele cazului și din verificările asociate celor mai relevante cauze. Ei nu reprezintă un diagnostic confirmat."
                    : "These steps are selected deterministically from the case data and the checks associated with the most relevant causes. They do not represent a confirmed diagnosis."}
                </p>

                <div className="mt-5 space-y-4">

                  {analysis.next_best_steps?.map(
                    (step) => (
                      <div
                        key={step.id}
                        className="rounded-xl border border-violet-900/60 bg-zinc-950/40 p-4"
                      >

                        <div className="flex items-start gap-3">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-800 bg-violet-950 text-sm font-bold text-violet-300">
                            {step.priority}
                          </div>

                          <div className="min-w-0">

                            <p className="font-semibold text-violet-100">
                              {step.title}
                            </p>

                            {step.related_cause && (
                              <p className="mt-1 text-xs text-zinc-500">
                                {language === "ro"
                                  ? "Legat de: "
                                  : "Related to: "}
                                {step.related_cause}
                              </p>
                            )}

                            <p className="mt-3 text-sm leading-6 text-zinc-300">
                              {step.action}
                            </p>

                            <p className="mt-2 text-xs leading-5 text-zinc-500">
                              {step.reason}
                            </p>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}


          {/* DATA QUALITY WARNINGS */}

          {!analysisLoading &&
            !analysisError &&
            analysis &&
            (analysis.data_quality_warnings?.length ?? 0) >
              0 && (
              <div className="mt-5 rounded-2xl border border-amber-800 bg-amber-950/30 p-6">

                <div className="flex items-start gap-3">

                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-700 bg-amber-950 text-sm font-bold text-amber-300"
                    aria-hidden="true"
                  >
                    !
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                      {language === "ro"
                        ? "Verifică datele introduse"
                        : "Check the entered data"}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-amber-100">
                      {language === "ro"
                        ? "Am detectat informații care se pot contrazice"
                        : "We detected information that may conflict"}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-amber-200/80">
                      {language === "ro"
                        ? "Analiza poate continua, dar aceste neconcordanțe pot influența rezultatele. Verifică informațiile vehiculului înainte de a interpreta diagnosticul."
                        : "The analysis can continue, but these inconsistencies may affect the results. Check the vehicle information before interpreting the diagnosis."}
                    </p>

                  </div>

                </div>

                <div className="mt-5 space-y-3">

                  {analysis.data_quality_warnings?.map(
                    (
                      warning,
                      warningIndex
                    ) => (
                      <div
                        key={`${warning.code}-${warningIndex}`}
                        className="rounded-xl border border-amber-900/70 bg-zinc-950/40 px-4 py-3"
                      >
                        <p className="text-sm leading-6 text-amber-100">
                          {warning.message}
                        </p>
                      </div>
                    )
                  )}

                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/diagnosis/vehicle"
                    )
                  }
                  className="mt-5 rounded-xl border border-amber-700 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-950/60"
                >
                  {language === "ro"
                    ? "Verifică informațiile vehiculului"
                    : "Review vehicle information"}
                </button>

              </div>
            )}


          {/* NO FINDINGS */}

          {!analysisLoading &&
            !analysisError &&
            analysis &&
            analysis.findings.length ===
              0 && (
              <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4">
                <p className="text-zinc-400">
                  {language === "ro"
                    ? "Nu au fost găsite suficiente informații pentru un diagnostic."
                    : "Not enough information was found for a diagnostic result."}
                </p>
              </div>
            )}


          {/* FINDINGS */}

          {!analysisLoading &&
            !analysisError &&
            analysis &&
            analysis.findings.length >
              0 && (
              <div className="mt-6 space-y-5">

                {analysis.findings.map(
                  (
                    finding,
                    index
                  ) => (
                    <div
                      key={`${finding.probable_cause}-${index}`}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                    >

                      {/* TITLE + SCORE */}

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <p className="text-sm text-zinc-500">
                            {language ===
                            "ro"
                              ? `Posibilă cauză #${index + 1}`
                              : `Possible cause #${index + 1}`}
                          </p>

                          <h3 className="mt-1 text-xl font-semibold">
                            {
                              finding
                                .probable_cause
                            }
                          </h3>
                        </div>


                        <div className="shrink-0 text-right">

                          <div className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold">
                            {language === "ro"
                              ? "Scor"
                              : "Score"}{" "}
                            {
                              finding
                                .confidence
                            }
                            /100
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedFinding(
                                finding
                              )
                            }
                            className="mt-2 text-sm font-semibold text-cyan-400 underline underline-offset-4 transition hover:text-cyan-300"
                          >
                            {language === "ro"
                              ? "De ce acest scor?"
                              : "Why this score?"}
                          </button>

                        </div>

                      </div>


                      {/* SEVERITY */}

                      <div className="mt-4 flex items-center gap-3">

                        <span className="text-sm text-zinc-400">
                          {language === "ro"
                            ? "Severitate:"
                            : "Severity:"}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSeverityClasses(
                            finding.severity
                          )}`}
                        >
                          {getSeverityLabel(
                            finding.severity,
                            language
                          )}
                        </span>

                      </div>


                      {/* EVIDENCE STRENGTH */}

                      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/50 px-5 py-4">

                        <div className="flex flex-wrap items-center gap-3">

                          <span className="text-sm text-zinc-400">
                            {language === "ro"
                              ? "Puterea dovezilor:"
                              : "Evidence strength:"}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getEvidenceStrengthClasses(
                              finding.evidence_strength
                            )}`}
                          >
                            {getEvidenceStrengthLabel(
                              finding.evidence_strength,
                              language
                            )}
                          </span>

                        </div>

                        <p className="mt-2 text-sm text-zinc-500">
                          {getEvidenceSourceCountLabel(
                            finding.evidence_sources_count,
                            language
                          )}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-zinc-600">
                          {language === "ro"
                            ? "Acest indicator arată câte tipuri independente de dovezi susțin cauza și este separat de scorul de relevanță."
                            : "This indicator shows how many independent evidence types support the cause and is separate from the relevance score."}
                        </p>

                      </div>


                      {/* TECHNICAL TRACEABILITY */}

                      {(finding.rule_id ||
                        (finding.technical_references?.length ?? 0) > 0) && (
                        <details className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/50">

                          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-zinc-300 transition hover:text-white">
                            {language === "ro"
                              ? "Referințe tehnice și trasabilitate"
                              : "Technical references and traceability"}
                          </summary>

                          <div className="border-t border-zinc-800 px-5 py-4">

                            {finding.rule_id && (
                              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">

                                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                                  {language === "ro"
                                    ? "Regula care a generat acest rezultat"
                                    : "Rule that generated this result"}
                                </p>

                                <p className="mt-2 text-sm font-semibold text-zinc-200">
                                  <span className="font-mono text-cyan-300">
                                    {finding.rule_id}
                                  </span>
                                  {" — "}
                                  {finding.probable_cause}
                                </p>

                                <p className="mt-2 text-xs leading-5 text-zinc-500">
                                  {language === "ro"
                                    ? "ID-ul permite urmărirea exactă a regulii din baza de cunoștințe. Mai jos este explicat ce reprezintă regula și ce tipuri de informații poate folosi."
                                    : "The ID provides exact traceability to the knowledge-base rule. Below you can see what the rule represents and which information types it can use."}
                                </p>

                              </div>
                            )}

                            <div className="mt-4 space-y-3">

                              {finding.technical_references?.map(
                                (
                                  reference,
                                  referenceIndex
                                ) => (
                                  <div
                                    key={`${reference.reference_type}-${reference.identifier}-${referenceIndex}`}
                                    className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
                                  >
                                    <div className="flex flex-wrap items-center gap-2">

                                      <p className="text-sm font-semibold text-zinc-200">
                                        {reference.title}
                                      </p>

                                      {reference.matched_in_case && (
                                        <span className="rounded-full border border-emerald-900 bg-emerald-950/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                                          {language === "ro"
                                            ? "Folosit în acest caz"
                                            : "Used in this case"}
                                        </span>
                                      )}

                                    </div>

                                    <p className="mt-2 font-mono text-xs text-cyan-300">
                                      {reference.identifier}
                                    </p>

                                    {reference.note && (
                                      <p className="mt-2 whitespace-pre-line text-xs leading-5 text-zinc-500">
                                        {reference.note}
                                      </p>
                                    )}

                                  </div>
                                )
                              )}

                            </div>

                            <p className="mt-4 text-xs leading-5 text-zinc-600">
                              {language === "ro"
                                ? "Referințele arată trasabilitatea regulilor și mapărilor OBD-II utilizate de AutoDiagnose AI. Pentru proceduri de reparație specifice modelului trebuie consultată documentația producătorului."
                                : "These references show the traceability of the rules and OBD-II mappings used by AutoDiagnose AI. Manufacturer service information is required for model-specific repair procedures."}
                            </p>

                          </div>

                        </details>
                      )}


                      {/* SAFETY / URGENCY */}

                      <div
                        className={`mt-5 rounded-xl border px-5 py-4 ${getUrgencyClasses(
                          finding.urgency
                        )}`}
                      >
                        <p className="text-xs font-bold uppercase tracking-[0.18em]">
                          {getUrgencyLabel(
                            finding.urgency,
                            language
                          )}
                        </p>

                        <p className="mt-2 text-sm leading-6">
                          {finding.safety_message}
                        </p>
                      </div>


                      {/* DESCRIPTION */}

                      <p className="mt-4 leading-7 text-zinc-300">
                        {
                          finding
                            .description
                        }
                      </p>


                      {/* RECOMMENDED CHECKS */}

                      <div className="mt-5">

                        <h4 className="font-semibold">
                          {language === "ro"
                            ? "Verificări recomandate"
                            : "Recommended checks"}
                        </h4>

                        <ul className="mt-3 space-y-2 text-zinc-300">

                          {finding.recommended_checks.map(
                            (
                              check,
                              checkIndex
                            ) => (
                              <li
                                key={
                                  checkIndex
                                }
                                className="flex gap-2"
                              >
                                <span className="text-zinc-500">
                                  •
                                </span>

                                <span>
                                  {check}
                                </span>
                              </li>
                            )
                          )}

                        </ul>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

        </section>


        {/* SUCCESS */}

        {!analysisLoading &&
          !analysisError &&
          analysis && (
            <div className="mt-8 rounded-xl border border-emerald-900 bg-emerald-950/40 px-5 py-4 text-emerald-300">
              {text.ready}
            </div>
          )}


        {/* RESULT INTERPRETATION GUIDE */}

        <div className="mt-6 rounded-2xl border border-cyan-900/60 bg-cyan-950/10 p-6">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            AutoDiagnose AI Guide
          </p>

          <h3 className="mt-3 text-lg font-semibold">
            {text.interpretGuide}
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {text.interpretGuideDescription}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/guide")
            }
            className="mt-4 text-sm font-semibold text-cyan-400 underline underline-offset-4 transition hover:text-cyan-300"
          >
            {language === "ro"
              ? "Deschide ghidul"
              : "Open guide"}
          </button>

        </div>


        {/* DISCLAIMER */}

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4">
          <p className="text-sm leading-6 text-zinc-400">
            {language === "ro"
              ? "AutoDiagnose AI oferă o analiză orientativă bazată pe informațiile introduse. Rezultatul nu înlocuiește inspecția tehnică, măsurătorile sau diagnosticul realizat de un specialist."
              : "AutoDiagnose AI provides an indicative analysis based on the information provided. The result does not replace a technical inspection, measurements, or diagnosis performed by a qualified specialist."}
          </p>
        </div>


        {/* REPORT + NEW DIAGNOSIS */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/history"
              )
            }
            className="rounded-xl border border-zinc-700 px-6 py-3 font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            {language === "ro"
              ? "Istoric diagnostice"
              : "Diagnostic history"}
          </button>

          {!analysisLoading &&
            !analysisError &&
            analysis && (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/diagnosis/report"
                  )
                }
                className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
              >
                {language === "ro"
                  ? "Vezi raportul complet"
                  : "View full report"}
              </button>
            )}

          <button
            type="button"
            onClick={
              handleNewDiagnosis
            }
            className="rounded-xl border border-zinc-700 px-6 py-3 font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            {text.newDiagnosis}
          </button>

        </div>

      </div>


      {/* SCORE EXPLANATION POPUP */}

      {selectedFinding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() =>
            setSelectedFinding(null)
          }
        >
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* POPUP HEADER */}

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                  {language === "ro"
                    ? "Explicația scorului"
                    : "Score explanation"}
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {language === "ro"
                    ? "De ce această cauză?"
                    : "Why this cause?"}
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  {
                    selectedFinding
                      .probable_cause
                  }
                </p>
              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedFinding(null)
                }
                className="rounded-lg px-3 py-2 text-xl text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                aria-label="Close"
              >
                ×
              </button>

            </div>


            {/* SCORE BREAKDOWN */}

            <div className="mt-6 space-y-3">

              {selectedFinding.score_breakdown.map(
                (
                  evidence,
                  index
                ) => (
                  <div
                    key={`${evidence.source}-${index}`}
                    className="flex items-start justify-between gap-5 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3"
                  >

                    <div>
                      <p className="text-sm text-zinc-200">
                        {
                          evidence
                            .label
                        }
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">

                        {evidence.source ===
                          "base" &&
                          (language === "ro"
                            ? "Scor de bază"
                            : "Base score")}

                        {evidence.source ===
                          "symptom" &&
                          (language === "ro"
                            ? "Simptom raportat"
                            : "Reported symptom")}

                        {evidence.source ===
                          "dtc" &&
                          (language === "ro"
                            ? "Cod DTC"
                            : "DTC code")}

                        {evidence.source ===
                          "adaptive" &&
                          (language === "ro"
                            ? "Răspuns diagnostic"
                            : "Diagnostic answer")}

                        {evidence.source ===
                          "ai_text" &&
                          (language === "ro"
                            ? "Interpretare AI a descrierii"
                            : "AI interpretation of description")}

                        {evidence.source ===
                          "vehicle_context" &&
                          (language === "ro"
                            ? "Istoric și informații despre vehicul"
                            : "Vehicle history and information")}
                      </p>
                    </div>


                    <span className="shrink-0 font-bold text-cyan-400">
                      +{
                        evidence
                          .points
                      }
                    </span>

                  </div>
                )
              )}

            </div>


            {/* SCORE TOTAL */}

            <div className="mt-6 border-t border-zinc-800 pt-5">

              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {language === "ro"
                    ? "Scor calculat"
                    : "Calculated score"}
                </span>

                <span className="text-xl font-bold">
                  {
                    selectedFinding
                      .raw_score
                  }
                </span>
              </div>


              {selectedFinding.raw_score >
                100 && (
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {language === "ro"
                    ? `Scorul brut este ${selectedFinding.raw_score}, dar scorul afișat este limitat la maximum 100/100.`
                    : `The raw score is ${selectedFinding.raw_score}, but the displayed score is capped at 100/100.`}
                </p>
              )}


              <div className="mt-3 flex items-center justify-between">

                <span className="font-semibold text-white">
                  {language === "ro"
                    ? "Scor final"
                    : "Final score"}
                </span>

                <span className="text-xl font-bold text-cyan-400">
                  {
                    selectedFinding
                      .confidence
                  }
                  /100
                </span>

              </div>


              <p className="mt-4 text-xs leading-5 text-zinc-500">
                {language === "ro"
                  ? "Acest scor reprezintă relevanța cauzei pe baza informațiilor analizate. Nu reprezintă probabilitatea statistică a unei defecțiuni."
                  : "This score represents the relevance of the cause based on the analyzed information. It is not the statistical probability of a fault."}
              </p>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}