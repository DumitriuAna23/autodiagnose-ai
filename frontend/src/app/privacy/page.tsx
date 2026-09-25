"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Language = "ro" | "en";

export default function PrivacyPage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage === "ro" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }
  }, []);

  const content = {
    en: {
      eyebrow: "PRIVACY",
      title: "Privacy Policy",
      intro:
        "This page explains what information AutoDiagnose AI may process, why it is used, and what controls are available to users.",
      draft:
        "This privacy notice is a product draft for development and portfolio use. Operator identity, contact details, retention periods and production infrastructure details must be completed and legally reviewed before public launch.",
      collectedTitle: "Information processed",
      collected:
        "AutoDiagnose AI may process account information such as an email address, vehicle technical information, reported symptoms, OBD-II / DTC codes, diagnostic answers, generated analysis results, case history and technical session metadata.",
      purposeTitle: "Why this information is used",
      purpose:
        "The information is used to authenticate users, maintain personal diagnostic history, create and analyze diagnostic cases, provide reports, support guest-to-account transfer and operate essential application features.",
      sessionsTitle: "Sessions and local storage",
      sessions:
        "Authentication uses an HttpOnly session cookie. The application also uses browser localStorage for interface preferences and temporary diagnostic workflow data. Strictly necessary storage is used for core application functionality.",
      rightsTitle: "Your data controls",
      rights:
        "Authenticated users can export their account data and request account deletion from the Account area. Deleting an account removes the associated diagnostic cases and active account sessions handled by the application.",
      sharingTitle: "Third parties and future services",
      sharing:
        "The current development version does not enable an analytics service. If hosting, analytics, email, AI or other external processors are introduced in production, this notice must be updated to identify the relevant providers and processing purposes.",
      securityTitle: "Security",
      security:
        "The application uses password hashing, HttpOnly sessions and user-scoped diagnostic records. No software system can guarantee absolute security, and production deployment requires secure HTTPS configuration, protected secrets and appropriate infrastructure controls.",
      contactTitle: "Contact and operator details",
      contact:
        "The legal operator identity, privacy contact address and any required data-protection contact details must be added before public production launch.",
      back: "Back to AutoDiagnose AI",
      cookies: "Cookie Policy",
      terms: "Terms of Use",
    },
    ro: {
      eyebrow: "CONFIDENȚIALITATE",
      title: "Politica de confidențialitate",
      intro:
        "Această pagină explică ce informații poate prelucra AutoDiagnose AI, de ce sunt folosite și ce controale sunt disponibile utilizatorilor.",
      draft:
        "Această politică este un document de lucru pentru dezvoltare și portofoliu. Identitatea operatorului, datele de contact, perioadele de păstrare și detaliile infrastructurii de producție trebuie completate și revizuite juridic înainte de lansarea publică.",
      collectedTitle: "Informații prelucrate",
      collected:
        "AutoDiagnose AI poate prelucra informații despre cont, precum adresa de email, date tehnice despre vehicul, simptome raportate, coduri OBD-II / DTC, răspunsuri de diagnostic, rezultate de analiză, istoricul cazurilor și metadate tehnice de sesiune.",
      purposeTitle: "De ce sunt folosite aceste informații",
      purpose:
        "Informațiile sunt folosite pentru autentificare, păstrarea istoricului personal de diagnostic, crearea și analizarea cazurilor, generarea rapoartelor, transferul datelor din modul vizitator către cont și funcționarea caracteristicilor esențiale ale aplicației.",
      sessionsTitle: "Sesiuni și stocare locală",
      sessions:
        "Autentificarea folosește un cookie de sesiune HttpOnly. Aplicația folosește și localStorage în browser pentru preferințe de interfață și date temporare ale fluxului de diagnostic. Stocarea strict necesară este utilizată pentru funcțiile de bază ale aplicației.",
      rightsTitle: "Controlul datelor tale",
      rights:
        "Utilizatorii autentificați își pot exporta datele contului și pot solicita ștergerea contului din zona Account. Ștergerea contului elimină cazurile de diagnostic asociate și sesiunile active gestionate de aplicație.",
      sharingTitle: "Terți și servicii viitoare",
      sharing:
        "Versiunea actuală de dezvoltare nu are activat un serviciu de analiză. Dacă în producție vor fi introduse servicii externe de hosting, analytics, email, AI sau alți procesatori, această politică trebuie actualizată cu furnizorii și scopurile relevante.",
      securityTitle: "Securitate",
      security:
        "Aplicația folosește hashing pentru parole, sesiuni HttpOnly și separarea datelor de diagnostic pe utilizator. Niciun sistem software nu poate garanta securitate absolută, iar lansarea în producție necesită HTTPS, protejarea secretelor și măsuri adecvate de infrastructură.",
      contactTitle: "Contact și datele operatorului",
      contact:
        "Identitatea juridică a operatorului, adresa de contact pentru confidențialitate și orice date de contact obligatorii pentru protecția datelor trebuie adăugate înainte de lansarea publică.",
      back: "Înapoi la AutoDiagnose AI",
      cookies: "Politica de cookies",
      terms: "Termeni de utilizare",
    },
  };

  const text = content[language];

  const sections = [
    [text.collectedTitle, text.collected],
    [text.purposeTitle, text.purpose],
    [text.sessionsTitle, text.sessions],
    [text.rightsTitle, text.rights],
    [text.sharingTitle, text.sharing],
    [text.securityTitle, text.security],
    [text.contactTitle, text.contact],
  ];

  return (
    <main className="min-h-screen bg-[#060912] px-6 py-14 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-[30px] border border-white/[0.06] bg-[#080D18] p-7 shadow-2xl shadow-black/20 sm:p-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-blue-300">
            {text.eyebrow}
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F5F7FA] sm:text-4xl">
            {text.title}
          </h1>

          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#94A3B8]">
            {text.intro}
          </p>

          <div className="mt-7 rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-4 text-[13px] leading-6 text-amber-100/80">
            {text.draft}
          </div>

          <div className="mt-9 space-y-7">
            {sections.map(([title, body]) => (
              <section key={title}>
                <h2 className="text-[16px] font-semibold text-[#F5F7FA]">
                  {title}
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[#94A3B8]">
                  {body}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-white/[0.06] pt-6">
            <Link
              href="/welcome"
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[13px] font-semibold text-zinc-200 transition hover:bg-white/[0.06]"
            >
              {text.back}
            </Link>

            <Link
              href="/cookies"
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[13px] font-semibold text-zinc-200 transition hover:bg-white/[0.06]"
            >
              {text.cookies}
            </Link>

            <Link
              href="/terms"
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[13px] font-semibold text-zinc-200 transition hover:bg-white/[0.06]"
            >
              {text.terms}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}