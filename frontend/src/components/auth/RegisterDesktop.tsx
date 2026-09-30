"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { register } from "@/lib/api";


export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);


  async function handleRegister() {
    setError(null);

    if (!email.trim()) {
      setError(
        "Please enter your email."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    const savedLanguage =
      localStorage.getItem(
        "language"
      );

    const language:
      "ro" | "en" =
        savedLanguage === "ro"
          ? "ro"
          : "en";

    setIsLoading(true);

    try {
      await register(
        email.trim(),
        password,
        language
      );

      window.location.replace(
        "/dashboard"
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(
          error.message
        );
      } else {
        setError(
          "Something went wrong."
        );
      }

      setIsLoading(false);
    }
  }


  function handleKeyDown(
    event:
      React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key === "Enter" &&
      !isLoading
    ) {
      event.preventDefault();

      void handleRegister();
    }
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-12 text-white">

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
          Create account
        </h1>


        <p className="mt-3 leading-6 text-zinc-400">
          Save your diagnostics and access
          your personal history from any
          device.
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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-600"
            />
          </div>


          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm text-zinc-300"
            >
              Confirm password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              autoComplete="new-password"
              placeholder="Repeat password"
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
              void handleRegister()
            }
            disabled={isLoading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Creating account..."
              : "Create account"}
          </button>

        </div>


        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}

          <button
            type="button"
            onClick={() =>
              router.push("/login")
            }
            className="font-semibold text-white hover:underline"
          >
            Sign in
          </button>
        </p>

      </div>

    </main>
  );
}