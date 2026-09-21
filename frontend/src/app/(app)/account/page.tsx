"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  getCurrentUser,
  logout,
  User,
} from "@/lib/api";


type Language = "ro" | "en";


export default function AccountPage() {
  const router = useRouter();

  const [
    user,
    setUser,
  ] = useState<User | null>(null);

  const [
    language,
    setLanguage,
  ] = useState<Language>("en");

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);


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


    async function loadAccount() {
      try {
        const currentUser =
          await getCurrentUser();

        if (!currentUser) {
          router.replace(
            "/welcome"
          );

          return;
        }

        setUser(
          currentUser
        );

        setIsLoading(false);

      } catch {
        router.replace(
          "/welcome"
        );
      }
    }


    void loadAccount();

  }, [router]);


  const content = {
    en: {
      eyebrow:
        "AUTODIAGNOSE AI",

      title:
        "Account",

      description:
        "Manage your AutoDiagnose AI account and preferences.",

      accountDetails:
        "Account details",

      email:
        "Email",

      status:
        "Account status",

      language:
        "Language",

      romanian:
        "Romanian",

      english:
        "English",

      history:
        "Diagnostic history",

      historyDescription:
        "View diagnostic cases saved to your account.",

      changeLanguage:
        "Change language",

      changeLanguageDescription:
        "Return to language selection and choose another interface language.",

      signOut:
        "Sign out",

      signingOut:
        "Signing out...",

      back:
        "Back to AutoDiagnose AI",
    },

    ro: {
      eyebrow:
        "AUTODIAGNOSE AI",

      title:
        "Cont",

      description:
        "Administrează contul și preferințele AutoDiagnose AI.",

      accountDetails:
        "Detalii cont",

      email:
        "Email",

      status:
        "Stare cont",

      language:
        "Limbă",

      romanian:
        "Română",

      english:
        "Engleză",

      history:
        "Istoric diagnostice",

      historyDescription:
        "Vezi cazurile de diagnostic salvate în contul tău.",

      changeLanguage:
        "Schimbă limba",

      changeLanguageDescription:
        "Revino la alegerea limbii și selectează o altă limbă pentru interfață.",

      signOut:
        "Deconectare",

      signingOut:
        "Se face deconectarea...",

      back:
        "Înapoi la AutoDiagnose AI",
    },
  };


  const text =
    content[language];

function handleChangeLanguage() {
  localStorage.removeItem("language");

  window.location.replace("/");
}
  async function handleLogout() {
    setError(null);
    setIsLoggingOut(true);

    try {
      await logout();

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

      setIsLoggingOut(false);
    }
  }


  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            AutoDiagnose AI
          </p>

          <p className="mt-4 text-zinc-400">
            Loading account...
          </p>

        </div>

      </main>
    );
  }


  if (!user) {
    return null;
  }


  return (


    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">

      <div className="mx-auto w-full max-w-3xl">

        <button
          type="button"
          onClick={() =>
            router.push(
              "/welcome"
            )
          }
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          ← {text.back}
        </button>


        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          {text.eyebrow}
        </p>


        <h1 className="mt-4 text-4xl font-bold">
          {text.title}
        </h1>


        <p className="mt-4 text-lg text-zinc-400">
          {text.description}
        </p>


        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">

          <h2 className="text-xl font-semibold">
            {text.accountDetails}
          </h2>


          <div className="mt-6 space-y-5">

            <div>
              <p className="text-sm text-zinc-500">
                {text.email}
              </p>

              <p className="mt-1 font-medium">
                {user.email}
              </p>
            </div>


            <div>
              <p className="text-sm text-zinc-500">
                {text.status}
              </p>

              <p className="mt-1 font-medium capitalize">
                {
                  user.account_status
                }
              </p>
            </div>


            <div>
              <p className="text-sm text-zinc-500">
                {text.language}
              </p>

              <p className="mt-1 font-medium">
                {language === "ro"
                  ? text.romanian
                  : text.english}
              </p>
            </div>

          </div>

        </section>


        <section className="mt-6 grid gap-4 sm:grid-cols-2">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/history"
              )
            }
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-left transition hover:border-zinc-600 hover:bg-zinc-900"
          >
            <span className="block text-lg font-semibold">
              {text.history}
            </span>

            <span className="mt-2 block text-sm leading-6 text-zinc-400">
              {
                text.historyDescription
              }
            </span>
          </button>


          <button
  type="button"
  onClick={handleChangeLanguage}
  className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-left transition hover:border-zinc-600 hover:bg-zinc-900"
>
  <span className="block text-lg font-semibold">
    {text.changeLanguage}
  </span>

  <span className="mt-2 block text-sm leading-6 text-zinc-400">
    {text.changeLanguageDescription}
  </span>
</button>

        </section>


        {error && (
          <div className="mt-6 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}


        <div className="mt-8 border-t border-zinc-800 pt-8">

          <button
            type="button"
            onClick={() =>
              void handleLogout()
            }
            disabled={
              isLoggingOut
            }
            className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold transition hover:border-zinc-500 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingOut
              ? text.signingOut
              : text.signOut}
          </button>

        </div>

      </div>

    </main>
  );
}