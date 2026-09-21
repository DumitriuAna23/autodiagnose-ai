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

type SymptomRecord = {
  id: string;
  primary_category: Exclude<SymptomCategory, "">;
  description: string;
  created_at: string;
};

export default function SymptomsPage() {
  const router = useRouter();

  const [language, setLanguage] =
    useState<Language>("en");

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [
    existingSymptoms,
    setExistingSymptoms,
  ] = useState<SymptomRecord[]>([]);

  const [category, setCategory] =
    useState<SymptomCategory>("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    dtcInput,
    setDtcInput,
  ] = useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("language");

    if (
      savedLanguage === "en" ||
      savedLanguage === "ro"
    ) {
      setLanguage(savedLanguage);
    }

    const savedVehicle =
      localStorage.getItem(
        "diagnosticVehicle"
      );

    if (savedVehicle) {
      try {
        setVehicle(
          JSON.parse(savedVehicle)
        );
      } catch {
        setVehicle(null);
      }
    }

    const savedSymptoms =
      localStorage.getItem(
        "diagnosticSymptoms"
      );

    if (savedSymptoms) {
      try {
        const parsedSymptoms =
          JSON.parse(savedSymptoms);

        if (
          Array.isArray(
            parsedSymptoms
          )
        ) {
          setExistingSymptoms(
            parsedSymptoms
          );
        } else {
          setExistingSymptoms([]);
        }
      } catch {
        setExistingSymptoms([]);
      }
    }
  }, []);

  const content = {
    en: {
      step:
        "STEP 2 OF DIAGNOSIS",

      title:
        "What are you noticing?",

      description:
        "You can add more than one symptom. Describe one problem at a time, answer a few questions about it, then add another symptom if needed.",

      vehicle:
        "Vehicle",

      previousSymptoms:
        "Symptoms already added",

      chooseCategory:
        "Choose the closest symptom",

      power:
        "Loss of power or poor acceleration",

      starting:
        "Starting or engine running problem",

      noise:
        "Unusual noise or vibration",

      smoke:
        "Smoke or unusual smell",

      warning:
        "Dashboard warning light",

      brakes:
        "Braking or steering problem",

      temperature:
        "Overheating or temperature problem",

      other:
        "Something else",

      duplicate:
        "You already added a symptom from this category. You can continue if this is a different problem or manifestation.",

      describe:
        "Describe what happens",

      describeOther:
        "Describe the problem",

      describePlaceholder:
        "Example: The car feels weak when I accelerate uphill and sometimes the engine warning light comes on.",

      describeOtherPlaceholder:
        "Describe exactly what you notice, even if it does not match any of the categories above.",

      descriptionHelp:
        "Write what you see, hear, feel or smell. You don't need to know the technical cause.",

      otherDescriptionHelp:
        "Describe the problem freely. AutoDiagnose AI will analyze the text together with any DTC codes you provide.",

      dtc:
        "Diagnostic trouble code(s) — optional",

      dtcPlaceholder:
        "Example: P0299 or P0299, P0401",

      dtcHelp:
        "You can enter one or more diagnostic codes if you have them. Separate them using spaces or commas.",

      requiredCategory:
        "Select the symptom that most closely matches the problem.",

      requiredDescription:
        "Describe what you notice before continuing.",

      invalidDtc:
        "One or more DTC codes do not appear valid. Example: P0299.",

      continue:
        "Continue to questions",

      continueOther:
        "Save symptom",
    },

    ro: {
      step:
        "PASUL 2 AL DIAGNOZEI",

      title:
        "Ce observi la mașină?",

      description:
        "Poți adăuga mai multe simptome. Descrie câte o problemă pe rând, răspunde la câteva întrebări despre ea, apoi poți adăuga alt simptom.",

      vehicle:
        "Vehicul",

      previousSymptoms:
        "Simptome deja adăugate",

      chooseCategory:
        "Alege simptomul cel mai apropiat",

      power:
        "Lipsă de putere sau accelerație slabă",

      starting:
        "Problemă la pornire sau funcționarea motorului",

      noise:
        "Zgomot sau vibrații neobișnuite",

      smoke:
        "Fum sau miros neobișnuit",

      warning:
        "Martor aprins în bord",

      brakes:
        "Problemă la frânare sau direcție",

      temperature:
        "Supraîncălzire sau problemă de temperatură",

      other:
        "Altă problemă",

      duplicate:
        "Ai adăugat deja un simptom din această categorie. Poți continua dacă este o problemă sau manifestare diferită.",

      describe:
        "Descrie ce se întâmplă",

      describeOther:
        "Descrie problema",

      describePlaceholder:
        "Exemplu: Mașina nu mai trage când accelerez în rampă și uneori se aprinde martorul motor.",

      describeOtherPlaceholder:
        "Descrie exact ce observi, chiar dacă problema nu se potrivește cu niciuna dintre categoriile de mai sus.",

      descriptionHelp:
        "Scrie ce vezi, auzi, simți sau miroși. Nu trebuie să știi cauza tehnică.",

      otherDescriptionHelp:
        "Descrie problema liber. AutoDiagnose AI va analiza textul împreună cu eventualele coduri DTC introduse.",

      dtc:
        "Coduri de diagnoză DTC — opțional",

      dtcPlaceholder:
        "Exemplu: P0299 sau P0299, P0401",

      dtcHelp:
        "Dacă ai făcut o diagnoză, poți introduce unul sau mai multe coduri DTC, separate prin spațiu sau virgulă.",

      requiredCategory:
        "Selectează simptomul care seamănă cel mai mult cu problema.",

      requiredDescription:
        "Descrie ce observi înainte de a continua.",

      invalidDtc:
        "Unul sau mai multe coduri DTC nu par valide. Exemplu: P0299.",

      continue:
        "Continuă către întrebări",

      continueOther:
        "Salvează simptomul",
    },
  };

  const text =
    content[language];

  const categories: {
    id: Exclude<
      SymptomCategory,
      ""
    >;
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

  const getCategoryLabel = (
    symptomCategory: Exclude<
      SymptomCategory,
      ""
    >
  ) => {
    const categoryItem =
      categories.find(
        (item) =>
          item.id ===
          symptomCategory
      );

    return (
      categoryItem?.label ??
      symptomCategory
    );
  };

  const parseDtcCodes = (
    value: string
  ) => {
    return value
      .toUpperCase()
      .split(/[\s,;]+/)
      .map((code) =>
        code.trim()
      )
      .filter(Boolean);
  };

  const isValidDtc = (
    value: string
  ) => {
    return /^[PBCU][0-9A-F]{4}$/.test(
      value
    );
  };

  const duplicateCategory =
    category !== "" &&
    existingSymptoms.some(
      (symptom) =>
        symptom.primary_category ===
        category
    );

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!category) {
      setError(
        text.requiredCategory
      );
      return;
    }

    if (
      !description.trim()
    ) {
      setError(
        text.requiredDescription
      );
      return;
    }

    const dtcCodes =
      parseDtcCodes(
        dtcInput
      );

    const invalidDtcExists =
      dtcCodes.some(
        (code) =>
          !isValidDtc(code)
      );

    if (invalidDtcExists) {
      setError(
        text.invalidDtc
      );
      return;
    }

    const symptomId =
      `symptom-${Date.now()}`;

    const newSymptom:
      SymptomRecord = {
      id: symptomId,
      primary_category:
        category,
      description:
        description.trim(),
      created_at:
        new Date().toISOString(),
    };

    const updatedSymptoms = [
      ...existingSymptoms,
      newSymptom,
    ];

    localStorage.setItem(
      "diagnosticSymptoms",
      JSON.stringify(
        updatedSymptoms
      )
    );

    localStorage.setItem(
      "currentSymptomId",
      symptomId
    );

    const savedDtcCodes =
      localStorage.getItem(
        "diagnosticDtcCodes"
      );

    let previousDtcCodes:
      string[] = [];

    if (savedDtcCodes) {
      try {
        const parsedCodes =
          JSON.parse(
            savedDtcCodes
          );

        if (
          Array.isArray(
            parsedCodes
          )
        ) {
          previousDtcCodes =
            parsedCodes;
        }
      } catch {
        previousDtcCodes = [];
      }
    }

    const combinedDtcCodes =
      Array.from(
        new Set([
          ...previousDtcCodes,
          ...dtcCodes,
        ])
      );

    localStorage.setItem(
      "diagnosticDtcCodes",
      JSON.stringify(
        combinedDtcCodes
      )
    );

    /*
      OTHER:
      nu mai mergem la
      întrebările adaptive.

      Avem doar:
      - descriere
      - DTC opțional
    */
    if (
      category === "other"
    ) {
      router.push(
        "/diagnosis/symptom-complete"
      );
      return;
    }

    router.push(
      "/diagnosis/questions"
    );
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

        {/* VEHICLE */}

        {vehicle && (
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {text.vehicle}
            </p>

            <p className="mt-2 font-semibold">
              {
                vehicle.manufacturer
              }{" "}
              {
                vehicle.model
              }
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              {vehicle.fuel}

              {vehicle.year
                ? ` • ${vehicle.year}`
                : ""}
            </p>

          </div>
        )}


        {/* PREVIOUS SYMPTOMS */}

        {existingSymptoms.length >
          0 && (
          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {
                text.previousSymptoms
              }
            </p>

            <div className="mt-4 space-y-3">

              {existingSymptoms.map(
                (
                  symptom,
                  index
                ) => (
                  <div
                    key={
                      symptom.id
                    }
                    className="rounded-lg bg-zinc-900 p-4"
                  >
                    <p className="font-medium">
                      {index + 1}.{" "}
                      {
                        getCategoryLabel(
                          symptom.primary_category
                        )
                      }
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      {
                        symptom.description
                      }
                    </p>
                  </div>
                )
              )}

            </div>

          </div>
        )}


        <form
          onSubmit={
            handleSubmit
          }
          className="mt-10 space-y-10"
        >

          {/* CATEGORY */}

          <section>

            <h2 className="text-lg font-semibold">
              {
                text.chooseCategory
              }
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              {categories.map(
                (item) => (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={() =>
                      setCategory(
                        item.id
                      )
                    }
                    className={`rounded-xl border p-4 text-left text-sm transition ${
                      category ===
                      item.id
                        ? "border-white bg-white text-black"
                        : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    {
                      item.label
                    }
                  </button>
                )
              )}

            </div>

            {duplicateCategory && (
              <div className="mt-4 rounded-xl border border-amber-900 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
                {
                  text.duplicate
                }
              </div>
            )}

          </section>


          {/* DESCRIPTION */}

          <section>

            <label className="block text-lg font-semibold">
              {category ===
              "other"
                ? text.describeOther
                : text.describe}
            </label>

            <textarea
              value={
                description
              }
              onChange={(
                event
              ) =>
                setDescription(
                  event.target
                    .value
                )
              }
              placeholder={
                category ===
                "other"
                  ? text.describeOtherPlaceholder
                  : text.describePlaceholder
              }
              rows={5}
              className="mt-4 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 leading-6 outline-none transition focus:border-zinc-500"
            />

            <p className="mt-2 text-sm text-zinc-500">
              {category ===
              "other"
                ? text.otherDescriptionHelp
                : text.descriptionHelp}
            </p>

          </section>


          {/* DTC */}

          <section>

            <label className="block text-lg font-semibold">
              {text.dtc}
            </label>

            <input
              type="text"
              value={
                dtcInput
              }
              onChange={(
                event
              ) =>
                setDtcInput(
                  event.target
                    .value
                )
              }
              placeholder={
                text.dtcPlaceholder
              }
              className="mt-4 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 uppercase outline-none transition focus:border-zinc-500"
            />

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {text.dtcHelp}
            </p>

          </section>


          {error && (
            <div className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}


          <button
            type="submit"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            {category ===
            "other"
              ? text.continueOther
              : text.continue}
          </button>

        </form>

      </div>
    </main>
  );
}