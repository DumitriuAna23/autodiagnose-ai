"use client";

import {
  useEffect,
  useState,
} from "react";

import VehicleLibraryDesktop from "./VehicleLibraryDesktop";
import VehicleLibraryMobile from "./VehicleLibraryMobile";


type ScreenMode =
  | "loading"
  | "mobile"
  | "desktop";


export default function VehicleLibraryScreen() {
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


    function update() {
      setMode(
        mediaQuery.matches
          ? "desktop"
          : "mobile"
      );
    }


    update();

    mediaQuery.addEventListener(
      "change",
      update
    );


    return () => {
      mediaQuery.removeEventListener(
        "change",
        update
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
      <VehicleLibraryDesktop />
    );
  }


  return (
    <VehicleLibraryMobile />
  );
}