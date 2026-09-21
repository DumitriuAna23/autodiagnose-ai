"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getCurrentUser,
  logout,
  startGuest,
} from "@/lib/api";


type Language = "en" | "ro";

type SessionType =
  | "loading"
  | "none"
  | "user"
  | "guest";


export default function WelcomePage() {
  const router = useRouter();

  const [language, setLanguage] =
    useState<Language>("en");

  const [apiOnline, setApiOnline] =
    useState(false);

  const [
    sessionType,
    setSessionType,
  ] = useState<SessionType>(
    "loading"
  );

  const [userEmail, setUserEmail] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


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


    fetch(
      "http://127.0.0.1:8000/health"
    )
      .then((response) =>
        response.json()
      )
      .then((data) => {
        setApiOnline(
          data.status === "ok"
        );
      })
      .catch(() => {
        setApiOnline(false);
      });


    async function checkSession() {
  try {
    const user =
      await getCurrentUser();

    if (user) {
      router.replace(
        "/dashboard"
      );

      return;
    }


    const guestResponse =
      await fetch(
        "http://127.0.0.1:8000/api/guest/me",
        {
          credentials:
            "include",
        }
      );


    if (guestResponse.ok) {
      router.replace(
        "/dashboard"
      );

      return;
    }


    setSessionType(
      "none"
    );

  } catch {
    setSessionType(
      "none"
    );
  }
}


    void checkSession();
  }, []);


  const content = {
    en: {
      eyebrow:
        "AUTO DIAGNOSTIC ASSISTANT",

      title:
        "Understand what your vehicle is telling you.",

      description:
        "Analyze symptoms, DTC codes and vehicle information through a structured diagnostic process.",

      signIn:
        "Sign in",

      signInDescription:
        "Access your saved diagnostics and personal history.",

      createAccount:
        "Create account",

      createAccountDescription:
        "Save your diagnostic history and access it from other devices.",

      guest:
        "Continue as Guest",

      guestDescription:
        "Use AutoDiagnose AI without creating an account. If you sign in or create an account later, your guest diagnostics can be transferred to your account.",

      continueDiagnosis:
        "Continue diagnosis",

      continueDescription:
        "Start a new diagnostic process.",

      history:
        "Diagnostic history",

      historyDescription:
        "View your previous diagnostic cases.",

      signedInAs:
        "Signed in as",

      guestMode:
        "Guest Mode",

      guestModeDescription:
        "Your diagnostics belong to this temporary guest session.",

      signOut:
        "Sign out",

      guideTitle:
        "How does AutoDiagnose AI work?",

      guideDescription:
        "Learn how to enter vehicle information correctly, describe symptoms, use DTC codes and understand the diagnostic results.",

      guideButton:
        "View user guide",

      apiOnline:
        "Diagnostic API online",

      apiOffline:
        "Diagnostic API offline",

      guestLoading:
        "Starting Guest Mode...",

      signingOut:
        "Signing out...",
    },

    ro: {
      eyebrow:
        "ASISTENT DE DIAGNOSTIC AUTO",

      title:
        "Înțelege ce încearcă să îți spună mașina.",

      description:
        "Analizează simptomele, codurile DTC și informațiile vehiculului printr-un proces structurat de diagnostic.",

      signIn:
        "Autentificare",

      signInDescription:
        "Accesează diagnosticele salvate și istoricul personal.",

      createAccount:
        "Creează cont",

      createAccountDescription:
        "Salvează istoricul diagnosticelor și accesează-l de pe alte dispozitive.",

      guest:
        "Continuă ca vizitator",

      guestDescription:
        "Folosește AutoDiagnose AI fără să creezi un cont. Dacă ulterior te autentifici sau creezi un cont, diagnosticele făcute ca vizitator pot fi transferate în cont.",

      continueDiagnosis:
        "Continuă diagnosticul",

      continueDescription:
        "Începe un nou proces de diagnostic.",

      history:
        "Istoric diagnostice",

      historyDescription:
        "Vezi cazurile tale de diagnostic anterioare.",

      signedInAs:
        "Autentificat ca",

      guestMode:
        "Mod vizitator",

      guestModeDescription:
        "Diagnosticele tale aparțin acestei sesiuni temporare de vizitator.",

      signOut:
        "Deconectare",

      guideTitle:
        "Cum funcționează AutoDiagnose AI?",

      guideDescription:
        "Află cum să introduci corect informațiile vehiculului, cum să descrii simptomele, cum să folosești codurile DTC și cum să interpretezi rezultatele.",

      guideButton:
        "Vezi ghidul de utilizare",

      apiOnline:
        "API diagnostic online",

      apiOffline:
        "API diagnostic offline",

      guestLoading:
        "Se pornește modul vizitator...",

      signingOut:
        "Se face deconectarea...",
    },
  };


  const text =
    content[language];


  async function handleGuest() {
    setError(null);
    setIsLoading(true);

    try {
      await startGuest();

      window.location.replace(
        "/dashboard"
      );
    } catch (error) {
      if (
        error instanceof Error
      ) {
        setError(
          error.message
        );
      } else {
        setError(
          "Something went wrong."
        );
      }

      setIsLoading(false);
    }
  }


  async function handleLogout() {
    setError(null);
    setIsLoading(true);

    try {
      await logout();

      setUserEmail(null);

      setSessionType(
        "none"
      );

      window.location.replace(
        "/welcome"
      );
    } catch (error) {
      if (
        error instanceof Error
      ) {
        setError(
          error.message
        );
      } else {
        setError(
          "Something went wrong."
        );
      }

      setIsLoading(false);
    }
  }


  function handleHistory() {
    if (
      sessionType === "user" ||
      sessionType === "guest"
    ) {
      router.push(
        "/diagnosis/history"
      );
    }
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-16 text-white">

      <div className="w-full max-w-3xl">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          {text.eyebrow}
        </p>


        <h1 className="mt-5 max-w-2xl text-5xl font-bold leading-tight tracking-tight">
          {text.title}
        </h1>


        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          {text.description}
        </p>


        <div className="mt-8 flex items-center gap-2 text-sm text-zinc-400">

          <span
            className={`h-2.5 w-2.5 rounded-full ${
              apiOnline
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <span>
            {apiOnline
              ? text.apiOnline
              : text.apiOffline}
          </span>

        </div>


        {sessionType === "loading" && (
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-zinc-400">
            Checking session...
          </div>
        )}


        {sessionType === "none" && (
          <>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/login"
                  )
                }
                className="rounded-2xl bg-white px-6 py-5 text-left text-black transition hover:bg-zinc-200"
              >
                <span className="block text-lg font-semibold">
                  {text.signIn}
                </span>

                <span className="mt-2 block text-sm text-zinc-600">
                  {
                    text.signInDescription
                  }
                </span>
              </button>


              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/register"
                  )
                }
                className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-left transition hover:border-zinc-500 hover:bg-zinc-800"
              >
                <span className="block text-lg font-semibold">
                  {
                    text.createAccount
                  }
                </span>

                <span className="mt-2 block text-sm text-zinc-400">
                  {
                    text.createAccountDescription
                  }
                </span>
              </button>

            </div>


            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">

              <h2 className="text-lg font-semibold">
                {text.guest}
              </h2>

              <p className="mt-2 leading-6 text-zinc-400">
                {
                  text.guestDescription
                }
              </p>

              <button
                type="button"
                onClick={() =>
                  void handleGuest()
                }
                disabled={isLoading}
                className="mt-5 rounded-xl border border-zinc-700 px-5 py-3 font-semibold transition hover:border-zinc-500 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading
                  ? text.guestLoading
                  : text.guest}
              </button>

            </div>
          </>
        )}


        {sessionType === "user" && (
          <>
            <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">

              <p className="text-sm text-zinc-500">
                {text.signedInAs}
              </p>

              <p className="mt-1 font-semibold">
                {userEmail}
              </p>

            </div>


            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/diagnosis/vehicle"
                  )
                }
                className="rounded-2xl bg-white px-6 py-5 text-left text-black transition hover:bg-zinc-200"
              >
                <span className="block text-lg font-semibold">
                  {
                    text.continueDiagnosis
                  }
                </span>

                <span className="mt-2 block text-sm text-zinc-600">
                  {
                    text.continueDescription
                  }
                </span>
              </button>


              <button
                type="button"
                onClick={
                  handleHistory
                }
                className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-left transition hover:border-zinc-500 hover:bg-zinc-800"
              >
                <span className="block text-lg font-semibold">
                  {text.history}
                </span>

                <span className="mt-2 block text-sm text-zinc-400">
                  {
                    text.historyDescription
                  }
                </span>
              </button>

            </div>

<button
  type="button"
  onClick={() =>
    router.push(
      "/account"
    )
  }
  className="mt-4 rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold transition hover:border-zinc-500 hover:bg-zinc-900"
>
  Account
</button>
            <button
              type="button"
              onClick={() =>
                void handleLogout()
              }
              disabled={isLoading}
              className="mt-4 rounded-xl border border-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? text.signingOut
                : text.signOut}
            </button>
          </>
        )}


        {sessionType === "guest" && (
          <>
            <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">

              <p className="font-semibold">
                {text.guestMode}
              </p>

              <p className="mt-2 leading-6 text-zinc-400">
                {
                  text.guestModeDescription
                }
              </p>

            </div>


            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/diagnosis/vehicle"
                  )
                }
                className="rounded-2xl bg-white px-6 py-5 text-left text-black transition hover:bg-zinc-200"
              >
                <span className="block text-lg font-semibold">
                  {
                    text.continueDiagnosis
                  }
                </span>

                <span className="mt-2 block text-sm text-zinc-600">
                  {
                    text.continueDescription
                  }
                </span>
              </button>


              <button
                type="button"
                onClick={
                  handleHistory
                }
                className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-left transition hover:border-zinc-500 hover:bg-zinc-800"
              >
                <span className="block text-lg font-semibold">
                  {text.history}
                </span>

                <span className="mt-2 block text-sm text-zinc-400">
                  {
                    text.historyDescription
                  }
                </span>
              </button>

            </div>


            <div className="mt-4 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/login"
                  )
                }
                className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-900"
              >
                {text.signIn}
              </button>


              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/register"
                  )
                }
                className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-900"
              >
                {text.createAccount}
              </button>

            </div>
          </>
        )}


        {error && (
          <div className="mt-5 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}


        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            AutoDiagnose AI Guide
          </p>

          <h2 className="mt-3 text-xl font-semibold">
            {text.guideTitle}
          </h2>

          <p className="mt-3 leading-7 text-zinc-400">
            {
              text.guideDescription
            }
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/guide")
            }
            className="mt-5 rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-900"
          >
            {text.guideButton}
          </button>

        </div>

      </div>

    </main>
  );
}