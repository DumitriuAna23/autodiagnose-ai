"use client";

import {
  useEffect,
  useMemo,
  useRef,
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


type FindingDetailMode =
  | "score"
  | "checks"
  | "technical";


function clampScore(
  score: number
) {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(score)
    )
  );
}


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
    labels[severity]?.[
      language
    ] ?? severity
  );
}


function getSeverityClasses(
  severity: string
) {
  if (
    severity === "high"
  ) {
    return "border-red-400/20 bg-red-400/[0.07] text-red-200";
  }


  if (
    severity === "medium"
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


  return labels[
    urgency
  ][language];
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
    strength !==
      "limited" &&
    strength !==
      "moderate" &&
    strength !==
      "strong"
  ) {
    return labels
      .limited[language];
  }


  return labels[
    strength
  ][language];
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
    (finding) =>
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
  language: Language
) {
  const safeCount =
    typeof count ===
    "number"
      ? count
      : 0;


  if (
    language === "ro"
  ) {
    return safeCount === 1
      ? "1 sursă independentă"
      : `${safeCount} surse independente`;
  }


  return safeCount === 1
    ? "1 independent source"
    : `${safeCount} independent sources`;
}


function getEvidenceSourceLabel(
  source: string,
  language: Language
) {
  const labels: Record<
    string,
    {
      ro: string;
      en: string;
    }
  > = {
    base: {
      ro: "Scor de bază",
      en: "Base score",
    },

    symptom: {
      ro: "Simptom raportat",
      en: "Reported symptom",
    },

    dtc: {
      ro: "Cod DTC",
      en: "DTC code",
    },

    adaptive: {
      ro: "Răspuns adaptiv",
      en: "Adaptive answer",
    },

    ai_text: {
      ro: "Interpretarea descrierii",
      en: "Description interpretation",
    },

    vehicle_context: {
      ro: "Context vehicul",
      en: "Vehicle context",
    },
  };


  return (
    labels[source]?.[
      language
    ] ?? source
  );
}


