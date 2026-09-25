"use client";

import { useEffect, useState } from "react";

type Language = "ro" | "en";

export default function CookiesPage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved === "ro" || saved === "en") setLanguage(saved);
  }, []);

  const ro = language === "ro";

  return (
    <main className="min-h-screen bg-[#060912] px-6 py-14 text-white">
      <article className="mx-auto max-w-4xl">
        <a href="/welcome" className="text-[12px] font-semibold text-blue-300">
          ← AutoDiagnose AI
        </a>

        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em]">
          {ro ? "Politica de cookie-uri" : "Cookie Policy"}
        </h1>

        <div className="mt-10 space-y-8 text-[14px] leading-7 text-zinc-300">
          <section>
            <h2 className="text-lg font-semibold text-white">
              {ro ? "Cookie-uri strict necesare" : "Strictly necessary cookies"}
            </h2>
            <p className="mt-2">
              {ro
                ? "AutoDiagnose AI folosește cookie-uri de sesiune strict necesare pentru autentificare, menținerea sesiunii și asocierea corectă a diagnosticelor cu utilizatorul sau sesiunea de vizitator."
                : "AutoDiagnose AI uses strictly necessary session cookies for authentication, keeping the session active and correctly associating diagnostic cases with an account or guest session."}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              {ro ? "Cookie-uri opționale" : "Optional cookies"}
            </h2>
            <p className="mt-2">
              {ro
                ? "În versiunea actuală nu este activat niciun serviciu de analiză sau marketing. Preferința pentru cookie-uri opționale este salvată pentru ca aplicația să poată respecta alegerea utilizatorului dacă astfel de servicii sunt adăugate ulterior."
                : "No analytics or marketing service is currently enabled. The optional-cookie preference is stored so the application can respect the user's choice if such services are added later."}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              {ro ? "Stocare locală" : "Local storage"}
            </h2>
            <p className="mt-2">
              {ro
                ? "Aplicația folosește și localStorage pentru preferințe și date temporare ale interfeței, de exemplu limba selectată și starea fluxului de diagnostic."
                : "The application also uses localStorage for preferences and temporary interface data, for example the selected language and diagnostic-flow state."}
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
