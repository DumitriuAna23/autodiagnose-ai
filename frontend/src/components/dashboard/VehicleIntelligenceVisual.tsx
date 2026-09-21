"use client";

import { motion } from "motion/react";

type Language = "ro" | "en";

type VehicleIntelligenceVisualProps = {
  language: Language;
};

export default function VehicleIntelligenceVisual({
  language,
}: VehicleIntelligenceVisualProps) {
  const text = {
    en: {
      system: "Diagnostic system",
      ready: "Ready for analysis",
      online: "Online",
      engine: "Engine",
      sensors: "Sensors",
      ai: "AI core",
      active: "Ready",
      scanning: "Vehicle intelligence",
    },

    ro: {
      system: "Sistem diagnostic",
      ready: "Pregătit pentru analiză",
      online: "Online",
      engine: "Motor",
      sensors: "Senzori",
      ai: "Nucleu AI",
      active: "Pregătit",
      scanning: "Inteligență vehicul",
    },
  }[language];

  return (
    <div
      className="
        relative
        min-h-[360px]
        overflow-hidden
        rounded-[28px]
        border
        border-white/[0.06]
        bg-[#070c15]
      "
    >
      {/* AMBIENT LIGHT */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[45%]
          h-[300px]
          w-[300px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-blue-500/[0.10]
          blur-[90px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-100px]
          top-[-100px]
          h-[240px]
          w-[240px]
          rounded-full
          bg-cyan-400/[0.04]
          blur-[80px]
        "
      />

      {/* TOP */}

      <div
        className="
          relative
          z-10
          flex
          items-start
          justify-between
          px-6
          pt-6
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-zinc-600
            "
          >
            {text.system}
          </p>

          <p
            className="
              mt-2
              text-sm
              font-medium
              text-zinc-300
            "
          >
            {text.ready}
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-emerald-400/10
            bg-emerald-400/[0.04]
            px-3
            py-1.5
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-400
              shadow-[0_0_8px_rgba(52,211,153,0.45)]
            "
          />

          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-emerald-300/75
            "
          >
            {text.online}
          </span>
        </div>
      </div>

      {/* HOLOGRAPHIC AREA */}

      <div
        className="
          relative
          mx-auto
          mt-5
          flex
          h-[210px]
          max-w-[420px]
          items-center
          justify-center
        "
      >
        {/* OUTER RINGS */}

        <div
          className="
            absolute
            h-[190px]
            w-[190px]
            rounded-full
            border
            border-blue-400/[0.07]
          "
        />

        <div
          className="
            absolute
            h-[145px]
            w-[145px]
            rounded-full
            border
            border-cyan-300/[0.07]
          "
        />

        <div
          className="
            absolute
            h-[95px]
            w-[95px]
            rounded-full
            border
            border-blue-400/[0.10]
          "
        />

        {/* GRID */}

        <div
          className="
            absolute
            inset-x-10
            bottom-[22px]
            h-[70px]
            opacity-30
            [background-image:linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)]
            [background-size:18px_18px]
            [mask-image:linear-gradient(to_top,black,transparent)]
          "
        />

        {/* CENTER CORE */}

        <div
          className="
            relative
            z-10
            flex
            h-[92px]
            w-[150px]
            items-center
            justify-center
            rounded-[28px]
            border
            border-blue-400/[0.14]
            bg-blue-500/[0.035]
            shadow-[0_0_50px_rgba(59,130,246,0.08)]
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-blue-400/20
                bg-blue-500/[0.08]
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-blue-400
                  shadow-[0_0_12px_rgba(96,165,250,0.75)]
                "
              />
            </div>

            <p
              className="
                mt-3
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-blue-200/55
              "
            >
              {text.scanning}
            </p>
          </div>
        </div>

        {/* SCAN LINE */}

        <motion.div
          className="
            pointer-events-none
            absolute
            left-[18%]
            right-[18%]
            top-[36px]
            z-20
            h-px
            bg-gradient-to-r
            from-transparent
            via-cyan-300/45
            to-transparent
            shadow-[0_0_12px_rgba(34,211,238,0.30)]
          "
          animate={{
            y: [0, 135, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1.6,
          }}
        />

        {/* SIDE NODES */}

        <div
          className="
            absolute
            left-5
            top-[72px]
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
              bg-blue-400/70
            "
          />

          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.14em]
              text-zinc-600
            "
          >
            ECU
          </span>
        </div>

        <div
          className="
            absolute
            right-5
            top-[105px]
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.14em]
              text-zinc-600
            "
          >
            DTC
          </span>

          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-cyan-300/70
            "
          />
        </div>
      </div>

      {/* SYSTEM STATUS */}

      <div
        className="
          relative
          z-10
          grid
          grid-cols-3
          gap-2
          px-6
          pb-6
        "
      >
        {[
          {
            label: text.engine,
            value: text.active,
          },
          {
            label: text.sensors,
            value: text.active,
          },
          {
            label: text.ai,
            value: text.active,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="
              rounded-xl
              border
              border-white/[0.05]
              bg-white/[0.018]
              px-3
              py-3
            "
          >
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-zinc-700
              "
            >
              {item.label}
            </p>

            <div
              className="
                mt-1.5
                flex
                items-center
                gap-1.5
              "
            >
              <span
                className="
                  h-1
                  w-1
                  rounded-full
                  bg-blue-400/70
                "
              />

              <p
                className="
                  text-[11px]
                  font-medium
                  text-zinc-400
                "
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}