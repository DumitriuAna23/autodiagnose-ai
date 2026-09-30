"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  motion,
} from "motion/react";

import DiagnosticInsights from "@/components/ui/DiagnosticInsight";

import {
  clearDiagnosticDraft,
} from "@/lib/diagnosis";

import {
  getCurrentGuest,
  getCurrentUser,
  getDiagnosticCases,
  type DiagnosticCaseRecord,
  type User,
} from "@/lib/api";


type Language =
  | "ro"
  | "en";


type SessionType =
  | "loading"
  | "user"
  | "guest";


type VehicleInfo = {
  manufacturer: string;
  model: string;
  year: string;
};


function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="
        h-4
        w-4
      "
    >
      <path
        d="M5 12h13M13 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function ChevronIcon({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`
        h-4
        w-4
        transition-transform
        duration-200

        ${
          open
            ? "rotate-180"
            : ""
        }
      `}
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function CompactVehicleScanner({
  language,
}: {
  language: Language;
}) {
  const [
    scanProgress,
    setScanProgress,
  ] = useState(38);


  useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          setScanProgress(
            (
              current
            ) =>
              current >= 96
                ? 24
                : current + 1
          );
        },
        110
      );


    return () =>
      window.clearInterval(
        timer
      );
  }, []);


  const text =
    language === "ro"
      ? {
          title:
            "Scanare vehicul",

          scanning:
            "Scanare module",

          ready:
            "Pregătit",

          engine:
            "Motor",

          ecu:
            "ECU",

          battery:
            "Baterie",

          dtc:
            "DTC",

          active:
            "Activ",

          online:
            "Online",

          voltage:
            "12.4 V",

          codes:
            "3 coduri",
        }
      : {
          title:
            "Vehicle scan",

          scanning:
            "Scanning modules",

          ready:
            "Ready",

          engine:
            "Engine",

          ecu:
            "ECU",

          battery:
            "Battery",

          dtc:
            "DTC",

          active:
            "Active",

          online:
            "Online",

          voltage:
            "12.4 V",

          codes:
            "3 codes",
        };


  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-cyan-300/[0.09]
        bg-[#040914]
        shadow-[0_18px_50px_rgba(0,0,0,0.25)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_55%_52%,rgba(0,128,255,0.13),transparent_42%)]
        "
      />


      {/* HEADER */}

      <div
        className="
          relative
          z-20
          flex
          items-center
          justify-between
          border-b
          border-cyan-300/[0.07]
          px-3.5
          py-3
        "
      >
        <div>
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-cyan-300
                shadow-[0_0_8px_rgba(34,211,238,0.5)]
              "
            />

            <p
              className="
                text-[12px]
                font-semibold
                text-white
              "
            >
              {text.title}
            </p>
          </div>

          <p
            className="
              mt-1
              text-[9px]
              text-zinc-600
            "
          >
            {text.scanning}
          </p>
        </div>


        <div
          className="
            flex
            items-center
            gap-1.5
            rounded-full
            border
            border-emerald-400/10
            bg-emerald-400/[0.04]
            px-2
            py-1
          "
        >
          <span
            className="
              h-1
              w-1
              rounded-full
              bg-emerald-400
            "
          />

          <span
            className="
              text-[8px]
              font-semibold
              text-emerald-300/80
            "
          >
            {text.ready}
          </span>
        </div>
      </div>


      {/* SCANNER */}

      <div
        className="
          relative
          h-[175px]
          overflow-hidden
        "
      >
        <motion.div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[62%]
            h-[65px]
            w-[72%]
            -translate-x-1/2
            -translate-y-1/2
            rounded-[50%]
            border
            border-cyan-300/20
          "
          animate={{
            scale: [
              0.94,
              1.03,
              0.94,
            ],

            opacity: [
              0.35,
              0.8,
              0.35,
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />


        <motion.div
          className="
            absolute
            inset-x-[7%]
            top-[4px]
            z-10
            flex
            h-[135px]
            items-center
            justify-center
          "
          animate={{
            y: [
              0,
              -2,
              0,
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img
            src="/ui/vehicle-scan-xray.png"
            alt="Vehicle diagnostic scan"
            draggable={false}
            className="
              h-full
              w-full
              object-contain
              drop-shadow-[0_0_14px_rgba(0,145,255,0.27)]
            "
          />
        </motion.div>


        <motion.div
          className="
            pointer-events-none
            absolute
            left-[7%]
            right-[7%]
            top-[20px]
            z-30
            h-px
            bg-gradient-to-r
            from-transparent
            via-cyan-200
            to-transparent
            shadow-[0_0_12px_rgba(103,232,249,0.65)]
          "
          animate={{
            top: [
              "18%",
              "70%",
              "18%",
            ],

            opacity: [
              0,
              1,
              0,
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />


        <div
          className="
            absolute
            bottom-3
            left-3
            right-3
            z-40
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              h-1.5
              flex-1
              overflow-hidden
              rounded-full
              bg-white/[0.05]
            "
          >
            <motion.div
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-blue-500
                to-cyan-300
              "
              animate={{
                width:
                  `${scanProgress}%`,
              }}
            />
          </div>

          <span
            className="
              w-8
              text-right
              text-[9px]
              font-semibold
              text-cyan-200
            "
          >
            {scanProgress}%
          </span>
        </div>
      </div>


      {/* TELEMETRY */}

      <div
        className="
          relative
          z-20
          grid
          grid-cols-4
          border-t
          border-cyan-300/[0.06]
        "
      >
        {[
          {
            label:
              text.engine,

            value:
              text.active,
          },

          {
            label:
              text.ecu,

            value:
              text.online,
          },

          {
            label:
              text.battery,

            value:
              text.voltage,
          },

          {
            label:
              text.dtc,

            value:
              text.codes,
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
                min-w-0
                px-2
                py-2.5
                text-center

                ${
                  index !== 3
                    ? "border-r border-white/[0.045]"
                    : ""
                }
              `}
            >
              <p
                className="
                  truncate
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.09em]
                  text-zinc-600
                "
              >
                {item.label}
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-[9px]
                  font-semibold
                  text-blue-200/80
                "
              >
                {item.value}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}


