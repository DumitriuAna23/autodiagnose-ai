"use client";

import {
  useEffect,
  useState,
} from "react";

import HistoryDesktop from "./HistoryDesktop";
import HistoryMobile from "./HistoryMobile";


type ScreenMode =
  | "loading"
  | "mobile"
  | "desktop";


export default function HistoryScreen() {
  const [
    screenMode,
    setScreenMode,
  ] = useState<ScreenMode>(
    "loading"
  );


  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(min-width: 1024px)"
      );


    function updateMode() {
      setScreenMode(
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
    screenMode === "loading"
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#060912]
        "
      />
    );
  }


  if (
    screenMode === "desktop"
  ) {
    return (
      <HistoryDesktop />
    );
  }


  return (
    <HistoryMobile />
  );
}