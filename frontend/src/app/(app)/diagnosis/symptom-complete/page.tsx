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
  primary_category: SymptomCategory;
  description: string;
  created_at: string;
};


type AdaptiveAnswer = {
  question_id?: string;
  question?: string;
  answer?: unknown;
  symptom_id?: string;
};


const categoryLabels: Record<
  SymptomCategory,
  {
    en: string;
    ro: string;
    code: string;
  }
> = {
  power: {
    en: "Loss of power / acceleration",
    ro: "Lipsă de putere / accelerație",
    code: "PWR",
  },

  starting: {
    en: "Starting / engine running",
    ro: "Pornire / funcționare motor",
    code: "ENG",
  },

  noise: {
    en: "Noise / vibration",
    ro: "Zgomot / vibrații",
    code: "NVH",
  },

  smoke: {
    en: "Smoke / smell",
    ro: "Fum / miros",
    code: "EXH",
  },

  warning: {
    en: "Dashboard warning",
    ro: "Martor în bord",
    code: "MIL",
  },

  brakes: {
    en: "Braking / steering",
    ro: "Frânare / direcție",
    code: "CHS",
  },

  temperature: {
    en: "Temperature / overheating",
    ro: "Temperatură / supraîncălzire",
    code: "TMP",
  },

  other: {
    en: "Other symptom",
    ro: "Alt simptom",
    code: "...",
  },
};


