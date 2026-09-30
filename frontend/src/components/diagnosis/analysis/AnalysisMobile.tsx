"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Modal from "@/components/ui/Modal";

import {
  API_BASE_URL,
} from "@/lib/config";


type Language =
  | "en"
  | "ro";


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


type FindingDetailMode =
  | "score"
  | "checks"
  | "technical";


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


function getSeverityLabel(
  severity:
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
      severity
    ]?.[
      language
    ] ??
    severity
  );
}


function getSeverityClasses(
  severity:
    string
) {
  if (
    severity ===
    "high"
  ) {
    return "border-red-400/20 bg-red-400/[0.07] text-red-200";
  }


  if (
    severity ===
    "medium"
  ) {
    return "border-amber-400/20 bg-amber-400/[0.07] text-amber-200";
  }


  return "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200";
}


function getUrgencyLabel(
  urgency:
    DiagnosticFinding[
      "urgency"
    ],
  language:
    Language
) {
  const labels = {
    monitor: {
      ro:
        "Monitorizează",

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
    urgency
  ][
    language
  ];
}


function getUrgencyClasses(
  urgency:
    DiagnosticFinding[
      "urgency"
    ]
) {
  if (
    urgency ===
    "stop_driving"
  ) {
    return "border-red-400/20 bg-red-400/[0.075] text-red-100";
  }


  if (
    urgency ===
    "service_soon"
  ) {
    return "border-amber-400/20 bg-amber-400/[0.07] text-amber-100";
  }


  return "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-100";
}


function getEvidenceStrengthLabel(
  strength:
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
    strength !==
      "limited" &&
    strength !==
      "moderate" &&
    strength !==
      "strong"
  ) {
    return labels
      .limited[
        language
      ];
  }


  return labels[
    strength
  ][
    language
  ];
}


function getEvidenceStrengthClasses(
  strength:
    DiagnosticFinding[
      "evidence_strength"
    ]
) {
  if (
    strength ===
    "strong"
  ) {
    return "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200";
  }


  if (
    strength ===
    "moderate"
  ) {
    return "border-amber-400/20 bg-amber-400/[0.07] text-amber-200";
  }


  return "border-white/[0.08] bg-white/[0.025] text-zinc-300";
}


function needsMoreDiagnosticData(
  findings:
    DiagnosticFinding[]
) {
  if (
    findings.length ===
    0
  ) {
    return false;
  }


  return findings.every(
    (
      finding
    ) =>
      !finding
        .evidence_strength ||
      finding
        .evidence_strength ===
        "limited"
  );
}


