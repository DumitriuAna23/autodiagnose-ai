"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Language = "ro" | "en";

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

  const date = new Date(
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
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(
    date
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
    labels[value]?.[language]
    ?? value
  );
}


export default function DiagnosticHistoryPage() {
  const router = useRouter();

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


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );

    if (
      savedLanguage === "ro"
      || savedLanguage === "en"
    ) {
      setLanguage(
        savedLanguage
      );
    }

    const loadHistory =
      async () => {
        try {
          const response =
            await fetch(
              "http://127.0.0.1:8000/api/diagnostic-cases",
    {
      credentials: "include",
    }
            );

          if (!response.ok) {
            throw new Error(
              "History request failed."
            );
          }

          const data:
            HistoryItem[] =
              await response.json();

          setItems(
            data
          );
        } catch (
          loadError
        ) {
          console.error(
            "Failed to load diagnostic history:",
            loadError
          );

          setError(true);
        } finally {
          setLoading(false);
        }
      };

    loadHistory();
  }, []);


  const openCase = (
    item: HistoryItem,
    destination:
      | "analysis"
      | "report"
  ) => {
    localStorage.setItem(
      "diagnosticCaseId",
      item.case_id
    );

    localStorage.setItem(
      "language",
      item.language
    );

    if (
      destination === "report"
    ) {
      router.push(
        "/diagnosis/report"
      );
      return;
    }

    router.push(
      "/diagnosis/analysis"
    );
  };


  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">

      <div className="mx-auto w-full max-w-5xl">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
              AutoDiagnose AI
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              {language === "ro"
                ? "Istoric diagnostice"
                : "Diagnostic history"}
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
              {language === "ro"
                ? "Redeschide cazurile salvate, consultă rezultatele și accesează din nou raportul complet."
                : "Reopen saved cases, review previous results and access the full report again."}
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/vehicle"
              )
            }
            className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            {language === "ro"
              ? "Diagnostic nou"
              : "New diagnosis"}
          </button>

        </div>


        {loading && (
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-400">
            {language === "ro"
              ? "Se încarcă istoricul..."
              : "Loading history..."}
          </div>
        )}


        {!loading &&
          error && (
          <div className="mt-10 rounded-2xl border border-red-900 bg-red-950/20 p-6">

            <p className="font-semibold text-red-200">
              {language === "ro"
                ? "Istoricul nu a putut fi încărcat."
                : "The history could not be loaded."}
            </p>

            <p className="mt-2 text-sm text-red-200/70">
              {language === "ro"
                ? "Verifică dacă backend-ul AutoDiagnose AI este pornit."
                : "Check that the AutoDiagnose AI backend is running."}
            </p>

          </div>
        )}


        {!loading &&
          !error &&
          items.length ===
            0 && (
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">

            <h2 className="text-xl font-semibold">
              {language === "ro"
                ? "Nu există încă diagnostice salvate"
                : "No saved diagnoses yet"}
            </h2>

            <p className="mt-3 text-zinc-400">
              {language === "ro"
                ? "Primul caz creat va apărea aici automat."
                : "Your first created case will appear here automatically."}
            </p>

          </div>
        )}


        {!loading &&
          !error &&
          items.length >
            0 && (
          <div className="mt-10 space-y-4">

            {items.map(
              (item) => (
                <article
                  key={
                    item.case_id
                  }
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-xl font-bold">
                          {
                            item
                              .vehicle
                              .make
                          }{" "}
                          {
                            item
                              .vehicle
                              .model
                          }
                        </h2>

                        {item
                          .analyzed_at ? (
                          <span className="rounded-full border border-emerald-900 bg-emerald-950/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                            {language === "ro"
                              ? "Analizat"
                              : "Analyzed"}
                          </span>
                        ) : (
                          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-400">
                            {language === "ro"
                              ? "Neanalizat"
                              : "Not analyzed"}
                          </span>
                        )}

                      </div>


                      <p className="mt-2 text-sm text-zinc-500">
                        {formatDate(
                          item.created_at,
                          language
                        )}
                      </p>


                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-400">

                        <span>
                          {item.vehicle.year ??
                            (language === "ro"
                              ? "An necunoscut"
                              : "Unknown year")}
                        </span>

                        <span>
                          {formatFuel(
                            item.vehicle
                              .fuel_type,
                            language
                          )}
                        </span>

                        <span>
                          {item.symptom_count}{" "}
                          {language === "ro"
                            ? item.symptom_count === 1
                              ? "simptom"
                              : "simptome"
                            : item.symptom_count === 1
                              ? "symptom"
                              : "symptoms"}
                        </span>

                        <span>
                          {item.dtc_count} DTC
                        </span>

                      </div>


                      {item.top_finding && (
                        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">

                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                            {language === "ro"
                              ? "Rezultatul principal"
                              : "Top finding"}
                          </p>

                          <p className="mt-2 font-semibold text-zinc-200">
                            {
                              item
                                .top_finding
                            }
                          </p>

                          {item.top_score !==
                            null && (
                            <p className="mt-1 text-sm text-cyan-400">
                              {language === "ro"
                                ? "Scor: "
                                : "Score: "}
                              {
                                item
                                  .top_score
                              }
                              /100
                            </p>
                          )}

                        </div>
                      )}


                      <p className="mt-4 break-all font-mono text-xs text-zinc-600">
                        {item.case_id}
                      </p>

                    </div>


                    <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">

                      <button
                        type="button"
                        onClick={() =>
                          openCase(
                            item,
                            "analysis"
                          )
                        }
                        className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                      >
                        {language === "ro"
                          ? "Deschide rezultatele"
                          : "Open results"}
                      </button>

                      {item.analyzed_at && (
                        <button
                          type="button"
                          onClick={() =>
                            openCase(
                              item,
                              "report"
                            )
                          }
                          className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900"
                        >
                          {language === "ro"
                            ? "Vezi raportul"
                            : "View report"}
                        </button>
                      )}

                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        )}


        <div className="mt-10">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/welcome"
              )
            }
            className="text-sm text-zinc-500 underline underline-offset-4 transition hover:text-zinc-300"
          >
            {language === "ro"
              ? "Înapoi la pagina de început"
              : "Back to welcome"}
          </button>

        </div>

      </div>

    </main>
  );
}