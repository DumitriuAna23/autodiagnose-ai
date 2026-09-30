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

  created_at:
    | string
    | null;

  analyzed_at:
    | string
    | null;

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

  symptom_count: number;

  dtc_count: number;

  findings_count: number;

  top_finding:
    | string
    | null;

  top_score:
    | number
    | null;
};


function SearchIcon() {
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
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function SortIcon() {
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
        d="M8 5v14M5 8l3-3 3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M16 19V5m-3 11 3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


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


function formatDate(
  value:
    | string
    | null,

  language:
    Language
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
    return value;
  }


  return new Intl.DateTimeFormat(
    language === "ro"
      ? "ro-RO"
      : "en-GB",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",
    }
  ).format(
    date
  );
}


function formatCompactDate(
  value:
    | string
    | null,

  language:
    Language
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
    return value;
  }


  return new Intl.DateTimeFormat(
    language === "ro"
      ? "ro-RO"
      : "en-GB",
    {
      day:
        "2-digit",

      month:
        "short",
    }
  ).format(
    date
  );
}


function formatFuel(
  value:
    | string
    | null,

  language:
    Language
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
    labels[value]?.[
      language
    ] ??
    value
  );
}


function clampScore(
  value:
    | number
    | null
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
      Math.round(
        value
      )
    )
  );
}


function getVehicleName(
  item:
    HistoryItem,

  language:
    Language
) {
  const name =
    `${item.vehicle.make ?? ""} ${item.vehicle.model ?? ""}`
      .trim();


  if (name) {
    return name;
  }


  return language === "ro"
    ? "Vehicul necunoscut"
    : "Unknown vehicle";
}


