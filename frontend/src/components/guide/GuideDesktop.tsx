"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Modal from "@/components/ui/Modal";

type Language = "ro" | "en";

type ResultConceptId =
  | "relevance"
  | "severity"
  | "urgency"
  | "evidence"
  | "sources";

type ResultConcept = {
  id: ResultConceptId;
  code: string;
  title: Record<Language, string>;
  short: Record<Language, string>;
  explanation: Record<Language, string>;
  examples: Record<Language, string[]>;
};

type GuideTopic = {
  id: string;
  code: string;
  accent: "blue" | "cyan" | "amber" | "red";
  title: Record<Language, string>;
  short: Record<Language, string>;
  bullets: Record<Language, string[]>;
  details: Record<Language, string[]>;
};

const resultConcepts: ResultConcept[] = [
  {
    id: "relevance",
    code: "78/100",
    title: {
      ro: "Scor de relevanță",
      en: "Relevance score",
    },
    short: {
      ro: "Arată cât de bine se potrivește o ipoteză cu datele disponibile.",
      en: "Shows how well a hypothesis matches the available case data.",
    },
    explanation: {
      ro: "Scorul de relevanță compară semnalele din caz cu regulile motorului de diagnostic. Un scor mare înseamnă că ipoteza este bine susținută de datele introduse. Nu este o probabilitate statistică și nu confirmă singur o piesă defectă.",
      en: "The relevance score compares case signals with the diagnostic engine rules. A high score means the hypothesis is strongly supported by the entered data. It is not a statistical probability and does not confirm a failed component by itself.",
    },
    examples: {
      ro: [
        "Scor mare + dovezi puternice = ipoteză bine susținută.",
        "Scor mare + dovezi limitate = rezultat care merită verificat, dar cu mai multă prudență.",
      ],
      en: [
        "High score + strong evidence = well-supported hypothesis.",
        "High score + limited evidence = worth checking, but with more caution.",
      ],
    },
  },
  {
    id: "severity",
    code: "SEV",
    title: {
      ro: "Severitate",
      en: "Severity",
    },
    short: {
      ro: "Descrie impactul potențial al problemei dacă ipoteza este corectă.",
      en: "Describes the potential impact if the hypothesis is correct.",
    },
    explanation: {
      ro: "Severitatea nu spune cât de sigur este diagnosticul. Ea descrie cât de importantă poate fi problema pentru funcționarea, fiabilitatea sau siguranța vehiculului.",
      en: "Severity does not tell you how certain the diagnosis is. It describes how important the issue may be for vehicle operation, reliability or safety.",
    },
    examples: {
      ro: [
        "Scăzută: efect redus, de regulă fără risc imediat.",
        "Medie: poate afecta funcționarea și merită verificată.",
        "Ridicată: poate implica risc, avarie progresivă sau funcționare nesigură.",
      ],
      en: [
        "Low: limited effect, usually without immediate risk.",
        "Medium: may affect operation and should be checked.",
        "High: may involve risk, progressive damage or unsafe operation.",
      ],
    },
  },
  {
    id: "urgency",
    code: "ACT",
    title: {
      ro: "Urgență",
      en: "Urgency",
    },
    short: {
      ro: "Îți spune cât de repede ar trebui să acționezi.",
      en: "Tells you how quickly action should be taken.",
    },
    explanation: {
      ro: "Urgența transformă rezultatul într-o recomandare de acțiune. Poate indica monitorizare, verificare în curând sau oprirea deplasării dacă există risc de siguranță.",
      en: "Urgency turns the result into an action recommendation. It may indicate monitoring, service soon or stopping the vehicle when a safety risk is present.",
    },
    examples: {
      ro: [
        "Monitorizează: urmărește evoluția și confirmă dacă simptomul persistă.",
        "Verificare recomandată: programează o verificare tehnică în curând.",
        "Oprește deplasarea: nu continua dacă există risc evident pentru siguranță sau avarie gravă.",
      ],
      en: [
        "Monitor: watch the behavior and confirm whether the symptom persists.",
        "Service soon: arrange a technical check in the near term.",
        "Stop driving: do not continue when there is an obvious safety or major-damage risk.",
      ],
    },
  },
  {
    id: "evidence",
    code: "EV",
    title: {
      ro: "Puterea dovezilor",
      en: "Evidence strength",
    },
    short: {
      ro: "Arată cât de solid este susținut rezultatul de semnale independente.",
      en: "Shows how solidly the result is supported by independent signals.",
    },
    explanation: {
      ro: "Puterea dovezilor ține cont de varietatea semnalelor care indică aceeași direcție: simptome, DTC, răspunsuri adaptive și contextul vehiculului. Nu este același lucru cu severitatea.",
      en: "Evidence strength considers the variety of signals pointing in the same direction: symptoms, DTCs, adaptive answers and vehicle context. It is not the same as severity.",
    },
    examples: {
      ro: [
        "Limitată: puține semnale independente.",
        "Moderată: mai multe indicii se susțin reciproc.",
        "Puternică: mai multe tipuri de dovezi converg către aceeași ipoteză.",
      ],
      en: [
        "Limited: few independent signals.",
        "Moderate: several clues support each other.",
        "Strong: multiple evidence types converge on the same hypothesis.",
      ],
    },
  },
  {
    id: "sources",
    code: "SRC",
    title: {
      ro: "Surse de dovezi",
      en: "Evidence sources",
    },
    short: {
      ro: "Numărul de tipuri de informații care au contribuit la rezultat.",
      en: "The number of information types that contributed to the result.",
    },
    explanation: {
      ro: "Sursele de dovezi pot include simptomul raportat, codurile DTC, răspunsurile adaptive și contextul vehiculului. Mai multe surse independente fac rezultatul mai ușor de justificat.",
      en: "Evidence sources can include reported symptoms, DTC codes, adaptive answers and vehicle context. More independent sources make the result easier to justify.",
    },
    examples: {
      ro: [
        "Simptom + DTC + răspuns adaptiv = trei surse diferite.",
        "Mai multe coduri DTC din aceeași familie nu înseamnă neapărat mai multe surse independente.",
      ],
      en: [
        "Symptom + DTC + adaptive answer = three different source types.",
        "Several DTCs from the same family do not necessarily mean several independent sources.",
      ],
    },
  },
];

