"use client";

import { motion } from "motion/react";

import {
  DiagnosticCaseRecord,
} from "@/lib/api";


type Language = "ro" | "en";


type DiagnosticInsightsProps = {
  language: Language;
  cases: DiagnosticCaseRecord[];
};


export default function DiagnosticInsights({
  language,
  cases,
}: DiagnosticInsightsProps) {
  const content = {
    en: {
      eyebrow: "Diagnostic insights",
      title: "Activity snapshot",
      completion: "Completion rate",
      activity: "Last 7 days",
      completed: "Completed",
      active: "In progress",
      empty: "Insights will appear after your first diagnosis.",
      cases: "cases",
    },

    ro: {
      eyebrow: "Informații diagnostic",
      title: "Activitate recentă",
      completion: "Rată de finalizare",
      activity: "Ultimele 7 zile",
      completed: "Finalizate",
      active: "În desfășurare",
      empty: "Informațiile vor apărea după primul diagnostic.",
      cases: "cazuri",
    },
  };


  const text =
    content[language];


  const total =
    cases.length;


  const completed =
    cases.filter(
      (item) =>
        item.status === "completed"
    ).length;


  const active =
    total - completed;


  const completionRate =
    total > 0
      ? Math.round(
          (completed / total) * 100
        )
      : 0;


  const today =
    new Date();


  const days =
    Array.from(
      { length: 7 },
      (_, index) => {
        const date =
          new Date(today);

        date.setHours(
          0,
          0,
          0,
          0
        );

        date.setDate(
          date.getDate() -
            (6 - index)
        );

        return date;
      }
    );


  const activity =
    days.map((day) => {
      const count =
        cases.filter(
          (diagnosticCase) => {
            if (
              !diagnosticCase.created_at
            ) {
              return false;
            }


            const createdAt =
              new Date(
                diagnosticCase.created_at
              );


            if (
              Number.isNaN(
                createdAt.getTime()
              )
            ) {
              return false;
            }


            return (
              createdAt.getFullYear() ===
                day.getFullYear() &&
              createdAt.getMonth() ===
                day.getMonth() &&
              createdAt.getDate() ===
                day.getDate()
            );
          }
        ).length;


      return {
        date: day,
        count,
      };
    });


  const maxActivity =
    Math.max(
      1,
      ...activity.map(
        (item) => item.count
      )
    );


  function formatDay(
    date: Date
  ) {
    return new Intl.DateTimeFormat(
      language === "ro"
        ? "ro-RO"
        : "en-US",
      {
        weekday: "narrow",
      }
    ).format(date);
  }


  return (
    <aside
      className="
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.055]
        bg-white/[0.018]
        p-5
        sm:p-6
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-24
          h-48
          w-48
          rounded-full
          bg-blue-500/[0.08]
          blur-[70px]
        "
      />


      <div className="relative">
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-blue-400/60
          "
        >
          {text.eyebrow}
        </p>


        <div
          className="
            mt-2
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <h3
            className="
              text-lg
              font-semibold
              tracking-[-0.025em]
              text-white
            "
          >
            {text.title}
          </h3>


          {total > 0 && (
            <span
              className="
                rounded-full
                border
                border-white/[0.06]
                bg-white/[0.025]
                px-2.5
                py-1
                text-[10px]
                font-medium
                text-zinc-500
              "
            >
              {total} {text.cases}
            </span>
          )}
        </div>


        {total === 0 ? (
          <div
            className="
              mt-8
              rounded-2xl
              border
              border-dashed
              border-white/[0.07]
              bg-white/[0.012]
              px-5
              py-10
              text-center
            "
          >
            <div
              className="
                mx-auto
                h-10
                w-10
                rounded-full
                border
                border-blue-400/10
                bg-blue-500/[0.04]
              "
            />

            <p
              className="
                mx-auto
                mt-4
                max-w-[220px]
                text-xs
                leading-5
                text-zinc-600
              "
            >
              {text.empty}
            </p>
          </div>
        ) : (
          <>
            <div
              className="
                mt-7
                grid
                grid-cols-[112px_1fr]
                items-center
                gap-5
              "
            >
              <div
                className="
                  relative
                  h-28
                  w-28
                  rounded-full
                  p-[7px]
                "
                style={{
                  background: `conic-gradient(#3b82f6 0 ${completionRate}%, rgba(255,255,255,0.055) ${completionRate}% 100%)`,
                }}
              >
                <div
                  className="
                    flex
                    h-full
                    w-full
                    flex-col
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.05]
                    bg-[#080d17]
                  "
                >
                  <span
                    className="
                      text-2xl
                      font-semibold
                      tracking-[-0.04em]
                      text-white
                    "
                  >
                    {completionRate}%
                  </span>

                  <span
                    className="
                      mt-1
                      text-[9px]
                      uppercase
                      tracking-[0.14em]
                      text-zinc-600
                    "
                  >
                    {text.completion}
                  </span>
                </div>
              </div>


              <div className="space-y-3">
                <div
                  className="
                    rounded-xl
                    border
                    border-white/[0.05]
                    bg-white/[0.018]
                    px-3.5
                    py-3
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
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
                        "
                      />

                      <span
                        className="
                          text-xs
                          text-zinc-500
                        "
                      >
                        {text.completed}
                      </span>
                    </div>

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-zinc-200
                      "
                    >
                      {completed}
                    </span>
                  </div>
                </div>


                <div
                  className="
                    rounded-xl
                    border
                    border-white/[0.05]
                    bg-white/[0.018]
                    px-3.5
                    py-3
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
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
                          bg-amber-400
                        "
                      />

                      <span
                        className="
                          text-xs
                          text-zinc-500
                        "
                      >
                        {text.active}
                      </span>
                    </div>

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-zinc-200
                      "
                    >
                      {active}
                    </span>
                  </div>
                </div>
              </div>
            </div>


            <div
              className="
                mt-7
                border-t
                border-white/[0.05]
                pt-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-zinc-600
                  "
                >
                  {text.activity}
                </p>

                <span
                  className="
                    text-[10px]
                    text-zinc-700
                  "
                >
                  {activity.reduce(
                    (sum, item) =>
                      sum + item.count,
                    0
                  )} {text.cases}
                </span>
              </div>


              <div
                className="
                  mt-4
                  flex
                  h-24
                  items-end
                  gap-2
                "
              >
                {activity.map(
                  (item, index) => {
                    const height =
                      item.count === 0
                        ? 8
                        : Math.max(
                            18,
                            (item.count /
                              maxActivity) *
                              76
                          );


                    return (
                      <div
                        key={
                          item.date.toISOString()
                        }
                        className="
                          flex
                          min-w-0
                          flex-1
                          flex-col
                          items-center
                          justify-end
                          gap-2
                        "
                      >
                        <div
                          className="
                            flex
                            h-[76px]
                            w-full
                            items-end
                            justify-center
                          "
                        >
                          <motion.div
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity:
                                item.count > 0
                                  ? 1
                                  : 0.28,
                            }}
                            transition={{
                              duration: 0.25,
                              delay:
                                index * 0.025,
                            }}
                            className="
                              w-full
                              max-w-5
                              rounded-full
                              bg-gradient-to-t
                              from-blue-500/40
                              to-cyan-300/80
                            "
                            style={{
                              height,
                            }}
                          />
                        </div>

                        <span
                          className="
                            text-[9px]
                            uppercase
                            text-zinc-700
                          "
                        >
                          {formatDay(
                            item.date
                          )}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}