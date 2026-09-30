"use client";

import Link from "next/link";

import {
  AnimatePresence,
  motion,
} from "motion/react";


type SessionType =
  | "user"
  | "guest";


type NavigationItem = {
  label: string;
  href: string;
  icon: string;
  newDiagnosis?: boolean;
};


type ShellText = {
  main: string;
  resources: string;
  accountSection: string;
  dashboard: string;
  diagnosis: string;
  history: string;
  guide: string;
  account: string;
  guestMode: string;
  accountActive: string;
  signIn: string;
  createAccount: string;
  signOut: string;
  signingOut: string;
  menu: string;
  platform: string;
  guestMessage: string;
};


type AppShellMobileProps = {
  menuOpen: boolean;

  setMenuOpen:
    (
      value: boolean
    ) => void;

  mainNavigation:
    NavigationItem[];

  resourceNavigation:
    NavigationItem[];

  sessionType:
    SessionType;

  userEmail:
    string | null;

  isLoggingOut:
    boolean;

  text:
    ShellText;

  isActive:
    (
      route: string
    ) => boolean;

  onNavigation:
    (
      newDiagnosis?: boolean
    ) => void;

  onLogout:
    () => void;
};


function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M4 10.5 12 4l8 6.5V20H5a1 1 0 0 1-1-1v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9 20v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function DiagnosisIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}


function HistoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M4.5 8.5A8 8 0 1 1 4 13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M4.5 4.5v4h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M12 8v4.5l3 1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M5 7h14M5 12h14M5 17h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function GuideIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M5 5.5A2.5 2.5 0 0 1 7.5 3H12v17H7.5A2.5 2.5 0 0 0 5 22V5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M19 5.5A2.5 2.5 0 0 0 16.5 3H12v17h4.5A2.5 2.5 0 0 1 19 22V5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M19 13.5v-3l-2-.6a6 6 0 0 0-.7-1.6l1-1.8-2.1-2.1-1.8 1A6 6 0 0 0 11.5 5L11 3H8l-.6 2a6 6 0 0 0-1.6.7l-1.8-1-2.1 2.1 1 1.8A6 6 0 0 0 2.5 10.5l-2 .5v3l2 .6a6 6 0 0 0 .7 1.6l-1 1.8 2.1 2.1 1.8-1a6 6 0 0 0 1.6.7l.6 2h3l.6-2a6 6 0 0 0 1.6-.7l1.8 1 2.1-2.1-1-1.8a6 6 0 0 0 .6-1.7l2-.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function iconForRoute(
  href: string
) {
  if (
    href === "/dashboard"
  ) {
    return <HomeIcon />;
  }

  if (
    href.startsWith(
      "/diagnosis/history"
    )
  ) {
    return <HistoryIcon />;
  }

  if (
    href.startsWith(
      "/diagnosis"
    )
  ) {
    return <DiagnosisIcon />;
  }

  if (
    href === "/guide"
  ) {
    return <GuideIcon />;
  }

  return <SettingsIcon />;
}


