"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  getCurrentGuest,
  getCurrentUser,
} from "@/lib/api";


type Language = "ro" | "en";


export default function HomePage() {
  const router = useRouter();

  const [
    isChecking,
    setIsChecking,
  ] = useState(true);


  useEffect(() => {
    async function initializeApp() {
      const savedLanguage =
        localStorage.getItem(
          "language"
        );


      /*
       * No language selected yet.
       * This is the user's first step.
       */
      if (
        savedLanguage !== "ro" &&
        savedLanguage !== "en"
      ) {
        setIsChecking(false);
        return;
      }


      /*
       * Language already exists.
       * Check whether the user
       * already has an active session.
       */
      try {
        const user =
          await getCurrentUser();

        if (user) {
          router.replace(
            "/dashboard"
          );

          return;
        }


        const guest =
          await getCurrentGuest();

        if (guest) {
          router.replace(
            "/dashboard"
          );

          return;
        }


        /*
         * Language exists,
         * but there is no active session.
         */
        router.replace(
          "/welcome"
        );

      } catch {
        router.replace(
          "/welcome"
        );
      }
    }


    void initializeApp();

  }, [router]);


  function selectLanguage(
    language: Language
  ) {
    localStorage.setItem(
      "language",
      language
    );

    router.push(
      "/welcome"
    );
  }


  /*
   * Prevent the language page from
   * briefly appearing while checking
   * an existing session.
   */
  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            AutoDiagnose AI
          </p>

          <p className="mt-4 text-zinc-400">
            Loading...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">

      <div className="w-full max-w-2xl text-center">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          AUTODIAGNOSE AI
        </p>


        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Choose your language
        </h1>


        <p className="mt-4 text-lg text-zinc-400">
          Alege limba în care vrei să folosești aplicația.
        </p>


        <div className="mt-10 grid gap-4 sm:grid-cols-2">

          <button
            type="button"
            onClick={() =>
              selectLanguage(
                "ro"
              )
            }
            className="rounded-2xl bg-white px-6 py-6 text-left text-black transition hover:bg-zinc-200"
          >
            <span className="block text-xl font-semibold">
              Română
            </span>

            <span className="mt-2 block text-sm text-zinc-600">
              Continuă aplicația în limba română.
            </span>
          </button>


          <button
            type="button"
            onClick={() =>
              selectLanguage(
                "en"
              )
            }
            className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-6 text-left transition hover:border-zinc-500 hover:bg-zinc-800"
          >
            <span className="block text-xl font-semibold">
              English
            </span>

            <span className="mt-2 block text-sm text-zinc-400">
              Continue using the application in English.
            </span>
          </button>

        </div>

      </div>

    </main>
  );
}