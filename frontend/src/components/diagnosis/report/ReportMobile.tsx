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

import styles from "./report-print.module.css";


type Language =
  | "ro"
  | "en";


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

  note:
    | string
    | null;

  matched_in_case: boolean;
};


type DiagnosticFinding = {
  probable_cause: string;

  confidence: number;

  raw_score: number;

  severity: string;

  description: string;

  recommended_checks:
    string[];

  score_breakdown:
    DiagnosticEvidence[];

  urgency:
    | "monitor"
    | "service_soon"
    | "stop_driving";

  safety_message: string;

  evidence_strength?:
    | "limited"
    | "moderate"
    | "strong";

  evidence_sources_count?:
    number;

  rule_id?: string;

  technical_references?:
    TechnicalReference[];
};


type DataQualityWarning = {
  code: string;

  level:
    | "info"
    | "warning";

  message: string;
};


type NextBestDiagnosticStep = {
  id: string;

  priority: number;

  title: string;

  action: string;

  reason: string;

  related_cause:
    | string
    | null;
};


type DiagnosticAnalysis = {
  case_id: string;

  findings:
    DiagnosticFinding[];

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

    year:
      | number
      | null;

    engine:
      | string
      | null;

    fuel_type:
      | string
      | null;

    mileage_km:
      | number
      | null;
  };

  vehicle_context?: {
    additional_information?:
      | string
      | null;
  };

  symptoms: {
    id: string;
    category: string;
    description: string;
  }[];

  dtc_codes:
    string[];

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


const CONTACT_EMAIL =
  "support@autodiagnose.ai";


function clampScore(
  score:
    number
) {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        score
      )
    )
  );
}


function formatFuel(
  value:
    string | null,
  language:
    Language
) {
  if (
    !value
  ) {
    return language ===
      "ro"
      ? "Necunoscut"
      : "Unknown";
  }


  const labels:
    Record<
      string,
      {
        ro: string;
        en: string;
      }
    > = {
    petrol: {
      ro:
        "Benzină",

      en:
        "Petrol",
    },

    diesel: {
      ro:
        "Diesel",

      en:
        "Diesel",
    },

    hybrid: {
      ro:
        "Hibrid",

      en:
        "Hybrid",
    },

    electric: {
      ro:
        "Electric",

      en:
        "Electric",
    },
  };


  return (
    labels[
      value
    ]?.[
      language
    ] ??
    value
  );
}


function formatSeverity(
  value:
    string,
  language:
    Language
) {
  const labels:
    Record<
      string,
      {
        ro: string;
        en: string;
      }
    > = {
    low: {
      ro:
        "Scăzută",

      en:
        "Low",
    },

    medium: {
      ro:
        "Medie",

      en:
        "Medium",
    },

    high: {
      ro:
        "Ridicată",

      en:
        "High",
    },
  };


  return (
    labels[
      value
    ]?.[
      language
    ] ??
    value
  );
}


function formatUrgency(
  value:
    DiagnosticFinding[
      "urgency"
    ],
  language:
    Language
) {
  const labels = {
    monitor: {
      ro:
        "Monitorizare",

      en:
        "Monitor",
    },

    service_soon: {
      ro:
        "Verificare recomandată",

      en:
        "Service soon",
    },

    stop_driving: {
      ro:
        "Oprește deplasarea",

      en:
        "Stop driving",
    },
  };


  return labels[
    value
  ][
    language
  ];
}


function formatStrength(
  value:
    DiagnosticFinding[
      "evidence_strength"
    ],
  language:
    Language
) {
  const labels = {
    limited: {
      ro:
        "Limitată",

      en:
        "Limited",
    },

    moderate: {
      ro:
        "Moderată",

      en:
        "Moderate",
    },

    strong: {
      ro:
        "Puternică",

      en:
        "Strong",
    },
  };


  if (
    value !==
      "limited" &&
    value !==
      "moderate" &&
    value !==
      "strong"
  ) {
    return language ===
      "ro"
      ? "Nespecificată"
      : "Not specified";
  }


  return labels[
    value
  ][
    language
  ];
}


function formatGeneratedDate(
  value:
    Date,
  language:
    Language
) {
  return new Intl.DateTimeFormat(
    language ===
      "ro"
      ? "ro-RO"
      : "en-GB",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    }
  ).format(
    value
  );
}


function getEvidenceSourceLabel(
  source:
    string,
  language:
    Language
) {
  const labels:
    Record<
      string,
      {
        ro: string;
        en: string;
      }
    > = {
    base: {
      ro:
        "Scor de bază",

      en:
        "Base score",
    },

    symptom: {
      ro:
        "Simptome",

      en:
        "Symptoms",
    },

    dtc: {
      ro:
        "Coduri DTC",

      en:
        "DTC codes",
    },

    adaptive: {
      ro:
        "Răspunsuri adaptive",

      en:
        "Adaptive answers",
    },

    ai_text: {
      ro:
        "Interpretare descriere",

      en:
        "Description interpretation",
    },

    vehicle_context: {
      ro:
        "Context vehicul",

      en:
        "Vehicle context",
    },
  };


  return (
    labels[
      source
    ]?.[
      language
    ] ??
    source
  );
}