export default function HistoryMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );


  const [
    items,
    setItems,
  ] = useState<
    HistoryItem[]
  >([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState(false);


  const [
    query,
    setQuery,
  ] = useState("");


  const [
    filter,
    setFilter,
  ] = useState<HistoryFilter>(
    "all"
  );


  const [
    sortOrder,
    setSortOrder,
  ] = useState<SortOrder>(
    "newest"
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
          Array.isArray(
            data
          )
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
        "Diagnostic history",

      description:
        "Review and reopen previous diagnostic cases.",

      newDiagnosis:
        "New diagnosis",

      total:
        "Total",

      analyzed:
        "Analyzed",

      vehicles:
        "Vehicles",

      latest:
        "Latest",

      all:
        "All",

      analyzedFilter:
        "Analyzed",

      pending:
        "Pending",

      newest:
        "Newest",

      oldest:
        "Oldest",

      searchPlaceholder:
        "Search vehicle, result or case ID...",

      analyzedStatus:
        "Analyzed",

      pendingStatus:
        "Pending",

      symptoms:
        "Symptoms",

      findings:
        "Findings",

      topFinding:
        "Primary finding",

      noFinding:
        "No result yet",

      relevance:
        "Relevance",

      created:
        "Created",

      analyzedOn:
        "Analyzed",

      caseId:
        "Case ID",

      details:
        "Details",

      openAnalysis:
        "Open analysis",

      viewReport:
        "Report",

      noDtc:
        "No DTC",

      unknownYear:
        "Unknown year",

      cases:
        "cases",

      case:
        "case",

      noResults:
        "No cases match your filters.",

      clearFilters:
        "Clear filters",

      emptyTitle:
        "No diagnoses yet",

      emptyDescription:
        "Your diagnostic cases will appear here automatically.",

      startFirst:
        "Start diagnosis",

      loadError:
        "History could not be loaded.",

      retry:
        "Retry",
    },


    ro: {
      eyebrow:
        "ISTORIC DIAGNOSTICE",

      title:
        "Istoricul diagnosticelor",

      description:
        "Revizuiește și redeschide rapid cazurile anterioare.",

      newDiagnosis:
        "Diagnostic nou",

      total:
        "Total",

      analyzed:
        "Analizate",

      vehicles:
        "Vehicule",

      latest:
        "Ultimul",

      all:
        "Toate",

      analyzedFilter:
        "Analizate",

      pending:
        "În așteptare",

      newest:
        "Cele noi",

      oldest:
        "Cele vechi",

      searchPlaceholder:
        "Caută vehicul, rezultat sau ID...",

      analyzedStatus:
        "Analizat",

      pendingStatus:
        "În așteptare",

      symptoms:
        "Simptome",

      findings:
        "Rezultate",

      topFinding:
        "Rezultat principal",

      noFinding:
        "Nu există încă rezultat",

      relevance:
        "Relevanță",

      created:
        "Creat",

      analyzedOn:
        "Analizat",

      caseId:
        "ID caz",

      details:
        "Detalii",

      openAnalysis:
        "Deschide analiza",

      viewReport:
        "Raport",

      noDtc:
        "Fără DTC",

      unknownYear:
        "An necunoscut",

      cases:
        "cazuri",

      case:
        "caz",

      noResults:
        "Niciun caz nu corespunde filtrelor.",

      clearFilters:
        "Șterge filtrele",

      emptyTitle:
        "Nu există încă diagnostice",

      emptyDescription:
        "Cazurile tale de diagnostic vor apărea automat aici.",

      startFirst:
        "Începe diagnosticul",

      loadError:
        "Istoricul nu a putut fi încărcat.",

      retry:
        "Reîncearcă",
    },
  };


  const text =
    content[language];


  const analyzedCount =
    useMemo(
      () =>
        items.filter(
          (
            item
          ) =>
            Boolean(
              item.analyzed_at
            )
        ).length,

      [
        items,
      ]
    );


  const uniqueVehicleCount =
    useMemo(
      () => {
        const keys =
          new Set(
            items.map(
              (
                item
              ) =>
                `${item.vehicle.make}|${item.vehicle.model}|${item.vehicle.year ?? ""}`
                  .trim()
                  .toLowerCase()
            )
          );


        keys.delete(
          "||"
        );


        return (
          keys.size
        );
      },

      [
        items,
      ]
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


        return [
          ...items,
        ].sort(
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

      [
        items,
      ]
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
            (
              item
            ) => {
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
                  item.vehicle.fuel_type,
                  item.top_finding,
                  item.case_id,
                ]
                  .filter(
                    Boolean
                  )
                  .join(" ")
                  .toLowerCase();


              return (
                searchable.includes(
                  normalizedQuery
                )
              );
            }
          );


        return [
          ...filtered,
        ].sort(
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
              sortOrder ===
                "newest"
                ? secondTime -
                  firstTime
                : firstTime -
                  secondTime
            );
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
    item:
      HistoryItem,

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
          min-h-[100dvh]
          bg-[#060912]
          px-3.5
          py-4
          text-white
        "
      >
        <div
          className="
            mx-auto
            max-w-[560px]
          "
        >
          <div
            className="
              h-28
              animate-pulse
              rounded-[22px]
              border
              border-white/[0.05]
              bg-white/[0.025]
            "
          />

          <div
            className="
              mt-3
              grid
              grid-cols-4
              gap-1.5
            "
          >
            {[
              1,
              2,
              3,
              4,
            ].map(
              (
                item
              ) => (
                <div
                  key={
                    item
                  }
                  className="
                    h-16
                    animate-pulse
                    rounded-[16px]
                    border
                    border-white/[0.05]
                    bg-white/[0.02]
                  "
                />
              )
            )}
          </div>


          <div
            className="
              mt-3
              h-20
              animate-pulse
              rounded-[18px]
              border
              border-white/[0.05]
              bg-white/[0.02]
            "
          />


          <div
            className="
              mt-3
              space-y-2
            "
          >
            {[
              1,
              2,
              3,
            ].map(
              (
                item
              ) => (
                <div
                  key={
                    item
                  }
                  className="
                    h-36
                    animate-pulse
                    rounded-[20px]
                    border
                    border-white/[0.05]
                    bg-white/[0.02]
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
            max-w-[420px]
            rounded-[22px]
            border
            border-red-400/10
            bg-[#080d16]
            p-5
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-red-400/15
              bg-red-400/[0.05]
              text-red-300
            "
          >
            !
          </div>

          <h1
            className="
              mt-4
              text-[16px]
              font-semibold
            "
          >
            {
              text.loadError
            }
          </h1>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="
              mt-4
              min-h-[42px]
              rounded-xl
              bg-blue-500
              px-5
              text-[11px]
              font-semibold
              text-white
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
      <div
        className="
          mx-auto
          w-full
          max-w-[560px]
          px-3.5
          pb-3
          pt-4
        "
      >
        {/* HERO */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-white/[0.065]
            bg-[#080d18]
            px-4
            py-4
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-20
              h-40
              w-40
              rounded-full
              bg-blue-500/[0.10]
              blur-[55px]
            "
          />


          <div
            className="
              relative
              z-10
              flex
              items-end
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
                  gap-2
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-blue-400
                    shadow-[0_0_8px_rgba(96,165,250,0.5)]
                  "
                />

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.17em]
                    text-blue-200/60
                  "
                >
                  {
                    text.eyebrow
                  }
                </p>
              </div>


              <h1
                className="
                  mt-2.5
                  text-[23px]
                  font-semibold
                  leading-[1.05]
                  tracking-[-0.04em]
                  text-white
                "
              >
                {
                  text.title
                }
              </h1>


              <p
                className="
                  mt-2
                  max-w-[270px]
                  text-[10px]
                  leading-[1.5]
                  text-zinc-500
                "
              >
                {
                  text.description
                }
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
                flex
                min-h-[40px]
                shrink-0
                items-center
                gap-1.5
                rounded-[12px]
                bg-blue-500
                px-3
                text-[9px]
                font-semibold
                text-white
                shadow-[0_10px_25px_rgba(37,99,235,0.18)]
              "
            >
              <span
                className="
                  text-[15px]
                  leading-none
                "
              >
                +
              </span>

              {
                text.newDiagnosis
              }
            </button>
          </div>
        </section>


        {/* STATS */}

        <section
          className="
            mt-2.5
            grid
            grid-cols-4
            gap-1.5
          "
        >
          <div
            className="
              min-w-0
              rounded-[15px]
              border
              border-blue-400/[0.09]
              bg-[#05080e]
              px-2
              py-2.5
            "
          >
            <p
              className="
                truncate
                text-[6.5px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-zinc-600
              "
            >
              {text.total}
            </p>

            <p
              className="
                mt-1.5
                text-[20px]
                font-semibold
                leading-none
              "
            >
              {items.length}
            </p>
          </div>


          <div
            className="
              min-w-0
              rounded-[15px]
              border
              border-blue-400/[0.09]
              bg-[#05080e]
              px-2
              py-2.5
            "
          >
            <p
              className="
                truncate
                text-[6.5px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-zinc-600
              "
            >
              {text.analyzed}
            </p>

            <p
              className="
                mt-1.5
                text-[20px]
                font-semibold
                leading-none
                text-emerald-200
              "
            >
              {
                analyzedCount
              }
            </p>
          </div>


          <div
            className="
              min-w-0
              rounded-[15px]
              border
              border-blue-400/[0.09]
              bg-[#05080e]
              px-2
              py-2.5
            "
          >
            <p
              className="
                truncate
                text-[6.5px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-zinc-600
              "
            >
              {text.vehicles}
            </p>

            <p
              className="
                mt-1.5
                text-[20px]
                font-semibold
                leading-none
              "
            >
              {
                uniqueVehicleCount
              }
            </p>
          </div>


          <div
            className="
              min-w-0
              rounded-[15px]
              border
              border-blue-400/[0.09]
              bg-[#05080e]
              px-2
              py-2.5
            "
          >
            <p
              className="
                truncate
                text-[6.5px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-zinc-600
              "
            >
              {text.latest}
            </p>

            <p
              className="
                mt-1.5
                truncate
                text-[9px]
                font-semibold
                text-zinc-200
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
                mt-0.5
                truncate
                text-[7px]
                text-zinc-600
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


        {/* SEARCH + FILTERS */}

        {items.length >
          0 && (
          <section
            className="
              mt-2.5
              rounded-[18px]
              border
              border-white/[0.06]
              bg-[#080c15]
              p-2.5
            "
          >
            <div
              className="
                flex
                min-h-[40px]
                items-center
                rounded-[11px]
                border
                border-white/[0.06]
                bg-black/15
                px-3
              "
            >
              <span
                className="
                  shrink-0
                  text-zinc-600
                "
              >
                <SearchIcon />
              </span>

              <input
                value={
                  query
                }
                onChange={(
                  event
                ) =>
                  setQuery(
                    event.target
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
                  px-2.5
                  text-[11px]
                  text-white
                  outline-none
                  placeholder:text-zinc-700
                "
              />

              {query && (
                <button
                  type="button"
                  onClick={() =>
                    setQuery("")
                  }
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    text-zinc-600
                  "
                >
                  ×
                </button>
              )}
            </div>


            <div
              className="
                mt-2
                grid
                grid-cols-[1fr_auto]
                gap-2
              "
            >
              <div
                className="
                  grid
                  grid-cols-3
                  rounded-[11px]
                  border
                  border-white/[0.06]
                  bg-black/10
                  p-0.5
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
                  (
                    option
                  ) => (
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
                        min-h-[34px]
                        truncate
                        rounded-[9px]
                        px-1.5
                        text-[8px]
                        font-semibold
                        transition

                        ${
                          filter ===
                          option.id
                            ? "bg-white/[0.08] text-white"
                            : "text-zinc-600"
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
                  flex
                  min-h-[36px]
                  items-center
                  gap-1.5
                  rounded-[11px]
                  border
                  border-white/[0.06]
                  bg-black/10
                  px-2.5
                  text-[8px]
                  font-semibold
                  text-zinc-400
                "
              >
                <SortIcon />

                {sortOrder ===
                "newest"
                  ? text.newest
                  : text.oldest}
              </button>
            </div>
          </section>
        )}


        {/* EMPTY HISTORY */}

        {items.length ===
          0 && (
          <section
            className="
              mt-3
              rounded-[20px]
              border
              border-blue-400/[0.09]
              bg-[#05080e]
              p-5
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
                rounded-xl
                border
                border-blue-400/10
                bg-blue-500/[0.04]
                text-blue-300
              "
            >
              ↺
            </div>

            <h2
              className="
                mt-3
                text-[13px]
                font-semibold
              "
            >
              {
                text.emptyTitle
              }
            </h2>

            <p
              className="
                mx-auto
                mt-1.5
                max-w-[280px]
                text-[10px]
                leading-4
                text-zinc-600
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
                mt-3
                min-h-[40px]
                rounded-xl
                bg-blue-500
                px-4
                text-[10px]
                font-semibold
              "
            >
              {
                text.startFirst
              }
            </button>
          </section>
        )}


        {/* FILTER EMPTY */}

        {items.length >
          0 &&
          visibleItems.length ===
            0 && (
          <section
            className="
              mt-3
              rounded-[20px]
              border
              border-white/[0.06]
              bg-[#05080e]
              p-5
              text-center
            "
          >
            <p
              className="
                text-[12px]
                font-semibold
              "
            >
              {
                text.noResults
              }
            </p>

            <button
              type="button"
              onClick={
                clearFilters
              }
              className="
                mt-3
                rounded-xl
                border
                border-white/[0.07]
                px-4
                py-2
                text-[9px]
                font-semibold
                text-zinc-400
              "
            >
              {
                text.clearFilters
              }
            </button>
          </section>
        )}


        {/* CASE LIST */}

        {visibleItems.length >
          0 && (
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
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-blue-200/55
                "
              >
                {
                  language === "ro"
                    ? "CAZURI"
                    : "CASES"
                }
              </p>

              <span
                className="
                  text-[9px]
                  text-zinc-600
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
                space-y-2
              "
            >
              {visibleItems.map(
                (
                  item
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
                    <article
                      key={
                        item.case_id
                      }
                      className="
                        relative
                        overflow-hidden
                        rounded-[19px]
                        border
                        border-white/[0.065]
                        bg-[#05080e]
                        p-3.5
                      "
                    >
                      <div
                        className="
                          pointer-events-none
                          absolute
                          -right-16
                          -top-16
                          h-32
                          w-32
                          rounded-full
                          bg-blue-500/[0.04]
                          blur-[45px]
                        "
                      />


                      <div
                        className="
                          relative
                          z-10
                        "
                      >
                        {/* TOP */}

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-2
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
                                gap-2
                              "
                            >
                              <span
                                className={`
                                  h-1.5
                                  w-1.5
                                  shrink-0
                                  rounded-full

                                  ${
                                    analyzed
                                      ? "bg-emerald-400"
                                      : "bg-amber-400"
                                  }
                                `}
                              />

                              <h2
                                className="
                                  truncate
                                  text-[13px]
                                  font-semibold
                                  tracking-[-0.02em]
                                  text-white
                                "
                              >
                                {
                                  vehicleName
                                }
                              </h2>
                            </div>


                            <div
                              className="
                                mt-1.5
                                flex
                                items-center
                                gap-1.5
                                overflow-hidden
                                text-[8px]
                                text-zinc-600
                              "
                            >
                              <span
                                className="
                                  shrink-0
                                "
                              >
                                {item.vehicle
                                  .year ??
                                  text.unknownYear}
                              </span>

                              <span>
                                •
                              </span>

                              <span
                                className="
                                  shrink-0
                                "
                              >
                                {formatFuel(
                                  item.vehicle
                                    .fuel_type,
                                  language
                                )}
                              </span>

                              <span>
                                •
                              </span>

                              <span
                                className="
                                  truncate
                                "
                              >
                                {formatCompactDate(
                                  item.created_at,
                                  language
                                )}
                              </span>
                            </div>
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
                                analyzed
                                  ? "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-300/75"
                                  : "border-amber-400/10 bg-amber-400/[0.04] text-amber-300/75"
                              }
                            `}
                          >
                            {analyzed
                              ? text.analyzedStatus
                              : text.pendingStatus}
                          </span>
                        </div>


                        {/* MINI DATA */}

                        <div
                          className="
                            mt-3
                            grid
                            grid-cols-3
                            divide-x
                            divide-white/[0.05]
                            rounded-[11px]
                            border
                            border-white/[0.05]
                            bg-black/10
                          "
                        >
                          <div
                            className="
                              px-2
                              py-2
                              text-center
                            "
                          >
                            <p
                              className="
                                text-[6px]
                                font-semibold
                                uppercase
                                text-zinc-700
                              "
                            >
                              {
                                text.symptoms
                              }
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[11px]
                                font-semibold
                              "
                            >
                              {
                                item.symptom_count
                              }
                            </p>
                          </div>


                          <div
                            className="
                              px-2
                              py-2
                              text-center
                            "
                          >
                            <p
                              className="
                                text-[6px]
                                font-semibold
                                uppercase
                                text-zinc-700
                              "
                            >
                              DTC
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[11px]
                                font-semibold
                              "
                            >
                              {
                                item.dtc_count
                              }
                            </p>
                          </div>


                          <div
                            className="
                              px-2
                              py-2
                              text-center
                            "
                          >
                            <p
                              className="
                                text-[6px]
                                font-semibold
                                uppercase
                                text-zinc-700
                              "
                            >
                              {
                                text.findings
                              }
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[11px]
                                font-semibold
                              "
                            >
                              {
                                item.findings_count
                              }
                            </p>
                          </div>
                        </div>


                        {/* RESULT */}

                        <div
                          className="
                            mt-2.5
                            flex
                            items-center
                            gap-3
                            rounded-[12px]
                            border
                            border-white/[0.05]
                            bg-black/10
                            px-3
                            py-2.5
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
                                text-[6.5px]
                                font-semibold
                                uppercase
                                tracking-[0.08em]
                                text-zinc-700
                              "
                            >
                              {
                                text.topFinding
                              }
                            </p>

                            <p
                              className={`
                                mt-1
                                truncate
                                text-[10px]

                                ${
                                  item.top_finding
                                    ? "font-medium text-zinc-200"
                                    : "text-zinc-600"
                                }
                              `}
                            >
                              {item.top_finding ??
                                text.noFinding}
                            </p>
                          </div>


                          {score !==
                            null && (
                            <div
                              className="
                                shrink-0
                                text-right
                              "
                            >
                              <p
                                className="
                                  text-[6px]
                                  uppercase
                                  text-zinc-700
                                "
                              >
                                {
                                  text.relevance
                                }
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  text-[15px]
                                  font-semibold
                                  text-blue-200
                                "
                              >
                                {score}
                                <span
                                  className="
                                    text-[7px]
                                    text-zinc-600
                                  "
                                >
                                  /100
                                </span>
                              </p>
                            </div>
                          )}
                        </div>


                        {/* ACTIONS */}

                        <div
                          className={`
                            mt-2.5
                            grid
                            gap-2

                            ${
                              analyzed
                                ? "grid-cols-[1fr_auto]"
                                : "grid-cols-1"
                            }
                          `}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openCase(
                                item,
                                "analysis"
                              )
                            }
                            className="
                              flex
                              min-h-[40px]
                              items-center
                              justify-center
                              gap-2
                              rounded-[11px]
                              bg-blue-500
                              px-3
                              text-[9px]
                              font-semibold
                              text-white
                            "
                          >
                            {
                              text.openAnalysis
                            }

                            <ArrowIcon />
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
                                min-h-[40px]
                                rounded-[11px]
                                border
                                border-white/[0.07]
                                bg-white/[0.02]
                                px-4
                                text-[9px]
                                font-semibold
                                text-zinc-300
                              "
                            >
                              {
                                text.viewReport
                              }
                            </button>
                          )}
                        </div>


                        {/* COLLAPSIBLE DETAILS */}

                        <details
                          className="
                            mt-2
                            border-t
                            border-white/[0.045]
                            pt-2
                          "
                        >
                          <summary
                            className="
                              cursor-pointer
                              select-none
                              text-[8px]
                              font-semibold
                              text-zinc-600
                            "
                          >
                            {
                              text.details
                            }
                          </summary>


                          <div
                            className="
                              mt-2
                              space-y-1
                              text-[8px]
                              leading-4
                              text-zinc-600
                            "
                          >
                            <p>
                              <span
                                className="
                                  text-zinc-500
                                "
                              >
                                {
                                  text.created
                                }
                                :
                              </span>{" "}
                              {formatDate(
                                item.created_at,
                                language
                              )}
                            </p>


                            {item.analyzed_at && (
                              <p>
                                <span
                                  className="
                                    text-zinc-500
                                  "
                                >
                                  {
                                    text.analyzedOn
                                  }
                                  :
                                </span>{" "}
                                {formatDate(
                                  item.analyzed_at,
                                  language
                                )}
                              </p>
                            )}


                            <p
                              className="
                                break-all
                              "
                            >
                              <span
                                className="
                                  text-zinc-500
                                "
                              >
                                {
                                  text.caseId
                                }
                                :
                              </span>{" "}
                              {
                                item.case_id
                              }
                            </p>
                          </div>
                        </details>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}