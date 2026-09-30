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
  User,
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


export default function AccountPage() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] =
    useState<Language>(
      "en"
    );


  const [
    sessionType,
    setSessionType,
  ] =
    useState<SessionType>(
      "loading"
    );


  const [
    user,
    setUser,
  ] =
    useState<
      User | null
    >(null);


  const [
    loadError,
    setLoadError,
  ] =
    useState(false);


  const [
    showLogout,
    setShowLogout,
  ] =
    useState(false);


  const [
    showSupport,
    setShowSupport,
  ] =
    useState(false);


  const [
    isLoggingOut,
    setIsLoggingOut,
  ] =
    useState(false);


  const [
    isExporting,
    setIsExporting,
  ] =
    useState(false);


  const [
    exportStatus,
    setExportStatus,
  ] =
    useState<
      "idle" | "success" | "error"
    >("idle");


  const [
    showDeleteAccount,
    setShowDeleteAccount,
  ] =
    useState(false);


  const [
    deleteConfirmation,
    setDeleteConfirmation,
  ] =
    useState("");


  const [
    isDeletingAccount,
    setIsDeletingAccount,
  ] =
    useState(false);


  const [
    deleteError,
    setDeleteError,
  ] =
    useState(false);


  const [
    showCookiePreferences,
    setShowCookiePreferences,
  ] =
    useState(false);


  const [
    analyticsCookies,
    setAnalyticsCookies,
  ] =
    useState(false);


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );


    if (
      savedLanguage ===
        "ro" ||
      savedLanguage ===
        "en"
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
        "Your AutoDiagnose AI settings",

      description:
        "Manage your account, interface language, diagnostic data and support options from one place.",

      account:
        "Account",

      accountDescription:
        "Your identity and current AutoDiagnose AI session.",

      email:
        "Email address",

      status:
        "Account status",

      active:
        "Active",

      session:
        "Session",

      authenticated:
        "Authenticated account",

      guest:
        "Guest session",

      guestTitle:
        "You are using Guest Mode",

      guestDescription:
        "Diagnostics created in this browser can be claimed when you create or sign in to an account.",

      createAccount:
        "Create account",

      signIn:
        "Sign in",

      language:
        "Language",

      languageDescription:
        "Choose the language used throughout the AutoDiagnose AI interface.",

      romanian:
        "Română",

      english:
        "English",

      selected:
        "Selected",

      diagnosticData:
        "Diagnostic data",

      diagnosticDataDescription:
        "Quick access to the cases currently associated with this session.",

      history:
        "Diagnostic history",

      historyDescription:
        "Review saved cases, analyses and reports.",

      openHistory:
        "Open history",

      guide:
        "Diagnostic guide",

      guideDescription:
        "Learn how to interpret scores, severity, urgency and evidence.",

      openGuide:
        "Open guide",

      privacy:
        "Privacy & data",

      privacyDescription:
        "Your diagnostic information is used to build and store your own cases inside AutoDiagnose AI.",

      cookieSession:
        "Session protection",

      cookieSessionDescription:
        "Authentication uses an HttpOnly session cookie so the login token is not exposed to frontend JavaScript.",

      personalData:
        "Personal data controls",

      personalDataDescription:
        "Download a copy of the data linked to your account or permanently delete the account and its saved diagnostic cases.",

      exportData:
        "Export my data",

      exportingData:
        "Preparing export...",

      exportReady:
        "Export downloaded.",

      exportFailed:
        "The data export could not be created.",

      deleteAccount:
        "Delete account",

      deleteAccountDescription:
        "Permanently delete this account and all diagnostic cases associated with it.",

      deleteAccountTitle:
        "Permanently delete your AutoDiagnose AI account?",

      deleteAccountModalDescription:
        "This action cannot be undone. Your account, saved diagnostic cases and authenticated sessions will be permanently deleted.",

      deleteInstruction:
        "Type DELETE below to confirm.",

      deletePlaceholder:
        "DELETE",

      deleteForever:
        "Delete permanently",

      deletingAccount:
        "Deleting account...",

      deleteFailed:
        "The account could not be deleted. Please try again.",

      accountRequired:
        "These controls are available after you sign in to an account.",

      privacyPolicy:
        "Privacy Policy",

      cookiePolicy:
        "Cookie Policy",

      cookiePreferences:
        "Cookie preferences",

      cookiePreferencesDescription:
        "Review or change your optional-cookie choices at any time.",

      manageCookiePreferences:
        "Manage preferences",

      cookiePreferencesTitle:
        "Cookie preferences",

      cookiePreferencesModalDescription:
        "Choose whether optional analytics cookies may be used. Strictly necessary cookies remain active because the app needs them for authentication and core functionality.",

      necessaryCookies:
        "Necessary cookies",

      necessaryCookiesDescription:
        "Required for authentication, sessions and essential application functions.",

      alwaysActive:
        "Always active",

      analyticsCookies:
        "Analytics cookies",

      analyticsCookiesDescription:
        "Optional anonymous usage statistics. No analytics service is currently enabled.",

      saveCookiePreferences:
        "Save preferences",

      terms:
        "Terms of Use",

      support:
        "Help & support",

      supportDescription:
        "Questions about a report, a diagnostic result or the application.",

      contactSupport:
        "Contact support",

      supportEmail:
        "Support email",

      security:
        "Security & session",

      securityDescription:
        "End the authenticated session on this browser.",

      signOut:
        "Sign out",

      logoutTitle:
        "Sign out of AutoDiagnose AI?",

      logoutDescription:
        "Your saved diagnostics remain linked to your account. You will need to sign in again to access them.",

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

      interface:
        "INTERFACE",

      data:
        "DATA & RESOURCES",

      accountSection:
        "ACCOUNT & SECURITY",

      appVersion:
        "AutoDiagnose AI",

      localEnvironment:
        "Development environment",

      backDashboard:
        "Back to dashboard",
    },

    ro: {
      eyebrow:
        "SETĂRI",

      title:
        "Setările AutoDiagnose AI",

      description:
        "Administrează contul, limba interfeței, datele de diagnostic și opțiunile de suport dintr-un singur loc.",

      account:
        "Cont",

      accountDescription:
        "Identitatea și sesiunea AutoDiagnose AI curentă.",

      email:
        "Adresă de email",

      status:
        "Stare cont",

      active:
        "Activ",

      session:
        "Sesiune",

      authenticated:
        "Cont autentificat",

      guest:
        "Sesiune vizitator",

      guestTitle:
        "Folosești modul Vizitator",

      guestDescription:
        "Diagnosticele create în acest browser pot fi asociate contului atunci când creezi un cont sau te autentifici.",

      createAccount:
        "Creează cont",

      signIn:
        "Autentificare",

      language:
        "Limbă",

      languageDescription:
        "Alege limba folosită în întreaga interfață AutoDiagnose AI.",

      romanian:
        "Română",

      english:
        "English",

      selected:
        "Selectată",

      diagnosticData:
        "Date de diagnostic",

      diagnosticDataDescription:
        "Acces rapid la cazurile asociate sesiunii curente.",

      history:
        "Istoric diagnostice",

      historyDescription:
        "Revizuiește cazurile, analizele și rapoartele salvate.",

      openHistory:
        "Deschide istoricul",

      guide:
        "Ghid diagnostic",

      guideDescription:
        "Învață cum se interpretează scorul, severitatea, urgența și dovezile.",

      openGuide:
        "Deschide ghidul",

      privacy:
        "Confidențialitate și date",

      privacyDescription:
        "Informațiile de diagnostic sunt folosite pentru construirea și păstrarea propriilor tale cazuri în AutoDiagnose AI.",

      cookieSession:
        "Protecția sesiunii",

      cookieSessionDescription:
        "Autentificarea folosește un cookie de sesiune HttpOnly, astfel încât tokenul de autentificare să nu fie expus JavaScript-ului din frontend.",

      personalData:
        "Controlul datelor personale",

      personalDataDescription:
        "Descarcă o copie a datelor asociate contului sau șterge definitiv contul și cazurile de diagnostic salvate.",

      exportData:
        "Exportă datele mele",

      exportingData:
        "Se pregătește exportul...",

      exportReady:
        "Export descărcat.",

      exportFailed:
        "Exportul datelor nu a putut fi creat.",

      deleteAccount:
        "Șterge contul",

      deleteAccountDescription:
        "Șterge definitiv acest cont și toate cazurile de diagnostic asociate lui.",

      deleteAccountTitle:
        "Ștergi definitiv contul AutoDiagnose AI?",

      deleteAccountModalDescription:
        "Această acțiune nu poate fi anulată. Contul, cazurile de diagnostic salvate și sesiunile autentificate vor fi șterse definitiv.",

      deleteInstruction:
        "Scrie DELETE mai jos pentru confirmare.",

      deletePlaceholder:
        "DELETE",

      deleteForever:
        "Șterge definitiv",

      deletingAccount:
        "Se șterge contul...",

      deleteFailed:
        "Contul nu a putut fi șters. Încearcă din nou.",

      accountRequired:
        "Aceste opțiuni sunt disponibile după autentificarea într-un cont.",

      privacyPolicy:
        "Politica de confidențialitate",

      cookiePolicy:
        "Politica de cookie-uri",

      cookiePreferences:
        "Preferințe cookie",

      cookiePreferencesDescription:
        "Revizuiește sau modifică oricând opțiunile pentru cookie-urile opționale.",

      manageCookiePreferences:
        "Gestionează preferințele",

      cookiePreferencesTitle:
        "Preferințe cookie",

      cookiePreferencesModalDescription:
        "Alege dacă permiți cookie-urile opționale de analiză. Cookie-urile strict necesare rămân active deoarece aplicația are nevoie de ele pentru autentificare și funcțiile esențiale.",

      necessaryCookies:
        "Cookie-uri necesare",

      necessaryCookiesDescription:
        "Necesare pentru autentificare, sesiuni și funcțiile esențiale ale aplicației.",

      alwaysActive:
        "Întotdeauna active",

      analyticsCookies:
        "Cookie-uri de analiză",

      analyticsCookiesDescription:
        "Statistici anonimizate opționale. Momentan nu este activat niciun serviciu de analiză.",

      saveCookiePreferences:
        "Salvează preferințele",

      terms:
        "Termeni de utilizare",

      support:
        "Ajutor și suport",

      supportDescription:
        "Întrebări despre un raport, un rezultat de diagnostic sau aplicație.",

      contactSupport:
        "Contactează suportul",

      supportEmail:
        "Email suport",

      security:
        "Securitate și sesiune",

      securityDescription:
        "Închide sesiunea autentificată din acest browser.",

      signOut:
        "Deconectare",

      logoutTitle:
        "Te deconectezi din AutoDiagnose AI?",

      logoutDescription:
        "Diagnosticele salvate rămân asociate contului. Va trebui să te autentifici din nou pentru a le accesa.",

      cancel:
        "Renunță",

      confirmLogout:
        "Deconectare",

      loggingOut:
        "Se deconectează...",

      supportTitle:
        "Suport AutoDiagnose AI",

      supportModalDescription:
        "Folosește adresa de mai jos pentru întrebări despre rapoarte, rezultate de diagnostic sau cont.",

      close:
        "Închide",

      loading:
        "Se încarcă setările...",

      loadError:
        "Unele informații despre cont nu au putut fi încărcate.",

      retry:
        "Reîncarcă",

      accountId:
        "ID cont",

      interface:
        "INTERFAȚĂ",

      data:
        "DATE ȘI RESURSE",

      accountSection:
        "CONT ȘI SECURITATE",

      appVersion:
        "AutoDiagnose AI",

      localEnvironment:
        "Mediu de dezvoltare",

      backDashboard:
        "Înapoi la panou",
    },
  };


  const text =
    content[language];


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
      [user]
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


    /*
     * Reload so AppShell and every route-level component
     * immediately pick up the same language.
     */
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

    if (savedConsent) {
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
      necessary: true as const,
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
          min-h-screen
          bg-[#060912]
          text-white
        "
      >
        <div className="ad-page">
          <section
            className="
              ad-surface
              rounded-[30px]
              p-8
            "
          >
            <div
              className="
                h-3
                w-28
                animate-pulse
                rounded
                bg-white/[0.05]
              "
            />

            <div
              className="
                mt-5
                h-10
                max-w-xl
                animate-pulse
                rounded-xl
                bg-white/[0.05]
              "
            />

            <div
              className="
                mt-4
                h-5
                max-w-2xl
                animate-pulse
                rounded
                bg-white/[0.035]
              "
            />
          </section>


          <div
            className="
              mt-6
              grid
              gap-5
              lg:grid-cols-2
            "
          >
            <div
              className="
                ad-surface
                h-60
                animate-pulse
                rounded-[26px]
              "
            />

            <div
              className="
                ad-surface
                h-60
                animate-pulse
                rounded-[26px]
              "
            />
          </div>
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
      <div className="ad-page">

        {/* HERO */}

        <section
          className="
            ad-surface
            relative
            overflow-hidden
            rounded-[30px]
            p-7
            sm:p-9
            lg:p-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-blue-500/[0.09]
              blur-[95px]
            "
          />


          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              h-56
              w-56
              rounded-full
              bg-cyan-300/[0.035]
              blur-[80px]
            "
          />


          <div
            className="
              relative
              grid
              gap-7
              lg:grid-cols-[minmax(0,1fr)_330px]
              lg:items-end
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-blue-400/15
                  bg-blue-500/[0.05]
                  px-3.5
                  py-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-blue-400
                    shadow-[0_0_12px_rgba(96,165,250,0.65)]
                  "
                />

                <span
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-blue-100/80
                  "
                >
                  {text.eyebrow}
                </span>
              </div>


              <h1
                className="
                  mt-6
                  max-w-3xl
                  text-[2.2rem]
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.04em]
                  text-white
                  sm:text-[2.8rem]
                "
              >
                {text.title}
              </h1>


              <p
                className="
                  mt-4
                  max-w-2xl
                  text-[16px]
                  leading-7
                  text-zinc-300
                "
              >
                {text.description}
              </p>
            </div>


            <div
              className="
                rounded-[24px]
                border
                border-white/[0.06]
                bg-black/10
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-blue-400/15
                    bg-blue-500/[0.06]
                    text-[15px]
                    font-semibold
                    text-blue-100
                  "
                >
                  {avatarLetter}
                </div>


                <div
                  className="
                    min-w-0
                  "
                >
                  <p
                    className="
                      truncate
                      text-[15px]
                      font-semibold
                      text-white
                    "
                  >
                    {sessionType ===
                    "user"
                      ? user?.email
                      : text.guest}
                  </p>

                  <div
                    className="
                      mt-1.5
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className={`
                        h-2
                        w-2
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
                        text-[12px]
                        text-zinc-400
                      "
                    >
                      {sessionType ===
                      "user"
                        ? text.authenticated
                        : text.guest}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {loadError && (
          <div
            className="
              mt-5
              flex
              flex-col
              gap-3
              rounded-[20px]
              border
              border-amber-400/15
              bg-amber-400/[0.045]
              p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p
              className="
                text-[14px]
                text-amber-100
              "
            >
              {text.loadError}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="
                text-[13px]
                font-semibold
                text-amber-100
              "
            >
              {text.retry}
            </button>
          </div>
        )}


        {/* ACCOUNT */}

        <p
          className="
            mt-8
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-blue-100/65
          "
        >
          {text.accountSection}
        </p>


        <div
          className="
            mt-4
            grid
            gap-5
            xl:grid-cols-[minmax(0,1fr)_390px]
          "
        >
          <section
            className="
              ad-surface
              rounded-[26px]
              p-6
              sm:p-7
            "
          >
            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-blue-400/15
                  bg-blue-500/[0.05]
                  text-sm
                  font-semibold
                  text-blue-100
                "
              >
                ID
              </div>

              <div>
                <h2
                  className="
                    text-[18px]
                    font-semibold
                    text-white
                  "
                >
                  {text.account}
                </h2>

                <p
                  className="
                    mt-1
                    text-[14px]
                    leading-6
                    text-zinc-400
                  "
                >
                  {
                    text.accountDescription
                  }
                </p>
              </div>
            </div>


            {sessionType ===
            "user" ? (
              <div
                className="
                  mt-6
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.055]
                "
              >
                {[
                  {
                    label:
                      text.email,
                    value:
                      user?.email ??
                      "—",
                  },
                  {
                    label:
                      text.status,
                    value:
                      user
                        ?.account_status ===
                      "active"
                        ? text.active
                        : user
                            ?.account_status ??
                          "—",
                  },
                  {
                    label:
                      text.session,
                    value:
                      text.authenticated,
                  },
                  {
                    label:
                      text.accountId,
                    value:
                      user?.id ??
                      "—",
                    mono:
                      true,
                  },
                ].map(
                  (
                    row,
                    index,
                    rows
                  ) => (
                    <div
                      key={
                        row.label
                      }
                      className={`
                        grid
                        gap-2
                        px-4
                        py-3.5
                        sm:grid-cols-[170px_minmax(0,1fr)]
                        ${
                          index !==
                          rows.length -
                            1
                            ? "border-b border-white/[0.05]"
                            : ""
                        }
                      `}
                    >
                      <span
                        className="
                          text-[13px]
                          text-zinc-400
                        "
                      >
                        {row.label}
                      </span>

                      <span
                        className={`
                          min-w-0
                          break-all
                          text-[13px]
                          font-semibold
                          text-zinc-100
                          ${
                            row.mono
                              ? "font-mono text-[11px] text-zinc-400"
                              : ""
                          }
                        `}
                      >
                        {row.value}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-amber-400/15
                  bg-amber-400/[0.04]
                  p-5
                "
              >
                <p
                  className="
                    text-[15px]
                    font-semibold
                    text-amber-100
                  "
                >
                  {text.guestTitle}
                </p>

                <p
                  className="
                    mt-2
                    text-[14px]
                    leading-6
                    text-amber-100/75
                  "
                >
                  {
                    text.guestDescription
                  }
                </p>


                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
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
                      rounded-xl
                      bg-white
                      px-4
                      py-2.5
                      text-[13px]
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
                      rounded-xl
                      border
                      border-white/[0.10]
                      bg-white/[0.03]
                      px-4
                      py-2.5
                      text-[13px]
                      font-semibold
                      text-white
                    "
                  >
                    {text.signIn}
                  </button>
                </div>
              </div>
            )}
          </section>


          {/* SECURITY */}

          <section
            className="
              ad-surface
              rounded-[26px]
              p-6
            "
          >
            <div
              className="
                flex
                h-full
                flex-col
              "
            >
              <div>
                <p
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-emerald-200/65
                  "
                >
                  {text.security}
                </p>

                <p
                  className="
                    mt-3
                    text-[14px]
                    leading-6
                    text-zinc-400
                  "
                >
                  {
                    text.securityDescription
                  }
                </p>
              </div>


              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-white/[0.055]
                  bg-black/10
                  p-4
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
                  <div>
                    <p
                      className="
                        text-[13px]
                        font-semibold
                        text-zinc-100
                      "
                    >
                      {text.session}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[12px]
                        text-zinc-400
                      "
                    >
                      {sessionType ===
                      "user"
                        ? text.authenticated
                        : text.guest}
                    </p>
                  </div>


                  <span
                    className={`
                      h-2.5
                      w-2.5
                      rounded-full
                      ${
                        sessionType ===
                        "user"
                          ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]"
                          : "bg-amber-400"
                      }
                    `}
                  />
                </div>
              </div>


              {sessionType ===
                "user" && (
                <button
                  type="button"
                  onClick={() =>
                    setShowLogout(
                      true
                    )
                  }
                  className="
                    mt-auto
                    pt-6
                    text-left
                  "
                >
                  <span
                    className="
                      inline-flex
                      rounded-xl
                      border
                      border-red-400/15
                      bg-red-400/[0.045]
                      px-4
                      py-2.5
                      text-[13px]
                      font-semibold
                      text-red-200
                      transition
                      hover:bg-red-400/[0.08]
                    "
                  >
                    {text.signOut}
                  </span>
                </button>
              )}
            </div>
          </section>
        </div>


        {/* INTERFACE */}

        <p
          className="
            mt-8
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-blue-100/65
          "
        >
          {text.interface}
        </p>


        <section
          className="
            ad-surface
            mt-4
            rounded-[26px]
            p-6
            sm:p-7
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                max-w-xl
              "
            >
              <h2
                className="
                  text-[18px]
                  font-semibold
                  text-white
                "
              >
                {text.language}
              </h2>

              <p
                className="
                  mt-2
                  text-[14px]
                  leading-6
                  text-zinc-400
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
                w-full
                gap-3
                sm:grid-cols-2
                lg:w-[420px]
              "
            >
              {(
                [
                  {
                    id:
                      "ro",
                    title:
                      text.romanian,
                    code:
                      "RO",
                  },
                  {
                    id:
                      "en",
                    title:
                      text.english,
                    code:
                      "EN",
                  },
                ] as {
                  id:
                    Language;
                  title:
                    string;
                  code:
                    string;
                }[]
              ).map(
                (option) => {
                  const active =
                    language ===
                    option.id;


                  return (
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
                        rounded-2xl
                        border
                        p-4
                        text-left
                        transition
                        ${
                          active
                            ? "border-blue-400/20 bg-blue-500/[0.06]"
                            : "border-white/[0.06] bg-black/10 hover:border-white/[0.10] hover:bg-white/[0.02]"
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >
                        <span
                          className={`
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            text-[11px]
                            font-bold
                            ${
                              active
                                ? "bg-blue-500/[0.12] text-blue-100"
                                : "bg-white/[0.035] text-zinc-400"
                            }
                          `}
                        >
                          {
                            option.code
                          }
                        </span>


                        {active && (
                          <span
                            className="
                              rounded-full
                              border
                              border-emerald-400/15
                              bg-emerald-400/[0.05]
                              px-2
                              py-1
                              text-[9px]
                              font-semibold
                              text-emerald-200
                            "
                          >
                            {text.selected}
                          </span>
                        )}
                      </div>


                      <p
                        className="
                          mt-4
                          text-[14px]
                          font-semibold
                          text-zinc-100
                        "
                      >
                        {
                          option.title
                        }
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </section>


        {/* DATA & RESOURCES */}

        <p
          className="
            mt-8
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-blue-100/65
          "
        >
          {text.data}
        </p>


        <div
          className="
            mt-4
            grid
            gap-5
            lg:grid-cols-2
          "
        >
          <section
            className="
              ad-surface
              rounded-[26px]
              p-6
            "
          >
            <h2
              className="
                text-[18px]
                font-semibold
                text-white
              "
            >
              {text.diagnosticData}
            </h2>

            <p
              className="
                mt-2
                text-[14px]
                leading-6
                text-zinc-400
              "
            >
              {
                text.diagnosticDataDescription
              }
            </p>


            <div
              className="
                mt-5
                space-y-3
              "
            >
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/diagnosis/history"
                  )
                }
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border
                  border-white/[0.055]
                  bg-black/10
                  p-4
                  text-left
                  transition
                  hover:border-blue-400/15
                  hover:bg-blue-500/[0.025]
                "
              >
                <div>
                  <p
                    className="
                      text-[14px]
                      font-semibold
                      text-zinc-100
                    "
                  >
                    {text.history}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[13px]
                      leading-5
                      text-zinc-400
                    "
                  >
                    {
                      text.historyDescription
                    }
                  </p>
                </div>

                <span
                  className="
                    text-blue-200/70
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                >
                  →
                </span>
              </button>


              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/guide"
                  )
                }
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border
                  border-white/[0.055]
                  bg-black/10
                  p-4
                  text-left
                  transition
                  hover:border-blue-400/15
                  hover:bg-blue-500/[0.025]
                "
              >
                <div>
                  <p
                    className="
                      text-[14px]
                      font-semibold
                      text-zinc-100
                    "
                  >
                    {text.guide}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[13px]
                      leading-5
                      text-zinc-400
                    "
                  >
                    {
                      text.guideDescription
                    }
                  </p>
                </div>

                <span
                  className="
                    text-blue-200/70
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                >
                  →
                </span>
              </button>
            </div>
          </section>


          <section
            className="
              ad-surface
              rounded-[26px]
              p-6
            "
          >
            <h2
              className="
                text-[18px]
                font-semibold
                text-white
              "
            >
              {text.privacy}
            </h2>

            <p
              className="
                mt-2
                text-[14px]
                leading-6
                text-zinc-400
              "
            >
              {
                text.privacyDescription
              }
            </p>


            <div
              className="
                mt-5
                space-y-3
              "
            >
              <div
                className="
                  rounded-2xl
                  border
                  border-emerald-400/10
                  bg-emerald-400/[0.025]
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <span
                    className="
                      mt-1
                      h-2
                      w-2
                      shrink-0
                      rounded-full
                      bg-emerald-400
                    "
                  />

                  <div>
                    <p
                      className="
                        text-[14px]
                        font-semibold
                        text-zinc-100
                      "
                    >
                      {
                        text.cookieSession
                      }
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-[13px]
                        leading-6
                        text-zinc-400
                      "
                    >
                      {
                        text.cookieSessionDescription
                      }
                    </p>
                  </div>
                </div>
              </div>


              <div
                className="
                  rounded-2xl
                  border
                  border-blue-400/[0.10]
                  bg-blue-500/[0.018]
                  p-4
                "
              >
                <p
                  className="
                    text-[14px]
                    font-semibold
                    text-zinc-100
                  "
                >
                  {text.personalData}
                </p>

                <p
                  className="
                    mt-1.5
                    text-[13px]
                    leading-6
                    text-zinc-400
                  "
                >
                  {
                    text.personalDataDescription
                  }
                </p>


                {sessionType ===
                "user" ? (
                  <>
                    <div
                      className="
                        mt-4
                        grid
                        gap-3
                        sm:grid-cols-2
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
                          rounded-xl
                          border
                          border-blue-400/15
                          bg-blue-500/[0.055]
                          px-4
                          py-2.5
                          text-[13px]
                          font-semibold
                          text-blue-100
                          transition
                          hover:bg-blue-500/[0.09]
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
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
                          rounded-xl
                          border
                          border-red-400/15
                          bg-red-400/[0.045]
                          px-4
                          py-2.5
                          text-[13px]
                          font-semibold
                          text-red-200
                          transition
                          hover:bg-red-400/[0.08]
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
                          mt-3
                          text-[12px]
                          font-medium
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
                          mt-3
                          text-[12px]
                          font-medium
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
                      mt-4
                      rounded-xl
                      border
                      border-amber-400/10
                      bg-amber-400/[0.035]
                      px-3.5
                      py-3
                      text-[12px]
                      leading-5
                      text-amber-100/75
                    "
                  >
                    {
                      text.accountRequired
                    }
                  </p>
                )}


                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-white/[0.055]
                    bg-black/10
                    p-3.5
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[13px]
                          font-semibold
                          text-zinc-100
                        "
                      >
                        {
                          text.cookiePreferences
                        }
                      </p>

                      <p
                        className="
                          mt-1
                          text-[12px]
                          leading-5
                          text-zinc-500
                        "
                      >
                        {
                          text.cookiePreferencesDescription
                        }
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        openCookiePreferences
                      }
                      className="
                        shrink-0
                        rounded-xl
                        border
                        border-blue-400/15
                        bg-blue-500/[0.04]
                        px-3.5
                        py-2.5
                        text-[12px]
                        font-semibold
                        text-blue-100
                        transition
                        hover:bg-blue-500/[0.08]
                      "
                    >
                      {
                        text.manageCookiePreferences
                      }
                    </button>
                  </div>
                </div>


                <div
                  className="
                    mt-4
                    flex
                    flex-wrap
                    gap-x-4
                    gap-y-2
                    border-t
                    border-white/[0.05]
                    pt-4
                    text-[11px]
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
                      text-blue-300/80
                      transition
                      hover:text-blue-200
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
                      text-blue-300/80
                      transition
                      hover:text-blue-200
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
                      text-blue-300/80
                      transition
                      hover:text-blue-200
                    "
                  >
                    {text.terms}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>


        {/* SUPPORT */}

        <section
          className="
            ad-surface
            mt-5
            rounded-[26px]
            p-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                max-w-2xl
              "
            >
              <h2
                className="
                  text-[18px]
                  font-semibold
                  text-white
                "
              >
                {text.support}
              </h2>

              <p
                className="
                  mt-2
                  text-[14px]
                  leading-6
                  text-zinc-400
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
                rounded-xl
                border
                border-blue-400/15
                bg-blue-500/[0.05]
                px-4
                py-2.5
                text-[13px]
                font-semibold
                text-blue-100
                transition
                hover:bg-blue-500/[0.09]
              "
            >
              {text.contactSupport}
            </button>
          </div>
        </section>


        <div
          className="
            mt-8
            flex
            items-center
            justify-between
            gap-4
            text-[12px]
            text-zinc-600
          "
        >
          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
            className="
              transition
              hover:text-zinc-300
            "
          >
            ← {text.backDashboard}
          </button>


          <span>
            {text.appVersion} ·{" "}
            {text.localEnvironment}
          </span>
        </div>
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
            flex
            flex-col-reverse
            gap-3
            sm:flex-row
            sm:justify-end
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
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.025]
              px-4
              py-2.5
              text-[13px]
              font-semibold
              text-zinc-200
              transition
              hover:bg-white/[0.05]
              disabled:opacity-50
            "
          >
            {text.cancel}
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
              rounded-xl
              border
              border-red-400/15
              bg-red-400/[0.07]
              px-4
              py-2.5
              text-[13px]
              font-semibold
              text-red-100
              transition
              hover:bg-red-400/[0.11]
              disabled:opacity-50
            "
          >
            {isLoggingOut
              ? text.loggingOut
              : text.confirmLogout}
          </button>
        </div>
      </Modal>


      {/* COOKIE PREFERENCES MODAL */}

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
            space-y-3
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-emerald-400/10
              bg-emerald-400/[0.025]
              p-4
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div>
                <p
                  className="
                    text-[14px]
                    font-semibold
                    text-zinc-100
                  "
                >
                  {
                    text.necessaryCookies
                  }
                </p>

                <p
                  className="
                    mt-1.5
                    text-[13px]
                    leading-6
                    text-zinc-400
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
                  border-emerald-400/15
                  bg-emerald-400/[0.05]
                  px-2.5
                  py-1
                  text-[9px]
                  font-semibold
                  text-emerald-200
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
              rounded-2xl
              border
              border-white/[0.055]
              bg-black/10
              p-4
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div>
                <p
                  className="
                    text-[14px]
                    font-semibold
                    text-zinc-100
                  "
                >
                  {
                    text.analyticsCookies
                  }
                </p>

                <p
                  className="
                    mt-1.5
                    text-[13px]
                    leading-6
                    text-zinc-400
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
                    ) => !current
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
            mt-5
            flex
            flex-col-reverse
            gap-3
            sm:flex-row
            sm:justify-end
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
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.025]
              px-4
              py-2.5
              text-[13px]
              font-semibold
              text-zinc-200
              transition
              hover:bg-white/[0.05]
            "
          >
            {text.cancel}
          </button>

          <button
            type="button"
            onClick={
              saveCookiePreferences
            }
            className="
              rounded-xl
              bg-blue-500
              px-4
              py-2.5
              text-[13px]
              font-semibold
              text-white
              transition
              hover:bg-blue-400
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
            rounded-2xl
            border
            border-red-400/15
            bg-red-400/[0.035]
            p-4
          "
        >
          <p
            className="
              text-[13px]
              font-semibold
              text-red-100
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
              mt-3
              w-full
              rounded-xl
              border
              border-white/[0.08]
              bg-[#070b12]
              px-4
              py-3
              font-mono
              text-[14px]
              font-semibold
              tracking-[0.08em]
              text-white
              outline-none
              transition
              placeholder:text-zinc-700
              focus:border-red-400/30
              disabled:opacity-50
            "
          />

          {deleteError && (
            <p
              className="
                mt-3
                text-[12px]
                leading-5
                text-red-300
              "
            >
              {text.deleteFailed}
            </p>
          )}
        </div>


        <div
          className="
            mt-5
            flex
            flex-col-reverse
            gap-3
            sm:flex-row
            sm:justify-end
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
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.025]
              px-4
              py-2.5
              text-[13px]
              font-semibold
              text-zinc-200
              transition
              hover:bg-white/[0.05]
              disabled:opacity-50
            "
          >
            {text.cancel}
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
              rounded-xl
              border
              border-red-400/20
              bg-red-500/[0.10]
              px-4
              py-2.5
              text-[13px]
              font-semibold
              text-red-100
              transition
              hover:bg-red-500/[0.16]
              disabled:cursor-not-allowed
              disabled:opacity-35
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
            rounded-2xl
            border
            border-blue-400/12
            bg-blue-500/[0.035]
            p-5
          "
        >
          <p
            className="
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-blue-100/65
            "
          >
            {text.supportEmail}
          </p>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="
              mt-2
              block
              break-all
              text-[16px]
              font-semibold
              text-blue-100
              hover:underline
            "
          >
            {SUPPORT_EMAIL}
          </a>
        </div>


        <div
          className="
            mt-5
            flex
            justify-end
          "
        >
          <button
            type="button"
            onClick={() =>
              setShowSupport(
                false
              )
            }
            className="
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.025]
              px-4
              py-2.5
              text-[13px]
              font-semibold
              text-zinc-200
              transition
              hover:bg-white/[0.05]
            "
          >
            {text.close}
          </button>
        </div>
      </Modal>
    </main>
  );
}
