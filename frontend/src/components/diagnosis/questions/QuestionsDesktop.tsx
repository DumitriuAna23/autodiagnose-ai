"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Language = "ro" | "en";

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
  created_at?: string;
};

type AdaptiveAnswer = {
  question_id: string;
  question: string;
  answer: string | string[];
  symptom_id?: string;
};

type QuestionOption = {
  value: string;
  label: { ro: string; en: string };
  hint?: { ro: string; en: string };
};

type AdaptiveQuestion = {
  id: string;
  title: { ro: string; en: string };
  description: { ro: string; en: string };
  options: QuestionOption[];
};

const questions: AdaptiveQuestion[] = [
  {
    id: "onset",
    title: {
      ro: "Cum a început problema?",
      en: "How did the problem begin?",
    },
    description: {
      ro: "Momentul apariției poate diferenția o defecțiune bruscă de una care s-a agravat în timp.",
      en: "The onset can help distinguish a sudden fault from one that developed gradually.",
    },
    options: [
      {
        value: "sudden",
        label: { ro: "Brusc", en: "Suddenly" },
        hint: { ro: "A apărut dintr-o dată", en: "It appeared all at once" },
      },
      {
        value: "gradual",
        label: { ro: "Treptat", en: "Gradually" },
        hint: { ro: "S-a accentuat în timp", en: "It became worse over time" },
      },
      {
        value: "after_event",
        label: { ro: "După un eveniment", en: "After an event" },
        hint: { ro: "După reparație, alimentare, impact etc.", en: "After repair, refueling, impact, etc." },
      },
      {
        value: "unknown",
        label: { ro: "Nu știu", en: "I don't know" },
      },
    ],
  },
  {
    id: "frequency",
    title: {
      ro: "Cât de des apare?",
      en: "How often does it happen?",
    },
    description: {
      ro: "Frecvența ajută motorul de diagnostic să diferențieze problemele permanente de cele intermitente.",
      en: "Frequency helps the diagnostic engine distinguish persistent faults from intermittent ones.",
    },
    options: [
      {
        value: "always",
        label: { ro: "Tot timpul", en: "Always" },
        hint: { ro: "Problema este prezentă constant", en: "The problem is constantly present" },
      },
      {
        value: "intermittent",
        label: { ro: "Intermitent", en: "Intermittently" },
        hint: { ro: "Apare și dispare", en: "It comes and goes" },
      },
      {
        value: "once",
        label: { ro: "S-a întâmplat o singură dată", en: "It happened once" },
      },
      {
        value: "unknown",
        label: { ro: "Nu știu", en: "I don't know" },
      },
    ],
  },
  {
    id: "performance_change",
    title: {
      ro: "S-a schimbat comportamentul mașinii?",
      en: "Has the vehicle's performance changed?",
    },
    description: {
      ro: "Poate fi vorba de putere redusă, răspuns mai lent, ralanti instabil sau alt comportament diferit.",
      en: "This can include reduced power, slower response, unstable idle or other noticeable behavior changes.",
    },
    options: [
      {
        value: "yes",
        label: { ro: "Da", en: "Yes" },
        hint: { ro: "Comportamentul este clar diferit", en: "The vehicle clearly behaves differently" },
      },
      {
        value: "no",
        label: { ro: "Nu", en: "No" },
        hint: { ro: "Mașina se comportă normal în rest", en: "The vehicle otherwise behaves normally" },
      },
      {
        value: "unknown",
        label: { ro: "Nu sunt sigur", en: "I'm not sure" },
      },
    ],
  },
  {
    id: "conditions",
    title: {
      ro: "Când este cel mai evident simptomul?",
      en: "When is the symptom most noticeable?",
    },
    description: {
      ro: "Alege situația care se apropie cel mai mult. Dacă nu poți identifica una, poți selecta „Nu știu”.",
      en: "Choose the situation that fits best. If you cannot identify one, select “I don't know”.",
    },
    options: [
      { value: "acceleration", label: { ro: "La accelerație", en: "During acceleration" } },
      { value: "idle", label: { ro: "La ralanti", en: "At idle" } },
      { value: "cold_start", label: { ro: "La pornirea la rece", en: "During cold start" } },
      { value: "hot_engine", label: { ro: "Cu motorul cald", en: "With the engine warm" } },
      { value: "braking", label: { ro: "La frânare", en: "During braking" } },
      { value: "turning", label: { ro: "La virare", en: "While turning" } },
      { value: "highway", label: { ro: "La viteză mai mare", en: "At higher speed" } },
      { value: "random", label: { ro: "Fără un tipar clar", en: "No clear pattern" } },
      { value: "unknown", label: { ro: "Nu știu", en: "I don't know" } },
    ],
  },
  {
    id: "warning_light",
    title: {
      ro: "Este aprins vreun martor în bord?",
      en: "Is a dashboard warning light on?",
    },
    description: {
      ro: "Un martor poate oferi un indiciu suplimentar chiar dacă nu ai un cod DTC disponibil.",
      en: "A warning light can provide additional evidence even when no DTC code is available.",
    },
    options: [
      { value: "yes", label: { ro: "Da", en: "Yes" } },
      { value: "no", label: { ro: "Nu", en: "No" } },
      { value: "unknown", label: { ro: "Nu sunt sigur", en: "I'm not sure" } },
    ],
  },
];

