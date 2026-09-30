"use client";

import {
  useEffect,
  useState,
} from "react";

import DashboardDesktop from "./DashboardDesktop";
import DashboardMobile from "./DashboardMobile";


type ScreenMode =
  | "loading"
  | "mobile"
  | "desktop";


export default function DashboardScreen() {
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
          bg-zinc-950
        "
      />
    );
  }


  if (
    screenMode === "desktop"
  ) {
    return (
      <DashboardDesktop />
    );
  }


  return (
    <DashboardMobile />
  );
}