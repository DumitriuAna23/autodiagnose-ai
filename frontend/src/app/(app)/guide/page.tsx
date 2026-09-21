"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Language = "en" | "ro";

export default function GuidePage() {
  const router = useRouter();

  const [language, setLanguage] =
    useState<Language>("en");

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("language");

    if (
      savedLanguage === "ro" ||
      savedLanguage === "en"
    ) {
      setLanguage(savedLanguage);
    }
  }, []);

  const content = {
    en: {
      eyebrow:
        "AUTODIAGNOSE AI GUIDE",

      title:
        "How to use AutoDiagnose AI",

      intro:
        "This guide explains how to enter vehicle information correctly, describe symptoms, use DTC codes and understand the diagnostic results.",

      important:
        "AutoDiagnose AI is a diagnostic support tool. It does not replace a qualified mechanic, workshop inspection or manufacturer service information.",

      workflowTitle:
        "Diagnostic workflow",

      step1Title:
        "1. Identify the vehicle",

      step1Text:
        "Select the manufacturer, model, fuel type and year. Correct vehicle information helps the diagnostic engine avoid causes that do not apply to your powertrain.",

      step2Title:
        "2. Add relevant vehicle information",

      step2Text:
        "You can optionally add engine details, turbo or naturally aspirated configuration, transmission type, drivetrain, software or mechanical modifications, previous repairs and recurring problems.",

      step3Title:
        "3. Describe the symptom",

      step3Text:
        "Describe what you actually observe instead of guessing which component is defective.",

      goodExample:
        "Good example: “The car loses power during acceleration and I hear a whistling noise.”",

      badExample:
        "Less useful: “I think the turbo is broken.”",

      step4Title:
        "4. Add DTC codes if available",

      step4Text:
        "If you have access to an OBD-II scanner, enter the diagnostic trouble codes. DTC codes are optional, but they can provide a strong independent source of diagnostic evidence.",

      step5Title:
        "5. Answer the adaptive questions",

      step5Text:
        "The application may ask when the problem started, how often it occurs, whether performance changed and under which conditions the symptom appears.",

      step6Title:
        "6. Review the analysis",

      step6Text:
        "AutoDiagnose AI compares the available evidence with deterministic diagnostic rules and ranks the most relevant possible causes.",

      interpretationTitle:
        "How to interpret the results",

      scoreTitle:
        "Relevance score",

      scoreText:
        "The 0–100 score shows how well a possible cause matches the available case information. It is not a statistical probability and it does not confirm that the component is defective.",

      evidenceTitle:
        "Evidence strength",

      evidenceText:
        "Evidence strength shows how many independent information sources support the same possible cause.",

      limited:
        "Limited — the cause is supported by only one independent evidence source.",

      moderate:
        "Moderate — two different evidence sources support the cause.",

      strong:
        "Strong — three or more evidence sources support the cause, or a DTC is supported by at least one additional independent source.",

      severityTitle:
        "Severity",

      severityText:
        "Severity describes how serious the fault could be if the suspected cause is actually present.",

      urgencyTitle:
        "Urgency",

      urgencyText:
        "Urgency indicates what action is appropriate at the moment.",

      monitor:
        "Monitor — observe the issue and arrange an inspection if it persists or worsens.",

      serviceSoon:
        "Service soon — the vehicle should be checked as soon as reasonably possible.",

      stopDriving:
        "Stop driving — continuing to drive may create a safety risk or cause serious damage. Stop safely and seek assistance.",

      nextStepsTitle:
        "What to check next",

      nextStepsText:
        "The application can suggest the next diagnostic steps with the highest value, such as reading DTC codes or checking the first recommended items for the top-ranked causes. These steps help narrow the diagnosis; they are not a confirmed repair instruction.",

      referencesTitle:
        "Technical references and traceability",

      referencesText:
        "Each diagnostic finding can show the internal knowledge-base rule that generated it, the OBD-II DTC mappings associated with that rule and the relevant generic DTC standards family. A DTC reference is clearly marked when it actually contributed to the current case. These references improve transparency but do not replace manufacturer-specific service information.",

      warningsTitle:
        "Data quality warnings",

      warningsText:
        "If the information entered appears contradictory, AutoDiagnose AI warns you before or during the analysis. For example, selecting an electric vehicle while describing a diesel engine. Review these warnings because inconsistent data can reduce diagnostic quality.",

      aiTitle:
        "How AI is used",

      aiText:
        "AI does not directly decide the diagnosis. It interprets free-text descriptions and extracts structured evidence. The deterministic diagnostic engine then evaluates symptoms, DTC codes, adaptive answers and vehicle context against the knowledge base.",

      architectureTitle:
        "In simple terms",

      architecture:
        "Your description → AI evidence extraction → deterministic diagnostic engine → knowledge base → ranked causes → explainability → next diagnostic steps.",

      betterDataTitle:
        "How to get better results",

      betterData1:
        "Describe when the problem occurs: cold start, idle, acceleration, braking, highway driving, bumps, rain, etc.",

      betterData2:
        "Mention warning lights, unusual sounds, smells, smoke, vibration, fluid leaks and performance changes.",

      betterData3:
        "Add DTC codes exactly as shown by the scanner.",

      betterData4:
        "Add relevant previous repairs or recurring faults, but clearly distinguish past problems from current symptoms.",

      betterData5:
        "If you do not know something, leave it unknown instead of guessing.",

      safetyTitle:
        "Safety",

      safetyText:
        "If the vehicle has braking problems, steering problems, severe overheating, smoke, a strong fuel smell, rapid fluid loss or another condition that may be unsafe, stop the vehicle safely and seek professional assistance.",

      back:
        "Back to welcome",

      start:
        "Start diagnosis",
    },

    ro: {
      eyebrow:
        "GHID AUTODIAGNOSE AI",

      title:
        "Cum folosești AutoDiagnose AI",

      intro:
        "Acest ghid explică modul corect de introducere a informațiilor vehiculului, descrierea simptomelor, utilizarea codurilor DTC și interpretarea rezultatelor diagnosticului.",

      important:
        "AutoDiagnose AI este un instrument de suport pentru diagnostic. Nu înlocuiește verificarea realizată de un mecanic calificat, inspecția într-un service sau informațiile tehnice ale producătorului.",

      workflowTitle:
        "Fluxul diagnosticului",

      step1Title:
        "1. Identifică vehiculul",

      step1Text:
        "Selectează marca, modelul, tipul de combustibil și anul. Informațiile corecte despre vehicul ajută motorul de diagnostic să elimine cauzele care nu se aplică tipului tău de propulsie.",

      step2Title:
        "2. Adaugă informații relevante despre vehicul",

      step2Text:
        "Opțional, poți menționa motorizarea, dacă motorul este turbo sau aspirat, tipul transmisiei, tracțiunea, modificări software sau mecanice, reparații anterioare și probleme care au mai apărut.",

      step3Title:
        "3. Descrie simptomul",

      step3Text:
        "Descrie ceea ce observi efectiv, nu componenta despre care crezi că este defectă.",

      goodExample:
        "Exemplu bun: „Mașina pierde putere la accelerație și se aude un șuierat.”",

      badExample:
        "Mai puțin util: „Cred că turbina este stricată.”",

      step4Title:
        "4. Adaugă codurile DTC dacă le ai",

      step4Text:
        "Dacă ai acces la un tester OBD-II, introdu codurile de eroare. Codurile DTC nu sunt obligatorii, dar pot reprezenta o sursă independentă importantă de dovezi.",

      step5Title:
        "5. Răspunde la întrebările adaptive",

      step5Text:
        "Aplicația poate întreba când a început problema, cât de des apare, dacă s-a modificat performanța și în ce condiții apare simptomul.",

      step6Title:
        "6. Analizează rezultatele",

      step6Text:
        "AutoDiagnose AI compară dovezile disponibile cu reguli deterministe de diagnostic și ordonează cele mai relevante cauze posibile.",

      interpretationTitle:
        "Cum interpretezi rezultatele",

      scoreTitle:
        "Scor de relevanță",

      scoreText:
        "Scorul 0–100 arată cât de bine se potrivește o cauză posibilă cu informațiile disponibile în caz. Nu reprezintă o probabilitate statistică și nu confirmă că piesa respectivă este defectă.",

      evidenceTitle:
        "Puterea dovezilor",

      evidenceText:
        "Puterea dovezilor arată câte surse independente de informații susțin aceeași cauză posibilă.",

      limited:
        "Limitată — cauza este susținută de o singură sursă independentă de dovezi.",

      moderate:
        "Moderată — două tipuri diferite de dovezi susțin cauza.",

      strong:
        "Puternică — trei sau mai multe surse susțin cauza sau există un DTC împreună cu cel puțin încă o sursă independentă.",

      severityTitle:
        "Severitate",

      severityText:
        "Severitatea descrie cât de serioasă ar putea fi problema dacă acea cauză este într-adevăr prezentă.",

      urgencyTitle:
        "Urgență",

      urgencyText:
        "Urgența indică ce acțiune este recomandată în acel moment.",

      monitor:
        "Monitorizează — urmărește problema și programează o verificare dacă persistă sau se agravează.",

      serviceSoon:
        "Verificare recomandată — vehiculul ar trebui verificat cât mai curând posibil.",

      stopDriving:
        "Oprește deplasarea — continuarea mersului poate crea un risc de siguranță sau avarii serioase. Oprește vehiculul în siguranță și solicită asistență.",

      nextStepsTitle:
        "Ce verifici în continuare",

      nextStepsText:
        "Aplicația poate recomanda următorii pași cu cea mai mare valoare diagnostică, de exemplu citirea codurilor DTC sau primele verificări asociate cauzelor principale. Acești pași ajută la restrângerea diagnosticului și nu reprezintă o instrucțiune de reparație confirmată.",

      referencesTitle:
        "Referințe tehnice și trasabilitate",

      referencesText:
        "Fiecare rezultat poate afișa regula internă din baza de cunoștințe care l-a generat, mapările DTC OBD-II asociate acelei reguli și familia de standarde pentru codurile DTC generice. Un DTC este marcat clar atunci când a contribuit efectiv la cazul curent. Aceste referințe cresc transparența, dar nu înlocuiesc documentația de service specifică producătorului.",

      warningsTitle:
        "Avertismente privind calitatea datelor",

      warningsText:
        "Dacă informațiile introduse par contradictorii, AutoDiagnose AI te avertizează înainte sau în timpul analizei. De exemplu, dacă selectezi un vehicul electric dar descrii un motor diesel. Verifică aceste avertismente deoarece datele inconsistente pot reduce calitatea diagnosticului.",

      aiTitle:
        "Cum este folosit AI-ul",

      aiText:
        "AI-ul nu decide direct diagnosticul. El interpretează descrierea liberă și extrage informații structurate. Motorul determinist de diagnostic evaluează apoi simptomele, codurile DTC, răspunsurile adaptive și contextul vehiculului pe baza bazei de cunoștințe.",

      architectureTitle:
        "Pe scurt",

      architecture:
        "Descrierea ta → extragere de dovezi cu AI → motor determinist de diagnostic → bază de cunoștințe → cauze ordonate → explicații → următorii pași de diagnostic.",

      betterDataTitle:
        "Cum obții rezultate mai bune",

      betterData1:
        "Descrie când apare problema: la rece, la ralanti, la accelerație, la frânare, pe autostradă, pe denivelări, pe ploaie etc.",

      betterData2:
        "Menționează martorii aprinși, zgomotele, mirosurile, fumul, vibrațiile, pierderile de lichid și schimbările de performanță.",

      betterData3:
        "Introdu codurile DTC exact așa cum apar pe tester.",

      betterData4:
        "Adaugă reparațiile anterioare sau problemele recurente relevante, dar diferențiază clar problemele vechi de simptomele actuale.",

      betterData5:
        "Dacă nu cunoști o informație, las-o necunoscută în loc să ghicești.",

      safetyTitle:
        "Siguranță",

      safetyText:
        "Dacă vehiculul are probleme de frânare, probleme de direcție, supraîncălzire severă, fum, miros puternic de combustibil, pierdere rapidă de lichid sau orice altă situație care poate fi nesigură, oprește vehiculul în siguranță și solicită ajutor specializat.",

      back:
        "Înapoi la început",

      start:
        "Începe diagnoza",
    },
  };

  const text =
    content[language];

  const sectionClass =
    "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6";

  const cardClass =
    "rounded-xl border border-zinc-800 bg-zinc-950/60 p-5";

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">

      <div className="mx-auto w-full max-w-4xl">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          {text.eyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          {text.title}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
          {text.intro}
        </p>

        <div className="mt-8 rounded-2xl border border-amber-900 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-200">
            {text.important}
          </p>
        </div>


        {/* DIAGNOSTIC WORKFLOW */}

        <section className={`mt-10 ${sectionClass}`}>

          <h2 className="text-2xl font-bold">
            {text.workflowTitle}
          </h2>

          <div className="mt-6 space-y-4">

            <div className={cardClass}>
              <h3 className="font-semibold">
                {text.step1Title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {text.step1Text}
              </p>
            </div>

            <div className={cardClass}>
              <h3 className="font-semibold">
                {text.step2Title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {text.step2Text}
              </p>
            </div>

            <div className={cardClass}>
              <h3 className="font-semibold">
                {text.step3Title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {text.step3Text}
              </p>

              <div className="mt-4 space-y-2">
                <p className="rounded-lg border border-emerald-900 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-200">
                  {text.goodExample}
                </p>

                <p className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
                  {text.badExample}
                </p>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="font-semibold">
                {text.step4Title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {text.step4Text}
              </p>
            </div>

            <div className={cardClass}>
              <h3 className="font-semibold">
                {text.step5Title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {text.step5Text}
              </p>
            </div>

            <div className={cardClass}>
              <h3 className="font-semibold">
                {text.step6Title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {text.step6Text}
              </p>
            </div>

          </div>

        </section>


        {/* RESULT INTERPRETATION */}

        <section className={`mt-8 ${sectionClass}`}>

          <h2 className="text-2xl font-bold">
            {text.interpretationTitle}
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <div className={cardClass}>
              <h3 className="font-semibold">
                {text.scoreTitle}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {text.scoreText}
              </p>
            </div>

            <div className={cardClass}>
              <h3 className="font-semibold">
                {text.evidenceTitle}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {text.evidenceText}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <p className="text-zinc-400">
                  {text.limited}
                </p>
                <p className="text-zinc-400">
                  {text.moderate}
                </p>
                <p className="text-zinc-400">
                  {text.strong}
                </p>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="font-semibold">
                {text.severityTitle}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {text.severityText}
              </p>
            </div>

            <div className={cardClass}>
              <h3 className="font-semibold">
                {text.urgencyTitle}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {text.urgencyText}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <p className="text-emerald-300">
                  {text.monitor}
                </p>
                <p className="text-amber-300">
                  {text.serviceSoon}
                </p>
                <p className="text-red-300">
                  {text.stopDriving}
                </p>
              </div>
            </div>

          </div>

        </section>


        {/* NEXT STEPS + DATA WARNINGS */}

        <section className={`mt-8 ${sectionClass}`}>

          <div className="grid gap-4 md:grid-cols-2">

            <div className={cardClass}>
              <h2 className="text-xl font-bold">
                {text.nextStepsTitle}
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {text.nextStepsText}
              </p>
            </div>

            <div className={cardClass}>
              <h2 className="text-xl font-bold">
                {text.referencesTitle}
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {text.referencesText}
              </p>
            </div>

            <div className={cardClass}>
              <h2 className="text-xl font-bold">
                {text.warningsTitle}
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {text.warningsText}
              </p>
            </div>

          </div>

        </section>


        {/* AI EXPLANATION */}

        <section className={`mt-8 ${sectionClass}`}>

          <h2 className="text-2xl font-bold">
            {text.aiTitle}
          </h2>

          <p className="mt-4 leading-7 text-zinc-400">
            {text.aiText}
          </p>

          <div className="mt-5 rounded-xl border border-violet-900 bg-violet-950/20 p-5">

            <p className="text-sm font-semibold text-violet-300">
              {text.architectureTitle}
            </p>

            <p className="mt-3 text-sm leading-6 text-violet-100/80">
              {text.architecture}
            </p>

          </div>

        </section>


        {/* BETTER DATA */}

        <section className={`mt-8 ${sectionClass}`}>

          <h2 className="text-2xl font-bold">
            {text.betterDataTitle}
          </h2>

          <ul className="mt-5 space-y-3 text-sm leading-6 text-zinc-400">
            <li>• {text.betterData1}</li>
            <li>• {text.betterData2}</li>
            <li>• {text.betterData3}</li>
            <li>• {text.betterData4}</li>
            <li>• {text.betterData5}</li>
          </ul>

        </section>


        {/* SAFETY */}

        <section className="mt-8 rounded-2xl border border-red-900 bg-red-950/20 p-6">

          <h2 className="text-2xl font-bold text-red-200">
            {text.safetyTitle}
          </h2>

          <p className="mt-4 leading-7 text-red-100/80">
            {text.safetyText}
          </p>

        </section>


        {/* ACTIONS */}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() =>
              router.push("/welcome")
            }
            className="rounded-xl border border-zinc-700 px-6 py-3 font-semibold text-white transition hover:bg-zinc-900"
          >
            {text.back}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/diagnosis/vehicle"
              )
            }
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            {text.start}
          </button>

        </div>

      </div>

    </main>
  );
}