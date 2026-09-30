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


type Language =
  | "ro"
  | "en";


type HistoryFilter =
  | "all"
  | "analyzed"
  | "pending";


type SortOrder =
  | "newest"
  | "oldest";


type HistoryItem = {
  case_id: string;
  created_at: string | null;
  analyzed_at: string | null;

  language: Language;

  vehicle: {
    make: string;
    model: string;
    year: number | null;
    engine: string | null;
    fuel_type: string | null;
    mileage_km: number | null;
  };

  symptom_count: number;
  dtc_count: number;
  findings_count: number;

  top_finding: string | null;
  top_score: number | null;
};




function formatDate(
  value: string | null,
  language: Language
) {
  if (!value) {
    return language === "ro"
      ? "Dată necunoscută"
      : "Unknown date";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }


  return new Intl.DateTimeFormat(
    language === "ro"
      ? "ro-RO"
      : "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}


function formatCompactDate(
  value: string | null,
  language: Language
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
    return value;
  }


  return new Intl.DateTimeFormat(
    language === "ro"
      ? "ro-RO"
      : "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
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


function clampScore(
  value: number | null
) {
  if (
    value === null
  ) {
    return null;
  }


  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value)
    )
  );
}


function getVehicleName(
  item: HistoryItem,
  language: Language
) {
  const name =
    `${item.vehicle.make ?? ""} ${item.vehicle.model ?? ""}`.trim();


  if (name) {
    return name;
  }


  return language === "ro"
    ? "Vehicul necunoscut"
    : "Unknown vehicle";
}


