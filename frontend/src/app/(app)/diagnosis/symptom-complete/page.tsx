"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Language = "en" | "ro";

type SymptomCategory =
  | "power"
  | "starting"
  | "noise"
  | "smoke"
  | "warning"
  | "brakes"
  | "temperature"
  | "other";

type SymptomRecord = {
  id: string;
  primary_category: SymptomCategory;
  description: string;
  created_at: string;
};

export default function SymptomCompletePage() {
  const router = useRouter();

  const [language, setLanguage] =
    useState<Language>("en");

  const [symptoms, setSymptoms] =
    useState<SymptomRecord[]>([]);

  const [
    currentSymptom,
    setCurrentSymptom,
  ] = useState<SymptomRecord | null>(
    null
  );

  const [dtcCodes, setDtcCodes] =
    useState<string[]>([]);

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("language");

    if (
      savedLanguage === "en" ||
      savedLanguage === "ro"
    ) {
      setLanguage(savedLanguage);
    }

    const savedSymptoms =
      localStorage.getItem(
        "diagnosticSymptoms"
      );

    const currentSymptomId =
      localStorage.getItem(
        "currentSymptomId"
      );

    if (savedSymptoms) {
      try {
        const parsedSymptoms =
          JSON.parse(savedSymptoms);

        if (
          Array.isArray(parsedSymptoms)
        ) {
          setSymptoms(parsedSymptoms);

          const symptom =
            parsedSymptoms.find(
              (item: SymptomRecord) =>
                item.id ===
                currentSymptomId
            );

          if (symptom) {
            setCurrentSymptom(symptom);
          }
        }
      } catch {
        setSymptoms([]);
      }
    }

    const savedDtcCodes =
      localStorage.getItem(
        "diagnosticDtcCodes"
      );

    if (savedDtcCodes) {
      try {
        const parsedCodes =
          JSON.parse(savedDtcCodes);

        if (
          Array.isArray(parsedCodes)
        ) {
          setDtcCodes(parsedCodes);
        }
      } catch {
        setDtcCodes([]);
      }
    }
  }, []);

  const content = {
    en: {
      eyebrow: "SYMPTOM COMPLETED",

      title:
        "This symptom has been recorded.",

      description:
        "The answers for this symptom were saved. If the vehicle has another problem, add it now so AutoDiagnose AI can analyze the symptoms together.",

      completed: "Completed symptom",

      symptomsRecorded:
        "Symptoms recorded",

      dtcCodes: "DTC codes",

      add:
        "+ Add another symptom",

      finish:
        "I've added all symptoms",

      noDtc: "None entered",
    },

    ro: {
      eyebrow: "SIMPTOM FINALIZAT",

      title:
        "Acest simptom a fost înregistrat.",

      description:
        "Răspunsurile pentru acest simptom au fost salvate. Dacă mașina mai are o problemă, adaug-o acum pentru ca AutoDiagnose AI să poată analiza simptomele împreună.",

      completed: "Simptom finalizat",

      symptomsRecorded:
        "Simptome înregistrate",

      dtcCodes: "Coduri DTC",

      add:
        "+ Adaugă alt simptom",

      finish:
        "Am adăugat toate simptomele",

      noDtc:
        "Nu a fost introdus niciun cod",
    },
  };

  const text = content[language];

  const addAnotherSymptom = () => {
    localStorage.removeItem(
      "currentSymptomId"
    );

    router.push(
      "/diagnosis/symptoms"
    );
  };

  const finishSymptoms = () => {
    localStorage.removeItem(
      "currentSymptomId"
    );

    router.push(
      "/diagnosis/review"
    );
  };

  if (!currentSymptom) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <button
          type="button"
          onClick={() =>
            router.push(
              "/diagnosis/symptoms"
            )
          }
          className="rounded-xl bg-white px-6 py-3 font-semibold text-black"
        >
          {language === "ro"
            ? "Înapoi la simptome"
            : "Back to symptoms"}
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          {text.eyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          {text.title}
        </h1>

        <p className="mt-4 leading-7 text-zinc-400">
          {text.description}
        </p>

        {/* CURRENT SYMPTOM */}
        <div className="mt-8 rounded-xl border border-emerald-900 bg-emerald-950/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            {text.completed}
          </p>

          <p className="mt-3 text-lg font-semibold">
            {currentSymptom.description}
          </p>
        </div>

        {/* CASE SUMMARY */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">
              {text.symptomsRecorded}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {symptoms.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">
              {text.dtcCodes}
            </p>

            <p className="mt-2 font-semibold">
              {dtcCodes.length > 0
                ? dtcCodes.join(", ")
                : text.noDtc}
            </p>
          </div>
        </div>

        {/* ALL SYMPTOMS */}
        {symptoms.length > 1 && (
          <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-sm font-semibold text-zinc-300">
              {text.symptomsRecorded}
            </p>

            <div className="mt-4 space-y-3">
              {symptoms.map(
                (symptom, index) => (
                  <div
                    key={symptom.id}
                    className="rounded-lg bg-zinc-900 px-4 py-3"
                  >
                    <span className="text-zinc-500">
                      {index + 1}.
                    </span>{" "}
                    {symptom.description}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={
              addAnotherSymptom
            }
            className="rounded-xl border border-zinc-700 px-6 py-4 font-semibold transition hover:bg-zinc-900"
          >
            {text.add}
          </button>

          <button
            type="button"
            onClick={finishSymptoms}
            className="rounded-xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-zinc-200"
          >
            {text.finish}
          </button>
        </div>
      </div>
    </main>
  );
}