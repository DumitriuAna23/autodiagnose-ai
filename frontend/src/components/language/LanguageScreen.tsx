"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import LanguageDesktop from "./LanguageDesktop";
import LanguageMobile from "./LanguageMobile";


type Language =
  | "ro"
  | "en";


export default function LanguageScreen() {
  const router =
    useRouter();

  const [
    selectedLanguage,
    setSelectedLanguage,
  ] = useState<Language | null>(
    null
  );


  function selectLanguage(
    language: Language
  ) {
    if (selectedLanguage) {
      return;
    }

    setSelectedLanguage(
      language
    );

    localStorage.setItem(
      "language",
      language
    );

    window.setTimeout(
      () => {
        router.push(
          "/welcome"
        );
      },
      360
    );
  }


  return (
    <>
      {/* DESKTOP / TABLET */}
      <div
        className="
          hidden
          md:block
        "
      >
        <LanguageDesktop
          selectedLanguage={
            selectedLanguage
          }
          onSelectLanguage={
            selectLanguage
          }
        />
      </div>

      {/* MOBILE / PWA */}
      <div
        className="
          md:hidden
        "
      >
        <LanguageMobile
          selectedLanguage={
            selectedLanguage
          }
          onSelectLanguage={
            selectLanguage
          }
        />
      </div>
    </>
  );
}