"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Language = "en" | "ro";

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

  technical_references?:
    TechnicalReference[];
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
  data_quality_warnings?:
    DataQualityWarning[];
  next_best_steps?:
    NextBestDiagnosticStep[];
};

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

  vehicle_context?: {
    additional_information:
      string | null;
  } | null;

  symptoms: {
    id: string;
    category: string;
    description: string;
  }[];

  dtc_codes: string[];

  adaptive_answers: {
    question_id: string;
    question: string;
    answer:
      | string
      | string[];
    symptom_id:
      | string
      | null;
  }[];

  additional_notes:
    | string
    | null;
};


function getSeverityLabel(
  severity: string,
  language: Language
) {
  const labels: Record<
    string,
    {
      ro: string;
      en: string;
    }
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


function getEvidenceStrengthLabel(
  strength:
    | DiagnosticFinding["evidence_strength"]
    | undefined,
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


function formatFuel(
  fuel: string | null,
  language: Language
) {
  if (!fuel) {
    return language === "ro"
      ? "Necunoscut"
      : "Unknown";
  }

  const labels: Record<
    string,
    {
      ro: string;
      en: string;
    }
  > = {
    petrol: {
      ro: "Benzină",
      en: "Petrol",
    },

    diesel: {
      ro: "Diesel",
      en: "Diesel",
    },

    hybrid: {
      ro: "Hibrid",
      en: "Hybrid",
    },

    electric: {
      ro: "Electric",
      en: "Electric",
    },
  };

  return (
    labels[fuel]?.[language] ??
    fuel
  );
}


function formatAnswer(
  answer:
    | string
    | string[]
) {
  if (Array.isArray(answer)) {
    return answer.join(", ");
  }

  return answer;
}


export default function DiagnosticReportPage() {
  const router = useRouter();

  const [language, setLanguage] =
    useState<Language>("en");

  const [
    diagnosticCase,
    setDiagnosticCase,
  ] = useState<DiagnosticCase | null>(
    null
  );

  const [
    analysis,
    setAnalysis,
  ] = useState<DiagnosticAnalysis | null>(
    null
  );

  const [
    caseId,
    setCaseId,
  ] = useState<string | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(false);

  const [
    generatedAt,
    setGeneratedAt,
  ] = useState("");


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );

    if (
      savedLanguage === "ro" ||
      savedLanguage === "en"
    ) {
      setLanguage(
        savedLanguage
      );
    }

    const savedCaseId =
      localStorage.getItem(
        "diagnosticCaseId"
      );

    if (!savedCaseId) {
      setError(true);
      setLoading(false);
      return;
    }

    setCaseId(
      savedCaseId
    );

    const loadReport =
      async () => {
        try {
          const caseResponse =
            await fetch(
              `http://127.0.0.1:8000/api/diagnostic-cases/${encodeURIComponent(
                savedCaseId
              )}`,
    {
      credentials: "include",
    }
            );

          if (
            !caseResponse.ok
          ) {
            throw new Error(
              "Case load failed."
            );
          }

          const caseData:
            DiagnosticCase =
              await caseResponse.json();

          setDiagnosticCase(
            caseData
          );

          setLanguage(
            caseData.language
          );

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

          if (
            !analysisResponse.ok
          ) {
            throw new Error(
              "Analysis load failed."
            );
          }

          const analysisData:
            DiagnosticAnalysis =
              await analysisResponse.json();

          setAnalysis(
            analysisData
          );

          const locale =
            caseData.language === "ro"
              ? "ro-RO"
              : "en-GB";

          const dateText =
            new Intl.DateTimeFormat(
              locale,
              {
                dateStyle: "long",
                timeStyle: "short",
              }
            ).format(
              new Date()
            );

          setGeneratedAt(
            dateText
          );

          document.title =
            `AutoDiagnose-AI-Report-${savedCaseId.slice(
              0,
              8
            )}`;
        } catch (
          loadError
        ) {
          console.error(
            "Failed to load diagnostic report:",
            loadError
          );

          setError(true);
        } finally {
          setLoading(false);
        }
      };

    loadReport();
  }, []);


  const handlePrint =
    () => {
      window.print();
    };


  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <p className="text-zinc-400">
          {language === "ro"
            ? "Se pregătește raportul..."
            : "Preparing report..."}
        </p>
      </main>
    );
  }


  if (
    error ||
    !diagnosticCase ||
    !analysis ||
    !caseId
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">

        <div className="max-w-xl text-center">

          <h1 className="text-3xl font-bold">
            {language === "ro"
              ? "Raportul nu a putut fi încărcat"
              : "The report could not be loaded"}
          </h1>

          <p className="mt-4 leading-7 text-zinc-400">
            {language === "ro"
              ? "Întoarce-te la rezultatele diagnosticului și încearcă din nou."
              : "Return to the diagnostic results and try again."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/analysis"
              )
            }
            className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-black"
          >
            {language === "ro"
              ? "Înapoi la rezultate"
              : "Back to results"}
          </button>

        </div>

      </main>
    );
  }


  const vehicleInfo =
    diagnosticCase
      .vehicle_context
      ?.additional_information
      ?.trim();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white print:bg-white print:px-0 print:py-0 print:text-black">

      <div className="mx-auto w-full max-w-4xl print:max-w-none">

        {/* SCREEN ACTIONS */}

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/analysis"
              )
            }
            className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold transition hover:bg-zinc-900"
          >
            {language === "ro"
              ? "Înapoi la rezultate"
              : "Back to results"}
          </button>

          <button
            type="button"
            onClick={
              handlePrint
            }
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            {language === "ro"
              ? "Printează / Salvează ca PDF"
              : "Print / Save as PDF"}
          </button>

        </div>


        {/* REPORT HEADER */}

        <header className="border-b border-zinc-800 pb-8 print:border-zinc-300">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400 print:text-black">
            AutoDiagnose AI
          </p>

          <h1 className="mt-3 text-4xl font-bold print:text-3xl">
            {language === "ro"
              ? "Raport de diagnostic"
              : "Diagnostic Report"}
          </h1>

          <div className="mt-5 grid gap-2 text-sm text-zinc-400 print:text-zinc-700 sm:grid-cols-2">

            <p>
              <span className="font-semibold text-zinc-300 print:text-black">
                {language === "ro"
                  ? "Case ID:"
                  : "Case ID:"}
              </span>{" "}
              <span className="font-mono">
                {caseId}
              </span>
            </p>

            <p>
              <span className="font-semibold text-zinc-300 print:text-black">
                {language === "ro"
                  ? "Generat:"
                  : "Generated:"}
              </span>{" "}
              {generatedAt}
            </p>

          </div>

        </header>


        {/* VEHICLE */}

        <section className="mt-8 break-inside-avoid rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 print:border-zinc-300 print:bg-white">

          <h2 className="text-xl font-bold">
            {language === "ro"
              ? "Vehicul"
              : "Vehicle"}
          </h2>

          <p className="mt-4 text-2xl font-bold">
            {
              diagnosticCase
                .vehicle.make
            }{" "}
            {
              diagnosticCase
                .vehicle.model
            }
          </p>

          <div className="mt-4 grid gap-3 text-sm text-zinc-400 print:text-zinc-700 sm:grid-cols-2">

            <p>
              <span className="font-semibold text-zinc-300 print:text-black">
                {language === "ro"
                  ? "An:"
                  : "Year:"}
              </span>{" "}
              {
                diagnosticCase
                  .vehicle.year ??
                (language === "ro"
                  ? "Necunoscut"
                  : "Unknown")
              }
            </p>

            <p>
              <span className="font-semibold text-zinc-300 print:text-black">
                {language === "ro"
                  ? "Combustibil:"
                  : "Fuel:"}
              </span>{" "}
              {formatFuel(
                diagnosticCase
                  .vehicle.fuel_type,
                language
              )}
            </p>

            {diagnosticCase
              .vehicle.engine && (
              <p>
                <span className="font-semibold text-zinc-300 print:text-black">
                  {language === "ro"
                    ? "Motor:"
                    : "Engine:"}
                </span>{" "}
                {
                  diagnosticCase
                    .vehicle.engine
                }
              </p>
            )}

            {diagnosticCase
              .vehicle.mileage_km !==
              null && (
              <p>
                <span className="font-semibold text-zinc-300 print:text-black">
                  {language === "ro"
                    ? "Kilometraj:"
                    : "Mileage:"}
                </span>{" "}
                {
                  diagnosticCase
                    .vehicle.mileage_km
                } km
              </p>
            )}

          </div>

          {vehicleInfo && (
            <div className="mt-5 border-t border-zinc-800 pt-4 print:border-zinc-300">

              <p className="text-sm font-semibold">
                {language === "ro"
                  ? "Informații suplimentare"
                  : "Additional vehicle information"}
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-400 print:text-zinc-700">
                {vehicleInfo}
              </p>

            </div>
          )}

        </section>


        {/* INPUT DATA */}

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 print:border-zinc-300 print:bg-white">

          <h2 className="text-xl font-bold">
            {language === "ro"
              ? "Date introduse"
              : "Reported data"}
          </h2>

          <div className="mt-5">

            <h3 className="font-semibold">
              {language === "ro"
                ? "Simptome"
                : "Symptoms"}
            </h3>

            <div className="mt-3 space-y-3">

              {diagnosticCase
                .symptoms.map(
                  (
                    symptom,
                    index
                  ) => (
                    <div
                      key={
                        symptom.id
                      }
                      className="break-inside-avoid rounded-xl border border-zinc-800 p-4 print:border-zinc-300"
                    >
                      <p className="text-sm font-semibold">
                        {index + 1}.{" "}
                        {
                          symptom.category
                        }
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-400 print:text-zinc-700">
                        {
                          symptom.description
                        }
                      </p>
                    </div>
                  )
                )}

            </div>

          </div>


          <div className="mt-6">

            <h3 className="font-semibold">
              DTC
            </h3>

            {diagnosticCase
              .dtc_codes.length >
              0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {diagnosticCase
                  .dtc_codes.map(
                    (code) => (
                      <span
                        key={code}
                        className="rounded-lg border border-zinc-700 px-3 py-1 font-mono text-sm print:border-zinc-400"
                      >
                        {code}
                      </span>
                    )
                  )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-zinc-500 print:text-zinc-700">
                {language === "ro"
                  ? "Nu au fost introduse coduri DTC."
                  : "No DTC codes were entered."}
              </p>
            )}

          </div>


          {diagnosticCase
            .adaptive_answers.length >
            0 && (
            <div className="mt-6">

              <h3 className="font-semibold">
                {language === "ro"
                  ? "Răspunsuri adaptive"
                  : "Adaptive answers"}
              </h3>

              <div className="mt-3 space-y-3">

                {diagnosticCase
                  .adaptive_answers.map(
                    (
                      answer,
                      index
                    ) => (
                      <div
                        key={`${answer.question_id}-${index}`}
                        className="break-inside-avoid rounded-xl border border-zinc-800 p-4 print:border-zinc-300"
                      >
                        <p className="text-sm font-semibold">
                          {
                            answer.question
                          }
                        </p>

                        <p className="mt-2 text-sm text-zinc-400 print:text-zinc-700">
                          {formatAnswer(
                            answer.answer
                          )}
                        </p>
                      </div>
                    )
                  )}

              </div>

            </div>
          )}

        </section>


        {/* DATA QUALITY */}

        {(analysis
          .data_quality_warnings
          ?.length ?? 0) >
          0 && (
          <section className="mt-6 break-inside-avoid rounded-2xl border border-amber-800 bg-amber-950/20 p-6 print:border-zinc-400 print:bg-white">

            <h2 className="text-xl font-bold text-amber-200 print:text-black">
              {language === "ro"
                ? "Avertismente privind datele"
                : "Data quality warnings"}
            </h2>

            <div className="mt-4 space-y-3">

              {analysis
                .data_quality_warnings
                ?.map(
                  (
                    warning,
                    index
                  ) => (
                    <p
                      key={`${warning.code}-${index}`}
                      className="text-sm leading-6 text-amber-100/80 print:text-zinc-700"
                    >
                      •{" "}
                      {
                        warning.message
                      }
                    </p>
                  )
                )}

            </div>

          </section>
        )}


        {/* FINDINGS */}

        <section className="mt-8">

          <h2 className="text-2xl font-bold">
            {language === "ro"
              ? "Rezultatele diagnosticului"
              : "Diagnostic findings"}
          </h2>

          <div className="mt-5 space-y-6">

            {analysis
              .findings.map(
                (
                  finding,
                  index
                ) => (
                  <article
                    key={`${finding.probable_cause}-${index}`}
                    className="break-inside-avoid rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 print:border-zinc-300 print:bg-white"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                          {language === "ro"
                            ? `Cauza posibilă #${index + 1}`
                            : `Possible cause #${index + 1}`}
                        </p>

                        <h3 className="mt-2 text-xl font-bold">
                          {
                            finding
                              .probable_cause
                          }
                        </h3>

                      </div>

                      <div className="shrink-0 rounded-xl border border-cyan-900 bg-cyan-950/20 px-4 py-3 text-center print:border-zinc-400 print:bg-white">

                        <p className="text-xs text-zinc-500">
                          {language === "ro"
                            ? "Scor"
                            : "Score"}
                        </p>

                        <p className="mt-1 text-2xl font-bold text-cyan-300 print:text-black">
                          {
                            finding
                              .confidence
                          }
                          /100
                        </p>

                      </div>

                    </div>


                    <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">

                      <div className="rounded-xl border border-zinc-800 p-4 print:border-zinc-300">

                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          {language === "ro"
                            ? "Dovezi"
                            : "Evidence"}
                        </p>

                        <p className="mt-2 font-semibold">
                          {getEvidenceStrengthLabel(
                            finding
                              .evidence_strength,
                            language
                          )}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500 print:text-zinc-700">
                          {
                            finding
                              .evidence_sources_count ??
                            0
                          }{" "}
                          {language === "ro"
                            ? "surse independente"
                            : "independent sources"}
                        </p>

                      </div>


                      <div className="rounded-xl border border-zinc-800 p-4 print:border-zinc-300">

                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          {language === "ro"
                            ? "Severitate"
                            : "Severity"}
                        </p>

                        <p className="mt-2 font-semibold">
                          {getSeverityLabel(
                            finding.severity,
                            language
                          )}
                        </p>

                      </div>


                      <div className="rounded-xl border border-zinc-800 p-4 print:border-zinc-300">

                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          {language === "ro"
                            ? "Urgență"
                            : "Urgency"}
                        </p>

                        <p className="mt-2 font-semibold">
                          {getUrgencyLabel(
                            finding.urgency,
                            language
                          )}
                        </p>

                      </div>

                    </div>


                    <div className="mt-5">

                      <h4 className="font-semibold">
                        {language === "ro"
                          ? "Descriere"
                          : "Description"}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-zinc-400 print:text-zinc-700">
                        {
                          finding
                            .description
                        }
                      </p>

                    </div>


                    {finding
                      .safety_message && (
                      <div className="mt-5 rounded-xl border border-amber-900 bg-amber-950/20 p-4 print:border-zinc-400 print:bg-white">

                        <p className="text-xs font-bold uppercase tracking-wide text-amber-300 print:text-black">
                          {language === "ro"
                            ? "Siguranță"
                            : "Safety"}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-amber-100/80 print:text-zinc-700">
                          {
                            finding
                              .safety_message
                          }
                        </p>

                      </div>
                    )}


                    <div className="mt-5">

                      <h4 className="font-semibold">
                        {language === "ro"
                          ? "De ce a primit acest scor"
                          : "Why it received this score"}
                      </h4>

                      <div className="mt-3 space-y-2">

                        {finding
                          .score_breakdown.map(
                            (
                              evidence,
                              evidenceIndex
                            ) => (
                              <div
                                key={`${evidence.source}-${evidenceIndex}`}
                                className="flex items-start justify-between gap-4 rounded-lg border border-zinc-800 px-3 py-2 text-sm print:border-zinc-300"
                              >
                                <span className="text-zinc-400 print:text-zinc-700">
                                  {
                                    evidence
                                      .label
                                  }
                                </span>

                                <span className="font-semibold">
                                  +{
                                    evidence
                                      .points
                                  }
                                </span>
                              </div>
                            )
                          )}

                      </div>

                    </div>


                    <div className="mt-5">

                      <h4 className="font-semibold">
                        {language === "ro"
                          ? "Verificări recomandate"
                          : "Recommended checks"}
                      </h4>

                      <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-400 print:text-zinc-700">

                        {finding
                          .recommended_checks.map(
                            (
                              check,
                              checkIndex
                            ) => (
                              <li
                                key={
                                  checkIndex
                                }
                              >
                                • {check}
                              </li>
                            )
                          )}

                      </ul>

                    </div>


                    {(finding.rule_id ||
                      (finding
                        .technical_references
                        ?.length ??
                        0) >
                        0) && (
                      <div className="mt-5 border-t border-zinc-800 pt-5 print:border-zinc-300">

                        <h4 className="font-semibold">
                          {language === "ro"
                            ? "Referințe tehnice și trasabilitate"
                            : "Technical references and traceability"}
                        </h4>

                        {finding
                          .rule_id && (
                          <p className="mt-3 text-sm">
                            <span className="text-zinc-500 print:text-zinc-700">
                              {language === "ro"
                                ? "Regulă: "
                                : "Rule: "}
                            </span>

                            <span className="font-mono">
                              {
                                finding
                                  .rule_id
                              }
                            </span>
                          </p>
                        )}

                        <div className="mt-3 space-y-3">

                          {finding
                            .technical_references
                            ?.map(
                              (
                                reference,
                                referenceIndex
                              ) => (
                                <div
                                  key={`${reference.identifier}-${referenceIndex}`}
                                  className="break-inside-avoid rounded-lg border border-zinc-800 p-4 print:border-zinc-300"
                                >

                                  <p className="text-sm font-semibold">
                                    {
                                      reference
                                        .title
                                    }
                                  </p>

                                  <p className="mt-1 font-mono text-xs text-cyan-300 print:text-black">
                                    {
                                      reference
                                        .identifier
                                    }
                                  </p>

                                  {reference
                                    .note && (
                                    <p className="mt-2 whitespace-pre-line text-xs leading-5 text-zinc-500 print:text-zinc-700">
                                      {
                                        reference
                                          .note
                                      }
                                    </p>
                                  )}

                                </div>
                              )
                            )}

                        </div>

                      </div>
                    )}

                  </article>
                )
              )}

          </div>

        </section>


        {/* NEXT BEST STEPS */}

        {(analysis
          .next_best_steps
          ?.length ?? 0) >
          0 && (
          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 print:border-zinc-300 print:bg-white">

            <h2 className="text-2xl font-bold">
              {language === "ro"
                ? "Ce verifici în continuare"
                : "What to check next"}
            </h2>

            <div className="mt-5 space-y-4">

              {analysis
                .next_best_steps
                ?.map(
                  (step) => (
                    <div
                      key={step.id}
                      className="break-inside-avoid rounded-xl border border-zinc-800 p-4 print:border-zinc-300"
                    >

                      <p className="font-semibold">
                        {step.priority}.{" "}
                        {step.title}
                      </p>

                      {step
                        .related_cause && (
                        <p className="mt-1 text-xs text-zinc-500 print:text-zinc-700">
                          {language === "ro"
                            ? "Legat de: "
                            : "Related to: "}
                          {
                            step
                              .related_cause
                          }
                        </p>
                      )}

                      <p className="mt-3 text-sm leading-6 text-zinc-300 print:text-zinc-700">
                        {step.action}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-zinc-500 print:text-zinc-700">
                        {step.reason}
                      </p>

                    </div>
                  )
                )}

            </div>

          </section>
        )}


        {/* DISCLAIMER */}

        <section className="mt-8 break-inside-avoid border-t border-zinc-800 pt-6 text-sm leading-6 text-zinc-500 print:border-zinc-300 print:text-zinc-700">

          <p className="font-semibold text-zinc-300 print:text-black">
            {language === "ro"
              ? "Notă importantă"
              : "Important note"}
          </p>

          <p className="mt-2">
            {language === "ro"
              ? "AutoDiagnose AI oferă suport orientativ pentru diagnostic pe baza informațiilor introduse. Scorurile reprezintă relevanța regulilor pentru datele cazului și nu probabilități statistice. Raportul nu înlocuiește inspecția tehnică, măsurătorile, documentația de service a producătorului sau diagnosticul realizat de un specialist calificat."
              : "AutoDiagnose AI provides indicative diagnostic support based on the information entered. Scores represent rule relevance to the case data and are not statistical probabilities. This report does not replace technical inspection, measurements, manufacturer service information, or diagnosis by a qualified professional."}
          </p>

        </section>


        {/* PRINT HELP */}

        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-sm text-zinc-400 print:hidden">

          <p className="font-semibold text-white">
            {language === "ro"
              ? "Cum salvezi PDF-ul"
              : "How to save the PDF"}
          </p>

          <p className="mt-2 leading-6">
            {language === "ro"
              ? "Apasă „Printează / Salvează ca PDF”, apoi alege opțiunea „Save as PDF / Salvează ca PDF” din fereastra de printare a browserului."
              : "Press “Print / Save as PDF”, then select “Save as PDF” in your browser's print dialog."}
          </p>

        </div>

      </div>

    </main>
  );
}
