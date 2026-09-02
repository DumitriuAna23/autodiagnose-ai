"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const selectLanguage = (language: "en" | "ro") => {
    localStorage.setItem("language", language);
    router.push("/welcome");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="w-full max-w-xl text-center">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">
            Automotive Diagnostic Platform
          </p>

          <h1 className="text-5xl font-bold tracking-tight">
            AutoDiagnose AI
          </h1>

          <p className="mt-5 text-lg text-zinc-400">
            Choose your language / Alege limba
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => selectLanguage("en")}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-left transition hover:border-zinc-400 hover:bg-zinc-800"
          >
            <span className="block text-2xl font-semibold">
              English
            </span>

            <span className="mt-2 block text-sm text-zinc-400">
              Continue in English
            </span>
          </button>

          <button
            type="button"
            onClick={() => selectLanguage("ro")}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-left transition hover:border-zinc-400 hover:bg-zinc-800"
          >
            <span className="block text-2xl font-semibold">
              Română
            </span>

            <span className="mt-2 block text-sm text-zinc-400">
              Continuă în limba română
            </span>
          </button>
        </div>

        <p className="mt-8 text-xs text-zinc-600">
          AI-assisted automotive diagnostics
        </p>
      </div>
    </main>
  );
}