export default function ReportMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );


  const [
    caseId,
    setCaseId,
  ] = useState<
    string | null
  >(null);


  const [
    diagnosticCase,
    setDiagnosticCase,
  ] = useState<
    DiagnosticCase | null
  >(null);


  const [
    analysis,
    setAnalysis,
  ] = useState<
    DiagnosticAnalysis | null
  >(null);


  const [
    loading,
    setLoading,
  ] = useState(
    true
  );


  const [
    error,
    setError,
  ] = useState(
    false
  );


  const [
    generatedAt,
    setGeneratedAt,
  ] = useState<Date>(
    new Date()
  );


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );


    if (
      savedLanguage ===
        "ro" ||
      savedLanguage ===
        "en"
    ) {
      setLanguage(
        savedLanguage
      );
    }


    const queryCaseId =
      new URLSearchParams(
        window.location.search
      ).get(
        "caseId"
      );


    const savedCaseId =
      queryCaseId ??
      localStorage.getItem(
        "diagnosticCaseId"
      );


    if (
      !savedCaseId
    ) {
      setError(
        true
      );

      setLoading(
        false
      );

      return;
    }


    const currentCaseId:
      string =
      savedCaseId;


    localStorage.setItem(
      "diagnosticCaseId",
      currentCaseId
    );


    setCaseId(
      currentCaseId
    );


    async function loadReport() {
      try {
        const caseResponse =
          await fetch(
            `${API_BASE_URL}/api/diagnostic-cases/${encodeURIComponent(
              currentCaseId
            )}`,
            {
              method:
                "GET",

              credentials:
                "include",
            }
          );


        if (
          !caseResponse.ok
        ) {
          throw new Error(
            "CASE_LOAD_FAILED"
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
            `${API_BASE_URL}/api/diagnostic-cases/${encodeURIComponent(
              currentCaseId
            )}/analyze`,
            {
              method:
                "POST",

              credentials:
                "include",
            }
          );


        if (
          !analysisResponse.ok
        ) {
          throw new Error(
            "ANALYSIS_LOAD_FAILED"
          );
        }


        const analysisData:
          DiagnosticAnalysis =
          await analysisResponse.json();


        setAnalysis(
          analysisData
        );


        setGeneratedAt(
          new Date()
        );

      } catch (
        loadError
      ) {
        console.error(
          "Failed to load diagnostic report:",
          loadError
        );


        setError(
          true
        );

      } finally {
        setLoading(
          false
        );
      }
    }


    void loadReport();

  }, []);


  const content = {
    en: {
      report:
        "DIAGNOSTIC REPORT",

      reportTitle:
        "Vehicle diagnostic assessment",

      generated:
        "Generated",

      caseId:
        "Case ID",

      vehicle:
        "Vehicle",

      year:
        "Year",

      fuel:
        "Fuel",

      engine:
        "Engine",

      mileage:
        "Mileage",

      notProvided:
        "Not provided",

      completed:
        "Analysis completed",

      executiveSummary:
        "Diagnostic summary",

      primaryFinding:
        "Primary finding",

      relevance:
        "Relevance",

      severity:
        "Severity",

      urgency:
        "Urgency",

      evidence:
        "Evidence",

      safety:
        "Safety note",

      hypothesisChart:
        "Hypothesis comparison",

      hypothesisHint:
        "Relative relevance of the causes identified by the diagnostic engine.",

      evidenceChart:
        "Evidence contribution",

      evidenceHint:
        "Signals contributing to the primary diagnostic hypothesis.",

      additional:
        "Additional hypotheses",

      symptoms:
        "Reported symptoms",

      dtc:
        "DTC evidence",

      noDtc:
        "No DTC codes were entered.",

      answers:
        "Adaptive answers",

      nextSteps:
        "Recommended diagnostic path",

      checks:
        "Recommended checks",

      technicalBasis:
        "Technical traceability",

      dataQuality:
        "Data quality notes",

      context:
        "Vehicle context",

      noWarnings:
        "No important data-quality warnings were detected.",

      diagnosticNotice:
        "Important diagnostic notice",

      disclaimer:
        "AutoDiagnose AI is a decision-support tool. Findings are indicative and must be confirmed through physical inspection, measurements and manufacturer service information before repair decisions are made.",

      scoreNotice:
        "Scores represent diagnostic relevance, not statistical failure probability.",

      contact:
        "Support",

      contactText:
        "Questions about this report or AutoDiagnose AI:",

      print:
        "Print / Save as PDF",

      back:
        "Back to analysis",

      history:
        "History",

      loadError:
        "The report could not be loaded.",

      loadErrorDescription:
        "Check your session and backend connection, then try again.",

      retry:
        "Back to analysis",

      sources:
        "evidence sources",

      pageNote:
        "Generated by AutoDiagnose AI · Vehicle Intelligence",

      details:
        "Diagnostic evidence",
    },


    ro: {
      report:
        "RAPORT DE DIAGNOSTIC",

      reportTitle:
        "Evaluare diagnostică a vehiculului",

      generated:
        "Generat",

      caseId:
        "ID caz",

      vehicle:
        "Vehicul",

      year:
        "An",

      fuel:
        "Combustibil",

      engine:
        "Motor",

      mileage:
        "Kilometraj",

      notProvided:
        "Neintrodus",

      completed:
        "Analiză finalizată",

      executiveSummary:
        "Rezumat diagnostic",

      primaryFinding:
        "Rezultat principal",

      relevance:
        "Relevanță",

      severity:
        "Severitate",

      urgency:
        "Urgență",

      evidence:
        "Dovezi",

      safety:
        "Notă de siguranță",

      hypothesisChart:
        "Comparația ipotezelor",

      hypothesisHint:
        "Relevanța relativă a cauzelor identificate de motorul de diagnostic.",

      evidenceChart:
        "Contribuția dovezilor",

      evidenceHint:
        "Semnalele care au contribuit la ipoteza principală de diagnostic.",

      additional:
        "Ipoteze suplimentare",

      symptoms:
        "Simptome raportate",

      dtc:
        "Dovezi DTC",

      noDtc:
        "Nu au fost introduse coduri DTC.",

      answers:
        "Răspunsuri adaptive",

      nextSteps:
        "Traseu recomandat de diagnostic",

      checks:
        "Verificări recomandate",

      technicalBasis:
        "Trasabilitate tehnică",

      dataQuality:
        "Observații privind datele",

      context:
        "Context vehicul",

      noWarnings:
        "Nu au fost detectate avertismente importante privind calitatea datelor.",

      diagnosticNotice:
        "Notă importantă de diagnostic",

      disclaimer:
        "AutoDiagnose AI este un instrument de suport pentru decizie. Concluziile sunt orientative și trebuie confirmate prin inspecție fizică, măsurători și documentația producătorului înainte de luarea deciziilor de reparație.",

      scoreNotice:
        "Scorurile reprezintă relevanță diagnostică, nu probabilitatea statistică a unei defecțiuni.",

      contact:
        "Contact",

      contactText:
        "Întrebări despre raport sau AutoDiagnose AI:",

      print:
        "Printează / Salvează PDF",

      back:
        "Înapoi la analiză",

      history:
        "Istoric",

      loadError:
        "Raportul nu a putut fi încărcat.",

      loadErrorDescription:
        "Verifică sesiunea și conexiunea cu backend-ul, apoi încearcă din nou.",

      retry:
        "Înapoi la analiză",

      sources:
        "surse de dovezi",

      pageNote:
        "Generat de AutoDiagnose AI · Vehicle Intelligence",

      details:
        "Dovezi diagnostic",
    },
  };


  const text =
    content[
      language
    ];


  const findings =
    analysis?.findings ??
    [];


  const primaryFinding =
    findings[0] ??
    null;


  const secondaryFindings =
    findings.slice(
      1
    );


  const nextSteps =
    analysis
      ?.next_best_steps ??
    [];


  const warnings =
    analysis
      ?.data_quality_warnings ??
    [];


  const vehicleName =
    diagnosticCase
      ? `${diagnosticCase.vehicle.make} ${diagnosticCase.vehicle.model}`.trim()
      : "";


  const vehicleContext =
    diagnosticCase
      ?.vehicle_context
      ?.additional_information
      ?.trim() ??
    "";


  const primaryReferences =
    useMemo(
      () =>
        primaryFinding
          ?.technical_references ??
        [],

      [
        primaryFinding,
      ]
    );


  const evidenceChart =
    useMemo(
      () => {
        if (
          !primaryFinding
        ) {
          return [];
        }


        const totals =
          new Map<
            string,
            number
          >();


        primaryFinding
          .score_breakdown
          .forEach(
            (
              evidence
            ) => {
              totals.set(
                evidence.source,

                (
                  totals.get(
                    evidence.source
                  ) ??
                  0
                ) +
                  evidence.points
              );
            }
          );


        return Array.from(
          totals.entries()
        )
          .map(
            ([
              source,
              points,
            ]) => ({
              source,

              points,

              label:
                getEvidenceSourceLabel(
                  source,
                  language
                ),
            })
          )
          .sort(
            (
              first,
              second
            ) =>
              Math.abs(
                second.points
              ) -
              Math.abs(
                first.points
              )
          );
      },

      [
        primaryFinding,
        language,
      ]
    );


  const maxEvidence =
    useMemo(
      () =>
        Math.max(
          1,
          ...evidenceChart.map(
            (
              item
            ) =>
              Math.abs(
                item.points
              )
          )
        ),

      [
        evidenceChart,
      ]
    );


  if (
    loading
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
            text-center
          "
        >
          <div
            className="
              relative
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
            "
          >
            <div
              className="
                absolute
                h-20
                w-20
                animate-pulse
                rounded-full
                border
                border-blue-400/15
              "
            />

            <div
              className="
                h-10
                w-10
                rounded-full
                border
                border-blue-400/20
                bg-blue-500/[0.07]
              "
            />
          </div>

          <p
            className="
              mt-3
              text-[9px]
              font-semibold
              text-zinc-400
            "
          >
            AutoDiagnose AI
          </p>
        </div>
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
            max-w-[350px]
            rounded-[18px]
            border
            border-red-400/10
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
              border-red-400/15
              bg-red-400/[0.05]
              text-red-200
            "
          >
            !
          </div>

          <h1
            className="
              mt-3
              text-[14px]
              font-semibold
            "
          >
            {
              text.loadError
            }
          </h1>

          <p
            className="
              mt-1.5
              text-[8px]
              leading-4
              text-zinc-600
            "
          >
            {
              text.loadErrorDescription
            }
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/analysis"
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
            "
          >
            ← {
              text.retry
            }
          </button>
        </div>
      </main>
    );
  }


  return (
    <main
      id="diagnostic-report-root"
      className={`${styles.root}
        min-h-screen
        bg-[#060912]
        px-3.5
        pb-[110px]
        pt-3
        text-white

        print:min-h-0
        print:bg-white
        print:p-0
        print:text-black
      `}
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[560px]

          print:max-w-none
        "
      >
        {/* ACTION BAR */}

        <div
          className="
            mb-2
            grid
            grid-cols-[0.8fr_0.65fr_1.35fr]
            gap-1.5

            print:hidden
          "
        >
          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/analysis"
              )
            }
            className="
              min-h-[38px]
              rounded-[10px]
              border
              border-white/[0.06]
              bg-white/[0.015]
              px-2
              text-[7px]
              font-semibold
              text-zinc-500
            "
          >
            ← {text.back}
          </button>


          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/history"
              )
            }
            className="
              min-h-[38px]
              rounded-[10px]
              border
              border-white/[0.06]
              bg-white/[0.015]
              text-[7px]
              font-semibold
              text-zinc-500
            "
          >
            {
              text.history
            }
          </button>


          <button
            type="button"
            onClick={() =>
              window.print()
            }
            className="
              min-h-[38px]
              rounded-[10px]
              bg-blue-500
              px-2
              text-[7px]
              font-semibold
              text-white
              shadow-[0_8px_22px_rgba(37,99,235,0.18)]
            "
          >
            {
              text.print
            }
          </button>
        </div>


        {/* REPORT */}

        <article
          className={`${styles.sheet}
            report-sheet
            overflow-hidden
            rounded-[20px]
            border
            border-white/[0.065]
            bg-[#080d18]
            shadow-[0_18px_55px_rgba(0,0,0,0.24)]

            print:overflow-visible
            print:rounded-none
            print:border-0
            print:bg-white
            print:shadow-none
          `}
        >
          {/* HEADER */}

          <header
            className="
              relative
              overflow-hidden
              border-b
              border-white/[0.05]
              p-3.5

              print:border-slate-300
              print:p-0
              print:pb-[5mm]
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-36
                w-36
                rounded-full
                bg-blue-500/[0.13]
                blur-[50px]

                print:hidden
              "
            />


            <div
              className="
                relative
                flex
                items-start
                justify-between
                gap-3

                print:items-start
              "
            >
              <div
                className="
                  min-w-0
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-[9px]
                      border
                      border-blue-400/20
                      bg-blue-500/[0.08]
                      text-[9px]
                      font-bold
                      text-blue-100

                      print:h-8
                      print:w-8
                      print:rounded
                      print:border-slate-300
                      print:bg-white
                      print:text-slate-950
                    "
                  >
                    A
                  </div>


                  <div>
                    <p
                      className="
                        text-[11px]
                        font-semibold
                        text-zinc-100

                        print:text-[14pt]
                        print:text-slate-950
                      "
                    >
                      AutoDiagnose AI
                    </p>

                    <p
                      className="
                        text-[5.5px]
                        uppercase
                        tracking-[0.13em]
                        text-blue-200/50

                        print:text-[7pt]
                        print:text-slate-500
                      "
                    >
                      Vehicle Intelligence
                    </p>
                  </div>
                </div>


                <p
                  className="
                    mt-3
                    text-[6px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-blue-300/55

                    print:mt-[3mm]
                    print:text-[7pt]
                    print:text-slate-500
                  "
                >
                  {
                    text.report
                  }
                </p>


                <h1
                  className="
                    mt-1
                    text-[18px]
                    font-semibold
                    leading-tight
                    tracking-[-0.04em]

                    print:text-[19pt]
                    print:text-slate-950
                  "
                >
                  {
                    text.reportTitle
                  }
                </h1>


                <p
                  className="
                    mt-1
                    truncate
                    text-[8px]
                    font-medium
                    text-zinc-400

                    print:text-[9pt]
                    print:text-slate-700
                  "
                >
                  {
                    vehicleName
                  }
                </p>
              </div>


              <div
                className="
                  shrink-0
                  text-right
                "
              >
                <span
                  className="
                    inline-flex
                    rounded-full
                    border
                    border-emerald-400/12
                    bg-emerald-400/[0.04]
                    px-2
                    py-1
                    text-[5.5px]
                    font-semibold
                    text-emerald-300

                    print:border-emerald-700
                    print:bg-white
                    print:text-[7pt]
                    print:text-emerald-800
                  "
                >
                  ✓ {
                    text.completed
                  }
                </span>


                <p
                  className="
                    mt-2
                    text-[5.5px]
                    text-zinc-600

                    print:text-[7pt]
                    print:text-slate-600
                  "
                >
                  {
                    text.generated
                  }
                </p>

                <p
                  className="
                    mt-0.5
                    text-[6px]
                    text-zinc-400

                    print:text-[7pt]
                    print:text-slate-800
                  "
                >
                  {
                    formatGeneratedDate(
                      generatedAt,
                      language
                    )
                  }
                </p>
              </div>
            </div>


            <p
              className="
                relative
                mt-2
                truncate
                font-mono
                text-[5.5px]
                text-zinc-700

                print:text-[6.5pt]
                print:text-slate-500
              "
            >
              {
                text.caseId
              }: {caseId}
            </p>
          </header>


          <div
            className="
              space-y-2.5
              p-3

              print:space-y-[4mm]
              print:p-0
              print:pt-[4mm]
            "
          >
            {/* VEHICLE */}

            <section
              className={`${styles.block}
                report-block
                grid
                grid-cols-2
                gap-1.5

                print:grid-cols-5
                print:gap-[2mm]
              `}
            >
              {[
                {
                  label:
                    text.vehicle,

                  value:
                    vehicleName,
                },

                {
                  label:
                    text.year,

                  value:
                    diagnosticCase
                      .vehicle.year ??
                    text.notProvided,
                },

                {
                  label:
                    text.fuel,

                  value:
                    formatFuel(
                      diagnosticCase
                        .vehicle
                        .fuel_type,
                      language
                    ),
                },

                {
                  label:
                    text.engine,

                  value:
                    diagnosticCase
                      .vehicle.engine ??
                    text.notProvided,
                },

                {
                  label:
                    text.mileage,

                  value:
                    diagnosticCase
                      .vehicle
                      .mileage_km
                      ? `${diagnosticCase.vehicle.mileage_km.toLocaleString()} km`
                      : text.notProvided,
                },
              ].map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item.label
                    }
                    className={`
                      rounded-[10px]
                      border
                      border-white/[0.05]
                      bg-white/[0.012]
                      px-2.5
                      py-2

                      print:rounded
                      print:border-slate-300
                      print:bg-white
                      print:p-[2.5mm]

                      ${
                        index ===
                        0
                          ? "col-span-2 print:col-span-1"
                          : ""
                      }
                    `}
                  >
                    <p
                      className="
                        text-[5px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-zinc-700

                        print:text-[6.5pt]
                        print:text-slate-500
                      "
                    >
                      {
                        item.label
                      }
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[7.5px]
                        font-semibold
                        text-zinc-300

                        print:text-[8pt]
                        print:text-slate-950
                      "
                    >
                      {
                        item.value
                      }
                    </p>
                  </div>
                )
              )}
            </section>


            {/* PRIMARY RESULT */}

            {primaryFinding && (
              <section
                className={`${styles.block}
                  report-block
                  relative
                  overflow-hidden
                  rounded-[16px]
                  border
                  border-blue-400/12
                  bg-blue-500/[0.025]
                  p-3

                  print:rounded
                  print:border-slate-400
                  print:bg-slate-50
                  print:p-[4mm]
                `}
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-28
                    w-28
                    rounded-full
                    bg-blue-500/[0.10]
                    blur-[40px]

                    print:hidden
                  "
                />


                <div
                  className="
                    relative
                    flex
                    items-start
                    gap-3

                    print:grid
                    print:grid-cols-[minmax(0,1fr)_38mm]
                    print:gap-[5mm]
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
                        text-[5.5px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-blue-200/60

                        print:text-[7pt]
                        print:text-slate-500
                      "
                    >
                      {
                        text.executiveSummary
                      }
                    </p>


                    <h2
                      className="
                        mt-1
                        text-[14px]
                        font-semibold
                        leading-tight
                        tracking-[-0.025em]

                        print:text-[14pt]
                        print:text-slate-950
                      "
                    >
                      {
                        primaryFinding
                          .probable_cause
                      }
                    </h2>


                    <p
                      className="
                        mt-1.5
                        text-[7px]
                        leading-3.5
                        text-zinc-500

                        print:text-[8pt]
                        print:leading-[1.35]
                        print:text-slate-700
                      "
                    >
                      {
                        primaryFinding
                          .description
                      }
                    </p>


                    <div
                      className="
                        mt-2
                        grid
                        grid-cols-3
                        gap-1

                        print:flex
                        print:flex-wrap
                        print:gap-[1.5mm]
                      "
                    >
                      {[
                        `${text.severity}: ${formatSeverity(
                          primaryFinding
                            .severity,
                          language
                        )}`,

                        `${text.urgency}: ${formatUrgency(
                          primaryFinding
                            .urgency,
                          language
                        )}`,

                        `${text.evidence}: ${formatStrength(
                          primaryFinding
                            .evidence_strength,
                          language
                        )}`,
                      ].map(
                        (
                          label
                        ) => (
                          <span
                            key={
                              label
                            }
                            className="
                              rounded-[7px]
                              border
                              border-white/[0.06]
                              bg-white/[0.018]
                              px-1.5
                              py-1.5
                              text-center
                              text-[5px]
                              font-semibold
                              text-zinc-300

                              print:rounded
                              print:border-slate-300
                              print:bg-white
                              print:px-[2mm]
                              print:py-[0.6mm]
                              print:text-[7pt]
                              print:text-slate-800
                            "
                          >
                            {
                              label
                            }
                          </span>
                        )
                      )}
                    </div>
                  </div>


                  {/* SCORE */}

                  <div
                    className="
                      shrink-0
                      text-center
                    "
                  >
                    <div
                      className="
                        relative
                        flex
                        h-[76px]
                        w-[76px]
                        items-center
                        justify-center
                        rounded-full

                        print:h-auto
                        print:w-auto
                        print:rounded
                        print:border
                        print:border-slate-300
                        print:bg-white
                        print:p-[3mm]
                      "
                      style={{
                        background:
                          `conic-gradient(rgba(96,165,250,0.95) ${clampScore(
                            primaryFinding
                              .confidence
                          )}%, rgba(255,255,255,0.055) 0)`,
                      }}
                    >
                      <div
                        className="
                          flex
                          h-[62px]
                          w-[62px]
                          flex-col
                          items-center
                          justify-center
                          rounded-full
                          bg-[#080d18]

                          print:h-auto
                          print:w-auto
                          print:bg-white
                        "
                      >
                        <span
                          className="
                            text-[19px]
                            font-semibold
                            leading-none

                            print:text-[22pt]
                            print:text-slate-950
                          "
                        >
                          {
                            clampScore(
                              primaryFinding
                                .confidence
                            )
                          }
                        </span>

                        <span
                          className="
                            text-[5.5px]
                            text-zinc-600

                            print:text-[7pt]
                            print:text-slate-500
                          "
                        >
                          /100
                        </span>
                      </div>
                    </div>

                    <p
                      className="
                        mt-1
                        text-[5.5px]
                        font-semibold
                        text-zinc-500

                        print:text-[7pt]
                        print:text-slate-700
                      "
                    >
                      {
                        text.relevance
                      }
                    </p>
                  </div>
                </div>


                {primaryFinding
                  .safety_message && (
                  <div
                    className="
                      relative
                      mt-2
                      rounded-[9px]
                      border
                      border-amber-400/12
                      bg-amber-400/[0.035]
                      px-2.5
                      py-2
                      text-[6.5px]
                      leading-3.5
                      text-amber-100

                      print:rounded
                      print:border-amber-500
                      print:bg-amber-50
                      print:px-[3mm]
                      print:py-[2mm]
                      print:text-[8pt]
                      print:text-amber-950
                    "
                  >
                    <strong>
                      {
                        text.safety
                      }:{" "}
                    </strong>

                    {
                      primaryFinding
                        .safety_message
                    }
                  </div>
                )}
              </section>
            )}


            {/* GRAPH - FINDINGS */}

            {findings.length >
              0 && (
              <section
                className={`${styles.block}
                  report-block
                  rounded-[15px]
                  border
                  border-white/[0.055]
                  bg-white/[0.012]
                  p-3

                  print:rounded
                  print:border-slate-300
                  print:bg-white
                  print:p-[3.5mm]
                `}
              >
                <h3
                  className="
                    text-[8px]
                    font-semibold
                    text-zinc-300

                    print:text-[10pt]
                    print:text-slate-950
                  "
                >
                  {
                    text.hypothesisChart
                  }
                </h3>

                <p
                  className="
                    mt-0.5
                    text-[5.5px]
                    text-zinc-700

                    print:text-[7pt]
                    print:text-slate-500
                  "
                >
                  {
                    text.hypothesisHint
                  }
                </p>


                <div
                  className="
                    mt-2.5
                    space-y-2

                    print:mt-[2mm]
                    print:space-y-[1.5mm]
                  "
                >
                  {findings.map(
                    (
                      finding,
                      index
                    ) => {
                      const score =
                        clampScore(
                          finding
                            .confidence
                        );


                      return (
                        <div
                          key={`${finding.probable_cause}-${index}`}
                        >
                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >
                            <p
                              className="
                                min-w-0
                                flex-1
                                truncate
                                text-[6.5px]
                                font-medium
                                text-zinc-500

                                print:text-[7.5pt]
                                print:text-slate-700
                              "
                            >
                              #{index +
                                1}{" "}
                              {
                                finding
                                  .probable_cause
                              }
                            </p>

                            <span
                              className="
                                text-[6.5px]
                                font-semibold
                                text-blue-200

                                print:text-[7.5pt]
                                print:text-slate-900
                              "
                            >
                              {
                                score
                              }
                              /100
                            </span>
                          </div>


                          <div
                            className="
                              mt-1
                              h-[6px]
                              overflow-hidden
                              rounded-full
                              bg-white/[0.045]

                              print:h-[2mm]
                              print:border
                              print:border-slate-300
                              print:bg-white
                            "
                          >
                            <div
                              className="
                                h-full
                                rounded-full
                                bg-gradient-to-r
                                from-blue-500
                                to-cyan-300

                                print:bg-slate-700
                              "
                              style={{
                                width:
                                  `${score}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>


                <p
                  className="
                    mt-2
                    text-[5.5px]
                    leading-3
                    text-zinc-700

                    print:text-[6.8pt]
                    print:text-slate-500
                  "
                >
                  {
                    text.scoreNotice
                  }
                </p>
              </section>
            )}


            {/* GRAPH - EVIDENCE */}

            {evidenceChart.length >
              0 && (
              <section
                className={`${styles.block}
                  report-block
                  rounded-[15px]
                  border
                  border-white/[0.055]
                  bg-white/[0.012]
                  p-3

                  print:rounded
                  print:border-slate-300
                  print:bg-white
                  print:p-[3.5mm]
                `}
              >
                <h3
                  className="
                    text-[8px]
                    font-semibold
                    text-zinc-300

                    print:text-[10pt]
                    print:text-slate-950
                  "
                >
                  {
                    text.evidenceChart
                  }
                </h3>

                <p
                  className="
                    mt-0.5
                    text-[5.5px]
                    text-zinc-700

                    print:text-[7pt]
                    print:text-slate-500
                  "
                >
                  {
                    text.evidenceHint
                  }
                </p>


                <div
                  className="
                    mt-2.5
                    space-y-1.5

                    print:mt-[2mm]
                    print:space-y-[1mm]
                  "
                >
                  {evidenceChart.map(
                    (
                      item
                    ) => {
                      const width =
                        Math.max(
                          4,

                          (
                            Math.abs(
                              item.points
                            ) /
                            maxEvidence
                          ) *
                            100
                        );


                      return (
                        <div
                          key={
                            item.source
                          }
                        >
                          <div
                            className="
                              flex
                              justify-between
                              gap-3
                            "
                          >
                            <span
                              className="
                                text-[6px]
                                text-zinc-600

                                print:text-[7pt]
                                print:text-slate-600
                              "
                            >
                              {
                                item.label
                              }
                            </span>

                            <span
                              className={`
                                text-[6px]
                                font-semibold

                                ${
                                  item.points >=
                                  0
                                    ? "text-blue-200"
                                    : "text-red-300"
                                }

                                print:text-slate-900
                              `}
                            >
                              {item.points >
                              0
                                ? "+"
                                : ""}
                              {
                                item.points
                              }
                            </span>
                          </div>


                          <div
                            className="
                              mt-1
                              h-[5px]
                              overflow-hidden
                              rounded-full
                              bg-white/[0.04]

                              print:h-[1.8mm]
                              print:border
                              print:border-slate-200
                              print:bg-white
                            "
                          >
                            <div
                              className={`
                                h-full
                                rounded-full

                                ${
                                  item.points >=
                                  0
                                    ? "bg-blue-400"
                                    : "bg-red-400"
                                }

                                print:bg-slate-700
                              `}
                              style={{
                                width:
                                  `${width}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </section>
            )}


            {/* INPUT DATA */}

            <div
              className="
                grid
                gap-2.5

                print:grid-cols-2
                print:gap-[4mm]
              "
            >
              {/* SYMPTOMS + DTC */}

              <section
                className={`${styles.block}
                  report-block
                  rounded-[15px]
                  border
                  border-white/[0.055]
                  bg-white/[0.012]
                  p-3

                  print:rounded
                  print:border-slate-300
                  print:bg-white
                  print:p-[3.5mm]
                `}
              >
                <h3
                  className="
                    text-[8px]
                    font-semibold
                    text-zinc-300

                    print:text-[10pt]
                    print:text-slate-950
                  "
                >
                  {
                    text.symptoms
                  }
                </h3>


                <div
                  className="
                    mt-2
                    space-y-1

                    print:mt-[2mm]
                  "
                >
                  {diagnosticCase
                    .symptoms
                    .map(
                      (
                        symptom,
                        index
                      ) => (
                        <div
                          key={
                            symptom.id
                          }
                          className="
                            flex
                            gap-2
                            rounded-[8px]
                            border
                            border-white/[0.04]
                            bg-black/10
                            px-2
                            py-1.5

                            print:border-slate-200
                            print:bg-white
                            print:px-[2mm]
                            print:py-[1.5mm]
                          "
                        >
                          <span
                            className="
                              text-[6px]
                              font-semibold
                              text-blue-200

                              print:text-[7pt]
                              print:text-slate-500
                            "
                          >
                            {index +
                              1}.
                          </span>

                          <p
                            className="
                              text-[6.5px]
                              leading-3.5
                              text-zinc-500

                              print:text-[7.5pt]
                              print:text-slate-800
                            "
                          >
                            {
                              symptom.description
                            }
                          </p>
                        </div>
                      )
                    )}
                </div>


                <div
                  className="
                    mt-2
                    border-t
                    border-white/[0.04]
                    pt-2

                    print:border-slate-300
                    print:pt-[2mm]
                  "
                >
                  <p
                    className="
                      text-[5.5px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-zinc-700

                      print:text-[7pt]
                      print:text-slate-500
                    "
                  >
                    {
                      text.dtc
                    }
                  </p>


                  {diagnosticCase
                    .dtc_codes
                    .length >
                  0 ? (
                    <div
                      className="
                        mt-1.5
                        flex
                        flex-wrap
                        gap-1
                      "
                    >
                      {diagnosticCase
                        .dtc_codes
                        .map(
                          (
                            code
                          ) => (
                            <span
                              key={
                                code
                              }
                              className="
                                rounded-[6px]
                                border
                                border-cyan-300/10
                                bg-cyan-300/[0.035]
                                px-1.5
                                py-1
                                font-mono
                                text-[6px]
                                font-semibold
                                text-cyan-100

                                print:border-slate-300
                                print:bg-white
                                print:text-[7pt]
                                print:text-slate-900
                              "
                            >
                              {
                                code
                              }
                            </span>
                          )
                        )}
                    </div>
                  ) : (
                    <p
                      className="
                        mt-1
                        text-[6px]
                        text-zinc-700

                        print:text-[7pt]
                        print:text-slate-600
                      "
                    >
                      {
                        text.noDtc
                      }
                    </p>
                  )}
                </div>
              </section>


              {/* ADAPTIVE ANSWERS */}

              <section
                className={`${styles.block}
                  report-block
                  rounded-[15px]
                  border
                  border-white/[0.055]
                  bg-white/[0.012]
                  p-3

                  print:rounded
                  print:border-slate-300
                  print:bg-white
                  print:p-[3.5mm]
                `}
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <h3
                    className="
                      text-[8px]
                      font-semibold
                      text-zinc-300

                      print:text-[10pt]
                      print:text-slate-950
                    "
                  >
                    {
                      text.answers
                    }
                  </h3>

                  <span
                    className="
                      text-[6px]
                      font-semibold
                      text-blue-200

                      print:text-[7pt]
                      print:text-slate-700
                    "
                  >
                    {
                      diagnosticCase
                        .adaptive_answers
                        .length
                    }
                  </span>
                </div>


                <div
                  className="
                    mt-2
                    space-y-1
                  "
                >
                  {diagnosticCase
                    .adaptive_answers
                    .map(
                      (
                        answer,
                        index
                      ) => (
                        <div
                          key={`${answer.question_id}-${index}`}
                          className="
                            rounded-[8px]
                            border
                            border-white/[0.04]
                            px-2
                            py-1.5

                            print:border-slate-200
                            print:px-[2mm]
                            print:py-[1.5mm]
                          "
                        >
                          <p
                            className="
                              text-[5.5px]
                              text-zinc-700

                              print:text-[6.8pt]
                              print:text-slate-500
                            "
                          >
                            {
                              answer.question
                            }
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[6.5px]
                              font-semibold
                              text-zinc-400

                              print:text-[7.3pt]
                              print:text-slate-800
                            "
                          >
                            {Array.isArray(
                              answer.answer
                            )
                              ? answer.answer.join(
                                  ", "
                                )
                              : answer.answer}
                          </p>
                        </div>
                      )
                    )}
                </div>
              </section>
            </div>


            {/* NEXT STEPS */}

            {nextSteps.length >
              0 && (
              <section
                className={`${styles.block}
                  report-block
                  rounded-[15px]
                  border
                  border-violet-400/[0.08]
                  bg-white/[0.012]
                  p-3

                  print:rounded
                  print:border-slate-300
                  print:bg-white
                  print:p-[3.5mm]
                `}
              >
                <h3
                  className="
                    text-[8px]
                    font-semibold
                    text-zinc-300

                    print:text-[10pt]
                    print:text-slate-950
                  "
                >
                  {
                    text.nextSteps
                  }
                </h3>


                <div
                  className="
                    mt-2
                    space-y-1.5

                    print:mt-[2mm]
                  "
                >
                  {nextSteps
                    .slice(
                      0,
                      5
                    )
                    .map(
                      (
                        step
                      ) => (
                        <div
                          key={
                            step.id
                          }
                          className="
                            flex
                            gap-2
                            rounded-[9px]
                            border
                            border-white/[0.04]
                            bg-black/10
                            px-2.5
                            py-2

                            print:border-slate-200
                            print:bg-white
                            print:px-[2.5mm]
                            print:py-[1.5mm]
                          "
                        >
                          <span
                            className="
                              flex
                              h-6
                              w-6
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-violet-300/10
                              text-[6px]
                              font-semibold
                              text-violet-100

                              print:border-slate-400
                              print:text-[7pt]
                              print:text-slate-800
                            "
                          >
                            {
                              step.priority
                            }
                          </span>


                          <div>
                            <p
                              className="
                                text-[7px]
                                font-semibold
                                text-zinc-300

                                print:text-[8pt]
                                print:text-slate-900
                              "
                            >
                              {
                                step.title
                              }
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[6.5px]
                                leading-3
                                text-zinc-600

                                print:text-[7.5pt]
                                print:text-slate-700
                              "
                            >
                              {
                                step.action
                              }
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[5.5px]
                                leading-3
                                text-zinc-700

                                print:text-[6.8pt]
                                print:text-slate-500
                              "
                            >
                              {
                                step.reason
                              }
                            </p>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </section>
            )}


            {/* CHECKS */}

            {primaryFinding &&
              primaryFinding
                .recommended_checks
                .length >
                0 && (
              <section
                className={`${styles.block}
                  report-block
                  rounded-[15px]
                  border
                  border-white/[0.055]
                  bg-white/[0.012]
                  p-3

                  print:rounded
                  print:border-slate-300
                  print:bg-white
                  print:p-[3.5mm]
                `}
              >
                <h3
                  className="
                    text-[8px]
                    font-semibold
                    text-zinc-300

                    print:text-[10pt]
                    print:text-slate-950
                  "
                >
                  {
                    text.checks
                  }
                </h3>


                <div
                  className="
                    mt-2
                    grid
                    gap-1.5

                    print:grid-cols-2
                    print:gap-[1.5mm]
                  "
                >
                  {primaryFinding
                    .recommended_checks
                    .map(
                      (
                        check,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className="
                            flex
                            gap-2
                            rounded-[9px]
                            border
                            border-white/[0.04]
                            px-2
                            py-2

                            print:border-slate-200
                            print:px-[2.5mm]
                            print:py-[1.5mm]
                          "
                        >
                          <span
                            className="
                              text-[6px]
                              font-semibold
                              text-blue-200

                              print:text-[7pt]
                              print:text-slate-500
                            "
                          >
                            {index +
                              1}.
                          </span>

                          <p
                            className="
                              text-[6.5px]
                              leading-3.5
                              text-zinc-500

                              print:text-[7.5pt]
                              print:text-slate-800
                            "
                          >
                            {
                              check
                            }
                          </p>
                        </div>
                      )
                    )}
                </div>
              </section>
            )}


            {/* SECONDARY */}

            {secondaryFindings.length >
              0 && (
              <section
                className={`${styles.block}
                  report-block
                  rounded-[15px]
                  border
                  border-white/[0.055]
                  bg-white/[0.012]
                  p-3

                  print:rounded
                  print:border-slate-300
                  print:bg-white
                  print:p-[3.5mm]
                `}
              >
                <h3
                  className="
                    text-[8px]
                    font-semibold
                    text-zinc-300

                    print:text-[10pt]
                    print:text-slate-950
                  "
                >
                  {
                    text.additional
                  }
                </h3>


                <div
                  className="
                    mt-2
                    space-y-1

                    print:mt-[2mm]
                  "
                >
                  {secondaryFindings.map(
                    (
                      finding,
                      index
                    ) => (
                      <div
                        key={`${finding.probable_cause}-${index}`}
                        className="
                          grid
                          grid-cols-[22px_minmax(0,1fr)_38px]
                          items-center
                          gap-2
                          rounded-[8px]
                          border
                          border-white/[0.04]
                          px-2
                          py-2

                          print:grid-cols-[8mm_minmax(0,1fr)_18mm_24mm]
                          print:border-slate-200
                        "
                      >
                        <span
                          className="
                            text-[6px]
                            font-semibold
                            text-zinc-700

                            print:text-[7pt]
                            print:text-slate-500
                          "
                        >
                          #{index +
                            2}
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
                              text-zinc-400

                              print:text-[8pt]
                              print:text-slate-900
                            "
                          >
                            {
                              finding
                                .probable_cause
                            }
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[5.5px]
                              text-zinc-700

                              print:text-[7pt]
                              print:text-slate-600
                            "
                          >
                            {
                              formatStrength(
                                finding
                                  .evidence_strength,
                                language
                              )
                            }
                          </p>
                        </div>

                        <span
                          className="
                            text-right
                            text-[6.5px]
                            font-semibold
                            text-blue-200

                            print:text-[7.5pt]
                            print:text-slate-900
                          "
                        >
                          {
                            clampScore(
                              finding
                                .confidence
                            )
                          }
                        </span>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}


            {/* CONTEXT / WARNINGS */}

            {(vehicleContext ||
              warnings.length >
                0) && (
              <section
                className={`${styles.block}
                  report-block
                  rounded-[15px]
                  border
                  border-white/[0.055]
                  bg-white/[0.012]
                  p-3

                  print:rounded
                  print:border-slate-300
                  print:bg-white
                  print:p-[3.5mm]
                `}
              >
                {vehicleContext && (
                  <div>
                    <h3
                      className="
                        text-[8px]
                        font-semibold
                        text-zinc-300

                        print:text-[10pt]
                        print:text-slate-950
                      "
                    >
                      {
                        text.context
                      }
                    </h3>

                    <p
                      className="
                        mt-1.5
                        text-[6.5px]
                        leading-3.5
                        text-zinc-500

                        print:text-[7.5pt]
                        print:text-slate-700
                      "
                    >
                      {
                        vehicleContext
                      }
                    </p>
                  </div>
                )}


                <div
                  className={
                    vehicleContext
                      ? "mt-2 border-t border-white/[0.04] pt-2 print:border-slate-300"
                      : ""
                  }
                >
                  <h3
                    className="
                      text-[8px]
                      font-semibold
                      text-zinc-300

                      print:text-[10pt]
                      print:text-slate-950
                    "
                  >
                    {
                      text.dataQuality
                    }
                  </h3>


                  {warnings.length >
                  0 ? (
                    <div
                      className="
                        mt-1.5
                        space-y-1
                      "
                    >
                      {warnings.map(
                        (
                          warning,
                          index
                        ) => (
                          <p
                            key={`${warning.code}-${index}`}
                            className="
                              text-[6px]
                              leading-3
                              text-amber-200

                              print:text-[7pt]
                              print:text-amber-900
                            "
                          >
                            •{" "}
                            {
                              warning.message
                            }
                          </p>
                        )
                      )}
                    </div>
                  ) : (
                    <p
                      className="
                        mt-1
                        text-[6px]
                        text-zinc-700

                        print:text-[7pt]
                        print:text-slate-600
                      "
                    >
                      {
                        text.noWarnings
                      }
                    </p>
                  )}
                </div>
              </section>
            )}


            {/* TECHNICAL */}

            {(primaryReferences.length >
              0 ||
              primaryFinding
                ?.rule_id) && (
              <section
                className={`${styles.block}
                  report-block
                  rounded-[15px]
                  border
                  border-white/[0.055]
                  bg-white/[0.012]
                  p-3

                  print:rounded
                  print:border-slate-300
                  print:bg-white
                  print:p-[3.5mm]
                `}
              >
                <h3
                  className="
                    text-[8px]
                    font-semibold
                    text-zinc-300

                    print:text-[10pt]
                    print:text-slate-950
                  "
                >
                  {
                    text.technicalBasis
                  }
                </h3>


                {primaryFinding
                  ?.rule_id && (
                  <div
                    className="
                      mt-2
                      rounded-[8px]
                      border
                      border-blue-400/10
                      bg-blue-500/[0.025]
                      px-2.5
                      py-2

                      print:border-slate-300
                      print:bg-white
                    "
                  >
                    <p
                      className="
                        text-[5px]
                        uppercase
                        tracking-[0.08em]
                        text-zinc-700

                        print:text-[6.5pt]
                        print:text-slate-500
                      "
                    >
                      Diagnostic rule
                    </p>

                    <p
                      className="
                        mt-0.5
                        font-mono
                        text-[6.5px]
                        text-blue-200

                        print:text-[7pt]
                        print:text-slate-900
                      "
                    >
                      {
                        primaryFinding
                          .rule_id
                      }
                    </p>
                  </div>
                )}


                <div
                  className="
                    mt-1.5
                    space-y-1
                  "
                >
                  {primaryReferences
                    .slice(
                      0,
                      5
                    )
                    .map(
                      (
                        reference,
                        index
                      ) => (
                        <div
                          key={`${reference.identifier}-${index}`}
                          className="
                            rounded-[8px]
                            border
                            border-white/[0.04]
                            px-2.5
                            py-2

                            print:border-slate-200
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
                                text-[6.5px]
                                font-semibold
                                text-zinc-400

                                print:text-[7.5pt]
                                print:text-slate-900
                              "
                            >
                              {
                                reference.title
                              }
                            </p>

                            {reference
                              .matched_in_case && (
                              <span
                                className="
                                  shrink-0
                                  text-[5px]
                                  text-emerald-300

                                  print:text-[6pt]
                                  print:text-emerald-800
                                "
                              >
                                ✓
                              </span>
                            )}
                          </div>

                          <p
                            className="
                              mt-0.5
                              font-mono
                              text-[5.5px]
                              text-cyan-200/60

                              print:text-[6.5pt]
                              print:text-slate-500
                            "
                          >
                            {
                              reference.identifier
                            }
                          </p>


                          {reference.note && (
                            <p
                              className="
                                mt-1
                                text-[6px]
                                leading-3
                                text-zinc-700

                                print:text-[7pt]
                                print:text-slate-600
                              "
                            >
                              {
                                reference.note
                              }
                            </p>
                          )}
                        </div>
                      )
                    )}
                </div>
              </section>
            )}


            {/* DISCLAIMER */}

            <section
              className={`${styles.block}
                report-block
                rounded-[15px]
                border
                border-white/[0.055]
                bg-white/[0.01]
                p-3

                print:rounded
                print:border-slate-300
                print:bg-white
                print:p-[3.5mm]
              `}
            >
              <h3
                className="
                  text-[7px]
                  font-semibold
                  text-zinc-400

                  print:text-[9pt]
                  print:text-slate-950
                "
              >
                {
                  text.diagnosticNotice
                }
              </h3>

              <p
                className="
                  mt-1.5
                  text-[6px]
                  leading-3
                  text-zinc-700

                  print:text-[7pt]
                  print:leading-[1.3]
                  print:text-slate-600
                "
              >
                {
                  text.disclaimer
                }
              </p>


              <div
                className="
                  mt-2
                  border-t
                  border-white/[0.04]
                  pt-2

                  print:border-slate-300
                "
              >
                <p
                  className="
                    text-[5.5px]
                    uppercase
                    tracking-[0.08em]
                    text-blue-200/50

                    print:text-[6.5pt]
                    print:text-slate-500
                  "
                >
                  {
                    text.contact
                  }
                </p>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="
                    mt-0.5
                    block
                    text-[6.5px]
                    font-semibold
                    text-blue-200

                    print:text-[7pt]
                    print:text-slate-900
                  "
                >
                  {
                    CONTACT_EMAIL
                  }
                </a>
              </div>
            </section>


            {/* PRINT FOOTER */}

            <div
              className="
                hidden

                print:flex
                print:items-center
                print:justify-between
                print:border-t
                print:border-slate-300
                print:pt-[2mm]
                print:text-[6.5pt]
                print:text-slate-500
              "
            >
              <span>
                {
                  text.pageNote
                }
              </span>

              <span
                className="
                  font-mono
                "
              >
                {
                  caseId
                }
              </span>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}