"use client";

import { FormEvent, useEffect, useState } from "react";
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
  | "other"
  | "";

type Vehicle = {
  manufacturer: string;
  model: string;
  fuel: string;
  year: number | null;
  vehicle_match: "exact" | "partial";
};

export default function SymptomsPage() {
  const router = useRouter();

  const [language, setLanguage] = useState<Language>("en");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const [category, setCategory] =
    useState<SymptomCategory>("");

  const [description, setDescription] = useState("");
  const [dtcInput, setDtcInput] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage === "en" || savedLanguage === "ro") {
      setLanguage(savedLanguage);
    }

    const savedVehicle =
      localStorage.getItem("diagnosticVehicle");

    if (savedVehicle) {
      try {
        setVehicle(JSON.parse(savedVehicle));
      } catch {
        setVehicle(null);
      }
    }
  }, []);

  const content = {
    en: {
      step: "STEP 2 OF DIAGNOSIS",
      title: "What are you noticing?",
      description:
        "You do not need technical automotive knowledge. Choose the option that best matches what you notice and describe the problem in your own words.",

      vehicle: "Vehicle",

      chooseCategory: "Choose the closest symptom",

      power: "Loss of power or poor acceleration",
      starting: "Starting or engine running problem",
      noise: "Unusual noise or vibration",
      smoke: "Smoke or unusual smell",
      warning: "Dashboard warning light",
      brakes: "Braking or steering problem",
      temperature: "Overheating or temperature problem",
      other: "Something else",

      describe: "Describe what happens",
      describePlaceholder:
        "Example: The car feels weak when I accelerate uphill and sometimes the engine warning light comes on.",

      descriptionHelp:
        "Write what you see, hear, feel or smell. You don't need to know the technical cause.",

      dtc: "Diagnostic trouble code (optional)",
      dtcPlaceholder: "Example: P0299",
      dtcHelp:
        "If you scanned the vehicle and received a code such as P0300 or P0299, enter it here. If you don't have one, leave this field empty.",

      requiredCategory:
        "Select the symptom that most closely matches the problem.",

      requiredDescription:
        "Describe what you notice before continuing.",

      invalidDtc:
        "The DTC code does not appear to be valid. Example format: P0299.",

      continue: "Continue",
    },

    ro: {
      step: "PASUL 2 AL DIAGNOZEI",
      title: "Ce observi la mașină?",
      description:
        "Nu trebuie să cunoști termeni tehnici auto. Alege varianta care seamănă cel mai mult cu problema și descrie ce se întâmplă în propriile cuvinte.",

      vehicle: "Vehicul",

      chooseCategory: "Alege simptomul cel mai apropiat",

      power: "Lipsă de putere sau accelerație slabă",
      starting: "Problemă la pornire sau funcționarea motorului",
      noise: "Zgomot sau vibrații neobișnuite",
      smoke: "Fum sau miros neobișnuit",
      warning: "Martor aprins în bord",
      brakes: "Problemă la frânare sau direcție",
      temperature: "Supraîncălzire sau problemă de temperatură",
      other: "Altă problemă",

      describe: "Descrie ce se întâmplă",
      describePlaceholder:
        "Exemplu: Mașina nu mai trage bine când accelerez în rampă și uneori se aprinde martorul motor.",

      descriptionHelp:
        "Scrie ce vezi, auzi, simți sau miroși. Nu trebuie să știi cauza tehnică.",

      dtc: "Cod de eroare DTC (opțional)",
      dtcPlaceholder: "Exemplu: P0299",
      dtcHelp:
        "Dacă ai scanat mașina și ai primit un cod precum P0300 sau P0299, introdu-l aici. Dacă nu ai un cod, lasă câmpul gol.",

      requiredCategory:
        "Selectează simptomul care seamănă cel mai mult cu problema.",

      requiredDescription:
        "Descrie ce observi înainte de a continua.",

      invalidDtc:
        "Codul DTC nu pare valid. Exemplu de format: P0299.",

      continue: "Continuă",
    },
  };

  const text = content[language];

  const categories: {
    id: SymptomCategory;
    label: string;
  }[] = [
    {
      id: "power",
      label: text.power,
    },
    {
      id: "starting",
      label: text.starting,
    },
    {
      id: "noise",
      label: text.noise,
    },
    {
      id: "smoke",
      label: text.smoke,
    },
    {
      id: "warning",
      label: text.warning,
    },
    {
      id: "brakes",
      label: text.brakes,
    },
    {
      id: "temperature",
      label: text.temperature,
    },
    {
      id: "other",
      label: text.other,
    },
  ];

  const normalizeDtc = (value: string) => {
    return value.trim().toUpperCase();
  };

  const isValidDtc = (value: string) => {
    return /^[PBCU][0-9A-F]{4}$/.test(value);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!category) {
      setError(text.requiredCategory);
      return;
    }

    if (!description.trim()) {
      setError(text.requiredDescription);
      return;
    }

    const normalizedDtc = normalizeDtc(dtcInput);

    if (
      normalizedDtc &&
      !isValidDtc(normalizedDtc)
    ) {
      setError(text.invalidDtc);
      return;
    }

    const symptoms = {
      primary_category: category,

      description: description.trim(),

      dtc_codes: normalizedDtc
        ? [normalizedDtc]
        : [],

      created_at: new Date().toISOString(),
    };

    localStorage.setItem(
      "diagnosticSymptoms",
      JSON.stringify(symptoms)
    );

    router.push("/diagnosis/questions");
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          {text.step}
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          {text.title}
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          {text.description}
        </p>

        {/* VEHICLE SUMMARY */}
        {vehicle && (
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {text.vehicle}
            </p>

            <p className="mt-2 font-semibold">
              {vehicle.manufacturer} {vehicle.model}
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              {vehicle.fuel}
              {vehicle.year
                ? ` • ${vehicle.year}`
                : ""}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-10"
        >
          {/* SYMPTOM CATEGORY */}
          <section>
            <h2 className="text-lg font-semibold">
              {text.chooseCategory}
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setCategory(item.id)
                  }
                  className={`rounded-xl border p-4 text-left text-sm transition ${
                    category === item.id
                      ? "border-white bg-white text-black"
                      : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          {/* DESCRIPTION */}
          <section>
            <label className="block text-lg font-semibold">
              {text.describe}
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder={
                text.describePlaceholder
              }
              rows={5}
              className="mt-4 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 leading-6 outline-none transition focus:border-zinc-500"
            />

            <p className="mt-2 text-sm text-zinc-500">
              {text.descriptionHelp}
            </p>
          </section>

          {/* DTC */}
          <section>
            <label className="block text-lg font-semibold">
              {text.dtc}
            </label>

            <input
              type="text"
              value={dtcInput}
              onChange={(event) =>
                setDtcInput(event.target.value)
              }
              placeholder={text.dtcPlaceholder}
              className="mt-4 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 uppercase outline-none transition focus:border-zinc-500"
            />

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {text.dtcHelp}
            </p>
          </section>

          {/* ERROR */}
          {error && (
            <div className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            {text.continue}
          </button>
        </form>
      </div>
    </main>
  );
}