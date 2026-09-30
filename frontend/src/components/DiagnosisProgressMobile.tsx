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


export default function DiagnosisProgressMobile() {
  const pathname =
    usePathname();

  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
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
  }, []);


  const content = {
    en: {
      eyebrow:
        "DIAGNOSTIC WORKSPACE",

      title:
        "New diagnosis",

      step:
        "Step",

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

      step:
        "Pas",

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
    content[
      language
    ];


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


  const progress =
    steps.length > 1
      ? (
          currentStep /
          (
            steps.length -
            1
          )
        ) *
        100
      : 0;


  function handleStepClick(
    index: number,
    path: string
  ) {
    if (
      index >= currentStep
    ) {
      return;
    }


    router.push(
      path
    );
  }


  return (
    <section
      className="
        border-b
        border-white/[0.055]
        bg-[#080b12]/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[560px]
          px-3.5
          pb-2.5
          pt-2.5
        "
      >
        {/* COMPACT HEADER */}

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
              min-w-0
            "
          >
            <p
              className="
                truncate
                text-[6.5px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-blue-300/50
              "
            >
              {
                text.eyebrow
              }
            </p>

            <h1
              className="
                mt-0.5
                text-[15px]
                font-semibold
                leading-tight
                tracking-[-0.025em]
                text-white
              "
            >
              {
                text.title
              }
            </h1>
          </div>


          <div
            className="
              shrink-0
              rounded-full
              border
              border-blue-400/[0.10]
              bg-blue-500/[0.04]
              px-2.5
              py-1
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-blue-200/65
            "
          >
            {text.step}{" "}
            {currentStep + 1}
            <span
              className="
                text-zinc-700
              "
            >
              {" "}
              / {steps.length}
            </span>
          </div>
        </div>


        {/* PROGRESS */}

        <div
          className="
            relative
            mt-2.5
          "
        >
          {/* BASE CONNECTOR */}

          <div
            className="
              absolute
              left-[10%]
              right-[10%]
              top-[12px]
              h-px
              overflow-hidden
              bg-zinc-800
            "
          >
            <motion.div
              initial={false}
              animate={{
                width:
                  `${progress}%`,
              }}
              transition={{
                duration:
                  0.32,

                ease:
                  "easeOut",
              }}
              className="
                h-full
                bg-gradient-to-r
                from-blue-500
                to-cyan-400
              "
            />
          </div>


          <div
            className="
              relative
              z-10
              grid
              grid-cols-5
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
                  <button
                    key={
                      step.path
                    }
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
                      min-w-0
                      flex-col
                      items-center
                      outline-none

                      ${
                        clickable
                          ? "cursor-pointer"
                          : "cursor-default"
                      }
                    `}
                  >
                    {/* CIRCLE */}

                    <div
                      className="
                        relative
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                      "
                    >
                      {active && (
                        <motion.div
                          initial={{
                            opacity:
                              0,
                          }}
                          animate={{
                            opacity:
                              1,
                          }}
                          className="
                            absolute
                            inset-[-3px]
                            rounded-full
                            bg-blue-500/20
                            blur-[5px]
                          "
                        />
                      )}


                      <motion.div
                        initial={
                          false
                        }
                        animate={{
                          backgroundColor:
                            active
                              ? "rgb(59 130 246)"
                              : completed
                              ? "rgba(59,130,246,0.16)"
                              : "rgb(24 24 27)",

                          borderColor:
                            active
                              ? "rgb(96 165 250)"
                              : completed
                              ? "rgba(96,165,250,0.32)"
                              : "rgb(63 63 70)",

                          boxShadow:
                            active
                              ? "0 0 12px rgba(59,130,246,0.25)"
                              : "0 0 0 rgba(0,0,0,0)",
                        }}
                        transition={{
                          duration:
                            0.25,
                        }}
                        className="
                          relative
                          z-10
                          flex
                          h-6
                          w-6
                          items-center
                          justify-center
                          rounded-full
                          border
                          text-[8px]
                          font-semibold
                        "
                      >
                        {completed ? (
                          <span
                            className="
                              text-[9px]
                              text-blue-300
                            "
                          >
                            ✓
                          </span>
                        ) : (
                          <span
                            className={
                              active
                                ? "text-white"
                                : "text-zinc-600"
                            }
                          >
                            {
                              index +
                              1
                            }
                          </span>
                        )}
                      </motion.div>
                    </div>


                    {/* LABEL */}

                    <motion.span
                      initial={
                        false
                      }
                      animate={{
                        opacity:
                          active
                            ? 1
                            : completed
                            ? 0.7
                            : 0.32,
                      }}
                      transition={{
                        duration:
                          0.25,
                      }}
                      className={`
                        mt-1.5
                        max-w-full
                        truncate
                        px-0.5
                        text-[6.5px]
                        font-semibold
                        leading-none

                        ${
                          active
                            ? "text-white"
                            : completed
                            ? "text-blue-100"
                            : "text-zinc-600"
                        }
                      `}
                    >
                      {
                        step.label
                      }
                    </motion.span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
}