"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Modal from "@/components/ui/Modal";

import {
  deleteAccount,
  exportAccountData,
  getCurrentGuest,
  getCurrentUser,
  logout,
  type User,
} from "@/lib/api";


type Language =
  | "ro"
  | "en";


type SessionType =
  | "loading"
  | "user"
  | "guest"
  | "none";


const SUPPORT_EMAIL =
  "support@autodiagnose.ai";


function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="
        h-4
        w-4
      "
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="
        h-4
        w-4
      "
    >
      <path
        d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function SettingsRow({
  title,
  description,
  onClick,
  danger = false,
}: {
  title: string;
  description?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="
        flex
        w-full
        items-center
        gap-3
        px-3.5
        py-3
        text-left
      "
    >
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

            ${
              danger
                ? "text-red-200"
                : "text-zinc-200"
            }
          `}
        >
          {title}
        </p>

        {description && (
          <p
            className="
              mt-0.5
              line-clamp-1
              text-[8px]
              text-zinc-600
            "
          >
            {
              description
            }
          </p>
        )}
      </div>

      <span
        className={`
          shrink-0

          ${
            danger
              ? "text-red-300/50"
              : "text-zinc-700"
          }
        `}
      >
        <ChevronIcon />
      </span>
    </button>
  );
}


export default function AccountMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );


  const [
    sessionType,
    setSessionType,
  ] = useState<SessionType>(
    "loading"
  );


  const [
    user,
    setUser,
  ] = useState<User | null>(
    null
  );


  const [
    loadError,
    setLoadError,
  ] = useState(false);


  const [
    showLogout,
    setShowLogout,
  ] = useState(false);


  const [
    showSupport,
    setShowSupport,
  ] = useState(false);


  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);


  const [
    isExporting,
    setIsExporting,
  ] = useState(false);


  const [
    exportStatus,
    setExportStatus,
  ] = useState<
    "idle" |
    "success" |
    "error"
  >(
    "idle"
  );


  const [
    showDeleteAccount,
    setShowDeleteAccount,
  ] = useState(false);


  const [
    deleteConfirmation,
    setDeleteConfirmation,
  ] = useState("");


  const [
    isDeletingAccount,
    setIsDeletingAccount,
  ] = useState(false);


  const [
    deleteError,
    setDeleteError,
  ] = useState(false);


  const [
    showCookiePreferences,
    setShowCookiePreferences,
  ] = useState(false);


  const [
    analyticsCookies,
    setAnalyticsCookies,
  ] = useState(false);


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );


    if (
      savedLanguage === "ro" ||
      savedLanguage === "en"
    ) {
      setLanguage(
        savedLanguage
      );
    }


    async function loadSession() {
      try {
        setLoadError(
          false
        );


        const currentUser =
          await getCurrentUser();


        if (
          currentUser
        ) {
          setUser(
            currentUser
          );

          setSessionType(
            "user"
          );

          return;
        }


        const currentGuest =
          await getCurrentGuest();


        if (
          currentGuest
        ) {
          setSessionType(
            "guest"
          );

          return;
        }


        setSessionType(
          "none"
        );

      } catch (
        error
      ) {
        console.error(
          "Failed to load account settings:",
          error
        );


        setLoadError(
          true
        );

        setSessionType(
          "none"
        );
      }
    }


    void loadSession();

  }, []);


  const content = {
    en: {
      eyebrow:
        "SETTINGS",

      title:
        "Settings",

      description:
        "Account, interface, data and privacy.",

      account:
        "Account",

      accountSection:
        "ACCOUNT & SECURITY",

      email:
        "Email",

      status:
        "Status",

      active:
        "Active",

      session:
        "Session",

      authenticated:
        "Authenticated account",

      guest:
        "Guest session",

      guestTitle:
        "Guest Mode",

      guestDescription:
        "Create or sign in to an account to keep diagnostics linked to you.",

      createAccount:
        "Create account",

      signIn:
        "Sign in",

      language:
        "Language",

      languageDescription:
        "Interface language",

      romanian:
        "Română",

      english:
        "English",

      selected:
        "Selected",

      interface:
        "INTERFACE",

      data:
        "DATA & RESOURCES",

      diagnosticData:
        "Diagnostic data",

      history:
        "Diagnostic history",

      historyDescription:
        "Saved cases, analyses and reports.",

      guide:
        "Diagnostic guide",

      guideDescription:
        "Scores, severity, urgency and evidence.",

      privacy:
        "Privacy & data",

      privacyDescription:
        "Privacy, cookies and personal data controls.",

      cookieSession:
        "Session protection",

      cookieSessionDescription:
        "Authentication uses an HttpOnly session cookie.",

      personalData:
        "Personal data",

      personalDataDescription:
        "Export or permanently delete account data.",

      exportData:
        "Export my data",

      exportingData:
        "Preparing export...",

      exportReady:
        "Export downloaded.",

      exportFailed:
        "Export failed.",

      deleteAccount:
        "Delete account",

      deleteAccountDescription:
        "Permanently delete your account and diagnostics.",

      deleteAccountTitle:
        "Permanently delete your account?",

      deleteAccountModalDescription:
        "This cannot be undone. Your account, diagnostic cases and authenticated sessions will be permanently deleted.",

      deleteInstruction:
        "Type DELETE to confirm.",

      deletePlaceholder:
        "DELETE",

      deleteForever:
        "Delete permanently",

      deletingAccount:
        "Deleting account...",

      deleteFailed:
        "The account could not be deleted.",

      accountRequired:
        "Sign in to access personal data controls.",

      cookiePreferences:
        "Cookie preferences",

      cookiePreferencesDescription:
        "Manage optional analytics cookies.",

      cookiePreferencesTitle:
        "Cookie preferences",

      cookiePreferencesModalDescription:
        "Choose whether optional analytics cookies may be used. Necessary cookies remain active.",

      necessaryCookies:
        "Necessary cookies",

      necessaryCookiesDescription:
        "Required for authentication, sessions and essential functions.",

      alwaysActive:
        "Always active",

      analyticsCookies:
        "Analytics cookies",

      analyticsCookiesDescription:
        "Optional anonymous usage statistics. No analytics service is currently enabled.",

      saveCookiePreferences:
        "Save preferences",

      privacyPolicy:
        "Privacy",

      cookiePolicy:
        "Cookies",

      terms:
        "Terms",

      support:
        "Help & support",

      supportDescription:
        "Questions about reports, results or your account.",

      contactSupport:
        "Contact support",

      supportEmail:
        "Support email",

      security:
        "Security & session",

      signOut:
        "Sign out",

      logoutTitle:
        "Sign out of AutoDiagnose AI?",

      logoutDescription:
        "Saved diagnostics remain linked to your account.",

      cancel:
        "Cancel",

      confirmLogout:
        "Sign out",

      loggingOut:
        "Signing out...",

      supportTitle:
        "AutoDiagnose AI support",

      supportModalDescription:
        "Use the address below for questions about reports, diagnostic results or account support.",

      close:
        "Close",

      loading:
        "Loading settings...",

      loadError:
        "Some account information could not be loaded.",

      retry:
        "Reload",

      accountId:
        "Account ID",

      appVersion:
        "AutoDiagnose AI",
    },


    ro: {
      eyebrow:
        "SETĂRI",

      title:
        "Setări",

      description:
        "Cont, interfață, date și confidențialitate.",

      account:
        "Cont",

      accountSection:
        "CONT ȘI SECURITATE",

      email:
        "Email",

      status:
        "Stare",

      active:
        "Activ",

      session:
        "Sesiune",

      authenticated:
        "Cont autentificat",

      guest:
        "Sesiune vizitator",

      guestTitle:
        "Mod Vizitator",

      guestDescription:
        "Creează un cont sau autentifică-te pentru a păstra diagnosticele asociate.",

      createAccount:
        "Creează cont",

      signIn:
        "Autentificare",

      language:
        "Limbă",

      languageDescription:
        "Limba interfeței",

      romanian:
        "Română",

      english:
        "English",

      selected:
        "Selectată",

      interface:
        "INTERFAȚĂ",

      data:
        "DATE ȘI RESURSE",

      diagnosticData:
        "Date de diagnostic",

      history:
        "Istoric diagnostice",

      historyDescription:
        "Cazuri, analize și rapoarte salvate.",

      guide:
        "Ghid diagnostic",

      guideDescription:
        "Scor, severitate, urgență și dovezi.",

      privacy:
        "Confidențialitate și date",

      privacyDescription:
        "Confidențialitate, cookie-uri și date personale.",

      cookieSession:
        "Protecția sesiunii",

      cookieSessionDescription:
        "Autentificarea folosește un cookie HttpOnly.",

      personalData:
        "Date personale",

      personalDataDescription:
        "Exportă sau șterge definitiv datele contului.",

      exportData:
        "Exportă datele",

      exportingData:
        "Se pregătește exportul...",

      exportReady:
        "Export descărcat.",

      exportFailed:
        "Exportul a eșuat.",

      deleteAccount:
        "Șterge contul",

      deleteAccountDescription:
        "Șterge definitiv contul și diagnosticele.",

      deleteAccountTitle:
        "Ștergi definitiv contul?",

      deleteAccountModalDescription:
        "Acțiunea nu poate fi anulată. Contul, diagnosticele și sesiunile autentificate vor fi șterse definitiv.",

      deleteInstruction:
        "Scrie DELETE pentru confirmare.",

      deletePlaceholder:
        "DELETE",

      deleteForever:
        "Șterge definitiv",

      deletingAccount:
        "Se șterge contul...",

      deleteFailed:
        "Contul nu a putut fi șters.",

      accountRequired:
        "Autentifică-te pentru acces la controlul datelor personale.",

      cookiePreferences:
        "Preferințe cookie",

      cookiePreferencesDescription:
        "Administrează cookie-urile opționale.",

      cookiePreferencesTitle:
        "Preferințe cookie",

      cookiePreferencesModalDescription:
        "Alege dacă permiți cookie-urile opționale de analiză. Cele necesare rămân active.",

      necessaryCookies:
        "Cookie-uri necesare",

      necessaryCookiesDescription:
        "Necesare pentru autentificare, sesiuni și funcțiile esențiale.",

      alwaysActive:
        "Întotdeauna active",

      analyticsCookies:
        "Cookie-uri de analiză",

      analyticsCookiesDescription:
        "Statistici anonimizate opționale. Momentan nu există un serviciu de analiză activ.",

      saveCookiePreferences:
        "Salvează preferințele",

      privacyPolicy:
        "Confidențialitate",

      cookiePolicy:
        "Cookie-uri",

      terms:
        "Termeni",

      support:
        "Ajutor și suport",

      supportDescription:
        "Întrebări despre rapoarte, rezultate sau cont.",

      contactSupport:
        "Contactează suportul",

      supportEmail:
        "Email suport",

      security:
        "Securitate și sesiune",

      signOut:
        "Deconectare",

      logoutTitle:
        "Te deconectezi din AutoDiagnose AI?",

      logoutDescription:
        "Diagnosticele salvate rămân asociate contului.",

      cancel:
        "Renunță",

      confirmLogout:
        "Deconectare",

      loggingOut:
        "Se deconectează...",

      supportTitle:
        "Suport AutoDiagnose AI",

      supportModalDescription:
        "Folosește adresa de mai jos pentru întrebări despre rapoarte, rezultate sau cont.",

      close:
        "Închide",

      loading:
        "Se încarcă setările...",

      loadError:
        "Unele informații nu au putut fi încărcate.",

      retry:
        "Reîncarcă",

      accountId:
        "ID cont",

      appVersion:
        "AutoDiagnose AI",
    },
  };


  const text =
    content[
      language
    ];


  const avatarLetter =
    useMemo(
      () => {
        if (
          user?.email
        ) {
          return user.email
            .trim()
            .charAt(0)
            .toUpperCase();
        }

        return "A";
      },

      [
        user,
      ]
    );


  function changeLanguage(
    next:
      Language
  ) {
    if (
      next ===
      language
    ) {
      return;
    }


    localStorage.setItem(
      "language",
      next
    );


    setLanguage(
      next
    );


    window.setTimeout(
      () => {
        window.location.reload();
      },
      80
    );
  }


  function openCookiePreferences() {
    const savedConsent =
      localStorage.getItem(
        "autodiagnose_cookie_consent_v1"
      );


    if (
      savedConsent
    ) {
      try {
        const parsed =
          JSON.parse(
            savedConsent
          ) as {
            analytics?: boolean;
          };


        setAnalyticsCookies(
          Boolean(
            parsed.analytics
          )
        );

      } catch {
        setAnalyticsCookies(
          false
        );
      }

    } else {
      setAnalyticsCookies(
        false
      );
    }


    setShowCookiePreferences(
      true
    );
  }


  function saveCookiePreferences() {
    const value = {
      necessary:
        true as const,

      analytics:
        analyticsCookies,

      updatedAt:
        new Date()
          .toISOString(),
    };


    localStorage.setItem(
      "autodiagnose_cookie_consent_v1",
      JSON.stringify(
        value
      )
    );


    window.dispatchEvent(
      new CustomEvent(
        "autodiagnose-cookie-consent",
        {
          detail:
            value,
        }
      )
    );


    setShowCookiePreferences(
      false
    );
  }


  async function handleLogout() {
    if (
      sessionType !==
      "user"
    ) {
      return;
    }


    setIsLoggingOut(
      true
    );


    try {
      await logout();


      localStorage.removeItem(
        "diagnosticCaseId"
      );


      window.location.replace(
        "/welcome"
      );

    } catch (
      error
    ) {
      console.error(
        "Logout failed:",
        error
      );

      setIsLoggingOut(
        false
      );
    }
  }


  async function handleExportData() {
    if (
      sessionType !==
      "user"
    ) {
      return;
    }


    setExportStatus(
      "idle"
    );

    setIsExporting(
      true
    );


    try {
      const data =
        await exportAccountData();


      const blob =
        new Blob(
          [
            JSON.stringify(
              data,
              null,
              2
            ),
          ],
          {
            type:
              "application/json",
          }
        );


      const url =
        URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        url;


      link.download =
        `autodiagnose-data-${new Date()
          .toISOString()
          .slice(
            0,
            10
          )}.json`;


      document.body.appendChild(
        link
      );


      link.click();

      link.remove();


      URL.revokeObjectURL(
        url
      );


      setExportStatus(
        "success"
      );

    } catch (
      error
    ) {
      console.error(
        "Account export failed:",
        error
      );


      setExportStatus(
        "error"
      );

    } finally {
      setIsExporting(
        false
      );
    }
  }


  async function handleDeleteAccount() {
    if (
      sessionType !==
        "user" ||
      deleteConfirmation !==
        "DELETE"
    ) {
      return;
    }


    setDeleteError(
      false
    );


    setIsDeletingAccount(
      true
    );


    try {
      await deleteAccount(
        "DELETE"
      );


      for (
        const key
        of Object.keys(
          localStorage
        )
      ) {
        if (
          key.startsWith(
            "diagnostic"
          ) ||
          key.startsWith(
            "autodiagnose_diagnostic"
          )
        ) {
          localStorage.removeItem(
            key
          );
        }
      }


      window.location.replace(
        "/"
      );

    } catch (
      error
    ) {
      console.error(
        "Account deletion failed:",
        error
      );


      setDeleteError(
        true
      );


      setIsDeletingAccount(
        false
      );
    }
  }


  if (
    sessionType ===
    "loading"
  ) {
    return (
      <main
        className="
          min-h-[100dvh]
          bg-[#060912]
          px-3.5
          py-4
          text-white
        "
      >
        <div
          className="
            mx-auto
            max-w-[560px]
          "
        >
          <div
            className="
              h-32
              animate-pulse
              rounded-[22px]
              border
              border-white/[0.05]
              bg-white/[0.025]
            "
          />

          <div
            className="
              mt-3
              h-40
              animate-pulse
              rounded-[20px]
              border
              border-white/[0.05]
              bg-white/[0.02]
            "
          />

          <div
            className="
              mt-3
              h-32
              animate-pulse
              rounded-[20px]
              border
              border-white/[0.05]
              bg-white/[0.02]
            "
          />
        </div>
      </main>
    );
  }


  return (
    <main
      className="
        min-h-screen
        bg-[#060912]
        text-white
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[560px]
          px-3.5
          pb-4
          pt-4
        "
      >
        {/* HERO */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-white/[0.065]
            bg-[#080d18]
            p-4
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
              bg-blue-500/[0.09]
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
                  bg-blue-400
                "
              />

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-blue-200/60
                "
              >
                {
                  text.eyebrow
                }
              </p>
            </div>


            <div
              className="
                mt-3
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
                  shrink-0
                  items-center
                  justify-center
                  rounded-[14px]
                  border
                  border-blue-400/15
                  bg-blue-500/[0.06]
                  text-[13px]
                  font-bold
                  text-blue-200
                "
              >
                {
                  avatarLetter
                }

                <span
                  className={`
                    absolute
                    bottom-[-2px]
                    right-[-2px]
                    h-2.5
                    w-2.5
                    rounded-full
                    border-2
                    border-[#080d18]

                    ${
                      sessionType ===
                      "user"
                        ? "bg-emerald-400"
                        : "bg-amber-400"
                    }
                  `}
                />
              </div>


              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <h1
                  className="
                    text-[23px]
                    font-semibold
                    leading-none
                    tracking-[-0.04em]
                    text-white
                  "
                >
                  {
                    text.title
                  }
                </h1>

                <p
                  className="
                    mt-1.5
                    truncate
                    text-[9px]
                    text-zinc-600
                  "
                >
                  {sessionType ===
                  "user"
                    ? user?.email
                    : text.guest}
                </p>
              </div>


              <span
                className={`
                  shrink-0
                  rounded-full
                  border
                  px-2
                  py-1
                  text-[7px]
                  font-semibold

                  ${
                    sessionType ===
                    "user"
                      ? "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-300"
                      : "border-amber-400/10 bg-amber-400/[0.04] text-amber-300"
                  }
                `}
              >
                {sessionType ===
                "user"
                  ? text.active
                  : text.guest}
              </span>
            </div>


            <p
              className="
                mt-3
                text-[10px]
                leading-4
                text-zinc-500
              "
            >
              {
                text.description
              }
            </p>
          </div>
        </section>


        {/* LOAD ERROR */}

        {loadError && (
          <div
            className="
              mt-2.5
              flex
              items-center
              justify-between
              gap-3
              rounded-[14px]
              border
              border-amber-400/10
              bg-amber-400/[0.035]
              px-3
              py-2.5
            "
          >
            <p
              className="
                text-[9px]
                text-amber-100/70
              "
            >
              {
                text.loadError
              }
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="
                shrink-0
                text-[8px]
                font-semibold
                text-amber-200
              "
            >
              {
                text.retry
              }
            </button>
          </div>
        )}


        {/* ACCOUNT */}

        <p
          className="
            mb-2
            mt-4
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-blue-200/55
          "
        >
          {
            text.accountSection
          }
        </p>


        <section
          className="
            overflow-hidden
            rounded-[18px]
            border
            border-white/[0.06]
            bg-[#05080e]
          "
        >
          {sessionType ===
          "user" ? (
            <>
              <div
                className="
                  flex
                  items-center
                  gap-3
                  px-3.5
                  py-3
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
                    rounded-[11px]
                    border
                    border-blue-400/10
                    bg-blue-500/[0.04]
                    text-[10px]
                    font-bold
                    text-blue-200
                  "
                >
                  ID
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
                      text-[11px]
                      font-semibold
                      text-zinc-200
                    "
                  >
                    {
                      user?.email
                    }
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[8px]
                      text-zinc-600
                    "
                  >
                    {
                      text.authenticated
                    }
                  </p>
                </div>

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                  "
                />
              </div>


              <details
                className="
                  border-t
                  border-white/[0.045]
                "
              >
                <summary
                  className="
                    cursor-pointer
                    select-none
                    px-3.5
                    py-2.5
                    text-[9px]
                    font-semibold
                    text-zinc-500
                  "
                >
                  {
                    language ===
                    "ro"
                      ? "Detalii cont"
                      : "Account details"
                  }
                </summary>

                <div
                  className="
                    space-y-2
                    border-t
                    border-white/[0.04]
                    px-3.5
                    py-3
                    text-[8px]
                  "
                >
                  <div
                    className="
                      flex
                      justify-between
                      gap-3
                    "
                  >
                    <span
                      className="
                        text-zinc-600
                      "
                    >
                      {
                        text.status
                      }
                    </span>

                    <span
                      className="
                        font-semibold
                        text-zinc-300
                      "
                    >
                      {user
                        ?.account_status ===
                      "active"
                        ? text.active
                        : user
                            ?.account_status ??
                          "—"}
                    </span>
                  </div>


                  <div
                    className="
                      flex
                      justify-between
                      gap-3
                    "
                  >
                    <span
                      className="
                        text-zinc-600
                      "
                    >
                      {
                        text.accountId
                      }
                    </span>

                    <span
                      className="
                        max-w-[65%]
                        truncate
                        font-mono
                        text-zinc-500
                      "
                    >
                      {
                        user?.id ??
                        "—"
                      }
                    </span>
                  </div>
                </div>
              </details>


              <button
                type="button"
                onClick={() =>
                  setShowLogout(
                    true
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  border-t
                  border-white/[0.045]
                  px-3.5
                  py-3
                  text-[10px]
                  font-semibold
                  text-red-200
                "
              >
                {
                  text.signOut
                }

                <ChevronIcon />
              </button>
            </>
          ) : (
            <div
              className="
                p-3.5
              "
            >
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-amber-200
                "
              >
                {
                  text.guestTitle
                }
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  leading-4
                  text-zinc-600
                "
              >
                {
                  text.guestDescription
                }
              </p>

              <div
                className="
                  mt-3
                  grid
                  grid-cols-2
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/register"
                    )
                  }
                  className="
                    min-h-[38px]
                    rounded-[10px]
                    bg-white
                    text-[9px]
                    font-semibold
                    text-black
                  "
                >
                  {
                    text.createAccount
                  }
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/login"
                    )
                  }
                  className="
                    min-h-[38px]
                    rounded-[10px]
                    border
                    border-white/[0.07]
                    text-[9px]
                    font-semibold
                    text-zinc-300
                  "
                >
                  {
                    text.signIn
                  }
                </button>
              </div>
            </div>
          )}
        </section>


        {/* INTERFACE */}

        <p
          className="
            mb-2
            mt-4
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-blue-200/55
          "
        >
          {
            text.interface
          }
        </p>


        <section
          className="
            flex
            items-center
            gap-3
            rounded-[18px]
            border
            border-white/[0.06]
            bg-[#05080e]
            p-3
          "
        >
          <div
            className="
              min-w-0
              flex-1
            "
          >
            <p
              className="
                text-[11px]
                font-semibold
                text-zinc-200
              "
            >
              {
                text.language
              }
            </p>

            <p
              className="
                mt-0.5
                text-[8px]
                text-zinc-600
              "
            >
              {
                text.languageDescription
              }
            </p>
          </div>


          <div
            className="
              grid
              shrink-0
              grid-cols-2
              rounded-[10px]
              border
              border-white/[0.06]
              bg-black/10
              p-0.5
            "
          >
            {(
              [
                {
                  id:
                    "ro",

                  label:
                    "RO",
                },

                {
                  id:
                    "en",

                  label:
                    "EN",
                },
              ] as {
                id:
                  Language;

                label:
                  string;
              }[]
            ).map(
              (
                option
              ) => (
                <button
                  key={
                    option.id
                  }
                  type="button"
                  onClick={() =>
                    changeLanguage(
                      option.id
                    )
                  }
                  className={`
                    min-h-[32px]
                    min-w-[42px]
                    rounded-[8px]
                    px-2
                    text-[8px]
                    font-bold

                    ${
                      language ===
                      option.id
                        ? "bg-blue-500/[0.12] text-blue-200"
                        : "text-zinc-600"
                    }
                  `}
                >
                  {
                    option.label
                  }
                </button>
              )
            )}
          </div>
        </section>


        {/* DATA */}

        <p
          className="
            mb-2
            mt-4
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-blue-200/55
          "
        >
          {
            text.data
          }
        </p>


        <section
          className="
            overflow-hidden
            rounded-[18px]
            border
            border-white/[0.06]
            bg-[#05080e]
            divide-y
            divide-white/[0.045]
          "
        >
          <SettingsRow
            title={
              text.history
            }
            description={
              text.historyDescription
            }
            onClick={() =>
              router.push(
                "/diagnosis/history"
              )
            }
          />

          <SettingsRow
            title={
              text.guide
            }
            description={
              text.guideDescription
            }
            onClick={() =>
              router.push(
                "/guide"
              )
            }
          />
        </section>


        {/* PRIVACY */}

        <p
          className="
            mb-2
            mt-4
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-blue-200/55
          "
        >
          {
            text.privacy
          }
        </p>


        <section
          className="
            overflow-hidden
            rounded-[18px]
            border
            border-white/[0.06]
            bg-[#05080e]
          "
        >
          <details>
            <summary
              className="
                cursor-pointer
                select-none
                px-3.5
                py-3
              "
            >
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-zinc-200
                "
              >
                {
                  text.cookieSession
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  text-zinc-600
                "
              >
                {
                  text.cookieSessionDescription
                }
              </p>
            </summary>

            <div
              className="
                border-t
                border-white/[0.045]
                px-3.5
                py-3
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[8px]
                  text-emerald-300/70
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

                HttpOnly session cookie
              </div>
            </div>
          </details>


          <div
            className="
              border-t
              border-white/[0.045]
            "
          >
            <SettingsRow
              title={
                text.cookiePreferences
              }
              description={
                text.cookiePreferencesDescription
              }
              onClick={
                openCookiePreferences
              }
            />
          </div>


          <details
            className="
              border-t
              border-white/[0.045]
            "
          >
            <summary
              className="
                cursor-pointer
                select-none
                px-3.5
                py-3
              "
            >
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-zinc-200
                "
              >
                {
                  text.personalData
                }
              </p>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  text-zinc-600
                "
              >
                {
                  text.personalDataDescription
                }
              </p>
            </summary>


            <div
              className="
                border-t
                border-white/[0.045]
                p-3
              "
            >
              {sessionType ===
              "user" ? (
                <>
                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    <button
                      type="button"
                      disabled={
                        isExporting
                      }
                      onClick={() =>
                        void handleExportData()
                      }
                      className="
                        flex
                        min-h-[38px]
                        items-center
                        justify-center
                        gap-1.5
                        rounded-[10px]
                        border
                        border-blue-400/10
                        bg-blue-500/[0.04]
                        px-2
                        text-[8px]
                        font-semibold
                        text-blue-200
                        disabled:opacity-50
                      "
                    >
                      <DownloadIcon />

                      {isExporting
                        ? text.exportingData
                        : text.exportData}
                    </button>


                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(
                          false
                        );

                        setDeleteConfirmation(
                          ""
                        );

                        setShowDeleteAccount(
                          true
                        );
                      }}
                      className="
                        min-h-[38px]
                        rounded-[10px]
                        border
                        border-red-400/10
                        bg-red-400/[0.035]
                        px-2
                        text-[8px]
                        font-semibold
                        text-red-200
                      "
                    >
                      {
                        text.deleteAccount
                      }
                    </button>
                  </div>


                  {exportStatus ===
                    "success" && (
                    <p
                      className="
                        mt-2
                        text-[8px]
                        text-emerald-300
                      "
                    >
                      {
                        text.exportReady
                      }
                    </p>
                  )}


                  {exportStatus ===
                    "error" && (
                    <p
                      className="
                        mt-2
                        text-[8px]
                        text-red-300
                      "
                    >
                      {
                        text.exportFailed
                      }
                    </p>
                  )}
                </>
              ) : (
                <p
                  className="
                    text-[8px]
                    leading-4
                    text-amber-200/65
                  "
                >
                  {
                    text.accountRequired
                  }
                </p>
              )}
            </div>
          </details>


          <div
            className="
              flex
              flex-wrap
              gap-x-4
              gap-y-2
              border-t
              border-white/[0.045]
              px-3.5
              py-3
              text-[8px]
              font-semibold
            "
          >
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/privacy"
                )
              }
              className="
                text-blue-300/70
              "
            >
              {
                text.privacyPolicy
              }
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/cookies"
                )
              }
              className="
                text-blue-300/70
              "
            >
              {
                text.cookiePolicy
              }
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/terms"
                )
              }
              className="
                text-blue-300/70
              "
            >
              {
                text.terms
              }
            </button>
          </div>
        </section>


        {/* SUPPORT */}

        <p
          className="
            mb-2
            mt-4
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-blue-200/55
          "
        >
          {
            text.support
          }
        </p>


        <section
          className="
            flex
            items-center
            gap-3
            rounded-[18px]
            border
            border-white/[0.06]
            bg-[#05080e]
            p-3.5
          "
        >
          <div
            className="
              min-w-0
              flex-1
            "
          >
            <p
              className="
                text-[11px]
                font-semibold
                text-zinc-200
              "
            >
              {
                text.support
              }
            </p>

            <p
              className="
                mt-0.5
                line-clamp-1
                text-[8px]
                text-zinc-600
              "
            >
              {
                text.supportDescription
              }
            </p>
          </div>


          <button
            type="button"
            onClick={() =>
              setShowSupport(
                true
              )
            }
            className="
              shrink-0
              rounded-[10px]
              border
              border-blue-400/10
              bg-blue-500/[0.04]
              px-3
              py-2
              text-[8px]
              font-semibold
              text-blue-200
            "
          >
            {
              text.contactSupport
            }
          </button>
        </section>


        <p
          className="
            mt-4
            text-center
            text-[7px]
            text-zinc-800
          "
        >
          {
            text.appVersion
          }
        </p>
      </div>


      {/* LOGOUT MODAL */}

      <Modal
        open={
          showLogout
        }
        onClose={() => {
          if (
            !isLoggingOut
          ) {
            setShowLogout(
              false
            );
          }
        }}
        eyebrow={
          text.security
        }
        title={
          text.logoutTitle
        }
        description={
          text.logoutDescription
        }
      >
        <div
          className="
            grid
            grid-cols-2
            gap-2
          "
        >
          <button
            type="button"
            disabled={
              isLoggingOut
            }
            onClick={() =>
              setShowLogout(
                false
              )
            }
            className="
              min-h-[40px]
              rounded-[11px]
              border
              border-white/[0.07]
              text-[10px]
              font-semibold
              text-zinc-300
              disabled:opacity-50
            "
          >
            {
              text.cancel
            }
          </button>


          <button
            type="button"
            disabled={
              isLoggingOut
            }
            onClick={() =>
              void handleLogout()
            }
            className="
              min-h-[40px]
              rounded-[11px]
              border
              border-red-400/15
              bg-red-400/[0.06]
              text-[10px]
              font-semibold
              text-red-200
              disabled:opacity-50
            "
          >
            {isLoggingOut
              ? text.loggingOut
              : text.confirmLogout}
          </button>
        </div>
      </Modal>


      {/* COOKIE MODAL */}

      <Modal
        open={
          showCookiePreferences
        }
        onClose={() =>
          setShowCookiePreferences(
            false
          )
        }
        eyebrow={
          text.privacy
        }
        title={
          text.cookiePreferencesTitle
        }
        description={
          text.cookiePreferencesModalDescription
        }
      >
        <div
          className="
            space-y-2
          "
        >
          <div
            className="
              rounded-[14px]
              border
              border-emerald-400/10
              bg-emerald-400/[0.025]
              p-3
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-semibold
                    text-zinc-200
                  "
                >
                  {
                    text.necessaryCookies
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    leading-4
                    text-zinc-500
                  "
                >
                  {
                    text.necessaryCookiesDescription
                  }
                </p>
              </div>

              <span
                className="
                  shrink-0
                  rounded-full
                  border
                  border-emerald-400/10
                  px-2
                  py-1
                  text-[7px]
                  font-semibold
                  text-emerald-300
                "
              >
                {
                  text.alwaysActive
                }
              </span>
            </div>
          </div>


          <div
            className="
              rounded-[14px]
              border
              border-white/[0.05]
              bg-black/10
              p-3
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
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    text-[10px]
                    font-semibold
                    text-zinc-200
                  "
                >
                  {
                    text.analyticsCookies
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    leading-4
                    text-zinc-500
                  "
                >
                  {
                    text.analyticsCookiesDescription
                  }
                </p>
              </div>


              <button
                type="button"
                aria-pressed={
                  analyticsCookies
                }
                onClick={() =>
                  setAnalyticsCookies(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                className={`
                  relative
                  h-7
                  w-12
                  shrink-0
                  rounded-full
                  border
                  transition

                  ${
                    analyticsCookies
                      ? "border-blue-400/30 bg-blue-500/30"
                      : "border-white/[0.08] bg-white/[0.04]"
                  }
                `}
              >
                <span
                  className={`
                    absolute
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    rounded-full
                    bg-white
                    transition

                    ${
                      analyticsCookies
                        ? "left-[25px]"
                        : "left-[3px]"
                    }
                  `}
                />
              </button>
            </div>
          </div>
        </div>


        <div
          className="
            mt-3
            grid
            grid-cols-2
            gap-2
          "
        >
          <button
            type="button"
            onClick={() =>
              setShowCookiePreferences(
                false
              )
            }
            className="
              min-h-[40px]
              rounded-[11px]
              border
              border-white/[0.07]
              text-[10px]
              font-semibold
              text-zinc-300
            "
          >
            {
              text.cancel
            }
          </button>

          <button
            type="button"
            onClick={
              saveCookiePreferences
            }
            className="
              min-h-[40px]
              rounded-[11px]
              bg-blue-500
              text-[10px]
              font-semibold
              text-white
            "
          >
            {
              text.saveCookiePreferences
            }
          </button>
        </div>
      </Modal>


      {/* DELETE ACCOUNT MODAL */}

      <Modal
        open={
          showDeleteAccount
        }
        onClose={() => {
          if (
            !isDeletingAccount
          ) {
            setShowDeleteAccount(
              false
            );

            setDeleteConfirmation(
              ""
            );

            setDeleteError(
              false
            );
          }
        }}
        eyebrow={
          text.privacy
        }
        title={
          text.deleteAccountTitle
        }
        description={
          text.deleteAccountModalDescription
        }
      >
        <div
          className="
            rounded-[14px]
            border
            border-red-400/12
            bg-red-400/[0.03]
            p-3
          "
        >
          <p
            className="
              text-[10px]
              font-semibold
              text-red-200
            "
          >
            {
              text.deleteInstruction
            }
          </p>

          <input
            type="text"
            value={
              deleteConfirmation
            }
            disabled={
              isDeletingAccount
            }
            onChange={(
              event
            ) => {
              setDeleteConfirmation(
                event.target.value
              );

              if (
                deleteError
              ) {
                setDeleteError(
                  false
                );
              }
            }}
            placeholder={
              text.deletePlaceholder
            }
            autoComplete="off"
            spellCheck={false}
            className="
              mt-2.5
              w-full
              rounded-[11px]
              border
              border-white/[0.07]
              bg-[#070b12]
              px-3
              py-2.5
              font-mono
              text-[11px]
              font-semibold
              tracking-[0.08em]
              text-white
              outline-none
              placeholder:text-zinc-700
              focus:border-red-400/30
            "
          />

          {deleteError && (
            <p
              className="
                mt-2
                text-[8px]
                text-red-300
              "
            >
              {
                text.deleteFailed
              }
            </p>
          )}
        </div>


        <div
          className="
            mt-3
            grid
            grid-cols-2
            gap-2
          "
        >
          <button
            type="button"
            disabled={
              isDeletingAccount
            }
            onClick={() => {
              setShowDeleteAccount(
                false
              );

              setDeleteConfirmation(
                ""
              );

              setDeleteError(
                false
              );
            }}
            className="
              min-h-[40px]
              rounded-[11px]
              border
              border-white/[0.07]
              text-[10px]
              font-semibold
              text-zinc-300
            "
          >
            {
              text.cancel
            }
          </button>

          <button
            type="button"
            disabled={
              isDeletingAccount ||
              deleteConfirmation !==
                "DELETE"
            }
            onClick={() =>
              void handleDeleteAccount()
            }
            className="
              min-h-[40px]
              rounded-[11px]
              border
              border-red-400/15
              bg-red-500/[0.08]
              text-[10px]
              font-semibold
              text-red-200
              disabled:opacity-30
            "
          >
            {isDeletingAccount
              ? text.deletingAccount
              : text.deleteForever}
          </button>
        </div>
      </Modal>


      {/* SUPPORT MODAL */}

      <Modal
        open={
          showSupport
        }
        onClose={() =>
          setShowSupport(
            false
          )
        }
        eyebrow={
          text.support
        }
        title={
          text.supportTitle
        }
        description={
          text.supportModalDescription
        }
      >
        <div
          className="
            rounded-[14px]
            border
            border-blue-400/10
            bg-blue-500/[0.03]
            p-3
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-blue-200/55
            "
          >
            {
              text.supportEmail
            }
          </p>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="
              mt-1.5
              block
              break-all
              text-[12px]
              font-semibold
              text-blue-200
            "
          >
            {
              SUPPORT_EMAIL
            }
          </a>
        </div>
      </Modal>
    </main>
  );
}