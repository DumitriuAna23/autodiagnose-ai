"use client";

import { useEffect, useMemo, useState } from "react";
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

type Vehicle = {
  manufacturer: string;
  model: string;
  fuel: string;
  year: number | null;
  vehicle_match: "exact" | "partial";
};

type AnswerMap = Record<string, string>;

type DiagnosticAnswerRecord = {
  symptom_id: string;
  answers: AnswerMap;
  completed_at: string;
};

type Question = {
  id: string;

  question: {
    en: string;
    ro: string;
  };

  options: {
    value: string;
    en: string;
    ro: string;
  }[];

  showWhen?: (answers: AnswerMap) => boolean;
};

export default function QuestionsPage() {
  const router = useRouter();

  const [language, setLanguage] =
    useState<Language>("en");

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [currentSymptom, setCurrentSymptom] =
    useState<SymptomRecord | null>(null);

  const [answers, setAnswers] =
    useState<AnswerMap>({});

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

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
        setVehicle(JSON.parse(savedVehicle));
      } catch {
        setVehicle(null);
      }
    }

    const currentSymptomId =
      localStorage.getItem(
        "currentSymptomId"
      );

    const savedSymptoms =
      localStorage.getItem(
        "diagnosticSymptoms"
      );

    if (
      currentSymptomId &&
      savedSymptoms
    ) {
      try {
        const parsedSymptoms =
          JSON.parse(savedSymptoms);

        if (
          Array.isArray(parsedSymptoms)
        ) {
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
        setCurrentSymptom(null);
      }
    }

    const savedAnswers =
      localStorage.getItem(
        "diagnosticAnswers"
      );

    if (
      savedAnswers &&
      currentSymptomId
    ) {
      try {
        const parsedAnswers =
          JSON.parse(savedAnswers);

        if (
          Array.isArray(parsedAnswers)
        ) {
          const existing =
            parsedAnswers.find(
              (
                item: DiagnosticAnswerRecord
              ) =>
                item.symptom_id ===
                currentSymptomId
            );

          if (existing) {
            setAnswers(
              existing.answers
            );
          }
        }
      } catch {
        setAnswers({});
      }
    }
  }, []);

  const content = {
    en: {
      step: "STEP 3 OF DIAGNOSIS",

      title: "A few more questions",

      description:
        "These questions relate only to the symptom you just added. If you don't know an answer, choose the unsure option rather than guessing.",

      vehicle: "Vehicle",
      symptom: "Current symptom",

      question: "Question",
      of: "of",

      back: "Back",
      continue: "Continue",
      finish: "Finish this symptom",

      safetyTitle: "Safety note",

      brakeSafety:
        "If braking ability is significantly reduced, the pedal behaves abnormally, or the vehicle cannot be controlled safely, do not continue driving.",

      temperatureSafety:
        "If the engine is overheating, there is steam, or a severe temperature warning is displayed, stop the vehicle safely and allow it to cool.",

      missingData:
        "Information for the current symptom is missing. Return to the symptoms page.",
    },

    ro: {
      step: "PASUL 3 AL DIAGNOZEI",

      title: "Mai avem câteva întrebări",

      description:
        "Aceste întrebări se referă doar la simptomul pe care tocmai l-ai adăugat. Dacă nu știi un răspuns, alege «Nu știu» în loc să ghicești.",

      vehicle: "Vehicul",
      symptom: "Simptom analizat",

      question: "Întrebarea",
      of: "din",

      back: "Înapoi",
      continue: "Continuă",
      finish: "Finalizează acest simptom",

      safetyTitle: "Notă de siguranță",

      brakeSafety:
        "Dacă frânarea este semnificativ afectată, pedala se comportă anormal sau vehiculul nu poate fi controlat în siguranță, nu continua deplasarea.",

      temperatureSafety:
        "Dacă motorul se supraîncălzește, apare abur sau este afișată o avertizare severă de temperatură, oprește vehiculul în siguranță și lasă-l să se răcească.",

      missingData:
        "Lipsesc informațiile pentru simptomul curent. Revino la pagina de simptome.",
    },
  };

  const text = content[language];

  const questions =
    useMemo<Question[]>(() => {
      if (!currentSymptom) {
        return [];
      }

      const commonQuestions: Question[] = [
        {
          id: "onset",

          question: {
            en: "How did the problem begin?",
            ro: "Cum a început problema?",
          },

          options: [
            {
              value: "sudden",
              en: "Suddenly",
              ro: "Brusc",
            },
            {
              value: "gradual",
              en: "Gradually",
              ro: "Treptat",
            },
            {
              value: "unknown",
              en: "I'm not sure",
              ro: "Nu știu",
            },
          ],
        },

        {
          id: "frequency",

          question: {
            en: "How often does the problem happen?",
            ro: "Cât de des apare problema?",
          },

          options: [
            {
              value: "always",
              en: "Almost all the time",
              ro: "Aproape tot timpul",
            },
            {
              value: "intermittent",
              en: "It comes and goes",
              ro: "Apare și dispare",
            },
            {
              value: "once",
              en: "It happened only once",
              ro: "S-a întâmplat o singură dată",
            },
            {
              value: "unknown",
              en: "I'm not sure",
              ro: "Nu știu",
            },
          ],
        },
      ];

      const warningQuestion: Question = {
        id: "warning_light",

        question: {
          en: "Is a warning light currently displayed on the dashboard?",
          ro: "Este aprins vreun martor în bord?",
        },

        options: [
          {
            value: "yes",
            en: "Yes",
            ro: "Da",
          },
          {
            value: "no",
            en: "No",
            ro: "Nu",
          },
          {
            value: "unknown",
            en: "I'm not sure",
            ro: "Nu știu",
          },
        ],
      };

      const warningFollowUp: Question = {
        id: "warning_behavior",

        question: {
          en: "How does the warning light behave?",
          ro: "Cum se comportă martorul?",
        },

        options: [
          {
            value: "steady",
            en: "It stays on continuously",
            ro: "Rămâne aprins continuu",
          },
          {
            value: "flashing",
            en: "It flashes",
            ro: "Clipește",
          },
          {
            value: "intermittent",
            en: "It appears and disappears",
            ro: "Apare și dispare",
          },
          {
            value: "unknown",
            en: "I'm not sure",
            ro: "Nu știu",
          },
        ],

        showWhen: (
          currentAnswers
        ) =>
          currentAnswers.warning_light ===
          "yes",
      };

      const categoryQuestions: Record<
        SymptomCategory,
        Question[]
      > = {
        power: [
          {
            id: "power_condition",

            question: {
              en: "When is the loss of power most noticeable?",
              ro: "Când se simte cel mai mult lipsa de putere?",
            },

            options: [
              {
                value: "acceleration",
                en: "During acceleration",
                ro: "La accelerație",
              },
              {
                value: "uphill",
                en: "When driving uphill",
                ro: "În rampă",
              },
              {
                value: "high_speed",
                en: "At higher speed or RPM",
                ro: "La viteză sau turație mai mare",
              },
              {
                value: "always",
                en: "Almost all the time",
                ro: "Aproape tot timpul",
              },
              {
                value: "unknown",
                en: "I'm not sure",
                ro: "Nu știu",
              },
            ],
          },

          {
            id: "limp_mode",

            question: {
              en: "Does the vehicle feel strongly limited, as if it will not accelerate beyond a certain point?",
              ro: "Mașina pare puternic limitată, ca și cum nu ar mai accelera peste un anumit punct?",
            },

            options: [
              {
                value: "yes",
                en: "Yes",
                ro: "Da",
              },
              {
                value: "no",
                en: "No",
                ro: "Nu",
              },
              {
                value: "unknown",
                en: "I'm not sure",
                ro: "Nu știu",
              },
            ],
          },
        ],

        starting: [
          {
            id: "crank_behavior",

            question: {
              en: "What happens when you try to start the vehicle?",
              ro: "Ce se întâmplă când încerci să pornești mașina?",
            },

            options: [
              {
                value: "cranks",
                en: "The engine turns but does not start",
                ro: "Motorul se învârte, dar nu pornește",
              },
              {
                value: "click",
                en: "I hear clicking",
                ro: "Se aud clicuri",
              },
              {
                value: "nothing",
                en: "Almost nothing happens",
                ro: "Aproape nu se întâmplă nimic",
              },
              {
                value: "starts_then_stalls",
                en: "It starts and then stops",
                ro: "Pornește și apoi se oprește",
              },
              {
                value: "unknown",
                en: "I'm not sure",
                ro: "Nu știu",
              },
            ],
          },

          {
            id: "temperature_start",

            question: {
              en: "Is starting more difficult when the vehicle is cold or warm?",
              ro: "Pornește mai greu când mașina este rece sau caldă?",
            },

            options: [
              {
                value: "cold",
                en: "Cold",
                ro: "Rece",
              },
              {
                value: "warm",
                en: "Warm",
                ro: "Caldă",
              },
              {
                value: "both",
                en: "Both",
                ro: "În ambele situații",
              },
              {
                value: "unknown",
                en: "I'm not sure",
                ro: "Nu știu",
              },
            ],
          },
        ],

        noise: [
          {
            id: "noise_condition",

            question: {
              en: "When is the noise or vibration most noticeable?",
              ro: "Când se observă cel mai mult zgomotul sau vibrația?",
            },

            options: [
              {
                value: "idle",
                en: "While stationary / idling",
                ro: "Pe loc / la ralanti",
              },
              {
                value: "acceleration",
                en: "During acceleration",
                ro: "La accelerație",
              },
              {
                value: "braking",
                en: "During braking",
                ro: "La frânare",
              },
              {
                value: "turning",
                en: "While turning",
                ro: "În viraje",
              },
              {
                value: "speed",
                en: "It increases with vehicle speed",
                ro: "Crește odată cu viteza",
              },
              {
                value: "unknown",
                en: "I'm not sure",
                ro: "Nu știu",
              },
            ],
          },
        ],

        smoke: [
          {
            id: "smoke_color",

            question: {
              en: "What color is the smoke?",
              ro: "Ce culoare are fumul?",
            },

            options: [
              {
                value: "black",
                en: "Black",
                ro: "Negru",
              },
              {
                value: "white",
                en: "White",
                ro: "Alb",
              },
              {
                value: "blue",
                en: "Blue / blue-grey",
                ro: "Albastru / albăstrui",
              },
              {
                value: "unknown",
                en: "I'm not sure",
                ro: "Nu știu",
              },
            ],
          },

          {
            id: "smoke_location",

            question: {
              en: "Where does the smoke appear to come from?",
              ro: "De unde pare să provină fumul?",
            },

            options: [
              {
                value: "exhaust",
                en: "Exhaust",
                ro: "Eșapament",
              },
              {
                value: "engine_bay",
                en: "Engine compartment",
                ro: "Compartimentul motor",
              },
              {
                value: "unknown",
                en: "I'm not sure",
                ro: "Nu știu",
              },
            ],
          },
        ],

        warning: [
          {
            id: "performance_change",

            question: {
              en: "Did the vehicle's behavior change when the warning appeared?",
              ro: "S-a schimbat comportamentul mașinii când a apărut martorul?",
            },

            options: [
              {
                value: "yes",
                en: "Yes",
                ro: "Da",
              },
              {
                value: "no",
                en: "No",
                ro: "Nu",
              },
              {
                value: "unknown",
                en: "I'm not sure",
                ro: "Nu știu",
              },
            ],
          },
        ],

        brakes: [
          {
            id: "brake_behavior",

            question: {
              en: "What best describes the braking or steering problem?",
              ro: "Ce descrie cel mai bine problema de frânare sau direcție?",
            },

            options: [
              {
                value: "soft_pedal",
                en: "Brake pedal feels unusually soft",
                ro: "Pedala de frână este neobișnuit de moale",
              },
              {
                value: "hard_pedal",
                en: "Brake pedal feels unusually hard",
                ro: "Pedala de frână este neobișnuit de tare",
              },
              {
                value: "pulling",
                en: "Vehicle pulls to one side",
                ro: "Mașina trage într-o parte",
              },
              {
                value: "steering",
                en: "Steering feels abnormal",
                ro: "Direcția se simte anormal",
              },
              {
                value: "noise",
                en: "Noise during braking",
                ro: "Zgomot la frânare",
              },
              {
                value: "unknown",
                en: "I'm not sure",
                ro: "Nu știu",
              },
            ],
          },
        ],

        temperature: [
          {
            id: "temperature_behavior",

            question: {
              en: "What are you observing?",
              ro: "Ce observi?",
            },

            options: [
              {
                value: "gauge_high",
                en: "Temperature gauge rises unusually high",
                ro: "Indicatorul de temperatură urcă neobișnuit de mult",
              },
              {
                value: "warning",
                en: "Temperature warning appears",
                ro: "Apare martorul de temperatură",
              },
              {
                value: "steam",
                en: "Steam is visible",
                ro: "Se vede abur",
              },
              {
                value: "coolant_loss",
                en: "Coolant appears to be leaking or disappearing",
                ro: "Lichidul de răcire pare să curgă sau să dispară",
              },
              {
                value: "unknown",
                en: "I'm not sure",
                ro: "Nu știu",
              },
            ],
          },
        ],

        other: [
          {
            id: "problem_area",

            question: {
              en: "Where do you notice the problem most?",
              ro: "În ce zonă observi cel mai mult problema?",
            },

            options: [
              {
                value: "engine",
                en: "Engine / acceleration",
                ro: "Motor / accelerație",
              },
              {
                value: "driving",
                en: "While driving",
                ro: "În timpul deplasării",
              },
              {
                value: "electrical",
                en: "Electrical equipment",
                ro: "Echipamente electrice",
              },
              {
                value: "inside",
                en: "Inside the cabin",
                ro: "În interiorul mașinii",
              },
              {
                value: "unknown",
                en: "I'm not sure",
                ro: "Nu știu",
              },
            ],
          },
        ],
      };

      return [
        ...commonQuestions,
        ...categoryQuestions[
          currentSymptom.primary_category
        ],
        warningQuestion,
        warningFollowUp,
      ];
    }, [currentSymptom]);

  const visibleQuestions =
    questions.filter((question) => {
      if (!question.showWhen) {
        return true;
      }

      return question.showWhen(answers);
    });

  const currentQuestion =
    visibleQuestions[
      currentQuestionIndex
    ];

  const handleAnswer = (
    questionId: string,
    value: string
  ) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: value,
    }));
  };

  const saveCurrentSymptomAnswers =
    () => {
      if (!currentSymptom) {
        return;
      }

      const savedAnswers =
        localStorage.getItem(
          "diagnosticAnswers"
        );

      let previousAnswers: DiagnosticAnswerRecord[] =
        [];

      if (savedAnswers) {
        try {
          const parsedAnswers =
            JSON.parse(savedAnswers);

          if (
            Array.isArray(parsedAnswers)
          ) {
            previousAnswers =
              parsedAnswers;
          }
        } catch {
          previousAnswers = [];
        }
      }

      const newAnswerRecord: DiagnosticAnswerRecord =
        {
          symptom_id:
            currentSymptom.id,

          answers,

          completed_at:
            new Date().toISOString(),
        };

      const answersWithoutCurrent =
        previousAnswers.filter(
          (item) =>
            item.symptom_id !==
            currentSymptom.id
        );

      localStorage.setItem(
        "diagnosticAnswers",
        JSON.stringify([
          ...answersWithoutCurrent,
          newAnswerRecord,
        ])
      );

      router.push(
        "/diagnosis/symptom-complete"
      );
    };

  const goNext = () => {
    if (!currentQuestion) {
      return;
    }

    if (
      !answers[currentQuestion.id]
    ) {
      return;
    }

    if (
      currentQuestionIndex <
      visibleQuestions.length - 1
    ) {
      setCurrentQuestionIndex(
        currentQuestionIndex + 1
      );

      return;
    }

    saveCurrentSymptomAnswers();
  };

  const goBack = () => {
    if (
      currentQuestionIndex > 0
    ) {
      setCurrentQuestionIndex(
        currentQuestionIndex - 1
      );

      return;
    }

    router.push(
      "/diagnosis/symptoms"
    );
  };

  if (
    !vehicle ||
    !currentSymptom
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="text-center">
          <p className="text-zinc-400">
            {text.missingData}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/symptoms"
              )
            }
            className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            {language === "ro"
              ? "Înapoi la simptome"
              : "Back to symptoms"}
          </button>
        </div>
      </main>
    );
  }

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

        {/* CONTEXT */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {text.vehicle}
            </p>

            <p className="mt-2 font-semibold">
              {vehicle.manufacturer}{" "}
              {vehicle.model}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {text.symptom}
            </p>

            <p className="mt-2 text-sm text-zinc-300">
              {
                currentSymptom.description
              }
            </p>
          </div>
        </div>

        {/* SAFETY */}
        {currentSymptom.primary_category ===
          "brakes" && (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4">
            <p className="font-semibold text-red-300">
              {text.safetyTitle}
            </p>

            <p className="mt-2 text-sm leading-6 text-red-200/80">
              {text.brakeSafety}
            </p>
          </div>
        )}

        {currentSymptom.primary_category ===
          "temperature" && (
          <div className="mt-6 rounded-xl border border-amber-900 bg-amber-950/30 p-4">
            <p className="font-semibold text-amber-300">
              {text.safetyTitle}
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-200/80">
              {text.temperatureSafety}
            </p>
          </div>
        )}

        {/* QUESTION */}
        {currentQuestion && (
          <section className="mt-10">
            <p className="text-sm text-zinc-500">
              {text.question}{" "}
              {currentQuestionIndex + 1}{" "}
              {text.of}{" "}
              {visibleQuestions.length}
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              {
                currentQuestion.question[
                  language
                ]
              }
            </h2>

            <div className="mt-6 grid gap-3">
              {currentQuestion.options.map(
                (option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      handleAnswer(
                        currentQuestion.id,
                        option.value
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      answers[
                        currentQuestion.id
                      ] === option.value
                        ? "border-white bg-white text-black"
                        : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    {option[language]}
                  </button>
                )
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-zinc-700 px-6 py-3 font-semibold hover:bg-zinc-900"
              >
                {text.back}
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={
                  !answers[
                    currentQuestion.id
                  ]
                }
                className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {currentQuestionIndex ===
                visibleQuestions.length - 1
                  ? text.finish
                  : text.continue}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}