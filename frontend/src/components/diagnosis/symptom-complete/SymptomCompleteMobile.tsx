"use client";

import {
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
  | "other";


type SymptomRecord = {
  id: string;

  primary_category:
    SymptomCategory;

  description: string;

  created_at: string;
};


type AdaptiveAnswer = {
  question_id?: string;

  question?: string;

  answer?: unknown;

  symptom_id?: string;
};


const categoryLabels:
  Record<
    SymptomCategory,
    {
      en: string;
      ro: string;
      code: string;
    }
  > = {
  power: {
    en:
      "Loss of power / acceleration",

    ro:
      "Lipsă de putere / accelerație",

    code:
      "PWR",
  },

  starting: {
    en:
      "Starting / engine running",

    ro:
      "Pornire / funcționare motor",

    code:
      "ENG",
  },

  noise: {
    en:
      "Noise / vibration",

    ro:
      "Zgomot / vibrații",

    code:
      "NVH",
  },

  smoke: {
    en:
      "Smoke / smell",

    ro:
      "Fum / miros",

    code:
      "EXH",
  },

  warning: {
    en:
      "Dashboard warning",

    ro:
      "Martor în bord",

    code:
      "MIL",
  },

  brakes: {
    en:
      "Braking / steering",

    ro:
      "Frânare / direcție",

    code:
      "CHS",
  },

  temperature: {
    en:
      "Temperature / overheating",

    ro:
      "Temperatură / supraîncălzire",

    code:
      "TMP",
  },

  other: {
    en:
      "Other symptom",

    ro:
      "Alt simptom",

    code:
      "...",
  },
};


function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path
        d="M4 7h16"
        strokeLinecap="round"
      />

      <path
        d="M10 11v6M14 11v6"
        strokeLinecap="round"
      />

      <path
        d="M6.5 7l.7 12a2 2 0 0 0 2 1.9h5.6a2 2 0 0 0 2-1.9l.7-12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9 7V4.8A1.8 1.8 0 0 1 10.8 3h2.4A1.8 1.8 0 0 1 15 4.8V7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export default function SymptomCompleteMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );


  const [
    symptoms,
    setSymptoms,
  ] = useState<
    SymptomRecord[]
  >([]);


  const [
    currentSymptom,
    setCurrentSymptom,
  ] = useState<
    SymptomRecord | null
  >(null);


  const [
    dtcCodes,
    setDtcCodes,
  ] = useState<
    string[]
  >([]);


  const [
    symptomToDelete,
    setSymptomToDelete,
  ] = useState<
    SymptomRecord | null
  >(null);


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


    const savedSymptoms =
      localStorage.getItem(
        "diagnosticSymptoms"
      );


    const currentSymptomId =
      localStorage.getItem(
        "currentSymptomId"
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
          setSymptoms(
            parsedSymptoms
          );


          const symptom =
            parsedSymptoms.find(
              (
                item:
                  SymptomRecord
              ) =>
                item.id ===
                currentSymptomId
            ) ??
            parsedSymptoms[
              parsedSymptoms.length -
                1
            ];


          if (
            symptom
          ) {
            setCurrentSymptom(
              symptom
            );
          }
        }

      } catch {
        setSymptoms(
          []
        );
      }
    }


    const savedDtcCodes =
      localStorage.getItem(
        "diagnosticDtcCodes"
      );


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
          setDtcCodes(
            parsedCodes
          );
        }

      } catch {
        setDtcCodes(
          []
        );
      }
    }
  }, []);


  const content = {
    en: {
      eyebrow:
        "SYMPTOM COMPLETED",

      title:
        "This symptom is ready.",

      description:
        "The symptom and its adaptive answers have been saved.",

      saved:
        "Saved",

      completed:
        "Completed symptom",

      caseProgress:
        "Case progress",

      symptomsRecorded:
        "Symptoms",

      dtcCodes:
        "DTC",

      noDtc:
        "No DTC codes",

      recordedSymptoms:
        "Recorded symptoms",

      current:
        "Current",

      addTitle:
        "Add another symptom",

      addDescription:
        "Report another issue and analyze all symptoms together.",

      addAction:
        "Add symptom",

      finishTitle:
        "All symptoms added",

      finishDescription:
        "Review the complete case before starting the analysis.",

      finishAction:
        "Continue to review",

      back:
        "Back to symptoms",

      missing:
        "The current symptom could not be loaded.",

      delete:
        "Delete symptom",

      deleteEyebrow:
        "REMOVE SYMPTOM",

      deleteTitle:
        "Delete this symptom?",

      deleteDescription:
        "The symptom and its adaptive answers will be removed from this diagnostic case.",

      cancel:
        "Cancel",

      confirmDelete:
        "Delete symptom",

      details:
        "Case details",
    },


    ro: {
      eyebrow:
        "SIMPTOM FINALIZAT",

      title:
        "Simptomul este pregătit.",

      description:
        "Simptomul și răspunsurile adaptive au fost salvate.",

      saved:
        "Salvat",

      completed:
        "Simptom finalizat",

      caseProgress:
        "Progres caz",

      symptomsRecorded:
        "Simptome",

      dtcCodes:
        "DTC",

      noDtc:
        "Fără coduri DTC",

      recordedSymptoms:
        "Simptome înregistrate",

      current:
        "Curent",

      addTitle:
        "Adaugă alt simptom",

      addDescription:
        "Raportează încă o problemă și analizează simptomele împreună.",

      addAction:
        "Adaugă simptom",

      finishTitle:
        "Am adăugat toate simptomele",

      finishDescription:
        "Verifică întregul caz înainte de începerea analizei.",

      finishAction:
        "Continuă la verificare",

      back:
        "Înapoi la simptome",

      missing:
        "Simptomul curent nu a putut fi încărcat.",

      delete:
        "Șterge simptomul",

      deleteEyebrow:
        "ȘTERGERE SIMPTOM",

      deleteTitle:
        "Ștergi acest simptom?",

      deleteDescription:
        "Simptomul și răspunsurile adaptive asociate lui vor fi eliminate din acest caz de diagnostic.",

      cancel:
        "Renunță",

      confirmDelete:
        "Șterge simptomul",

      details:
        "Detalii caz",
    },
  };


  const text =
    content[
      language
    ];


  const currentMeta =
    useMemo(
      () =>
        currentSymptom
          ? categoryLabels[
              currentSymptom
                .primary_category
            ]
          : null,

      [
        currentSymptom,
      ]
    );


  function addAnotherSymptom() {
    localStorage.removeItem(
      "currentSymptomId"
    );


    router.push(
      "/diagnosis/symptoms"
    );
  }


  function finishSymptoms() {
    localStorage.removeItem(
      "currentSymptomId"
    );


    router.push(
      "/diagnosis/review"
    );
  }


  function deleteSymptom(
    symptom:
      SymptomRecord
  ) {
    const updatedSymptoms =
      symptoms.filter(
        (
          item
        ) =>
          item.id !==
          symptom.id
      );


    localStorage.setItem(
      "diagnosticSymptoms",
      JSON.stringify(
        updatedSymptoms
      )
    );


    const savedAnswers =
      localStorage.getItem(
        "diagnosticAnswers"
      );


    if (
      savedAnswers
    ) {
      try {
        const parsedAnswers:
          AdaptiveAnswer[] =
          JSON.parse(
            savedAnswers
          );


        if (
          Array.isArray(
            parsedAnswers
          )
        ) {
          const updatedAnswers =
            parsedAnswers.filter(
              (
                answer
              ) =>
                answer.symptom_id !==
                symptom.id
            );


          localStorage.setItem(
            "diagnosticAnswers",
            JSON.stringify(
              updatedAnswers
            )
          );
        }

      } catch {
        // Keep old draft if it cannot be parsed.
      }
    }


    setSymptoms(
      updatedSymptoms
    );


    setSymptomToDelete(
      null
    );


    if (
      updatedSymptoms.length ===
      0
    ) {
      localStorage.removeItem(
        "currentSymptomId"
      );


      setCurrentSymptom(
        null
      );


      router.replace(
        "/diagnosis/symptoms"
      );


      return;
    }


    if (
      currentSymptom?.id ===
      symptom.id
    ) {
      const replacement =
        updatedSymptoms[
          updatedSymptoms.length -
            1
        ];


      setCurrentSymptom(
        replacement
      );


      localStorage.setItem(
        "currentSymptomId",
        replacement.id
      );
    }
  }


  if (
    !currentSymptom
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
            max-w-[360px]
            rounded-[18px]
            border
            border-white/[0.06]
            bg-[#080d18]
            p-4
            text-center
          "
        >
          <p
            className="
              text-[10px]
              leading-4
              text-zinc-500
            "
          >
            {
              text.missing
            }
          </p>


          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/symptoms"
              )
            }
            className="
              mt-3
              min-h-[40px]
              rounded-[10px]
              bg-blue-500
              px-4
              text-[9px]
              font-semibold
              text-white
            "
          >
            ← {text.back}
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
          pb-4
          pt-4
        "
      >
        {/* SUCCESS HEADER */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[18px]
            border
            border-emerald-400/[0.12]
            bg-emerald-400/[0.025]
            p-3.5
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-12
              -top-14
              h-28
              w-28
              rounded-full
              bg-emerald-400/[0.09]
              blur-[40px]
            "
          />


          <div
            className="
              relative
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-[11px]
                border
                border-emerald-400/20
                bg-emerald-400/[0.08]
                text-[13px]
                font-bold
                text-emerald-300
              "
            >
              ✓
            </div>


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
                  justify-between
                  gap-2
                "
              >
                <p
                  className="
                    text-[6.5px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-emerald-200/60
                  "
                >
                  {
                    text.eyebrow
                  }
                </p>


                <span
                  className="
                    rounded-full
                    border
                    border-emerald-400/10
                    bg-emerald-400/[0.04]
                    px-2
                    py-1
                    text-[6px]
                    font-semibold
                    text-emerald-300/80
                  "
                >
                  ✓ {text.saved}
                </span>
              </div>


              <h1
                className="
                  mt-1.5
                  text-[20px]
                  font-semibold
                  leading-tight
                  tracking-[-0.035em]
                  text-white
                "
              >
                {
                  text.title
                }
              </h1>


              <p
                className="
                  mt-1
                  text-[8px]
                  leading-3.5
                  text-zinc-500
                "
              >
                {
                  text.description
                }
              </p>
            </div>
          </div>
        </section>


        {/* CURRENT SYMPTOM */}

        <section
          className="
            mt-2.5
            rounded-[16px]
            border
            border-emerald-400/[0.10]
            bg-[#05080e]
            p-3
          "
        >
          <div
            className="
              flex
              items-start
              gap-2.5
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
                rounded-[10px]
                border
                border-emerald-400/12
                bg-emerald-400/[0.05]
                text-[7px]
                font-bold
                tracking-[0.07em]
                text-emerald-200
              "
            >
              {
                currentMeta?.code
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
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.1em]
                  text-emerald-200/50
                "
              >
                {
                  text.completed
                }
              </p>


              <h2
                className="
                  mt-0.5
                  truncate
                  text-[11px]
                  font-semibold
                  text-zinc-200
                "
              >
                {
                  currentMeta?.[
                    language
                  ]
                }
              </h2>


              <p
                className="
                  mt-1
                  line-clamp-2
                  text-[8px]
                  leading-3.5
                  text-zinc-600
                "
              >
                {
                  currentSymptom.description
                }
              </p>
            </div>
          </div>
        </section>


        {/* STATS */}

        <section
          className="
            mt-2
            grid
            grid-cols-2
            gap-1.5
          "
        >
          <div
            className="
              rounded-[13px]
              border
              border-white/[0.055]
              bg-[#05080e]
              px-3
              py-2.5
            "
          >
            <p
              className="
                text-[6px]
                uppercase
                tracking-[0.08em]
                text-zinc-700
              "
            >
              {
                text.symptomsRecorded
              }
            </p>

            <p
              className="
                mt-1
                text-[17px]
                font-semibold
                leading-none
                text-zinc-200
              "
            >
              {
                symptoms.length
              }
            </p>
          </div>


          <div
            className="
              rounded-[13px]
              border
              border-white/[0.055]
              bg-[#05080e]
              px-3
              py-2.5
            "
          >
            <p
              className="
                text-[6px]
                uppercase
                tracking-[0.08em]
                text-zinc-700
              "
            >
              {
                text.dtcCodes
              }
            </p>

            <p
              className="
                mt-1
                text-[17px]
                font-semibold
                leading-none
                text-zinc-200
              "
            >
              {
                dtcCodes.length
              }
            </p>
          </div>
        </section>


        {/* MAIN ACTIONS */}

        <section
          className="
            mt-3
            grid
            grid-cols-2
            gap-2
          "
        >
          <button
            type="button"
            onClick={
              addAnotherSymptom
            }
            className="
              rounded-[15px]
              border
              border-white/[0.065]
              bg-[#05080e]
              p-3
              text-left
            "
          >
            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-[8px]
                border
                border-blue-400/12
                bg-blue-500/[0.04]
                text-[15px]
                text-blue-200
              "
            >
              +
            </div>


            <p
              className="
                mt-2
                text-[10px]
                font-semibold
                text-zinc-200
              "
            >
              {
                text.addTitle
              }
            </p>


            <p
              className="
                mt-1
                line-clamp-2
                text-[7px]
                leading-3
                text-zinc-600
              "
            >
              {
                text.addDescription
              }
            </p>


            <div
              className="
                mt-2
                flex
                items-center
                justify-between
                text-[7px]
                font-semibold
                text-blue-300
              "
            >
              <span>
                {
                  text.addAction
                }
              </span>

              <span>
                →
              </span>
            </div>
          </button>


          <button
            type="button"
            onClick={
              finishSymptoms
            }
            className="
              rounded-[15px]
              border
              border-blue-400/20
              bg-blue-500/[0.065]
              p-3
              text-left
              shadow-[0_10px_25px_rgba(37,99,235,0.10)]
            "
          >
            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-[8px]
                border
                border-blue-400/18
                bg-blue-500/[0.10]
                text-[10px]
                font-bold
                text-blue-100
              "
            >
              ✓
            </div>


            <p
              className="
                mt-2
                text-[10px]
                font-semibold
                text-white
              "
            >
              {
                text.finishTitle
              }
            </p>


            <p
              className="
                mt-1
                line-clamp-2
                text-[7px]
                leading-3
                text-zinc-500
              "
            >
              {
                text.finishDescription
              }
            </p>


            <div
              className="
                mt-2
                flex
                items-center
                justify-between
                text-[7px]
                font-semibold
                text-blue-100
              "
            >
              <span>
                {
                  text.finishAction
                }
              </span>

              <span>
                →
              </span>
            </div>
          </button>
        </section>


        {/* DETAILS */}

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
            <div>
              <p
                className="
                  text-[8px]
                  font-semibold
                  text-zinc-400
                "
              >
                {
                  text.details
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-[6px]
                  text-zinc-700
                "
              >
                {
                  text.recordedSymptoms
                }
                {" · "}
                {dtcCodes.length >
                0
                  ? `${dtcCodes.length} DTC`
                  : text.noDtc}
              </p>
            </div>

            <span
              className="
                text-[9px]
                text-zinc-700
              "
            >
              +
            </span>
          </summary>


          <div
            className="
              border-t
              border-white/[0.045]
              p-3
            "
          >
            {/* DTC */}

            {dtcCodes.length >
            0 && (
              <div
                className="
                  flex
                  flex-wrap
                  gap-1
                "
              >
                {dtcCodes.map(
                  (
                    code
                  ) => (
                    <span
                      key={
                        code
                      }
                      className="
                        rounded-[7px]
                        border
                        border-blue-400/10
                        bg-blue-500/[0.035]
                        px-2
                        py-1
                        font-mono
                        text-[6.5px]
                        font-semibold
                        text-blue-200
                      "
                    >
                      {code}
                    </span>
                  )
                )}
              </div>
            )}


            {/* SYMPTOMS */}

            <div
              className={`
                space-y-1

                ${
                  dtcCodes.length >
                  0
                    ? "mt-2"
                    : ""
                }
              `}
            >
              {symptoms.map(
                (
                  symptom,
                  index
                ) => {
                  const isCurrent =
                    symptom.id ===
                    currentSymptom.id;


                  const meta =
                    categoryLabels[
                      symptom
                        .primary_category
                    ];


                  return (
                    <div
                      key={
                        symptom.id
                      }
                      className={`
                        flex
                        items-center
                        gap-2
                        rounded-[10px]
                        border
                        px-2.5
                        py-2

                        ${
                          isCurrent
                            ? "border-emerald-400/10 bg-emerald-400/[0.025]"
                            : "border-white/[0.045] bg-black/10"
                        }
                      `}
                    >
                      <span
                        className={`
                          flex
                          h-6
                          w-6
                          shrink-0
                          items-center
                          justify-center
                          rounded-[7px]
                          text-[6px]
                          font-semibold

                          ${
                            isCurrent
                              ? "bg-emerald-400/[0.07] text-emerald-200"
                              : "bg-white/[0.025] text-zinc-700"
                          }
                        `}
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
                        <div
                          className="
                            flex
                            items-center
                            gap-1.5
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
                              meta[
                                language
                              ]
                            }
                          </p>


                          {isCurrent && (
                            <span
                              className="
                                shrink-0
                                rounded-full
                                border
                                border-emerald-400/10
                                px-1.5
                                py-0.5
                                text-[5px]
                                font-semibold
                                text-emerald-300
                              "
                            >
                              {
                                text.current
                              }
                            </span>
                          )}
                        </div>


                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[6.5px]
                            text-zinc-700
                          "
                        >
                          {
                            symptom.description
                          }
                        </p>
                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          setSymptomToDelete(
                            symptom
                          )
                        }
                        aria-label={
                          text.delete
                        }
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-[8px]
                          border
                          border-white/[0.05]
                          text-zinc-700
                        "
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </details>


        <button
          type="button"
          onClick={() =>
            router.push(
              "/diagnosis/symptoms"
            )
          }
          className="
            mt-3
            text-[7px]
            font-medium
            text-zinc-700
          "
        >
          ← {text.back}
        </button>
      </div>


      {/* DELETE CONFIRMATION */}

      <Modal
        open={
          symptomToDelete !==
          null
        }
        onClose={() =>
          setSymptomToDelete(
            null
          )
        }
        eyebrow={
          text.deleteEyebrow
        }
        title={
          text.deleteTitle
        }
        description={
          text.deleteDescription
        }
      >
        {symptomToDelete && (
          <div>
            <div
              className="
                rounded-[13px]
                border
                border-white/[0.06]
                bg-white/[0.015]
                p-3
              "
            >
              <p
                className="
                  text-[10px]
                  font-semibold
                  text-zinc-200
                "
              >
                {
                  categoryLabels[
                    symptomToDelete
                      .primary_category
                  ][language]
                }
              </p>


              <p
                className="
                  mt-1
                  text-[8px]
                  leading-3.5
                  text-zinc-600
                "
              >
                {
                  symptomToDelete.description
                }
              </p>
            </div>


            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-2
              "
            >
              <button
                type="button"
                onClick={() =>
                  setSymptomToDelete(
                    null
                  )
                }
                className="
                  min-h-[40px]
                  rounded-[10px]
                  border
                  border-white/[0.07]
                  bg-white/[0.015]
                  text-[9px]
                  font-semibold
                  text-zinc-300
                "
              >
                {
                  text.cancel
                }
              </button>


              <button
                type="button"
                onClick={() =>
                  deleteSymptom(
                    symptomToDelete
                  )
                }
                className="
                  min-h-[40px]
                  rounded-[10px]
                  border
                  border-red-400/15
                  bg-red-400/[0.07]
                  text-[9px]
                  font-semibold
                  text-red-200
                "
              >
                {
                  text.confirmDelete
                }
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}