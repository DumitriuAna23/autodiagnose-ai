"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import styles from "./report-print.module.css";

import {
  API_BASE_URL,
} from "@/lib/config";


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

  vehicle_context?: {
    additional_information?: string | null;
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




/*
 * Future public support address.
 * When the mailbox is created, change only this constant.
 */
const CONTACT_EMAIL =
  "support@autodiagnose.ai";


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


function formatFuel(
  value: string | null,
  language: Language
) {
  if (!value) {
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
    labels[value]?.[
      language
    ] ?? value
  );
}


function formatSeverity(
  value: string,
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
    labels[value]?.[
      language
    ] ?? value
  );
}


function formatUrgency(
  value:
    DiagnosticFinding[
      "urgency"
    ],
  language: Language
) {
  const labels = {
    monitor: {
      ro: "Monitorizare",
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
    value
  ][language];
}


function formatStrength(
  value:
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
    value !== "limited" &&
    value !== "moderate" &&
    value !== "strong"
  ) {
    return language === "ro"
      ? "Nespecificată"
      : "Not specified";
  }


  return labels[
    value
  ][language];
}


function formatGeneratedDate(
  value: Date,
  language: Language
) {
  return new Intl.DateTimeFormat(
    language === "ro"
      ? "ro-RO"
      : "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(value);
}


export default function DiagnosticReportPage() {
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
    analysis,
    setAnalysis,
  ] =
    useState<
      DiagnosticAnalysis | null
    >(null);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState(false);


  const [
    generatedAt,
    setGeneratedAt,
  ] =
    useState<Date>(
      new Date()
    );


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


    if (!savedCaseId) {
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
              method: "GET",
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
              method: "POST",
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

      otherFindings:
        "Additional hypotheses",

      findingsHint:
        "Other possible causes ranked by relevance.",

      symptoms:
        "Reported symptoms",

      dtc:
        "DTC evidence",

      noDtc:
        "No DTC codes were entered.",

      nextSteps:
        "Recommended diagnostic path",

      checks:
        "Recommended checks",

      technicalBasis:
        "Technical traceability",

      dataQuality:
        "Data quality notes",

      noWarnings:
        "No important data-quality warnings were detected.",

      context:
        "Vehicle context",

      diagnosticNotice:
        "Important diagnostic notice",

      disclaimer:
        "AutoDiagnose AI is a decision-support tool. The findings in this report are indicative and must be confirmed through physical inspection, measurements and manufacturer service information before repair decisions are made.",

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
        "Check that you are signed in and that the backend is running, then try again.",

      retry:
        "Back to analysis",

      sources:
        "evidence sources",

      symptom:
        "Symptom",

      pageNote:
        "Generated by AutoDiagnose AI · Vehicle Intelligence",

      reportStatus:
        "Analysis completed",
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

      otherFindings:
        "Ipoteze suplimentare",

      findingsHint:
        "Alte cauze posibile ordonate după relevanță.",

      symptoms:
        "Simptome raportate",

      dtc:
        "Dovezi DTC",

      noDtc:
        "Nu au fost introduse coduri DTC.",

      nextSteps:
        "Traseu recomandat de diagnostic",

      checks:
        "Verificări recomandate",

      technicalBasis:
        "Trasabilitate tehnică",

      dataQuality:
        "Observații privind datele",

      noWarnings:
        "Nu au fost detectate avertismente importante privind calitatea datelor.",

      context:
        "Context vehicul",

      diagnosticNotice:
        "Notă importantă de diagnostic",

      disclaimer:
        "AutoDiagnose AI este un instrument de suport pentru decizie. Concluziile din acest raport sunt orientative și trebuie confirmate prin inspecție fizică, măsurători și documentația de service a producătorului înainte de luarea deciziilor de reparație.",

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
        "Verifică dacă ești autentificat și dacă backend-ul este pornit, apoi încearcă din nou.",

      retry:
        "Înapoi la analiză",

      sources:
        "surse de dovezi",

      symptom:
        "Simptom",

      pageNote:
        "Generat de AutoDiagnose AI · Vehicle Intelligence",

      reportStatus:
        "Analiză finalizată",
    },
  };


  const text =
    content[language];


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
      ?.trim() ?? "";


  const primaryReferences =
    useMemo(
      () =>
        primaryFinding
          ?.technical_references ??
        [],
      [primaryFinding]
    );


  if (
    loading
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
              h-10
              w-10
              animate-pulse
              rounded-full
              border
              border-blue-400/25
              bg-blue-500/[0.08]
            "
          />

          <p
            className="
              mt-5
              text-[15px]
              text-zinc-300
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
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-red-400/15
              bg-red-400/[0.06]
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
            {text.loadError}
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
            ← {text.retry}
          </button>
        </div>
      </main>
    );
  }


  return (
    <>
      <main
        id="diagnostic-report-root"
        className={`${styles.root} 
          min-h-screen
          bg-[#060912]
          px-5
          py-8
          text-white
          sm:px-7
          lg:px-9
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
            max-w-[1120px]
            print:max-w-none
          "
        >

          {/* SCREEN ACTIONS */}

          <div
            className="
              mb-5
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
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
                hover:bg-white/[0.05]
              "
            >
              ← {text.back}
            </button>


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
                  router.push(
                    "/diagnosis/history"
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
                  hover:bg-white/[0.05]
                "
              >
                {text.history}
              </button>


              <button
                type="button"
                onClick={() =>
                  window.print()
                }
                className="
                  rounded-xl
                  bg-blue-500
                  px-4
                  py-2.5
                  text-[13px]
                  font-semibold
                  text-white
                  shadow-[0_12px_30px_rgba(37,99,235,0.20)]
                  transition
                  hover:bg-blue-400
                "
              >
                {text.print}
              </button>
            </div>
          </div>


          {/* REPORT SHEET */}

          <article
            className={`${styles.sheet}
              report-sheet
              overflow-hidden
              rounded-[28px]
              border
              border-white/[0.07]
              bg-[#080d18]
              shadow-[0_24px_70px_rgba(0,0,0,0.26)]
              print:overflow-visible
              print:rounded-none
              print:border-0
              print:bg-white
              print:shadow-none
            `}
          >

            {/* REPORT HEADER */}

            <div
              className="
                relative
                overflow-hidden
                border-b
                border-white/[0.06]
                p-6
                sm:p-8
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
                  -top-20
                  h-64
                  w-64
                  rounded-full
                  bg-blue-500/[0.12]
                  blur-[90px]
                  print:hidden
                "
              />


              <div
                className="
                  relative
                  flex
                  flex-col
                  gap-6
                  sm:flex-row
                  sm:items-start
                  sm:justify-between
                  print:flex-row
                  print:items-start
                  print:gap-4
                "
              >
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-blue-400/20
                        bg-blue-500/[0.08]
                        text-sm
                        font-bold
                        text-blue-100
                        print:h-8
                        print:w-8
                        print:rounded-md
                        print:border-slate-300
                        print:bg-slate-100
                        print:text-slate-900
                      "
                    >
                      A
                    </div>


                    <div>
                      <p
                        className="
                          text-[18px]
                          font-semibold
                          tracking-[-0.02em]
                          text-white
                          print:text-[15pt]
                          print:text-slate-950
                        "
                      >
                        AutoDiagnose AI
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[11px]
                          font-medium
                          uppercase
                          tracking-[0.16em]
                          text-blue-200/60
                          print:text-[7.5pt]
                          print:text-slate-500
                        "
                      >
                        Vehicle Intelligence
                      </p>
                    </div>
                  </div>


                  <p
                    className="
                      mt-6
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-blue-200/65
                      print:mt-[4mm]
                      print:text-[7.5pt]
                      print:text-slate-500
                    "
                  >
                    {text.report}
                  </p>


                  <h1
                    className="
                      mt-2
                      text-[2rem]
                      font-semibold
                      tracking-[-0.04em]
                      text-white
                      sm:text-[2.35rem]
                      print:mt-[1mm]
                      print:text-[20pt]
                      print:leading-tight
                      print:text-slate-950
                    "
                  >
                    {text.reportTitle}
                  </h1>


                  <p
                    className="
                      mt-2
                      text-[15px]
                      font-medium
                      text-zinc-300
                      print:mt-[1mm]
                      print:text-[10pt]
                      print:text-slate-700
                    "
                  >
                    {vehicleName}
                  </p>
                </div>


                <div
                  className="
                    grid
                    min-w-[260px]
                    gap-2
                    rounded-2xl
                    border
                    border-white/[0.06]
                    bg-black/15
                    p-4
                    print:min-w-[58mm]
                    print:gap-[1mm]
                    print:rounded-none
                    print:border-0
                    print:bg-transparent
                    print:p-0
                    print:text-right
                  "
                >
                  <p
                    className="
                      text-[12px]
                      text-zinc-400
                      print:text-[8pt]
                      print:text-slate-600
                    "
                  >
                    <span
                      className="
                        font-semibold
                        text-zinc-200
                        print:text-slate-800
                      "
                    >
                      {text.generated}:
                    </span>{" "}
                    {formatGeneratedDate(
                      generatedAt,
                      language
                    )}
                  </p>


                  <p
                    className="
                      break-all
                      font-mono
                      text-[11px]
                      text-zinc-500
                      print:text-[7pt]
                      print:text-slate-500
                    "
                  >
                    {text.caseId}:{" "}
                    {caseId}
                  </p>


                  <span
                    className="
                      mt-1
                      w-fit
                      rounded-full
                      border
                      border-emerald-400/15
                      bg-emerald-400/[0.05]
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold
                      text-emerald-200
                      sm:ml-auto
                      print:ml-auto
                      print:rounded
                      print:border-emerald-700
                      print:bg-transparent
                      print:px-2
                      print:py-0.5
                      print:text-[7pt]
                      print:text-emerald-800
                    "
                  >
                    {text.reportStatus}
                  </span>
                </div>
              </div>
            </div>


            {/* REPORT BODY */}

            <div
              className="
                space-y-5
                p-6
                sm:p-8
                print:space-y-[4mm]
                print:p-0
                print:pt-[4mm]
              "
            >

              {/* VEHICLE SNAPSHOT */}

              <section
                className={`${styles.block}
                  report-block
                  grid
                  gap-3
                  sm:grid-cols-5
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
                      diagnosticCase.vehicle.year ??
                      text.notProvided,
                  },
                  {
                    label:
                      text.fuel,
                    value:
                      formatFuel(
                        diagnosticCase.vehicle.fuel_type,
                        language
                      ),
                  },
                  {
                    label:
                      text.engine,
                    value:
                      diagnosticCase.vehicle.engine ??
                      text.notProvided,
                  },
                  {
                    label:
                      text.mileage,
                    value:
                      diagnosticCase.vehicle.mileage_km
                        ? `${diagnosticCase.vehicle.mileage_km.toLocaleString()} km`
                        : text.notProvided,
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
                        bg-white/[0.016]
                        p-4
                        print:rounded
                        print:border-slate-300
                        print:bg-white
                        print:p-[2.5mm]
                      "
                    >
                      <p
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.10em]
                          text-zinc-500
                          print:text-[6.7pt]
                          print:text-slate-500
                        "
                      >
                        {item.label}
                      </p>

                      <p
                        className="
                          mt-1.5
                          text-[14px]
                          font-semibold
                          leading-5
                          text-zinc-100
                          print:mt-[0.5mm]
                          print:text-[8.5pt]
                          print:leading-tight
                          print:text-slate-950
                        "
                      >
                        {item.value}
                      </p>
                    </div>
                  )
                )}
              </section>


              {/* PRIMARY FINDING */}

              {primaryFinding && (
                <section
                  className={`${styles.block}
                    report-block
                    rounded-[24px]
                    border
                    border-blue-400/15
                    bg-blue-500/[0.035]
                    p-5
                    sm:p-6
                    print:rounded
                    print:border-slate-400
                    print:bg-slate-50
                    print:p-[4mm]
                  `}
                >
                  <div
                    className="
                      grid
                      gap-5
                      lg:grid-cols-[minmax(0,1fr)_180px]
                      lg:items-start
                      print:grid-cols-[minmax(0,1fr)_38mm]
                      print:gap-[5mm]
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-[0.16em]
                          text-blue-200/70
                          print:text-[7pt]
                          print:text-slate-500
                        "
                      >
                        {text.executiveSummary}
                      </p>


                      <h2
                        className="
                          mt-2
                          text-[1.55rem]
                          font-semibold
                          leading-tight
                          tracking-[-0.03em]
                          text-white
                          print:mt-[1mm]
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
                          mt-3
                          text-[15px]
                          leading-7
                          text-zinc-300
                          print:mt-[2mm]
                          print:text-[8.5pt]
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
                          mt-4
                          flex
                          flex-wrap
                          gap-2
                          print:mt-[2.5mm]
                          print:gap-[1.5mm]
                        "
                      >
                        {[
                          `${text.severity}: ${formatSeverity(
                            primaryFinding.severity,
                            language
                          )}`,
                          `${text.urgency}: ${formatUrgency(
                            primaryFinding.urgency,
                            language
                          )}`,
                          `${text.evidence}: ${formatStrength(
                            primaryFinding.evidence_strength,
                            language
                          )}`,
                        ].map(
                          (label) => (
                            <span
                              key={
                                label
                              }
                              className="
                                rounded-full
                                border
                                border-white/[0.08]
                                bg-white/[0.025]
                                px-3
                                py-1.5
                                text-[12px]
                                font-semibold
                                text-zinc-200
                                print:rounded
                                print:border-slate-300
                                print:bg-white
                                print:px-[2mm]
                                print:py-[0.6mm]
                                print:text-[7pt]
                                print:text-slate-800
                              "
                            >
                              {label}
                            </span>
                          )
                        )}
                      </div>


                      {primaryFinding
                        .safety_message && (
                        <div
                          className="
                            mt-4
                            rounded-xl
                            border
                            border-amber-400/15
                            bg-amber-400/[0.05]
                            px-4
                            py-3
                            text-[14px]
                            leading-6
                            text-amber-100
                            print:mt-[2.5mm]
                            print:rounded
                            print:border-amber-500
                            print:bg-amber-50
                            print:px-[3mm]
                            print:py-[2mm]
                            print:text-[8pt]
                            print:leading-[1.3]
                            print:text-amber-950
                          "
                        >
                          <strong>
                            {text.safety}:{" "}
                          </strong>

                          {
                            primaryFinding
                              .safety_message
                          }
                        </div>
                      )}
                    </div>


                    <div
                      className="
                        rounded-2xl
                        border
                        border-white/[0.06]
                        bg-black/15
                        p-4
                        text-center
                        print:rounded
                        print:border-slate-300
                        print:bg-white
                        print:p-[3mm]
                      "
                    >
                      <p
                        className="
                          text-[38px]
                          font-semibold
                          tracking-[-0.05em]
                          text-blue-200
                          print:text-[23pt]
                          print:text-slate-950
                        "
                      >
                        {clampScore(
                          primaryFinding
                            .confidence
                        )}
                      </p>

                      <p
                        className="
                          -mt-1
                          text-[12px]
                          text-zinc-500
                          print:text-[7pt]
                          print:text-slate-500
                        "
                      >
                        / 100
                      </p>

                      <div
                        className="
                          mt-3
                          h-1.5
                          overflow-hidden
                          rounded-full
                          bg-white/[0.06]
                          print:mt-[2mm]
                          print:bg-slate-200
                        "
                      >
                        <div
                          className="
                            h-full
                            rounded-full
                            bg-blue-400
                            print:bg-slate-700
                          "
                          style={{
                            width:
                              `${clampScore(
                                primaryFinding
                                  .confidence
                              )}%`,
                          }}
                        />
                      </div>

                      <p
                        className="
                          mt-3
                          text-[12px]
                          font-semibold
                          text-zinc-200
                          print:mt-[1.5mm]
                          print:text-[7.5pt]
                          print:text-slate-800
                        "
                      >
                        {text.relevance}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[11px]
                          text-zinc-500
                          print:text-[6.8pt]
                          print:text-slate-500
                        "
                      >
                        {
                          primaryFinding
                            .evidence_sources_count ??
                          0
                        }{" "}
                        {text.sources}
                      </p>
                    </div>
                  </div>
                </section>
              )}


              {/* COMPACT TWO-COLUMN CONTENT */}

              <div
                className="
                  grid
                  gap-5
                  lg:grid-cols-2
                  print:grid-cols-2
                  print:gap-[4mm]
                "
              >

                {/* SYMPTOMS + DTC */}

                <section
                  className={`${styles.block}
                    report-block
                    rounded-[22px]
                    border
                    border-white/[0.06]
                    bg-white/[0.014]
                    p-5
                    print:rounded
                    print:border-slate-300
                    print:bg-white
                    print:p-[3.5mm]
                  `}
                >
                  <h3
                    className="
                      text-[15px]
                      font-semibold
                      text-white
                      print:text-[10pt]
                      print:text-slate-950
                    "
                  >
                    {text.symptoms}
                  </h3>


                  <div
                    className="
                      mt-3
                      space-y-2
                      print:mt-[2mm]
                      print:space-y-[1.5mm]
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
                              rounded-xl
                              border
                              border-white/[0.045]
                              bg-black/10
                              px-3
                              py-2.5
                              print:rounded
                              print:border-slate-200
                              print:bg-white
                              print:px-[2.5mm]
                              print:py-[1.5mm]
                            "
                          >
                            <span
                              className="
                                text-[12px]
                                font-semibold
                                text-blue-200
                                print:text-[7.5pt]
                                print:text-slate-500
                              "
                            >
                              {index +
                                1}.
                            </span>

                            <p
                              className="
                                text-[13px]
                                leading-5
                                text-zinc-300
                                print:text-[8pt]
                                print:leading-[1.25]
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
                      mt-4
                      border-t
                      border-white/[0.05]
                      pt-4
                      print:mt-[2.5mm]
                      print:border-slate-300
                      print:pt-[2.5mm]
                    "
                  >
                    <p
                      className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-zinc-500
                        print:text-[7pt]
                        print:text-slate-500
                      "
                    >
                      {text.dtc}
                    </p>


                    {diagnosticCase
                      .dtc_codes
                      .length >
                    0 ? (
                      <div
                        className="
                          mt-2
                          flex
                          flex-wrap
                          gap-2
                          print:mt-[1.5mm]
                          print:gap-[1mm]
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
                                  rounded-lg
                                  border
                                  border-cyan-300/15
                                  bg-cyan-300/[0.045]
                                  px-2.5
                                  py-1.5
                                  font-mono
                                  text-[12px]
                                  font-semibold
                                  text-cyan-100
                                  print:rounded
                                  print:border-slate-300
                                  print:bg-slate-50
                                  print:px-[2mm]
                                  print:py-[0.7mm]
                                  print:text-[7.5pt]
                                  print:text-slate-900
                                "
                              >
                                {code}
                              </span>
                            )
                          )}
                      </div>
                    ) : (
                      <p
                        className="
                          mt-2
                          text-[13px]
                          text-zinc-400
                          print:text-[8pt]
                          print:text-slate-600
                        "
                      >
                        {text.noDtc}
                      </p>
                    )}
                  </div>
                </section>


                {/* NEXT STEPS */}

                <section
                  className={`${styles.block}
                    report-block
                    rounded-[22px]
                    border
                    border-white/[0.06]
                    bg-white/[0.014]
                    p-5
                    print:rounded
                    print:border-slate-300
                    print:bg-white
                    print:p-[3.5mm]
                  `}
                >
                  <h3
                    className="
                      text-[15px]
                      font-semibold
                      text-white
                      print:text-[10pt]
                      print:text-slate-950
                    "
                  >
                    {text.nextSteps}
                  </h3>


                  <div
                    className="
                      mt-3
                      space-y-2.5
                      print:mt-[2mm]
                      print:space-y-[1.5mm]
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
                              gap-3
                              rounded-xl
                              border
                              border-white/[0.045]
                              bg-black/10
                              px-3
                              py-3
                              print:rounded
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
                                border-violet-300/15
                                bg-violet-300/[0.06]
                                text-[11px]
                                font-semibold
                                text-violet-100
                                print:h-5
                                print:w-5
                                print:border-slate-400
                                print:bg-white
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
                                  text-[13px]
                                  font-semibold
                                  text-zinc-100
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
                                  mt-1
                                  text-[12px]
                                  leading-5
                                  text-zinc-400
                                  print:mt-[0.5mm]
                                  print:text-[7.5pt]
                                  print:leading-[1.25]
                                  print:text-slate-700
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
              </div>


              {/* RECOMMENDED CHECKS */}

              {primaryFinding &&
                primaryFinding
                  .recommended_checks
                  .length >
                  0 && (
                <section
                  className={`${styles.block}
                    report-block
                    rounded-[22px]
                    border
                    border-white/[0.06]
                    bg-white/[0.014]
                    p-5
                    print:rounded
                    print:border-slate-300
                    print:bg-white
                    print:p-[3.5mm]
                  `}
                >
                  <h3
                    className="
                      text-[15px]
                      font-semibold
                      text-white
                      print:text-[10pt]
                      print:text-slate-950
                    "
                  >
                    {text.checks}
                  </h3>


                  <div
                    className="
                      mt-3
                      grid
                      gap-2
                      sm:grid-cols-2
                      print:mt-[2mm]
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
                              gap-3
                              rounded-xl
                              border
                              border-white/[0.045]
                              bg-black/10
                              px-3
                              py-2.5
                              print:rounded
                              print:border-slate-200
                              print:bg-white
                              print:px-[2.5mm]
                              print:py-[1.5mm]
                            "
                          >
                            <span
                              className="
                                text-[12px]
                                font-semibold
                                text-blue-200
                                print:text-[7.5pt]
                                print:text-slate-500
                              "
                            >
                              {index +
                                1}.
                            </span>

                            <p
                              className="
                                text-[13px]
                                leading-5
                                text-zinc-300
                                print:text-[8pt]
                                print:leading-[1.25]
                                print:text-slate-800
                              "
                            >
                              {check}
                            </p>
                          </div>
                        )
                      )}
                  </div>
                </section>
              )}


              {/* SECONDARY FINDINGS */}

              {secondaryFindings.length >
                0 && (
                <section
                  className={`${styles.block}
                    report-block
                    rounded-[22px]
                    border
                    border-white/[0.06]
                    bg-white/[0.014]
                    p-5
                    print:rounded
                    print:border-slate-300
                    print:bg-white
                    print:p-[3.5mm]
                  `}
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
                      <h3
                        className="
                          text-[15px]
                          font-semibold
                          text-white
                          print:text-[10pt]
                          print:text-slate-950
                        "
                      >
                        {
                          text.otherFindings
                        }
                      </h3>

                      <p
                        className="
                          mt-1
                          text-[12px]
                          text-zinc-400
                          print:text-[7.5pt]
                          print:text-slate-600
                        "
                      >
                        {
                          text.findingsHint
                        }
                      </p>
                    </div>
                  </div>


                  <div
                    className="
                      mt-3
                      overflow-hidden
                      rounded-xl
                      border
                      border-white/[0.05]
                      print:mt-[2mm]
                      print:rounded
                      print:border-slate-300
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
                            gap-2
                            border-b
                            border-white/[0.045]
                            px-4
                            py-3
                            last:border-b-0
                            sm:grid-cols-[36px_minmax(0,1fr)_80px_100px]
                            sm:items-center
                            print:grid-cols-[8mm_minmax(0,1fr)_18mm_24mm]
                            print:gap-[2mm]
                            print:border-slate-200
                            print:px-[2.5mm]
                            print:py-[1.5mm]
                          "
                        >
                          <span
                            className="
                              text-[12px]
                              font-semibold
                              text-zinc-500
                              print:text-[7pt]
                              print:text-slate-500
                            "
                          >
                            #{index +
                              2}
                          </span>


                          <p
                            className="
                              text-[13px]
                              font-semibold
                              text-zinc-100
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
                              text-[12px]
                              font-semibold
                              text-blue-200
                              print:text-[7.5pt]
                              print:text-slate-800
                            "
                          >
                            {clampScore(
                              finding
                                .confidence
                            )}
                            /100
                          </p>


                          <p
                            className="
                              text-[12px]
                              text-zinc-400
                              print:text-[7.5pt]
                              print:text-slate-600
                            "
                          >
                            {formatStrength(
                              finding
                                .evidence_strength,
                              language
                            )}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}


              {/* CONTEXT / DATA QUALITY / TECHNICAL */}

              {(vehicleContext ||
                warnings.length >
                  0 ||
                primaryReferences.length >
                  0) && (
                <div
                  className="
                    grid
                    gap-5
                    lg:grid-cols-2
                    print:grid-cols-2
                    print:gap-[4mm]
                  "
                >
                  {(vehicleContext ||
                    warnings.length >
                      0) && (
                    <section
                      className="
                        report-block
                        rounded-[22px]
                        border
                        border-white/[0.06]
                        bg-white/[0.014]
                        p-5
                        print:rounded
                        print:border-slate-300
                        print:bg-white
                        print:p-[3.5mm]
                      "
                    >
                      {vehicleContext && (
                        <>
                          <h3
                            className="
                              text-[15px]
                              font-semibold
                              text-white
                              print:text-[10pt]
                              print:text-slate-950
                            "
                          >
                            {text.context}
                          </h3>

                          <p
                            className="
                              mt-2
                              text-[13px]
                              leading-6
                              text-zinc-300
                              print:mt-[1.5mm]
                              print:text-[8pt]
                              print:leading-[1.3]
                              print:text-slate-700
                            "
                          >
                            {vehicleContext}
                          </p>
                        </>
                      )}


                      {warnings.length >
                        0 && (
                        <div
                          className={
                            vehicleContext
                              ? "mt-4 border-t border-white/[0.05] pt-4 print:mt-[2.5mm] print:border-slate-300 print:pt-[2.5mm]"
                              : ""
                          }
                        >
                          <h3
                            className="
                              text-[14px]
                              font-semibold
                              text-white
                              print:text-[9pt]
                              print:text-slate-950
                            "
                          >
                            {
                              text.dataQuality
                            }
                          </h3>


                          <div
                            className="
                              mt-2
                              space-y-2
                              print:mt-[1.5mm]
                              print:space-y-[1mm]
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
                                    text-[12px]
                                    leading-5
                                    text-amber-100
                                    print:text-[7.5pt]
                                    print:leading-[1.25]
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
                        </div>
                      )}
                    </section>
                  )}


                  {primaryReferences.length >
                    0 && (
                    <section
                      className="
                        report-block
                        rounded-[22px]
                        border
                        border-white/[0.06]
                        bg-white/[0.014]
                        p-5
                        print:rounded
                        print:border-slate-300
                        print:bg-white
                        print:p-[3.5mm]
                      "
                    >
                      <h3
                        className="
                          text-[15px]
                          font-semibold
                          text-white
                          print:text-[10pt]
                          print:text-slate-950
                        "
                      >
                        {
                          text.technicalBasis
                        }
                      </h3>


                      <div
                        className="
                          mt-3
                          space-y-2
                          print:mt-[2mm]
                          print:space-y-[1.5mm]
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
                                  rounded-xl
                                  border
                                  border-white/[0.045]
                                  bg-black/10
                                  px-3
                                  py-2.5
                                  print:rounded
                                  print:border-slate-200
                                  print:bg-white
                                  print:px-[2.5mm]
                                  print:py-[1.5mm]
                                "
                              >
                                <p
                                  className="
                                    text-[12px]
                                    font-semibold
                                    text-zinc-200
                                    print:text-[7.8pt]
                                    print:text-slate-900
                                  "
                                >
                                  {
                                    reference.title
                                  }
                                </p>

                                <p
                                  className="
                                    mt-1
                                    font-mono
                                    text-[11px]
                                    text-cyan-200/75
                                    print:mt-[0.5mm]
                                    print:text-[7pt]
                                    print:text-slate-600
                                  "
                                >
                                  {
                                    reference.identifier
                                  }
                                </p>
                              </div>
                            )
                          )}
                      </div>
                    </section>
                  )}
                </div>
              )}


              {/* DISCLAIMER + CONTACT */}

              <section
                className={`${styles.block}
                  report-block
                  rounded-[22px]
                  border
                  border-white/[0.06]
                  bg-white/[0.012]
                  p-5
                  print:rounded
                  print:border-slate-300
                  print:bg-white
                  print:p-[3.5mm]
                  `}
              >
                <div
                  className="
                    grid
                    gap-5
                    lg:grid-cols-[minmax(0,1fr)_260px]
                    print:grid-cols-[minmax(0,1fr)_54mm]
                    print:gap-[5mm]
                  "
                >
                  <div>
                    <h3
                      className="
                        text-[14px]
                        font-semibold
                        text-zinc-100
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
                        mt-2
                        text-[12px]
                        leading-5
                        text-zinc-400
                        print:mt-[1mm]
                        print:text-[7.3pt]
                        print:leading-[1.25]
                        print:text-slate-600
                      "
                    >
                      {text.disclaimer}
                    </p>
                  </div>


                  <div
                    className="
                      rounded-xl
                      border
                      border-blue-400/10
                      bg-blue-500/[0.035]
                      px-4
                      py-3
                      print:rounded
                      print:border-slate-300
                      print:bg-slate-50
                      print:px-[3mm]
                      print:py-[2mm]
                    "
                  >
                    <p
                      className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-blue-200/70
                        print:text-[7pt]
                        print:text-slate-500
                      "
                    >
                      {text.contact}
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-[12px]
                        leading-5
                        text-zinc-400
                        print:mt-[0.7mm]
                        print:text-[7.2pt]
                        print:text-slate-600
                      "
                    >
                      {text.contactText}
                    </p>

                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="
                        mt-1
                        block
                        break-all
                        text-[13px]
                        font-semibold
                        text-blue-200
                        hover:underline
                        print:text-[7.8pt]
                        print:text-slate-900
                        print:no-underline
                      "
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
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
                  {text.pageNote}
                </span>

                <span
                  className="
                    font-mono
                  "
                >
                  {caseId}
                </span>
              </div>
            </div>
          </article>
        </div>
      </main>


    </>
  );
}