export default function DiagnosticHistoryPage() {
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
    items,
    setItems,
  ] =
    useState<
      HistoryItem[]
    >([]);


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
    query,
    setQuery,
  ] =
    useState("");


  const [
    filter,
    setFilter,
  ] =
    useState<HistoryFilter>(
      "all"
    );


  const [
    sortOrder,
    setSortOrder,
  ] =
    useState<SortOrder>(
      "newest"
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


    async function loadHistory() {
      try {
        setError(
          false
        );


        const response =
          await fetch(
            `${API_BASE_URL}/api/diagnostic-cases`,
            {
              credentials:
                "include",
            }
          );


        if (
          !response.ok
        ) {
          throw new Error(
            "HISTORY_REQUEST_FAILED"
          );
        }


        const data:
          HistoryItem[] =
          await response.json();


        setItems(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (
        loadError
      ) {
        console.error(
          "Failed to load diagnostic history:",
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


    void loadHistory();

  }, []);


  const content = {
    en: {
      eyebrow:
        "DIAGNOSTIC HISTORY",

      title:
        "Your diagnostic timeline",

      description:
        "Review previous cases, compare results and reopen a full analysis without starting over.",

      newDiagnosis:
        "New diagnosis",

      overview:
        "History overview",

      total:
        "Total cases",

      analyzed:
        "Analyzed",

      vehicles:
        "Vehicles",

      latest:
        "Latest case",

      search:
        "Search history",

      searchPlaceholder:
        "Search vehicle, finding or case ID...",

      all:
        "All",

      analyzedFilter:
        "Analyzed",

      pending:
        "Pending",

      newest:
        "Newest first",

      oldest:
        "Oldest first",

      cases:
        "cases",

      case:
        "case",

      analyzedStatus:
        "Analyzed",

      pendingStatus:
        "Pending analysis",

      topFinding:
        "Primary finding",

      noFinding:
        "No result generated yet",

      symptoms:
        "Symptoms",

      findings:
        "Findings",

      relevance:
        "Relevance",

      openAnalysis:
        "Open analysis",

      viewReport:
        "View report",

      created:
        "Created",

      analyzedOn:
        "Analyzed",

      caseId:
        "Case ID",

      noResults:
        "No cases match your filters.",

      noResultsDescription:
        "Try another search or clear the current filter.",

      clearFilters:
        "Clear filters",

      emptyTitle:
        "No saved diagnoses yet",

      emptyDescription:
        "Your first diagnostic case will appear here automatically after you create it.",

      startFirst:
        "Start first diagnosis",

      loadError:
        "History could not be loaded.",

      loadErrorDescription:
        "Check that the backend is running and that your session is still active.",

      retry:
        "Retry",

      timeline:
        "CASE TIMELINE",

      resultReady:
        "Result available",

      resultPending:
        "Waiting for analysis",

      unknownYear:
        "Unknown year",

      noDtc:
        "No DTC",

      backDashboard:
        "Back to dashboard",
    },

    ro: {
      eyebrow:
        "ISTORIC DIAGNOSTICE",

      title:
        "Cronologia diagnosticelor tale",

      description:
        "Revizuiește cazurile anterioare, compară rezultatele și redeschide analiza completă fără să o iei de la început.",

      newDiagnosis:
        "Diagnostic nou",

      overview:
        "Privire de ansamblu",

      total:
        "Total cazuri",

      analyzed:
        "Analizate",

      vehicles:
        "Vehicule",

      latest:
        "Ultimul caz",

      search:
        "Caută în istoric",

      searchPlaceholder:
        "Caută vehicul, rezultat sau ID caz...",

      all:
        "Toate",

      analyzedFilter:
        "Analizate",

      pending:
        "În așteptare",

      newest:
        "Cele mai noi",

      oldest:
        "Cele mai vechi",

      cases:
        "cazuri",

      case:
        "caz",

      analyzedStatus:
        "Analizat",

      pendingStatus:
        "În așteptarea analizei",

      topFinding:
        "Rezultat principal",

      noFinding:
        "Nu există încă un rezultat generat",

      symptoms:
        "Simptome",

      findings:
        "Rezultate",

      relevance:
        "Relevanță",

      openAnalysis:
        "Deschide analiza",

      viewReport:
        "Vezi raportul",

      created:
        "Creat",

      analyzedOn:
        "Analizat",

      caseId:
        "ID caz",

      noResults:
        "Niciun caz nu corespunde filtrelor.",

      noResultsDescription:
        "Încearcă altă căutare sau elimină filtrul curent.",

      clearFilters:
        "Șterge filtrele",

      emptyTitle:
        "Nu există încă diagnostice salvate",

      emptyDescription:
        "Primul caz de diagnostic va apărea aici automat după ce îl creezi.",

      startFirst:
        "Începe primul diagnostic",

      loadError:
        "Istoricul nu a putut fi încărcat.",

      loadErrorDescription:
        "Verifică dacă backend-ul este pornit și dacă sesiunea ta este încă activă.",

      retry:
        "Reîncearcă",

      timeline:
        "CRONOLOGIE CAZURI",

      resultReady:
        "Rezultat disponibil",

      resultPending:
        "Așteaptă analiza",

      unknownYear:
        "An necunoscut",

      noDtc:
        "Fără DTC",

      backDashboard:
        "Înapoi la panou",
    },
  };


  const text =
    content[language];


  const analyzedCount =
    useMemo(
      () =>
        items.filter(
          (item) =>
            Boolean(
              item.analyzed_at
            )
        ).length,
      [items]
    );


  const uniqueVehicleCount =
    useMemo(
      () => {
        const keys =
          new Set(
            items.map(
              (item) =>
                `${item.vehicle.make}|${item.vehicle.model}|${item.vehicle.year ?? ""}`
                  .trim()
                  .toLowerCase()
            )
          );


        keys.delete(
          "||"
        );


        return keys.size;
      },
      [items]
    );


  const newestItem =
    useMemo(
      () => {
        if (
          items.length ===
          0
        ) {
          return null;
        }


        return [...items]
          .sort(
            (
              first,
              second
            ) => {
              const firstTime =
                first.created_at
                  ? new Date(
                      first.created_at
                    ).getTime()
                  : 0;

              const secondTime =
                second.created_at
                  ? new Date(
                      second.created_at
                    ).getTime()
                  : 0;


              return (
                secondTime -
                firstTime
              );
            }
          )[0];
      },
      [items]
    );


  const visibleItems =
    useMemo(
      () => {
        const normalizedQuery =
          query
            .trim()
            .toLowerCase();


        const filtered =
          items.filter(
            (item) => {
              if (
                filter ===
                  "analyzed" &&
                !item.analyzed_at
              ) {
                return false;
              }


              if (
                filter ===
                  "pending" &&
                item.analyzed_at
              ) {
                return false;
              }


              if (
                !normalizedQuery
              ) {
                return true;
              }


              const searchable =
                [
                  item.vehicle.make,
                  item.vehicle.model,
                  item.vehicle.year,
                  item.vehicle
                    .fuel_type,
                  item.top_finding,
                  item.case_id,
                ]
                  .filter(
                    Boolean
                  )
                  .join(" ")
                  .toLowerCase();


              return searchable.includes(
                normalizedQuery
              );
            }
          );


        return [...filtered].sort(
          (
            first,
            second
          ) => {
            const firstTime =
              first.created_at
                ? new Date(
                    first.created_at
                  ).getTime()
                : 0;

            const secondTime =
              second.created_at
                ? new Date(
                    second.created_at
                  ).getTime()
                : 0;


            return sortOrder ===
              "newest"
              ? secondTime -
                  firstTime
              : firstTime -
                  secondTime;
          }
        );
      },
      [
        items,
        query,
        filter,
        sortOrder,
      ]
    );


  function openCase(
    item: HistoryItem,
    destination:
      | "analysis"
      | "report"
  ) {
    localStorage.setItem(
      "diagnosticCaseId",
      item.case_id
    );


    localStorage.setItem(
      "language",
      item.language
    );


    if (
      destination ===
      "report"
    ) {
      router.push(
        `/diagnosis/report?caseId=${encodeURIComponent(
          item.case_id
        )}`
      );

      return;
    }


    router.push(
      "/diagnosis/analysis"
    );
  }


  function clearFilters() {
    setQuery(
      ""
    );

    setFilter(
      "all"
    );

    setSortOrder(
      "newest"
    );
  }


  if (
    loading
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#060912]
          text-white
        "
      >
        <div className="ad-page">
          <section
            className="
              ad-surface
              overflow-hidden
              rounded-[30px]
              p-7
              sm:p-9
            "
          >
            <div
              className="
                h-3
                w-36
                animate-pulse
                rounded-full
                bg-white/[0.05]
              "
            />

            <div
              className="
                mt-5
                h-10
                max-w-lg
                animate-pulse
                rounded-xl
                bg-white/[0.05]
              "
            />

            <div
              className="
                mt-4
                h-5
                max-w-2xl
                animate-pulse
                rounded-lg
                bg-white/[0.035]
              "
            />
          </section>


          <div
            className="
              mt-6
              grid
              gap-3
              md:grid-cols-4
            "
          >
            {[
              1,
              2,
              3,
              4,
            ].map(
              (item) => (
                <div
                  key={
                    item
                  }
                  className="
                    ad-surface
                    h-28
                    animate-pulse
                    rounded-[22px]
                  "
                />
              )
            )}
          </div>


          <div
            className="
              mt-6
              space-y-3
            "
          >
            {[
              1,
              2,
              3,
            ].map(
              (item) => (
                <div
                  key={
                    item
                  }
                  className="
                    ad-surface
                    h-44
                    animate-pulse
                    rounded-[24px]
                  "
                />
              )
            )}
          </div>
        </div>
      </main>
    );
  }


  if (
    error
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
              bg-red-400/[0.055]
              text-lg
              font-bold
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
              window.location.reload()
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
            {text.retry}
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
              right-0
              top-0
              h-56
              w-56
              rounded-full
              bg-cyan-300/[0.035]
              blur-[80px]
            "
          />


          <div
            className="
              relative
              flex
              flex-col
              gap-7
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
                  border-blue-400/15
                  bg-blue-500/[0.05]
                  px-3.5
                  py-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-blue-400
                    shadow-[0_0_12px_rgba(96,165,250,0.65)]
                  "
                />

                <span
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-blue-100/80
                  "
                >
                  {text.eyebrow}
                </span>
              </div>


              <h1
                className="
                  mt-6
                  text-[2.2rem]
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.04em]
                  text-white
                  sm:text-[2.8rem]
                "
              >
                {text.title}
              </h1>


              <p
                className="
                  mt-4
                  max-w-2xl
                  text-[16px]
                  leading-7
                  text-zinc-300
                "
              >
                {text.description}
              </p>
            </div>


            <button
              type="button"
              onClick={() =>
                router.push(
                  "/diagnosis/vehicle"
                )
              }
              className="
                group
                inline-flex
                min-h-12
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-blue-500
                px-5
                text-sm
                font-semibold
                text-white
                shadow-[0_14px_36px_rgba(37,99,235,0.20)]
                transition
                hover:bg-blue-400
              "
            >
              {text.newDiagnosis}

              <span
                className="
                  transition-transform
                  group-hover:translate-x-0.5
                "
              >
                →
              </span>
            </button>
          </div>
        </section>


        {/* STATS */}

        <section
          className="
            mt-6
            grid
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <div
            className="
              ad-surface
              rounded-[22px]
              p-5
            "
          >
            <p
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-zinc-500
              "
            >
              {text.total}
            </p>

            <p
              className="
                mt-3
                text-[30px]
                font-semibold
                tracking-[-0.04em]
                text-white
              "
            >
              {items.length}
            </p>
          </div>


          <div
            className="
              ad-surface
              rounded-[22px]
              p-5
            "
          >
            <p
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-zinc-500
              "
            >
              {text.analyzed}
            </p>

            <div
              className="
                mt-3
                flex
                items-end
                justify-between
                gap-4
              "
            >
              <p
                className="
                  text-[30px]
                  font-semibold
                  tracking-[-0.04em]
                  text-white
                "
              >
                {analyzedCount}
              </p>

              <div
                className="
                  h-1.5
                  w-20
                  overflow-hidden
                  rounded-full
                  bg-white/[0.05]
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-emerald-400
                  "
                  style={{
                    width:
                      items.length >
                      0
                        ? `${Math.round(
                            (analyzedCount /
                              items.length) *
                              100
                          )}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </div>


          <div
            className="
              ad-surface
              rounded-[22px]
              p-5
            "
          >
            <p
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-zinc-500
              "
            >
              {text.vehicles}
            </p>

            <p
              className="
                mt-3
                text-[30px]
                font-semibold
                tracking-[-0.04em]
                text-white
              "
            >
              {
                uniqueVehicleCount
              }
            </p>
          </div>


          <div
            className="
              ad-surface
              rounded-[22px]
              p-5
            "
          >
            <p
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-zinc-500
              "
            >
              {text.latest}
            </p>

            <p
              className="
                mt-3
                truncate
                text-[15px]
                font-semibold
                text-zinc-100
              "
            >
              {newestItem
                ? getVehicleName(
                    newestItem,
                    language
                  )
                : "—"}
            </p>

            <p
              className="
                mt-1
                text-[12px]
                text-zinc-400
              "
            >
              {newestItem
                ? formatCompactDate(
                    newestItem.created_at,
                    language
                  )
                : "—"}
            </p>
          </div>
        </section>


        {/* FILTER BAR */}

        {items.length >
          0 && (
          <section
            className="
              ad-surface
              mt-6
              rounded-[24px]
              p-4
              sm:p-5
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                xl:flex-row
                xl:items-center
                xl:justify-between
              "
            >
              <div
                className="
                  w-full
                  xl:max-w-md
                "
              >
                <label
                  htmlFor="history-search"
                  className="
                    sr-only
                  "
                >
                  {text.search}
                </label>


                <div
                  className="
                    flex
                    min-h-12
                    items-center
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-black/10
                    px-4
                    transition
                    focus-within:border-blue-400/20
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="
                      h-4
                      w-4
                      shrink-0
                      text-zinc-500
                    "
                    aria-hidden="true"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                    />

                    <path
                      d="m20 20-3.5-3.5"
                      strokeLinecap="round"
                    />
                  </svg>


                  <input
                    id="history-search"
                    value={
                      query
                    }
                    onChange={(
                      event
                    ) =>
                      setQuery(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder={
                      text.searchPlaceholder
                    }
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-3
                      text-[14px]
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                    "
                  />


                  {query && (
                    <button
                      type="button"
                      onClick={() =>
                        setQuery(
                          ""
                        )
                      }
                      className="
                        text-[12px]
                        font-semibold
                        text-zinc-500
                        transition
                        hover:text-white
                      "
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>


              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                "
              >
                <div
                  className="
                    inline-flex
                    w-fit
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-black/10
                    p-1
                  "
                >
                  {(
                    [
                      {
                        id:
                          "all",
                        label:
                          text.all,
                      },
                      {
                        id:
                          "analyzed",
                        label:
                          text.analyzedFilter,
                      },
                      {
                        id:
                          "pending",
                        label:
                          text.pending,
                      },
                    ] as {
                      id:
                        HistoryFilter;
                      label:
                        string;
                    }[]
                  ).map(
                    (option) => (
                      <button
                        key={
                          option.id
                        }
                        type="button"
                        onClick={() =>
                          setFilter(
                            option.id
                          )
                        }
                        className={`
                          rounded-lg
                          px-3.5
                          py-2
                          text-[12px]
                          font-semibold
                          transition
                          ${
                            filter ===
                            option.id
                              ? "bg-white/[0.08] text-white"
                              : "text-zinc-500 hover:text-zinc-200"
                          }
                        `}
                      >
                        {
                          option.label
                        }
                      </button>
                    )
                  )}
                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSortOrder(
                      (
                        current
                      ) =>
                        current ===
                        "newest"
                          ? "oldest"
                          : "newest"
                    )
                  }
                  className="
                    min-h-11
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-black/10
                    px-4
                    text-[12px]
                    font-semibold
                    text-zinc-300
                    transition
                    hover:bg-white/[0.03]
                    hover:text-white
                  "
                >
                  {sortOrder ===
                  "newest"
                    ? text.newest
                    : text.oldest}
                  {"  "}
                  ↕
                </button>
              </div>
            </div>
          </section>
        )}


        {/* EMPTY HISTORY */}

        {items.length ===
          0 && (
          <section
            className="
              ad-surface
              mt-6
              rounded-[28px]
              p-8
              text-center
              sm:p-10
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
                border-blue-400/15
                bg-blue-500/[0.05]
                text-blue-100
              "
            >
              ↺
            </div>


            <h2
              className="
                mt-5
                text-xl
                font-semibold
                text-white
              "
            >
              {text.emptyTitle}
            </h2>


            <p
              className="
                mx-auto
                mt-3
                max-w-lg
                text-[15px]
                leading-7
                text-zinc-400
              "
            >
              {
                text.emptyDescription
              }
            </p>


            <button
              type="button"
              onClick={() =>
                router.push(
                  "/diagnosis/vehicle"
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
              {text.startFirst}
            </button>
          </section>
        )}


        {/* NO FILTER RESULTS */}

        {items.length >
          0 &&
          visibleItems.length ===
            0 && (
          <section
            className="
              ad-surface
              mt-6
              rounded-[26px]
              p-8
              text-center
            "
          >
            <h2
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              {text.noResults}
            </h2>


            <p
              className="
                mt-2
                text-[14px]
                text-zinc-400
              "
            >
              {
                text.noResultsDescription
              }
            </p>


            <button
              type="button"
              onClick={
                clearFilters
              }
              className="
                mt-5
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-4
                py-2.5
                text-sm
                font-semibold
                text-zinc-200
                transition
                hover:bg-white/[0.05]
              "
            >
              {text.clearFilters}
            </button>
          </section>
        )}


        {/* TIMELINE */}

        {visibleItems.length >
          0 && (
          <section
            className="
              mt-7
            "
          >
            <div
              className="
                mb-4
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
              "
            >
              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-blue-100/65
                "
              >
                {text.timeline}
              </p>


              <span
                className="
                  text-[13px]
                  font-medium
                  text-zinc-400
                "
              >
                {
                  visibleItems.length
                }{" "}
                {visibleItems.length ===
                1
                  ? text.case
                  : text.cases}
              </span>
            </div>


            <div
              className="
                relative
                space-y-3
              "
            >
              <div
                className="
                  absolute
                  bottom-6
                  left-[17px]
                  top-6
                  hidden
                  w-px
                  bg-gradient-to-b
                  from-blue-400/30
                  via-blue-400/10
                  to-transparent
                  sm:block
                "
              />


              {visibleItems.map(
                (
                  item,
                  index
                ) => {
                  const analyzed =
                    Boolean(
                      item.analyzed_at
                    );


                  const score =
                    clampScore(
                      item.top_score
                    );


                  const vehicleName =
                    getVehicleName(
                      item,
                      language
                    );


                  return (
                    <div
                      key={
                        item.case_id
                      }
                      className="
                        relative
                        sm:pl-12
                      "
                    >
                      <span
                        className={`
                          absolute
                          left-[11px]
                          top-8
                          hidden
                          h-3.5
                          w-3.5
                          rounded-full
                          border-[3px]
                          border-[#060912]
                          sm:block
                          ${
                            analyzed
                              ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.30)]"
                              : "bg-zinc-600"
                          }
                        `}
                      />


                      <article
                        className="
                          ad-surface
                          group
                          relative
                          overflow-hidden
                          rounded-[24px]
                          p-5
                          transition-all
                          duration-200
                          hover:border-blue-400/15
                          hover:bg-white/[0.018]
                          sm:p-6
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
                            bg-blue-500/[0.045]
                            blur-[65px]
                            transition
                            group-hover:bg-blue-500/[0.07]
                          "
                        />


                        <div
                          className="
                            relative
                            grid
                            gap-5
                            xl:grid-cols-[minmax(0,1fr)_300px]
                            xl:items-center
                          "
                        >
                          {/* MAIN INFO */}

                          <div
                            className="
                              min-w-0
                            "
                          >
                            <div
                              className="
                                flex
                                flex-wrap
                                items-center
                                gap-3
                              "
                            >
                              <h2
                                className="
                                  text-[20px]
                                  font-semibold
                                  tracking-[-0.025em]
                                  text-white
                                "
                              >
                                {
                                  vehicleName
                                }
                              </h2>


                              <span
                                className={`
                                  rounded-full
                                  border
                                  px-2.5
                                  py-1
                                  text-[10px]
                                  font-semibold
                                  ${
                                    analyzed
                                      ? "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-200"
                                      : "border-white/[0.07] bg-white/[0.025] text-zinc-400"
                                  }
                                `}
                              >
                                {analyzed
                                  ? text.analyzedStatus
                                  : text.pendingStatus}
                              </span>
                            </div>


                            <div
                              className="
                                mt-3
                                flex
                                flex-wrap
                                gap-x-5
                                gap-y-2
                                text-[13px]
                                text-zinc-400
                              "
                            >
                              <span>
                                {
                                  item.vehicle
                                    .year ??
                                  text.unknownYear
                                }
                              </span>

                              <span>
                                {formatFuel(
                                  item.vehicle
                                    .fuel_type,
                                  language
                                )}
                              </span>

                              <span>
                                {
                                  item.symptom_count
                                }{" "}
                                {text.symptoms.toLowerCase()}
                              </span>

                              <span>
                                {item.dtc_count >
                                0
                                  ? `${item.dtc_count} DTC`
                                  : text.noDtc}
                              </span>

                              {item.findings_count >
                                0 && (
                                <span>
                                  {
                                    item.findings_count
                                  }{" "}
                                  {text.findings.toLowerCase()}
                                </span>
                              )}
                            </div>


                            <div
                              className="
                                mt-5
                                grid
                                gap-3
                                lg:grid-cols-[minmax(0,1fr)_145px]
                              "
                            >
                              <div
                                className="
                                  rounded-2xl
                                  border
                                  border-white/[0.05]
                                  bg-black/10
                                  p-4
                                "
                              >
                                <p
                                  className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-zinc-500
                                  "
                                >
                                  {
                                    text.topFinding
                                  }
                                </p>


                                <p
                                  className={`
                                    mt-2
                                    text-[14px]
                                    leading-6
                                    ${
                                      item.top_finding
                                        ? "font-semibold text-zinc-100"
                                        : "text-zinc-500"
                                    }
                                  `}
                                >
                                  {
                                    item.top_finding ??
                                    text.noFinding
                                  }
                                </p>
                              </div>


                              <div
                                className="
                                  rounded-2xl
                                  border
                                  border-white/[0.05]
                                  bg-black/10
                                  p-4
                                "
                              >
                                <p
                                  className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-zinc-500
                                  "
                                >
                                  {
                                    text.relevance
                                  }
                                </p>


                                {score !==
                                null ? (
                                  <>
                                    <div
                                      className="
                                        mt-2
                                        flex
                                        items-end
                                        gap-1
                                      "
                                    >
                                      <span
                                        className="
                                          text-[24px]
                                          font-semibold
                                          tracking-[-0.04em]
                                          text-blue-100
                                        "
                                      >
                                        {score}
                                      </span>

                                      <span
                                        className="
                                          pb-1
                                          text-[11px]
                                          text-zinc-500
                                        "
                                      >
                                        /100
                                      </span>
                                    </div>


                                    <div
                                      className="
                                        mt-2
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
                                            `${score}%`,
                                        }}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <p
                                    className="
                                      mt-3
                                      text-[14px]
                                      text-zinc-500
                                    "
                                  >
                                    —
                                  </p>
                                )}
                              </div>
                            </div>


                            <div
                              className="
                                mt-4
                                flex
                                flex-wrap
                                gap-x-5
                                gap-y-2
                                text-[12px]
                                text-zinc-500
                              "
                            >
                              <span>
                                {text.created}:{" "}
                                {formatDate(
                                  item.created_at,
                                  language
                                )}
                              </span>


                              {item.analyzed_at && (
                                <span>
                                  {text.analyzedOn}:{" "}
                                  {formatDate(
                                    item.analyzed_at,
                                    language
                                  )}
                                </span>
                              )}
                            </div>
                          </div>


                          {/* ACTION PANEL */}

                          <div
                            className="
                              rounded-[20px]
                              border
                              border-white/[0.055]
                              bg-black/10
                              p-4
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
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-zinc-500
                                  "
                                >
                                  {analyzed
                                    ? text.resultReady
                                    : text.resultPending}
                                </p>

                                <p
                                  className="
                                    mt-1.5
                                    text-[13px]
                                    font-medium
                                    text-zinc-300
                                  "
                                >
                                  {formatCompactDate(
                                    item.created_at,
                                    language
                                  )}
                                </p>
                              </div>


                              <span
                                className={`
                                  h-2.5
                                  w-2.5
                                  rounded-full
                                  ${
                                    analyzed
                                      ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]"
                                      : "bg-zinc-600"
                                  }
                                `}
                              />
                            </div>


                            <button
                              type="button"
                              onClick={() =>
                                openCase(
                                  item,
                                  "analysis"
                                )
                              }
                              className="
                                group/button
                                mt-4
                                flex
                                min-h-11
                                w-full
                                items-center
                                justify-between
                                rounded-xl
                                bg-blue-500
                                px-4
                                text-[13px]
                                font-semibold
                                text-white
                                transition
                                hover:bg-blue-400
                              "
                            >
                              <span>
                                {
                                  text.openAnalysis
                                }
                              </span>

                              <span
                                className="
                                  transition-transform
                                  group-hover/button:translate-x-0.5
                                "
                              >
                                →
                              </span>
                            </button>


                            {analyzed && (
                              <button
                                type="button"
                                onClick={() =>
                                  openCase(
                                    item,
                                    "report"
                                  )
                                }
                                className="
                                  mt-2
                                  min-h-11
                                  w-full
                                  rounded-xl
                                  border
                                  border-white/[0.08]
                                  bg-white/[0.025]
                                  px-4
                                  text-[13px]
                                  font-semibold
                                  text-zinc-200
                                  transition
                                  hover:bg-white/[0.05]
                                  hover:text-white
                                "
                              >
                                {
                                  text.viewReport
                                }
                              </button>
                            )}


                            <div
                              className="
                                mt-4
                                border-t
                                border-white/[0.05]
                                pt-3
                              "
                            >
                              <p
                                className="
                                  text-[9px]
                                  font-semibold
                                  uppercase
                                  tracking-[0.11em]
                                  text-zinc-600
                                "
                              >
                                {text.caseId}
                              </p>

                              <p
                                title={
                                  item.case_id
                                }
                                className="
                                  mt-1
                                  truncate
                                  font-mono
                                  text-[10px]
                                  text-zinc-500
                                "
                              >
                                {
                                  item.case_id
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                }
              )}
            </div>
          </section>
        )}


        <div
          className="
            mt-8
            flex
            justify-start
          "
        >
          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
            className="
              text-[13px]
              font-medium
              text-zinc-500
              transition
              hover:text-zinc-200
            "
          >
            ← {text.backDashboard}
          </button>
        </div>
      </div>
    </main>
  );
}
