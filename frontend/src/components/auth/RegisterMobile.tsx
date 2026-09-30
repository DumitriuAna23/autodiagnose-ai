"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  register,
} from "@/lib/api";


type Language =
  | "ro"
  | "en";


export default function RegisterMobile() {
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
    confirmPassword,
    setConfirmPassword,
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
        "CREATE YOUR PROFILE",

      title:
        "Create account",

      description:
        "Save your diagnostics and access your reports and history from your devices.",

      back:
        "Back",

      email:
        "Email",

      emailPlaceholder:
        "you@example.com",

      password:
        "Password",

      passwordPlaceholder:
        "At least 8 characters",

      confirm:
        "Confirm password",

      confirmPlaceholder:
        "Repeat password",

      show:
        "Show",

      hide:
        "Hide",

      create:
        "Create account",

      creating:
        "Creating account...",

      haveAccount:
        "Already have an account?",

      signIn:
        "Sign in",

      security:
        "Account protection",

      securityText:
        "Use at least 8 characters. Your password is sent only through the secure authentication flow.",

      emailRequired:
        "Please enter your email.",

      invalidEmail:
        "Please enter a valid email address.",

      passwordShort:
        "Password must contain at least 8 characters.",

      passwordMismatch:
        "Passwords do not match.",

      generic:
        "Account creation could not be completed. Please try again.",
    },


    ro: {
      eyebrow:
        "CREEAZĂ PROFILUL",

      title:
        "Creează cont",

      description:
        "Salvează diagnosticele și accesează rapoartele și istoricul de pe dispozitivele tale.",

      back:
        "Înapoi",

      email:
        "Email",

      emailPlaceholder:
        "tu@exemplu.ro",

      password:
        "Parolă",

      passwordPlaceholder:
        "Minimum 8 caractere",

      confirm:
        "Confirmă parola",

      confirmPlaceholder:
        "Repetă parola",

      show:
        "Arată",

      hide:
        "Ascunde",

      create:
        "Creează cont",

      creating:
        "Se creează contul...",

      haveAccount:
        "Ai deja un cont?",

      signIn:
        "Autentificare",

      security:
        "Protecția contului",

      securityText:
        "Folosește minimum 8 caractere. Parola este transmisă doar prin fluxul securizat de autentificare.",

      emailRequired:
        "Introdu adresa de email.",

      invalidEmail:
        "Introdu o adresă de email validă.",

      passwordShort:
        "Parola trebuie să conțină cel puțin 8 caractere.",

      passwordMismatch:
        "Parolele nu coincid.",

      generic:
        "Contul nu a putut fi creat. Încearcă din nou.",
    },
  };


  const text =
    content[
      language
    ];


  const passwordsMatch =
    useMemo(
      () =>
        confirmPassword.length >
          0 &&
        password ===
          confirmPassword,

      [
        password,
        confirmPassword,
      ]
    );


  async function handleRegister() {
    setError(
      null
    );


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
      password.length <
      8
    ) {
      setError(
        text.passwordShort
      );

      return;
    }


    if (
      password !==
      confirmPassword
    ) {
      setError(
        text.passwordMismatch
      );

      return;
    }


    setIsLoading(
      true
    );


    try {
      await register(
        normalizedEmail,
        password,
        language
      );


      window.location.replace(
        "/dashboard"
      );

    } catch (
      registerError
    ) {
      if (
        registerError instanceof
        Error
      ) {
        /*
         * Preserve the backend message for errors
         * that are already intentionally returned
         * by the registration API.
         */
        setError(
          registerError.message ||
            text.generic
        );

      } else {
        setError(
          text.generic
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


    void handleRegister();
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
          bg-[radial-gradient(circle_at_50%_-12%,rgba(37,99,235,0.16),transparent_36%),radial-gradient(circle_at_100%_85%,rgba(14,165,233,0.05),transparent_28%)]
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
            mb-3
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
                mt-4
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
                text-[11px]
                leading-[1.5]
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
                mt-4
                space-y-3
              "
            >
              <div>
                <label
                  htmlFor="mobile-register-email"

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
                  id="mobile-register-email"

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
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-blue-400/35
                    focus:ring-2
                    focus:ring-blue-500/10
                  "
                />
              </div>


              <div>
                <label
                  htmlFor="mobile-register-password"

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
                    id="mobile-register-password"

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

                    autoComplete="new-password"

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
                      outline-none
                      transition
                      placeholder:text-zinc-700
                      focus:border-blue-400/35
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


              <div>
                <label
                  htmlFor="mobile-register-confirm"

                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-medium
                    text-zinc-400
                  "
                >
                  {
                    text.confirm
                  }
                </label>


                <div
                  className="
                    relative
                  "
                >
                  <input
                    id="mobile-register-confirm"

                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }

                    value={
                      confirmPassword
                    }

                    onChange={(
                      event
                    ) => {
                      setConfirmPassword(
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

                    autoComplete="new-password"

                    placeholder={
                      text.confirmPlaceholder
                    }

                    className={`
                      h-12
                      w-full
                      rounded-[12px]
                      border
                      bg-black/20
                      px-3.5
                      text-[16px]
                      outline-none
                      transition
                      placeholder:text-zinc-700
                      focus:ring-2
                      focus:ring-blue-500/10

                      ${
                        confirmPassword.length >
                          0 &&
                        !passwordsMatch
                          ? "border-amber-400/25 focus:border-amber-400/40"
                          : passwordsMatch
                            ? "border-emerald-400/20 focus:border-emerald-400/35"
                            : "border-white/[0.07] focus:border-blue-400/35"
                      }
                    `}
                  />


                  {passwordsMatch && (
                    <span
                      className="
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-[13px]
                        text-emerald-400
                      "
                    >
                      ✓
                    </span>
                  )}
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
                  shadow-[0_12px_30px_rgba(37,99,235,0.22)]
                  transition
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isLoading
                  ? text.creating
                  : text.create}
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
                py-2
              "
            >
              <div
                className="
                  flex
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
                    bg-blue-400
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
                      text.security
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
                      text.securityText
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        <p
          className="
            mt-3
            text-center
            text-[10px]
            text-zinc-600
          "
        >
          {
            text.haveAccount
          }{" "}

          <button
            type="button"

            onClick={() =>
              router.push(
                "/login"
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
              text.signIn
            }
          </button>
        </p>
      </div>
    </main>
  );
}