type StatCardProps = {
  label: string;
  value: string | number;
  description?: string;
  accent?: "blue" | "green" | "amber";
};

export default function StatCard({
  label,
  value,
  description,
  accent = "blue",
}: StatCardProps) {
  const accentStyles = {
    blue: {
      dot: "bg-blue-400",
      glow: "bg-blue-500/[0.10]",
      value: "text-white",
    },

    green: {
      dot: "bg-emerald-400",
      glow: "bg-emerald-400/[0.07]",
      value: "text-white",
    },

    amber: {
      dot: "bg-amber-400",
      glow: "bg-amber-400/[0.07]",
      value: "text-white",
    },
  };

  const style =
    accentStyles[accent];

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.055]
        bg-white/[0.018]
        px-5
        py-5
        transition-colors
        duration-200
        hover:border-white/[0.09]
        hover:bg-white/[0.026]
      "
    >
      <div
        className={`
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-28
          w-28
          rounded-full
          blur-[45px]
          ${style.glow}
        `}
      />

      <div className="relative">

        <div className="flex items-center gap-2">

          <span
            className={`
              h-1.5
              w-1.5
              rounded-full
              ${style.dot}
            `}
          />

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-zinc-600
            "
          >
            {label}
          </p>

        </div>

        <p
          className={`
            mt-5
            text-[2rem]
            font-semibold
            tracking-[-0.045em]
            ${style.value}
          `}
        >
          {value}
        </p>

        {description && (
          <p
            className="
              mt-1
              text-xs
              leading-5
              text-zinc-600
            "
          >
            {description}
          </p>
        )}

      </div>
    </div>
  );
}