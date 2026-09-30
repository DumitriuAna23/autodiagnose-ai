"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";


type Language =
  | "ro"
  | "en";


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

  created_at?: string;
};


type AdaptiveAnswer = {
  question_id: string;

  question: string;

  answer:
    | string
    | string[];

  symptom_id?: string;
};


type QuestionOption = {
  value: string;

  label: {
    ro: string;
    en: string;
  };

  hint?: {
    ro: string;
    en: string;
  };
};


type AdaptiveQuestion = {
  id: string;

  title: {
    ro: string;
    en: string;
  };

  description: {
    ro: string;
    en: string;
  };

  options:
    QuestionOption[];
};


const questions:
  AdaptiveQuestion[] = [
  {
    id:
      "onset",

    title: {
      ro:
        "Cum a început problema?",

      en:
        "How did the problem begin?",
    },

    description: {
      ro:
        "Momentul apariției poate diferenția o defecțiune bruscă de una care s-a agravat în timp.",

      en:
        "The onset can help distinguish a sudden fault from one that developed gradually.",
    },

    options: [
      {
        value:
          "sudden",

        label: {
          ro:
            "Brusc",

          en:
            "Suddenly",
        },

        hint: {
          ro:
            "A apărut dintr-o dată",

          en:
            "It appeared all at once",
        },
      },

      {
        value:
          "gradual",

        label: {
          ro:
            "Treptat",

          en:
            "Gradually",
        },

        hint: {
          ro:
            "S-a accentuat în timp",

          en:
            "It became worse over time",
        },
      },

      {
        value:
          "after_event",

        label: {
          ro:
            "După un eveniment",

          en:
            "After an event",
        },

        hint: {
          ro:
            "După reparație, alimentare, impact etc.",

          en:
            "After repair, refueling, impact, etc.",
        },
      },

      {
        value:
          "unknown",

        label: {
          ro:
            "Nu știu",

          en:
            "I don't know",
        },
      },
    ],
  },

  {
    id:
      "frequency",

    title: {
      ro:
        "Cât de des apare?",

      en:
        "How often does it happen?",
    },

    description: {
      ro:
        "Frecvența ajută motorul de diagnostic să diferențieze problemele permanente de cele intermitente.",

      en:
        "Frequency helps the diagnostic engine distinguish persistent faults from intermittent ones.",
    },

    options: [
      {
        value:
          "always",

        label: {
          ro:
            "Tot timpul",

          en:
            "Always",
        },

        hint: {
          ro:
            "Problema este prezentă constant",

          en:
            "The problem is constantly present",
        },
      },

      {
        value:
          "intermittent",

        label: {
          ro:
            "Intermitent",

          en:
            "Intermittently",
        },

        hint: {
          ro:
            "Apare și dispare",

          en:
            "It comes and goes",
        },
      },

      {
        value:
          "once",

        label: {
          ro:
            "S-a întâmplat o singură dată",

          en:
            "It happened once",
        },
      },

      {
        value:
          "unknown",

        label: {
          ro:
            "Nu știu",

          en:
            "I don't know",
        },
      },
    ],
  },

  {
    id:
      "performance_change",

    title: {
      ro:
        "S-a schimbat comportamentul mașinii?",

      en:
        "Has the vehicle's performance changed?",
    },

    description: {
      ro:
        "Poate fi vorba de putere redusă, răspuns mai lent, ralanti instabil sau alt comportament diferit.",

      en:
        "This can include reduced power, slower response, unstable idle or other noticeable behavior changes.",
    },

    options: [
      {
        value:
          "yes",

        label: {
          ro:
            "Da",

          en:
            "Yes",
        },

        hint: {
          ro:
            "Comportamentul este clar diferit",

          en:
            "The vehicle clearly behaves differently",
        },
      },

      {
        value:
          "no",

        label: {
          ro:
            "Nu",

          en:
            "No",
        },

        hint: {
          ro:
            "Mașina se comportă normal în rest",

          en:
            "The vehicle otherwise behaves normally",
        },
      },

      {
        value:
          "unknown",

        label: {
          ro:
            "Nu sunt sigur",

          en:
            "I'm not sure",
        },
      },
    ],
  },

  {
    id:
      "conditions",

    title: {
      ro:
        "Când este cel mai evident simptomul?",

      en:
        "When is the symptom most noticeable?",
    },

    description: {
      ro:
        "Alege situația care se apropie cel mai mult. Dacă nu poți identifica una, poți selecta „Nu știu”.",

      en:
        "Choose the situation that fits best. If you cannot identify one, select “I don't know”.",
    },

    options: [
      {
        value:
          "acceleration",

        label: {
          ro:
            "La accelerație",

          en:
            "During acceleration",
        },
      },

      {
        value:
          "idle",

        label: {
          ro:
            "La ralanti",

          en:
            "At idle",
        },
      },

      {
        value:
          "cold_start",

        label: {
          ro:
            "La pornirea la rece",

          en:
            "During cold start",
        },
      },

      {
        value:
          "hot_engine",

        label: {
          ro:
            "Cu motorul cald",

          en:
            "With the engine warm",
        },
      },

      {
        value:
          "braking",

        label: {
          ro:
            "La frânare",

          en:
            "During braking",
        },
      },

      {
        value:
          "turning",

        label: {
          ro:
            "La virare",

          en:
            "While turning",
        },
      },

      {
        value:
          "highway",

        label: {
          ro:
            "La viteză mai mare",

          en:
            "At higher speed",
        },
      },

      {
        value:
          "random",

        label: {
          ro:
            "Fără un tipar clar",

          en:
            "No clear pattern",
        },
      },

      {
        value:
          "unknown",

        label: {
          ro:
            "Nu știu",

          en:
            "I don't know",
        },
      },
    ],
  },

  {
    id:
      "warning_light",

    title: {
      ro:
        "Este aprins vreun martor în bord?",

      en:
        "Is a dashboard warning light on?",
    },

    description: {
      ro:
        "Un martor poate oferi un indiciu suplimentar chiar dacă nu ai un cod DTC disponibil.",

      en:
        "A warning light can provide additional evidence even when no DTC code is available.",
    },

    options: [
      {
        value:
          "yes",

        label: {
          ro:
            "Da",

          en:
            "Yes",
        },
      },

      {
        value:
          "no",

        label: {
          ro:
            "Nu",

          en:
            "No",
        },
      },

      {
        value:
          "unknown",

        label: {
          ro:
            "Nu sunt sigur",

          en:
            "I'm not sure",
        },
      },
    ],
  },
];