const topics: GuideTopic[] = [
  {
    id: "warning-lights",
    code: "MIL",
    accent: "amber",
    title: { ro: "Martori în bord", en: "Dashboard warning lights" },
    short: {
      ro: "Ce înseamnă un martor aprins și când devine urgent.",
      en: "What a warning light means and when it becomes urgent.",
    },
    bullets: {
      ro: [
        "Notează martorul exact și dacă este aprins continuu sau clipește.",
        "Un martor roșu trebuie tratat cu prioritate.",
        "Martorul motor nu identifică singur piesa defectă.",
      ],
      en: [
        "Record the exact warning light and whether it is steady or flashing.",
        "A red warning light should be treated as a priority.",
        "The engine light alone does not identify the failed component.",
      ],
    },
    details: {
      ro: [
        "Fă o fotografie a bordului dacă nu recunoști simbolul.",
        "Notează momentul apariției: pornire, accelerație, frânare sau mers constant.",
        "Dacă martorul clipește și motorul funcționează anormal, evită solicitarea intensă până la verificare.",
      ],
      en: [
        "Take a photo if you do not recognize the symbol.",
        "Record when it appeared: startup, acceleration, braking or steady driving.",
        "If it is flashing and the engine runs abnormally, avoid heavy load until checked.",
      ],
    },
  },
  {
    id: "dtc",
    code: "DTC",
    accent: "cyan",
    title: { ro: "Coduri OBD-II / DTC", en: "OBD-II / DTC codes" },
    short: {
      ro: "Cum folosești un cod fără să îl confunzi cu diagnosticul final.",
      en: "How to use a code without treating it as the final diagnosis.",
    },
    bullets: {
      ro: [
        "Introdu codul exact, de exemplu P0299.",
        "Un DTC indică o condiție detectată, nu neapărat piesa defectă.",
        "Mai multe coduri pot avea aceeași cauză.",
      ],
      en: [
        "Enter the exact code, for example P0299.",
        "A DTC identifies a detected condition, not necessarily the failed part.",
        "Multiple codes can share the same root cause.",
      ],
    },
    details: {
      ro: [
        "Nu șterge codurile înainte să le salvezi.",
        "Dacă ai freeze-frame, păstrează turația, viteza, temperatura și sarcina motorului.",
        "Corelează întotdeauna codul cu simptomele și verificările reale.",
      ],
      en: [
        "Do not clear codes before saving them.",
        "If freeze-frame data is available, keep RPM, speed, temperature and engine-load values.",
        "Always correlate the code with symptoms and real checks.",
      ],
    },
  },
  {
    id: "symptoms",
    code: "OBS",
    accent: "blue",
    title: { ro: "Descrierea simptomului", en: "Describing the symptom" },
    short: {
      ro: "O descriere bună separă rapid două cauze asemănătoare.",
      en: "A good description helps separate similar possible causes.",
    },
    bullets: {
      ro: [
        "Spune ce face mașina, nu ce crezi că este stricat.",
        "Menționează când apare și cât de des.",
        "Compară comportamentul actual cu cel normal.",
      ],
      en: [
        "Describe what the vehicle does, not what you think is broken.",
        "Mention when it happens and how often.",
        "Compare current behavior with the vehicle's normal behavior.",
      ],
    },
    details: {
      ro: [
        "Exemplu bun: „pierde putere la accelerație peste 2500 rpm”.",
        "Spune dacă problema a apărut brusc sau treptat.",
        "Menționează reparații recente, alimentări sau modificări.",
      ],
      en: [
        "Good example: “loses power under acceleration above 2500 rpm.”",
        "Mention whether the problem appeared suddenly or gradually.",
        "Include recent repairs, refueling or modifications.",
      ],
    },
  },
  {
    id: "noise",
    code: "NVH",
    accent: "blue",
    title: { ro: "Zgomote și vibrații", en: "Noise and vibration" },
    short: {
      ro: "Locul, ritmul și condiția în care apar sunt cele mai utile indicii.",
      en: "Location, rhythm and operating condition are the most useful clues.",
    },
    bullets: {
      ro: [
        "Observă dacă zgomotul urmărește turația motorului sau viteza mașinii.",
        "Notează dacă apare la virare, frânare, accelerație sau ralanti.",
        "Nu încerca să reproduci un zgomot în condiții nesigure.",
      ],
      en: [
        "Observe whether the noise follows engine RPM or vehicle speed.",
        "Note whether it appears while turning, braking, accelerating or idling.",
        "Do not reproduce a noise under unsafe conditions.",
      ],
    },
    details: {
      ro: [
        "Un zgomot dependent de viteză poate indica altă zonă decât unul dependent de turație.",
        "Vibrațiile pot proveni din roți, transmisie, motor sau suporturi.",
        "Înregistrează audio/video doar în siguranță.",
      ],
      en: [
        "A speed-dependent noise may point to a different area than one tied to RPM.",
        "Vibration can originate from wheels, drivetrain, engine or mounts.",
        "Record audio/video only when safe.",
      ],
    },
  },
  {
    id: "temperature",
    code: "TMP",
    accent: "amber",
    title: { ro: "Temperatură și lichide", en: "Temperature and fluids" },
    short: {
      ro: "Supraîncălzirea și pierderile de lichid trebuie tratate cu prioritate.",
      en: "Overheating and fluid loss should be treated as priority conditions.",
    },
    bullets: {
      ro: [
        "Nu deschide capacul sistemului de răcire când motorul este fierbinte.",
        "Notează dacă temperatura crește în trafic, la viteză sau sub sarcină.",
        "Observă culoarea și zona unei eventuale scurgeri.",
      ],
      en: [
        "Do not open the cooling-system cap while the engine is hot.",
        "Record whether temperature rises in traffic, at speed or under load.",
        "Observe the color and location of any leak.",
      ],
    },
    details: {
      ro: [
        "Aburul, mirosul puternic sau temperatura foarte ridicată justifică oprirea și verificarea.",
        "Pierderile de ulei, lichid de răcire și lichid de frână au niveluri diferite de risc.",
        "Fotografiile pot documenta cazul fără să presupui cauza.",
      ],
      en: [
        "Steam, strong odor or very high temperature justify stopping and checking.",
        "Oil, coolant and brake-fluid leaks carry different risk levels.",
        "Photos can document the case without assuming the cause.",
      ],
    },
  },
  {
    id: "electrical",
    code: "12V",
    accent: "cyan",
    title: { ro: "Baterie și sistem electric", en: "Battery and electrical system" },
    short: {
      ro: "Tensiunea scăzută poate genera simptome aparent fără legătură.",
      en: "Low voltage can create symptoms that appear unrelated.",
    },
    bullets: {
      ro: [
        "Pornirea lentă și resetările pot indica alimentare electrică slabă.",
        "Mai multe erori simultane pot apărea la tensiune instabilă.",
        "Verificarea tensiunii este adesea un prim pas util.",
      ],
      en: [
        "Slow cranking and resets can indicate weak electrical supply.",
        "Several simultaneous faults can appear with unstable voltage.",
        "Voltage checking is often a useful first step.",
      ],
    },
    details: {
      ro: [
        "Conexiunile slăbite sau oxidate pot imita o baterie defectă.",
        "Bateria, alternatorul și masele trebuie privite ca un sistem.",
        "Nu scurtcircuita bornele și nu lucra fără măsuri de siguranță.",
      ],
      en: [
        "Loose or corroded connections can imitate a failed battery.",
        "Battery, alternator and grounds should be considered as one system.",
        "Do not short terminals or work without proper safety measures.",
      ],
    },
  },
  {
    id: "safety",
    code: "SAFE",
    accent: "red",
    title: { ro: "Când să nu mai conduci", en: "When not to keep driving" },
    short: {
      ro: "Unele simptome nu merită testate prin continuarea deplasării.",
      en: "Some symptoms should not be tested by continuing to drive.",
    },
    bullets: {
      ro: [
        "Probleme de frânare sau direcție.",
        "Supraîncălzire severă, fum dens sau scurgeri importante.",
        "Zgomote mecanice puternice ori pierdere bruscă majoră de putere.",
      ],
      en: [
        "Braking or steering problems.",
        "Severe overheating, heavy smoke or major fluid loss.",
        "Loud mechanical noise or sudden major loss of power.",
      ],
    },
    details: {
      ro: [
        "Siguranța ocupanților și a celorlalți participanți la trafic are prioritate.",
        "Dacă nu poți evalua riscul, oprește în siguranță și solicită ajutor tehnic.",
        "AutoDiagnose AI oferă suport orientativ și nu înlocuiește o inspecție fizică.",
      ],
      en: [
        "Occupant and road-user safety takes priority.",
        "If you cannot assess the risk, stop safely and request technical assistance.",
        "AutoDiagnose AI provides decision support and does not replace physical inspection.",
      ],
    },
  },
];

