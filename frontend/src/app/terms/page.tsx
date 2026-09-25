"use client";

import { useEffect, useState } from "react";

type Language = "ro" | "en";

export default function TermsPage() {
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
          {ro ? "Termeni de utilizare" : "Terms of Use"}
        </h1>

        <div className="mt-10 space-y-8 text-[14px] leading-7 text-zinc-300">
          <section>
            <h2 className="text-lg font-semibold text-white">
              {ro ? "Scopul aplicației" : "Purpose of the application"}
            </h2>
            <p className="mt-2">
              {ro
                ? "AutoDiagnose AI este un instrument software de sprijin pentru organizarea informațiilor de diagnostic auto. Rezultatele sunt orientative și nu reprezintă o certificare a stării tehnice a vehiculului."
                : "AutoDiagnose AI is a software tool for organizing automotive diagnostic information. Results are indicative and do not certify the technical condition of a vehicle."}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              {ro ? "Limitarea utilizării" : "Use limitations"}
            </h2>
            <p className="mt-2">
              {ro
                ? "Rezultatele nu înlocuiesc inspecția fizică, măsurătorile, documentația oficială a producătorului sau diagnosticul realizat de un specialist calificat."
                : "Results do not replace physical inspection, measurements, official manufacturer documentation or diagnosis performed by a qualified professional."}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              {ro ? "Responsabilitatea utilizatorului" : "User responsibility"}
            </h2>
            <p className="mt-2">
              {ro
                ? "Utilizatorul este responsabil pentru corectitudinea informațiilor introduse și pentru deciziile luate pe baza rezultatelor aplicației."
                : "The user is responsible for the accuracy of the information entered and for decisions made based on application results."}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              {ro ? "Versiune de proiect" : "Project version"}
            </h2>
            <p className="mt-2">
              {ro
                ? "Această versiune trebuie revizuită juridic și completată cu datele operatorului înainte de o lansare comercială publică."
                : "This version should receive legal review and be completed with controller/business details before a public commercial release."}
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