const categoryLabels:
  Record<
    SymptomCategory,
    {
      ro: string;
      en: string;
      code: string;
    }
  > = {
  power: {
    ro:
      "Lipsă de putere / accelerație",

    en:
      "Loss of power / acceleration",

    code:
      "PWR",
  },

  starting: {
    ro:
      "Pornire / funcționare motor",

    en:
      "Starting / engine running",

    code:
      "ENG",
  },

  noise: {
    ro:
      "Zgomot / vibrații",

    en:
      "Noise / vibration",

    code:
      "NVH",
  },

  smoke: {
    ro:
      "Fum / miros",

    en:
      "Smoke / smell",

    code:
      "EXH",
  },

  warning: {
    ro:
      "Martor în bord",

    en:
      "Dashboard warning",

    code:
      "MIL",
  },

  brakes: {
    ro:
      "Frânare / direcție",

    en:
      "Braking / steering",

    code:
      "CHS",
  },

  temperature: {
    ro:
      "Temperatură / supraîncălzire",

    en:
      "Temperature / overheating",

    code:
      "TMP",
  },

  other: {
    ro:
      "Alt simptom",

    en:
      "Other symptom",

    code:
      "...",
  },
};


export default function QuestionsMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );


  const [
    currentSymptom,
    setCurrentSymptom,
  ] = useState<
    SymptomRecord | null
  >(
    null
  );


  const [
    totalSymptoms,
    setTotalSymptoms,
  ] = useState(
    0
  );


  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(
    0
  );


  const [
    answers,
    setAnswers,
  ] = useState<
    Record<
      string,
      string
    >
  >({});


  const [
    error,
    setError,
  ] = useState(
    ""
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


    const savedSymptoms =
      localStorage.getItem(
        "diagnosticSymptoms"
      );


    if (
      !savedSymptoms
    ) {
      router.replace(
        "/diagnosis/symptoms"
      );

      return;
    }


    try {
      const parsedSymptoms:
        SymptomRecord[] =
        JSON.parse(
          savedSymptoms
        );


      if (
        !Array.isArray(
          parsedSymptoms
        ) ||
        parsedSymptoms.length ===
          0
      ) {
        router.replace(
          "/diagnosis/symptoms"
        );

        return;
      }


      setTotalSymptoms(
        parsedSymptoms.length
      );


      const currentSymptomId =
        localStorage.getItem(
          "currentSymptomId"
        );


      const symptom =
        parsedSymptoms.find(
          (
            item
          ) =>
            item.id ===
            currentSymptomId
        ) ??
        parsedSymptoms[
          parsedSymptoms.length -
          1
        ];


      setCurrentSymptom(
        symptom
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
            const restored:
              Record<
                string,
                string
              > = {};


            parsedAnswers
              .filter(
                (
                  answer
                ) =>
                  answer.symptom_id ===
                  symptom.id
              )
              .forEach(
                (
                  answer
                ) => {
                  if (
                    typeof answer.answer ===
                    "string"
                  ) {
                    restored[
                      answer.question_id
                    ] =
                      answer.answer;
                  }
                }
              );


            setAnswers(
              restored
            );
          }

        } catch {
          // Ignore invalid old local draft.
        }
      }

    } catch {
      router.replace(
        "/diagnosis/symptoms"
      );
    }

  }, [
    router,
  ]);


  const text = {
    en: {
      eyebrow:
        "ADAPTIVE QUESTIONS",

      title:
        "Let's narrow it down",

      description:
        "A few targeted questions help AutoDiagnose AI weigh the evidence more accurately.",

      question:
        "Question",

      of:
        "of",

      symptomContext:
        "Symptom context",

      currentSymptom:
        "Current symptom",

      symptomsInCase:
        "Symptoms in case",

      answered:
        "Answered",

      diagnosticSignal:
        "Diagnostic signal",

      signalDescription:
        "Each answer adds context to the current symptom. You can choose “I don't know” whenever you are unsure.",

      selectAnswer:
        "Choose one answer to continue.",

      back:
        "Back",

      next:
        "Next question",

      finish:
        "Save answers",

      noDescription:
        "No symptom description available.",

      ready:
        "Context ready",

      incomplete:
        "Waiting for answers",
    },


    ro: {
      eyebrow:
        "ÎNTREBĂRI ADAPTIVE",

      title:
        "Hai să restrângem cauzele",

      description:
        "Câteva întrebări țintite ajută AutoDiagnose AI să cântărească mai corect indiciile.",

      question:
        "Întrebarea",

      of:
        "din",

      symptomContext:
        "Context simptom",

      currentSymptom:
        "Simptom curent",

      symptomsInCase:
        "Simptome în caz",

      answered:
        "Răspunsuri",

      diagnosticSignal:
        "Semnal diagnostic",

      signalDescription:
        "Fiecare răspuns adaugă context simptomului curent. Poți alege „Nu știu” ori de câte ori nu ești sigur.",

      selectAnswer:
        "Alege un răspuns pentru a continua.",

      back:
        "Înapoi",

      next:
        "Următoarea întrebare",

      finish:
        "Salvează răspunsurile",

      noDescription:
        "Descrierea simptomului nu este disponibilă.",

      ready:
        "Context complet",

      incomplete:
        "Așteaptă răspunsuri",
    },
  }[
    language
  ];


  const currentQuestion =
    questions[
      currentQuestionIndex
    ];


  const currentAnswer =
    answers[
      currentQuestion.id
    ] ?? "";


  const answeredCount =
    Object.values(
      answers
    ).filter(
      Boolean
    ).length;


  const progress =
    Math.round(
      (
        answeredCount /
        questions.length
      ) *
        100
    );


  const symptomMeta =
    useMemo(
      () => {
        if (
          !currentSymptom
        ) {
          return null;
        }


        return categoryLabels[
          currentSymptom
            .primary_category
        ];
      },

      [
        currentSymptom,
      ]
    );


  function selectAnswer(
    value:
      string
  ) {
    setAnswers(
      (
        current
      ) => ({
        ...current,

        [
          currentQuestion.id
        ]:
          value,
      })
    );


    setError(
      ""
    );
  }


  function goNext() {
    if (
      !currentAnswer
    ) {
      setError(
        text.selectAnswer
      );

      return;
    }


    if (
      currentQuestionIndex <
      questions.length -
        1
    ) {
      setCurrentQuestionIndex(
        (
          index
        ) =>
          index +
          1
      );

      setError(
        ""
      );

      return;
    }


    saveAnswers();
  }


  function goBack() {
    if (
      currentQuestionIndex ===
      0
    ) {
      router.push(
        "/diagnosis/symptoms"
      );

      return;
    }


    setCurrentQuestionIndex(
      (
        index
      ) =>
        index -
        1
    );


    setError(
      ""
    );
  }


  function saveAnswers() {
    if (
      !currentSymptom
    ) {
      router.replace(
        "/diagnosis/symptoms"
      );

      return;
    }


    if (
      !currentAnswer
    ) {
      setError(
        text.selectAnswer
      );

      return;
    }


    const newAnswers:
      AdaptiveAnswer[] =
      questions.map(
        (
          question
        ) => ({
          question_id:
            question.id,

          question:
            question.title[
              language
            ],

          answer:
            answers[
              question.id
            ],

          symptom_id:
            currentSymptom.id,
        })
      );


    const saved =
      localStorage.getItem(
        "diagnosticAnswers"
      );


    let previousAnswers:
      AdaptiveAnswer[] = [];


    if (
      saved
    ) {
      try {
        const parsed:
          AdaptiveAnswer[] =
          JSON.parse(
            saved
          );


        if (
          Array.isArray(
            parsed
          )
        ) {
          previousAnswers =
            parsed.filter(
              (
                answer
              ) =>
                answer.symptom_id !==
                currentSymptom.id
            );
        }

      } catch {
        previousAnswers =
          [];
      }
    }


    localStorage.setItem(
      "diagnosticAnswers",
      JSON.stringify([
        ...previousAnswers,
        ...newAnswers,
      ])
    );


    router.push(
      "/diagnosis/symptom-complete"
    );
  }


  if (
    !currentSymptom
  ) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#060912]
          text-white
        "
      >
        <p
          className="
            text-[9px]
            text-zinc-600
          "
        >
          AutoDiagnose AI
        </p>
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
                text.eyebrow
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
                max-w-[330px]
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
              border-blue-400/[0.10]
              bg-blue-500/[0.035]
              px-2.5
              py-2
              text-center
            "
          >
            <p
              className="
                text-[13px]
                font-semibold
                leading-none
                text-blue-200
              "
            >
              {currentQuestionIndex +
                1}
              <span
                className="
                  text-[8px]
                  text-zinc-700
                "
              >
                /
                {
                  questions.length
                }
              </span>
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
                text.question
              }
            </p>
          </div>
        </div>


        {/* CURRENT SYMPTOM */}

        <section
          className="
            mt-3
            rounded-[15px]
            border
            border-white/[0.055]
            bg-[#05080e]
            px-3
            py-2.5
          "
        >
          <div
            className="
              flex
              items-center
              gap-2.5
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-[9px]
                border
                border-blue-400/15
                bg-blue-500/[0.06]
                text-[7px]
                font-bold
                tracking-[0.07em]
                text-blue-200
              "
            >
              {
                symptomMeta?.code
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
                  text-[5.5px]
                  font-semibold
                  uppercase
                  tracking-[0.1em]
                  text-zinc-700
                "
              >
                {
                  text.currentSymptom
                }
              </p>


              <p
                className="
                  mt-0.5
                  truncate
                  text-[9px]
                  font-semibold
                  text-zinc-300
                "
              >
                {
                  symptomMeta?.[
                    language
                  ]
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
                {currentSymptom.description ||
                  text.noDescription}
              </p>
            </div>


            <div
              className="
                shrink-0
                text-right
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
                  text.symptomsInCase
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  font-semibold
                  text-zinc-400
                "
              >
                {
                  totalSymptoms
                }
              </p>
            </div>
          </div>
        </section>


        {/* QUESTION NAVIGATION */}

        <section
          className="
            mt-2.5
          "
        >
          <div
            className="
              relative
              grid
              grid-cols-5
              gap-1.5
            "
          >
            {questions.map(
              (
                question,
                index
              ) => {
                const answered =
                  Boolean(
                    answers[
                      question.id
                    ]
                  );


                const active =
                  index ===
                  currentQuestionIndex;


                return (
                  <button
                    key={
                      question.id
                    }
                    type="button"
                    onClick={() => {
                      setCurrentQuestionIndex(
                        index
                      );

                      setError(
                        ""
                      );
                    }}
                    className={`
                      flex
                      min-h-[36px]
                      items-center
                      justify-center
                      rounded-[10px]
                      border
                      text-[8px]
                      font-semibold
                      transition

                      ${
                        active
                          ? "border-blue-400/25 bg-blue-500/[0.08] text-white"
                          : answered
                          ? "border-emerald-400/10 bg-emerald-400/[0.035] text-emerald-300"
                          : "border-white/[0.05] bg-[#05080e] text-zinc-700"
                      }
                    `}
                  >
                    {answered
                      ? "✓"
                      : index +
                        1}
                  </button>
                );
              }
            )}
          </div>


          <div
            className="
              mt-1.5
              h-[2px]
              overflow-hidden
              rounded-full
              bg-white/[0.04]
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-blue-400
                transition-all
                duration-300
              "
              style={{
                width:
                  `${
                    (
                      (
                        currentQuestionIndex +
                        1
                      ) /
                      questions.length
                    ) *
                    100
                  }%`,
              }}
            />
          </div>
        </section>


        {/* QUESTION */}

        <section
          className="
            mt-3
            rounded-[18px]
            border
            border-white/[0.06]
            bg-[#080d18]
            p-3.5
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
                tracking-[0.15em]
                text-blue-300/55
              "
            >
              {String(
                currentQuestionIndex +
                  1
              ).padStart(
                2,
                "0"
              )}
            </p>


            <span
              className="
                text-[6.5px]
                font-medium
                text-zinc-700
              "
            >
              {
                answeredCount
              }
              /
              {
                questions.length
              }{" "}
              {
                text.answered
              }
            </span>
          </div>


          <h2
            className="
              mt-2
              text-[17px]
              font-semibold
              leading-[1.2]
              tracking-[-0.025em]
              text-zinc-100
            "
          >
            {
              currentQuestion
                .title[
                language
              ]
            }
          </h2>


          <p
            className="
              mt-1.5
              text-[8.5px]
              leading-4
              text-zinc-600
            "
          >
            {
              currentQuestion
                .description[
                language
              ]
            }
          </p>


          <div
            className="
              mt-3
              grid
              grid-cols-2
              gap-1.5
            "
          >
            {currentQuestion.options.map(
              (
                option
              ) => {
                const selected =
                  currentAnswer ===
                  option.value;


                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      selectAnswer(
                        option.value
                      )
                    }
                    className={`
                      relative
                      min-h-[54px]
                      overflow-hidden
                      rounded-[12px]
                      border
                      px-2.5
                      py-2.5
                      text-left
                      transition-all
                      duration-200

                      ${
                        selected
                          ? "border-blue-400/30 bg-blue-500/[0.075]"
                          : "border-white/[0.055] bg-black/10"
                      }
                    `}
                  >
                    {selected && (
                      <span
                        className="
                          pointer-events-none
                          absolute
                          -right-5
                          -top-5
                          h-14
                          w-14
                          rounded-full
                          bg-blue-500/[0.13]
                          blur-[22px]
                        "
                      />
                    )}


                    <div
                      className="
                        relative
                        flex
                        items-start
                        gap-2
                      "
                    >
                      <span
                        className={`
                          mt-[1px]
                          flex
                          h-3.5
                          w-3.5
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border

                          ${
                            selected
                              ? "border-blue-300/60 bg-blue-400"
                              : "border-white/10 bg-white/[0.015]"
                          }
                        `}
                      >
                        {selected && (
                          <span
                            className="
                              h-1
                              w-1
                              rounded-full
                              bg-white
                            "
                          />
                        )}
                      </span>


                      <span
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <span
                          className={`
                            block
                            text-[9px]
                            font-semibold
                            leading-3.5

                            ${
                              selected
                                ? "text-white"
                                : "text-zinc-400"
                            }
                          `}
                        >
                          {
                            option.label[
                              language
                            ]
                          }
                        </span>


                        {option.hint && (
                          <span
                            className="
                              mt-0.5
                              block
                              text-[6.5px]
                              leading-3
                              text-zinc-700
                            "
                          >
                            {
                              option.hint[
                                language
                              ]
                            }
                          </span>
                        )}
                      </span>
                    </div>
                  </button>
                );
              }
            )}
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
                text-red-300
              "
            >
              {
                error
              }
            </div>
          )}
        </section>


        {/* DIAGNOSTIC SIGNAL */}

        <section
          className="
            mt-2
            rounded-[15px]
            border
            border-white/[0.05]
            bg-[#05080e]
            px-3
            py-2.5
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
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
                    rounded-full

                    ${
                      answeredCount ===
                      questions.length
                        ? "bg-emerald-400"
                        : "bg-blue-400"
                    }
                  `}
                />

                <p
                  className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    text-zinc-600
                  "
                >
                  {
                    text.diagnosticSignal
                  }
                </p>
              </div>


              <p
                className="
                  mt-1
                  text-[8px]
                  font-medium
                  text-zinc-400
                "
              >
                {answeredCount ===
                questions.length
                  ? text.ready
                  : text.incomplete}
              </p>
            </div>


            <div
              className="
                shrink-0
                text-right
              "
            >
              <p
                className="
                  text-[14px]
                  font-semibold
                  text-blue-200
                "
              >
                {
                  progress
                }
                <span
                  className="
                    text-[7px]
                    text-zinc-700
                  "
                >
                  %
                </span>
              </p>
            </div>
          </div>


          <div
            className="
              mt-2
              h-1
              overflow-hidden
              rounded-full
              bg-white/[0.04]
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-blue-400
                transition-all
                duration-300
              "
              style={{
                width:
                  `${progress}%`,
              }}
            />
          </div>


          <details
            className="
              mt-1.5
            "
          >
            <summary
              className="
                cursor-pointer
                select-none
                text-[6.5px]
                text-zinc-700
              "
            >
              {language === "ro"
                ? "De ce contează?"
                : "Why does this matter?"}
            </summary>

            <p
              className="
                mt-1.5
                text-[7px]
                leading-3.5
                text-zinc-600
              "
            >
              {
                text.signalDescription
              }
            </p>
          </details>
        </section>


        {/* ACTIONS */}

        <div
          className="
            mt-3
            grid
            grid-cols-[0.7fr_1.3fr]
            gap-2
          "
        >
          <button
            type="button"
            onClick={
              goBack
            }
            className="
              min-h-[42px]
              rounded-[11px]
              border
              border-white/[0.07]
              bg-white/[0.018]
              px-3
              text-[9px]
              font-semibold
              text-zinc-500
            "
          >
            ← {text.back}
          </button>


          <button
            type="button"
            onClick={
              goNext
            }
            className="
              flex
              min-h-[42px]
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
              {currentQuestionIndex ===
              questions.length -
                1
                ? text.finish
                : text.next}
            </span>

            <span>
              →
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}