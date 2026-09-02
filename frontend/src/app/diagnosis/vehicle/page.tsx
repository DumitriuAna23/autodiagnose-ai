"use client";

import { useEffect, useState } from "react";

type Language = "en" | "ro";

export default function VehiclePage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage === "en" || savedLanguage === "ro") {
      setLanguage(savedLanguage);
    }
  }, []);

  const content = {
    en: {
      step: "STEP 1 OF DIAGNOSIS",
      title: "Tell us about your vehicle",
      description:
        "Basic vehicle information helps AutoDiagnose AI narrow down relevant systems, faults and diagnostic information.",
      make: "Manufacturer",
      model: "Model",
      year: "Year",
      fuel: "Fuel type",
      selectFuel: "Select fuel type",
      petrol: "Petrol",
      diesel: "Diesel",
      hybrid: "Hybrid",
      electric: "Electric",
      continue: "Continue",
    },

    ro: {
      step: "PASUL 1 AL DIAGNOZEI",
      title: "Spune-ne ce mașină ai",
      description:
        "Informațiile de bază despre vehicul ajută AutoDiagnose AI să restrângă sistemele, defecțiunile și informațiile relevante pentru diagnostic.",
      make: "Producător",
      model: "Model",
      year: "An",
      fuel: "Tip combustibil",
      selectFuel: "Alege tipul",
      petrol: "Benzină",
      diesel: "Diesel",
      hybrid: "Hibrid",
      electric: "Electric",
      continue: "Continuă",
    },
  };

  const text = content[language];

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          {text.step}
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          {text.title}
        </h1>

        <p className="mt-4 max-w-xl leading-7 text-zinc-400">
          {text.description}
        </p>

        <div className="mt-10 space-y-6">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              {text.make}
            </label>

            <input
              type="text"
              placeholder="Volkswagen"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              {text.model}
            </label>

            <input
              type="text"
              placeholder="Golf"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              {text.year}
            </label>

            <input
              type="number"
              placeholder="2018"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              {text.fuel}
            </label>

            <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-500">
              <option value="">{text.selectFuel}</option>
              <option value="petrol">{text.petrol}</option>
              <option value="diesel">{text.diesel}</option>
              <option value="hybrid">{text.hybrid}</option>
              <option value="electric">{text.electric}</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="mt-10 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
        >
          {text.continue}
        </button>
      </div>
    </main>
  );
}