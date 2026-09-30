"use client";

import {
  useEffect,
  useState,
} from "react";

import SymptomCompleteDesktop from "./SymptomCompleteDesktop";
import SymptomCompleteMobile from "./SymptomCompleteMobile";


type ScreenMode =
  | "loading"
  | "mobile"
  | "desktop";


export default function SymptomCompleteScreen() {
  const [
    mode,
    setMode,
  ] = useState<ScreenMode>(
    "loading"
  );


  useEffect(() => {
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
  }, []);


  if (
    mode === "loading"
  ) {
    return (
      <main className="min-h-screen bg-[#060912]" />
    );
  }


  if (
    mode === "desktop"
  ) {
    return (
      <SymptomCompleteDesktop />
    );
  }


  return (
    <SymptomCompleteMobile />
  );
}