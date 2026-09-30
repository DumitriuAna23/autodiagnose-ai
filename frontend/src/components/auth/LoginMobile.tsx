"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  login,
} from "@/lib/api";


type Language =
  | "ro"
  | "en";


export default function LoginMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);


  const [
    isLoading,
    setIsLoading,
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
  }, []);


  const content = {
    en: {
      eyebrow:
        "SECURE ACCESS",

      title:
        "Welcome back",

      description:
        "Sign in to access your diagnostics, reports and personal history.",

      back:
        "Back",

      email:
        "Email",

      emailPlaceholder:
        "you@example.com",

      password:
        "Password",

      passwordPlaceholder:
        "Enter your password",

      show:
        "Show",

      hide:
        "Hide",

      signIn:
        "Sign in",

      signingIn:
        "Signing in...",

      noAccount:
        "Don't have an account?",

      createAccount:
        "Create account",

      secureSession:
        "Secure session",

      sessionDescription:
        "Your authenticated session is protected by a secure HttpOnly cookie.",

      emailRequired:
        "Please enter your email.",

      invalidEmail:
        "Please enter a valid email address.",

      passwordRequired:
        "Please enter your password.",

      passwordShort:
        "Password must contain at least 8 characters.",

      invalidCredentials:
        "Incorrect email or password.",

      inactiveAccount:
        "This account is not active.",

      unavailable:
        "We could not connect to the server. Please try again.",

      generic:
        "Sign in could not be completed. Please try again.",

      unknown:
        "Something went wrong. Please try again.",
    },


    ro: {
      eyebrow:
        "ACCES SECURIZAT",

      title:
        "Bine ai revenit",

      description:
        "Autentifică-te pentru a accesa diagnosticele, rapoartele și istoricul personal.",

      back:
        "Înapoi",

      email:
        "Email",

      emailPlaceholder:
        "tu@exemplu.ro",

      password:
        "Parolă",

      passwordPlaceholder:
        "Introdu parola",

      show:
        "Arată",

      hide:
        "Ascunde",

      signIn:
        "Autentificare",

      signingIn:
        "Se autentifică...",

      noAccount:
        "Nu ai încă un cont?",

      createAccount:
        "Creează cont",

      secureSession:
        "Sesiune securizată",

      sessionDescription:
        "Sesiunea autentificată este protejată printr-un cookie securizat HttpOnly.",

      emailRequired:
        "Introdu adresa de email.",

      invalidEmail:
        "Introdu o adresă de email validă.",

      passwordRequired:
        "Introdu parola.",

      passwordShort:
        "Parola trebuie să conțină cel puțin 8 caractere.",

      invalidCredentials:
        "Email sau parolă incorectă.",

      inactiveAccount:
        "Acest cont nu este activ.",

      unavailable:
        "Nu ne-am putut conecta la server. Încearcă din nou.",

      generic:
        "Autentificarea nu a putut fi finalizată. Încearcă din nou.",

      unknown:
        "A apărut o problemă. Încearcă din nou.",
    },
  };


  const text =
    content[
      language
    ];


  async function handleLogin() {
    const normalizedEmail =
      email.trim();


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !normalizedEmail
    ) {
      setError(
        text.emailRequired
      );

      return;
    }


    if (
      !emailPattern.test(
        normalizedEmail
      )
    ) {
      setError(
        text.invalidEmail
      );

      return;
    }


    if (
      !password
    ) {
      setError(
        text.passwordRequired
      );

      return;
    }


    if (
      password.length <
      8
    ) {
      setError(
        text.passwordShort
      );

      return;
    }


    setError(
      null
    );

    setIsLoading(
      true
    );


    try {
      await login(
        normalizedEmail,
        password
      );


      /*
       * Full navigation is intentionally kept
       * after authentication so the protected
       * application starts with the session
       * cookie already available.
       */
      window.location.replace(
        "/dashboard"
      );

    } catch (
      loginError
    ) {
      if (
        loginError instanceof
        Error
      ) {
        switch (
          loginError.message
        ) {
          case "INVALID_EMAIL":
            setError(
              text.invalidEmail
            );
            break;


          case "PASSWORD_TOO_SHORT":
            setError(
              text.passwordShort
            );
            break;


          case "INVALID_CREDENTIALS":
            setError(
              text.invalidCredentials
            );
            break;


          case "ACCOUNT_INACTIVE":
            setError(
              text.inactiveAccount
            );
            break;


          case "SERVER_UNAVAILABLE":
          case "Failed to fetch":
            setError(
              text.unavailable
            );
            break;


          default:
            setError(
              text.generic
            );
        }

      } else {
        setError(
          text.unknown
        );
      }


      setIsLoading(
        false
      );
    }
  }


  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    if (
      isLoading
    ) {
      return;
    }


    void handleLogin();
  }


  return (
    <main
      className="
        min-h-[100dvh]
        overflow-x-hidden
        overflow-y-auto
        bg-[#060912]
        text-white
      "
    >
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          bg-[radial-gradient(circle_at_50%_-10%,rgba(37,99,235,0.16),transparent_36%),radial-gradient(circle_at_100%_80%,rgba(14,165,233,0.05),transparent_30%)]
        "
      />


      <div
        className="
          relative
          mx-auto
          flex
          min-h-[100dvh]
          w-full
          max-w-[480px]
          flex-col
          justify-center
          px-4
          py-5
        "
        style={{
          paddingTop:
            "max(20px, env(safe-area-inset-top))",

          paddingBottom:
            "max(20px, env(safe-area-inset-bottom))",
        }}
      >
        <button
          type="button"

          onClick={() =>
            router.push(
              "/welcome"
            )
          }

          className="
            mb-4
            flex
            min-h-[40px]
            w-fit
            items-center
            gap-2
            rounded-[10px]
            px-2
            text-[11px]
            font-medium
            text-zinc-500
          "
        >
          <span>
            ←
          </span>

          {
            text.back
          }
        </button>


        <section
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-white/[0.07]
            bg-[#080d18]/95
            p-4
            shadow-[0_24px_70px_rgba(0,0,0,0.32)]
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
              bg-blue-500/[0.12]
              blur-[65px]
            "
          />


          <div
            className="
              relative
            "
          >
            <div
              className="
                flex
                items-center
                gap-2.5
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-[10px]
                  border
                  border-blue-400/20
                  bg-blue-500/[0.08]
                  text-[13px]
                  font-bold
                  text-blue-200
                "
              >
                A
              </div>


              <div>
                <p
                  className="
                    text-[12px]
                    font-semibold
                    tracking-[-0.015em]
                  "
                >
                  AutoDiagnose AI
                </p>

                <p
                  className="
                    mt-0.5
                    text-[8px]
                    uppercase
                    tracking-[0.12em]
                    text-blue-300/50
                  "
                >
                  Vehicle Intelligence
                </p>
              </div>
            </div>


            <p
              className="
                mt-5
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-blue-300/65
              "
            >
              {
                text.eyebrow
              }
            </p>


            <h1
              className="
                mt-1.5
                text-[24px]
                font-semibold
                tracking-[-0.04em]
              "
            >
              {
                text.title
              }
            </h1>


            <p
              className="
                mt-2
                max-w-[360px]
                text-[11px]
                leading-[1.55]
                text-zinc-500
              "
            >
              {
                text.description
              }
            </p>


            <form
              onSubmit={
                handleSubmit
              }

              className="
                mt-5
                space-y-3.5
              "
            >
              <div>
                <label
                  htmlFor="mobile-login-email"

                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-medium
                    text-zinc-400
                  "
                >
                  {
                    text.email
                  }
                </label>


                <input
                  id="mobile-login-email"

                  type="email"

                  value={
                    email
                  }

                  onChange={(
                    event
                  ) => {
                    setEmail(
                      event.target.value
                    );

                    if (
                      error
                    ) {
                      setError(
                        null
                      );
                    }
                  }}

                  autoComplete="email"

                  inputMode="email"

                  autoCapitalize="none"

                  spellCheck={
                    false
                  }

                  placeholder={
                    text.emailPlaceholder
                  }

                  className="
                    h-12
                    w-full
                    rounded-[12px]
                    border
                    border-white/[0.07]
                    bg-black/20
                    px-3.5
                    text-[16px]
                    text-zinc-100
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-blue-400/35
                    focus:bg-blue-500/[0.025]
                    focus:ring-2
                    focus:ring-blue-500/10
                  "
                />
              </div>


              <div>
                <label
                  htmlFor="mobile-login-password"

                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-medium
                    text-zinc-400
                  "
                >
                  {
                    text.password
                  }
                </label>


                <div
                  className="
                    relative
                  "
                >
                  <input
                    id="mobile-login-password"

                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }

                    value={
                      password
                    }

                    onChange={(
                      event
                    ) => {
                      setPassword(
                        event.target.value
                      );

                      if (
                        error
                      ) {
                        setError(
                          null
                        );
                      }
                    }}

                    autoComplete="current-password"

                    placeholder={
                      text.passwordPlaceholder
                    }

                    className="
                      h-12
                      w-full
                      rounded-[12px]
                      border
                      border-white/[0.07]
                      bg-black/20
                      px-3.5
                      pr-16
                      text-[16px]
                      text-zinc-100
                      outline-none
                      transition
                      placeholder:text-zinc-700
                      focus:border-blue-400/35
                      focus:bg-blue-500/[0.025]
                      focus:ring-2
                      focus:ring-blue-500/10
                    "
                  />


                  <button
                    type="button"

                    onClick={() =>
                      setShowPassword(
                        (
                          current
                        ) =>
                          !current
                      )
                    }

                    className="
                      absolute
                      right-1
                      top-1/2
                      flex
                      min-h-[40px]
                      -translate-y-1/2
                      items-center
                      rounded-[9px]
                      px-2.5
                      text-[9px]
                      font-semibold
                      text-zinc-500
                    "
                  >
                    {showPassword
                      ? text.hide
                      : text.show}
                  </button>
                </div>
              </div>


              {error && (
                <div
                  role="alert"

                  className="
                    rounded-[11px]
                    border
                    border-red-400/15
                    bg-red-400/[0.045]
                    px-3
                    py-2.5
                    text-[10px]
                    leading-4
                    text-red-200
                  "
                >
                  {
                    error
                  }
                </div>
              )}


              <button
                type="submit"

                disabled={
                  isLoading
                }

                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  rounded-[12px]
                  bg-blue-500
                  px-4
                  text-[12px]
                  font-semibold
                  text-white
                  shadow-[0_12px_30px_rgba(37,99,235,0.22)]
                  transition
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isLoading
                  ? text.signingIn
                  : text.signIn}
              </button>
            </form>


            <div
              className="
                mt-3
                rounded-[10px]
                border
                border-white/[0.045]
                bg-white/[0.012]
                px-3
                py-2.5
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-2
                "
              >
                <span
                  className="
                    mt-1
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_10px_rgba(52,211,153,0.45)]
                  "
                />

                <div>
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      text-zinc-400
                    "
                  >
                    {
                      text.secureSession
                    }
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[8px]
                      leading-3.5
                      text-zinc-700
                    "
                  >
                    {
                      text.sessionDescription
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        <p
          className="
            mt-4
            text-center
            text-[10px]
            text-zinc-600
          "
        >
          {
            text.noAccount
          }{" "}

          <button
            type="button"

            onClick={() =>
              router.push(
                "/register"
              )
            }

            className="
              min-h-[40px]
              px-1
              font-semibold
              text-blue-200
            "
          >
            {
              text.createAccount
            }
          </button>
        </p>
      </div>
    </main>
  );
}