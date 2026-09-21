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
import StatCard from "@/components/ui/StatCard";
import DiagnosticInsights from "@/components/ui/DiagnosticInsight";
import VehicleIntelligenceVisual from "@/components/dashboard/VehicleIntelligenceVisual";

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

  }, [router]);


  const content = {
    en: {
      eyebrow:
        "DASHBOARD",

      welcomeBack:
        "Welcome back",

      guestWelcome:
        "Welcome to AutoDiagnose AI",

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
    return (
      diagnosticCase.status ===
      "completed"
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
    premium-surface
    premium-shadow
    relative
    overflow-hidden
    rounded-[32px]
    p-7
    sm:p-9
    lg:p-10
  "
>

  {/* BACKGROUND LIGHT */}

  <div
    className="
      pointer-events-none
      absolute
      -right-32
      -top-40
      h-[420px]
      w-[420px]
      rounded-full
      bg-blue-500/[0.12]
      blur-[110px]
    "
  />


  <div
    className="
      pointer-events-none
      absolute
      bottom-[-180px]
      right-[20%]
      h-[320px]
      w-[320px]
      rounded-full
      bg-cyan-400/[0.05]
      blur-[100px]
    "
  />


  <div
    className="
      relative
      z-10
      grid
      gap-10
      lg:grid-cols-[1.15fr_0.85fr]
      lg:items-center
    "
  >

    {/* LEFT */}

    <div>

      <div
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-blue-400/15
          bg-blue-500/[0.07]
          px-3
          py-1.5
        "
      >

        <span
          className="
            h-1.5
            w-1.5
            rounded-full
            bg-blue-400
            shadow-[0_0_10px_rgba(96,165,250,0.6)]
          "
        />

        <span
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.22em]
            text-blue-200/80
          "
        >
          Vehicle Intelligence
        </span>

      </div>


      <p
        className="
          mt-7
          text-xs
          font-semibold
          uppercase
          tracking-[0.28em]
          text-zinc-600
        "
      >
        {text.eyebrow}
      </p>


      <h1
        className="
          mt-4
          max-w-2xl
          text-4xl
          font-bold
          tracking-[-0.035em]
          text-white
          sm:text-5xl
          lg:text-[3.5rem]
          lg:leading-[1.05]
        "
      >
        {sessionType === "user"
          ? text.welcomeBack
          : text.guestWelcome}
      </h1>


      {sessionType === "user" && (
        <p
          className="
            mt-3
            text-base
            font-medium
            text-blue-200/80
          "
        >
          {user?.email}
        </p>
      )}


      <p
        className="
          mt-6
          max-w-xl
          text-base
          leading-7
          text-zinc-400
          sm:text-lg
        "
      >
        {sessionType === "user"
          ? text.userDescription
          : text.guestDescription}
      </p>


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
              "/diagnosis/vehicle"
            );
          }}
          className="
            group
            inline-flex
            items-center
            gap-3
            rounded-xl
            bg-blue-500
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-[0_12px_35px_rgba(37,99,235,0.22)]
            transition-all
            duration-200
            hover:bg-blue-400
            hover:shadow-[0_16px_45px_rgba(37,99,235,0.28)]
          "
        >
          {text.newDiagnosis}

          <span
            className="
              transition-transform
              duration-200
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
            rounded-xl
            border
            border-white/[0.08]
            bg-white/[0.025]
            px-5
            py-3
            text-sm
            font-medium
            text-zinc-300
            transition-colors
            duration-200
            hover:border-white/[0.14]
            hover:bg-white/[0.04]
            hover:text-white
          "
        >
          {text.viewAll}
        </button>

      </div>

    </div>


    {/* RIGHT VISUAL */}

    <VehicleIntelligenceVisual
      language={language}
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

              <StatCard
                label={text.total}
                value={totalDiagnostics}
                description={text.totalDescription}
                accent="blue"
              />

              <StatCard
                label={text.completed}
                value={completedDiagnostics}
                description={text.completedDescription}
                accent="green"
              />

              <StatCard
                label={text.active}
                value={activeDiagnostics}
                description={text.activeDescription}
                accent="amber"
              />

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


                <div className="overflow-hidden rounded-[24px] border border-white/[0.055] bg-white/[0.018]">

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
                            "/diagnosis/vehicle"
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
                            className={`group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-white/[0.025] sm:px-6 ${
                              index !==
                              recentDiagnostics.length -
                                1
                                ? "border-b border-white/[0.05]"
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