"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Modal from "@/components/ui/Modal";


type Language =
  | "en"
  | "ro";


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

  vehicle_match:
    | "exact"
    | "partial";
};


type SymptomRecord = {
  id: string;

  primary_category:
    Exclude<
      SymptomCategory,
      ""
    >;

  description: string;

  created_at: string;
};


export default function SymptomsMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );


  const [
    vehicle,
    setVehicle,
  ] = useState<Vehicle | null>(
    null
  );


  const [
    existingSymptoms,
    setExistingSymptoms,
  ] = useState<
    SymptomRecord[]
  >([]);


  const [
    category,
    setCategory,
  ] = useState<SymptomCategory>(
    ""
  );


  const [
    description,
    setDescription,
  ] = useState("");


  const [
    dtcInput,
    setDtcInput,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    descriptionHelpOpen,
    setDescriptionHelpOpen,
  ] = useState(false);


  const [
    dtcHelpOpen,
    setDtcHelpOpen,
  ] = useState(false);


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );


    if (
      savedLanguage === "en" ||
      savedLanguage === "ro"
    ) {
      setLanguage(
        savedLanguage
      );
    }


    const savedVehicle =
      localStorage.getItem(
        "diagnosticVehicle"
      );


    if (
      savedVehicle
    ) {
      try {
        setVehicle(
          JSON.parse(
            savedVehicle
          )
        );
      } catch {
        setVehicle(
          null
        );
      }
    }


    const savedSymptoms =
      localStorage.getItem(
        "diagnosticSymptoms"
      );


    if (
      savedSymptoms
    ) {
      try {
        const parsedSymptoms =
          JSON.parse(
            savedSymptoms
          );


        if (
          Array.isArray(
            parsedSymptoms
          )
        ) {
          setExistingSymptoms(
            parsedSymptoms
          );
        } else {
          setExistingSymptoms(
            []
          );
        }

      } catch {
        setExistingSymptoms(
          []
        );
      }
    }
  }, []);


  const content = {
    en: {
      step:
        "SYMPTOM INTAKE",

      title:
        "What are you noticing?",

      description:
        "Choose the closest symptom, describe what happens, and add DTC codes if you already have them.",

      currentVehicle:
        "Current vehicle",

      exactMatch:
        "Exact match",

      partialMatch:
        "Partial match",

      previousSymptoms:
        "Symptoms already added",

      recorded:
        "recorded",

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
        "This category is already in the case. Continue only if this is a different manifestation.",

      describe:
        "Describe what happens",

      describePlaceholder:
        "Example: The car feels weak when I accelerate uphill and the warning light appears occasionally.",

      descriptionHelp:
        "What should I describe?",

      dtc:
        "DTC codes",

      optional:
        "Optional",

      dtcPlaceholder:
        "P0299, P0401",

      dtcHelp:
        "What is a DTC code?",

      requiredCategory:
        "Select the symptom that most closely matches the problem.",

      requiredDescription:
        "Describe what you notice before continuing.",

      invalidDtc:
        "One or more DTC codes do not appear valid. Example: P0299.",

      continue:
        "Continue to questions",

      snapshot:
        "Case snapshot",

      selectedSymptom:
        "Selected symptom",

      noneSelected:
        "No symptom selected",

      dtcDetected:
        "DTC codes entered",

      noDtc:
        "No DTC codes entered",

      symptomsInCase:
        "Symptoms in case",

      fuel:
        "Fuel",

      year:
        "Year",

      unknown:
        "Unknown",

      vehicleMissing:
        "Vehicle information is not available.",

      changeVehicle:
        "Change vehicle",

      descriptionHelpTitle:
        "Describe the symptom, not the diagnosis",

      descriptionHelpDescription:
        "You do not need technical terminology. Describe only what you can observe.",

      whatYouSee:
        "What you see",

      whatYouHear:
        "What you hear",

      whatYouFeel:
        "What you feel",

      whatYouSmell:
        "What you smell",

      whenItHappens:
        "When it happens",

      dtcHelpTitle:
        "What is a DTC code?",

      dtcHelpDescription:
        "A Diagnostic Trouble Code is read from the vehicle with an OBD-II diagnostic tool.",

      typicalFormat:
        "Typical format",

      dtcExplanation:
        "You can enter one or more codes separated by spaces, commas or semicolons.",
    },


    ro: {
      step:
        "COLECTARE SIMPTOME",

      title:
        "Ce observi la mașină?",

      description:
        "Alege simptomul cel mai apropiat, descrie ce se întâmplă și adaugă codurile DTC dacă le ai deja.",

      currentVehicle:
        "Vehicul curent",

      exactMatch:
        "Potrivire exactă",

      partialMatch:
        "Potrivire parțială",

      previousSymptoms:
        "Simptome deja adăugate",

      recorded:
        "înregistrate",

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
        "Categoria există deja în caz. Continuă doar dacă este o manifestare diferită.",

      describe:
        "Descrie ce se întâmplă",

      describePlaceholder:
        "Exemplu: Mașina nu mai trage când accelerez în rampă și uneori se aprinde martorul motor.",

      descriptionHelp:
        "Ce ar trebui să descriu?",

      dtc:
        "Coduri DTC",

      optional:
        "Opțional",

      dtcPlaceholder:
        "P0299, P0401",

      dtcHelp:
        "Ce este un cod DTC?",

      requiredCategory:
        "Selectează simptomul care seamănă cel mai mult cu problema.",

      requiredDescription:
        "Descrie ce observi înainte de a continua.",

      invalidDtc:
        "Unul sau mai multe coduri DTC nu par valide. Exemplu: P0299.",

      continue:
        "Continuă către întrebări",

      snapshot:
        "Rezumat caz",

      selectedSymptom:
        "Simptom selectat",

      noneSelected:
        "Niciun simptom selectat",

      dtcDetected:
        "Coduri DTC introduse",

      noDtc:
        "Niciun cod DTC introdus",

      symptomsInCase:
        "Simptome în caz",

      fuel:
        "Combustibil",

      year:
        "An",

      unknown:
        "Necunoscut",

      vehicleMissing:
        "Datele vehiculului nu sunt disponibile.",

      changeVehicle:
        "Schimbă vehiculul",

      descriptionHelpTitle:
        "Descrie simptomul, nu diagnosticul",

      descriptionHelpDescription:
        "Nu ai nevoie de termeni tehnici. Descrie doar ceea ce poți observa.",

      whatYouSee:
        "Ce vezi",

      whatYouHear:
        "Ce auzi",

      whatYouFeel:
        "Ce simți",

      whatYouSmell:
        "Ce miroși",

      whenItHappens:
        "Când apare",

      dtcHelpTitle:
        "Ce este un cod DTC?",

      dtcHelpDescription:
        "Un Diagnostic Trouble Code este citit din vehicul cu un tester de diagnoză OBD-II.",

      typicalFormat:
        "Format tipic",

      dtcExplanation:
        "Poți introduce unul sau mai multe coduri separate prin spațiu, virgulă sau punct și virgulă.",
    },
  };


  const text =
    content[
      language
    ];


  const categories: {
    id:
      Exclude<
        SymptomCategory,
        ""
      >;

    label: string;
    code: string;
    hint: string;
  }[] = [
    {
      id:
        "power",

      label:
        text.power,

      code:
        "PWR",

      hint:
        language === "ro"
          ? "Accelerație · cuplu"
          : "Acceleration · torque",
    },

    {
      id:
        "starting",

      label:
        text.starting,

      code:
        "ENG",

      hint:
        language === "ro"
          ? "Pornire · ralanti"
          : "Starting · idle",
    },

    {
      id:
        "noise",

      label:
        text.noise,

      code:
        "NVH",

      hint:
        language === "ro"
          ? "Sunet · vibrații"
          : "Sound · vibration",
    },

    {
      id:
        "smoke",

      label:
        text.smoke,

      code:
        "EXH",

      hint:
        language === "ro"
          ? "Fum · miros"
          : "Smoke · smell",
    },

    {
      id:
        "warning",

      label:
        text.warning,

      code:
        "MIL",

      hint:
        language === "ro"
          ? "Martori · mesaje"
          : "Lights · messages",
    },

    {
      id:
        "brakes",

      label:
        text.brakes,

      code:
        "CHS",

      hint:
        language === "ro"
          ? "Frâne · direcție"
          : "Brakes · steering",
    },

    {
      id:
        "temperature",

      label:
        text.temperature,

      code:
        "TMP",

      hint:
        language === "ro"
          ? "Temperatură · răcire"
          : "Temperature · cooling",
    },

    {
      id:
        "other",

      label:
        text.other,

      code:
        "...",

      hint:
        language === "ro"
          ? "Altă manifestare"
          : "Other behavior",
    },
  ];


  function getCategoryLabel(
    symptomCategory:
      Exclude<
        SymptomCategory,
        ""
      >
  ) {
    const categoryItem =
      categories.find(
        (
          item
        ) =>
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
      .split(
        /[\s,;]+/
      )
      .map(
        (
          code
        ) =>
          code.trim()
      )
      .filter(
        Boolean
      );
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
      [
        dtcInput,
      ]
    );


  const duplicateCategory =
    category !== "" &&
    existingSymptoms.some(
      (
        symptom
      ) =>
        symptom.primary_category ===
        category
    );


  const selectedCategory =
    category
      ? categories.find(
          (
            item
          ) =>
            item.id ===
            category
        )
      : null;


  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(
      ""
    );


    if (
      !category
    ) {
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
        (
          code
        ) =>
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
      id:
        symptomId,

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


    if (
      savedDtcCodes
    ) {
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


  function getFuelLabel(
    fuel:
      string
  ) {
    if (
      language === "en"
    ) {
      if (
        fuel === "petrol"
      ) {
        return "Petrol";
      }

      if (
        fuel === "diesel"
      ) {
        return "Diesel";
      }

      if (
        fuel === "hybrid"
      ) {
        return "Hybrid";
      }

      if (
        fuel === "electric"
      ) {
        return "Electric";
      }


      return fuel;
    }


    if (
      fuel === "petrol"
    ) {
      return "Benzină";
    }

    if (
      fuel === "diesel"
    ) {
      return "Diesel";
    }

    if (
      fuel === "hybrid"
    ) {
      return "Hibrid";
    }

    if (
      fuel === "electric"
    ) {
      return "Electric";
    }


    return fuel;
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
          pb-4
          pt-4
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
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
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-blue-300/55
              "
            >
              {
                text.step
              }
            </p>

            <h1
              className="
                mt-1.5
                text-[23px]
                font-semibold
                leading-[1.05]
                tracking-[-0.045em]
              "
            >
              {
                text.title
              }
            </h1>

            <p
              className="
                mt-1.5
                max-w-[360px]
                text-[9px]
                leading-4
                text-zinc-600
              "
            >
              {
                text.description
              }
            </p>
          </div>


          <div
            className="
              shrink-0
              rounded-[10px]
              border
              border-white/[0.055]
              bg-white/[0.015]
              px-2.5
              py-2
              text-center
            "
          >
            <p
              className="
                text-[15px]
                font-semibold
                leading-none
                text-blue-200
              "
            >
              {
                existingSymptoms.length
              }
            </p>

            <p
              className="
                mt-1
                text-[5.5px]
                uppercase
                tracking-[0.08em]
                text-zinc-700
              "
            >
              {
                text.symptomsInCase
              }
            </p>
          </div>
        </div>


        {/* VEHICLE */}

        <section
          className="
            mt-3
            rounded-[16px]
            border
            border-white/[0.055]
            bg-[#05080e]
            px-3
            py-2.5
          "
        >
          {vehicle ? (
            <div
              className="
                flex
                items-center
                gap-2.5
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
                    text-[6px]
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    text-zinc-700
                  "
                >
                  {
                    text.currentVehicle
                  }
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[10px]
                    font-semibold
                    text-zinc-200
                  "
                >
                  {
                    vehicle.manufacturer
                  }{" "}
                  {
                    vehicle.model
                  }
                </p>
              </div>


              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1.5
                "
              >
                <span
                  className="
                    text-[7px]
                    text-zinc-600
                  "
                >
                  {vehicle.year ??
                    text.unknown}
                  {" · "}
                  {
                    getFuelLabel(
                      vehicle.fuel
                    )
                  }
                </span>

                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full

                    ${
                      vehicle.vehicle_match ===
                      "exact"
                        ? "bg-emerald-400"
                        : "bg-amber-400"
                    }
                  `}
                />
              </div>
            </div>
          ) : (
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
                  text-[8px]
                  text-zinc-600
                "
              >
                {
                  text.vehicleMissing
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
                  text-[7px]
                  font-semibold
                  text-blue-300
                "
              >
                {
                  text.changeVehicle
                }{" "}
                →
              </button>
            </div>
          )}
        </section>


        {/* PREVIOUS SYMPTOMS */}

        {existingSymptoms.length >
          0 && (
          <details
            className="
              mt-2
              overflow-hidden
              rounded-[15px]
              border
              border-white/[0.055]
              bg-[#05080e]
            "
          >
            <summary
              className="
                flex
                cursor-pointer
                list-none
                items-center
                justify-between
                gap-3
                px-3
                py-2.5
              "
            >
              <p
                className="
                  text-[8px]
                  font-semibold
                  text-zinc-400
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
                  px-2
                  py-1
                  text-[6px]
                  font-semibold
                  text-blue-200/60
                "
              >
                {
                  existingSymptoms.length
                }{" "}
                {
                  text.recorded
                }
              </span>
            </summary>


            <div
              className="
                space-y-1
                border-t
                border-white/[0.045]
                px-3
                py-2.5
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
                      flex
                      items-center
                      gap-2
                      rounded-[9px]
                      bg-black/10
                      px-2.5
                      py-2
                    "
                  >
                    <span
                      className="
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-blue-400/10
                        text-[6px]
                        font-semibold
                        text-blue-200
                      "
                    >
                      {
                        index +
                        1
                      }
                    </span>

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <p
                        className="
                          truncate
                          text-[8px]
                          font-semibold
                          text-zinc-400
                        "
                      >
                        {
                          getCategoryLabel(
                            symptom.primary_category
                          )
                        }
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-[7px]
                          text-zinc-700
                        "
                      >
                        {
                          symptom.description
                        }
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </details>
        )}


        <form
          onSubmit={
            handleSubmit
          }
          className="
            mt-3
          "
        >
          {/* CATEGORY */}

          <section>
            <p
              className="
                text-[9px]
                font-semibold
                text-zinc-300
              "
            >
              {
                text.chooseCategory
              }
            </p>


            <div
              className="
                mt-2
                grid
                grid-cols-2
                gap-1.5
              "
            >
              {categories.map(
                (
                  item
                ) => {
                  const selected =
                    category ===
                    item.id;


                  return (
                    <button
                      key={
                        item.id
                      }
                      type="button"
                      onClick={() => {
                        setCategory(
                          item.id
                        );

                        setError(
                          ""
                        );
                      }}
                      className={`
                        relative
                        flex
                        min-h-[58px]
                        min-w-0
                        items-center
                        gap-2
                        overflow-hidden
                        rounded-[13px]
                        border
                        px-2.5
                        py-2
                        text-left

                        ${
                          selected
                            ? "border-blue-400/30 bg-blue-500/[0.075]"
                            : "border-white/[0.055] bg-[#05080e]"
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
                            h-16
                            w-16
                            rounded-full
                            bg-blue-500/[0.11]
                            blur-[25px]
                          "
                        />
                      )}


                      <span
                        className={`
                          relative
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-[9px]
                          border
                          text-[7px]
                          font-bold
                          tracking-[0.06em]

                          ${
                            selected
                              ? "border-blue-400/20 bg-blue-500/[0.10] text-blue-200"
                              : "border-white/[0.05] bg-white/[0.015] text-zinc-700"
                          }
                        `}
                      >
                        {
                          item.code
                        }
                      </span>


                      <span
                        className="
                          relative
                          min-w-0
                          flex-1
                        "
                      >
                        <span
                          className={`
                            block
                            line-clamp-2
                            text-[8.5px]
                            font-medium
                            leading-[1.25]

                            ${
                              selected
                                ? "text-white"
                                : "text-zinc-400"
                            }
                          `}
                        >
                          {
                            item.label
                          }
                        </span>

                        <span
                          className="
                            mt-0.5
                            block
                            truncate
                            text-[5.5px]
                            uppercase
                            tracking-[0.06em]
                            text-zinc-700
                          "
                        >
                          {
                            item.hint
                          }
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
                  mt-2
                  flex
                  items-start
                  gap-2
                  rounded-[10px]
                  border
                  border-amber-400/10
                  bg-amber-400/[0.03]
                  px-2.5
                  py-2
                "
              >
                <span
                  className="
                    mt-1
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-amber-400
                  "
                />

                <p
                  className="
                    text-[7px]
                    leading-3.5
                    text-amber-100/65
                  "
                >
                  {
                    text.duplicate
                  }
                </p>
              </div>
            )}
          </section>


          {/* DESCRIPTION */}

          <section
            className="
              mt-3
              rounded-[16px]
              border
              border-white/[0.055]
              bg-[#05080e]
              p-3
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
              <label
                className="
                  text-[9px]
                  font-semibold
                  text-zinc-300
                "
              >
                {
                  text.describe
                }
              </label>

              <button
                type="button"
                onClick={() =>
                  setDescriptionHelpOpen(
                    true
                  )
                }
                className="
                  text-[7px]
                  font-semibold
                  text-blue-300/60
                "
              >
                {
                  text.descriptionHelp
                }
              </button>
            </div>


            <textarea
              value={
                description
              }
              onChange={(
                event
              ) => {
                setDescription(
                  event.target.value
                );

                setError(
                  ""
                );
              }}
              placeholder={
                text.describePlaceholder
              }
              rows={3}
              className="
                mt-2
                w-full
                resize-none
                rounded-[11px]
                border
                border-white/[0.06]
                bg-black/15
                px-3
                py-2.5
                text-[9px]
                leading-4
                text-zinc-200
                outline-none
                placeholder:text-zinc-700
                focus:border-blue-400/25
              "
            />
          </section>


          {/* DTC */}

          <details
            className="
              mt-2
              overflow-hidden
              rounded-[16px]
              border
              border-white/[0.055]
              bg-[#05080e]
            "
          >
            <summary
              className="
                cursor-pointer
                list-none
                px-3
                py-2.5
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
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      text-zinc-300
                    "
                  >
                    {
                      text.dtc
                    }
                  </p>

                  <span
                    className="
                      rounded-full
                      border
                      border-white/[0.05]
                      px-2
                      py-0.5
                      text-[5.5px]
                      uppercase
                      tracking-[0.08em]
                      text-zinc-700
                    "
                  >
                    {
                      text.optional
                    }
                  </span>
                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  {liveDtcCodes.length >
                    0 && (
                    <span
                      className="
                        rounded-full
                        bg-blue-500/[0.06]
                        px-2
                        py-1
                        text-[6px]
                        font-semibold
                        text-blue-200
                      "
                    >
                      {
                        liveDtcCodes.length
                      }
                    </span>
                  )}

                  <span
                    className="
                      text-[8px]
                      text-zinc-700
                    "
                  >
                    +
                  </span>
                </div>
              </div>
            </summary>


            <div
              className="
                border-t
                border-white/[0.045]
                p-3
              "
            >
              <div
                className="
                  flex
                  justify-end
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setDtcHelpOpen(
                      true
                    )
                  }
                  className="
                    text-[7px]
                    font-semibold
                    text-blue-300/60
                  "
                >
                  {
                    text.dtcHelp
                  }
                </button>
              </div>


              <input
                type="text"
                value={
                  dtcInput
                }
                onChange={(
                  event
                ) => {
                  setDtcInput(
                    event.target.value
                      .toUpperCase()
                  );

                  setError(
                    ""
                  );
                }}
                placeholder={
                  text.dtcPlaceholder
                }
                className="
                  mt-2
                  h-[40px]
                  w-full
                  rounded-[10px]
                  border
                  border-white/[0.06]
                  bg-black/15
                  px-3
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.08em]
                  text-zinc-200
                  outline-none
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
                    mt-2
                    flex
                    flex-wrap
                    gap-1
                  "
                >
                  {liveDtcCodes.map(
                    (
                      code
                    ) => (
                      <span
                        key={
                          code
                        }
                        className={`
                          rounded-[7px]
                          border
                          px-2
                          py-1
                          font-mono
                          text-[7px]
                          font-semibold

                          ${
                            isValidDtc(
                              code
                            )
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
            </div>
          </details>


          {/* COMPACT SNAPSHOT */}

          <section
            className="
              mt-2
              rounded-[16px]
              border
              border-blue-400/[0.09]
              bg-[#05080e]
              p-3
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
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-blue-200/50
                "
              >
                {
                  text.snapshot
                }
              </p>

              <span
                className="
                  text-[6px]
                  text-zinc-700
                "
              >
                {
                  existingSymptoms.length +
                  (
                    category
                      ? 1
                      : 0
                  )
                }{" "}
                {
                  text.symptomsInCase
                }
              </span>
            </div>


            <div
              className="
                mt-2
                grid
                grid-cols-[1.5fr_0.7fr_0.7fr]
                divide-x
                divide-white/[0.045]
                overflow-hidden
                rounded-[10px]
                border
                border-white/[0.05]
              "
            >
              <div
                className="
                  min-w-0
                  px-2.5
                  py-2
                "
              >
                <p
                  className="
                    text-[5.5px]
                    uppercase
                    text-zinc-700
                  "
                >
                  {
                    text.selectedSymptom
                  }
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-[7.5px]
                    font-semibold
                    text-zinc-300
                  "
                >
                  {selectedCategory
                    ? selectedCategory.label
                    : text.noneSelected}
                </p>
              </div>


              <div
                className="
                  min-w-0
                  px-2
                  py-2
                  text-center
                "
              >
                <p
                  className="
                    text-[5.5px]
                    uppercase
                    text-zinc-700
                  "
                >
                  DTC
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    font-semibold
                    text-zinc-300
                  "
                >
                  {
                    liveDtcCodes.length
                  }
                </p>
              </div>


              <div
                className="
                  min-w-0
                  px-2
                  py-2
                  text-center
                "
              >
                <p
                  className="
                    text-[5.5px]
                    uppercase
                    text-zinc-700
                  "
                >
                  {
                    text.year
                  }
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-[8px]
                    font-semibold
                    text-zinc-300
                  "
                >
                  {vehicle?.year ??
                    text.unknown}
                </p>
              </div>
            </div>


            {error && (
              <div
                className="
                  mt-2
                  rounded-[9px]
                  border
                  border-red-400/10
                  bg-red-400/[0.035]
                  px-2.5
                  py-2
                  text-[7.5px]
                  leading-3.5
                  text-red-300
                "
              >
                {error}
              </div>
            )}


            <button
              type="submit"
              className="
                mt-2
                flex
                min-h-[42px]
                w-full
                items-center
                justify-between
                rounded-[11px]
                bg-blue-500
                px-3.5
                text-[9px]
                font-semibold
                text-white
                shadow-[0_10px_25px_rgba(37,99,235,0.16)]
              "
            >
              <span>
                {
                  text.continue
                }
              </span>

              <span>
                →
              </span>
            </button>
          </section>
        </form>
      </div>


      {/* DESCRIPTION HELP */}

      <Modal
        open={
          descriptionHelpOpen
        }
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
            grid-cols-2
            gap-1.5
          "
        >
          {[
            text.whatYouSee,
            text.whatYouHear,
            text.whatYouFeel,
            text.whatYouSmell,
            text.whenItHappens,
          ].map(
            (
              item
            ) => (
              <div
                key={
                  item
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-[10px]
                  border
                  border-white/[0.05]
                  bg-white/[0.015]
                  px-2.5
                  py-2
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
                    text-[9px]
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
        open={
          dtcHelpOpen
        }
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
            rounded-[14px]
            border
            border-blue-400/[0.08]
            bg-blue-500/[0.025]
            p-3
          "
        >
          <p
            className="
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-zinc-700
            "
          >
            {
              text.typicalFormat
            }
          </p>

          <p
            className="
              mt-2
              font-mono
              text-[18px]
              font-semibold
              tracking-[0.08em]
              text-blue-200
            "
          >
            P0299
          </p>

          <p
            className="
              mt-2
              text-[9px]
              leading-4
              text-zinc-500
            "
          >
            {
              text.dtcExplanation
            }
          </p>
        </div>
      </Modal>
    </main>
  );
}