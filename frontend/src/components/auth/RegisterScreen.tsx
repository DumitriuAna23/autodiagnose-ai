"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import RegisterDesktop from "./RegisterDesktop";
import RegisterMobile from "./RegisterMobile";


type ScreenMode =
  | "loading"
  | "mobile"
  | "desktop";


export default function RegisterScreen() {
  const router =
    useRouter();

  const [
    mode,
    setMode,
  ] = useState<ScreenMode>(
    "loading"
  );


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


    const mediaQuery =
      window.matchMedia(
        "(min-width: 1024px)"
      );


    function updateMode() {
      setMode(
        mediaQuery.matches
          ? "desktop"
          : "mobile"
      );
    }


    updateMode();

    mediaQuery.addEventListener(
      "change",
      updateMode
    );


    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateMode
      );
    };
  }, [
    router,
  ]);


  if (
    mode === "loading"
  ) {
    return (
      <main className="min-h-[100dvh] bg-[#060912]" />
    );
  }


  if (
    mode === "desktop"
  ) {
    return <RegisterDesktop />;
  }


  return <RegisterMobile />;
}