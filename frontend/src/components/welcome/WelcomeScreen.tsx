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
  startGuest,
} from "@/lib/api";

import WelcomeDesktop from "./WelcomeDesktop";
import WelcomeMobile from "./WelcomeMobile";


type Language =
  | "ro"
  | "en";


export type WelcomeText = {
  title: string;
  description: string;
  start: string;
  signIn: string;
  guest: string;
  guestLoading: string;
  error: string;
};


export default function WelcomeScreen() {
  const router =
    useRouter();

  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );

  const [
    isCheckingSession,
    setIsCheckingSession,
  ] = useState(true);

  const [
    guestLoading,
    setGuestLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );

    if (
      savedLanguage !== "ro" &&
      savedLanguage !== "en"
    ) {
      router.replace("/");
      return;
    }

    setLanguage(
      savedLanguage
    );


    async function checkSession() {
      try {
        const currentUser =
          await getCurrentUser();

        if (currentUser) {
          router.replace(
            "/dashboard"
          );

          return;
        }

        const currentGuest =
          await getCurrentGuest();

        if (currentGuest) {
          router.replace(
            "/dashboard"
          );

          return;
        }
      } catch {
        // Keep Welcome available
        // if the session check fails.
      } finally {
        setIsCheckingSession(
          false
        );
      }
    }


    void checkSession();
  }, [router]);


  const content:
    Record<
      Language,
      WelcomeText
    > = {
    en: {
      title:
        "Smarter diagnostics. Clearer decisions.",

      description:
        "Vehicle data, symptoms and DTC codes — organized into one clear diagnostic path.",

      start:
        "Start diagnosis",

      signIn:
        "Sign in",

      guest:
        "Continue as guest",

      guestLoading:
        "Starting...",

      error:
        "Guest mode could not be started. Please try again.",
    },

    ro: {
      title:
        "Diagnostic mai inteligent. Decizii mai clare.",

      description:
        "Datele vehiculului, simptomele și codurile DTC — organizate într-un traseu clar de diagnostic.",

      start:
        "Începe diagnosticul",

      signIn:
        "Autentificare",

      guest:
        "Continuă ca vizitator",

      guestLoading:
        "Se pornește...",

      error:
        "Sesiunea de vizitator nu a putut fi pornită. Încearcă din nou.",
    },
  };


  const text =
    content[language];


  async function startGuestAndGo(
    destination: string
  ) {
    setError(null);
    setGuestLoading(true);

    try {
      await startGuest();

      router.push(
        destination
      );
    } catch {
      setError(
        text.error
      );

      setGuestLoading(
        false
      );
    }
  }


  if (
    isCheckingSession
  ) {
    return (
      <main
        className="
          h-dvh
          overflow-hidden
          bg-[#02060d]
        "
      />
    );
  }


  return (
    <>
      <div
        className="
          hidden
          md:block
        "
      >
        <WelcomeDesktop
          text={text}
          guestLoading={
            guestLoading
          }
          error={error}
          onStartDiagnosis={() =>
            void startGuestAndGo(
              "/diagnosis/vehicles"
            )
          }
          onSignIn={() =>
            router.push(
              "/login"
            )
          }
          onContinueGuest={() =>
            void startGuestAndGo(
              "/dashboard"
            )
          }
        />
      </div>

      <div
        className="
          md:hidden
        "
      >
        <WelcomeMobile
          text={text}
          guestLoading={
            guestLoading
          }
          error={error}
          onStartDiagnosis={() =>
            void startGuestAndGo(
              "/diagnosis/vehicles"
            )
          }
          onSignIn={() =>
            router.push(
              "/login"
            )
          }
          onContinueGuest={() =>
            void startGuestAndGo(
              "/dashboard"
            )
          }
        />
      </div>
    </>
  );
}