export default function DashboardMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );


  const [
    sessionType,
    setSessionType,
  ] = useState<SessionType>(
    "loading"
  );


  const [
    user,
    setUser,
  ] = useState<User | null>(
    null
  );


  const [
    diagnosticCases,
    setDiagnosticCases,
  ] = useState<
    DiagnosticCaseRecord[]
  >([]);


  const [
    diagnosticsLoading,
    setDiagnosticsLoading,
  ] = useState(true);


  const [
    diagnosticsError,
    setDiagnosticsError,
  ] = useState(false);


  const [
    insightsOpen,
    setInsightsOpen,
  ] = useState(false);


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );


    if (
      savedLanguage !== "ro" &&
      savedLanguage !== "en"
    ) {
      router.replace(
        "/"
      );

      return;
    }


    setLanguage(
      savedLanguage
    );


    async function loadDiagnostics() {
      try {
        const cases =
          await getDiagnosticCases();

        setDiagnosticCases(
          cases
        );

        setDiagnosticsError(
          false
        );
      } catch {
        setDiagnosticsError(
          true
        );
      } finally {
        setDiagnosticsLoading(
          false
        );
      }
    }


    async function initializeDashboard() {
      try {
        const currentUser =
          await getCurrentUser();


        if (currentUser) {
          setUser(
            currentUser
          );

          setSessionType(
            "user"
          );

          await loadDiagnostics();

          return;
        }


        const guest =
          await getCurrentGuest();


        if (guest) {
          setSessionType(
            "guest"
          );

          await loadDiagnostics();

          return;
        }


        router.replace(
          "/welcome"
        );

      } catch {
        router.replace(
          "/welcome"
        );
      }
    }


    void initializeDashboard();


    const refreshTimer =
      window.setInterval(
        () => {
          void loadDiagnostics();
        },
        30000
      );


    function refreshOnFocus() {
      void loadDiagnostics();
    }


    window.addEventListener(
      "focus",
      refreshOnFocus
    );


    return () => {
      window.clearInterval(
        refreshTimer
      );

      window.removeEventListener(
        "focus",
        refreshOnFocus
      );
    };

  }, [router]);


  const content = {
    en: {
      heroEyebrow:
        "AUTOMOTIVE DIAGNOSTIC INTELLIGENCE",

      heroTitle:
        "From symptoms to a structured diagnostic path.",

      heroDescription:
        "Vehicle data, symptoms and DTC codes organized into one clear diagnostic workflow.",

      newDiagnosis:
        "New diagnosis",

      viewAll:
        "History",

      authenticated:
        "Account active",

      guest:
        "Guest session",

      vehicle:
        "Vehicle",

      symptoms:
        "Symptoms",

      analysis:
        "Analysis",

      diagnosticActivity:
        "Diagnostic activity",

      total:
        "Total",

      completed:
        "Completed",

      active:
        "Active",

      totalDescription:
        "All sessions",

      completedDescription:
        "Analyzed",

      activeDescription:
        "In progress",

      recent:
        "Recent diagnostics",

      noDiagnostics:
        "No diagnostics yet",

      noDiagnosticsDescription:
        "Your diagnostic activity will appear here.",

      startFirst:
        "Start diagnosis",

      loading:
        "Loading diagnostics...",

      loadError:
        "Could not load diagnostic activity.",

      unknownVehicle:
        "Unknown vehicle",

      completedStatus:
        "Completed",

      activeStatus:
        "In progress",

      insights:
        "Diagnostic insights",

      insightsDescription:
        "Patterns and information from your diagnostic activity.",

      showInsights:
        "Show insights",

      hideInsights:
        "Hide insights",
    },

    ro: {
      heroEyebrow:
        "INTELIGENȚĂ PENTRU DIAGNOSTIC AUTO",

      heroTitle:
        "De la simptome la un traseu clar de diagnostic.",

      heroDescription:
        "Datele vehiculului, simptomele și codurile DTC organizate într-un flux clar de diagnostic.",

      newDiagnosis:
        "Diagnostic nou",

      viewAll:
        "Istoric",

      authenticated:
        "Cont activ",

      guest:
        "Sesiune vizitator",

      vehicle:
        "Vehicul",

      symptoms:
        "Simptome",

      analysis:
        "Analiză",

      diagnosticActivity:
        "Activitate diagnostică",

      total:
        "Total",

      completed:
        "Finalizate",

      active:
        "Active",

      totalDescription:
        "Toate sesiunile",

      completedDescription:
        "Analizate",

      activeDescription:
        "În desfășurare",

      recent:
        "Diagnostice recente",

      noDiagnostics:
        "Nu există încă diagnostice",

      noDiagnosticsDescription:
        "Activitatea ta de diagnostic va apărea aici.",

      startFirst:
        "Începe diagnosticul",

      loading:
        "Se încarcă diagnosticele...",

      loadError:
        "Activitatea nu a putut fi încărcată.",

      unknownVehicle:
        "Vehicul necunoscut",

      completedStatus:
        "Finalizat",

      activeStatus:
        "În desfășurare",

      insights:
        "Insight-uri diagnostic",

      insightsDescription:
        "Tipare și informații din activitatea ta de diagnostic.",

      showInsights:
        "Arată insight-urile",

      hideInsights:
        "Ascunde insight-urile",
    },
  };


  const text =
    content[language];


  function asRecord(
    value: unknown
  ): Record<
    string,
    unknown
  > {
    if (
      typeof value ===
        "object" &&
      value !== null &&
      !Array.isArray(
        value
      )
    ) {
      return value as Record<
        string,
        unknown
      >;
    }

    return {};
  }


  function parsePayload(
    payload: unknown
  ): Record<
    string,
    unknown
  > {
    if (
      typeof payload ===
      "string"
    ) {
      try {
        return asRecord(
          JSON.parse(
            payload
          )
        );
      } catch {
        return {};
      }
    }

    return asRecord(
      payload
    );
  }


  function getString(
    value: unknown
  ): string | null {
    if (
      typeof value ===
        "string" &&
      value.trim() !== ""
    ) {
      return value;
    }


    if (
      typeof value ===
      "number"
    ) {
      return String(
        value
      );
    }


    return null;
  }


  function getVehicle(
    diagnosticCase:
      DiagnosticCaseRecord
  ): VehicleInfo {
    const payload =
      parsePayload(
        diagnosticCase.payload
      );


    const vehicleFromPayload =
      asRecord(
        payload.vehicle
      );


    const vehicle =
      Object.keys(
        vehicleFromPayload
      ).length > 0
        ? vehicleFromPayload
        : payload;


    return {
      manufacturer:
        getString(
          vehicle.manufacturer
        ) ??
        getString(
          vehicle.make
        ) ??
        "",

      model:
        getString(
          vehicle.model
        ) ??
        "",

      year:
        getString(
          vehicle.year
        ) ??
        "",
    };
  }


  function getVehicleName(
    diagnosticCase:
      DiagnosticCaseRecord
  ) {
    const vehicle =
      getVehicle(
        diagnosticCase
      );


    const name = [
      vehicle.manufacturer,
      vehicle.model,
    ]
      .filter(Boolean)
      .join(" ");


    return (
      name ||
      text.unknownVehicle
    );
  }


  function formatDate(
    value: string | null
  ) {
    if (!value) {
      return "—";
    }


    const date =
      new Date(
        value
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }


    return new Intl.DateTimeFormat(
      language === "ro"
        ? "ro-RO"
        : "en-US",
      {
        day:
          "numeric",

        month:
          "short",
      }
    ).format(
      date
    );
  }


  function isCompleted(
    diagnosticCase:
      DiagnosticCaseRecord
  ) {
    const reportReadyCase =
      diagnosticCase as
        DiagnosticCaseRecord & {
          analyzed_at?:
            string | null;
        };


    return (
      diagnosticCase.status ===
        "completed" ||
      Boolean(
        reportReadyCase
          .analyzed_at
      )
    );
  }


  const totalDiagnostics =
    diagnosticCases.length;


  const completedDiagnostics =
    diagnosticCases.filter(
      isCompleted
    ).length;


  const activeDiagnostics =
    totalDiagnostics -
    completedDiagnostics;


  const recentDiagnostics =
    diagnosticCases.slice(
      0,
      3
    );


  if (
    sessionType ===
    "loading"
  ) {
    return (
      <main
        className="
          min-h-[100dvh]
          bg-zinc-950
        "
      />
    );
  }


  return (
    <main
      className="
        min-h-screen
        bg-zinc-950
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
        {/* HERO */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-white/[0.065]
            bg-[#080d18]
            p-4
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-44
              w-44
              rounded-full
              bg-blue-500/[0.09]
              blur-[60px]
            "
          />


          <div
            className="
              relative
              z-10
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
                  flex
                  items-center
                  gap-2
                  overflow-hidden
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-blue-400
                    shadow-[0_0_8px_rgba(96,165,250,0.45)]
                  "
                />

                <p
                  className="
                    truncate
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-blue-200/60
                  "
                >
                  {
                    text.heroEyebrow
                  }
                </p>
              </div>


              <span
                className="
                  shrink-0
                  rounded-full
                  border
                  border-white/[0.06]
                  bg-white/[0.02]
                  px-2
                  py-1
                  text-[8px]
                  font-medium
                  text-zinc-500
                "
              >
                {sessionType ===
                  "user"
                  ? text.authenticated
                  : text.guest}
              </span>
            </div>


            <h1
              className="
                mt-4
                max-w-[340px]
                text-[25px]
                font-semibold
                leading-[1.05]
                tracking-[-0.045em]
                text-white
              "
            >
              {
                text.heroTitle
              }
            </h1>


            <p
              className="
                mt-2.5
                max-w-[350px]
                text-[11px]
                leading-[1.6]
                text-zinc-500
              "
            >
              {
                text.heroDescription
              }
            </p>


            <div
              className="
                mt-4
                flex
                items-center
                gap-1.5
                overflow-x-auto
                pb-1
                [scrollbar-width:none]
              "
            >
              {[
                text.vehicle,
                text.symptoms,
                "DTC",
                text.analysis,
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
                      flex
                      shrink-0
                      items-center
                      gap-1.5
                    "
                  >
                    <span
                      className="
                        rounded-full
                        border
                        border-white/[0.06]
                        bg-white/[0.018]
                        px-2.5
                        py-1
                        text-[8px]
                        font-medium
                        text-zinc-500
                      "
                    >
                      {item}
                    </span>

                    {index <
                      3 && (
                      <span
                        className="
                          text-[8px]
                          text-zinc-800
                        "
                      >
                        →
                      </span>
                    )}
                  </div>
                )
              )}
            </div>


            <div
              className="
                mt-4
                grid
                grid-cols-[1fr_auto]
                gap-2
              "
            >
              <button
                type="button"
                onClick={() => {
                  clearDiagnosticDraft();

                  router.push(
                    "/diagnosis/vehicles"
                  );
                }}
                className="
                  flex
                  min-h-[44px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[13px]
                  bg-blue-500
                  px-3
                  text-[11px]
                  font-semibold
                  text-white
                  shadow-[0_10px_25px_rgba(37,99,235,0.18)]
                "
              >
                {
                  text.newDiagnosis
                }

                <ArrowIcon />
              </button>


              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/diagnosis/history"
                  )
                }
                className="
                  min-h-[44px]
                  rounded-[13px]
                  border
                  border-white/[0.075]
                  bg-white/[0.02]
                  px-4
                  text-[11px]
                  font-semibold
                  text-zinc-400
                "
              >
                {text.viewAll}
              </button>
            </div>


            {sessionType ===
              "user" &&
              user?.email && (
              <p
                className="
                  mt-3
                  truncate
                  text-[8px]
                  text-zinc-700
                "
              >
                {user.email}
              </p>
            )}
          </div>
        </section>


        {/* COMPACT SCANNER */}

        <section
          className="
            mt-3
          "
        >
          <CompactVehicleScanner
            language={
              language
            }
          />
        </section>


        {/* STATS */}

        <section
          className="
            mt-4
          "
        >
          <div
            className="
              mb-2.5
              flex
              items-center
              justify-between
            "
          >
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-blue-400/60
              "
            >
              {
                text.diagnosticActivity
              }
            </p>
          </div>


          <div
            className="
              grid
              grid-cols-3
              gap-2
            "
          >
            {[
              {
                label:
                  text.total,

                value:
                  totalDiagnostics,

                description:
                  text.totalDescription,
              },

              {
                label:
                  text.completed,

                value:
                  completedDiagnostics,

                description:
                  text.completedDescription,
              },

              {
                label:
                  text.active,

                value:
                  activeDiagnostics,

                description:
                  text.activeDescription,
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
                    rounded-[17px]
                    border
                    border-blue-400/[0.10]
                    bg-[#05080e]
                    px-2.5
                    py-3
                  "
                >
                  <p
                    className="
                      truncate
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[0.08em]
                      text-blue-100/45
                    "
                  >
                    {
                      item.label
                    }
                  </p>

                  <p
                    className="
                      mt-2
                      text-[23px]
                      font-semibold
                      leading-none
                      tracking-[-0.04em]
                      text-white
                    "
                  >
                    {
                      item.value
                    }
                  </p>

                  <p
                    className="
                      mt-1.5
                      text-[8px]
                      leading-3
                      text-zinc-600
                    "
                  >
                    {
                      item.description
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </section>


        {/* RECENT */}

        <section
          className="
            mt-5
          "
        >
          <div
            className="
              mb-2.5
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <p
              className="
                text-[12px]
                font-semibold
                text-white
              "
            >
              {text.recent}
            </p>

            {totalDiagnostics >
              0 && (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/diagnosis/history"
                  )
                }
                className="
                  shrink-0
                  text-[9px]
                  font-semibold
                  text-blue-300/60
                "
              >
                {text.viewAll} →
              </button>
            )}
          </div>


          <div
            className="
              overflow-hidden
              rounded-[19px]
              border
              border-blue-400/[0.09]
              bg-[#05080e]
            "
          >
            {diagnosticsLoading && (
              <div
                className="
                  px-4
                  py-5
                  text-[11px]
                  text-zinc-600
                "
              >
                {text.loading}
              </div>
            )}


            {!diagnosticsLoading &&
              diagnosticsError && (
              <div
                className="
                  px-4
                  py-5
                  text-[11px]
                  text-red-300
                "
              >
                {text.loadError}
              </div>
            )}


            {!diagnosticsLoading &&
              !diagnosticsError &&
              recentDiagnostics.length ===
                0 && (
              <div
                className="
                  px-4
                  py-5
                "
              >
                <p
                  className="
                    text-[12px]
                    font-semibold
                    text-zinc-200
                  "
                >
                  {
                    text.noDiagnostics
                  }
                </p>

                <p
                  className="
                    mt-1.5
                    text-[10px]
                    leading-4
                    text-zinc-600
                  "
                >
                  {
                    text.noDiagnosticsDescription
                  }
                </p>

                <button
                  type="button"
                  onClick={() => {
                    clearDiagnosticDraft();

                    router.push(
                      "/diagnosis/vehicles"
                    );
                  }}
                  className="
                    mt-3
                    text-[10px]
                    font-semibold
                    text-blue-300
                  "
                >
                  {
                    text.startFirst
                  }{" "}
                  →
                </button>
              </div>
            )}


            {!diagnosticsLoading &&
              !diagnosticsError &&
              recentDiagnostics.map(
                (
                  diagnosticCase,
                  index
                ) => {
                  const vehicle =
                    getVehicle(
                      diagnosticCase
                    );

                  const completed =
                    isCompleted(
                      diagnosticCase
                    );


                  return (
                    <button
                      key={
                        diagnosticCase
                          .case_id
                      }
                      type="button"
                      onClick={() =>
                        router.push(
                          `/diagnosis/report?caseId=${diagnosticCase.case_id}`
                        )
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        gap-3
                        px-3.5
                        py-3
                        text-left

                        ${
                          index !==
                          recentDiagnostics.length -
                            1
                            ? "border-b border-blue-400/[0.06]"
                            : ""
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-[10px]
                          border
                          border-white/[0.055]
                          bg-white/[0.018]
                        "
                      >
                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full

                            ${
                              completed
                                ? "bg-emerald-400"
                                : "bg-amber-400"
                            }
                          `}
                        />
                      </div>


                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <p
                          className="
                            truncate
                            text-[11px]
                            font-semibold
                            text-zinc-200
                          "
                        >
                          {
                            getVehicleName(
                              diagnosticCase
                            )
                          }
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[9px]
                            text-zinc-600
                          "
                        >
                          {vehicle.year
                            ? `${vehicle.year} · `
                            : ""}

                          {
                            formatDate(
                              diagnosticCase
                                .created_at
                            )
                          }
                        </p>
                      </div>


                      <span
                        className={`
                          shrink-0
                          rounded-full
                          border
                          px-2
                          py-1
                          text-[7px]
                          font-semibold

                          ${
                            completed
                              ? "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-300/70"
                              : "border-amber-400/10 bg-amber-400/[0.04] text-amber-300/70"
                          }
                        `}
                      >
                        {completed
                          ? text.completedStatus
                          : text.activeStatus}
                      </span>

                      <span
                        className="
                          text-[11px]
                          text-zinc-700
                        "
                      >
                        →
                      </span>
                    </button>
                  );
                }
              )}
          </div>
        </section>


        {/* COLLAPSIBLE INSIGHTS */}

        <section
          className="
            mt-3
          "
        >
          <button
            type="button"
            onClick={() =>
              setInsightsOpen(
                (
                  current
                ) => !current
              )
            }
            className="
              flex
              w-full
              items-center
              justify-between
              gap-4
              rounded-[19px]
              border
              border-blue-400/[0.09]
              bg-[#05080e]
              px-4
              py-3.5
              text-left
            "
          >
            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-zinc-200
                "
              >
                {text.insights}
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-[9px]
                  text-zinc-600
                "
              >
                {
                  text.insightsDescription
                }
              </p>
            </div>


            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
                text-[9px]
                font-semibold
                text-blue-300/60
              "
            >
              {insightsOpen
                ? text.hideInsights
                : text.showInsights}

              <ChevronIcon
                open={
                  insightsOpen
                }
              />
            </div>
          </button>


          {insightsOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                mt-2
              "
            >
              <DiagnosticInsights
                language={
                  language
                }
                cases={
                  diagnosticCases
                }
              />
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}