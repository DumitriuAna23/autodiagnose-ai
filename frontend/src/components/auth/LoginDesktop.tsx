"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/api";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);


  async function handleLogin() {
  const normalizedEmail =
    email.trim();

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  // EMAIL EMPTY
  if (!normalizedEmail) {
    setError(
      "Please enter your email."
    );

    return;
  }


  // INVALID EMAIL FORMAT
  if (
    !emailPattern.test(
      normalizedEmail
    )
  ) {
    setError(
      "Please enter a valid email address."
    );

    return;
  }


  // PASSWORD EMPTY
  if (!password) {
    setError(
      "Please enter your password."
    );

    return;
  }


  // PASSWORD TOO SHORT
  if (password.length < 8) {
    setError(
      "Password must contain at least 8 characters."
    );

    return;
  }


  setError(null);
  setIsLoading(true);


  try {
    await login(
      normalizedEmail,
      password
    );


    /*
     * Full navigation after authentication
     * ensures the HttpOnly session cookie
     * is available to the protected app.
     */
    window.location.replace(
      "/dashboard"
    );

  } catch (error) {
    if (
      error instanceof Error
    ) {
      switch (
        error.message
      ) {
        case "INVALID_EMAIL":
          setError(
            "Please enter a valid email address."
          );
          break;


        case "PASSWORD_TOO_SHORT":
          setError(
            "Password must contain at least 8 characters."
          );
          break;


        case "INVALID_CREDENTIALS":
          setError(
            "Incorrect email or password."
          );
          break;


        case "ACCOUNT_INACTIVE":
          setError(
            "This account is not active."
          );
          break;


        case "SERVER_UNAVAILABLE":
        case "Failed to fetch":
          setError(
            "We could not connect to the server. Please try again."
          );
          break;


        default:
          setError(
            "Sign in could not be completed. Please try again."
          );
      }

    } else {
      setError(
        "Something went wrong. Please try again."
      );
    }


    setIsLoading(false);
  }
}


  function handlePasswordKeyDown(
    event:
      React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key === "Enter" &&
      !isLoading
    ) {
      event.preventDefault();

      void handleLogin();
    }
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="w-full max-w-md">

        <button
          type="button"
          onClick={() =>
            router.push("/welcome")
          }
          className="mb-8 text-sm text-zinc-400 transition hover:text-white"
        >
          ← Back
        </button>


        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          AutoDiagnose AI
        </p>


        <h1 className="mt-4 text-4xl font-bold">
          Welcome back
        </h1>


        <p className="mt-3 text-zinc-400">
          Sign in to access your diagnostics
          and personal history.
        </p>


        <div className="mt-8 space-y-5">

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-zinc-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-600"
            />
          </div>


          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-zinc-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              onKeyDown={
                handlePasswordKeyDown
              }
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-600"
            />
          </div>


          {error && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}


          <button
            type="button"
            onClick={() =>
              void handleLogin()
            }
            disabled={isLoading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Signing in..."
              : "Sign in"}
          </button>

        </div>


        <p className="mt-6 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/register"
              )
            }
            className="font-semibold text-white hover:underline"
          >
            Create account
          </button>
        </p>

      </div>
    </main>
  );
}