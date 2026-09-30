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
        strokeWidth="1.7"
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
        strokeWidth="1.6"
      />

      <path
        d="M5.5 19c.8-3 3.1-4.7 6.5-4.7s5.7 1.7 6.5 4.7"
        stroke="currentColor"
        strokeWidth="1.6"
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
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export default function WelcomeDesktop({
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
        h-dvh
        w-full
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
          bg-center
          bg-no-repeat
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(to_bottom,rgba(0,0,0,0.05),transparent_20%,transparent_78%,rgba(0,0,0,0.16))]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[14.2%]
          top-[1.6%]
          aspect-square
          h-[83vh]
          max-h-[760px]
          min-h-[560px]
          rounded-full
        "
      >
        <motion.div
          className="
            absolute
            inset-[1.2%]
            rounded-full
            border
            border-cyan-300/[0.08]
          "
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 42,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span
            className="
              absolute
              left-1/2
              top-[-2px]
              h-1
              w-16
              -translate-x-1/2
              rounded-full
              bg-cyan-300/50
              shadow-[0_0_12px_rgba(34,211,238,0.55)]
            "
          />

          <span
            className="
              absolute
              bottom-[11%]
              right-[7%]
              h-2
              w-2
              rounded-full
              bg-blue-300
              shadow-[0_0_14px_rgba(96,165,250,0.75)]
            "
          />
        </motion.div>

        <motion.div
          className="
            absolute
            inset-[4.5%]
            rounded-full
            border
            border-blue-400/[0.055]
          "
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 58,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span
            className="
              absolute
              left-[11%]
              top-[18%]
              h-px
              w-10
              bg-cyan-200/45
            "
          />

          <span
            className="
              absolute
              bottom-[19%]
              right-[4%]
              h-px
              w-14
              bg-blue-300/35
            "
          />
        </motion.div>
      </div>

      <motion.section
        initial={{
          opacity: 0,
          y: 8,
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
          absolute
          left-[34.7%]
          top-[52.5%]
          z-20
          flex
          w-[31%]
          max-w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          flex-col
          items-center
          text-center
        "
      >
        <h1
          className="
            max-w-[500px]
            text-[clamp(32px,2.65vw,48px)]
            font-semibold
            leading-[1.02]
            tracking-[-0.05em]
            text-white
            drop-shadow-[0_10px_28px_rgba(0,0,0,0.45)]
          "
        >
          {text.title}
        </h1>

        <p
          className="
            mt-3
            max-w-[470px]
            text-[clamp(11px,0.85vw,14px)]
            leading-5
            text-zinc-300/80
          "
        >
          {text.description}
        </p>

        <div
          className="
            mt-6
            flex
            w-full
            max-w-[450px]
            items-center
            justify-center
            gap-3
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
              min-w-0
              flex-1
              items-center
              justify-center
              gap-2
              rounded-[14px]
              bg-gradient-to-r
              from-blue-500
              to-cyan-400
              px-4
              py-3
              text-[12px]
              font-semibold
              text-white
              shadow-[0_0_28px_rgba(56,189,248,0.22)]
              transition
              hover:brightness-110
              disabled:cursor-not-allowed
              disabled:opacity-55
            "
          >
            <PulseIcon />

            <span>
              {guestLoading
                ? text.guestLoading
                : text.start}
            </span>

            {!guestLoading && (
              <span
                className="
                  transition-transform
                  group-hover:translate-x-0.5
                "
              >
                <ArrowIcon />
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={
              onSignIn
            }
            className="
              group
              flex
              min-w-0
              flex-1
              items-center
              justify-center
              gap-2
              rounded-[14px]
              border
              border-cyan-300/25
              bg-[#06101a]/64
              px-4
              py-3
              text-[12px]
              font-semibold
              text-zinc-100
              backdrop-blur-md
              transition
              hover:border-cyan-200/45
              hover:bg-blue-500/[0.07]
            "
          >
            <UserIcon />

            <span>
              {text.signIn}
            </span>
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
            group
            mt-4
            inline-flex
            items-center
            gap-2
            text-[12px]
            font-semibold
            text-cyan-300/80
            transition
            hover:text-cyan-100
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <span>
            {text.guest}
          </span>

          <span
            className="
              transition-transform
              group-hover:translate-x-1
            "
          >
            <ArrowIcon />
          </span>
        </button>

        {error && (
          <p
            className="
              mt-3
              max-w-[430px]
              text-[10px]
              leading-4
              text-red-300
            "
          >
            {error}
          </p>
        )}
      </motion.section>
    </main>
  );
}