function getEvidenceSourceCountLabel(
  count:
    number | undefined,
  language:
    Language
) {
  const safeCount =
    typeof count ===
    "number"
      ? count
      : 0;


  if (
    language ===
    "ro"
  ) {
    return safeCount ===
      1
      ? "1 sursă independentă"
      : `${safeCount} surse independente`;
  }


  return safeCount ===
    1
    ? "1 independent source"
    : `${safeCount} independent sources`;
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
        "Simptom",

      en:
        "Symptom",
    },

    dtc: {
      ro:
        "Cod DTC",

      en:
        "DTC code",
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


export default function AnalysisMobile() {
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
    isLoading,
    setIsLoading,
  ] = useState(
    true
  );


  const [
    hasError,
    setHasError,
  ] = useState(
    false
  );


  const [
    analysis,
    setAnalysis,
  ] = useState<
    DiagnosticAnalysis | null
  >(null);


  const [
    analysisLoading,
    setAnalysisLoading,
  ] = useState(
    true
  );


  const [
    analysisError,
    setAnalysisError,
  ] = useState<
    string | null
  >(null);


  const [
    activeFindingIndex,
    setActiveFindingIndex,
  ] = useState(
    0
  );


  const [
    selectedFinding,
    setSelectedFinding,
  ] = useState<
    DiagnosticFinding | null
  >(null);


  const [
    findingDetailMode,
    setFindingDetailMode,
  ] = useState<
    FindingDetailMode
  >(
    "score"
  );


  const [
    showWarnings,
    setShowWarnings,
  ] = useState(
    false
  );


  const [
    showSteps,
    setShowSteps,
  ] = useState(
    false
  );


  const [
    showCaseData,
    setShowCaseData,
  ] = useState(
    false
  );


  async function analyzeCase(
    currentCaseId:
      string,
    currentLanguage:
      Language
  ) {
    setAnalysisLoading(
      true
    );

    setAnalysisError(
      null
    );


    try {
      const response =
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
        !response.ok
      ) {
        throw new Error(
          "ANALYSIS_FAILED"
        );
      }


      const data:
        DiagnosticAnalysis =
        await response.json();


      setAnalysis(
        data
      );


      setActiveFindingIndex(
        0
      );

    } catch (
      error
    ) {
      console.error(
        "Failed to analyze diagnostic case:",
        error
      );


      setAnalysisError(
        currentLanguage ===
        "ro"
          ? "Analiza nu a putut fi generată. Încearcă din nou."
          : "The analysis could not be generated. Please try again."
      );

    } finally {
      setAnalysisLoading(
        false
      );
    }
  }


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


    const savedCaseId =
      localStorage.getItem(
        "diagnosticCaseId"
      );


    if (
      !savedCaseId
    ) {
      setHasError(
        true
      );

      setIsLoading(
        false
      );

      setAnalysisLoading(
        false
      );

      return;
    }


    const currentCaseId:
      string =
      savedCaseId;


    setCaseId(
      currentCaseId
    );


    async function loadDiagnosticCase() {
      try {
        const response =
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
          !response.ok
        ) {
          throw new Error(
            "CASE_LOAD_FAILED"
          );
        }


        const data:
          DiagnosticCase =
          await response.json();


        setDiagnosticCase(
          data
        );


        setLanguage(
          data.language
        );


        await analyzeCase(
          currentCaseId,
          data.language
        );

      } catch (
        error
      ) {
        console.error(
          "Failed to load diagnostic case:",
          error
        );


        setHasError(
          true
        );


        setAnalysisLoading(
          false
        );

      } finally {
        setIsLoading(
          false
        );
      }
    }


    void loadDiagnosticCase();

  }, []);


  const content = {
    en: {
      engine:
        "DIAGNOSTIC ENGINE",

      complete:
        "ANALYSIS COMPLETE",

      title:
        "Likely causes identified",

      description:
        "Results ranked by relevance to the available evidence.",

      loadingTitle:
        "Building the diagnostic picture",

      loadingDescription:
        "Correlating vehicle data, symptoms, DTC evidence and adaptive answers.",

      errorTitle:
        "The diagnostic case could not be loaded",

      errorDescription:
        "The case is unavailable or your session no longer has access to it.",

      back:
        "Return to review",

      primary:
        "Primary hypothesis",

      selectedHypothesis:
        "Selected hypothesis",

      relevance:
        "Relevance score",

      comparison:
        "Hypothesis comparison",

      comparisonDescription:
        "Compare the relevance score of each identified cause.",

      evidenceProfile:
        "Evidence contribution",

      evidenceProfileDescription:
        "Contribution of the case signals to the selected hypothesis.",

      severity:
        "Severity",

      urgency:
        "Urgency",

      evidence:
        "Evidence",

      whyScore:
        "Why this score?",

      checks:
        "Checks",

      technical:
        "Technical basis",

      scoreExplanation:
        "Score explanation",

      scoreDescription:
        "See which case signals contributed to this result.",

      checksTitle:
        "Recommended checks",

      checksDescription:
        "Use these checks to validate or eliminate this possible cause.",

      technicalTitle:
        "Technical basis",

      technicalDescription:
        "Diagnostic rule and technical references used by AutoDiagnose AI.",

      rawScore:
        "Calculated score",

      finalScore:
        "Displayed score",

      cappedScore:
        "The displayed relevance score is capped at 100/100.",

      scoreDisclaimer:
        "This is a relevance score based on the available evidence. It is not a statistical probability of failure.",

      noTechnical:
        "No additional technical references are attached to this finding.",

      rule:
        "Diagnostic rule",

      usedInCase:
        "Used in this case",

      next:
        "Recommended next steps",

      nextDescription:
        "A short diagnostic path based on the strongest current signals.",

      seeAll:
        "See all",

      warnings:
        "Data quality",

      warningsTitle:
        "Check the entered data",

      warningsDescription:
        "These items may influence the interpretation of the result.",

      limited:
        "More data would strengthen the result",

      limitedDescription:
        "Current findings are supported by limited independent evidence.",

      noFindings:
        "No sufficiently relevant cause was identified.",

      retry:
        "Retry analysis",

      report:
        "Full report",

      history:
        "History",

      guide:
        "Guide",

      newDiagnosis:
        "New diagnosis",

      caseData:
        "Case data",

      symptoms:
        "Symptoms",

      dtc:
        "DTC codes",

      answers:
        "Adaptive answers",

      none:
        "None",

      diagnosticNotice:
        "Decision support, not a confirmed repair diagnosis.",

      disclaimer:
        "Confirm faults with physical inspection, measurements and manufacturer service information before repair decisions.",

      sourceCount:
        "Evidence sources",

      signals:
        "Signals",
    },


    ro: {
      engine:
        "MOTOR DE DIAGNOSTIC",

      complete:
        "ANALIZĂ FINALIZATĂ",

      title:
        "Am identificat cauzele probabile",

      description:
        "Rezultate ordonate după relevanța pentru dovezile disponibile.",

      loadingTitle:
        "Construim imaginea de diagnostic",

      loadingDescription:
        "Corelăm vehiculul, simptomele, DTC-urile și răspunsurile adaptive.",

      errorTitle:
        "Cazul de diagnostic nu a putut fi încărcat",

      errorDescription:
        "Cazul nu este disponibil sau sesiunea nu mai are acces la el.",

      back:
        "Înapoi la verificare",

      primary:
        "Ipoteza principală",

      selectedHypothesis:
        "Ipoteza selectată",

      relevance:
        "Scor de relevanță",

      comparison:
        "Comparația ipotezelor",

      comparisonDescription:
        "Compară scorul de relevanță al cauzelor identificate.",

      evidenceProfile:
        "Contribuția dovezilor",

      evidenceProfileDescription:
        "Influența semnalelor din caz asupra ipotezei selectate.",

      severity:
        "Severitate",

      urgency:
        "Urgență",

      evidence:
        "Dovezi",

      whyScore:
        "De ce acest scor?",

      checks:
        "Verificări",

      technical:
        "Bază tehnică",

      scoreExplanation:
        "Explicația scorului",

      scoreDescription:
        "Vezi ce semnale din caz au contribuit la rezultat.",

      checksTitle:
        "Verificări recomandate",

      checksDescription:
        "Folosește aceste verificări pentru a confirma sau elimina această posibilă cauză.",

      technicalTitle:
        "Bază tehnică",

      technicalDescription:
        "Regula de diagnostic și referințele tehnice folosite de AutoDiagnose AI.",

      rawScore:
        "Scor calculat",

      finalScore:
        "Scor afișat",

      cappedScore:
        "Scorul afișat este limitat la maximum 100/100.",

      scoreDisclaimer:
        "Acesta este un scor de relevanță bazat pe dovezile disponibile, nu o probabilitate statistică de defectare.",

      noTechnical:
        "Nu există referințe tehnice suplimentare pentru acest rezultat.",

      rule:
        "Regulă de diagnostic",

      usedInCase:
        "Folosit în acest caz",

      next:
        "Pași recomandați",

      nextDescription:
        "Un traseu scurt de verificare bazat pe cele mai puternice semnale.",

      seeAll:
        "Vezi tot",

      warnings:
        "Calitatea datelor",

      warningsTitle:
        "Verifică datele introduse",

      warningsDescription:
        "Aceste informații pot influența interpretarea rezultatului.",

      limited:
        "Mai multe date ar întări rezultatul",

      limitedDescription:
        "Rezultatele actuale au dovezi independente limitate.",

      noFindings:
        "Nu a fost identificată o cauză suficient de relevantă.",

      retry:
        "Reîncearcă analiza",

      report:
        "Raport complet",

      history:
        "Istoric",

      guide:
        "Ghid",

      newDiagnosis:
        "Diagnostic nou",

      caseData:
        "Date caz",

      symptoms:
        "Simptome",

      dtc:
        "Coduri DTC",

      answers:
        "Răspunsuri adaptive",

      none:
        "Niciunul",

      diagnosticNotice:
        "Suport pentru decizie, nu diagnostic de reparație confirmat.",

      disclaimer:
        "Confirmă defecțiunile prin inspecție tehnică, măsurători și documentația producătorului înainte de reparații.",

      sourceCount:
        "Surse dovezi",

      signals:
        "Semnale",
    },
  };


  const text =
    content[
      language
    ];


  const findings =
    analysis?.findings ??
    [];


  const activeFinding =
    findings[
      activeFindingIndex
    ] ??
    findings[0] ??
    null;


  const nextSteps =
    analysis
      ?.next_best_steps ??
    [];


  const warnings =
    analysis
      ?.data_quality_warnings ??
    [];


  const limitedEvidence =
    needsMoreDiagnosticData(
      findings
    );


  const vehicleName =
    diagnosticCase
      ? `${diagnosticCase.vehicle.make} ${diagnosticCase.vehicle.model}`.trim()
      : "";


  const caseSignalCount =
    diagnosticCase
      ? diagnosticCase
          .symptoms
          .length +
        diagnosticCase
          .dtc_codes
          .length +
        diagnosticCase
          .adaptive_answers
          .length
      : 0;


  const strongestEvidence =
    useMemo(
      () => {
        if (
          findings.length ===
          0
        ) {
          return 0;
        }


        return Math.max(
          ...findings.map(
            (
              finding
            ) =>
              finding
                .evidence_sources_count ??
              0
          )
        );
      },

      [
        findings,
      ]
    );


  const evidenceChart =
    useMemo(
      () => {
        if (
          !activeFinding
        ) {
          return [];
        }


        const totals =
          new Map<
            string,
            number
          >();


        activeFinding
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


        const items =
          Array.from(
            totals.entries()
          ).map(
            ([
              source,
              points,
            ]) => ({
              source,

              label:
                getEvidenceSourceLabel(
                  source,
                  language
                ),

              points,
            })
          );


        return items.sort(
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
        activeFinding,
        language,
      ]
    );


  const maxEvidenceMagnitude =
    useMemo(
      () => {
        if (
          evidenceChart.length ===
          0
        ) {
          return 1;
        }


        return Math.max(
          1,
          ...evidenceChart.map(
            (
              item
            ) =>
              Math.abs(
                item.points
              )
          )
        );
      },

      [
        evidenceChart,
      ]
    );


  function selectFinding(
    index:
      number
  ) {
    setActiveFindingIndex(
      index
    );


    window.setTimeout(
      () => {
        window.scrollTo({
          top:
            0,

          behavior:
            "smooth",
        });
      },
      50
    );
  }


  function openFindingDetail(
    finding:
      DiagnosticFinding,
    mode:
      FindingDetailMode
  ) {
    setSelectedFinding(
      finding
    );


    setFindingDetailMode(
      mode
    );
  }


  function handleNewDiagnosis() {
    Object.keys(
      localStorage
    ).forEach(
      (
        key
      ) => {
        if (
          key.startsWith(
            "diagnostic"
          )
        ) {
          localStorage.removeItem(
            key
          );
        }
      }
    );


    router.push(
      "/diagnosis/vehicle"
    );
  }


  if (
    isLoading
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
            text-center
          "
        >
          <div
            className="
              relative
              mx-auto
              flex
              h-28
              w-28
              items-center
              justify-center
            "
          >
            <div
              className="
                absolute
                h-28
                w-28
                animate-pulse
                rounded-full
                border
                border-blue-400/10
              "
            />

            <div
              className="
                absolute
                h-20
                w-20
                rounded-full
                border
                border-blue-400/20
              "
            />

            <div
              className="
                absolute
                h-12
                w-12
                rounded-full
                bg-blue-500/[0.08]
                shadow-[0_0_40px_rgba(59,130,246,0.18)]
              "
            />

            <span
              className="
                relative
                h-2
                w-2
                rounded-full
                bg-blue-400
                shadow-[0_0_18px_rgba(96,165,250,0.9)]
              "
            />
          </div>


          <p
            className="
              mt-4
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-blue-300/65
            "
          >
            {
              text.engine
            }
          </p>


          <h1
            className="
              mt-2
              text-[20px]
              font-semibold
              tracking-[-0.035em]
            "
          >
            {
              text.loadingTitle
            }
          </h1>


          <p
            className="
              mt-2
              text-[8px]
              leading-4
              text-zinc-600
            "
          >
            {
              text.loadingDescription
            }
          </p>
        </div>
      </main>
    );
  }


  if (
    hasError ||
    !diagnosticCase ||
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
            max-w-[360px]
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
              text.errorTitle
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
              text.errorDescription
            }
          </p>


          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/review"
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
              text.back
            }
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
          pb-5
          pt-4
        "
      >
        {/* HERO */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[19px]
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
              -right-16
              -top-16
              h-36
              w-36
              rounded-full
              bg-blue-500/[0.13]
              blur-[50px]
            "
          />


          <div
            className="
              relative
              flex
              items-center
              justify-between
              gap-3
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
                  gap-1.5
                "
              >
                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full

                    ${
                      analysisLoading
                        ? "animate-pulse bg-blue-400"
                        : "bg-emerald-400"
                    }
                  `}
                />

                <p
                  className="
                    text-[6px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-emerald-200/65
                  "
                >
                  {analysisLoading
                    ? text.engine
                    : text.complete}
                </p>
              </div>


              <h1
                className="
                  mt-1.5
                  text-[21px]
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.04em]
                "
              >
                {analysisLoading
                  ? text.loadingTitle
                  : text.title}
              </h1>


              <p
                className="
                  mt-1.5
                  max-w-[320px]
                  text-[8px]
                  leading-3.5
                  text-zinc-600
                "
              >
                {analysisLoading
                  ? text.loadingDescription
                  : text.description}
              </p>
            </div>


            <button
              type="button"
              onClick={() =>
                setShowCaseData(
                  true
                )
              }
              className="
                shrink-0
                rounded-[9px]
                border
                border-white/[0.06]
                bg-white/[0.015]
                px-2.5
                py-2
                text-[6.5px]
                font-semibold
                text-zinc-500
              "
            >
              {
                text.caseData
              }
            </button>
          </div>


          <div
            className="
              relative
              mt-3
              flex
              items-center
              gap-2
              overflow-hidden
              rounded-[10px]
              border
              border-white/[0.045]
              bg-black/10
              px-2.5
              py-2
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
                  truncate
                  text-[8.5px]
                  font-semibold
                  text-zinc-300
                "
              >
                {
                  vehicleName
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-[6px]
                  text-zinc-700
                "
              >
                {
                  diagnosticCase
                    .vehicle
                    .year ??
                  "—"
                }
                {" · "}
                {
                  caseSignalCount
                }{" "}
                {
                  text.signals.toLowerCase()
                }
              </p>
            </div>


            <div
              className="
                grid
                shrink-0
                grid-cols-3
                gap-1
              "
            >
              <span
                className="
                  rounded-[7px]
                  bg-white/[0.025]
                  px-1.5
                  py-1
                  text-[5.5px]
                  text-zinc-500
                "
              >
                {
                  diagnosticCase
                    .symptoms
                    .length
                }{" "}
                S
              </span>

              <span
                className="
                  rounded-[7px]
                  bg-white/[0.025]
                  px-1.5
                  py-1
                  text-[5.5px]
                  text-zinc-500
                "
              >
                {
                  diagnosticCase
                    .dtc_codes
                    .length
                }{" "}
                DTC
              </span>

              <span
                className="
                  rounded-[7px]
                  bg-white/[0.025]
                  px-1.5
                  py-1
                  text-[5.5px]
                  text-zinc-500
                "
              >
                {
                  diagnosticCase
                    .adaptive_answers
                    .length
                }{" "}
                A
              </span>
            </div>
          </div>
        </section>


        {/* ANALYSIS ERROR */}

        {analysisError && (
          <section
            className="
              mt-2
              rounded-[14px]
              border
              border-red-400/15
              bg-red-400/[0.04]
              p-3
            "
          >
            <p
              className="
                text-[8px]
                leading-4
                text-red-200
              "
            >
              {
                analysisError
              }
            </p>


            <button
              type="button"
              onClick={() =>
                analyzeCase(
                  caseId,
                  language
                )
              }
              className="
                mt-2
                rounded-[9px]
                border
                border-red-300/15
                px-3
                py-2
                text-[7px]
                font-semibold
                text-red-100
              "
            >
              {
                text.retry
              }
            </button>
          </section>
        )}


        {/* ANALYSIS LOADING */}

        {analysisLoading &&
          !analysisError && (
          <section
            className="
              mt-2.5
              rounded-[18px]
              border
              border-white/[0.055]
              bg-[#05080e]
              p-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  relative
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    absolute
                    h-16
                    w-16
                    animate-pulse
                    rounded-full
                    border
                    border-blue-400/15
                  "
                />

                <div
                  className="
                    absolute
                    h-10
                    w-10
                    rounded-full
                    border
                    border-blue-400/20
                    bg-blue-500/[0.05]
                  "
                />

                <span
                  className="
                    relative
                    h-2
                    w-2
                    rounded-full
                    bg-blue-400
                  "
                />
              </div>


              <div>
                <p
                  className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-blue-200/65
                  "
                >
                  {
                    text.engine
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-[11px]
                    font-semibold
                    text-zinc-300
                  "
                >
                  {
                    text.loadingTitle
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-[7px]
                    leading-3.5
                    text-zinc-600
                  "
                >
                  {
                    text.loadingDescription
                  }
                </p>
              </div>
            </div>
          </section>
        )}


        {!analysisLoading &&
          !analysisError &&
          analysis && (
          <>
            {/* WARNINGS */}

            {(limitedEvidence ||
              warnings.length >
                0) && (
              <div
                className="
                  mt-2
                  grid
                  grid-cols-2
                  gap-1.5
                "
              >
                {limitedEvidence && (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/diagnosis/review"
                      )
                    }
                    className="
                      rounded-[12px]
                      border
                      border-sky-400/10
                      bg-sky-400/[0.035]
                      p-2.5
                      text-left
                    "
                  >
                    <p
                      className="
                        text-[7px]
                        font-semibold
                        text-sky-100
                      "
                    >
                      {
                        text.limited
                      }
                    </p>

                    <p
                      className="
                        mt-1
                        line-clamp-2
                        text-[6px]
                        leading-3
                        text-sky-100/55
                      "
                    >
                      {
                        text.limitedDescription
                      }
                    </p>
                  </button>
                )}


                {warnings.length >
                  0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowWarnings(
                        true
                      )
                    }
                    className="
                      rounded-[12px]
                      border
                      border-amber-400/10
                      bg-amber-400/[0.035]
                      p-2.5
                      text-left
                    "
                  >
                    <p
                      className="
                        text-[7px]
                        font-semibold
                        text-amber-100
                      "
                    >
                      {
                        text.warnings
                      }
                    </p>

                    <p
                      className="
                        mt-1
                        text-[6px]
                        text-amber-100/55
                      "
                    >
                      {
                        warnings.length
                      }{" "}
                      {
                        language ===
                        "ro"
                          ? "elemente"
                          : "items"
                      }
                    </p>
                  </button>
                )}
              </div>
            )}


            {/* PRIMARY RESULT */}

            {activeFinding && (
              <section
                className="
                  relative
                  mt-2.5
                  overflow-hidden
                  rounded-[19px]
                  border
                  border-blue-400/[0.11]
                  bg-[#080d18]
                  p-3.5
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-14
                    -top-16
                    h-36
                    w-36
                    rounded-full
                    bg-blue-500/[0.12]
                    blur-[50px]
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
                  {/* SCORE RING */}

                  <div
                    className="
                      shrink-0
                    "
                  >
                    <div
                      className="
                        relative
                        flex
                        h-[82px]
                        w-[82px]
                        items-center
                        justify-center
                        rounded-full
                      "
                      style={{
                        background:
                          `conic-gradient(rgba(96,165,250,0.95) ${clampScore(
                            activeFinding
                              .confidence
                          )}%, rgba(255,255,255,0.055) 0)`,
                      }}
                    >
                      <div
                        className="
                          flex
                          h-[68px]
                          w-[68px]
                          flex-col
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/[0.05]
                          bg-[#080d18]
                        "
                      >
                        <span
                          className="
                            text-[21px]
                            font-semibold
                            leading-none
                            tracking-[-0.05em]
                          "
                        >
                          {
                            clampScore(
                              activeFinding
                                .confidence
                            )
                          }
                        </span>

                        <span
                          className="
                            mt-0.5
                            text-[6px]
                            text-zinc-600
                          "
                        >
                          /100
                        </span>
                      </div>
                    </div>
                  </div>


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
                        tracking-[0.13em]
                        text-blue-300/60
                      "
                    >
                      {activeFindingIndex ===
                      0
                        ? text.primary
                        : `${text.selectedHypothesis} #${
                            activeFindingIndex +
                            1
                          }`}
                    </p>


                    <h2
                      className="
                        mt-1
                        text-[15px]
                        font-semibold
                        leading-[1.15]
                        tracking-[-0.025em]
                        text-white
                      "
                    >
                      {
                        activeFinding
                          .probable_cause
                      }
                    </h2>


                    <p
                      className="
                        mt-1.5
                        line-clamp-3
                        text-[7.5px]
                        leading-3.5
                        text-zinc-500
                      "
                    >
                      {
                        activeFinding
                          .description
                      }
                    </p>
                  </div>
                </div>


                <div
                  className="
                    relative
                    mt-3
                    grid
                    grid-cols-3
                    gap-1
                  "
                >
                  <span
                    className={`
                      rounded-[8px]
                      border
                      px-1.5
                      py-1.5
                      text-center
                      text-[5.5px]
                      font-semibold

                      ${getSeverityClasses(
                        activeFinding
                          .severity
                      )}
                    `}
                  >
                    {
                      getSeverityLabel(
                        activeFinding
                          .severity,
                        language
                      )
                    }
                  </span>


                  <span
                    className={`
                      rounded-[8px]
                      border
                      px-1.5
                      py-1.5
                      text-center
                      text-[5.5px]
                      font-semibold

                      ${getUrgencyClasses(
                        activeFinding
                          .urgency
                      )}
                    `}
                  >
                    {
                      getUrgencyLabel(
                        activeFinding
                          .urgency,
                        language
                      )
                    }
                  </span>


                  <span
                    className={`
                      rounded-[8px]
                      border
                      px-1.5
                      py-1.5
                      text-center
                      text-[5.5px]
                      font-semibold

                      ${getEvidenceStrengthClasses(
                        activeFinding
                          .evidence_strength
                      )}
                    `}
                  >
                    {
                      getEvidenceStrengthLabel(
                        activeFinding
                          .evidence_strength,
                        language
                      )
                    }
                  </span>
                </div>


                {activeFinding
                  .safety_message && (
                  <div
                    className={`
                      relative
                      mt-2
                      rounded-[10px]
                      border
                      px-2.5
                      py-2
                      text-[6.5px]
                      leading-3.5

                      ${getUrgencyClasses(
                        activeFinding
                          .urgency
                      )}
                    `}
                  >
                    {
                      activeFinding
                        .safety_message
                    }
                  </div>
                )}


                <div
                  className="
                    relative
                    mt-2
                    grid
                    grid-cols-3
                    gap-1
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      openFindingDetail(
                        activeFinding,
                        "score"
                      )
                    }
                    className="
                      min-h-[34px]
                      rounded-[9px]
                      border
                      border-blue-400/12
                      bg-blue-500/[0.04]
                      px-2
                      text-[6.5px]
                      font-semibold
                      text-blue-100
                    "
                  >
                    {
                      text.whyScore
                    }
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      openFindingDetail(
                        activeFinding,
                        "checks"
                      )
                    }
                    className="
                      min-h-[34px]
                      rounded-[9px]
                      border
                      border-white/[0.06]
                      px-2
                      text-[6.5px]
                      font-semibold
                      text-zinc-400
                    "
                  >
                    {
                      text.checks
                    }
                  </button>


                  <button
                    type="button"
                    disabled={
                      !activeFinding
                        .rule_id &&
                      (
                        activeFinding
                          .technical_references
                          ?.length ??
                        0
                      ) ===
                        0
                    }
                    onClick={() =>
                      openFindingDetail(
                        activeFinding,
                        "technical"
                      )
                    }
                    className="
                      min-h-[34px]
                      rounded-[9px]
                      border
                      border-white/[0.06]
                      px-2
                      text-[6.5px]
                      font-semibold
                      text-zinc-400
                      disabled:opacity-30
                    "
                  >
                    {
                      text.technical
                    }
                  </button>
                </div>


                <p
                  className="
                    relative
                    mt-2
                    text-center
                    text-[5.5px]
                    text-zinc-700
                  "
                >
                  {
                    getEvidenceSourceCountLabel(
                      activeFinding
                        .evidence_sources_count,
                      language
                    )
                  }
                </p>
              </section>
            )}


            {/* CHART 1 - HYPOTHESES */}

            {findings.length >
              0 && (
              <section
                className="
                  mt-2
                  rounded-[17px]
                  border
                  border-white/[0.055]
                  bg-[#05080e]
                  p-3
                "
              >
                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-3
                  "
                >
                  <div>
                    <p
                      className="
                        text-[7px]
                        font-semibold
                        text-zinc-300
                      "
                    >
                      {
                        text.comparison
                      }
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[5.5px]
                        text-zinc-700
                      "
                    >
                      {
                        text.comparisonDescription
                      }
                    </p>
                  </div>

                  <span
                    className="
                      text-[5.5px]
                      text-zinc-700
                    "
                  >
                    0 — 100
                  </span>
                </div>


                <div
                  className="
                    mt-3
                    space-y-2.5
                  "
                >
                  {findings.map(
                    (
                      finding,
                      index
                    ) => {
                      const score =
                        clampScore(
                          finding.confidence
                        );


                      const active =
                        index ===
                        activeFindingIndex;


                      return (
                        <button
                          key={`${finding.probable_cause}-${index}`}
                          type="button"
                          onClick={() =>
                            selectFinding(
                              index
                            )
                          }
                          className="
                            block
                            w-full
                            text-left
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
                            <p
                              className={`
                                min-w-0
                                flex-1
                                truncate
                                text-[7.5px]
                                font-semibold

                                ${
                                  active
                                    ? "text-blue-100"
                                    : "text-zinc-500"
                                }
                              `}
                            >
                              {index +
                                1}
                              .{" "}
                              {
                                finding
                                  .probable_cause
                              }
                            </p>


                            <span
                              className={`
                                shrink-0
                                text-[7px]
                                font-semibold

                                ${
                                  active
                                    ? "text-blue-200"
                                    : "text-zinc-600"
                                }
                              `}
                            >
                              {
                                score
                              }
                            </span>
                          </div>


                          <div
                            className="
                              mt-1
                              h-[7px]
                              overflow-hidden
                              rounded-full
                              bg-white/[0.04]
                            "
                          >
                            <div
                              className={`
                                h-full
                                rounded-full
                                transition-all
                                duration-500

                                ${
                                  active
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-300"
                                    : "bg-zinc-700/70"
                                }
                              `}
                              style={{
                                width:
                                  `${score}%`,
                              }}
                            />
                          </div>
                        </button>
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
                  "
                >
                  {
                    text.scoreDisclaimer
                  }
                </p>
              </section>
            )}


            {/* CHART 2 - EVIDENCE */}

            {activeFinding &&
              evidenceChart.length >
                0 && (
              <section
                className="
                  mt-2
                  rounded-[17px]
                  border
                  border-white/[0.055]
                  bg-[#05080e]
                  p-3
                "
              >
                <p
                  className="
                    text-[7px]
                    font-semibold
                    text-zinc-300
                  "
                >
                  {
                    text.evidenceProfile
                  }
                </p>

                <p
                  className="
                    mt-0.5
                    text-[5.5px]
                    text-zinc-700
                  "
                >
                  {
                    text.evidenceProfileDescription
                  }
                </p>


                <div
                  className="
                    mt-3
                    space-y-2
                  "
                >
                  {evidenceChart.map(
                    (
                      item
                    ) => {
                      const magnitude =
                        Math.abs(
                          item.points
                        );


                      const width =
                        Math.max(
                          4,
                          (
                            magnitude /
                            maxEvidenceMagnitude
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
                              items-center
                              justify-between
                              gap-3
                            "
                          >
                            <span
                              className="
                                truncate
                                text-[6.5px]
                                text-zinc-500
                              "
                            >
                              {
                                item.label
                              }
                            </span>


                            <span
                              className={`
                                text-[6.5px]
                                font-semibold

                                ${
                                  item.points >=
                                  0
                                    ? "text-blue-200"
                                    : "text-red-300"
                                }
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
                              h-[6px]
                              overflow-hidden
                              rounded-full
                              bg-white/[0.04]
                            "
                          >
                            <div
                              className={`
                                h-full
                                rounded-full

                                ${
                                  item.points >=
                                  0
                                    ? "bg-gradient-to-r from-blue-500/80 to-cyan-300"
                                    : "bg-red-400/70"
                                }
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


            {/* NEXT STEPS */}

            {nextSteps.length >
              0 && (
              <section
                className="
                  mt-2
                  rounded-[17px]
                  border
                  border-violet-400/[0.08]
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
                        text-[7px]
                        font-semibold
                        text-violet-200
                      "
                    >
                      {
                        text.next
                      }
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[5.5px]
                        text-zinc-700
                      "
                    >
                      {
                        text.nextDescription
                      }
                    </p>
                  </div>


                  {nextSteps.length >
                    3 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowSteps(
                          true
                        )
                      }
                      className="
                        shrink-0
                        text-[6px]
                        font-semibold
                        text-violet-200
                      "
                    >
                      {
                        text.seeAll
                      }
                    </button>
                  )}
                </div>


                <div
                  className="
                    mt-2.5
                    space-y-1.5
                  "
                >
                  {nextSteps
                    .slice(
                      0,
                      3
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
                            rounded-[10px]
                            border
                            border-white/[0.04]
                            bg-black/10
                            px-2.5
                            py-2
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
                              bg-violet-300/[0.04]
                              text-[6px]
                              font-semibold
                              text-violet-100
                            "
                          >
                            {
                              step.priority
                            }
                          </span>


                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <p
                              className="
                                text-[7.5px]
                                font-semibold
                                text-zinc-300
                              "
                            >
                              {
                                step.title
                              }
                            </p>

                            <p
                              className="
                                mt-0.5
                                line-clamp-2
                                text-[6.5px]
                                leading-3
                                text-zinc-600
                              "
                            >
                              {
                                step.action
                              }
                            </p>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </section>
            )}


            {/* SNAPSHOT */}

            <section
              className="
                mt-2
                grid
                grid-cols-4
                divide-x
                divide-white/[0.04]
                overflow-hidden
                rounded-[15px]
                border
                border-white/[0.05]
                bg-[#05080e]
              "
            >
              {[
                {
                  value:
                    diagnosticCase
                      .symptoms
                      .length,

                  label:
                    text.symptoms,
                },

                {
                  value:
                    diagnosticCase
                      .dtc_codes
                      .length,

                  label:
                    text.dtc,
                },

                {
                  value:
                    diagnosticCase
                      .adaptive_answers
                      .length,

                  label:
                    text.answers,
                },

                {
                  value:
                    strongestEvidence,

                  label:
                    text.sourceCount,
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
                      px-1
                      py-2.5
                      text-center
                    "
                  >
                    <p
                      className="
                        text-[13px]
                        font-semibold
                        text-zinc-200
                      "
                    >
                      {
                        item.value
                      }
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[5px]
                        text-zinc-700
                      "
                    >
                      {
                        item.label
                      }
                    </p>
                  </div>
                )
              )}
            </section>


            {/* DISCLAIMER */}

            <details
              className="
                mt-2
                rounded-[13px]
                border
                border-white/[0.05]
                bg-white/[0.012]
                px-3
                py-2.5
              "
            >
              <summary
                className="
                  cursor-pointer
                  list-none
                  text-[6.5px]
                  font-semibold
                  text-zinc-500
                "
              >
                {
                  text.diagnosticNotice
                }
              </summary>

              <p
                className="
                  mt-1.5
                  text-[6.5px]
                  leading-3.5
                  text-zinc-700
                "
              >
                {
                  text.disclaimer
                }
              </p>
            </details>


            {/* ACTIONS */}

            <section
              className="
                relative
                mt-2.5
                overflow-hidden
                rounded-[17px]
                border
                border-blue-400/[0.13]
                bg-[#08101e]
                p-3
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  bottom-0
                  h-28
                  w-28
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
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/diagnosis/report"
                    )
                  }
                  className="
                    flex
                    min-h-[42px]
                    w-full
                    items-center
                    justify-between
                    rounded-[10px]
                    bg-blue-500
                    px-3.5
                    text-[8px]
                    font-semibold
                    text-white
                    shadow-[0_10px_26px_rgba(37,99,235,0.18)]
                  "
                >
                  <span>
                    {
                      text.report
                    }
                  </span>

                  <span>
                    →
                  </span>
                </button>


                <div
                  className="
                    mt-1.5
                    grid
                    grid-cols-3
                    gap-1.5
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/guide"
                      )
                    }
                    className="
                      min-h-[35px]
                      rounded-[9px]
                      border
                      border-white/[0.055]
                      text-[6.5px]
                      font-semibold
                      text-zinc-500
                    "
                  >
                    {
                      text.guide
                    }
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/diagnosis/history"
                      )
                    }
                    className="
                      min-h-[35px]
                      rounded-[9px]
                      border
                      border-white/[0.055]
                      text-[6.5px]
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
                    onClick={
                      handleNewDiagnosis
                    }
                    className="
                      min-h-[35px]
                      rounded-[9px]
                      border
                      border-white/[0.055]
                      text-[6.5px]
                      font-semibold
                      text-zinc-500
                    "
                  >
                    {
                      text.newDiagnosis
                    }
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>


      {/* FINDING DETAIL MODAL */}

      <Modal
        open={
          selectedFinding !==
          null
        }
        onClose={() =>
          setSelectedFinding(
            null
          )
        }
        eyebrow={
          findingDetailMode ===
          "score"
            ? text.scoreExplanation
            : findingDetailMode ===
                "checks"
              ? text.checksTitle
              : text.technicalTitle
        }
        title={
          selectedFinding
            ?.probable_cause ??
          ""
        }
        description={
          findingDetailMode ===
          "score"
            ? text.scoreDescription
            : findingDetailMode ===
                "checks"
              ? text.checksDescription
              : text.technicalDescription
        }
      >
        {selectedFinding && (
          <div>
            <div
              className="
                mb-3
                grid
                grid-cols-3
                gap-1.5
              "
            >
              {(
                [
                  "score",
                  "checks",
                  "technical",
                ] as FindingDetailMode[]
              ).map(
                (
                  mode
                ) => (
                  <button
                    key={
                      mode
                    }
                    type="button"
                    onClick={() =>
                      setFindingDetailMode(
                        mode
                      )
                    }
                    className={`
                      min-h-[36px]
                      rounded-[9px]
                      border
                      px-2
                      text-[7px]
                      font-semibold

                      ${
                        findingDetailMode ===
                        mode
                          ? "border-blue-400/20 bg-blue-500/[0.07] text-blue-100"
                          : "border-white/[0.06] text-zinc-500"
                      }
                    `}
                  >
                    {mode ===
                    "score"
                      ? text.whyScore
                      : mode ===
                          "checks"
                        ? text.checks
                        : text.technical}
                  </button>
                )
              )}
            </div>


            {findingDetailMode ===
              "score" && (
              <div>
                <div
                  className="
                    space-y-1.5
                  "
                >
                  {selectedFinding
                    .score_breakdown
                    .map(
                      (
                        evidence,
                        index
                      ) => (
                        <div
                          key={`${evidence.source}-${index}`}
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            rounded-[10px]
                            border
                            border-white/[0.05]
                            bg-white/[0.012]
                            px-3
                            py-2.5
                          "
                        >
                          <div
                            className="
                              min-w-0
                            "
                          >
                            <p
                              className="
                                text-[8px]
                                font-medium
                                text-zinc-300
                              "
                            >
                              {
                                evidence.label
                              }
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[6px]
                                text-zinc-600
                              "
                            >
                              {
                                getEvidenceSourceLabel(
                                  evidence.source,
                                  language
                                )
                              }
                            </p>
                          </div>


                          <span
                            className={`
                              shrink-0
                              text-[9px]
                              font-semibold

                              ${
                                evidence.points >=
                                0
                                  ? "text-blue-200"
                                  : "text-red-300"
                              }
                            `}
                          >
                            {evidence.points >
                            0
                              ? "+"
                              : ""}
                            {
                              evidence.points
                            }
                          </span>
                        </div>
                      )
                    )}
                </div>


                <div
                  className="
                    mt-3
                    rounded-[12px]
                    border
                    border-blue-400/10
                    bg-blue-500/[0.035]
                    p-3
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-[8px]
                        text-zinc-500
                      "
                    >
                      {
                        text.rawScore
                      }
                    </span>

                    <span
                      className="
                        text-[11px]
                        font-semibold
                      "
                    >
                      {
                        selectedFinding
                          .raw_score
                      }
                    </span>
                  </div>


                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      justify-between
                      border-t
                      border-white/[0.05]
                      pt-2
                    "
                  >
                    <span
                      className="
                        text-[8px]
                        font-semibold
                        text-zinc-300
                      "
                    >
                      {
                        text.finalScore
                      }
                    </span>

                    <span
                      className="
                        text-[13px]
                        font-semibold
                        text-blue-200
                      "
                    >
                      {
                        clampScore(
                          selectedFinding
                            .confidence
                        )
                      }
                      /100
                    </span>
                  </div>


                  {selectedFinding
                    .raw_score >
                    100 && (
                    <p
                      className="
                        mt-2
                        text-[6.5px]
                        text-zinc-600
                      "
                    >
                      {
                        text.cappedScore
                      }
                    </p>
                  )}
                </div>


                <p
                  className="
                    mt-2
                    text-[6.5px]
                    leading-3.5
                    text-zinc-600
                  "
                >
                  {
                    text.scoreDisclaimer
                  }
                </p>
              </div>
            )}


            {findingDetailMode ===
              "checks" && (
              <div
                className="
                  space-y-1.5
                "
              >
                {selectedFinding
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
                          rounded-[10px]
                          border
                          border-white/[0.05]
                          bg-white/[0.012]
                          px-3
                          py-2.5
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
                            border-blue-400/10
                            text-[6px]
                            font-semibold
                            text-blue-200
                          "
                        >
                          {index +
                            1}
                        </span>

                        <p
                          className="
                            text-[8px]
                            leading-4
                            text-zinc-400
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
            )}


            {findingDetailMode ===
              "technical" && (
              <div>
                {selectedFinding
                  .rule_id && (
                  <div
                    className="
                      rounded-[11px]
                      border
                      border-blue-400/10
                      bg-blue-500/[0.025]
                      p-3
                    "
                  >
                    <p
                      className="
                        text-[6px]
                        uppercase
                        tracking-[0.1em]
                        text-blue-200/60
                      "
                    >
                      {
                        text.rule
                      }
                    </p>

                    <p
                      className="
                        mt-1.5
                        font-mono
                        text-[8px]
                        font-semibold
                        text-blue-100
                      "
                    >
                      {
                        selectedFinding
                          .rule_id
                      }
                    </p>
                  </div>
                )}


                {(selectedFinding
                  .technical_references
                  ?.length ??
                  0) >
                0 ? (
                  <div
                    className="
                      mt-2
                      space-y-1.5
                    "
                  >
                    {selectedFinding
                      .technical_references
                      ?.map(
                        (
                          reference,
                          index
                        ) => (
                          <div
                            key={`${reference.identifier}-${index}`}
                            className="
                              rounded-[10px]
                              border
                              border-white/[0.05]
                              p-3
                            "
                          >
                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-2
                              "
                            >
                              <p
                                className="
                                  text-[8px]
                                  font-semibold
                                  text-zinc-300
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
                                    rounded-full
                                    border
                                    border-emerald-400/10
                                    px-1.5
                                    py-0.5
                                    text-[5px]
                                    text-emerald-200
                                  "
                                >
                                  {
                                    text.usedInCase
                                  }
                                </span>
                              )}
                            </div>


                            <p
                              className="
                                mt-1
                                font-mono
                                text-[6.5px]
                                text-cyan-200/70
                              "
                            >
                              {
                                reference.identifier
                              }
                            </p>


                            {reference.note && (
                              <p
                                className="
                                  mt-1.5
                                  text-[7px]
                                  leading-3.5
                                  text-zinc-600
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
                ) : (
                  <p
                    className="
                      mt-2
                      text-[8px]
                      text-zinc-600
                    "
                  >
                    {
                      text.noTechnical
                    }
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>


      {/* WARNINGS */}

      <Modal
        open={
          showWarnings
        }
        onClose={() =>
          setShowWarnings(
            false
          )
        }
        eyebrow={
          text.warnings
        }
        title={
          text.warningsTitle
        }
        description={
          text.warningsDescription
        }
      >
        <div
          className="
            space-y-1.5
          "
        >
          {warnings.map(
            (
              warning,
              index
            ) => (
              <div
                key={`${warning.code}-${index}`}
                className="
                  rounded-[10px]
                  border
                  border-amber-400/10
                  bg-amber-400/[0.035]
                  px-3
                  py-2.5
                  text-[8px]
                  leading-4
                  text-amber-100
                "
              >
                {
                  warning.message
                }
              </div>
            )
          )}
        </div>
      </Modal>


      {/* ALL STEPS */}

      <Modal
        open={
          showSteps
        }
        onClose={() =>
          setShowSteps(
            false
          )
        }
        eyebrow={
          text.next
        }
        title={
          text.next
        }
        description={
          text.nextDescription
        }
      >
        <div
          className="
            space-y-2
          "
        >
          {nextSteps.map(
            (
              step
            ) => (
              <div
                key={
                  step.id
                }
                className="
                  flex
                  gap-2.5
                  rounded-[11px]
                  border
                  border-white/[0.05]
                  p-3
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
                    rounded-full
                    border
                    border-violet-400/10
                    text-[7px]
                    font-semibold
                    text-violet-200
                  "
                >
                  {
                    step.priority
                  }
                </span>


                <div>
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      text-zinc-200
                    "
                  >
                    {
                      step.title
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      leading-4
                      text-zinc-500
                    "
                  >
                    {
                      step.action
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      text-[7px]
                      leading-3.5
                      text-zinc-700
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
      </Modal>


      {/* CASE DATA */}

      <Modal
        open={
          showCaseData
        }
        onClose={() =>
          setShowCaseData(
            false
          )
        }
        eyebrow={
          text.caseData
        }
        title={
          vehicleName
        }
        description={
          caseId
            ? `${text.caseData} · ${caseId}`
            : text.caseData
        }
      >
        <div
          className="
            grid
            grid-cols-3
            gap-1.5
          "
        >
          {[
            {
              value:
                diagnosticCase
                  .symptoms
                  .length,

              label:
                text.symptoms,
            },

            {
              value:
                diagnosticCase
                  .dtc_codes
                  .length,

              label:
                text.dtc,
            },

            {
              value:
                diagnosticCase
                  .adaptive_answers
                  .length,

              label:
                text.answers,
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
                  rounded-[10px]
                  border
                  border-white/[0.05]
                  p-2.5
                  text-center
                "
              >
                <p
                  className="
                    text-[14px]
                    font-semibold
                  "
                >
                  {
                    item.value
                  }
                </p>

                <p
                  className="
                    mt-0.5
                    text-[6px]
                    text-zinc-600
                  "
                >
                  {
                    item.label
                  }
                </p>
              </div>
            )
          )}
        </div>


        <div
          className="
            mt-2
            rounded-[11px]
            border
            border-white/[0.05]
            p-3
          "
        >
          <p
            className="
              text-[6px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-zinc-600
            "
          >
            {
              text.symptoms
            }
          </p>


          <div
            className="
              mt-2
              space-y-1
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
                      bg-black/15
                      px-2
                      py-2
                    "
                  >
                    <span
                      className="
                        text-[6.5px]
                        font-semibold
                        text-blue-200
                      "
                    >
                      {index +
                        1}
                    </span>

                    <p
                      className="
                        text-[7px]
                        leading-3.5
                        text-zinc-500
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
        </div>


        <div
          className="
            mt-2
            rounded-[11px]
            border
            border-white/[0.05]
            p-3
          "
        >
          <p
            className="
              text-[6px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-zinc-600
            "
          >
            {
              text.dtc
            }
          </p>


          <div
            className="
              mt-2
              flex
              flex-wrap
              gap-1
            "
          >
            {diagnosticCase
              .dtc_codes
              .length >
            0 ? (
              diagnosticCase
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
                        rounded-[7px]
                        border
                        border-cyan-300/10
                        px-2
                        py-1
                        font-mono
                        text-[6.5px]
                        text-cyan-100
                      "
                    >
                      {
                        code
                      }
                    </span>
                  )
                )
            ) : (
              <span
                className="
                  text-[7px]
                  text-zinc-600
                "
              >
                {
                  text.none
                }
              </span>
            )}
          </div>
        </div>
      </Modal>
    </main>
  );
}