export default function AnalysisPage() {
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
    caseId,
    setCaseId,
  ] =
    useState<
      string | null
    >(null);


  const [
    diagnosticCase,
    setDiagnosticCase,
  ] =
    useState<
      DiagnosticCase | null
    >(null);


  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);


  const [
    hasError,
    setHasError,
  ] =
    useState(false);


  const [
    analysis,
    setAnalysis,
  ] =
    useState<
      DiagnosticAnalysis | null
    >(null);


  const [
    analysisLoading,
    setAnalysisLoading,
  ] =
    useState(true);


  const [
    analysisError,
    setAnalysisError,
  ] =
    useState<
      string | null
    >(null);


  const [
    activeFindingIndex,
    setActiveFindingIndex,
  ] =
    useState(0);


  const resultOverviewRef =
    useRef<HTMLElement | null>(
      null
    );


  const [
    selectedFinding,
    setSelectedFinding,
  ] =
    useState<
      DiagnosticFinding | null
    >(null);


  const [
    findingDetailMode,
    setFindingDetailMode,
  ] =
    useState<
      FindingDetailMode
    >("score");


  const [
    showWarnings,
    setShowWarnings,
  ] =
    useState(false);


  const [
    showSteps,
    setShowSteps,
  ] =
    useState(false);


  const [
    showCaseData,
    setShowCaseData,
  ] =
    useState(false);


  async function analyzeCase(
    currentCaseId: string,
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


  if (!savedCaseId) {
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


  /*
   * From this point forward the value is
   * guaranteed to be a string.
   *
   * We copy it into a new constant because
   * TypeScript does not preserve the
   * localStorage null-check inside the
   * nested async function.
   */
  const currentCaseId: string =
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
            method: "GET",

            credentials:
              "include",
          }
        );


      if (!response.ok) {
        if (
          response.status === 401
        ) {
          throw new Error(
            "UNAUTHORIZED"
          );
        }


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

    } catch (error) {
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
      loading:
        "Loading diagnostic case...",

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

      engine:
        "DIAGNOSTIC ENGINE",

      complete:
        "ANALYSIS COMPLETE",

      title:
        "Likely causes identified",

      description:
        "The results below are ranked by relevance to the information available in this case.",

      vehicle:
        "Vehicle",

      caseData:
        "Case data",

      primary:
        "Primary hypothesis",

      secondary:
        "Secondary hypothesis",

      selectedHypothesis:
        "Selected hypothesis",

      otherCauses:
        "Other possible causes",

      relevance:
        "Relevance score",

      evidence:
        "Evidence",

      severity:
        "Severity",

      urgency:
        "Urgency",

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
        "Traceability to the diagnostic rule and technical references used by AutoDiagnose AI.",

      rawScore:
        "Calculated score",

      finalScore:
        "Displayed score",

      cappedScore:
        "The displayed relevance score is capped at 100/100.",

      scoreDisclaimer:
        "This is a relevance score based on the available evidence. It is not a statistical probability that the component has failed.",

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

      warningCount:
        "warning",

      warningsTitle:
        "Check the entered data",

      warningsDescription:
        "These items may influence the interpretation of the result.",

      limited:
        "More data would strengthen the result",

      limitedDescription:
        "Current findings are supported by limited independent evidence. Add DTC codes or more precise symptom context when possible.",

      noFindings:
        "No sufficiently relevant cause was identified.",

      retry:
        "Retry analysis",

      ready:
        "Analysis complete",

      guide:
        "How to read the result",

      report:
        "Full report",

      history:
        "History",

      newDiagnosis:
        "New diagnosis",

      caseSnapshot:
        "Case snapshot",

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
        "AutoDiagnose AI is an indicative diagnostic aid. Confirm faults with technical inspection, measurements and manufacturer service information before repair decisions.",

      sourceCount:
        "Evidence sources",
    },

    ro: {
      loading:
        "Se încarcă cazul de diagnostic...",

      loadingTitle:
        "Construim imaginea de diagnostic",

      loadingDescription:
        "Corelăm datele vehiculului, simptomele, codurile DTC și răspunsurile adaptive.",

      errorTitle:
        "Cazul de diagnostic nu a putut fi încărcat",

      errorDescription:
        "Cazul nu este disponibil sau sesiunea ta nu mai are acces la el.",

      back:
        "Înapoi la verificare",

      engine:
        "MOTOR DE DIAGNOSTIC",

      complete:
        "ANALIZĂ FINALIZATĂ",

      title:
        "Am identificat cauzele probabile",

      description:
        "Rezultatele sunt ordonate după relevanța lor pentru informațiile disponibile în acest caz.",

      vehicle:
        "Vehicul",

      caseData:
        "Datele cazului",

      primary:
        "Ipoteza principală",

      secondary:
        "Ipoteză secundară",

      selectedHypothesis:
        "Ipoteza selectată",

      otherCauses:
        "Alte cauze posibile",

      relevance:
        "Scor de relevanță",

      evidence:
        "Dovezi",

      severity:
        "Severitate",

      urgency:
        "Urgență",

      whyScore:
        "De ce acest scor?",

      checks:
        "Verificări",

      technical:
        "Bază tehnică",

      scoreExplanation:
        "Explicația scorului",

      scoreDescription:
        "Vezi ce semnale din caz au contribuit la acest rezultat.",

      checksTitle:
        "Verificări recomandate",

      checksDescription:
        "Folosește aceste verificări pentru a confirma sau elimina această posibilă cauză.",

      technicalTitle:
        "Bază tehnică",

      technicalDescription:
        "Trasabilitate către regula de diagnostic și referințele tehnice folosite de AutoDiagnose AI.",

      rawScore:
        "Scor calculat",

      finalScore:
        "Scor afișat",

      cappedScore:
        "Scorul de relevanță afișat este limitat la maximum 100/100.",

      scoreDisclaimer:
        "Acesta este un scor de relevanță bazat pe dovezile disponibile. Nu reprezintă probabilitatea statistică a unei defecțiuni.",

      noTechnical:
        "Nu există referințe tehnice suplimentare atașate acestui rezultat.",

      rule:
        "Regulă de diagnostic",

      usedInCase:
        "Folosit în acest caz",

      next:
        "Pași recomandați",

      nextDescription:
        "Un traseu scurt de verificare bazat pe cele mai puternice semnale actuale.",

      seeAll:
        "Vezi tot",

      warnings:
        "Calitatea datelor",

      warningCount:
        "avertizare",

      warningsTitle:
        "Verifică datele introduse",

      warningsDescription:
        "Aceste informații pot influența interpretarea rezultatului.",

      limited:
        "Mai multe date ar întări rezultatul",

      limitedDescription:
        "Rezultatele actuale au dovezi independente limitate. Adaugă coduri DTC sau context mai precis despre simptome atunci când este posibil.",

      noFindings:
        "Nu a fost identificată o cauză suficient de relevantă.",

      retry:
        "Reîncearcă analiza",

      ready:
        "Analiză finalizată",

      guide:
        "Cum citesc rezultatul",

      report:
        "Raport complet",

      history:
        "Istoric",

      newDiagnosis:
        "Diagnostic nou",

      caseSnapshot:
        "Rezumat caz",

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
        "AutoDiagnose AI oferă o analiză orientativă. Confirmă defecțiunile prin inspecție tehnică, măsurători și documentația producătorului înainte de decizii de reparație.",

      sourceCount:
        "Surse de dovezi",
    },
  };


  const text =
    content[language];


  const findings =
    analysis?.findings ??
    [];


  const activeFinding =
    findings[
      activeFindingIndex
    ] ??
    findings[0] ??
    null;


  const otherFindings =
    findings
      .map(
        (
          finding,
          index
        ) => ({
          finding,
          index,
        })
      )
      .filter(
        (item) =>
          item.index !==
          activeFindingIndex
      );


  const nextSteps =
    analysis
      ?.next_best_steps ??
    [];


  const warnings =
    analysis
      ?.data_quality_warnings ??
    [];


  const visibleSteps =
    nextSteps.slice(
      0,
      3
    );


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
          .symptoms.length +
        diagnosticCase
          .dtc_codes.length +
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
            (finding) =>
              finding
                .evidence_sources_count ??
              0
          )
        );
      },
      [findings]
    );


  function selectDisplayedFinding(
    index: number
  ) {
    setActiveFindingIndex(
      index
    );

    requestAnimationFrame(
      () => {
        resultOverviewRef
          .current
          ?.scrollIntoView({
            behavior:
              "smooth",
            block:
              "start",
          });
      }
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
      (key) => {
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
            relative
            w-full
            max-w-xl
            overflow-hidden
            rounded-[30px]
            p-8
            text-center
            sm:p-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-56
              w-56
              -translate-x-1/2
              rounded-full
              bg-blue-500/[0.10]
              blur-[80px]
            "
          />


          <div
            className="
              relative
              mx-auto
              flex
              h-24
              w-24
              items-center
              justify-center
            "
          >
            <div
              className="
                absolute
                h-24
                w-24
                animate-pulse
                rounded-full
                border
                border-blue-400/15
              "
            />

            <div
              className="
                absolute
                h-16
                w-16
                rounded-full
                border
                border-blue-400/25
                bg-blue-500/[0.05]
              "
            />

            <span
              className="
                h-2.5
                w-2.5
                rounded-full
                bg-blue-400
                shadow-[0_0_20px_rgba(96,165,250,0.85)]
              "
            />
          </div>


          <p
            className="
              relative
              mt-6
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-blue-200/75
            "
          >
            {text.engine}
          </p>


          <h1
            className="
              relative
              mt-3
              text-2xl
              font-semibold
              tracking-[-0.03em]
              text-white
            "
          >
            {text.loadingTitle}
          </h1>


          <p
            className="
              relative
              mx-auto
              mt-3
              max-w-md
              text-[15px]
              leading-7
              text-zinc-400
            "
          >
            {
              text.loadingDescription
            }
          </p>


          <div
            className="
              relative
              mt-7
              grid
              grid-cols-3
              gap-2
            "
          >
            {[
              text.vehicle,
              text.symptoms,
              text.evidence,
            ].map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item
                  }
                  className="
                    rounded-xl
                    border
                    border-white/[0.055]
                    bg-white/[0.018]
                    px-3
                    py-3
                  "
                >
                  <span
                    className={`
                      mx-auto
                      block
                      h-1.5
                      w-1.5
                      rounded-full
                      ${
                        index ===
                        2
                          ? "animate-pulse bg-blue-400"
                          : "bg-emerald-400"
                      }
                    `}
                  />

                  <p
                    className="
                      mt-2
                      text-[12px]
                      font-medium
                      text-zinc-300
                    "
                  >
                    {item}
                  </p>
                </div>
              )
            )}
          </div>
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
              border-red-400/15
              bg-red-400/[0.05]
              text-lg
              font-semibold
              text-red-200
            "
          >
            !
          </div>


          <h1
            className="
              mt-5
              text-2xl
              font-semibold
              text-white
            "
          >
            {text.errorTitle}
          </h1>


          <p
            className="
              mt-3
              text-[15px]
              leading-7
              text-zinc-400
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
            ← {text.back}
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

        {/* HERO */}

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
              bg-blue-500/[0.09]
              blur-[95px]
            "
          />


          <div
            className="
              pointer-events-none
              absolute
              right-10
              top-4
              h-48
              w-48
              rounded-full
              bg-cyan-400/[0.04]
              blur-[75px]
            "
          />


          <div
            className="
              relative
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >
            <div
              className="
                max-w-3xl
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-emerald-400/15
                  bg-emerald-400/[0.055]
                  px-3.5
                  py-2
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
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-emerald-200/80
                  "
                >
                  {analysisLoading
                    ? text.engine
                    : text.complete}
                </span>
              </div>


              <p
                className="
                  mt-7
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-[0.20em]
                  text-blue-200/70
                "
              >
                {text.engine}
              </p>


              <h1
                className="
                  mt-3
                  text-[2.25rem]
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.04em]
                  text-white
                  sm:text-[2.8rem]
                "
              >
                {analysisLoading
                  ? text.loadingTitle
                  : text.title}
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
                {analysisLoading
                  ? text.loadingDescription
                  : text.description}
              </p>
            </div>


            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowCaseData(
                    true
                  )
                }
                className="
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  px-4
                  py-2.5
                  text-[13px]
                  font-semibold
                  text-zinc-200
                  transition
                  hover:border-white/[0.14]
                  hover:bg-white/[0.045]
                "
              >
                {text.caseData}
              </button>


              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/guide"
                  )
                }
                className="
                  rounded-xl
                  border
                  border-blue-400/15
                  bg-blue-500/[0.045]
                  px-4
                  py-2.5
                  text-[13px]
                  font-semibold
                  text-blue-100
                  transition
                  hover:bg-blue-500/[0.08]
                "
              >
                {text.guide}
              </button>
            </div>
          </div>


          <div
            className="
              relative
              mt-8
              flex
              flex-wrap
              items-center
              gap-x-5
              gap-y-2
              border-t
              border-white/[0.05]
              pt-5
              text-[14px]
              text-zinc-300
            "
          >
            <span
              className="
                font-semibold
                text-white
              "
            >
              {vehicleName}
            </span>


            {diagnosticCase
              .vehicle.year && (
              <span>
                {
                  diagnosticCase
                    .vehicle.year
                }
              </span>
            )}


            <span>
              {
                diagnosticCase
                  .symptoms
                  .length
              }{" "}
              {text.symptoms.toLowerCase()}
            </span>


            <span>
              {
                diagnosticCase
                  .dtc_codes
                  .length
              }{" "}
              DTC
            </span>


            <span>
              {caseSignalCount}{" "}
              {language === "ro"
                ? "semnale"
                : "signals"}
            </span>
          </div>
        </section>


        {/* ANALYSIS ERROR */}

        {analysisError && (
          <section
            className="
              mt-6
              rounded-[24px]
              border
              border-red-400/15
              bg-red-400/[0.05]
              p-5
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <p
                className="
                  text-[14px]
                  leading-6
                  text-red-100
                "
              >
                {analysisError}
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
                  rounded-xl
                  border
                  border-red-300/20
                  bg-red-300/[0.06]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-red-100
                  transition
                  hover:bg-red-300/[0.10]
                "
              >
                {text.retry}
              </button>
            </div>
          </section>
        )}


        {/* ANALYSIS LOADING */}

        {analysisLoading &&
          !analysisError && (
          <section
            className="
              ad-surface
              mt-6
              overflow-hidden
              rounded-[28px]
              p-6
              sm:p-8
            "
          >
            <div
              className="
                grid
                gap-5
                lg:grid-cols-[180px_minmax(0,1fr)]
                lg:items-center
              "
            >
              <div
                className="
                  relative
                  mx-auto
                  flex
                  h-40
                  w-40
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    absolute
                    h-36
                    w-36
                    animate-pulse
                    rounded-full
                    border
                    border-blue-400/10
                  "
                />

                <div
                  className="
                    absolute
                    h-24
                    w-24
                    rounded-full
                    border
                    border-blue-400/20
                  "
                />

                <div
                  className="
                    absolute
                    h-14
                    w-14
                    rounded-full
                    bg-blue-500/[0.06]
                    shadow-[0_0_45px_rgba(59,130,246,0.15)]
                  "
                />

                <span
                  className="
                    relative
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-blue-400
                    shadow-[0_0_18px_rgba(96,165,250,0.9)]
                  "
                />
              </div>


              <div>
                <p
                  className="
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-blue-200/70
                  "
                >
                  {text.engine}
                </p>


                <h2
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    text-white
                  "
                >
                  {text.loadingTitle}
                </h2>


                <p
                  className="
                    mt-3
                    max-w-xl
                    text-[15px]
                    leading-7
                    text-zinc-400
                  "
                >
                  {
                    text.loadingDescription
                  }
                </p>


                <div
                  className="
                    mt-5
                    grid
                    gap-2
                    sm:grid-cols-3
                  "
                >
                  {[
                    {
                      label:
                        text.vehicle,
                      done:
                        true,
                    },
                    {
                      label:
                        text.symptoms,
                      done:
                        true,
                    },
                    {
                      label:
                        text.evidence,
                      done:
                        false,
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
                          gap-3
                          rounded-xl
                          border
                          border-white/[0.055]
                          bg-white/[0.018]
                          px-3.5
                          py-3
                        "
                      >
                        <span
                          className={`
                            h-2
                            w-2
                            rounded-full
                            ${
                              item.done
                                ? "bg-emerald-400"
                                : "animate-pulse bg-blue-400"
                            }
                          `}
                        />

                        <span
                          className="
                            text-[13px]
                            font-medium
                            text-zinc-300
                          "
                        >
                          {
                            item.label
                          }
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>
        )}


        {/* RESULT */}

        {!analysisLoading &&
          !analysisError &&
          analysis && (
          <>
            {/* DATA QUALITY / LIMITED EVIDENCE */}

            {(warnings.length >
              0 ||
              limitedEvidence) && (
              <div
                className="
                  mt-6
                  grid
                  gap-3
                  md:grid-cols-2
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
                      rounded-[22px]
                      border
                      border-sky-400/15
                      bg-sky-400/[0.045]
                      p-5
                      text-left
                      transition
                      hover:bg-sky-400/[0.07]
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >
                      <span
                        className="
                          mt-0.5
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-sky-300/15
                          bg-sky-300/[0.06]
                          text-sm
                          font-semibold
                          text-sky-200
                        "
                      >
                        +
                      </span>


                      <div>
                        <p
                          className="
                            text-[14px]
                            font-semibold
                            text-sky-100
                          "
                        >
                          {text.limited}
                        </p>

                        <p
                          className="
                            mt-1
                            text-[13px]
                            leading-6
                            text-sky-100/70
                          "
                        >
                          {
                            text.limitedDescription
                          }
                        </p>
                      </div>
                    </div>
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
                      rounded-[22px]
                      border
                      border-amber-400/15
                      bg-amber-400/[0.045]
                      p-5
                      text-left
                      transition
                      hover:bg-amber-400/[0.07]
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-start
                          gap-3
                        "
                      >
                        <span
                          className="
                            mt-0.5
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-amber-300/15
                            bg-amber-300/[0.06]
                            text-sm
                            font-semibold
                            text-amber-200
                          "
                        >
                          !
                        </span>

                        <div>
                          <p
                            className="
                              text-[14px]
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
                              text-[13px]
                              leading-6
                              text-amber-100/70
                            "
                          >
                            {
                              warnings.length
                            }{" "}
                            {
                              text.warningCount
                            }
                            {warnings.length !==
                            1
                              ? "s"
                              : ""}
                          </p>
                        </div>
                      </div>

                      <span
                        className="
                          text-amber-200/70
                        "
                      >
                        →
                      </span>
                    </div>
                  </button>
                )}
              </div>
            )}


            {/* PRIMARY FINDING */}

            {activeFinding && (
              <section
                ref={
                  resultOverviewRef
                }
                className="
                  ad-surface
                  relative
                  mt-6
                  scroll-mt-6
                  overflow-hidden
                  rounded-[30px]
                  p-6
                  sm:p-8
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-72
                    w-72
                    rounded-full
                    bg-blue-500/[0.10]
                    blur-[100px]
                  "
                />


                <div
                  className="
                    relative
                    grid
                    gap-7
                    xl:grid-cols-[minmax(0,1fr)_220px]
                    xl:items-center
                  "
                >
                  <div>
                    <p
                      className="
                        text-[12px]
                        font-semibold
                        uppercase
                        tracking-[0.17em]
                        text-blue-200/70
                      "
                    >
                      {activeFindingIndex ===
                      0
                        ? text.primary
                        : `${text.secondary} · #${
                            activeFindingIndex +
                            1
                          }`}
                    </p>


                    <h2
                      className="
                        mt-3
                        max-w-3xl
                        text-[1.7rem]
                        font-semibold
                        leading-tight
                        tracking-[-0.03em]
                        text-white
                        sm:text-[2rem]
                      "
                    >
                      {
                        activeFinding
                          .probable_cause
                      }
                    </h2>


                    <p
                      className="
                        mt-4
                        max-w-3xl
                        text-[15px]
                        leading-7
                        text-zinc-300
                      "
                    >
                      {
                        activeFinding
                          .description
                      }
                    </p>


                    <div
                      className="
                        mt-5
                        flex
                        flex-wrap
                        gap-2
                      "
                    >
                      <span
                        className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${getUrgencyClasses(
                          activeFinding
                            .urgency
                        )}`}
                      >
                        {getUrgencyLabel(
                          activeFinding
                            .urgency,
                          language
                        )}
                      </span>


                      <span
                        className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${getSeverityClasses(
                          activeFinding
                            .severity
                        )}`}
                      >
                        {text.severity}:{" "}
                        {getSeverityLabel(
                          activeFinding
                            .severity,
                          language
                        )}
                      </span>


                      <span
                        className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${getEvidenceStrengthClasses(
                          activeFinding
                            .evidence_strength
                        )}`}
                      >
                        {text.evidence}:{" "}
                        {getEvidenceStrengthLabel(
                          activeFinding
                            .evidence_strength,
                          language
                        )}
                      </span>
                    </div>


                    {activeFinding
                      .safety_message && (
                      <div
                        className={`
                          mt-5
                          rounded-2xl
                          border
                          px-4
                          py-3.5
                          text-[14px]
                          leading-6
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
                        mt-6
                        flex
                        flex-wrap
                        gap-2
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
                          rounded-xl
                          border
                          border-blue-400/15
                          bg-blue-500/[0.05]
                          px-4
                          py-2.5
                          text-[13px]
                          font-semibold
                          text-blue-100
                          transition
                          hover:bg-blue-500/[0.09]
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
                          rounded-xl
                          border
                          border-white/[0.08]
                          bg-white/[0.025]
                          px-4
                          py-2.5
                          text-[13px]
                          font-semibold
                          text-zinc-200
                          transition
                          hover:bg-white/[0.045]
                        "
                      >
                        {text.checks}
                      </button>


                      {(activeFinding
                        .rule_id ||
                        (activeFinding
                          .technical_references
                          ?.length ??
                          0) >
                          0) && (
                        <button
                          type="button"
                          onClick={() =>
                            openFindingDetail(
                              activeFinding,
                              "technical"
                            )
                          }
                          className="
                            rounded-xl
                            border
                            border-white/[0.08]
                            bg-white/[0.025]
                            px-4
                            py-2.5
                            text-[13px]
                            font-semibold
                            text-zinc-200
                            transition
                            hover:bg-white/[0.045]
                          "
                        >
                          {
                            text.technical
                          }
                        </button>
                      )}
                    </div>
                  </div>


                  {/* SCORE VISUAL */}

                  <div
                    className="
                      mx-auto
                      w-full
                      max-w-[220px]
                      rounded-[24px]
                      border
                      border-white/[0.06]
                      bg-black/15
                      p-5
                    "
                  >
                    <div
                      className="
                        relative
                        mx-auto
                        flex
                        h-36
                        w-36
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
                          h-[116px]
                          w-[116px]
                          flex-col
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/[0.055]
                          bg-[#080d18]
                        "
                      >
                        <span
                          className="
                            text-[32px]
                            font-semibold
                            tracking-[-0.05em]
                            text-white
                          "
                        >
                          {clampScore(
                            activeFinding
                              .confidence
                          )}
                        </span>

                        <span
                          className="
                            mt-0.5
                            text-[12px]
                            font-medium
                            text-zinc-400
                          "
                        >
                          / 100
                        </span>
                      </div>
                    </div>


                    <p
                      className="
                        mt-4
                        text-center
                        text-[13px]
                        font-semibold
                        text-zinc-200
                      "
                    >
                      {text.relevance}
                    </p>


                    <p
                      className="
                        mt-1
                        text-center
                        text-[12px]
                        leading-5
                        text-zinc-400
                      "
                    >
                      {getEvidenceSourceCountLabel(
                        activeFinding
                          .evidence_sources_count,
                        language
                      )}
                    </p>
                  </div>
                </div>
              </section>
            )}


            {/* SECONDARY FINDINGS + NEXT STEPS */}

            <div
              className="
                mt-6
                grid
                gap-6
                xl:grid-cols-[minmax(0,1fr)_390px]
                xl:items-start
              "
            >
              <div
                className="
                  space-y-6
                "
              >
                {otherFindings.length >
                  0 && (
                  <section
                    className="
                      ad-surface
                      rounded-[28px]
                      p-6
                    "
                  >
                    <div
                      className="
                        flex
                        items-end
                        justify-between
                        gap-4
                      "
                    >
                      <div>
                        <p
                          className="
                            text-[12px]
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-blue-200/65
                          "
                        >
                          {
                            text.otherCauses
                          }
                        </p>

                        <p
                          className="
                            mt-2
                            text-[14px]
                            text-zinc-400
                          "
                        >
                          {
                            otherFindings.length
                          }{" "}
                          {language === "ro"
                            ? "ipoteze suplimentare"
                            : "additional hypotheses"}
                        </p>
                      </div>
                    </div>


                    <div
                      className="
                        mt-5
                        space-y-3
                      "
                    >
                      {otherFindings.map(
                        (
                          {
                            finding,
                            index:
                              findingIndex,
                          }
                        ) => (
                          <article
                            key={`${finding.probable_cause}-${findingIndex}`}
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              selectDisplayedFinding(
                                findingIndex
                              )
                            }
                            onKeyDown={(
                              event
                            ) => {
                              if (
                                event.key ===
                                  "Enter" ||
                                event.key ===
                                  " "
                              ) {
                                event.preventDefault();

                                selectDisplayedFinding(
                                  findingIndex
                                );
                              }
                            }}
                            className="
                              group
                              cursor-pointer
                              rounded-[20px]
                              border
                              border-white/[0.055]
                              bg-white/[0.014]
                              p-5
                              transition-all
                              duration-200
                              hover:border-blue-400/20
                              hover:bg-blue-500/[0.035]
                              focus:outline-none
                              focus:ring-2
                              focus:ring-blue-400/20
                            "
                          >
                            <div
                              className="
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-start
                                sm:justify-between
                              "
                            >
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
                                    gap-3
                                  "
                                >
                                  <span
                                    className="
                                      flex
                                      h-8
                                      w-8
                                      shrink-0
                                      items-center
                                      justify-center
                                      rounded-xl
                                      border
                                      border-white/[0.06]
                                      bg-white/[0.025]
                                      text-[12px]
                                      font-semibold
                                      text-zinc-300
                                    "
                                  >
                                    {
                                      findingIndex +
                                      1
                                    }
                                  </span>

                                  <h3
                                    className="
                                      text-[16px]
                                      font-semibold
                                      text-zinc-100
                                    "
                                  >
                                    {
                                      finding
                                        .probable_cause
                                    }
                                  </h3>
                                </div>


                                <div
                                  className="
                                    mt-4
                                    h-1.5
                                    overflow-hidden
                                    rounded-full
                                    bg-white/[0.05]
                                  "
                                >
                                  <div
                                    className="
                                      h-full
                                      rounded-full
                                      bg-blue-400
                                    "
                                    style={{
                                      width:
                                        `${clampScore(
                                          finding
                                            .confidence
                                        )}%`,
                                    }}
                                  />
                                </div>


                                <div
                                  className="
                                    mt-3
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-x-4
                                    gap-y-2
                                    text-[13px]
                                    text-zinc-400
                                  "
                                >
                                  <span
                                    className="
                                      font-semibold
                                      text-zinc-200
                                    "
                                  >
                                    {clampScore(
                                      finding
                                        .confidence
                                    )}
                                    /100
                                  </span>

                                  <span>
                                    {getEvidenceStrengthLabel(
                                      finding
                                        .evidence_strength,
                                      language
                                    )}
                                  </span>

                                  <span>
                                    {getUrgencyLabel(
                                      finding
                                        .urgency,
                                      language
                                    )}
                                  </span>
                                </div>
                              </div>


                              <div
                                className="
                                  flex
                                  shrink-0
                                  items-center
                                  gap-2
                                  rounded-xl
                                  border
                                  border-blue-400/10
                                  bg-blue-500/[0.035]
                                  px-4
                                  py-2.5
                                  text-[13px]
                                  font-semibold
                                  text-blue-100/80
                                  transition
                                  group-hover:border-blue-400/20
                                  group-hover:bg-blue-500/[0.07]
                                  group-hover:text-white
                                "
                              >
                                <span>
                                  {language === "ro"
                                    ? "Afișează"
                                    : "Show"}
                                </span>

                                <span
                                  className="
                                    transition-transform
                                    duration-200
                                    group-hover:translate-x-0.5
                                  "
                                >
                                  →
                                </span>
                              </div>
                            </div>
                          </article>
                        )
                      )}
                    </div>
                  </section>
                )}


                {!activeFinding && (
                  <section
                    className="
                      ad-surface
                      rounded-[28px]
                      p-7
                    "
                  >
                    <p
                      className="
                        text-[16px]
                        leading-7
                        text-zinc-300
                      "
                    >
                      {text.noFindings}
                    </p>
                  </section>
                )}


                {/* DISCLAIMER */}

                <section
                  className="
                    rounded-[22px]
                    border
                    border-white/[0.06]
                    bg-white/[0.014]
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <span
                      className="
                        mt-1
                        h-2
                        w-2
                        shrink-0
                        rounded-full
                        bg-zinc-400
                      "
                    />

                    <div>
                      <p
                        className="
                          text-[14px]
                          font-semibold
                          text-zinc-200
                        "
                      >
                        {
                          text.diagnosticNotice
                        }
                      </p>

                      <p
                        className="
                          mt-2
                          text-[13px]
                          leading-6
                          text-zinc-400
                        "
                      >
                        {
                          text.disclaimer
                        }
                      </p>
                    </div>
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
                {/* NEXT STEPS */}

                <section
                  className="
                    ad-surface
                    rounded-[28px]
                    p-6
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[12px]
                          font-semibold
                          uppercase
                          tracking-[0.16em]
                          text-violet-200/70
                        "
                      >
                        {text.next}
                      </p>

                      <p
                        className="
                          mt-2
                          text-[13px]
                          leading-6
                          text-zinc-400
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
                          text-[12px]
                          font-semibold
                          text-violet-200
                          transition
                          hover:text-white
                        "
                      >
                        {text.seeAll}
                      </button>
                    )}
                  </div>


                  {visibleSteps.length >
                  0 ? (
                    <div
                      className="
                        relative
                        mt-5
                        space-y-3
                      "
                    >
                      {visibleSteps.map(
                        (
                          step,
                          index
                        ) => (
                          <div
                            key={
                              step.id
                            }
                            className="
                              relative
                              flex
                              gap-3
                            "
                          >
                            <div
                              className="
                                flex
                                w-8
                                shrink-0
                                flex-col
                                items-center
                              "
                            >
                              <span
                                className="
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  rounded-full
                                  border
                                  border-violet-300/15
                                  bg-violet-300/[0.06]
                                  text-[12px]
                                  font-semibold
                                  text-violet-100
                                "
                              >
                                {
                                  step.priority
                                }
                              </span>

                              {index !==
                                visibleSteps.length -
                                  1 && (
                                <span
                                  className="
                                    mt-2
                                    h-full
                                    w-px
                                    bg-gradient-to-b
                                    from-violet-300/15
                                    to-transparent
                                  "
                                />
                              )}
                            </div>


                            <div
                              className="
                                min-w-0
                                flex-1
                                rounded-xl
                                border
                                border-white/[0.05]
                                bg-white/[0.012]
                                px-3.5
                                py-3
                              "
                            >
                              <p
                                className="
                                  text-[14px]
                                  font-semibold
                                  text-zinc-100
                                "
                              >
                                {
                                  step.title
                                }
                              </p>

                              <p
                                className="
                                  mt-1.5
                                  text-[13px]
                                  leading-6
                                  text-zinc-400
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
                  ) : (
                    <p
                      className="
                        mt-5
                        text-[13px]
                        leading-6
                        text-zinc-400
                      "
                    >
                      {language === "ro"
                        ? "Nu sunt necesari pași suplimentari definiți pentru acest rezultat."
                        : "No additional diagnostic steps are defined for this result."}
                    </p>
                  )}
                </section>


                {/* SIGNAL SUMMARY */}

                <section
                  className="
                    ad-surface
                    rounded-[28px]
                    p-6
                  "
                >
                  <p
                    className="
                      text-[12px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-blue-200/65
                    "
                  >
                    {text.caseSnapshot}
                  </p>


                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    {[
                      {
                        label:
                          text.symptoms,
                        value:
                          diagnosticCase
                            .symptoms
                            .length,
                      },
                      {
                        label:
                          text.dtc,
                        value:
                          diagnosticCase
                            .dtc_codes
                            .length,
                      },
                      {
                        label:
                          text.answers,
                        value:
                          diagnosticCase
                            .adaptive_answers
                            .length,
                      },
                      {
                        label:
                          text.sourceCount,
                        value:
                          strongestEvidence,
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
                            rounded-xl
                            border
                            border-white/[0.05]
                            bg-white/[0.014]
                            p-3.5
                          "
                        >
                          <p
                            className="
                              text-xl
                              font-semibold
                              text-white
                            "
                          >
                            {
                              item.value
                            }
                          </p>

                          <p
                            className="
                              mt-1
                              text-[12px]
                              leading-5
                              text-zinc-400
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
                </section>


                {/* ACTIONS */}

                <section
                  className="
                    rounded-[28px]
                    border
                    border-blue-400/15
                    bg-[#08101e]
                    p-5
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
                      min-h-12
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      bg-blue-500
                      px-4
                      text-[14px]
                      font-semibold
                      text-white
                      transition
                      hover:bg-blue-400
                    "
                  >
                    <span>
                      {text.report}
                    </span>

                    <span>
                      →
                    </span>
                  </button>


                  <div
                    className="
                      mt-2
                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          "/diagnosis/history"
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-white/[0.07]
                        bg-white/[0.02]
                        px-3
                        py-3
                        text-[13px]
                        font-semibold
                        text-zinc-300
                        transition
                        hover:bg-white/[0.04]
                        hover:text-white
                      "
                    >
                      {text.history}
                    </button>


                    <button
                      type="button"
                      onClick={
                        handleNewDiagnosis
                      }
                      className="
                        rounded-xl
                        border
                        border-white/[0.07]
                        bg-white/[0.02]
                        px-3
                        py-3
                        text-[13px]
                        font-semibold
                        text-zinc-300
                        transition
                        hover:bg-white/[0.04]
                        hover:text-white
                      "
                    >
                      {
                        text.newDiagnosis
                      }
                    </button>
                  </div>
                </section>
              </aside>
            </div>
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
                mb-5
                flex
                flex-wrap
                gap-2
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
                      rounded-xl
                      border
                      px-3.5
                      py-2
                      text-[13px]
                      font-semibold
                      transition
                      ${
                        findingDetailMode ===
                        mode
                          ? "border-blue-400/20 bg-blue-500/[0.08] text-blue-100"
                          : "border-white/[0.07] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.04]"
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
                    space-y-2.5
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
                            items-start
                            justify-between
                            gap-4
                            rounded-xl
                            border
                            border-white/[0.055]
                            bg-white/[0.018]
                            px-4
                            py-3.5
                          "
                        >
                          <div>
                            <p
                              className="
                                text-[14px]
                                font-medium
                                text-zinc-200
                              "
                            >
                              {
                                evidence.label
                              }
                            </p>

                            <p
                              className="
                                mt-1
                                text-[12px]
                                text-zinc-400
                              "
                            >
                              {getEvidenceSourceLabel(
                                evidence.source,
                                language
                              )}
                            </p>
                          </div>


                          <span
                            className="
                              shrink-0
                              text-[14px]
                              font-semibold
                              text-blue-200
                            "
                          >
                            +
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
                    mt-5
                    rounded-2xl
                    border
                    border-blue-400/12
                    bg-blue-500/[0.04]
                    p-4
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
                    <span
                      className="
                        text-[14px]
                        text-zinc-300
                      "
                    >
                      {text.rawScore}
                    </span>

                    <span
                      className="
                        text-lg
                        font-semibold
                        text-white
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
                      mt-3
                      flex
                      items-center
                      justify-between
                      gap-4
                      border-t
                      border-white/[0.05]
                      pt-3
                    "
                  >
                    <span
                      className="
                        text-[14px]
                        font-semibold
                        text-zinc-100
                      "
                    >
                      {text.finalScore}
                    </span>

                    <span
                      className="
                        text-xl
                        font-semibold
                        text-blue-200
                      "
                    >
                      {clampScore(
                        selectedFinding
                          .confidence
                      )}
                      /100
                    </span>
                  </div>


                  {selectedFinding
                    .raw_score >
                    100 && (
                    <p
                      className="
                        mt-3
                        text-[12px]
                        leading-5
                        text-zinc-400
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
                    mt-4
                    text-[13px]
                    leading-6
                    text-zinc-400
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
                  space-y-2.5
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
                          gap-3
                          rounded-xl
                          border
                          border-white/[0.055]
                          bg-white/[0.018]
                          px-4
                          py-3.5
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
                            border-blue-400/15
                            bg-blue-500/[0.05]
                            text-[12px]
                            font-semibold
                            text-blue-200
                          "
                        >
                          {index +
                            1}
                        </span>

                        <p
                          className="
                            pt-0.5
                            text-[14px]
                            leading-6
                            text-zinc-300
                          "
                        >
                          {check}
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
                      rounded-2xl
                      border
                      border-blue-400/12
                      bg-blue-500/[0.035]
                      p-4
                    "
                  >
                    <p
                      className="
                        text-[12px]
                        font-semibold
                        uppercase
                        tracking-[0.13em]
                        text-blue-200/65
                      "
                    >
                      {text.rule}
                    </p>

                    <p
                      className="
                        mt-2
                        font-mono
                        text-[13px]
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
                      mt-3
                      space-y-2.5
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
                              rounded-xl
                              border
                              border-white/[0.055]
                              bg-white/[0.018]
                              p-4
                            "
                          >
                            <div
                              className="
                                flex
                                flex-wrap
                                items-start
                                justify-between
                                gap-3
                              "
                            >
                              <p
                                className="
                                  text-[14px]
                                  font-semibold
                                  text-zinc-200
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
                                    rounded-full
                                    border
                                    border-emerald-400/15
                                    bg-emerald-400/[0.05]
                                    px-2.5
                                    py-1
                                    text-[11px]
                                    font-semibold
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
                                mt-2
                                font-mono
                                text-[12px]
                                text-cyan-200/80
                              "
                            >
                              {
                                reference.identifier
                              }
                            </p>


                            {reference.note && (
                              <p
                                className="
                                  mt-2
                                  whitespace-pre-line
                                  text-[13px]
                                  leading-6
                                  text-zinc-400
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
                      mt-3
                      text-[14px]
                      leading-6
                      text-zinc-400
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


      {/* WARNINGS MODAL */}

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
            space-y-2.5
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
                  rounded-xl
                  border
                  border-amber-400/15
                  bg-amber-400/[0.045]
                  px-4
                  py-3.5
                "
              >
                <p
                  className="
                    text-[14px]
                    leading-6
                    text-amber-100
                  "
                >
                  {
                    warning.message
                  }
                </p>
              </div>
            )
          )}
        </div>


        <button
          type="button"
          onClick={() => {
            setShowWarnings(
              false
            );

            router.push(
              "/diagnosis/vehicle"
            );
          }}
          className="
            mt-5
            rounded-xl
            border
            border-amber-400/20
            bg-amber-400/[0.06]
            px-4
            py-2.5
            text-[13px]
            font-semibold
            text-amber-100
            transition
            hover:bg-amber-400/[0.10]
          "
        >
          {language === "ro"
            ? "Verifică datele vehiculului"
            : "Review vehicle data"}
        </button>
      </Modal>


      {/* ALL STEPS MODAL */}

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
            space-y-3
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
                  rounded-xl
                  border
                  border-white/[0.055]
                  bg-white/[0.018]
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-violet-400/15
                      bg-violet-400/[0.06]
                      text-[12px]
                      font-semibold
                      text-violet-100
                    "
                  >
                    {
                      step.priority
                    }
                  </span>


                  <div>
                    <p
                      className="
                        text-[14px]
                        font-semibold
                        text-zinc-100
                      "
                    >
                      {step.title}
                    </p>

                    <p
                      className="
                        mt-2
                        text-[14px]
                        leading-6
                        text-zinc-300
                      "
                    >
                      {step.action}
                    </p>

                    <p
                      className="
                        mt-2
                        text-[13px]
                        leading-6
                        text-zinc-400
                      "
                    >
                      {step.reason}
                    </p>

                    {step.related_cause && (
                      <p
                        className="
                          mt-2
                          text-[12px]
                          text-violet-200/75
                        "
                      >
                        {language === "ro"
                          ? "Legat de: "
                          : "Related to: "}
                        {
                          step.related_cause
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </Modal>


      {/* CASE DATA MODAL */}

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
        <div>
          <div
            className="
              grid
              grid-cols-3
              gap-2
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
                    rounded-xl
                    border
                    border-white/[0.055]
                    bg-white/[0.018]
                    p-3
                    text-center
                  "
                >
                  <p
                    className="
                      text-xl
                      font-semibold
                      text-white
                    "
                  >
                    {item.value}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[12px]
                      leading-5
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
              mt-4
              rounded-xl
              border
              border-white/[0.055]
              bg-white/[0.018]
              p-4
            "
          >
            <p
              className="
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-zinc-400
              "
            >
              {text.symptoms}
            </p>

            <div
              className="
                mt-3
                space-y-2
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
                        gap-3
                        rounded-lg
                        bg-black/15
                        px-3
                        py-2.5
                      "
                    >
                      <span
                        className="
                          text-[12px]
                          font-semibold
                          text-blue-200
                        "
                      >
                        {index +
                          1}
                      </span>

                      <p
                        className="
                          text-[13px]
                          leading-6
                          text-zinc-300
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
              mt-3
              rounded-xl
              border
              border-white/[0.055]
              bg-white/[0.018]
              p-4
            "
          >
            <p
              className="
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-zinc-400
              "
            >
              {text.dtc}
            </p>

            <div
              className="
                mt-3
                flex
                flex-wrap
                gap-2
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
                          rounded-lg
                          border
                          border-cyan-300/15
                          bg-cyan-300/[0.05]
                          px-2.5
                          py-1.5
                          font-mono
                          text-[12px]
                          font-semibold
                          text-cyan-100
                        "
                      >
                        {code}
                      </span>
                    )
                  )
              ) : (
                <span
                  className="
                    text-[13px]
                    text-zinc-400
                  "
                >
                  {text.none}
                </span>
              )}
            </div>
          </div>
        </div>
      </Modal>

    </main>
  );
}
