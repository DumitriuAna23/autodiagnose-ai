"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  motion,
} from "motion/react";


type Language =
  | "ro"
  | "en";


export default function DiagnosisProgress() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    language,
    setLanguage,
  ] = useState<Language>("en");


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
  }, []);


  const content = {
    en: {
      eyebrow:
        "DIAGNOSTIC WORKSPACE",

      title:
        "New diagnosis",

      vehicle:
        "Vehicle",

      symptoms:
        "Symptoms",

      questions:
        "Questions",

      review:
        "Review",

      analysis:
        "Analysis",
    },

    ro: {
      eyebrow:
        "SPAȚIU DE DIAGNOSTIC",

      title:
        "Diagnostic nou",

      vehicle:
        "Vehicul",

      symptoms:
        "Simptome",

      questions:
        "Întrebări",

      review:
        "Verificare",

      analysis:
        "Analiză",
    },
  };


  const text =
    content[language];


  const steps = [
    {
      label:
        text.vehicle,

      path:
        "/diagnosis/vehicle",
    },

    {
      label:
        text.symptoms,

      path:
        "/diagnosis/symptoms",
    },

    {
      label:
        text.questions,

      path:
        "/diagnosis/questions",
    },

    {
      label:
        text.review,

      path:
        "/diagnosis/review",
    },

    {
      label:
        text.analysis,

      path:
        "/diagnosis/analysis",
    },
  ];


  function getCurrentStepIndex() {
    if (
      pathname.startsWith(
        "/diagnosis/vehicle"
      )
    ) {
      return 0;
    }


    if (
      pathname.startsWith(
        "/diagnosis/symptoms"
      ) ||
      pathname.startsWith(
        "/diagnosis/symptom-complete"
      )
    ) {
      return 1;
    }


    if (
      pathname.startsWith(
        "/diagnosis/questions"
      )
    ) {
      return 2;
    }


    if (
      pathname.startsWith(
        "/diagnosis/review"
      )
    ) {
      return 3;
    }


    if (
      pathname.startsWith(
        "/diagnosis/analysis"
      ) ||
      pathname.startsWith(
        "/diagnosis/report"
      )
    ) {
      return 4;
    }


    return 0;
  }


  const currentStep =
    getCurrentStepIndex();


  function handleStepClick(
    index: number,
    path: string
  ) {
    if (
      index >= currentStep
    ) {
      return;
    }

    router.push(path);
  }


  return (
    <section
      className="
        border-b
        border-white/[0.06]
        bg-[#080b12]/95
        backdrop-blur-xl
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-6xl
          px-6
          py-7
          lg:px-10
        "
      >

        {/* HEADER */}

        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.25em]
            text-blue-400/60
          "
        >
          {text.eyebrow}
        </p>


        <h1
          className="
            mt-2
            text-2xl
            font-bold
            tracking-tight
            text-white
          "
        >
          {text.title}
        </h1>


        {/* STEPS */}

        <div
          className="
            mt-7
            overflow-x-auto
            pb-1
          "
        >

          <div
            className="
              flex
              min-w-max
              items-center
            "
          >

            {steps.map(
              (
                step,
                index
              ) => {
                const completed =
                  index <
                  currentStep;

                const active =
                  index ===
                  currentStep;

                const clickable =
                  completed;


                return (
                  <div
                    key={
                      step.path
                    }
                    className="
                      flex
                      items-center
                    "
                  >

                    <button
                      type="button"
                      disabled={
                        !clickable
                      }
                      onClick={() =>
                        handleStepClick(
                          index,
                          step.path
                        )
                      }
                      className={`
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        outline-none
                        ${
                          clickable
                            ? "cursor-pointer hover:opacity-80"
                            : "cursor-default"
                        }
                      `}
                    >

                      {/* STEP CIRCLE */}

                      <div
                        className="
                          relative
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                        "
                      >

                        {/* SOFT ACTIVE HALO */}

                        <motion.div
                          className="
                            absolute
                            inset-[-5px]
                            rounded-full
                            bg-blue-500/25
                            blur-lg
                          "
                          initial={false}
                          animate={{
                            opacity:
                              active
                                ? 1
                                : 0,
                          }}
                          transition={{
                            duration:
                              0.3,
                            ease:
                              "easeOut",
                          }}
                        />


                        <motion.div
                          initial={false}
                          animate={{
                            backgroundColor:
                              active
                                ? "rgb(59 130 246)"
                                : completed
                                ? "rgba(59,130,246,0.12)"
                                : "rgb(24 24 27)",

                            borderColor:
                              active
                                ? "rgb(96 165 250)"
                                : completed
                                ? "rgba(96,165,250,0.4)"
                                : "rgb(63 63 70)",

                            boxShadow:
                              active
                                ? "0 0 22px rgba(59,130,246,0.22)"
                                : "0 0 0 rgba(0,0,0,0)",
                          }}
                          transition={{
                            duration:
                              0.3,
                            ease:
                              "easeOut",
                          }}
                          className="
                            relative
                            z-10
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            border
                            text-sm
                            font-semibold
                          "
                        >

                          {completed ? (
                            <motion.span
                              initial={{
                                opacity: 0,
                              }}
                              animate={{
                                opacity: 1,
                              }}
                              transition={{
                                duration:
                                  0.3,
                              }}
                              className="
                                text-blue-300
                              "
                            >
                              ✓
                            </motion.span>
                          ) : (
                            <span
                              className={
                                active
                                  ? "text-white"
                                  : "text-zinc-500"
                              }
                            >
                              {index + 1}
                            </span>
                          )}

                        </motion.div>

                      </div>


                      {/* LABEL */}

                      <motion.span
                        initial={false}
                        animate={{
                          opacity:
                            active
                              ? 1
                              : completed
                              ? 0.82
                              : 0.38,
                        }}
                        transition={{
                          duration:
                            0.3,
                          ease:
                            "easeOut",
                        }}
                        className={`
                          text-sm
                          font-medium
                          ${
                            active
                              ? "text-white"
                              : completed
                              ? "text-blue-100"
                              : "text-zinc-500"
                          }
                        `}
                      >
                        {step.label}
                      </motion.span>

                    </button>


                    {/* CONNECTOR */}

                    {index <
                      steps.length -
                        1 && (

                      <div
                        className="
                          relative
                          mx-4
                          h-px
                          w-10
                          bg-zinc-800
                          sm:w-16
                        "
                      >

                        <motion.div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-r
                            from-blue-500
                            to-cyan-400
                          "
                          initial={false}
                          animate={{
                            opacity:
                              index <
                              currentStep
                                ? 0.8
                                : 0,
                          }}
                          transition={{
                            duration:
                              0.35,
                            ease:
                              "easeOut",
                          }}
                        />

                      </div>

                    )}

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>

    </section>
  );
}