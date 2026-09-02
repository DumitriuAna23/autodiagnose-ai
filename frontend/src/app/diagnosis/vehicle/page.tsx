"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { vehicleCatalog } from "@/data/vehicleCatalog";
import type { Manufacturer } from "@/data/vehicleCatalog";

type Language = "en" | "ro";

type FuelType =
  | "petrol"
  | "diesel"
  | "hybrid"
  | "electric"
  | "";

export default function VehiclePage() {
  const router = useRouter();

  // Language
  const [language, setLanguage] = useState<Language>("en");

  // Vehicle information
  const [manufacturer, setManufacturer] =
    useState<Manufacturer | "">("");

  const [model, setModel] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [modelNotListed, setModelNotListed] = useState(false);

  const [fuel, setFuel] = useState<FuelType>("");

  const [year, setYear] = useState("");
  const [yearUnknown, setYearUnknown] = useState(false);

  // UI state
  const [error, setError] = useState("");
  const [fuelHelpOpen, setFuelHelpOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] =
    useState(false);

  // Load selected language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage === "en" || savedLanguage === "ro") {
      setLanguage(savedLanguage);
    }
  }, []);

  // Text shown in the interface
  const content = {
    en: {
      step: "STEP 1 OF DIAGNOSIS",
      title: "Identify your vehicle",

      description:
        "Correct vehicle information helps AutoDiagnose AI avoid irrelevant diagnostic conclusions.",

      manufacturer: "Manufacturer",
      selectManufacturer: "Select manufacturer",

      model: "Model",
      selectModel: "Select model",
      modelNotListed: "My model isn't listed",
      manualModel: "Enter your model",
      manualModelPlaceholder: "e.g. Golf Plus",

      fuel: "Fuel type",
      selectFuel: "Select fuel type",
      petrol: "Petrol",
      diesel: "Diesel",
      hybrid: "Hybrid",
      electric: "Electric",
      fuelHelp: "Not sure which one to choose?",

      year: "Year",
      yearPlaceholder: "e.g. 2018",
      yearUnknown: "I don't know the exact year",

      requiredManufacturer:
        "Select a valid manufacturer.",
      requiredModel:
        "Select or enter your vehicle model.",
      requiredFuel:
        "Select the vehicle fuel type.",
      invalidYear:
        "Enter a valid vehicle year.",

      continue: "Continue",
    },

    ro: {
      step: "PASUL 1 AL DIAGNOZEI",
      title: "Identifică vehiculul",

      description:
        "Informațiile corecte despre vehicul ajută AutoDiagnose AI să evite concluziile de diagnostic nepotrivite.",

      manufacturer: "Marcă",
      selectManufacturer: "Alege marca",

      model: "Model",
      selectModel: "Alege modelul",
      modelNotListed: "Modelul meu nu apare în listă",
      manualModel: "Introdu modelul",
      manualModelPlaceholder: "ex. Golf Plus",

      fuel: "Tip combustibil",
      selectFuel: "Alege tipul de combustibil",
      petrol: "Benzină",
      diesel: "Diesel",
      hybrid: "Hibrid",
      electric: "Electric",
      fuelHelp: "Nu știi ce variantă să alegi?",

      year: "An",
      yearPlaceholder: "ex. 2018",
      yearUnknown: "Nu știu anul exact",

      requiredManufacturer:
        "Selectează o marcă validă.",
      requiredModel:
        "Selectează sau introdu modelul vehiculului.",
      requiredFuel:
        "Selectează tipul de combustibil.",
      invalidYear:
        "Introdu un an valid pentru vehicul.",

      continue: "Continuă",
    },
  };

  const text = content[language];

  // Manufacturers from our temporary vehicle catalog
  const manufacturers = Object.keys(
    vehicleCatalog
  ) as Manufacturer[];

  // Models depend on selected manufacturer
  const availableModels =
    manufacturer !== ""
      ? vehicleCatalog[manufacturer]
      : [];

  // When manufacturer changes, reset model information
  const handleManufacturerChange = (
    value: Manufacturer | ""
  ) => {
    setManufacturer(value);

    setModel("");
    setManualModel("");
    setModelNotListed(false);

    setError("");
  };

  // First step when Continue is pressed:
  // validate information and show confirmation
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!manufacturer) {
      setError(text.requiredManufacturer);
      return;
    }

    if (!modelNotListed && !model) {
      setError(text.requiredModel);
      return;
    }

    if (
      modelNotListed &&
      !manualModel.trim()
    ) {
      setError(text.requiredModel);
      return;
    }

    if (!fuel) {
      setError(text.requiredFuel);
      return;
    }

    if (!yearUnknown && year) {
      const numericYear = Number(year);

      const maximumYear =
        new Date().getFullYear() + 1;

      if (
        numericYear < 1950 ||
        numericYear > maximumYear
      ) {
        setError(text.invalidYear);
        return;
      }
    }

    setShowConfirmation(true);
  };

  // Save the vehicle only after the user confirms
  const confirmVehicle = () => {
    const vehicle = {
      manufacturer,
      manufacturer_verified: true,

      model: modelNotListed
        ? manualModel.trim()
        : model,

      model_verified: !modelNotListed,

      fuel,

      year:
        yearUnknown || !year
          ? null
          : Number(year),

      vehicle_match: modelNotListed
        ? "partial"
        : "exact",

      reference_model: null,
    };

    localStorage.setItem(
      "diagnosticVehicle",
      JSON.stringify(vehicle)
    );

    router.push("/diagnosis/symptoms");
  };

  // Friendly fuel label used in confirmation window
  const getFuelLabel = () => {
    if (fuel === "petrol") {
      return language === "ro"
        ? "Benzină"
        : "Petrol";
    }

    if (fuel === "diesel") {
      return "Diesel";
    }

    if (fuel === "hybrid") {
      return language === "ro"
        ? "Hibrid"
        : "Hybrid";
    }

    if (fuel === "electric") {
      return "Electric";
    }

    return "-";
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      {/* MAIN VEHICLE FORM */}
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

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-7"
        >
          {/* MANUFACTURER */}
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              {text.manufacturer}
            </label>

            <select
              value={manufacturer}
              onChange={(event) =>
                handleManufacturerChange(
                  event.target
                    .value as Manufacturer | ""
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-500"
            >
              <option value="">
                {text.selectManufacturer}
              </option>

              {manufacturers.map(
                (manufacturerName) => (
                  <option
                    key={manufacturerName}
                    value={manufacturerName}
                  >
                    {manufacturerName}
                  </option>
                )
              )}
            </select>
          </div>

          {/* MODEL */}
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              {text.model}
            </label>

            <select
              value={model}
              onChange={(event) =>
                setModel(event.target.value)
              }
              disabled={
                !manufacturer ||
                modelNotListed
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <option value="">
                {text.selectModel}
              </option>

              {availableModels.map(
                (modelName) => (
                  <option
                    key={modelName}
                    value={modelName}
                  >
                    {modelName}
                  </option>
                )
              )}
            </select>

            {manufacturer && (
              <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={modelNotListed}
                  onChange={(event) => {
                    const checked =
                      event.target.checked;

                    setModelNotListed(checked);

                    if (checked) {
                      setModel("");
                    } else {
                      setManualModel("");
                    }
                  }}
                />

                {text.modelNotListed}
              </label>
            )}
          </div>

          {/* MANUAL MODEL FALLBACK */}
          {modelNotListed && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <label className="mb-2 block text-sm text-zinc-300">
                {text.manualModel}
              </label>

              <input
                type="text"
                value={manualModel}
                onChange={(event) =>
                  setManualModel(
                    event.target.value
                  )
                }
                placeholder={
                  text.manualModelPlaceholder
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-zinc-500"
              />

              <p className="mt-3 text-xs leading-5 text-zinc-500">
                {language === "ro"
                  ? "Modelul introdus manual va fi marcat ca neverificat. AutoDiagnose AI va limita concluziile specifice modelului până când poate identifica o referință tehnică potrivită."
                  : "A manually entered model will be marked as unverified. AutoDiagnose AI will limit model-specific conclusions until a suitable technical reference can be identified."}
              </p>
            </div>
          )}

          {/* FUEL TYPE */}
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              {text.fuel}
            </label>

            <select
              value={fuel}
              onChange={(event) =>
                setFuel(
                  event.target
                    .value as FuelType
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-500"
            >
              <option value="">
                {text.selectFuel}
              </option>

              <option value="petrol">
                {text.petrol}
              </option>

              <option value="diesel">
                {text.diesel}
              </option>

              <option value="hybrid">
                {text.hybrid}
              </option>

              <option value="electric">
                {text.electric}
              </option>
            </select>

            <button
              type="button"
              onClick={() =>
                setFuelHelpOpen(true)
              }
              className="mt-3 text-sm text-zinc-500 underline underline-offset-4 hover:text-zinc-300"
            >
              {text.fuelHelp}
            </button>
          </div>

          {/* YEAR */}
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              {text.year}
            </label>

            <input
              type="number"
              value={year}
              onChange={(event) =>
                setYear(event.target.value)
              }
              disabled={yearUnknown}
              placeholder={
                text.yearPlaceholder
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
            />

            <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={yearUnknown}
                onChange={(event) => {
                  setYearUnknown(
                    event.target.checked
                  );

                  if (
                    event.target.checked
                  ) {
                    setYear("");
                  }
                }}
              />

              {text.yearUnknown}
            </label>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* CONTINUE BUTTON */}
          <button
            type="submit"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            {text.continue}
          </button>
        </form>
      </div>

      {/* FUEL HELP POPUP */}
      {fuelHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {language === "ro"
                    ? "Cum afli tipul de combustibil?"
                    : "How can you identify the fuel type?"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {language === "ro"
                    ? "Tipul de combustibil este important pentru diagnostic, de aceea trebuie identificat înainte de a continua."
                    : "Fuel type is important for diagnosis, so it must be identified before continuing."}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFuelHelpOpen(false)
                }
                className="text-2xl text-zinc-500 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="rounded-xl bg-zinc-900 p-4">
                <p className="font-semibold">
                  {language === "ro"
                    ? "Benzină"
                    : "Petrol"}
                </p>

                <p className="mt-1 text-zinc-400">
                  {language === "ro"
                    ? "Verifică eticheta de la clapeta rezervorului sau certificatul de înmatriculare."
                    : "Check the fuel-door label or the vehicle registration documents."}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-900 p-4">
                <p className="font-semibold">
                  Diesel
                </p>

                <p className="mt-1 text-zinc-400">
                  {language === "ro"
                    ? "Poate apărea mențiunea Diesel sau Motorină pe clapeta rezervorului ori în documentele vehiculului."
                    : "The fuel door or vehicle documents may indicate Diesel."}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-900 p-4">
                <p className="font-semibold">
                  {language === "ro"
                    ? "Hibrid"
                    : "Hybrid"}
                </p>

                <p className="mt-1 text-zinc-400">
                  {language === "ro"
                    ? "Vehiculul folosește un motor termic împreună cu un sistem electric. Poate avea inscripții Hybrid sau PHEV."
                    : "The vehicle combines a combustion engine with an electric system and may display Hybrid or PHEV markings."}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-900 p-4">
                <p className="font-semibold">
                  Electric
                </p>

                <p className="mt-1 text-zinc-400">
                  {language === "ro"
                    ? "Vehiculul este propulsat electric și are un port pentru încărcarea bateriei."
                    : "The vehicle is electrically powered and has a battery charging port."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setFuelHelpOpen(false)
              }
              className="mt-6 w-full rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
            >
              {language === "ro"
                ? "Am înțeles"
                : "Got it"}
            </button>
          </div>
        </div>
      )}

      {/* VEHICLE CONFIRMATION POPUP */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              {language === "ro"
                ? "CONFIRMARE VEHICUL"
                : "VEHICLE CONFIRMATION"}
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              {manufacturer}{" "}
              {modelNotListed
                ? manualModel.trim()
                : model}
            </h2>

            <div className="mt-6 space-y-3 rounded-xl bg-zinc-900 p-5">
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">
                  {language === "ro"
                    ? "Combustibil"
                    : "Fuel"}
                </span>

                <span className="font-medium">
                  {getFuelLabel()}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">
                  {language === "ro"
                    ? "An"
                    : "Year"}
                </span>

                <span className="font-medium">
                  {yearUnknown || !year
                    ? language === "ro"
                      ? "Necunoscut"
                      : "Unknown"
                    : year}
                </span>
              </div>
            </div>

            {/* VEHICLE MATCH */}
            <div
              className={`mt-5 rounded-xl border p-4 ${
                modelNotListed
                  ? "border-amber-900 bg-amber-950/20"
                  : "border-emerald-900 bg-emerald-950/20"
              }`}
            >
              <p className="font-semibold">
                {language === "ro"
                  ? "Potrivire vehicul: "
                  : "Vehicle match: "}

                {modelNotListed
                  ? "Partial"
                  : "Exact"}
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {modelNotListed
                  ? language === "ro"
                    ? "Marca este verificată, dar modelul a fost introdus manual. AutoDiagnose AI va limita concluziile specifice modelului până când poate identifica o referință tehnică potrivită."
                    : "The manufacturer is verified, but the model was entered manually. AutoDiagnose AI will limit model-specific conclusions until a suitable technical reference can be identified."
                  : language === "ro"
                    ? "Marca și modelul au fost selectate din catalogul vehiculului."
                    : "The manufacturer and model were selected from the vehicle catalog."}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowConfirmation(false)
                }
                className="flex-1 rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-white transition hover:bg-zinc-900"
              >
                {language === "ro"
                  ? "Înapoi"
                  : "Back"}
              </button>

              <button
                type="button"
                onClick={confirmVehicle}
                className="flex-1 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
              >
                {language === "ro"
                  ? "Confirmă vehiculul"
                  : "Confirm vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}