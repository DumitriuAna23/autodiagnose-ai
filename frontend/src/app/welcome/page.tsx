"use client";

import { useEffect, useState } from "react";

type Language = "en" | "ro";

export default function WelcomePage() {
  const [language, setLanguage] = useState<Language>("en");
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
  const savedLanguage = localStorage.getItem("language");

  if (savedLanguage === "ro" || savedLanguage === "en") {
    setLanguage(savedLanguage);
  }

  fetch("http://127.0.0.1:8000/health")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        setApiOnline(true);
      }
    })
    .catch(() => {
      setApiOnline(false);
    });
}, []);

  const content = {
    en: {
      eyebrow: "AUTO DIAGNOSTIC ASSISTANT",
      title: "Understand what your vehicle is telling you.",
      description:
        "AutoDiagnose AI helps you analyze symptoms, diagnostic trouble codes and vehicle information through a structured diagnostic process.",
      button: "Start diagnosis",
    },

    ro: {
      eyebrow: "ASISTENT DE DIAGNOSTIC AUTO",
      title: "Înțelege ce încearcă să îți spună mașina.",
      description:
        "AutoDiagnose AI te ajută să analizezi simptomele, codurile de eroare și informațiile vehiculului printr-un proces structurat de diagnostic.",
      button: "Începe diagnoza",
    },
  };

  const text = content[language];

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="w-full max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          {text.eyebrow}
        </p>

        <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight">
          {text.title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          {text.description}
        </p>
        <div className="mt-8 flex items-center gap-2 text-sm text-zinc-400">
  <span
    className={`h-2.5 w-2.5 rounded-full ${
      apiOnline ? "bg-green-500" : "bg-red-500"
    }`}
  />

  <span>
    {apiOnline ? "Diagnostic API online" : "Diagnostic API offline"}
  </span>
</div>
        <button
          type="button"
          className="mt-10 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
        >
          {text.button}
        </button>
      </div>
    </main>
  );
}