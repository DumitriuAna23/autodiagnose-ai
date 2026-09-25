"use client";

import { useEffect, useState } from "react";

type ConsentChoice = {
  necessary: true;
  analytics: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "autodiagnose_cookie_consent_v1";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [language, setLanguage] = useState<"ro" | "en">("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage === "ro" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    const savedConsent = localStorage.getItem(STORAGE_KEY);
    if (!savedConsent) {
      setVisible(true);
      return;
    }

    try {
      const parsed = JSON.parse(savedConsent) as ConsentChoice;
      setAnalytics(Boolean(parsed.analytics));
    } catch {
      setVisible(true);
    }
  }, []);

  const text = language === "ro"
    ? {
        title: "Preferințe cookie",
        description:
          "Folosim cookie-uri strict necesare pentru autentificare și funcționarea aplicației. Cookie-urile opționale vor fi folosite doar dacă alegi să le permiți.",
        necessary: "Necesare",
        necessaryDescription: "Autentificare, sesiune și funcții esențiale.",
        analytics: "Analiză",
        analyticsDescription:
          "Statistici anonimizate pentru îmbunătățirea aplicației. Momentan nu este activat niciun serviciu de analiză.",
        required: "Întotdeauna active",
        customize: "Personalizează",
        reject: "Doar necesare",
        accept: "Acceptă toate",
        save: "Salvează preferințele",
        privacy: "Politica de confidențialitate",
        cookies: "Politica de cookie-uri",
      }
    : {
        title: "Cookie preferences",
        description:
          "We use strictly necessary cookies for authentication and core app functionality. Optional cookies will only be used if you choose to allow them.",
        necessary: "Necessary",
        necessaryDescription: "Authentication, session and essential features.",
        analytics: "Analytics",
        analyticsDescription:
          "Anonymous usage statistics to improve the app. No analytics service is currently enabled.",
        required: "Always active",
        customize: "Customize",
        reject: "Necessary only",
        accept: "Accept all",
        save: "Save preferences",
        privacy: "Privacy Policy",
        cookies: "Cookie Policy",
      };

  function persist(analyticsValue: boolean) {
    const value: ConsentChoice = {
      necessary: true,
      analytics: analyticsValue,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setAnalytics(analyticsValue);
    setVisible(false);

    window.dispatchEvent(
      new CustomEvent("autodiagnose-cookie-consent", { detail: value })
    );
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-5">
      <div className="mx-auto max-w-5xl rounded-[22px] border border-blue-400/[0.14] bg-[#060b14]/95 p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.55)]" />
              <h2 className="text-[15px] font-semibold text-white">{text.title}</h2>
            </div>

            <p className="mt-2 text-[12px] leading-5 text-zinc-400 sm:text-[13px]">
              {text.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px]">
              <a href="/privacy" className="text-blue-300 transition hover:text-blue-200">
                {text.privacy}
              </a>
              <a href="/cookies" className="text-blue-300 transition hover:text-blue-200">
                {text.cookies}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDetailsOpen((current) => !current)}
              className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-[12px] font-semibold text-zinc-300 transition hover:bg-white/[0.04]"
            >
              {text.customize}
            </button>

            <button
              type="button"
              onClick={() => persist(false)}
              className="rounded-xl border border-blue-400/[0.14] bg-blue-500/[0.04] px-4 py-2.5 text-[12px] font-semibold text-blue-100 transition hover:bg-blue-500/[0.08]"
            >
              {text.reject}
            </button>

            <button
              type="button"
              onClick={() => persist(true)}
              className="rounded-xl bg-blue-500 px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-blue-400"
            >
              {text.accept}
            </button>
          </div>
        </div>

        {detailsOpen && (
          <div className="mt-5 grid gap-3 border-t border-white/[0.06] pt-5 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-400/[0.08] bg-[#050912] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold text-white">{text.necessary}</p>
                  <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                    {text.necessaryDescription}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-2.5 py-1 text-[9px] font-semibold text-emerald-300">
                  {text.required}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-400/[0.08] bg-[#050912] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold text-white">{text.analytics}</p>
                  <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                    {text.analyticsDescription}
                  </p>
                </div>

                <button
                  type="button"
                  aria-pressed={analytics}
                  onClick={() => setAnalytics((current) => !current)}
                  className={`relative h-7 w-12 shrink-0 rounded-full border transition ${
                    analytics
                      ? "border-blue-400/30 bg-blue-500/30"
                      : "border-white/[0.08] bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white transition ${
                      analytics ? "left-[25px]" : "left-[3px]"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end md:col-span-2">
              <button
                type="button"
                onClick={() => persist(analytics)}
                className="rounded-xl bg-blue-500 px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-blue-400"
              >
                {text.save}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}