export default function AppShellMobile({
  menuOpen,
  setMenuOpen,
  mainNavigation,
  resourceNavigation,
  sessionType,
  userEmail,
  isLoggingOut,
  text,
  isActive,
  onNavigation,
  onLogout,
}: AppShellMobileProps) {
  const dashboardItem =
    mainNavigation.find(
      (
        item
      ) =>
        item.href ===
        "/dashboard"
    );

  const diagnosisItem =
    mainNavigation.find(
      (
        item
      ) =>
        item.href ===
        "/diagnosis/vehicle"
    );

  const historyItem =
    mainNavigation.find(
      (
        item
      ) =>
        item.href ===
        "/diagnosis/history"
    );


  const bottomItems = [
    dashboardItem,
    diagnosisItem,
    historyItem,
  ].filter(
    (
      item
    ): item is NavigationItem =>
      Boolean(item)
  );


  return (
    <>
      {/* MOBILE TOP BAR */}

      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-white/[0.055]
          bg-[#070b13]/92
          backdrop-blur-2xl
          lg:hidden
        "
      >
        <div
          className="
            flex
            min-h-[58px]
            items-center
            justify-between
            px-4
          "
          style={{
            paddingTop:
              "env(safe-area-inset-top, 0px)",
          }}
        >
          <Link
            href="/dashboard"
            onClick={() =>
              setMenuOpen(false)
            }
            className="
              flex
              min-w-0
              items-center
              gap-2.5
            "
          >
            <div
              className="
                relative
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-blue-400/20
                bg-gradient-to-br
                from-blue-500/20
                to-cyan-400/[0.04]
                shadow-[0_0_24px_rgba(37,99,235,0.12)]
              "
            >
              <span
                className="
                  text-[15px]
                  font-black
                  text-blue-300
                "
              >
                A
              </span>
            </div>

            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  truncate
                  text-[13px]
                  font-bold
                  tracking-[0.04em]
                  text-white
                "
              >
                AutoDiagnose
                <span
                  className="
                    text-blue-400
                  "
                >
                  {" "}AI
                </span>
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-zinc-600
                "
              >
                {text.platform}
              </p>
            </div>
          </Link>


          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/[0.06]
              bg-white/[0.025]
              px-2.5
              py-1.5
            "
          >
            <span
              className={`
                h-1.5
                w-1.5
                rounded-full

                ${
                  sessionType ===
                    "user"
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }
              `}
            />

            <span
              className="
                max-w-[105px]
                truncate
                text-[9px]
                font-semibold
                text-zinc-500
              "
            >
              {sessionType ===
                "user"
                ? text.accountActive
                : text.guestMode}
            </span>
          </div>
        </div>
      </header>


      {/* FLOATING MOBILE NAVIGATION */}

      <nav
        className="
          fixed
          inset-x-3
          z-50
          lg:hidden
        "
        style={{
          bottom:
            "max(10px, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div
          className="
            mx-auto
            grid
            max-w-[480px]
            grid-cols-4
            items-center
            rounded-[24px]
            border
            border-white/[0.075]
            bg-[#070b13]/96
            px-2
            py-2
            shadow-[0_18px_60px_rgba(0,0,0,0.55)]
            backdrop-blur-2xl
          "
        >
          {bottomItems.map(
            (
              item
            ) => {
              const active =
                isActive(
                  item.href
                );

              const diagnosis =
                item.href ===
                "/diagnosis/vehicle";

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={() =>
                    onNavigation(
                      item.newDiagnosis
                    )
                  }
                  className="
                    relative
                    flex
                    min-h-[54px]
                    min-w-0
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    rounded-[18px]
                  "
                >
                  {diagnosis ? (
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-[15px]
                        border
                        border-blue-300/25
                        bg-gradient-to-br
                        from-blue-500
                        to-cyan-400
                        text-white
                        shadow-[0_8px_24px_rgba(37,99,235,0.28)]
                      "
                    >
                      <DiagnosisIcon />
                    </div>
                  ) : (
                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-xl
                        transition

                        ${
                          active
                            ? "bg-blue-500/[0.10] text-blue-300"
                            : "text-zinc-600"
                        }
                      `}
                    >
                      {iconForRoute(
                        item.href
                      )}
                    </div>
                  )}

                  <span
                    className={`
                      block
                      w-full
                      truncate
                      px-1
                      text-center
                      text-[9px]
                      font-semibold

                      ${
                        active ||
                        diagnosis
                          ? "text-zinc-200"
                          : "text-zinc-600"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {active &&
                    !diagnosis && (
                      <motion.span
                        layoutId="
                          mobile-nav-active
                        "
                        className="
                          absolute
                          bottom-0
                          h-0.5
                          w-5
                          rounded-full
                          bg-blue-400
                          shadow-[0_0_8px_rgba(96,165,250,0.5)]
                        "
                      />
                    )}
                </Link>
              );
            }
          )}


          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                true
              )
            }
            className="
              relative
              flex
              min-h-[54px]
              min-w-0
              flex-col
              items-center
              justify-center
              gap-1
              rounded-[18px]
            "
          >
            <div
              className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                transition

                ${
                  menuOpen
                    ? "bg-blue-500/[0.10] text-blue-300"
                    : "text-zinc-600"
                }
              `}
            >
              <MenuIcon />
            </div>

            <span
              className={`
                block
                w-full
                truncate
                px-1
                text-center
                text-[9px]
                font-semibold

                ${
                  menuOpen
                    ? "text-zinc-200"
                    : "text-zinc-600"
                }
              `}
            >
              {text.menu}
            </span>
          </button>
        </div>
      </nav>


      {/* MOBILE MENU SHEET */}

      <AnimatePresence>
        {menuOpen && (
          <div
            className="
              fixed
              inset-0
              z-[70]
              lg:hidden
            "
          >
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() =>
                setMenuOpen(
                  false
                )
              }
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="
                absolute
                inset-0
                bg-black/70
                backdrop-blur-sm
              "
            />


            <motion.div
              initial={{
                y: "100%",
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: "100%",
              }}
              transition={{
                type:
                  "spring",

                damping:
                  28,

                stiffness:
                  320,
              }}
              className="
                absolute
                inset-x-0
                bottom-0
                max-h-[84dvh]
                overflow-hidden
                rounded-t-[30px]
                border-t
                border-white/[0.08]
                bg-[#080c15]
                shadow-[0_-24px_80px_rgba(0,0,0,0.55)]
              "
              style={{
                paddingBottom:
                  "env(safe-area-inset-bottom, 0px)",
              }}
            >
              <div
                className="
                  flex
                  justify-center
                  pt-3
                "
              >
                <div
                  className="
                    h-1
                    w-10
                    rounded-full
                    bg-white/10
                  "
                />
              </div>


              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-5
                  pb-4
                  pt-4
                "
              >
                <div>
                  <p
                    className="
                      text-[18px]
                      font-semibold
                      tracking-[-0.03em]
                      text-white
                    "
                  >
                    {text.menu}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-zinc-600
                    "
                  >
                    AutoDiagnose AI
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMenuOpen(
                      false
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.025]
                    text-lg
                    text-zinc-500
                  "
                >
                  ×
                </button>
              </div>


              <div
                className="
                  max-h-[calc(84dvh-90px)]
                  overflow-y-auto
                  overscroll-contain
                  px-4
                  pb-5
                "
              >
                <p
                  className="
                    mb-2
                    px-2
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.20em]
                    text-zinc-700
                  "
                >
                  {text.main}
                </p>


                <div
                  className="
                    space-y-1
                  "
                >
                  {mainNavigation.map(
                    (
                      item
                    ) => {
                      const active =
                        isActive(
                          item.href
                        );

                      return (
                        <Link
                          key={
                            item.href
                          }
                          href={
                            item.href
                          }
                          onClick={() =>
                            onNavigation(
                              item.newDiagnosis
                            )
                          }
                          className={`
                            flex
                            min-h-[52px]
                            items-center
                            gap-3
                            rounded-[16px]
                            border
                            px-3.5
                            transition

                            ${
                              active
                                ? "border-blue-400/15 bg-blue-500/[0.08]"
                                : "border-transparent"
                            }
                          `}
                        >
                          <div
                            className={`
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              border

                              ${
                                active
                                  ? "border-blue-400/20 bg-blue-500/[0.08] text-blue-300"
                                  : "border-white/[0.06] bg-white/[0.02] text-zinc-600"
                              }
                            `}
                          >
                            {iconForRoute(
                              item.href
                            )}
                          </div>

                          <span
                            className={`
                              flex-1
                              text-left
                              text-[13px]
                              font-medium

                              ${
                                active
                                  ? "text-white"
                                  : "text-zinc-400"
                              }
                            `}
                          >
                            {item.label}
                          </span>

                          <ChevronIcon />
                        </Link>
                      );
                    }
                  )}
                </div>


                <p
                  className="
                    mb-2
                    mt-6
                    px-2
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.20em]
                    text-zinc-700
                  "
                >
                  {text.resources}
                </p>


                <div
                  className="
                    space-y-1
                  "
                >
                  {resourceNavigation.map(
                    (
                      item
                    ) => (
                      <Link
                        key={
                          item.href
                        }
                        href={
                          item.href
                        }
                        onClick={() =>
                          onNavigation()
                        }
                        className="
                          flex
                          min-h-[52px]
                          items-center
                          gap-3
                          rounded-[16px]
                          px-3.5
                        "
                      >
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-white/[0.02]
                            text-zinc-600
                          "
                        >
                          {iconForRoute(
                            item.href
                          )}
                        </div>

                        <span
                          className="
                            flex-1
                            text-left
                            text-[13px]
                            font-medium
                            text-zinc-400
                          "
                        >
                          {item.label}
                        </span>

                        <ChevronIcon />
                      </Link>
                    )
                  )}
                </div>


                <p
                  className="
                    mb-2
                    mt-6
                    px-2
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.20em]
                    text-zinc-700
                  "
                >
                  {text.accountSection}
                </p>


                <div
                  className="
                    rounded-[20px]
                    border
                    border-white/[0.06]
                    bg-white/[0.02]
                    p-3
                  "
                >
                  {sessionType ===
                    "user" ? (
                    <>
                      <Link
                        href="/account"
                        onClick={() =>
                          setMenuOpen(
                            false
                          )
                        }
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          p-2
                        "
                      >
                        <div
                          className="
                            relative
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-blue-400/20
                            bg-blue-500/10
                            text-xs
                            font-bold
                            text-blue-200
                          "
                        >
                          {userEmail
                            ?.charAt(0)
                            .toUpperCase() ??
                            "U"}

                          <span
                            className="
                              absolute
                              bottom-0
                              right-0
                              h-2.5
                              w-2.5
                              rounded-full
                              border-2
                              border-[#080c15]
                              bg-emerald-400
                            "
                          />
                        </div>

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <p
                            className="
                              truncate
                              text-[12px]
                              font-medium
                              text-zinc-200
                            "
                          >
                            {userEmail}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[10px]
                              text-zinc-600
                            "
                          >
                            {
                              text.accountActive
                            }
                          </p>
                        </div>

                        <ChevronIcon />
                      </Link>


                      <div
                        className="
                          mt-2
                          grid
                          grid-cols-2
                          gap-2
                        "
                      >
                        <Link
                          href="/account"
                          onClick={() =>
                            setMenuOpen(
                              false
                            )
                          }
                          className="
                            flex
                            min-h-[42px]
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-white/[0.07]
                            text-[11px]
                            font-semibold
                            text-zinc-300
                          "
                        >
                          <SettingsIcon />

                          {
                            text.account
                          }
                        </Link>

                        <button
                          type="button"
                          disabled={
                            isLoggingOut
                          }
                          onClick={
                            onLogout
                          }
                          className="
                            min-h-[42px]
                            rounded-xl
                            border
                            border-white/[0.07]
                            text-[11px]
                            font-semibold
                            text-zinc-500
                            disabled:opacity-50
                          "
                        >
                          {isLoggingOut
                            ? text.signingOut
                            : text.signOut}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="
                          px-2
                          py-1
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
                              h-2
                              w-2
                              rounded-full
                              bg-amber-400/80
                            "
                          />

                          <p
                            className="
                              text-[12px]
                              font-medium
                              text-zinc-300
                            "
                          >
                            {
                              text.guestMode
                            }
                          </p>
                        </div>

                        <p
                          className="
                            mt-1.5
                            text-[10px]
                            leading-4
                            text-zinc-600
                          "
                        >
                          {
                            text.guestMessage
                          }
                        </p>
                      </div>


                      <div
                        className="
                          mt-3
                          grid
                          grid-cols-2
                          gap-2
                        "
                      >
                        <Link
                          href="/login"
                          onClick={() =>
                            setMenuOpen(
                              false
                            )
                          }
                          className="
                            flex
                            min-h-[42px]
                            items-center
                            justify-center
                            rounded-xl
                            bg-white
                            text-[11px]
                            font-semibold
                            text-black
                          "
                        >
                          {text.signIn}
                        </Link>

                        <Link
                          href="/register"
                          onClick={() =>
                            setMenuOpen(
                              false
                            )
                          }
                          className="
                            flex
                            min-h-[42px]
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/[0.08]
                            text-[11px]
                            font-semibold
                            text-zinc-300
                          "
                        >
                          {
                            text.createAccount
                          }
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}