export default function SymptomCompletePage() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] =
    useState<Language>(
      "en"
    );


  const [
    symptoms,
    setSymptoms,
  ] =
    useState<
      SymptomRecord[]
    >([]);


  const [
    currentSymptom,
    setCurrentSymptom,
  ] =
    useState<
      SymptomRecord | null
    >(null);


  const [
    dtcCodes,
    setDtcCodes,
  ] =
    useState<string[]>(
      []
    );


  const [
    symptomToDelete,
    setSymptomToDelete,
  ] =
    useState<
      SymptomRecord | null
    >(null);


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );


    if (
      savedLanguage ===
        "en" ||
      savedLanguage ===
        "ro"
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


    if (savedSymptoms) {
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


          if (symptom) {
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
        "The symptom and its adaptive answers have been saved. Add another problem if needed, or continue when the case is complete.",

      saved:
        "Saved",

      completed:
        "Completed symptom",

      caseProgress:
        "Case progress",

      symptomsRecorded:
        "Symptoms recorded",

      dtcCodes:
        "DTC codes",

      noDtc:
        "None entered",

      recordedSymptoms:
        "Recorded symptoms",

      current:
        "Current",

      addTitle:
        "Add another symptom",

      addDescription:
        "Report another issue so AutoDiagnose AI can analyze the symptoms together.",

      addAction:
        "Add symptom",

      finishTitle:
        "All symptoms added",

      finishDescription:
        "Continue to review the complete case before starting the diagnostic analysis.",

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

      deleteAria:
        "Delete symptom",
    },

    ro: {
      eyebrow:
        "SIMPTOM FINALIZAT",

      title:
        "Simptomul este pregătit.",

      description:
        "Simptomul și răspunsurile adaptive au fost salvate. Adaugă o altă problemă dacă este nevoie sau continuă când cazul este complet.",

      saved:
        "Salvat",

      completed:
        "Simptom finalizat",

      caseProgress:
        "Progres caz",

      symptomsRecorded:
        "Simptome înregistrate",

      dtcCodes:
        "Coduri DTC",

      noDtc:
        "Niciunul introdus",

      recordedSymptoms:
        "Simptome înregistrate",

      current:
        "Curent",

      addTitle:
        "Adaugă alt simptom",

      addDescription:
        "Raportează încă o problemă pentru ca AutoDiagnose AI să poată analiza simptomele împreună.",

      addAction:
        "Adaugă simptom",

      finishTitle:
        "Am adăugat toate simptomele",

      finishDescription:
        "Continuă către verificarea completă a cazului înainte de începerea analizei de diagnostic.",

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

      deleteAria:
        "Șterge simptomul",
    },
  };


  const text =
    content[language];


  const currentMeta =
    useMemo(
      () =>
        currentSymptom
          ? categoryLabels[
              currentSymptom
                .primary_category
            ]
          : null,
      [currentSymptom]
    );


  const addAnotherSymptom =
    () => {
      localStorage.removeItem(
        "currentSymptomId"
      );


      router.push(
        "/diagnosis/symptoms"
      );
    };


  const finishSymptoms =
    () => {
      localStorage.removeItem(
        "currentSymptomId"
      );


      router.push(
        "/diagnosis/review"
      );
    };


  function deleteSymptom(
    symptom:
      SymptomRecord
  ) {
    const updatedSymptoms =
      symptoms.filter(
        (item) =>
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


    if (savedAnswers) {
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
              (answer) =>
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
        // Keep the existing draft if old data cannot be parsed.
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


  if (!currentSymptom) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#060912]
          px-6
          text-white
        "
      >
        <div
          className="
            ad-surface
            w-full
            max-w-md
            rounded-[26px]
            p-7
            text-center
          "
        >
          <p
            className="
              text-[15px]
              leading-6
              text-zinc-400
            "
          >
            {text.missing}
          </p>


          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/symptoms"
              )
            }
            className="
              mt-6
              rounded-xl
              bg-blue-500
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-400
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
      <div className="ad-page">

        <div
          className="
            grid
            gap-7
            xl:grid-cols-[minmax(0,1fr)_390px]
            xl:items-start
          "
        >

          {/* MAIN CONTENT */}

          <section
            className="
              ad-surface
              relative
              overflow-hidden
              rounded-[30px]
              p-7
              sm:p-9
              lg:p-10
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -left-24
                -top-24
                h-72
                w-72
                rounded-full
                bg-emerald-400/[0.06]
                blur-[95px]
              "
            />


            <div className="relative">

              <div
                className="
                  inline-flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-emerald-400/15
                  bg-emerald-400/[0.05]
                  px-3.5
                  py-2
                "
              >
                <span
                  className="
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-emerald-400/25
                    bg-emerald-400/[0.10]
                    text-xs
                    font-bold
                    text-emerald-300
                  "
                >
                  ✓
                </span>

                <span
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-emerald-200/80
                  "
                >
                  {text.saved}
                </span>
              </div>


              <p
                className="
                  mt-7
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-blue-200/65
                "
              >
                {text.eyebrow}
              </p>


              <h1
                className="
                  mt-3
                  max-w-2xl
                  text-[2.2rem]
                  font-semibold
                  leading-[1.1]
                  tracking-[-0.04em]
                  text-white
                  sm:text-[2.65rem]
                "
              >
                {text.title}
              </h1>


              <p
                className="
                  mt-4
                  max-w-2xl
                  text-[15px]
                  leading-7
                  text-zinc-400
                "
              >
                {text.description}
              </p>


              {/* COMPLETED SYMPTOM */}

              <div
                className="
                  mt-9
                  rounded-[24px]
                  border
                  border-emerald-400/15
                  bg-emerald-400/[0.035]
                  p-5
                  sm:p-6
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-4
                    "
                  >
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-emerald-400/20
                        bg-emerald-400/[0.07]
                        text-[10px]
                        font-bold
                        tracking-[0.08em]
                        text-emerald-200
                      "
                    >
                      {currentMeta?.code}
                    </div>


                    <div>
                      <p
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.15em]
                          text-emerald-200/70
                        "
                      >
                        {text.completed}
                      </p>

                      <h2
                        className="
                          mt-2
                          text-[19px]
                          font-semibold
                          tracking-[-0.02em]
                          text-zinc-100
                        "
                      >
                        {
                          currentMeta?.[
                            language
                          ]
                        }
                      </h2>
                    </div>
                  </div>


                  <span
                    className="
                      w-fit
                      rounded-full
                      border
                      border-emerald-400/15
                      bg-emerald-400/[0.055]
                      px-3
                      py-1.5
                      text-[10px]
                      font-medium
                      text-emerald-200/80
                    "
                  >
                    ✓ {text.saved}
                  </span>
                </div>


                <p
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-white/[0.055]
                    bg-black/15
                    px-4
                    py-4
                    text-[15px]
                    leading-7
                    text-zinc-300
                  "
                >
                  {
                    currentSymptom.description
                  }
                </p>
              </div>


              {/* CHOICE */}

              <div
                className="
                  mt-7
                  grid
                  gap-3
                  lg:grid-cols-2
                "
              >
                <button
                  type="button"
                  onClick={
                    addAnotherSymptom
                  }
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-white/[0.07]
                    bg-white/[0.018]
                    p-5
                    text-left
                    transition-all
                    duration-200
                    hover:border-blue-400/20
                    hover:bg-blue-500/[0.035]
                  "
                >
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-10
                      -top-10
                      h-28
                      w-28
                      rounded-full
                      bg-blue-500/[0.09]
                      blur-[40px]
                    "
                  />


                  <div className="relative">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-blue-400/15
                        bg-blue-500/[0.06]
                        text-xl
                        text-blue-200
                      "
                    >
                      +
                    </div>


                    <h3
                      className="
                        mt-5
                        text-[17px]
                        font-semibold
                        tracking-[-0.02em]
                        text-zinc-100
                      "
                    >
                      {text.addTitle}
                    </h3>


                    <p
                      className="
                        mt-2
                        text-[13px]
                        leading-6
                        text-zinc-500
                      "
                    >
                      {
                        text.addDescription
                      }
                    </p>


                    <div
                      className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        text-[13px]
                        font-semibold
                        text-blue-200/80
                      "
                    >
                      <span>
                        {text.addAction}
                      </span>

                      <span
                        className="
                          transition-transform
                          duration-200
                          group-hover:translate-x-0.5
                        "
                      >
                        →
                      </span>
                    </div>

                  </div>
                </button>


                <button
                  type="button"
                  onClick={
                    finishSymptoms
                  }
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-blue-400/20
                    bg-blue-500/[0.07]
                    p-5
                    text-left
                    shadow-[0_14px_45px_rgba(37,99,235,0.10)]
                    transition-all
                    duration-200
                    hover:border-blue-400/30
                    hover:bg-blue-500/[0.10]
                  "
                >
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-10
                      -top-10
                      h-28
                      w-28
                      rounded-full
                      bg-blue-500/[0.18]
                      blur-[42px]
                    "
                  />


                  <div className="relative">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-blue-400/20
                        bg-blue-500/[0.10]
                        text-sm
                        font-bold
                        text-blue-100
                      "
                    >
                      ✓
                    </div>


                    <h3
                      className="
                        mt-5
                        text-[17px]
                        font-semibold
                        tracking-[-0.02em]
                        text-white
                      "
                    >
                      {text.finishTitle}
                    </h3>


                    <p
                      className="
                        mt-2
                        text-[13px]
                        leading-6
                        text-zinc-400
                      "
                    >
                      {
                        text.finishDescription
                      }
                    </p>


                    <div
                      className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        text-[13px]
                        font-semibold
                        text-blue-100
                      "
                    >
                      <span>
                        {
                          text.finishAction
                        }
                      </span>

                      <span
                        className="
                          transition-transform
                          duration-200
                          group-hover:translate-x-0.5
                        "
                      >
                        →
                      </span>
                    </div>

                  </div>
                </button>
              </div>

            </div>
          </section>


          {/* CASE PROGRESS */}

          <aside
            className="
              ad-surface
              relative
              overflow-hidden
              rounded-[30px]
              p-5
              sm:p-6
              xl:sticky
              xl:top-6
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-16
                h-60
                w-60
                -translate-x-1/2
                rounded-full
                bg-blue-500/[0.08]
                blur-[80px]
              "
            />


            <div className="relative">

              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-blue-200/70
                "
              >
                {text.caseProgress}
              </p>


              {/* STATS */}

              <div
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <div
                  className="
                    rounded-xl
                    border
                    border-white/[0.055]
                    bg-white/[0.018]
                    p-4
                  "
                >
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.10em]
                      text-zinc-500
                    "
                  >
                    {
                      text.symptomsRecorded
                    }
                  </p>

                  <p
                    className="
                      mt-2
                      text-[28px]
                      font-semibold
                      tracking-[-0.03em]
                      text-zinc-100
                    "
                  >
                    {
                      symptoms.length
                    }
                  </p>
                </div>


                <div
                  className="
                    rounded-xl
                    border
                    border-white/[0.055]
                    bg-white/[0.018]
                    p-4
                  "
                >
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.10em]
                      text-zinc-500
                    "
                  >
                    {
                      text.dtcCodes
                    }
                  </p>

                  <p
                    className="
                      mt-2
                      text-[28px]
                      font-semibold
                      tracking-[-0.03em]
                      text-zinc-100
                    "
                  >
                    {
                      dtcCodes.length
                    }
                  </p>
                </div>
              </div>


              {/* DTC */}

              <div
                className="
                  mt-3
                  rounded-[22px]
                  border
                  border-white/[0.055]
                  bg-white/[0.016]
                  p-4
                "
              >
                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.12em]
                    text-zinc-500
                  "
                >
                  {text.dtcCodes}
                </p>


                {dtcCodes.length >
                0 ? (
                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {dtcCodes.map(
                      (code) => (
                        <span
                          key={code}
                          className="
                            rounded-lg
                            border
                            border-blue-400/15
                            bg-blue-500/[0.055]
                            px-2.5
                            py-1.5
                            font-mono
                            text-[11px]
                            font-semibold
                            tracking-[0.04em]
                            text-blue-100/85
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
                      text-[13px]
                      text-zinc-500
                    "
                  >
                    {text.noDtc}
                  </p>
                )}
              </div>


              {/* SYMPTOM LIST */}

              <div
                className="
                  mt-3
                  rounded-[22px]
                  border
                  border-white/[0.055]
                  bg-white/[0.016]
                  p-4
                "
              >
                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.12em]
                    text-zinc-500
                  "
                >
                  {
                    text.recordedSymptoms
                  }
                </p>


                <div
                  className="
                    mt-3
                    space-y-2.5
                  "
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
                            group
                            rounded-xl
                            border
                            px-3.5
                            py-3.5
                            transition
                            ${
                              isCurrent
                                ? "border-emerald-400/15 bg-emerald-400/[0.035]"
                                : "border-white/[0.055] bg-black/10 hover:border-white/[0.09] hover:bg-white/[0.02]"
                            }
                          `}
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >
                            <span
                              className={`
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-[10px]
                                font-bold
                                ${
                                  isCurrent
                                    ? "bg-emerald-400/[0.09] text-emerald-200"
                                    : "bg-white/[0.035] text-zinc-500"
                                }
                              `}
                            >
                              {index +
                                1}
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
                                  gap-2
                                "
                              >
                                <p
                                  className="
                                    truncate
                                    text-[13px]
                                    font-semibold
                                    text-zinc-200
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
                                      border-emerald-400/15
                                      bg-emerald-400/[0.05]
                                      px-2
                                      py-0.5
                                      text-[9px]
                                      font-medium
                                      text-emerald-200/80
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
                                  mt-1
                                  truncate
                                  text-[11px]
                                  text-zinc-500
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
                                text.deleteAria
                              }
                              title={
                                text.delete
                              }
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-white/[0.055]
                                bg-white/[0.018]
                                text-zinc-500
                                transition-all
                                duration-200
                                hover:border-red-400/20
                                hover:bg-red-400/[0.06]
                                hover:text-red-300
                              "
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-4 w-4"
                                aria-hidden="true"
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
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

            </div>
          </aside>

        </div>

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
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.018]
                p-4
              "
            >
              <p
                className="
                  text-sm
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
                  mt-2
                  text-[13px]
                  leading-6
                  text-zinc-500
                "
              >
                {
                  symptomToDelete.description
                }
              </p>
            </div>


            <div
              className="
                mt-5
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
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
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.018]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-zinc-300
                  transition
                  hover:bg-white/[0.035]
                "
              >
                {text.cancel}
              </button>


              <button
                type="button"
                onClick={() =>
                  deleteSymptom(
                    symptomToDelete
                  )
                }
                className="
                  rounded-xl
                  border
                  border-red-400/15
                  bg-red-400/[0.08]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-red-200
                  transition
                  hover:border-red-400/25
                  hover:bg-red-400/[0.12]
                "
              >
                {text.confirmDelete}
              </button>
            </div>
          </div>
        )}
      </Modal>

    </main>
  );
}
