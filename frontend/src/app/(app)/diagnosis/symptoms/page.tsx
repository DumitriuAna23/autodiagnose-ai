"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import Modal from "@/components/ui/Modal";


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

  const [existingSymptoms, setExistingSymptoms] =
    useState<SymptomRecord[]>([]);

  const [category, setCategory] =
    useState<SymptomCategory>("");

  const [description, setDescription] =
    useState("");

  const [dtcInput, setDtcInput] =
    useState("");

  const [error, setError] =
    useState("");

  const [descriptionHelpOpen, setDescriptionHelpOpen] =
    useState(false);

  const [dtcHelpOpen, setDtcHelpOpen] =
    useState(false);


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
      localStorage.getItem("diagnosticVehicle");

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
      localStorage.getItem("diagnosticSymptoms");

    if (savedSymptoms) {
      try {
        const parsedSymptoms =
          JSON.parse(savedSymptoms);

        if (
          Array.isArray(parsedSymptoms)
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
      step: "SYMPTOM INTAKE",
      title: "What are you noticing?",
      description:
        "Choose the closest symptom, describe what happens, and add DTC codes if you already have them.",

      currentVehicle: "Current vehicle",
      exactMatch: "Exact match",
      partialMatch: "Partial match",

      previousSymptoms: "Symptoms already added",
      recorded: "recorded",

      chooseCategory: "Choose the closest symptom",

      power: "Loss of power or poor acceleration",
      starting: "Starting or engine running problem",
      noise: "Unusual noise or vibration",
      smoke: "Smoke or unusual smell",
      warning: "Dashboard warning light",
      brakes: "Braking or steering problem",
      temperature: "Overheating or temperature problem",
      other: "Something else",

      duplicate:
        "This category is already in the case. Continue only if this is a different manifestation.",

      describe: "Describe what happens",
      describePlaceholder:
        "Example: The car feels weak when I accelerate uphill and the warning light appears occasionally.",
      descriptionHelp: "What should I describe?",

      dtc: "DTC codes",
      optional: "Optional",
      dtcPlaceholder: "P0299, P0401",
      dtcHelp: "What is a DTC code?",

      requiredCategory:
        "Select the symptom that most closely matches the problem.",
      requiredDescription:
        "Describe what you notice before continuing.",
      invalidDtc:
        "One or more DTC codes do not appear valid. Example: P0299.",

      continue: "Continue to questions",

      snapshot: "Case snapshot",
      selectedSymptom: "Selected symptom",
      noneSelected: "No symptom selected",
      dtcDetected: "DTC codes entered",
      noDtc: "No DTC codes entered",
      symptomsInCase: "Symptoms in case",

      fuel: "Fuel",
      year: "Year",
      unknown: "Unknown",

      vehicleMissing:
        "Vehicle information is not available.",
      changeVehicle: "Change vehicle",

      descriptionHelpTitle:
        "Describe the symptom, not the diagnosis",
      descriptionHelpDescription:
        "You do not need technical terminology. Describe only what you can observe.",
      whatYouSee: "What you see",
      whatYouHear: "What you hear",
      whatYouFeel: "What you feel",
      whatYouSmell: "What you smell",
      whenItHappens: "When it happens",

      dtcHelpTitle: "What is a DTC code?",
      dtcHelpDescription:
        "A Diagnostic Trouble Code is read from the vehicle with an OBD-II diagnostic tool.",
      typicalFormat: "Typical format",
      dtcExplanation:
        "You can enter one or more codes separated by spaces, commas or semicolons.",
    },

    ro: {
      step: "COLECTARE SIMPTOME",
      title: "Ce observi la mașină?",
      description:
        "Alege simptomul cel mai apropiat, descrie ce se întâmplă și adaugă codurile DTC dacă le ai deja.",

      currentVehicle: "Vehicul curent",
      exactMatch: "Potrivire exactă",
      partialMatch: "Potrivire parțială",

      previousSymptoms: "Simptome deja adăugate",
      recorded: "înregistrate",

      chooseCategory: "Alege simptomul cel mai apropiat",

      power: "Lipsă de putere sau accelerație slabă",
      starting: "Problemă la pornire sau funcționarea motorului",
      noise: "Zgomot sau vibrații neobișnuite",
      smoke: "Fum sau miros neobișnuit",
      warning: "Martor aprins în bord",
      brakes: "Problemă la frânare sau direcție",
      temperature: "Supraîncălzire sau problemă de temperatură",
      other: "Altă problemă",

      duplicate:
        "Categoria există deja în caz. Continuă doar dacă este o manifestare diferită.",

      describe: "Descrie ce se întâmplă",
      describePlaceholder:
        "Exemplu: Mașina nu mai trage când accelerez în rampă și uneori se aprinde martorul motor.",
      descriptionHelp: "Ce ar trebui să descriu?",

      dtc: "Coduri DTC",
      optional: "Opțional",
      dtcPlaceholder: "P0299, P0401",
      dtcHelp: "Ce este un cod DTC?",

      requiredCategory:
        "Selectează simptomul care seamănă cel mai mult cu problema.",
      requiredDescription:
        "Descrie ce observi înainte de a continua.",
      invalidDtc:
        "Unul sau mai multe coduri DTC nu par valide. Exemplu: P0299.",

      continue: "Continuă către întrebări",

      snapshot: "Rezumat caz",
      selectedSymptom: "Simptom selectat",
      noneSelected: "Niciun simptom selectat",
      dtcDetected: "Coduri DTC introduse",
      noDtc: "Niciun cod DTC introdus",
      symptomsInCase: "Simptome în caz",

      fuel: "Combustibil",
      year: "An",
      unknown: "Necunoscut",

      vehicleMissing:
        "Datele vehiculului nu sunt disponibile.",
      changeVehicle: "Schimbă vehiculul",

      descriptionHelpTitle:
        "Descrie simptomul, nu diagnosticul",
      descriptionHelpDescription:
        "Nu ai nevoie de termeni tehnici. Descrie doar ceea ce poți observa.",
      whatYouSee: "Ce vezi",
      whatYouHear: "Ce auzi",
      whatYouFeel: "Ce simți",
      whatYouSmell: "Ce miroși",
      whenItHappens: "Când apare",

      dtcHelpTitle: "Ce este un cod DTC?",
      dtcHelpDescription:
        "Un Diagnostic Trouble Code este citit din vehicul cu un tester de diagnoză OBD-II.",
      typicalFormat: "Format tipic",
      dtcExplanation:
        "Poți introduce unul sau mai multe coduri separate prin spațiu, virgulă sau punct și virgulă.",
    },
  };


  const text =
    content[language];


  const categories: {
    id: Exclude<SymptomCategory, "">;
    label: string;
    code: string;
    hint: string;
  }[] = [
    {
      id: "power",
      label: text.power,
      code: "PWR",
      hint:
        language === "ro"
          ? "Accelerație · cuplu"
          : "Acceleration · torque",
    },
    {
      id: "starting",
      label: text.starting,
      code: "ENG",
      hint:
        language === "ro"
          ? "Pornire · ralanti"
          : "Starting · idle",
    },
    {
      id: "noise",
      label: text.noise,
      code: "NVH",
      hint:
        language === "ro"
          ? "Sunet · vibrații"
          : "Sound · vibration",
    },
    {
      id: "smoke",
      label: text.smoke,
      code: "EXH",
      hint:
        language === "ro"
          ? "Fum · miros"
          : "Smoke · smell",
    },
    {
      id: "warning",
      label: text.warning,
      code: "MIL",
      hint:
        language === "ro"
          ? "Martori · mesaje"
          : "Lights · messages",
    },
    {
      id: "brakes",
      label: text.brakes,
      code: "CHS",
      hint:
        language === "ro"
          ? "Frâne · direcție"
          : "Brakes · steering",
    },
    {
      id: "temperature",
      label: text.temperature,
      code: "TMP",
      hint:
        language === "ro"
          ? "Temperatură · răcire"
          : "Temperature · cooling",
    },
    {
      id: "other",
      label: text.other,
      code: "...",
      hint:
        language === "ro"
          ? "Altă manifestare"
          : "Other behavior",
    },
  ];


  function getCategoryLabel(
    symptomCategory:
      Exclude<SymptomCategory, "">
  ) {
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
  }


  function parseDtcCodes(
    value: string
  ) {
    return value
      .toUpperCase()
      .split(/[\s,;]+/)
      .map((code) =>
        code.trim()
      )
      .filter(Boolean);
  }


  function isValidDtc(
    value: string
  ) {
    return /^[PBCU][0-9A-F]{4}$/.test(
      value
    );
  }


  const liveDtcCodes =
    useMemo(
      () =>
        parseDtcCodes(
          dtcInput
        ),
      [dtcInput]
    );


  const duplicateCategory =
    category !== "" &&
    existingSymptoms.some(
      (symptom) =>
        symptom.primary_category ===
        category
    );


  const selectedCategory =
    category
      ? categories.find(
          (item) =>
            item.id ===
            category
        )
      : null;


  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
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
          !isValidDtc(
            code
          )
      );


    if (
      invalidDtcExists
    ) {
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
          new Date()
            .toISOString(),
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
        previousDtcCodes =
          [];
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


    router.push(
      "/diagnosis/questions"
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

        <div
          className="
            grid
            gap-7
            xl:grid-cols-[minmax(0,1fr)_360px]
            xl:items-start
          "
        >

          {/* MAIN FORM */}

          <section
            className="
              ad-surface
              relative
              overflow-hidden
              rounded-[30px]
              p-6
              sm:p-8
              lg:p-9
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -left-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-blue-500/[0.07]
                blur-[90px]
              "
            />


            <div className="relative">

              <p className="ad-eyebrow">
                {text.step}
              </p>


              <h1
                className="
                  mt-3
                  max-w-2xl
                  text-[2rem]
                  font-semibold
                  leading-[1.12]
                  tracking-[-0.035em]
                  text-white
                  sm:text-[2.35rem]
                "
              >
                {text.title}
              </h1>


              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-zinc-500
                  sm:text-[15px]
                "
              >
                {text.description}
              </p>


              {/* PREVIOUS SYMPTOMS */}

              {existingSymptoms.length >
                0 && (
                <div
                  className="
                    mt-7
                    rounded-2xl
                    border
                    border-white/[0.055]
                    bg-white/[0.014]
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
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-zinc-600
                      "
                    >
                      {
                        text.previousSymptoms
                      }
                    </p>

                    <span
                      className="
                        rounded-full
                        border
                        border-blue-400/10
                        bg-blue-500/[0.04]
                        px-2.5
                        py-1
                        text-[9px]
                        font-medium
                        text-blue-200/60
                      "
                    >
                      {
                        existingSymptoms.length
                      }{" "}
                      {text.recorded}
                    </span>
                  </div>


                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {existingSymptoms.map(
                      (
                        symptom,
                        index
                      ) => (
                        <div
                          key={
                            symptom.id
                          }
                          className="
                            max-w-full
                            rounded-xl
                            border
                            border-white/[0.05]
                            bg-black/15
                            px-3
                            py-2.5
                          "
                        >
                          <p
                            className="
                              text-[10px]
                              font-medium
                              text-zinc-300
                            "
                          >
                            {index + 1}.{" "}
                            {getCategoryLabel(
                              symptom.primary_category
                            )}
                          </p>

                          <p
                            className="
                              mt-1
                              max-w-[300px]
                              truncate
                              text-[10px]
                              text-zinc-700
                            "
                          >
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
                className="mt-8"
              >

                {/* CATEGORY */}

                <section>

                  <p
                    className="
                      text-xs
                      font-semibold
                      text-zinc-300
                    "
                  >
                    {text.chooseCategory}
                  </p>


                  <div
                    className="
                      mt-4
                      grid
                      gap-2.5
                      sm:grid-cols-2
                    "
                  >
                    {categories.map(
                      (item) => {
                        const selected =
                          category ===
                          item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setCategory(
                                item.id
                              );
                              setError("");
                            }}
                            className={`
                              relative
                              flex
                              min-h-[88px]
                              items-center
                              gap-3
                              overflow-hidden
                              rounded-2xl
                              border
                              p-3.5
                              text-left
                              transition-all
                              duration-200
                              ${
                                selected
                                  ? "border-blue-400/25 bg-blue-500/[0.075]"
                                  : "border-white/[0.055] bg-white/[0.014] hover:border-white/[0.10] hover:bg-white/[0.025]"
                              }
                            `}
                          >
                            {selected && (
                              <span
                                className="
                                  pointer-events-none
                                  absolute
                                  -right-6
                                  -top-6
                                  h-20
                                  w-20
                                  rounded-full
                                  bg-blue-500/[0.13]
                                  blur-[30px]
                                "
                              />
                            )}


                            <span
                              className={`
                                relative
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                text-[9px]
                                font-bold
                                tracking-[0.08em]
                                ${
                                  selected
                                    ? "border-blue-400/20 bg-blue-500/[0.10] text-blue-200"
                                    : "border-white/[0.06] bg-white/[0.018] text-zinc-600"
                                }
                              `}
                            >
                              {item.code}
                            </span>


                            <span
                              className="
                                relative
                                min-w-0
                              "
                            >
                              <span
                                className={`
                                  block
                                  text-xs
                                  font-medium
                                  leading-5
                                  ${
                                    selected
                                      ? "text-white"
                                      : "text-zinc-400"
                                  }
                                `}
                              >
                                {item.label}
                              </span>

                              <span
                                className="
                                  mt-1
                                  block
                                  text-[9px]
                                  uppercase
                                  tracking-[0.10em]
                                  text-zinc-700
                                "
                              >
                                {item.hint}
                              </span>
                            </span>

                          </button>
                        );
                      }
                    )}
                  </div>


                  {duplicateCategory && (
                    <div
                      className="
                        mt-3
                        flex
                        items-start
                        gap-2.5
                        rounded-xl
                        border
                        border-amber-400/10
                        bg-amber-400/[0.03]
                        px-3.5
                        py-3
                      "
                    >
                      <span
                        className="
                          mt-1.5
                          h-1.5
                          w-1.5
                          shrink-0
                          rounded-full
                          bg-amber-400
                        "
                      />

                      <p
                        className="
                          text-xs
                          leading-5
                          text-amber-100/65
                        "
                      >
                        {text.duplicate}
                      </p>
                    </div>
                  )}

                </section>


                {/* DESCRIPTION */}

                <section
                  className="
                    mt-7
                    rounded-2xl
                    border
                    border-white/[0.055]
                    bg-white/[0.012]
                    p-4
                    sm:p-5
                  "
                >
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <label
                      className="
                        text-xs
                        font-semibold
                        text-zinc-300
                      "
                    >
                      {text.describe}
                    </label>


                    <button
                      type="button"
                      onClick={() =>
                        setDescriptionHelpOpen(
                          true
                        )
                      }
                      className="
                        text-[11px]
                        font-medium
                        text-blue-300/60
                        transition-colors
                        hover:text-blue-200
                      "
                    >
                      {text.descriptionHelp}
                    </button>
                  </div>


                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    placeholder={
                      text.describePlaceholder
                    }
                    rows={5}
                    className="
                      mt-3
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-white/[0.06]
                      bg-black/20
                      px-4
                      py-3
                      text-sm
                      leading-6
                      text-zinc-200
                      outline-none
                      transition
                      placeholder:text-zinc-700
                      focus:border-blue-400/25
                      focus:bg-blue-500/[0.015]
                    "
                  />
                </section>


                {/* DTC */}

                <section
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-white/[0.055]
                    bg-white/[0.012]
                    p-4
                    sm:p-5
                  "
                >
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <label
                        className="
                          text-xs
                          font-semibold
                          text-zinc-300
                        "
                      >
                        {text.dtc}
                      </label>

                      <span
                        className="
                          rounded-full
                          bg-white/[0.03]
                          px-2
                          py-0.5
                          text-[9px]
                          uppercase
                          tracking-[0.12em]
                          text-zinc-700
                        "
                      >
                        {text.optional}
                      </span>
                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        setDtcHelpOpen(
                          true
                        )
                      }
                      className="
                        text-[11px]
                        font-medium
                        text-blue-300/60
                        transition-colors
                        hover:text-blue-200
                      "
                    >
                      {text.dtcHelp}
                    </button>
                  </div>


                  <input
                    type="text"
                    value={dtcInput}
                    onChange={(event) =>
                      setDtcInput(
                        event.target.value
                          .toUpperCase()
                      )
                    }
                    placeholder={
                      text.dtcPlaceholder
                    }
                    className="
                      mt-3
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.06]
                      bg-black/20
                      px-4
                      font-mono
                      text-sm
                      uppercase
                      tracking-[0.08em]
                      text-zinc-200
                      outline-none
                      transition
                      placeholder:font-sans
                      placeholder:tracking-normal
                      placeholder:text-zinc-700
                      focus:border-blue-400/25
                    "
                  />


                  {liveDtcCodes.length >
                    0 && (
                    <div
                      className="
                        mt-3
                        flex
                        flex-wrap
                        gap-2
                      "
                    >
                      {liveDtcCodes.map(
                        (code) => (
                          <span
                            key={code}
                            className={`
                              rounded-lg
                              border
                              px-2.5
                              py-1.5
                              font-mono
                              text-[10px]
                              font-semibold
                              ${
                                isValidDtc(code)
                                  ? "border-blue-400/10 bg-blue-500/[0.04] text-blue-200/70"
                                  : "border-red-400/10 bg-red-400/[0.035] text-red-300/75"
                              }
                            `}
                          >
                            {code}
                          </span>
                        )
                      )}
                    </div>
                  )}

                </section>


                {/* ERROR */}

                {error && (
                  <div
                    className="
                      mt-5
                      rounded-xl
                      border
                      border-red-400/10
                      bg-red-400/[0.04]
                      px-4
                      py-3
                      text-sm
                      text-red-300
                    "
                  >
                    {error}
                  </div>
                )}


                {/* CTA */}

                <div
                  className="
                    mt-7
                    flex
                    justify-end
                  "
                >
                  <button
                    type="submit"
                    className="
                      group
                      inline-flex
                      min-h-12
                      items-center
                      gap-3
                      rounded-xl
                      bg-blue-500
                      px-5
                      text-sm
                      font-semibold
                      text-white
                      shadow-[0_12px_35px_rgba(37,99,235,0.20)]
                      transition-all
                      duration-200
                      hover:bg-blue-400
                      hover:shadow-[0_15px_40px_rgba(37,99,235,0.25)]
                    "
                  >
                    {text.continue}

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
                </div>

              </form>

            </div>
          </section>


          {/* CASE SNAPSHOT */}

          <aside
            className="
              ad-surface
              relative
              overflow-hidden
              rounded-[30px]
              p-5
              xl:sticky
              xl:top-6
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-20
                h-56
                w-56
                -translate-x-1/2
                rounded-full
                bg-blue-500/[0.08]
                blur-[75px]
              "
            />


            <div className="relative">

              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.20em]
                  text-blue-300/55
                "
              >
                {text.snapshot}
              </p>


              {/* VEHICLE CARD */}

              <div
                className="
                  mt-4
                  rounded-[22px]
                  border
                  border-white/[0.05]
                  bg-[#070c15]
                  p-4
                "
              >
                {vehicle ? (
                  <>
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >
                      <div>
                        <p
                          className="
                            text-[9px]
                            uppercase
                            tracking-[0.14em]
                            text-zinc-700
                          "
                        >
                          {text.currentVehicle}
                        </p>

                        <p
                          className="
                            mt-1.5
                            text-sm
                            font-semibold
                            text-zinc-200
                          "
                        >
                          {vehicle.manufacturer}{" "}
                          {vehicle.model}
                        </p>
                      </div>


                      <span
                        className={`
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-[9px]
                          font-medium
                          ${
                            vehicle.vehicle_match ===
                            "exact"
                              ? "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-300/70"
                              : "border-amber-400/10 bg-amber-400/[0.04] text-amber-300/70"
                          }
                        `}
                      >
                        {vehicle.vehicle_match ===
                        "exact"
                          ? text.exactMatch
                          : text.partialMatch}
                      </span>
                    </div>


                    <div
                      className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-2
                      "
                    >
                      <div
                        className="
                          rounded-xl
                          border
                          border-white/[0.045]
                          bg-white/[0.012]
                          p-3
                        "
                      >
                        <p
                          className="
                            text-[8px]
                            uppercase
                            tracking-[0.12em]
                            text-zinc-700
                          "
                        >
                          {text.fuel}
                        </p>

                        <p
                          className="
                            mt-1.5
                            text-xs
                            font-medium
                            capitalize
                            text-zinc-400
                          "
                        >
                          {vehicle.fuel}
                        </p>
                      </div>


                      <div
                        className="
                          rounded-xl
                          border
                          border-white/[0.045]
                          bg-white/[0.012]
                          p-3
                        "
                      >
                        <p
                          className="
                            text-[8px]
                            uppercase
                            tracking-[0.12em]
                            text-zinc-700
                          "
                        >
                          {text.year}
                        </p>

                        <p
                          className="
                            mt-1.5
                            text-xs
                            font-medium
                            text-zinc-400
                          "
                        >
                          {vehicle.year ??
                            text.unknown}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p
                      className="
                        text-xs
                        leading-5
                        text-zinc-600
                      "
                    >
                      {text.vehicleMissing}
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
                        text-xs
                        font-medium
                        text-blue-300/70
                        transition-colors
                        hover:text-blue-200
                      "
                    >
                      {text.changeVehicle} →
                    </button>
                  </>
                )}
              </div>


              {/* SELECTED SYMPTOM */}

              <div
                className="
                  mt-3
                  rounded-[22px]
                  border
                  border-white/[0.05]
                  bg-white/[0.012]
                  p-4
                "
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.14em]
                    text-zinc-700
                  "
                >
                  {text.selectedSymptom}
                </p>


                {selectedCategory ? (
                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-blue-400/15
                        bg-blue-500/[0.06]
                        text-[9px]
                        font-bold
                        tracking-[0.08em]
                        text-blue-200/75
                      "
                    >
                      {selectedCategory.code}
                    </span>


                    <div className="min-w-0">
                      <p
                        className="
                          text-xs
                          font-medium
                          leading-5
                          text-zinc-300
                        "
                      >
                        {selectedCategory.label}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[9px]
                          uppercase
                          tracking-[0.10em]
                          text-zinc-700
                        "
                      >
                        {selectedCategory.hint}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p
                    className="
                      mt-2
                      text-xs
                      text-zinc-700
                    "
                  >
                    {text.noneSelected}
                  </p>
                )}
              </div>


              {/* DTC SNAPSHOT */}

              <div
                className="
                  mt-3
                  rounded-[22px]
                  border
                  border-white/[0.05]
                  bg-white/[0.012]
                  p-4
                "
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.14em]
                    text-zinc-700
                  "
                >
                  {text.dtcDetected}
                </p>


                {liveDtcCodes.length >
                  0 ? (
                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {liveDtcCodes.map(
                      (code) => (
                        <span
                          key={code}
                          className="
                            rounded-lg
                            border
                            border-blue-400/10
                            bg-blue-500/[0.04]
                            px-2
                            py-1.5
                            font-mono
                            text-[9px]
                            font-semibold
                            text-blue-200/65
                          "
                        >
                          {code}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p
                    className="
                      mt-2
                      text-xs
                      text-zinc-700
                    "
                  >
                    {text.noDtc}
                  </p>
                )}
              </div>


              {/* COUNT */}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-white/[0.045]
                  bg-white/[0.01]
                  px-3.5
                  py-3
                "
              >
                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.12em]
                    text-zinc-700
                  "
                >
                  {text.symptomsInCase}
                </span>

                <span
                  className="
                    text-xs
                    font-semibold
                    text-zinc-400
                  "
                >
                  {existingSymptoms.length}
                </span>
              </div>

            </div>
          </aside>

        </div>

      </div>


      {/* DESCRIPTION HELP */}

      <Modal
        open={descriptionHelpOpen}
        onClose={() =>
          setDescriptionHelpOpen(
            false
          )
        }
        eyebrow={
          language === "ro"
            ? "AJUTOR SIMPTOM"
            : "SYMPTOM HELP"
        }
        title={
          text.descriptionHelpTitle
        }
        description={
          text.descriptionHelpDescription
        }
      >
        <div
          className="
            grid
            gap-2
            sm:grid-cols-2
          "
        >
          {[
            text.whatYouSee,
            text.whatYouHear,
            text.whatYouFeel,
            text.whatYouSmell,
            text.whenItHappens,
          ].map(
            (item) => (
              <div
                key={item}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-white/[0.05]
                  bg-white/[0.015]
                  px-3.5
                  py-3
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-blue-400/70
                  "
                />

                <span
                  className="
                    text-xs
                    text-zinc-400
                  "
                >
                  {item}
                </span>
              </div>
            )
          )}
        </div>
      </Modal>


      {/* DTC HELP */}

      <Modal
        open={dtcHelpOpen}
        onClose={() =>
          setDtcHelpOpen(
            false
          )
        }
        eyebrow={
          language === "ro"
            ? "CODURI OBD-II"
            : "OBD-II CODES"
        }
        title={
          text.dtcHelpTitle
        }
        description={
          text.dtcHelpDescription
        }
      >
        <div
          className="
            rounded-2xl
            border
            border-blue-400/[0.08]
            bg-blue-500/[0.025]
            p-5
          "
        >
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-zinc-700
            "
          >
            {text.typicalFormat}
          </p>

          <p
            className="
              mt-3
              font-mono
              text-2xl
              font-semibold
              tracking-[0.10em]
              text-blue-200
            "
          >
            P0299
          </p>

          <p
            className="
              mt-4
              text-xs
              leading-5
              text-zinc-500
            "
          >
            {text.dtcExplanation}
          </p>
        </div>
      </Modal>

    </main>
  );
}