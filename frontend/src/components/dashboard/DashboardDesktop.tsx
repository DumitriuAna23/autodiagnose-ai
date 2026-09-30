"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  clearDiagnosticDraft,
} from "@/lib/diagnosis";
import {
  useRouter,
} from "next/navigation";
import {
  motion,
} from "motion/react";
import DiagnosticInsights from "@/components/ui/DiagnosticInsight";

import {
  DiagnosticCaseRecord,
  getCurrentGuest,
  getCurrentUser,
  getDiagnosticCases,
  User,
} from "@/lib/api";


type Language = "ro" | "en";

type SessionType =
  | "loading"
  | "user"
  | "guest";


type VehicleInfo = {
  manufacturer: string;
  model: string;
  year: string;
};


function VehicleScanner({
  language,
}: {
  language: Language;
}) {
  const copy =
    language === "ro"
      ? {
          title: "Scanare vehicul",
          subtitle: "Analiză vizuală a sistemelor principale",
          status: "Sistem pregătit",
          progress: "68%",
          scanning: "Scanare module de control",
          live: "LIVE",
          powertrain: "MOTOR",
          powertrainValue: "ACTIV",
          network: "ECU",
          networkValue: "ONLINE",
          voltage: "BATERIE",
          voltageValue: "12.4 V",
          dtc: "DTC",
          dtcValue: "3 CODURI",
          moduleTitle: "Module sistem",
          engine: "ECM",
          engineState: "Scanare",
          abs: "ABS",
          absState: "OK",
          srs: "SRS",
          srsState: "Scanare",
          bcm: "BCM",
          bcmState: "OK",
          tpms: "TPMS",
          tpmsState: "Așteptare",
        }
      : {
          title: "Vehicle scan",
          subtitle: "Visual analysis of primary vehicle systems",
          status: "System ready",
          progress: "68%",
          scanning: "Scanning control modules",
          live: "LIVE",
          powertrain: "ENGINE",
          powertrainValue: "ACTIVE",
          network: "ECU",
          networkValue: "ONLINE",
          voltage: "BATTERY",
          voltageValue: "12.4 V",
          dtc: "DTC",
          dtcValue: "3 CODES",
          moduleTitle: "System modules",
          engine: "ECM",
          engineState: "Scanning",
          abs: "ABS",
          absState: "OK",
          srs: "SRS",
          srsState: "Scanning",
          bcm: "BCM",
          bcmState: "OK",
          tpms: "TPMS",
          tpmsState: "Waiting",
        };

  const [
    scanProgress,
    setScanProgress,
  ] = useState(24);


  const [
    canBusTick,
    setCanBusTick,
  ] = useState(0);

  useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          setScanProgress(
            (current) =>
              current >= 96
                ? 18
                : current + 1
          );
        },
        95
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, []);


  useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          setCanBusTick(
            (current) =>
              current + 1
          );
        },
        180
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, []);


  const moduleRows = [
    {
      name: copy.engine,
      state: copy.engineState,
      tone:
        "text-cyan-200",
      dot:
        "bg-cyan-300",
    },
    {
      name: copy.abs,
      state: copy.absState,
      tone:
        "text-emerald-300",
      dot:
        "bg-emerald-400",
    },
    {
      name: copy.srs,
      state: copy.srsState,
      tone:
        "text-cyan-200",
      dot:
        "bg-cyan-300",
    },
    {
      name: copy.bcm,
      state: copy.bcmState,
      tone:
        "text-emerald-300",
      dot:
        "bg-emerald-400",
    },
    {
      name: copy.tpms,
      state: copy.tpmsState,
      tone:
        "text-zinc-500",
      dot:
        "bg-zinc-600",
    },
  ];

  return (
    <div
      className="
        relative
        min-h-[500px]
        overflow-hidden
        rounded-[30px]
        border
        border-cyan-300/[0.10]
        bg-[#030812]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_28px_90px_rgba(0,0,0,0.32)]
      "
    >
      {/* ambient light */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_45%_44%,rgba(0,128,255,0.18),transparent_38%),radial-gradient(circle_at_72%_25%,rgba(34,211,238,0.07),transparent_24%)]
        "
      />

      {/* technical grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.18]
          [background-image:linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]
          [background-size:36px_36px]
          [mask-image:linear-gradient(to_bottom,black_5%,black_78%,transparent)]
        "
      />

      {/* top HUD */}
      <div
        className="
          relative
          z-30
          flex
          items-start
          justify-between
          gap-4
          border-b
          border-cyan-300/[0.08]
          bg-[#07101a]/80
          px-5
          py-4
          backdrop-blur-md
          sm:px-6
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
                h-9
                w-9
                items-center
                justify-center
                gap-1
                rounded-xl
                border
                border-cyan-300/10
                bg-cyan-300/[0.035]
              "
            >
              {[0, 1, 2, 3].map(
                (
                  item
                ) => (
                  <motion.span
                    key={
                      item
                    }
                    className="
                      w-1
                      rounded-full
                      bg-cyan-300
                      shadow-[0_0_8px_rgba(34,211,238,0.35)]
                    "
                    animate={{
                      height: [
                        "8px",
                        "22px",
                        "11px",
                        "17px",
                        "8px",
                      ],
                      opacity: [
                        0.45,
                        1,
                        0.65,
                        0.9,
                        0.45,
                      ],
                    }}
                    transition={{
                      duration:
                        1.05,
                      repeat:
                        Infinity,
                      ease:
                        "easeInOut",
                      delay:
                        item *
                        0.12,
                    }}
                  />
                )
              )}
            </div>

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <h3
                  className="
                    text-[16px]
                    font-semibold
                    tracking-[-0.02em]
                    text-white
                  "
                >
                  {copy.title}
                </h3>

                <span
                  className="
                    rounded-full
                    border
                    border-cyan-300/10
                    bg-cyan-300/[0.04]
                    px-2
                    py-0.5
                    font-mono
                    text-[8px]
                    font-semibold
                    tracking-[0.14em]
                    text-cyan-200/70
                  "
                >
                  {copy.live}
                </span>
              </div>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-zinc-500
                "
              >
                {copy.subtitle}
              </p>
            </div>
          </div>

          <div
            className="
              mt-4
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                h-2.5
                w-[270px]
                max-w-[48vw]
                overflow-hidden
                rounded-full
                border
                border-cyan-300/20
                bg-black/35
              "
            >
              <motion.div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-blue-500
                  via-cyan-300
                  to-blue-400
                  shadow-[0_0_16px_rgba(34,211,238,0.50)]
                "
                animate={{
                  width: `${scanProgress}%`,
                }}
                transition={{
                  duration: 0.12,
                  ease: "linear",
                }}
              />
            </div>

            <span
              className="
                text-[13px]
                font-semibold
                text-cyan-100
              "
            >
              {scanProgress}%
            </span>
          </div>

          <p
            className="
              mt-2
              text-[10px]
              font-medium
              text-blue-200/65
            "
          >
            {copy.scanning}
          </p>
        </div>

        <div
          className="
            hidden
            items-center
            gap-2
            rounded-full
            border
            border-emerald-300/10
            bg-emerald-300/[0.035]
            px-3
            py-2
            sm:flex
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-400
              shadow-[0_0_10px_rgba(52,211,153,0.55)]
            "
          />

          <span
            className="
              text-[10px]
              font-medium
              text-emerald-200/80
            "
          >
            {copy.status}
          </span>
        </div>
      </div>

      <div
        className="
          relative
          z-20
          grid
          min-h-[390px]
          lg:grid-cols-[minmax(0,1fr)_205px]
        "
      >
        {/* scan viewport */}
        <div
          className="
            relative
            min-h-[390px]
            overflow-hidden
            border-r
            border-cyan-300/[0.06]
          "
        >
          {/* holographic platform */}
          <motion.div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-[62%]
              h-[150px]
              w-[78%]
              -translate-x-1/2
              -translate-y-1/2
              rounded-[50%]
              border
              border-cyan-300/22
              shadow-[0_0_34px_rgba(34,211,238,0.12)]
            "
            animate={{
              scale: [0.94, 1.025, 0.94],
              opacity: [0.40, 0.85, 0.40],
            }}
            transition={{
              duration: 4.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-[62%]
              h-[115px]
              w-[65%]
              -translate-x-1/2
              -translate-y-1/2
              rounded-[50%]
              border
              border-blue-400/10
            "
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-[66%]
              h-12
              w-[58%]
              -translate-x-1/2
              rounded-full
              bg-blue-500/[0.12]
              blur-3xl
            "
          />

          {/* X-RAY VEHICLE ASSET */}
          <motion.div
            className="
              absolute
              inset-x-[2%]
              top-[7%]
              z-10
              flex
              h-[295px]
              items-center
              justify-center
            "
            animate={{
              y: [0, -4, 0],
              scale: [1, 1.008, 1],
            }}
            transition={{
              duration: 6.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="/ui/vehicle-scan-xray.png"
              alt="Vehicle X-ray diagnostic scan"
              className="
                h-full
                w-full
                object-contain
                drop-shadow-[0_0_18px_rgba(0,145,255,0.30)]
                [filter:saturate(1.06)_contrast(1.04)]
              "
              draggable={false}
            />
          </motion.div>

          {/* engine glow pulse, aligned over the red engine in the supplied asset */}
          <motion.div
            className="
              pointer-events-none
              absolute
              left-[23%]
              top-[37%]
              z-10
              h-20
              w-28
              rounded-full
              bg-red-500/[0.15]
              blur-2xl
            "
            animate={{
              opacity: [0.18, 0.65, 0.18],
              scale: [0.92, 1.12, 0.92],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* scan beam */}
          <motion.div
            className="
              pointer-events-none
              absolute
              left-[5%]
              right-[5%]
              top-[14%]
              z-30
              h-px
              bg-gradient-to-r
              from-transparent
              via-cyan-200
              to-transparent
              shadow-[0_0_20px_rgba(103,232,249,0.80)]
            "
            animate={{
              top: ["14%", "78%", "14%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="
              pointer-events-none
              absolute
              left-[7%]
              right-[7%]
              z-20
              h-20
              bg-gradient-to-b
              from-cyan-300/[0.00]
              via-cyan-300/[0.055]
              to-cyan-300/[0.00]
              blur-sm
            "
            animate={{
              top: ["9%", "72%", "9%"],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* HUD corner brackets */}
          <div className="pointer-events-none absolute left-5 top-5 z-30 h-8 w-8 border-l border-t border-cyan-200/20" />
          <div className="pointer-events-none absolute right-5 top-5 z-30 h-8 w-8 border-r border-t border-cyan-200/20" />
          <div className="pointer-events-none absolute bottom-5 left-5 z-30 h-8 w-8 border-b border-l border-cyan-200/20" />
          <div className="pointer-events-none absolute bottom-5 right-5 z-30 h-8 w-8 border-b border-r border-cyan-200/20" />

          {/* bottom telemetry */}
          <div
            className="
              absolute
              bottom-4
              left-4
              right-4
              z-40
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-4
            "
          >
            {[
              [
                copy.powertrain,
                copy.powertrainValue,
                "text-red-300",
              ],
              [
                copy.network,
                copy.networkValue,
                "text-cyan-200",
              ],
              [
                copy.voltage,
                copy.voltageValue,
                "text-blue-200",
              ],
              [
                copy.dtc,
                copy.dtcValue,
                "text-amber-200",
              ],
            ].map(
              (
                item
              ) => (
                <div
                  key={
                    item[0]
                  }
                  className="
                    flex
                    min-h-[78px]
                    flex-col
                    items-center
                    justify-center
                    rounded-[14px]
                    border
                    border-blue-400/[0.10]
                    bg-[#050a12]/92
                    px-2.5
                    py-3
                    text-center
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]
                    backdrop-blur-md
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.10em]
                      text-zinc-400
                    "
                  >
                    {item[0]}
                  </p>

                  <p
                    className={`
                      mt-1.5
                      whitespace-nowrap
                      text-[12px]
                      font-bold
                      leading-none
                      ${item[2]}
                    `}
                  >
                    {item[1]}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* module column */}
        <div
          className="
            hidden
            bg-[#06101a]/78
            lg:block
          "
        >
          <div
            className="
              border-b
              border-cyan-300/[0.07]
              px-4
              py-3
            "
          >
            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-blue-100/80
              "
            >
              {copy.moduleTitle}
            </p>
          </div>

          <div>
            {moduleRows.map(
              (
                item,
                index
              ) => (
                <motion.div
                  key={
                    item.name
                  }
                  className={`
                    flex
                    items-center
                    justify-between
                    gap-3
                    px-4
                    py-4
                    ${
                      index !==
                      moduleRows.length -
                        1
                        ? "border-b border-white/[0.045]"
                        : ""
                    }
                  `}
                  animate={{
                    backgroundColor:
                      index === 0 ||
                      index === 2
                        ? [
                            "rgba(255,255,255,0)",
                            "rgba(34,211,238,0.025)",
                            "rgba(255,255,255,0)",
                          ]
                        : "rgba(255,255,255,0)",
                  }}
                  transition={{
                    duration:
                      2.8 +
                      index * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2.5
                    "
                  >
                    <span
                      className={`
                        h-2
                        w-2
                        rounded-full
                        ${item.dot}
                      `}
                    />

                    <span
                      className="
                        text-[12px]
                        font-semibold
                        text-zinc-200
                      "
                    >
                      {item.name}
                    </span>
                  </div>

                  <span
                    className={`
                      text-[10px]
                      font-bold
                      ${item.tone}
                    `}
                  >
                    {item.state}
                  </span>
                </motion.div>
              )
            )}
          </div>

          <div
            className="
              mx-3
              mt-4
              rounded-[14px]
              border
              border-cyan-300/[0.07]
              bg-cyan-300/[0.025]
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
              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-zinc-500
                "
              >
                CAN BUS
              </span>

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_10px_rgba(52,211,153,0.5)]
                "
              />
            </div>

            <div
              className="
                mt-3
                flex
                h-11
                items-end
                gap-1
              "
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
                (
                  item
                ) => {
                  const phase =
                    canBusTick +
                    item * 2;

                  const height =
                    8 +
                    (
                      (
                        phase * 7 +
                        item * 11
                      ) %
                      28
                    );

                  return (
                    <span
                      key={
                        item
                      }
                      className="
                        block
                        w-full
                        rounded-[3px]
                        bg-cyan-300/80
                        shadow-[0_0_8px_rgba(34,211,238,0.20)]
                        transition-[height,opacity]
                        duration-150
                        ease-linear
                      "
                      style={{
                        height:
                          `${height}px`,
                        opacity:
                          0.55 +
                          (
                            height /
                            36
                          ) *
                            0.45,
                      }}
                    />
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const router = useRouter();

  const [
    language,
    setLanguage,
  ] = useState<Language>("en");

  const [
    sessionType,
    setSessionType,
  ] = useState<SessionType>(
    "loading"
  );

  const [
    user,
    setUser,
  ] = useState<User | null>(null);

  const [
    diagnosticCases,
    setDiagnosticCases,
  ] = useState<DiagnosticCaseRecord[]>([]);

  const [
    diagnosticsLoading,
    setDiagnosticsLoading,
  ] = useState(true);

  const [
    diagnosticsError,
    setDiagnosticsError,
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
      router.replace("/");
      return;
    }


    setLanguage(
      savedLanguage
    );


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


    void initializeDashboard();

    const refreshTimer =
      window.setInterval(
        () => {
          void loadDiagnostics();
        },
        30000
      );

    const refreshOnFocus =
      () => {
        void loadDiagnostics();
      };

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
      eyebrow:
        "DASHBOARD",

      welcomeBack:
        "Welcome back",

      guestWelcome:
        "Welcome to AutoDiagnose AI",

      heroEyebrow:
        "AUTOMOTIVE DIAGNOSTIC INTELLIGENCE",

      heroTitle:
        "From symptoms to a structured diagnostic path.",

      heroDescription:
        "AutoDiagnose AI organizes vehicle data, symptoms and DTC codes into one clear workflow, ready for diagnostic analysis.",

      userDescription:
        "Manage your vehicle diagnostics from one place.",

      guestDescription:
        "You are currently using AutoDiagnose AI as a guest.",

      newDiagnosis:
        "Start new diagnosis",

      newDiagnosisDescription:
        "Enter vehicle information, symptoms and DTC codes to begin a structured diagnostic analysis.",

      recent:
        "Recent diagnostics",

      recentDescription:
        "Your latest diagnostic activity.",

      viewAll:
        "View all history",

      noDiagnostics:
        "No diagnostics yet.",

      noDiagnosticsDescription:
        "Your recent diagnostic cases will appear here after you complete your first analysis.",

      startFirst:
        "Start your first diagnosis",

      total:
        "Total diagnostics",

      completed:
        "Completed",

      active:
        "In progress",

      overview:
        "Overview",

      diagnosticActivity:
        "Diagnostic activity",

      totalDescription:
        "All diagnostic sessions",

      completedDescription:
        "Analysis successfully completed",

      activeDescription:
        "Diagnostics waiting for completion",

      currentSession:
        "Current session",

      authenticated:
        "Authenticated account",

      guest:
        "Guest session",

      loading:
        "Loading diagnostics...",

      loadError:
        "Diagnostic activity could not be loaded.",

      vehicle:
        "Vehicle",

      unknownVehicle:
        "Unknown vehicle",

      completedStatus:
        "Completed",

      activeStatus:
        "In progress",

      view:
        "View",
    },

    ro: {
      eyebrow:
        "PANOU PRINCIPAL",

      welcomeBack:
        "Bine ai revenit",

      guestWelcome:
        "Bine ai venit în AutoDiagnose AI",

      heroEyebrow:
        "INTELIGENȚĂ PENTRU DIAGNOSTIC AUTO",

      heroTitle:
        "De la simptome la un traseu clar de diagnostic.",

      heroDescription:
        "AutoDiagnose AI organizează datele vehiculului, simptomele și codurile DTC într-un singur flux structurat, pregătit pentru analiză.",

      userDescription:
        "Administrează diagnosticele vehiculului tău dintr-un singur loc.",

      guestDescription:
        "Folosești momentan AutoDiagnose AI ca vizitator.",

      newDiagnosis:
        "Începe un diagnostic nou",

      newDiagnosisDescription:
        "Introdu informațiile vehiculului, simptomele și codurile DTC pentru a începe o analiză structurată.",

      recent:
        "Diagnostice recente",

      recentDescription:
        "Cea mai recentă activitate de diagnostic.",

      viewAll:
        "Vezi tot istoricul",

      noDiagnostics:
        "Nu există încă diagnostice.",

      noDiagnosticsDescription:
        "Cazurile tale recente vor apărea aici după ce finalizezi primul diagnostic.",

      startFirst:
        "Începe primul diagnostic",

      total:
        "Total diagnostice",

      completed:
        "Finalizate",

      active:
        "În desfășurare",

      overview:
        "Rezumat",

      diagnosticActivity:
        "Activitate diagnostică",

      totalDescription:
        "Toate sesiunile de diagnostic",

      completedDescription:
        "Analize finalizate cu succes",

      activeDescription:
        "Diagnostice care așteaptă finalizarea",

      currentSession:
        "Sesiune curentă",

      authenticated:
        "Cont autentificat",

      guest:
        "Sesiune vizitator",

      loading:
        "Se încarcă diagnosticele...",

      loadError:
        "Activitatea de diagnostic nu a putut fi încărcată.",

      vehicle:
        "Vehicul",

      unknownVehicle:
        "Vehicul necunoscut",

      completedStatus:
        "Finalizat",

      activeStatus:
        "În desfășurare",

      view:
        "Vezi",
    },
  };


  const text =
    content[language];


  function asRecord(
    value: unknown
  ): Record<string, unknown> {
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
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
  ): Record<string, unknown> {
    if (
      typeof payload === "string"
    ) {
      try {
        return asRecord(
          JSON.parse(payload)
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
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      return value;
    }

    if (
      typeof value === "number"
    ) {
      return String(value);
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


    const manufacturer =
      getString(
        vehicle.manufacturer
      ) ??
      getString(
        vehicle.make
      ) ??
      "";


    const model =
      getString(
        vehicle.model
      ) ??
      "";


    const year =
      getString(
        vehicle.year
      ) ??
      "";


    return {
      manufacturer,
      model,
      year,
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


    const name =
      [
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
      new Date(value);


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
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(date);
  }


  function isCompleted(
    diagnosticCase:
      DiagnosticCaseRecord
  ) {
    const reportReadyCase =
      diagnosticCase as DiagnosticCaseRecord & {
        analyzed_at?: string | null;
      };

    return (
      diagnosticCase.status ===
        "completed" ||
      Boolean(
        reportReadyCase.analyzed_at
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
    sessionType === "loading"
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            AutoDiagnose AI
          </p>

          <p className="mt-4 text-zinc-400">
            Loading dashboard...
          </p>

        </div>

      </main>
    );
  }


  return (

      <main className="min-h-screen bg-zinc-950 text-white">

        <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10 lg:py-12">


         {/* PREMIUM HERO */}

          <section
            className="
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-white/[0.07]
              bg-[#080d18]
              p-6
              shadow-[0_26px_80px_rgba(0,0,0,0.20)]
              sm:p-8
              lg:p-9
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -left-28
                -top-32
                h-[340px]
                w-[340px]
                rounded-full
                bg-blue-500/[0.08]
                blur-[110px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-[-180px]
                right-[18%]
                h-[320px]
                w-[320px]
                rounded-full
                bg-cyan-300/[0.035]
                blur-[100px]
              "
            />

            <div
              className="
                relative
                z-10
                grid
                gap-8
                lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)]
                lg:items-center
              "
            >
              {/* LEFT */}

              <div
                className="
                  py-2
                  lg:pr-3
                "
              >
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-blue-400/14
                    bg-blue-500/[0.05]
                    px-3.5
                    py-2
                  "
                >
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-blue-400
                      shadow-[0_0_10px_rgba(96,165,250,0.5)]
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-blue-100/70
                    "
                  >
                    {
                      text.heroEyebrow
                    }
                  </span>
                </div>

                <h1
                  className="
                    mt-6
                    max-w-[680px]
                    text-[38px]
                    font-semibold
                    leading-[1.04]
                    tracking-[-0.05em]
                    text-white
                    sm:text-[48px]
                    lg:text-[54px]
                  "
                >
                  {
                    text.heroTitle
                  }
                </h1>

                <p
                  className="
                    mt-5
                    max-w-xl
                    text-[15px]
                    leading-7
                    text-zinc-400
                  "
                >
                  {
                    text.heroDescription
                  }
                </p>

                <div
                  className="
                    mt-6
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  {[
                    language === "ro"
                      ? "Vehicul"
                      : "Vehicle",
                    language === "ro"
                      ? "Simptome"
                      : "Symptoms",
                    "DTC",
                    language === "ro"
                      ? "Analiză"
                      : "Analysis",
                  ].map(
                    (
                      item,
                      index,
                      values
                    ) => (
                      <div
                        key={
                          item
                        }
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <span
                          className="
                            rounded-full
                            border
                            border-white/[0.06]
                            bg-white/[0.018]
                            px-3
                            py-1.5
                            text-[10px]
                            font-medium
                            text-zinc-400
                          "
                        >
                          {item}
                        </span>

                        {index <
                          values.length -
                            1 && (
                          <span
                            className="
                              text-[10px]
                              text-zinc-700
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
                    mt-8
                    flex
                    flex-wrap
                    items-center
                    gap-3
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
                      group
                      inline-flex
                      items-center
                      gap-3
                      rounded-[14px]
                      bg-blue-500
                      px-5
                      py-3.5
                      text-[13px]
                      font-semibold
                      text-white
                      shadow-[0_14px_35px_rgba(37,99,235,0.18)]
                      transition
                      hover:bg-blue-400
                      hover:shadow-[0_18px_44px_rgba(37,99,235,0.24)]
                    "
                  >
                    {
                      text.newDiagnosis
                    }

                    <span
                      className="
                        transition-transform
                        group-hover:translate-x-0.5
                      "
                    >
                      →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/diagnosis/history"
                      )
                    }
                    className="
                      rounded-[14px]
                      border
                      border-white/[0.08]
                      bg-white/[0.025]
                      px-5
                      py-3.5
                      text-[13px]
                      font-semibold
                      text-zinc-300
                      transition
                      hover:border-white/[0.14]
                      hover:bg-white/[0.045]
                      hover:text-white
                    "
                  >
                    {text.viewAll}
                  </button>
                </div>

                <div
                  className="
                    mt-7
                    flex
                    flex-wrap
                    items-center
                    gap-x-4
                    gap-y-2
                    border-t
                    border-white/[0.055]
                    pt-5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className={`
                        h-1.5
                        w-1.5
                        rounded-full
                        ${
                          sessionType ===
                          "user"
                            ? "bg-emerald-400"
                            : "bg-blue-400"
                        }
                      `}
                    />

                    <span
                      className="
                        text-[11px]
                        text-zinc-500
                      "
                    >
                      {sessionType ===
                      "user"
                        ? text.authenticated
                        : text.guest}
                    </span>
                  </div>

                  {sessionType ===
                    "user" &&
                    user?.email && (
                    <>
                      <span
                        className="
                          hidden
                          h-1
                          w-1
                          rounded-full
                          bg-zinc-700
                          sm:block
                        "
                      />

                      <span
                        className="
                          max-w-[300px]
                          truncate
                          text-[11px]
                          text-zinc-600
                        "
                      >
                        {
                          user.email
                        }
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* RIGHT: LIVE VEHICLE SCANNER */}

              <VehicleScanner
                language={
                  language
                }
              />
            </div>
          </section>


          {/* OVERVIEW */}

          <section className="mt-10">

            <div className="mb-5">

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-blue-400/60
                "
              >
                {text.diagnosticActivity}
              </p>

              <h2
                className="
                  mt-2
                  text-xl
                  font-semibold
                  tracking-[-0.025em]
                  text-white
                "
              >
                {text.overview}
              </h2>

            </div>


            <div
              className="
                grid
                gap-3
                md:grid-cols-3
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
                      relative
                      overflow-hidden
                      rounded-[24px]
                      border
                      border-blue-400/[0.13]
                      bg-[#05080e]
                      p-6
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
                    "
                  >
                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-12
                        -top-14
                        h-28
                        w-28
                        rounded-full
                        bg-blue-500/[0.07]
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
                          gap-2.5
                        "
                      >
                        <span
                          className="
                            h-2
                            w-2
                            rounded-full
                            bg-blue-400
                            shadow-[0_0_10px_rgba(96,165,250,0.4)]
                          "
                        />

                        <p
                          className="
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-blue-100/55
                          "
                        >
                          {
                            item.label
                          }
                        </p>
                      </div>

                      <p
                        className="
                          mt-8
                          text-[38px]
                          font-semibold
                          tracking-[-0.05em]
                          text-white
                        "
                      >
                        {
                          item.value
                        }
                      </p>

                      <p
                        className="
                          mt-2
                          text-[12px]
                          leading-5
                          text-zinc-500
                        "
                      >
                        {
                          item.description
                        }
                      </p>
                    </div>
                  </div>
                )
              )}

            </div>

          </section>


          {/* RECENT DIAGNOSTICS + INSIGHTS */}

          <section className="mt-10">

            <div
              className="
                grid
                gap-5
                xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]
                xl:items-start
              "
            >

              {/* RECENT DIAGNOSTICS */}

              <div>

                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-400/60">
                      {text.recent}
                    </p>

                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white">
                      {text.recentDescription}
                    </h2>

                  </div>


                  {totalDiagnostics > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          "/diagnosis/history"
                        )
                      }
                      className="w-fit text-xs font-semibold text-zinc-500 transition-colors duration-200 hover:text-white"
                    >
                      {text.viewAll} →
                    </button>
                  )}

                </div>


                <div className="overflow-hidden rounded-[24px] border border-blue-400/[0.11] bg-[#05080e]">

                  {diagnosticsLoading && (
                    <div className="p-6 text-sm text-zinc-500">
                      {text.loading}
                    </div>
                  )}


                  {!diagnosticsLoading &&
                    diagnosticsError && (
                    <div className="p-6 text-sm text-red-300">
                      {text.loadError}
                    </div>
                  )}


                  {!diagnosticsLoading &&
                    !diagnosticsError &&
                    recentDiagnostics.length ===
                      0 && (
                    <div className="p-7 sm:p-8">

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-blue-400/10
                          bg-blue-500/[0.04]
                          text-blue-300/60
                        "
                      >
                        +
                      </div>


                      <h3 className="mt-5 text-base font-semibold tracking-[-0.02em] text-white">
                        {text.noDiagnostics}
                      </h3>

                      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                        {text.noDiagnosticsDescription}
                      </p>


                      <button
                        type="button"
                        onClick={() => {
                          clearDiagnosticDraft();

                          router.push(
                            "/diagnosis/vehicles"
                          );
                        }}
                        className="mt-5 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-400"
                      >
                        {text.startFirst} →
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
                              diagnosticCase.case_id
                            }
                            type="button"
                            onClick={() =>
                              router.push(
                                `/diagnosis/report?caseId=${diagnosticCase.case_id}`
                              )
                            }
                            className={`group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-blue-500/[0.025] sm:px-6 ${
                              index !==
                              recentDiagnostics.length -
                                1
                                ? "border-b border-blue-400/[0.07]"
                                : ""
                            }`}
                          >

                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-white/[0.06]
                                bg-white/[0.018]
                              "
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  completed
                                    ? "bg-emerald-400"
                                    : "bg-amber-400"
                                }`}
                              />
                            </div>


                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-semibold text-zinc-100">
                                {getVehicleName(
                                  diagnosticCase
                                )}
                              </p>


                              <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-zinc-600">

                                {vehicle.year && (
                                  <span>
                                    {vehicle.year}
                                  </span>
                                )}

                                {vehicle.year && (
                                  <span className="text-zinc-800">
                                    •
                                  </span>
                                )}

                                <span>
                                  {formatDate(
                                    diagnosticCase.created_at
                                  )}
                                </span>

                              </div>

                            </div>


                            <div className="hidden items-center gap-3 sm:flex">

                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                                  completed
                                    ? "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-300/80"
                                    : "border-amber-400/10 bg-amber-400/[0.04] text-amber-300/80"
                                }`}
                              >
                                {completed
                                  ? text.completedStatus
                                  : text.activeStatus}
                              </span>


                              <span className="text-sm text-zinc-700 transition-colors duration-200 group-hover:text-blue-300">
                                →
                              </span>

                            </div>

                          </button>
                        );
                      }
                    )}

                </div>

              </div>


              {/* DIAGNOSTIC INSIGHTS */}

              <DiagnosticInsights
                language={language}
                cases={diagnosticCases}
              />

            </div>

          </section>

        </div>

      </main>

  );
}