const accents = {
  blue: "border-blue-400/15 bg-blue-500/[0.04] text-blue-100",
  cyan: "border-cyan-300/15 bg-cyan-300/[0.04] text-cyan-100",
  amber: "border-amber-400/15 bg-amber-400/[0.04] text-amber-100",
  red: "border-red-400/15 bg-red-400/[0.04] text-red-100",
};

export default function DiagnosticGuidePage() {
  const router = useRouter();

  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language");
      if (saved === "ro" || saved === "en") {
        return saved;
      }
    }
    return "en";
  });

  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<GuideTopic | null>(null);
  const [selectedResultConcept, setSelectedResultConcept] =
    useState<ResultConcept | null>(null);

  const text = {
    en: {
      eyebrow: "DIAGNOSTIC GUIDE",
      title: "Understand the signal before chasing the fault.",
      description:
        "A practical guide for collecting better diagnostic information without turning every symptom into a guess.",
      start: "Start a diagnosis",
      flowTitle: "A good diagnostic flow",
      search: "Search the guide",
      searchPlaceholder: "Search DTC, warning light, vibration...",
      quickReference: "Quick reference",
      referenceDescription:
        "Open only the section you need. The important points stay visible; details are kept in a popup.",
      noResults: "No guide section matches your search.",
      open: "Open guide",
      resultGuide: "How to read the result",
      resultGuideTitle: "What do score, severity and evidence actually mean?",
      resultGuideDescription:
        "The result is easier to understand when each indicator is read separately. Tap a card for the exact meaning.",
      resultExample: "Example result",
      primaryHypothesis: "Primary hypothesis",
      severityMedium: "Severity: Medium",
      urgencySoon: "Service soon",
      evidenceStrong: "Evidence: Strong",
      learnIndicator: "Understand indicator",
      safetyTitle: "Safety first",
      safetyText:
        "Do not continue driving just to reproduce a symptom when braking, steering, severe overheating, heavy smoke or major mechanical noise is involved.",
      principleTitle: "One rule worth remembering",
      principle: "Describe the behavior first. Diagnose the component second.",
      principleText:
        "“Loses power during acceleration” is useful evidence. “The turbo is broken” is already a conclusion.",
      keyPoints: "What to look for",
      more: "More detail",
      close: "Close",
    },
    ro: {
      eyebrow: "GHID DIAGNOSTIC",
      title: "Înțelege semnalul înainte să cauți defecțiunea.",
      description:
        "Un ghid practic pentru colectarea unor informații mai bune, fără să transformi fiecare simptom într-o presupunere.",
      start: "Începe un diagnostic",
      flowTitle: "Un flux bun de diagnostic",
      search: "Caută în ghid",
      searchPlaceholder: "Caută DTC, martor, vibrație...",
      quickReference: "Referință rapidă",
      referenceDescription:
        "Deschizi doar secțiunea de care ai nevoie. Ideile importante rămân la vedere, iar detaliile stau într-un popup.",
      noResults: "Nicio secțiune nu corespunde căutării.",
      open: "Deschide ghidul",
      resultGuide: "Cum citești rezultatul",
      resultGuideTitle: "Ce înseamnă scorul, severitatea și dovezile?",
      resultGuideDescription:
        "Rezultatul este mai ușor de înțeles dacă citești separat fiecare indicator. Apasă pe un card pentru explicația exactă.",
      resultExample: "Exemplu de rezultat",
      primaryHypothesis: "Ipoteză principală",
      severityMedium: "Severitate: Medie",
      urgencySoon: "Verificare recomandată",
      evidenceStrong: "Dovezi: Puternică",
      learnIndicator: "Înțelege indicatorul",
      safetyTitle: "Siguranța înainte de toate",
      safetyText:
        "Nu continua deplasarea doar pentru a reproduce un simptom dacă sunt implicate frânarea, direcția, supraîncălzirea severă, fumul dens sau zgomotele mecanice puternice.",
      principleTitle: "O regulă importantă",
      principle: "Descrie mai întâi comportamentul. Diagnostichează piesa după aceea.",
      principleText:
        "„Pierde putere la accelerație” este o informație utilă. „Turbina este stricată” este deja o concluzie.",
      keyPoints: "La ce să fii atent",
      more: "Mai multe detalii",
      close: "Închide",
    },
  }[language];

  const flow = language === "ro"
    ? [
        ["01", "Observă", "Ce face exact vehiculul?"],
        ["02", "Notează", "Când apare și cât de des?"],
        ["03", "Scanează", "Păstrează codurile DTC disponibile."],
        ["04", "Corelează", "Compară simptomele, codurile și contextul."],
        ["05", "Verifică", "Confirmă cauza prin verificări reale."],
      ]
    : [
        ["01", "Observe", "What exactly is the vehicle doing?"],
        ["02", "Record", "When does it happen and how often?"],
        ["03", "Scan", "Keep available DTC codes."],
        ["04", "Compare", "Correlate symptoms, codes and context."],
        ["05", "Verify", "Confirm the cause with real checks."],
      ];

  const filteredTopics = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) {
      return topics;
    }

    return topics.filter((topic) =>
      [
        topic.code,
        topic.title[language],
        topic.short[language],
        ...topic.bullets[language],
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [query, language]);

  function changeLanguage(next: Language) {
    setLanguage(next);
    localStorage.setItem("language", next);
  }

  return (
    <main className="min-h-screen bg-[#060912] text-white">
      <div className="ad-page">
        <section className="ad-surface relative overflow-hidden rounded-[30px] p-7 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/[0.09] blur-[95px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-cyan-300/[0.04] blur-[80px]" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.05] px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.65)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100/80">
                  {text.eyebrow}
                </span>
              </div>

              <h1 className="mt-6 max-w-3xl text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[2.8rem]">
                {text.title}
              </h1>

              <p className="mt-4 max-w-2xl text-[16px] leading-7 text-zinc-300">
                {text.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/diagnosis/vehicle")}
                  className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(37,99,235,0.20)] transition hover:bg-blue-400"
                >
                  {text.start} →
                </button>

                <div className="inline-flex rounded-xl border border-white/[0.07] bg-white/[0.02] p-1">
                  {(["ro", "en"] as Language[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => changeLanguage(item)}
                      className={`rounded-lg px-3 py-2 text-[12px] font-semibold transition ${
                        language === item
                          ? "bg-white/[0.08] text-white"
                          : "text-zinc-500 hover:text-zinc-200"
                      }`}
                    >
                      {item.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-cyan-300/12 bg-cyan-300/[0.025] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-100/70">
                {text.principleTitle}
              </p>
              <p className="mt-3 text-[17px] font-semibold leading-6 text-white">
                {text.principle}
              </p>
              <p className="mt-3 text-[14px] leading-6 text-zinc-400">
                {text.principleText}
              </p>
            </div>
          </div>
        </section>

        <section className="ad-surface mt-7 rounded-[28px] p-6 sm:p-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-blue-100/70">
            {text.flowTitle}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {flow.map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-[20px] border border-white/[0.055] bg-white/[0.014] p-4"
              >
                <span className="text-[12px] font-semibold text-blue-200">
                  {number}
                </span>
                <h2 className="mt-3 text-[16px] font-semibold text-white">
                  {title}
                </h2>
                <p className="mt-2 text-[13px] leading-6 text-zinc-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="ad-surface mt-7 rounded-[28px] p-6 sm:p-7">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-blue-100/70">
                {text.resultGuide}
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                {text.resultGuideTitle}
              </h2>

              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-zinc-300">
                {text.resultGuideDescription}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {resultConcepts.map((concept) => (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => setSelectedResultConcept(concept)}
                    className="group rounded-[20px] border border-white/[0.06] bg-white/[0.014] p-4 text-left transition hover:border-blue-400/15 hover:bg-blue-500/[0.025]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-lg border border-blue-400/15 bg-blue-500/[0.05] px-2.5 py-1.5 text-[11px] font-bold tracking-[0.06em] text-blue-100">
                        {concept.code}
                      </span>

                      <span className="text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-300">
                        →
                      </span>
                    </div>

                    <h3 className="mt-4 text-[16px] font-semibold text-white">
                      {concept.title[language]}
                    </h3>

                    <p className="mt-2 text-[13px] leading-6 text-zinc-400">
                      {concept.short[language]}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-blue-400/12 bg-[#080f1d] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-100/65">
                {text.resultExample}
              </p>

              <div className="mt-4 rounded-[20px] border border-white/[0.055] bg-black/15 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  {text.primaryHypothesis}
                </p>

                <p className="mt-2 text-[17px] font-semibold text-white">
                  {language === "ro"
                    ? "Presiune de supraalimentare insuficientă"
                    : "Boost pressure underperformance"}
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[6px] border-blue-400/70 bg-blue-500/[0.04]">
                    <div className="text-center">
                      <p className="text-[22px] font-semibold text-white">78</p>
                      <p className="text-[10px] text-zinc-400">/100</p>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="rounded-lg border border-amber-400/15 bg-amber-400/[0.045] px-3 py-2 text-[12px] font-semibold text-amber-100">
                      {text.severityMedium}
                    </div>

                    <div className="rounded-lg border border-amber-400/15 bg-amber-400/[0.045] px-3 py-2 text-[12px] font-semibold text-amber-100">
                      {text.urgencySoon}
                    </div>

                    <div className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.045] px-3 py-2 text-[12px] font-semibold text-emerald-100">
                      {text.evidenceStrong}
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-6 text-zinc-400">
                {language === "ro"
                  ? "Scorul spune cât de bine se potrivește ipoteza. Severitatea spune cât de importantă poate fi problema. Urgența spune cât de repede trebuie să acționezi. Dovezile spun cât de solid este susținut rezultatul."
                  : "The score shows how well the hypothesis fits. Severity describes potential impact. Urgency tells you how quickly to act. Evidence strength shows how solidly the result is supported."}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-7 rounded-[24px] border border-red-400/15 bg-red-400/[0.045] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-300/15 bg-red-300/[0.06] text-sm font-bold text-red-100">
              !
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-red-100">
                {text.safetyTitle}
              </h2>
              <p className="mt-2 max-w-4xl text-[14px] leading-6 text-red-100/80">
                {text.safetyText}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-blue-100/70">
                {text.quickReference}
              </p>
              <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-[-0.03em] text-white">
                {text.referenceDescription}
              </h2>
            </div>

            <div className="w-full max-w-md">
              <label
                htmlFor="guide-search"
                className="mb-2 block text-[13px] font-medium text-zinc-300"
              >
                {text.search}
              </label>
              <input
                id="guide-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={text.searchPlaceholder}
                className="min-h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 text-[14px] text-white outline-none transition focus:border-blue-400/25 placeholder:text-zinc-600"
              />
            </div>
          </div>

          {filteredTopics.length > 0 ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className="group rounded-[24px] border border-white/[0.06] bg-white/[0.012] p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.11] hover:bg-white/[0.025]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-2 text-[10px] font-bold tracking-[0.08em] ${
                        accents[topic.accent]
                      }`}
                    >
                      {topic.code}
                    </span>
                    <span className="text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-300">
                      →
                    </span>
                  </div>

                  <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.02em] text-white">
                    {topic.title[language]}
                  </h3>

                  <p className="mt-2 text-[14px] leading-6 text-zinc-400">
                    {topic.short[language]}
                  </p>

                  <div className="mt-4 space-y-2">
                    {topic.bullets[language].slice(0, 2).map((item, index) => (
                      <div key={index} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300/70" />
                        <p className="text-[13px] leading-5 text-zinc-300">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-[12px] font-semibold text-blue-200">
                    {text.open}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[24px] border border-white/[0.055] bg-white/[0.012] p-7 text-[14px] text-zinc-400">
              {text.noResults}
            </div>
          )}
        </section>
      </div>

      <Modal
        open={selectedResultConcept !== null}
        onClose={() => setSelectedResultConcept(null)}
        eyebrow={text.resultGuide}
        title={selectedResultConcept?.title[language] ?? ""}
        description={selectedResultConcept?.short[language] ?? ""}
      >
        {selectedResultConcept && (
          <div>
            <div className="rounded-2xl border border-blue-400/12 bg-blue-500/[0.035] p-4">
              <p className="text-[14px] leading-7 text-zinc-200">
                {selectedResultConcept.explanation[language]}
              </p>
            </div>

            <div className="mt-4 space-y-2.5">
              {selectedResultConcept.examples[language].map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-white/[0.055] bg-white/[0.018] px-4 py-3.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-400/15 bg-blue-500/[0.05] text-[12px] font-semibold text-blue-100">
                    {index + 1}
                  </span>

                  <p className="pt-0.5 text-[14px] leading-6 text-zinc-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedResultConcept(null)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-[13px] font-semibold text-zinc-200 transition hover:bg-white/[0.05]"
              >
                {text.close}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={selectedTopic !== null}
        onClose={() => setSelectedTopic(null)}
        eyebrow={selectedTopic?.code ?? text.eyebrow}
        title={selectedTopic?.title[language] ?? ""}
        description={selectedTopic?.short[language] ?? ""}
      >
        {selectedTopic && (
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blue-100/70">
              {text.keyPoints}
            </p>

            <div className="mt-3 space-y-2.5">
              {selectedTopic.bullets[language].map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-white/[0.055] bg-white/[0.018] px-4 py-3.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-400/15 bg-blue-500/[0.05] text-[12px] font-semibold text-blue-100">
                    {index + 1}
                  </span>
                  <p className="pt-0.5 text-[14px] leading-6 text-zinc-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              {text.more}
            </p>

            <div className="mt-3 space-y-2">
              {selectedTopic.details[language].map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 border-b border-white/[0.05] py-3 last:border-b-0"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                  <p className="text-[14px] leading-6 text-zinc-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-[13px] font-semibold text-zinc-200 transition hover:bg-white/[0.05]"
              >
                {text.close}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
