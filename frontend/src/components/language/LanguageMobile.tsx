"use client";

import {
  motion,
} from "motion/react";


type Language =
  | "ro"
  | "en";


type LanguageMobileProps = {
  selectedLanguage:
    Language | null;

  onSelectLanguage:
    (
      language: Language
    ) => void;
};


function RomaniaFlag() {
  return (
    <svg
      viewBox="0 0 60 60"
      aria-hidden="true"
      className="
        h-full
        w-full
        overflow-hidden
        rounded-full
      "
    >
      <defs>
        <clipPath
          id="ro-flag-circle-mobile"
        >
          <circle
            cx="30"
            cy="30"
            r="30"
          />
        </clipPath>
      </defs>

      <g
        clipPath="
          url(#ro-flag-circle-mobile)
        "
      >
        <rect
          x="0"
          y="0"
          width="20"
          height="60"
          fill="#002B7F"
        />

        <rect
          x="20"
          y="0"
          width="20"
          height="60"
          fill="#FCD116"
        />

        <rect
          x="40"
          y="0"
          width="20"
          height="60"
          fill="#CE1126"
        />
      </g>
    </svg>
  );
}


function UnitedKingdomFlag() {
  return (
    <svg
      viewBox="0 0 60 60"
      aria-hidden="true"
      className="
        h-full
        w-full
        overflow-hidden
        rounded-full
      "
    >
      <defs>
        <clipPath
          id="uk-flag-circle-mobile"
        >
          <circle
            cx="30"
            cy="30"
            r="30"
          />
        </clipPath>
      </defs>

      <g
        clipPath="
          url(#uk-flag-circle-mobile)
        "
      >
        <rect
          width="60"
          height="60"
          fill="#012169"
        />

        <path
          d="M0 0 60 60M60 0 0 60"
          stroke="#FFFFFF"
          strokeWidth="14"
        />

        <path
          d="M0 0 60 60M60 0 0 60"
          stroke="#C8102E"
          strokeWidth="6"
        />

        <path
          d="M30 0v60M0 30h60"
          stroke="#FFFFFF"
          strokeWidth="18"
        />

        <path
          d="M30 0v60M0 30h60"
          stroke="#C8102E"
          strokeWidth="10"
        />
      </g>
    </svg>
  );
}


function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="
        h-5
        w-5
      "
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


function MobileBrand() {
  return (
    <div
      className="
        flex
        items-center
        justify-center
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
          shadow-[0_0_25px_rgba(59,130,246,0.22)]
        "
      >
        <div
          className="
            absolute
            inset-[5px]
            rounded-full
            border
            border-cyan-300/20
          "
        />

        <span
          className="
            relative
            z-10
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
            tracking-[-0.035em]
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
            tracking-[0.22em]
            text-blue-100/40
          "
        >
          Intelligent automotive diagnostics
        </p>
      </div>
    </div>
  );
}


function MobileLanguageButton({
  language,
  title,
  subtitle,
  code,
  selected,
  onClick,
}: {
  language: Language;
  title: string;
  subtitle: string;
  code: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={
        onClick
      }
      whileTap={{
        scale: 0.985,
      }}
      className={`
        relative
        flex
        min-h-[82px]
        w-full
        items-center
        gap-4
        overflow-hidden
        rounded-[22px]
        border
        px-4
        py-3
        text-left
        outline-none
        transition
        duration-300

        ${
          selected
            ? "border-cyan-300/55 bg-blue-500/[0.13] shadow-[0_0_35px_rgba(34,211,238,0.16)]"
            : "border-white/[0.075] bg-[#07101c]/88 shadow-[0_16px_40px_rgba(0,0,0,0.24)]"
        }
      `}
    >
      {selected && (
        <motion.div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[linear-gradient(90deg,rgba(34,211,238,0.07),transparent_60%)]
          "
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        />
      )}

      <div
        className="
          relative
          z-10
          h-12
          w-12
          shrink-0
          overflow-hidden
          rounded-full
          border
          border-white/10
          bg-black/30
          shadow-[0_8px_24px_rgba(0,0,0,0.30)]
        "
      >
        {language === "ro" ? (
          <RomaniaFlag />
        ) : (
          <UnitedKingdomFlag />
        )}
      </div>

      <div
        className="
          relative
          z-10
          min-w-0
          flex-1
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <p
            className="
              text-[15px]
              font-semibold
              text-white
            "
          >
            {title}
          </p>

          <span
            className="
              rounded-full
              border
              border-blue-300/10
              bg-blue-400/[0.05]
              px-2
              py-0.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-blue-100/50
            "
          >
            {code}
          </span>
        </div>

        <p
          className="
            mt-1
            text-[11px]
            leading-4
            text-zinc-500
          "
        >
          {subtitle}
        </p>
      </div>

      <div
        className={`
          relative
          z-10
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          transition

          ${
            selected
              ? "border-cyan-300/30 bg-cyan-300/[0.08] text-cyan-200"
              : "border-white/[0.08] bg-white/[0.025] text-zinc-500"
          }
        `}
      >
        <ArrowIcon />
      </div>
    </motion.button>
  );
}


export default function LanguageMobile({
  selectedLanguage,
  onSelectLanguage,
}: LanguageMobileProps) {
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
      {/* Mobile-specific background */}
      <div
        className="
          absolute
          inset-0
          bg-[url('/ui/language-screen-bg.png')]
          bg-cover
          bg-[72%_center]
          bg-no-repeat
        "
      />

      {/* Darken background specifically for mobile */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(to_bottom,rgba(2,6,13,0.72)_0%,rgba(2,6,13,0.82)_28%,rgba(2,6,13,0.95)_63%,rgba(2,6,13,1)_100%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_70%_18%,rgba(59,130,246,0.10),transparent_42%)]
        "
      />

      <motion.div
        className="
          pointer-events-none
          absolute
          left-[-80px]
          top-[18%]
          h-[320px]
          w-[320px]
          rounded-full
          bg-blue-500/[0.05]
          blur-[85px]
        "
        animate={{
          opacity: [
            0.35,
            0.65,
            0.35,
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
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
        {/* Header */}
        <div
          className="
            flex
            justify-center
            pt-1
          "
        >
          <MobileBrand />
        </div>


        {/* Main content */}
        <div
          className="
            flex
            flex-1
            items-center
            py-6
          "
        >
          <div
            className="
              relative
              w-full
              overflow-hidden
              rounded-[30px]
              border
              border-white/[0.07]
              bg-[#040914]/88
              p-5
              shadow-[0_28px_80px_rgba(0,0,0,0.40)]
              backdrop-blur-xl
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-44
                w-44
                rounded-full
                bg-blue-500/[0.08]
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
                  mx-auto
                  mb-4
                  h-px
                  w-14
                  bg-gradient-to-r
                  from-transparent
                  via-cyan-300/50
                  to-transparent
                "
              />

              <div
                className="
                  text-center
                "
              >
                <p
                  className="
                    text-[26px]
                    font-semibold
                    tracking-[-0.045em]
                    text-white
                  "
                >
                  Choose your language
                </p>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-[280px]
                    text-[12px]
                    leading-5
                    text-zinc-400
                  "
                >
                  Select your preferred language to
                  start AutoDiagnose AI
                </p>
              </div>

              <div
                className="
                  mt-6
                  space-y-3
                "
              >
                <MobileLanguageButton
                  language="ro"
                  title="Română"
                  subtitle="Continuă aplicația în limba română"
                  code="RO"
                  selected={
                    selectedLanguage ===
                    "ro"
                  }
                  onClick={() =>
                    onSelectLanguage(
                      "ro"
                    )
                  }
                />

                <MobileLanguageButton
                  language="en"
                  title="English"
                  subtitle="Continue using the app in English"
                  code="EN"
                  selected={
                    selectedLanguage ===
                    "en"
                  }
                  onClick={() =>
                    onSelectLanguage(
                      "en"
                    )
                  }
                />
              </div>

              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <span
                  className="
                    h-1
                    w-1
                    rounded-full
                    bg-cyan-300/45
                  "
                />

                <p
                  className="
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.20em]
                    text-blue-100/35
                  "
                >
                  AI-assisted automotive diagnostics
                </p>

                <span
                  className="
                    h-1
                    w-1
                    rounded-full
                    bg-cyan-300/45
                  "
                />
              </div>
            </div>
          </div>
        </div>


        {/* Bottom decorative status */}
        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            pb-1
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-400/70
              shadow-[0_0_8px_rgba(52,211,153,0.45)]
            "
          />

          <span
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-zinc-600
            "
          >
            System ready
          </span>
        </div>
      </motion.div>
    </main>
  );
}