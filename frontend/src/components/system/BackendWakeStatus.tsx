"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  API_BASE_URL,
} from "@/lib/config";


type Language =
  | "ro"
  | "en";


type WakeState =
  | "hidden"
  | "starting"
  | "extended"
  | "error";


const SLOW_MESSAGE_DELAY_MS =
  4000;

const EXTENDED_MESSAGE_DELAY_MS =
  25000;

const REQUEST_TIMEOUT_MS =
  75000;


function getStoredLanguage():
  Language {
  if (
    typeof window ===
    "undefined"
  ) {
    return "en";
  }

  const savedLanguage =
    localStorage.getItem(
      "language"
    );

  return savedLanguage === "ro"
    ? "ro"
    : "en";
}


export default function BackendWakeStatus() {
  const [
    language,
    setLanguage,
  ] = useState<Language>("en");

  const [
    state,
    setState,
  ] = useState<WakeState>(
    "hidden"
  );

  const runIdRef =
    useRef(0);

  const runCheck =
    useCallback(
      async () => {
        const runId =
          runIdRef.current + 1;

        runIdRef.current =
          runId;

        setLanguage(
          getStoredLanguage()
        );

        setState(
          "hidden"
        );

        const controller =
          new AbortController();

        const slowTimer =
          window.setTimeout(
            () => {
              if (
                runIdRef.current
                === runId
              ) {
                setState(
                  "starting"
                );
              }
            },
            SLOW_MESSAGE_DELAY_MS
          );

        const extendedTimer =
          window.setTimeout(
            () => {
              if (
                runIdRef.current
                === runId
              ) {
                setState(
                  "extended"
                );
              }
            },
            EXTENDED_MESSAGE_DELAY_MS
          );

        const timeoutTimer =
          window.setTimeout(
            () => {
              controller.abort();
            },
            REQUEST_TIMEOUT_MS
          );

        try {
          const response =
            await fetch(
              `${API_BASE_URL}/health`,
              {
                method: "GET",
                cache: "no-store",
                signal:
                  controller.signal,
              }
            );

          if (!response.ok) {
            throw new Error(
              "BACKEND_HEALTH_FAILED"
            );
          }

          if (
            runIdRef.current
            === runId
          ) {
            setState(
              "hidden"
            );
          }

        } catch (error) {
          if (
            runIdRef.current
            !== runId
          ) {
            return;
          }

          console.error(
            "Backend availability check failed:",
            error
          );

          setState(
            "error"
          );

        } finally {
          window.clearTimeout(
            slowTimer
          );

          window.clearTimeout(
            extendedTimer
          );

          window.clearTimeout(
            timeoutTimer
          );
        }
      },
      []
    );


  useEffect(() => {
    void runCheck();

    return () => {
      runIdRef.current += 1;
    };
  }, [runCheck]);


  if (
    state === "hidden"
  ) {
    return null;
  }


  const copy = {
    en: {
      eyebrow:
        "SERVICE CONNECTION",

      starting:
        "The service is starting up. The first connection may take a little longer.",

      extended:
        "Still preparing the service. The first startup may take around a minute.",

      error:
        "The service could not be reached. Check your connection and try again.",

      retry:
        "Retry",
    },

    ro: {
      eyebrow:
        "CONECTARE SERVICIU",

      starting:
        "Serverul se inițializează. Prima conexiune poate dura puțin mai mult.",

      extended:
        "Încă pregătim serviciul. Prima pornire poate dura aproximativ un minut.",

      error:
        "Serviciul nu a putut fi contactat. Verifică conexiunea și încearcă din nou.",

      retry:
        "Reîncearcă",
    },
  }[language];


  const message =
    state === "starting"
      ? copy.starting
      : state === "extended"
        ? copy.extended
        : copy.error;


  const isError =
    state === "error";


  return (
    <div
      className="
        pointer-events-none
        fixed
        inset-x-4
        bottom-4
        z-[100]
        flex
        justify-center
        sm:inset-x-auto
        sm:right-5
        sm:bottom-5
      "
      role={
        isError
          ? "alert"
          : "status"
      }
      aria-live="polite"
    >
      <div
        className="
          pointer-events-auto
          w-full
          max-w-[430px]
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.08]
          bg-[#080D18]/95
          p-4
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
          backdrop-blur-xl
          sm:p-5
        "
      >
        <div
          className="
            flex
            items-start
            gap-3.5
          "
        >
          <div
            className={`
              mt-0.5
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              ${
                isError
                  ? "border-red-400/20 bg-red-400/[0.08]"
                  : "border-blue-400/20 bg-blue-500/[0.08]"
              }
            `}
          >
            {isError ? (
              <svg
                viewBox="0 0 24 24"
                className="
                  h-5
                  w-5
                  text-red-300
                "
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  d="M12 9v4"
                  strokeLinecap="round"
                />
                <path
                  d="M12 17h.01"
                  strokeLinecap="round"
                />
                <path
                  d="M10.3 3.8 2.4 17.5A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.5L13.7 3.8a2 2 0 0 0-3.4 0Z"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <div
                className="
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-blue-200/20
                  border-t-cyan-300
                "
                aria-hidden="true"
              />
            )}
          </div>


          <div
            className="
              min-w-0
              flex-1
            "
          >
            <p
              className={`
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                ${
                  isError
                    ? "text-red-300"
                    : "text-cyan-300"
                }
              `}
            >
              {copy.eyebrow}
            </p>

            <p
              className="
                mt-1.5
                text-[14px]
                leading-6
                text-zinc-300
              "
            >
              {message}
            </p>


            {isError && (
              <button
                type="button"
                onClick={() => {
                  void runCheck();
                }}
                className="
                  mt-3
                  inline-flex
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/[0.10]
                  bg-white/[0.05]
                  px-3.5
                  py-2
                  text-[13px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-white/[0.08]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-400/50
                "
              >
                {copy.retry}
              </button>
            )}
          </div>
        </div>


        {!isError && (
          <div
            className="
              mt-4
              h-px
              w-full
              overflow-hidden
              bg-white/[0.05]
            "
          >
            <div
              className="
                h-full
                w-1/3
                animate-pulse
                bg-gradient-to-r
                from-transparent
                via-cyan-300/70
                to-transparent
              "
            />
          </div>
        )}
      </div>
    </div>
  );
}
