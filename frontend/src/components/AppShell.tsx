"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  LayoutGroup,
  motion,
} from "motion/react";

import {
  getCurrentGuest,
  getCurrentUser,
  logout,
  User,
} from "@/lib/api";

import {
  clearDiagnosticDraft,
} from "@/lib/diagnosis";


type Language = "ro" | "en";

type SessionType =
  | "loading"
  | "user"
  | "guest";


type AppShellProps = {
  children: ReactNode;
};


export default function AppShell({
  children,
}: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [
    language,
    setLanguage,
  ] = useState<Language>("en");

  const [
    sessionType,
    setSessionType,
  ] = useState<SessionType>(
    "loading"
  );

  const [
    user,
    setUser,
  ] = useState<User | null>(null);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);


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
          setUser(
            currentUser
          );

          setSessionType(
            "user"
          );

          return;
        }


        const guest =
          await getCurrentGuest();


        if (guest) {
          setSessionType(
            "guest"
          );

          return;
        }


        router.replace(
          "/welcome"
        );

      } catch {
        router.replace(
          "/welcome"
        );
      }
    }


    void checkSession();

  }, [router]);


  const content = {
    en: {
      main:
        "Main",

      resources:
        "Resources",

      accountSection:
        "Account",

      dashboard:
        "Overview",

      diagnosis:
        "New diagnosis",

      history:
        "History",

      guide:
        "Diagnostic guide",

      account:
        "Settings",

      guestMode:
        "Guest session",

      accountActive:
        "Account active",

      signIn:
        "Sign in",

      createAccount:
        "Create account",

      signOut:
        "Sign out",

      signingOut:
        "Signing out...",

      menu:
        "Menu",

      platform:
        "Vehicle Intelligence",

      guestMessage:
        "Temporary diagnostic session",
    },

    ro: {
      main:
        "Principal",

      resources:
        "Resurse",

      accountSection:
        "Cont",

      dashboard:
        "Prezentare generală",

      diagnosis:
        "Diagnostic nou",

      history:
        "Istoric",

      guide:
        "Ghid diagnostic",

      account:
        "Setări",

      guestMode:
        "Sesiune vizitator",

      accountActive:
        "Cont activ",

      signIn:
        "Autentificare",

      createAccount:
        "Creează cont",

      signOut:
        "Deconectare",

      signingOut:
        "Se deconectează...",

      menu:
        "Meniu",

      platform:
        "Vehicle Intelligence",

      guestMessage:
        "Sesiune temporară de diagnostic",
    },
  };


  const text =
    content[language];


  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();

      window.location.replace(
        "/welcome"
      );

    } catch {
      setIsLoggingOut(false);
    }
  }


  function isActive(
    route: string
  ) {
    if (
      route === "/dashboard"
    ) {
      return (
        pathname === "/dashboard"
      );
    }


    if (
      route ===
      "/diagnosis/history"
    ) {
      return (
        pathname ===
        "/diagnosis/history"
      );
    }


    if (
      route ===
      "/diagnosis/vehicle"
    ) {
      return (
        pathname.startsWith(
          "/diagnosis"
        ) &&
        !pathname.startsWith(
          "/diagnosis/history"
        )
      );
    }


    return pathname === route;
  }


  function handleNavigation(
    newDiagnosis?: boolean
  ) {
    if (newDiagnosis) {
      clearDiagnosticDraft();
    }

    setMobileMenuOpen(false);
  }


  const mainNavigation = [
    {
      label:
        text.dashboard,

      href:
        "/dashboard",

      icon:
        "⌂",
    },

    {
      label:
        text.diagnosis,

      href:
        "/diagnosis/vehicle",

      icon:
        "+",

      newDiagnosis:
        true,
    },

    {
      label:
        text.history,

      href:
        "/diagnosis/history",

      icon:
        "◷",
    },
  ];


  const resourceNavigation = [
    {
      label:
        text.guide,

      href:
        "/guide",

      icon:
        "?",
    },
  ];


  if (
    sessionType === "loading"
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060912] text-white">

        <div className="text-center">

          <div className="mx-auto h-8 w-8 rounded-full border border-blue-400/30 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.16)]" />

          <p className="mt-5 text-sm font-semibold tracking-[0.22em] text-zinc-500">
            AUTODIAGNOSE AI
          </p>

        </div>

      </main>
    );
  }


  function NavigationItem({
    label,
    href,
    icon,
    newDiagnosis,
  }: {
    label: string;
    href: string;
    icon: string;
    newDiagnosis?: boolean;
  }) {
    const active =
      isActive(href);


    return (
  <Link
    href={href}
    onClick={() =>
      handleNavigation(
        newDiagnosis
      )
    }
    className="
      relative
      flex
      min-h-11
      w-full
      items-center
      gap-3
      overflow-hidden
      rounded-xl
      px-3
      py-2.5
      text-sm
      font-medium
      outline-none
    "
  >

    {/* ACTIVE BACKGROUND */}

    {active && (
      <motion.div
        layoutId="sidebar-active-item"
        initial={false}
        className="
          absolute
          inset-0
          rounded-xl
          border
          border-blue-400/15
          bg-blue-500/[0.08]
        "
        transition={{
          type: "tween",
          duration: 0.28,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      />
    )}


    {/* ICON */}

    <span
      className={`
        relative
        z-10
        flex
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-lg
        border
        text-sm
        transition-colors
        duration-200
        ${
          active
            ? "border-blue-400/30 bg-blue-500/10 text-blue-300"
            : "border-white/[0.07] bg-white/[0.02] text-zinc-500"
        }
      `}
    >
      {icon}
    </span>


    {/* LABEL */}

    <span
      className={`
        relative
        z-10
        min-w-0
        flex-1
        text-left
        transition-colors
        duration-200
        ${
          active
            ? "text-white"
            : "text-zinc-400 group-hover:text-white"
        }
      `}
    >
      {label}
    </span>


    {/* ACTIVE DOT */}

    {active && (
      <motion.span
        layoutId="sidebar-active-dot"
        initial={false}
        className="
          relative
          z-10
          h-1.5
          w-1.5
          shrink-0
          rounded-full
          bg-blue-400
          shadow-[0_0_10px_rgba(96,165,250,0.45)]
        "
        transition={{
          type: "tween",
          duration: 0.28,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      />
    )}

  </Link>
);
  }


  function NavigationContent() {
    return (
      <>
        {/* BRAND */}

        <div className="px-5 pb-7 pt-6">

          <Link
            href="/dashboard"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="block"
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-blue-400/20
                  bg-gradient-to-br
                  from-blue-500/20
                  to-cyan-400/[0.04]
                  shadow-[0_0_30px_rgba(37,99,235,0.10)]
                "
              >
                <span className="text-lg font-bold text-blue-300">
                  A
                </span>
              </div>


              <div>

                <p className="text-sm font-bold tracking-[0.08em] text-white">
                  AutoDiagnose
                </p>

                <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  {text.platform}
                </p>

              </div>

            </div>

          </Link>

        </div>


        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-3">
          <LayoutGroup id="sidebar-navigation">

          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-700">
            {text.main}
          </p>


          <div className="space-y-1">

            {mainNavigation.map(
              (item) => (
                <NavigationItem
                  key={
                    item.href
                  }
                  {...item}
                />
              )
            )}

          </div>


          <p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-700">
            {text.resources}
          </p>


          <div className="space-y-1">

            {resourceNavigation.map(
              (item) => (
                <NavigationItem
                  key={
                    item.href
                  }
                  {...item}
                />
              )
            )}

          </div>


          {sessionType ===
            "user" && (
            <>
              <p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-700">
                {
                  text.accountSection
                }
              </p>


              <NavigationItem
                label={
                  text.account
                }
                href="/account"
                icon="⚙"
              />
            </>
          )}
</LayoutGroup>
        </nav>


        {/* USER AREA */}

        <div className="p-3">

          <div
            className="
              rounded-2xl
              border
              border-white/[0.06]
              bg-white/[0.025]
              p-3
            "
          >

            {sessionType ===
              "user" && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/account"
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    p-2
                    text-left
                    transition-colors
                    hover:bg-white/[0.035]
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
                      rounded-full
                      border
                      border-blue-400/20
                      bg-blue-500/10
                      text-xs
                      font-bold
                      text-blue-200
                    "
                  >

                    {user?.email
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
                        border-[#090d16]
                        bg-emerald-400
                      "
                    />

                  </div>


                  <div className="min-w-0">

                    <p className="truncate text-xs font-medium text-zinc-200">
                      {user?.email}
                    </p>

                    <p className="mt-0.5 text-[10px] text-zinc-600">
                      {
                        text.accountActive
                      }
                    </p>

                  </div>

                </button>


                <button
                  type="button"
                  onClick={() =>
                    void handleLogout()
                  }
                  disabled={
                    isLoggingOut
                  }
                  className="
                    mt-2
                    w-full
                    rounded-lg
                    px-3
                    py-2
                    text-left
                    text-xs
                    text-zinc-600
                    transition-colors
                    hover:bg-white/[0.03]
                    hover:text-zinc-300
                    disabled:opacity-50
                  "
                >
                  {isLoggingOut
                    ? text.signingOut
                    : text.signOut}
                </button>

              </>
            )}


            {sessionType ===
              "guest" && (
              <>

                <div className="px-2 py-1">

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-amber-400/80" />

                    <p className="text-xs font-medium text-zinc-300">
                      {
                        text.guestMode
                      }
                    </p>

                  </div>


                  <p className="mt-1.5 text-[10px] leading-4 text-zinc-600">
                    {
                      text.guestMessage
                    }
                  </p>

                </div>


                <div className="mt-3 grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/login"
                      )
                    }
                    className="
                      rounded-lg
                      bg-white
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-black
                      transition-colors
                      hover:bg-zinc-200
                    "
                  >
                    {text.signIn}
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/register"
                      )
                    }
                    className="
                      rounded-lg
                      border
                      border-white/[0.08]
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-zinc-300
                      transition-colors
                      hover:bg-white/[0.04]
                    "
                  >
                    {
                      text.createAccount
                    }
                  </button>

                </div>

              </>
            )}

          </div>

        </div>

      </>
    );
  }


  return (
    <div
      className="
        min-h-screen
        bg-[#060912]
        text-white
      "
    >

      {/* BACKGROUND ATMOSPHERE */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          bg-[radial-gradient(circle_at_70%_-10%,rgba(37,99,235,0.10),transparent_34%),radial-gradient(circle_at_95%_60%,rgba(14,165,233,0.035),transparent_28%)]
        "
      />


      {/* DESKTOP SIDEBAR */}

      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-64
          flex-col
          border-r
          border-white/[0.055]
          bg-[#080c15]/95
          backdrop-blur-2xl
          lg:flex
        "
      >

        <NavigationContent />

      </aside>


      {/* MOBILE HEADER */}

      <header
        className="
          sticky
          top-0
          z-40
          flex
          h-16
          items-center
          justify-between
          border-b
          border-white/[0.06]
          bg-[#080c15]/90
          px-5
          backdrop-blur-xl
          lg:hidden
        "
      >

        <button
          type="button"
          onClick={() =>
            router.push(
              "/dashboard"
            )
          }
          className="flex items-center gap-2"
        >

          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-sm font-bold text-blue-300">
            A
          </div>

          <span className="text-sm font-bold tracking-[0.05em]">
            AutoDiagnose
          </span>

        </button>


        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              true
            )
          }
          className="
            rounded-lg
            border
            border-white/[0.08]
            bg-white/[0.025]
            px-3
            py-2
            text-xs
            text-zinc-300
          "
        >
          {text.menu}
        </button>

      </header>


      {/* MOBILE MENU */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setMobileMenuOpen(
                false
              )
            }
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />


          <motion.aside
            initial={{
              opacity: 0,
              x: -12,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.18,
              ease: "easeOut",
            }}
            className="
              absolute
              inset-y-0
              left-0
              flex
              w-[290px]
              flex-col
              border-r
              border-white/[0.06]
              bg-[#080c15]
              shadow-2xl
            "
          >

            <div className="flex justify-end px-4 pt-4">

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    false
                  )
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/[0.08]
                  text-zinc-500
                "
              >
                ×
              </button>

            </div>


            <NavigationContent />

          </motion.aside>

        </div>
      )}


      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          min-h-screen
          lg:pl-64
        "
      >
        {children}
      </div>

    </div>
  );
}