"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  motion,
} from "motion/react";


type Language =
  | "ro"
  | "en";


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
          id="ro-flag-circle"
        >
          <circle
            cx="30"
            cy="30"
            r="30"
          />
        </clipPath>
      </defs>

      <g
        clipPath="url(#ro-flag-circle)"
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
          id="uk-flag-circle"
        >
          <circle
            cx="30"
            cy="30"
            r="30"
          />
        </clipPath>
      </defs>

      <g
        clipPath="url(#uk-flag-circle)"
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
        strokeWidth="1.7"
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
        flex-col
        items-center
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            relative
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-blue-400/35
            bg-blue-500/[0.08]
            shadow-[0_0_28px_rgba(59,130,246,0.20)]
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
              text-[17px]
              font-black
              tracking-[-0.08em]
              text-blue-300
            "
          >
            A
          </span>
        </div>

        <div
          className="
            text-left
          "
        >
          <p
            className="
              text-[18px]
              font-semibold
              tracking-[-0.03em]
              text-white
              sm:text-[20px]
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
              mt-1
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.27em]
              text-blue-100/45
              sm:text-[8px]
            "
          >
            Intelligent automotive diagnostics
          </p>
        </div>
      </div>
    </div>
  );
}


function LanguageButton({
  language,
  title,
  code,
  selected,
  onClick,
}: {
  language: Language;
  title: string;
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
      whileHover={{
        y: -4,
        scale: 1.018,
      }}
      whileTap={{
        scale: 0.975,
      }}
      className={`
        group
        relative
        flex
        h-[138px]
        w-[138px]
        shrink-0
        flex-col
        items-center
        justify-center
        rounded-full
        border
        outline-none
        transition-colors
        duration-300
        sm:h-[155px]
        sm:w-[155px]
        ${
          selected
            ? "border-cyan-200/75 bg-blue-500/[0.13] shadow-[0_0_45px_rgba(34,211,238,0.25),inset_0_0_30px_rgba(59,130,246,0.08)]"
            : "border-cyan-300/32 bg-[#07111f]/72 shadow-[0_0_30px_rgba(14,165,233,0.10),inset_0_0_26px_rgba(59,130,246,0.035)] hover:border-cyan-200/65 hover:bg-blue-500/[0.09] hover:shadow-[0_0_42px_rgba(34,211,238,0.20),inset_0_0_30px_rgba(59,130,246,0.06)]"
        }
      `}
    >
      <motion.span
        className="
          pointer-events-none
          absolute
          inset-[-7px]
          rounded-full
          border
          border-blue-400/10
        "
        animate={{
          opacity:
            selected
              ? [0.25, 0.75, 0.25]
              : [0.14, 0.34, 0.14],
          scale:
            selected
              ? [0.98, 1.055, 0.98]
              : [1, 1.025, 1],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        className="
          relative
          h-12
          w-12
          overflow-hidden
          rounded-full
          border
          border-white/10
          bg-black/25
          shadow-[0_10px_28px_rgba(0,0,0,0.35)]
          sm:h-14
          sm:w-14
        "
      >
        {language ===
        "ro" ? (
          <RomaniaFlag />
        ) : (
          <UnitedKingdomFlag />
        )}
      </div>

      <span
        className="
          mt-3
          text-[14px]
          font-semibold
          text-white
          sm:text-[15px]
        "
      >
        {title}
      </span>

      <span
        className="
          mt-1
          rounded-full
          border
          border-blue-300/10
          bg-blue-400/[0.04]
          px-2
          py-0.5
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.14em]
          text-blue-100/55
        "
      >
        {code}
      </span>

      <span
        className="
          absolute
          bottom-3.5
          right-5
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          border
          border-blue-300/10
          bg-blue-500/[0.08]
          text-cyan-200/80
          transition
          duration-300
          group-hover:translate-x-1
          group-hover:border-cyan-200/25
          group-hover:text-cyan-100
        "
      >
        <ArrowIcon />
      </span>
    </motion.button>
  );
}


export default function Home() {
  const router =
    useRouter();

  const [
    selectedLanguage,
    setSelectedLanguage,
  ] =
    useState<Language | null>(
      null
    );


  function selectLanguage(
    language: Language
  ) {
    if (
      selectedLanguage
    ) {
      return;
    }

    setSelectedLanguage(
      language
    );

    localStorage.setItem(
      "language",
      language
    );

    window.setTimeout(
      () => {
        router.push(
          "/welcome"
        );
      },
      360
    );
  }


  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#02060d]
        text-white
      "
    >
      {/* BACKGROUND IMAGE:
          Place your chosen image at:
          frontend/public/ui/language-screen-bg.png
      */}
      <div
        className="
          absolute
          inset-0
          bg-[url('/ui/language-screen-bg.png')]
          bg-cover
          bg-[68%_center]
          bg-no-repeat
          lg:bg-center
        "
      />

      {/* Hide the baked UI on the left side of the reference image
          and preserve the automotive scene on the right. */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(90deg,rgba(2,6,13,0.985)_0%,rgba(2,6,13,0.965)_25%,rgba(2,6,13,0.88)_43%,rgba(2,6,13,0.40)_58%,rgba(2,6,13,0.07)_77%,rgba(2,6,13,0.10)_100%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_29%_50%,rgba(3,8,17,0.18)_0%,rgba(3,8,17,0.82)_34%,transparent_57%)]
        "
      />

      {/* blue atmosphere */}
      <motion.div
        className="
          pointer-events-none
          absolute
          -left-28
          top-[9%]
          h-[620px]
          w-[620px]
          rounded-full
          bg-blue-500/[0.055]
          blur-[120px]
        "
        animate={{
          opacity: [
            0.45,
            0.75,
            0.45,
          ],
          scale: [
            0.96,
            1.04,
            0.96,
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* subtle moving scan on car side */}
      <motion.div
        className="
          pointer-events-none
          absolute
          bottom-[8%]
          right-[3%]
          top-[6%]
          hidden
          w-px
          bg-gradient-to-b
          from-transparent
          via-cyan-300/35
          to-transparent
          shadow-[0_0_22px_rgba(34,211,238,0.30)]
          lg:block
        "
        animate={{
          x: [
            -320,
            140,
            -320,
          ],
          opacity: [
            0,
            0.9,
            0,
          ],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.section
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          px-5
          py-8
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >
        <div
          className="
            relative
            flex
            w-full
            max-w-[690px]
            items-center
            justify-center
            lg:max-w-[760px]
          "
        >
          {/* OUTER HOLOGRAPHIC RINGS */}

          <motion.div
            className="
              pointer-events-none
              absolute
              h-[530px]
              w-[530px]
              rounded-full
              border
              border-cyan-300/18
              shadow-[0_0_48px_rgba(34,211,238,0.08),inset_0_0_55px_rgba(59,130,246,0.04)]
              sm:h-[610px]
              sm:w-[610px]
              lg:h-[650px]
              lg:w-[650px]
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
                h-1.5
                w-16
                -translate-x-1/2
                rounded-full
                bg-cyan-300/50
                blur-[1px]
              "
            />

            <span
              className="
                absolute
                bottom-[14%]
                right-[1.5%]
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
              pointer-events-none
              absolute
              h-[485px]
              w-[485px]
              rounded-full
              border
              border-blue-400/10
              sm:h-[558px]
              sm:w-[558px]
              lg:h-[596px]
              lg:w-[596px]
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
                left-[7%]
                top-[19%]
                h-px
                w-12
                bg-blue-300/40
              "
            />

            <span
              className="
                bottom-[18%]
                absolute
                right-[8%]
                h-px
                w-10
                bg-cyan-300/30
              "
            />
          </motion.div>

          {/* MAIN GLASS CIRCLE */}

          <div
            className="
              relative
              flex
              min-h-[500px]
              w-full
              max-w-[560px]
              flex-col
              items-center
              justify-center
              rounded-[42px]
              border
              border-white/[0.035]
              bg-[#030812]/58
              px-5
              py-8
              text-center
              shadow-[0_30px_100px_rgba(0,0,0,0.30)]
              backdrop-blur-[3px]
              sm:min-h-[560px]
              sm:rounded-full
              sm:px-9
              lg:max-w-[600px]
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                inset-7
                hidden
                rounded-full
                border
                border-blue-400/[0.055]
                sm:block
              "
            />

            <BrandMark />

            <div
              className="
                mt-7
                sm:mt-9
              "
            >
              <p
                className="
                  text-[26px]
                  font-semibold
                  tracking-[-0.04em]
                  text-white
                  sm:text-[32px]
                "
              >
                Choose your language
              </p>

              <p
                className="
                  mt-2
                  text-[12px]
                  leading-5
                  text-zinc-400
                  sm:text-[13px]
                "
              >
                Select your preferred language to start
                AutoDiagnose AI
              </p>
            </div>

            <div
              className="
                mt-7
                flex
                items-center
                justify-center
                gap-4
                sm:mt-9
                sm:gap-6
              "
            >
              <LanguageButton
                language="ro"
                title="Română"
                code="RO"
                selected={
                  selectedLanguage ===
                  "ro"
                }
                onClick={() =>
                  selectLanguage(
                    "ro"
                  )
                }
              />

              <LanguageButton
                language="en"
                title="English"
                code="EN"
                selected={
                  selectedLanguage ===
                  "en"
                }
                onClick={() =>
                  selectLanguage(
                    "en"
                  )
                }
              />
            </div>

            <motion.p
              className="
                mt-7
                text-[9px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-blue-100/30
              "
              animate={{
                opacity: [
                  0.25,
                  0.55,
                  0.25,
                ],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              AI-assisted automotive
              diagnostics
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* right-side cinematic vignette */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),transparent_20%,transparent_76%,rgba(0,0,0,0.42))]
        "
      />
    </main>
  );
}