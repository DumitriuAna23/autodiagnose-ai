"use client";

import {
  motion,
} from "motion/react";

import type {
  WelcomeText,
} from "./WelcomeScreen";


type Props = {
  text: WelcomeText;
  guestLoading: boolean;
  error: string | null;
  onStartDiagnosis: () => void;
  onSignIn: () => void;
  onContinueGuest: () => void;
};


function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M5 12h13M13 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <circle
        cx="12"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M5.5 19c.8-3 3.1-4.7 6.5-4.7s5.7 1.7 6.5 4.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function PulseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M3 12h4l2-5 4 10 2-5h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function BrandMark() {
  return (
    <div
      className="
        flex
        items-center
        gap-2.5
      "
    >
      <div
        className="
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-blue-400/35
          bg-blue-500/[0.09]
          shadow-[0_0_24px_rgba(59,130,246,0.22)]
        "
      >
        <span
          className="
            text-[16px]
            font-black
            tracking-[-0.08em]
            text-blue-300
          "
        >
          A
        </span>
      </div>

      <div>
        <p
          className="
            text-[18px]
            font-semibold
            tracking-[-0.04em]
            text-white
          "
        >
          AutoDiagnose{" "}
          <span
            className="
              text-blue-400
            "
          >
            AI
          </span>
        </p>

        <p
          className="
            mt-0.5
            text-[6px]
            font-semibold
            uppercase
            tracking-[0.21em]
            text-blue-100/40
          "
        >
          Intelligent automotive diagnostics
        </p>
      </div>
    </div>
  );
}


export default function WelcomeMobile({
  text,
  guestLoading,
  error,
  onStartDiagnosis,
  onSignIn,
  onContinueGuest,
}: Props) {
  return (
    <main
      className="
        relative
        min-h-[100dvh]
        overflow-hidden
        bg-[#02060d]
        text-white
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-[url('/ui/welcome-bg.png')]
          bg-cover
          bg-[78%_center]
          bg-no-repeat
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(to_bottom,rgba(2,6,13,0.58)_0%,rgba(2,6,13,0.72)_26%,rgba(2,6,13,0.91)_57%,rgba(2,6,13,0.99)_100%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_75%_24%,rgba(14,165,233,0.09),transparent_38%)]
        "
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.55,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[100dvh]
          w-full
          max-w-[460px]
          flex-col
          px-4
        "
        style={{
          paddingTop:
            "max(20px, env(safe-area-inset-top))",

          paddingBottom:
            "max(18px, env(safe-area-inset-bottom))",
        }}
      >
        <div
          className="
            flex
            justify-center
          "
        >
          <BrandMark />
        </div>

        <div
          className="
            flex
            flex-1
            items-end
            pb-5
            pt-8
          "
        >
          <div
            className="
              relative
              w-full
              overflow-hidden
              rounded-[30px]
              border
              border-white/[0.075]
              bg-[#040914]/90
              p-5
              shadow-[0_28px_80px_rgba(0,0,0,0.48)]
              backdrop-blur-xl
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-20
                h-44
                w-44
                rounded-full
                bg-cyan-400/[0.07]
                blur-[55px]
              "
            />

            <div
              className="
                relative
                z-10
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_9px_rgba(52,211,153,0.5)]
                  "
                />

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-blue-100/45
                  "
                >
                  Diagnostic system ready
                </p>
              </div>

              <h1
                className="
                  mt-4
                  max-w-[330px]
                  text-[31px]
                  font-semibold
                  leading-[1.04]
                  tracking-[-0.05em]
                  text-white
                "
              >
                {text.title}
              </h1>

              <p
                className="
                  mt-3
                  max-w-[330px]
                  text-[12px]
                  leading-5
                  text-zinc-400
                "
              >
                {text.description}
              </p>

              <div
                className="
                  mt-6
                  space-y-3
                "
              >
                <button
                  type="button"
                  onClick={
                    onStartDiagnosis
                  }
                  disabled={
                    guestLoading
                  }
                  className="
                    group
                    flex
                    min-h-[52px]
                    w-full
                    items-center
                    justify-between
                    rounded-[16px]
                    bg-gradient-to-r
                    from-blue-500
                    to-cyan-400
                    px-4
                    text-[13px]
                    font-semibold
                    text-white
                    shadow-[0_0_30px_rgba(56,189,248,0.20)]
                    transition
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-55
                  "
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-2.5
                    "
                  >
                    <PulseIcon />

                    {guestLoading
                      ? text.guestLoading
                      : text.start}
                  </span>

                  {!guestLoading && (
                    <ArrowIcon />
                  )}
                </button>

                <button
                  type="button"
                  onClick={
                    onSignIn
                  }
                  className="
                    flex
                    min-h-[52px]
                    w-full
                    items-center
                    justify-between
                    rounded-[16px]
                    border
                    border-cyan-300/18
                    bg-[#07111d]/80
                    px-4
                    text-[13px]
                    font-semibold
                    text-zinc-100
                    transition
                    active:scale-[0.99]
                  "
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-2.5
                    "
                  >
                    <UserIcon />

                    {text.signIn}
                  </span>

                  <ArrowIcon />
                </button>
              </div>

              <button
                type="button"
                onClick={
                  onContinueGuest
                }
                disabled={
                  guestLoading
                }
                className="
                  mt-5
                  flex
                  min-h-[44px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  text-[12px]
                  font-semibold
                  text-cyan-300/80
                  transition
                  active:bg-white/[0.03]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {text.guest}

                <ArrowIcon />
              </button>

              {error && (
                <p
                  className="
                    mt-3
                    rounded-xl
                    border
                    border-red-400/10
                    bg-red-400/[0.04]
                    px-3
                    py-2.5
                    text-[11px]
                    leading-4
                    text-red-300
                  "
                >
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}