const categoryLabels: Record<
  SymptomCategory,
  { ro: string; en: string; code: string }
> = {
  power: { ro: "Lipsă de putere / accelerație", en: "Loss of power / acceleration", code: "PWR" },
  starting: { ro: "Pornire / funcționare motor", en: "Starting / engine running", code: "ENG" },
  noise: { ro: "Zgomot / vibrații", en: "Noise / vibration", code: "NVH" },
  smoke: { ro: "Fum / miros", en: "Smoke / smell", code: "EXH" },
  warning: { ro: "Martor în bord", en: "Dashboard warning", code: "MIL" },
  brakes: { ro: "Frânare / direcție", en: "Braking / steering", code: "CHS" },
  temperature: { ro: "Temperatură / supraîncălzire", en: "Temperature / overheating", code: "TMP" },
  other: { ro: "Alt simptom", en: "Other symptom", code: "..." },
};

export default function QuestionsPage() {
  const router = useRouter();

  const [language, setLanguage] = useState<Language>("en");
  const [currentSymptom, setCurrentSymptom] = useState<SymptomRecord | null>(null);
  const [totalSymptoms, setTotalSymptoms] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage === "ro" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    const savedSymptoms = localStorage.getItem("diagnosticSymptoms");
    if (!savedSymptoms) {
      router.replace("/diagnosis/symptoms");
      return;
    }

    try {
      const parsedSymptoms: SymptomRecord[] = JSON.parse(savedSymptoms);

      if (!Array.isArray(parsedSymptoms) || parsedSymptoms.length === 0) {
        router.replace("/diagnosis/symptoms");
        return;
      }

      setTotalSymptoms(parsedSymptoms.length);

      const currentSymptomId = localStorage.getItem("currentSymptomId");
      const symptom =
        parsedSymptoms.find((item) => item.id === currentSymptomId) ??
        parsedSymptoms[parsedSymptoms.length - 1];

      setCurrentSymptom(symptom);

      const savedAnswers = localStorage.getItem("diagnosticAnswers");

      if (savedAnswers) {
        try {
          const parsedAnswers: AdaptiveAnswer[] = JSON.parse(savedAnswers);

          if (Array.isArray(parsedAnswers)) {
            const restored: Record<string, string> = {};

            parsedAnswers
              .filter((answer) => answer.symptom_id === symptom.id)
              .forEach((answer) => {
                if (typeof answer.answer === "string") {
                  restored[answer.question_id] = answer.answer;
                }
              });

            setAnswers(restored);
          }
        } catch {
          // Ignore invalid old local draft.
        }
      }
    } catch {
      router.replace("/diagnosis/symptoms");
    }
  }, [router]);

  const text = {
    en: {
      eyebrow: "ADAPTIVE QUESTIONS",
      title: "Let's narrow it down",
      description:
        "A few targeted questions help AutoDiagnose AI weigh the evidence more accurately.",
      question: "Question",
      of: "of",
      symptomContext: "Symptom context",
      currentSymptom: "Current symptom",
      symptomsInCase: "Symptoms in case",
      answered: "Answered",
      diagnosticSignal: "Diagnostic signal",
      signalDescription:
        "Each answer adds context to the current symptom. You can choose “I don't know” whenever you are unsure.",
      selectAnswer: "Choose one answer to continue.",
      back: "Back",
      next: "Next question",
      finish: "Save answers",
      noDescription: "No symptom description available.",
      ready: "Context ready",
      incomplete: "Waiting for answers",
    },
    ro: {
      eyebrow: "ÎNTREBĂRI ADAPTIVE",
      title: "Hai să restrângem cauzele",
      description:
        "Câteva întrebări țintite ajută AutoDiagnose AI să cântărească mai corect indiciile.",
      question: "Întrebarea",
      of: "din",
      symptomContext: "Context simptom",
      currentSymptom: "Simptom curent",
      symptomsInCase: "Simptome în caz",
      answered: "Răspunsuri",
      diagnosticSignal: "Semnal diagnostic",
      signalDescription:
        "Fiecare răspuns adaugă context simptomului curent. Poți alege „Nu știu” ori de câte ori nu ești sigur.",
      selectAnswer: "Alege un răspuns pentru a continua.",
      back: "Înapoi",
      next: "Următoarea întrebare",
      finish: "Salvează răspunsurile",
      noDescription: "Descrierea simptomului nu este disponibilă.",
      ready: "Context complet",
      incomplete: "Așteaptă răspunsuri",
    },
  }[language];

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] ?? "";
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const symptomMeta = useMemo(() => {
    if (!currentSymptom) {
      return null;
    }

    return categoryLabels[currentSymptom.primary_category];
  }, [currentSymptom]);

  function selectAnswer(value: string) {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));

    setError("");
  }

  function goNext() {
    if (!currentAnswer) {
      setError(text.selectAnswer);
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((index) => index + 1);
      setError("");
      return;
    }

    saveAnswers();
  }

  function goBack() {
    if (currentQuestionIndex === 0) {
      router.push("/diagnosis/symptoms");
      return;
    }

    setCurrentQuestionIndex((index) => index - 1);
    setError("");
  }

  function saveAnswers() {
    if (!currentSymptom) {
      router.replace("/diagnosis/symptoms");
      return;
    }

    if (!currentAnswer) {
      setError(text.selectAnswer);
      return;
    }

    const newAnswers: AdaptiveAnswer[] = questions.map((question) => ({
      question_id: question.id,
      question: question.title[language],
      answer: answers[question.id],
      symptom_id: currentSymptom.id,
    }));

    const saved = localStorage.getItem("diagnosticAnswers");
    let previousAnswers: AdaptiveAnswer[] = [];

    if (saved) {
      try {
        const parsed: AdaptiveAnswer[] = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          previousAnswers = parsed.filter(
            (answer) => answer.symptom_id !== currentSymptom.id
          );
        }
      } catch {
        previousAnswers = [];
      }
    }

    localStorage.setItem(
      "diagnosticAnswers",
      JSON.stringify([
        ...previousAnswers,
        ...newAnswers,
      ])
    );

    router.push("/diagnosis/symptom-complete");
  }

  if (!currentSymptom) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060912] text-white">
        <p className="text-sm text-zinc-500">AutoDiagnose AI</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060912] text-white">
      <div className="ad-page">
        <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <section className="ad-surface relative overflow-hidden rounded-[30px] p-6 sm:p-8 lg:p-9">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.07] blur-[90px]" />

            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="ad-eyebrow">{text.eyebrow}</p>

                  <h1 className="mt-3 text-[2rem] font-semibold leading-[1.12] tracking-[-0.035em] text-white sm:text-[2.35rem]">
                    {text.title}
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-[15px]">
                    {text.description}
                  </p>
                </div>

                <div className="rounded-full border border-white/[0.06] bg-white/[0.018] px-3 py-1.5 text-[10px] font-semibold text-zinc-500">
                  {text.question} {currentQuestionIndex + 1} {text.of} {questions.length}
                </div>
              </div>

              <div className="mt-7">
                <div className="h-1 overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-blue-400 transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-8 rounded-[24px] border border-white/[0.055] bg-white/[0.012] p-5 sm:p-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-300/55">
                  {String(currentQuestionIndex + 1).padStart(2, "0")}
                </p>

                <h2 className="mt-3 max-w-2xl text-xl font-semibold tracking-[-0.025em] text-zinc-100 sm:text-2xl">
                  {currentQuestion.title[language]}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                  {currentQuestion.description[language]}
                </p>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {currentQuestion.options.map((option) => {
                    const selected = currentAnswer === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => selectAnswer(option.value)}
                        className={`relative min-h-[76px] overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 ${
                          selected
                            ? "border-blue-400/25 bg-blue-500/[0.075]"
                            : "border-white/[0.055] bg-black/10 hover:border-white/[0.10] hover:bg-white/[0.022]"
                        }`}
                      >
                        {selected && (
                          <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-500/[0.12] blur-[30px]" />
                        )}

                        <div className="relative flex items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? "border-blue-300/60 bg-blue-400"
                                : "border-white/10 bg-white/[0.015]"
                            }`}
                          >
                            {selected && (
                              <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </span>

                          <span>
                            <span
                              className={`block text-sm font-medium ${
                                selected ? "text-white" : "text-zinc-400"
                              }`}
                            >
                              {option.label[language]}
                            </span>

                            {option.hint && (
                              <span className="mt-1 block text-[10px] leading-4 text-zinc-700">
                                {option.hint[language]}
                              </span>
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-400/10 bg-red-400/[0.035] px-4 py-3 text-xs text-red-300">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="min-h-12 rounded-xl border border-white/[0.07] bg-white/[0.018] px-5 text-sm font-medium text-zinc-400 transition hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-white"
                >
                  ← {text.back}
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-blue-500 px-5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(37,99,235,0.20)] transition-all duration-200 hover:bg-blue-400"
                >
                  {currentQuestionIndex === questions.length - 1
                    ? text.finish
                    : text.next}

                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </button>
              </div>
            </div>
          </section>

          <aside className="ad-surface relative overflow-hidden rounded-[30px] p-5 xl:sticky xl:top-6">
            <div className="pointer-events-none absolute left-1/2 top-16 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[75px]" />

            <div className="relative">
              <p className="text-[9px] font-semibold uppercase tracking-[0.20em] text-blue-300/55">
                {text.symptomContext}
              </p>

              <div className="mt-4 rounded-[22px] border border-white/[0.05] bg-[#070c15] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.06] text-[9px] font-bold tracking-[0.08em] text-blue-200/75">
                    {symptomMeta?.code}
                  </span>

                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.13em] text-zinc-700">
                      {text.currentSymptom}
                    </p>

                    <p className="mt-1.5 text-sm font-semibold leading-5 text-zinc-200">
                      {symptomMeta?.[language]}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-zinc-600">
                  {currentSymptom.description || text.noDescription}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/[0.045] bg-white/[0.012] p-3">
                  <p className="text-[8px] uppercase tracking-[0.12em] text-zinc-700">
                    {text.symptomsInCase}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-zinc-300">
                    {totalSymptoms}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.045] bg-white/[0.012] p-3">
                  <p className="text-[8px] uppercase tracking-[0.12em] text-zinc-700">
                    {text.answered}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-zinc-300">
                    {answeredCount}/{questions.length}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-[22px] border border-white/[0.05] bg-white/[0.012] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-700">
                    {text.diagnosticSignal}
                  </p>

                  <span
                    className={`h-2 w-2 rounded-full ${
                      answeredCount === questions.length
                        ? "bg-emerald-400"
                        : "bg-blue-400"
                    }`}
                  />
                </div>

                <p className="mt-2 text-xs font-medium text-zinc-400">
                  {answeredCount === questions.length
                    ? text.ready
                    : text.incomplete}
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-blue-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-4 text-[11px] leading-5 text-zinc-600">
                  {text.signalDescription}
                </p>
              </div>

              <div className="mt-3 space-y-2">
                {questions.map((question, index) => {
                  const answered = Boolean(answers[question.id]);
                  const active = index === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                        active
                          ? "border-blue-400/15 bg-blue-500/[0.045]"
                          : "border-white/[0.04] bg-white/[0.008] hover:bg-white/[0.018]"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold ${
                          answered
                            ? "bg-emerald-400/10 text-emerald-300"
                            : active
                              ? "bg-blue-400/10 text-blue-200"
                              : "bg-white/[0.025] text-zinc-700"
                        }`}
                      >
                        {answered ? "✓" : index + 1}
                      </span>

                      <span
                        className={`truncate text-[10px] ${
                          active ? "text-zinc-300" : "text-zinc-600"
                        }`}
                      >
                        {question.title[language]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}