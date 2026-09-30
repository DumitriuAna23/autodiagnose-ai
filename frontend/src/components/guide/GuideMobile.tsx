"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Modal from "@/components/ui/Modal";


type Language =
  | "ro"
  | "en";


type ResultConceptId =
  | "relevance"
  | "severity"
  | "urgency"
  | "evidence"
  | "sources";


type ResultConcept = {
  id: ResultConceptId;

  code: string;

  title:
    Record<
      Language,
      string
    >;

  short:
    Record<
      Language,
      string
    >;

  explanation:
    Record<
      Language,
      string
    >;

  examples:
    Record<
      Language,
      string[]
    >;
};


type GuideTopic = {
  id: string;

  code: string;

  accent:
    | "blue"
    | "cyan"
    | "amber"
    | "red";

  title:
    Record<
      Language,
      string
    >;

  short:
    Record<
      Language,
      string
    >;

  bullets:
    Record<
      Language,
      string[]
    >;

  details:
    Record<
      Language,
      string[]
    >;
};


const resultConcepts:
  ResultConcept[] = [
  {
    id:
      "relevance",

    code:
      "78/100",

    title: {
      ro:
        "Scor de relevanță",

      en:
        "Relevance score",
    },

    short: {
      ro:
        "Arată cât de bine se potrivește o ipoteză cu datele disponibile.",

      en:
        "Shows how well a hypothesis matches the available case data.",
    },

    explanation: {
      ro:
        "Scorul de relevanță compară semnalele din caz cu regulile motorului de diagnostic. Un scor mare înseamnă că ipoteza este bine susținută de datele introduse. Nu este o probabilitate statistică și nu confirmă singur o piesă defectă.",

      en:
        "The relevance score compares case signals with the diagnostic engine rules. A high score means the hypothesis is strongly supported by the entered data. It is not a statistical probability and does not confirm a failed component by itself.",
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
    id:
      "severity",

    code:
      "SEV",

    title: {
      ro:
        "Severitate",

      en:
        "Severity",
    },

    short: {
      ro:
        "Descrie impactul potențial al problemei dacă ipoteza este corectă.",

      en:
        "Describes the potential impact if the hypothesis is correct.",
    },

    explanation: {
      ro:
        "Severitatea nu spune cât de sigur este diagnosticul. Ea descrie cât de importantă poate fi problema pentru funcționarea, fiabilitatea sau siguranța vehiculului.",

      en:
        "Severity does not tell you how certain the diagnosis is. It describes how important the issue may be for vehicle operation, reliability or safety.",
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
    id:
      "urgency",

    code:
      "ACT",

    title: {
      ro:
        "Urgență",

      en:
        "Urgency",
    },

    short: {
      ro:
        "Îți spune cât de repede ar trebui să acționezi.",

      en:
        "Tells you how quickly action should be taken.",
    },

    explanation: {
      ro:
        "Urgența transformă rezultatul într-o recomandare de acțiune. Poate indica monitorizare, verificare în curând sau oprirea deplasării dacă există risc de siguranță.",

      en:
        "Urgency turns the result into an action recommendation. It may indicate monitoring, service soon or stopping the vehicle when a safety risk is present.",
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
    id:
      "evidence",

    code:
      "EV",

    title: {
      ro:
        "Puterea dovezilor",

      en:
        "Evidence strength",
    },

    short: {
      ro:
        "Arată cât de solid este susținut rezultatul de semnale independente.",

      en:
        "Shows how solidly the result is supported by independent signals.",
    },

    explanation: {
      ro:
        "Puterea dovezilor ține cont de varietatea semnalelor care indică aceeași direcție: simptome, DTC, răspunsuri adaptive și contextul vehiculului. Nu este același lucru cu severitatea.",

      en:
        "Evidence strength considers the variety of signals pointing in the same direction: symptoms, DTCs, adaptive answers and vehicle context. It is not the same as severity.",
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
    id:
      "sources",

    code:
      "SRC",

    title: {
      ro:
        "Surse de dovezi",

      en:
        "Evidence sources",
    },

    short: {
      ro:
        "Numărul de tipuri de informații care au contribuit la rezultat.",

      en:
        "The number of information types that contributed to the result.",
    },

    explanation: {
      ro:
        "Sursele de dovezi pot include simptomul raportat, codurile DTC, răspunsurile adaptive și contextul vehiculului. Mai multe surse independente fac rezultatul mai ușor de justificat.",

      en:
        "Evidence sources can include reported symptoms, DTC codes, adaptive answers and vehicle context. More independent sources make the result easier to justify.",
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


const topics:
  GuideTopic[] = [
  {
    id:
      "warning-lights",

    code:
      "MIL",

    accent:
      "amber",

    title: {
      ro:
        "Martori în bord",

      en:
        "Dashboard warning lights",
    },

    short: {
      ro:
        "Ce înseamnă un martor aprins și când devine urgent.",

      en:
        "What a warning light means and when it becomes urgent.",
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
    id:
      "dtc",

    code:
      "DTC",

    accent:
      "cyan",

    title: {
      ro:
        "Coduri OBD-II / DTC",

      en:
        "OBD-II / DTC codes",
    },

    short: {
      ro:
        "Cum folosești un cod fără să îl confunzi cu diagnosticul final.",

      en:
        "How to use a code without treating it as the final diagnosis.",
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
    id:
      "symptoms",

    code:
      "OBS",

    accent:
      "blue",

    title: {
      ro:
        "Descrierea simptomului",

      en:
        "Describing the symptom",
    },

    short: {
      ro:
        "O descriere bună separă rapid două cauze asemănătoare.",

      en:
        "A good description helps separate similar possible causes.",
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
    id:
      "noise",

    code:
      "NVH",

    accent:
      "blue",

    title: {
      ro:
        "Zgomote și vibrații",

      en:
        "Noise and vibration",
    },

    short: {
      ro:
        "Locul, ritmul și condiția în care apar sunt cele mai utile indicii.",

      en:
        "Location, rhythm and operating condition are the most useful clues.",
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
    id:
      "temperature",

    code:
      "TMP",

    accent:
      "amber",

    title: {
      ro:
        "Temperatură și lichide",

      en:
        "Temperature and fluids",
    },

    short: {
      ro:
        "Supraîncălzirea și pierderile de lichid trebuie tratate cu prioritate.",

      en:
        "Overheating and fluid loss should be treated as priority conditions.",
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
    id:
      "electrical",

    code:
      "12V",

    accent:
      "cyan",

    title: {
      ro:
        "Baterie și sistem electric",

      en:
        "Battery and electrical system",
    },

    short: {
      ro:
        "Tensiunea scăzută poate genera simptome aparent fără legătură.",

      en:
        "Low voltage can create symptoms that appear unrelated.",
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
    id:
      "safety",

    code:
      "SAFE",

    accent:
      "red",

    title: {
      ro:
        "Când să nu mai conduci",

      en:
        "When not to keep driving",
    },

    short: {
      ro:
        "Unele simptome nu merită testate prin continuarea deplasării.",

      en:
        "Some symptoms should not be tested by continuing to drive.",
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
  blue:
    "border-blue-400/15 bg-blue-500/[0.04] text-blue-100",

  cyan:
    "border-cyan-300/15 bg-cyan-300/[0.04] text-cyan-100",

  amber:
    "border-amber-400/15 bg-amber-400/[0.04] text-amber-100",

  red:
    "border-red-400/15 bg-red-400/[0.04] text-red-100",
};


function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


export default function GuideMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    () => {
      if (
        typeof window !==
        "undefined"
      ) {
        const saved =
          localStorage.getItem(
            "language"
          );


        if (
          saved === "ro" ||
          saved === "en"
        ) {
          return saved;
        }
      }


      return "en";
    }
  );


  const [
    query,
    setQuery,
  ] = useState("");


  const [
    selectedTopic,
    setSelectedTopic,
  ] = useState<
    GuideTopic | null
  >(null);


  const [
    selectedResultConcept,
    setSelectedResultConcept,
  ] = useState<
    ResultConcept | null
  >(null);


  const text = {
    en: {
      eyebrow:
        "DIAGNOSTIC GUIDE",

      title:
        "Understand the signal before chasing the fault.",

      description:
        "A practical guide for collecting better diagnostic information.",

      start:
        "Start diagnosis",

      flowTitle:
        "Diagnostic flow",

      quickReference:
        "Quick reference",

      searchPlaceholder:
        "Search DTC, warning light, vibration...",

      noResults:
        "No guide section matches your search.",

      open:
        "Open",

      resultGuide:
        "Reading the result",

      resultGuideTitle:
        "Score, severity and evidence",

      resultExample:
        "Example",

      primaryHypothesis:
        "Primary hypothesis",

      severityMedium:
        "Severity: Medium",

      urgencySoon:
        "Service soon",

      evidenceStrong:
        "Evidence: Strong",

      safetyTitle:
        "Safety first",

      safetyText:
        "Do not continue driving to reproduce a symptom when braking, steering, severe overheating, heavy smoke or major mechanical noise is involved.",

      principleTitle:
        "Remember",

      principle:
        "Describe the behavior first. Diagnose the component second.",

      keyPoints:
        "What to look for",

      more:
        "More detail",

      close:
        "Close",
    },


    ro: {
      eyebrow:
        "GHID DIAGNOSTIC",

      title:
        "Înțelege semnalul înainte să cauți defecțiunea.",

      description:
        "Un ghid practic pentru colectarea unor informații mai bune.",

      start:
        "Începe diagnosticul",

      flowTitle:
        "Flux de diagnostic",

      quickReference:
        "Referință rapidă",

      searchPlaceholder:
        "Caută DTC, martor, vibrație...",

      noResults:
        "Nicio secțiune nu corespunde căutării.",

      open:
        "Deschide",

      resultGuide:
        "Cum citești rezultatul",

      resultGuideTitle:
        "Scor, severitate și dovezi",

      resultExample:
        "Exemplu",

      primaryHypothesis:
        "Ipoteză principală",

      severityMedium:
        "Severitate: Medie",

      urgencySoon:
        "Verificare recomandată",

      evidenceStrong:
        "Dovezi: Puternică",

      safetyTitle:
        "Siguranța înainte de toate",

      safetyText:
        "Nu continua deplasarea doar pentru a reproduce un simptom dacă sunt implicate frânarea, direcția, supraîncălzirea severă, fumul dens sau zgomotele mecanice puternice.",

      principleTitle:
        "De reținut",

      principle:
        "Descrie mai întâi comportamentul. Diagnostichează piesa după aceea.",

      keyPoints:
        "La ce să fii atent",

      more:
        "Mai multe detalii",

      close:
        "Închide",
    },
  }[language];


  const flow =
    language === "ro"
      ? [
          [
            "01",
            "Observă",
            "Ce face vehiculul?",
          ],

          [
            "02",
            "Notează",
            "Când apare?",
          ],

          [
            "03",
            "Scanează",
            "Păstrează DTC.",
          ],

          [
            "04",
            "Corelează",
            "Compară datele.",
          ],

          [
            "05",
            "Verifică",
            "Confirmă cauza.",
          ],
        ]
      : [
          [
            "01",
            "Observe",
            "What does it do?",
          ],

          [
            "02",
            "Record",
            "When does it happen?",
          ],

          [
            "03",
            "Scan",
            "Keep DTC codes.",
          ],

          [
            "04",
            "Compare",
            "Correlate data.",
          ],

          [
            "05",
            "Verify",
            "Confirm the cause.",
          ],
        ];


  const filteredTopics =
    useMemo(
      () => {
        const value =
          query
            .trim()
            .toLowerCase();


        if (!value) {
          return topics;
        }


        return topics.filter(
          (
            topic
          ) =>
            [
              topic.code,

              topic.title[
                language
              ],

              topic.short[
                language
              ],

              ...topic.bullets[
                language
              ],
            ]
              .join(" ")
              .toLowerCase()
              .includes(
                value
              )
        );
      },

      [
        query,
        language,
      ]
    );


  function changeLanguage(
    next:
      Language
  ) {
    setLanguage(
      next
    );

    localStorage.setItem(
      "language",
      next
    );
  }


  return (
    <main
      className="
        min-h-screen
        bg-[#060912]
        text-white
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[560px]
          px-3.5
          pb-4
          pt-4
        "
      >
        {/* HERO */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-white/[0.065]
            bg-[#080d18]
            p-4
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-44
              w-44
              rounded-full
              bg-blue-500/[0.09]
              blur-[55px]
            "
          />


          <div
            className="
              relative
              z-10
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-blue-400
                  "
                />

                <p
                  className="
                    truncate
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-blue-200/60
                  "
                >
                  {text.eyebrow}
                </p>
              </div>


              <div
                className="
                  inline-flex
                  shrink-0
                  rounded-[10px]
                  border
                  border-white/[0.06]
                  bg-white/[0.02]
                  p-0.5
                "
              >
                {(
                  [
                    "ro",
                    "en",
                  ] as Language[]
                ).map(
                  (
                    item
                  ) => (
                    <button
                      key={
                        item
                      }
                      type="button"
                      onClick={() =>
                        changeLanguage(
                          item
                        )
                      }
                      className={`
                        rounded-[8px]
                        px-2
                        py-1.5
                        text-[8px]
                        font-semibold

                        ${
                          language ===
                          item
                            ? "bg-white/[0.08] text-white"
                            : "text-zinc-600"
                        }
                      `}
                    >
                      {item.toUpperCase()}
                    </button>
                  )
                )}
              </div>
            </div>


            <h1
              className="
                mt-3.5
                max-w-[350px]
                text-[23px]
                font-semibold
                leading-[1.06]
                tracking-[-0.045em]
                text-white
              "
            >
              {text.title}
            </h1>


            <p
              className="
                mt-2
                max-w-[330px]
                text-[10px]
                leading-4
                text-zinc-500
              "
            >
              {
                text.description
              }
            </p>


            <div
              className="
                mt-3.5
                flex
                items-center
                gap-2
              "
            >
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/diagnosis/vehicle"
                  )
                }
                className="
                  min-h-[40px]
                  rounded-[11px]
                  bg-blue-500
                  px-3.5
                  text-[9px]
                  font-semibold
                  text-white
                "
              >
                {text.start} →
              </button>


              <div
                className="
                  min-w-0
                  flex-1
                  rounded-[11px]
                  border
                  border-cyan-300/[0.08]
                  bg-cyan-300/[0.025]
                  px-3
                  py-2
                "
              >
                <p
                  className="
                    text-[6px]
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    text-cyan-200/50
                  "
                >
                  {
                    text.principleTitle
                  }
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[8px]
                    font-medium
                    text-zinc-300
                  "
                >
                  {
                    text.principle
                  }
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* FLOW */}

        <section
          className="
            mt-3
          "
        >
          <p
            className="
              mb-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-blue-200/55
            "
          >
            {text.flowTitle}
          </p>


          <div
            className="
              flex
              gap-2
              overflow-x-auto
              pb-1
              [scrollbar-width:none]
            "
          >
            {flow.map(
              (
                [
                  number,
                  title,
                  description,
                ]
              ) => (
                <div
                  key={
                    number
                  }
                  className="
                    w-[112px]
                    shrink-0
                    rounded-[15px]
                    border
                    border-white/[0.055]
                    bg-[#05080e]
                    p-2.5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-[8px]
                        font-semibold
                        text-blue-300
                      "
                    >
                      {number}
                    </span>

                    <span
                      className="
                        h-1
                        w-1
                        rounded-full
                        bg-blue-400/50
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-2
                      text-[10px]
                      font-semibold
                    "
                  >
                    {title}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      leading-3
                      text-zinc-600
                    "
                  >
                    {
                      description
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </section>


        {/* RESULT INDICATORS */}

        <section
          className="
            mt-4
          "
        >
          <div
            className="
              mb-2
            "
          >
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-blue-200/55
              "
            >
              {
                text.resultGuide
              }
            </p>

            <h2
              className="
                mt-1
                text-[14px]
                font-semibold
                tracking-[-0.02em]
              "
            >
              {
                text.resultGuideTitle
              }
            </h2>
          </div>


          <div
            className="
              flex
              gap-2
              overflow-x-auto
              pb-1
              [scrollbar-width:none]
            "
          >
            {resultConcepts.map(
              (
                concept
              ) => (
                <button
                  key={
                    concept.id
                  }
                  type="button"
                  onClick={() =>
                    setSelectedResultConcept(
                      concept
                    )
                  }
                  className="
                    w-[145px]
                    shrink-0
                    rounded-[16px]
                    border
                    border-white/[0.06]
                    bg-[#05080e]
                    p-3
                    text-left
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span
                      className="
                        rounded-[8px]
                        border
                        border-blue-400/15
                        bg-blue-500/[0.05]
                        px-2
                        py-1
                        text-[8px]
                        font-bold
                        text-blue-200
                      "
                    >
                      {
                        concept.code
                      }
                    </span>

                    <span
                      className="
                        text-[9px]
                        text-zinc-700
                      "
                    >
                      →
                    </span>
                  </div>

                  <p
                    className="
                      mt-2.5
                      text-[10px]
                      font-semibold
                    "
                  >
                    {
                      concept.title[
                        language
                      ]
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      line-clamp-2
                      text-[8px]
                      leading-3
                      text-zinc-600
                    "
                  >
                    {
                      concept.short[
                        language
                      ]
                    }
                  </p>
                </button>
              )
            )}
          </div>
        </section>


        {/* COMPACT RESULT EXAMPLE */}

        <section
          className="
            mt-3
            rounded-[18px]
            border
            border-blue-400/[0.09]
            bg-[#070d18]
            p-3
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div
              className="
                min-w-0
                flex-1
              "
            >
              <p
                className="
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.1em]
                  text-zinc-600
                "
              >
                {
                  text.resultExample
                }
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-[10px]
                  font-semibold
                  text-zinc-200
                "
              >
                {language === "ro"
                  ? "Presiune de supraalimentare insuficientă"
                  : "Boost pressure underperformance"}
              </p>
            </div>


            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                border-[3px]
                border-blue-400/60
              "
            >
              <div
                className="
                  text-center
                "
              >
                <p
                  className="
                    text-[12px]
                    font-semibold
                  "
                >
                  78
                </p>

                <p
                  className="
                    text-[5px]
                    text-zinc-600
                  "
                >
                  /100
                </p>
              </div>
            </div>
          </div>


          <div
            className="
              mt-2.5
              grid
              grid-cols-3
              gap-1.5
            "
          >
            <div
              className="
                truncate
                rounded-[9px]
                border
                border-amber-400/10
                bg-amber-400/[0.04]
                px-2
                py-1.5
                text-center
                text-[7px]
                font-semibold
                text-amber-200
              "
            >
              {
                text.severityMedium
              }
            </div>

            <div
              className="
                truncate
                rounded-[9px]
                border
                border-amber-400/10
                bg-amber-400/[0.04]
                px-2
                py-1.5
                text-center
                text-[7px]
                font-semibold
                text-amber-200
              "
            >
              {
                text.urgencySoon
              }
            </div>

            <div
              className="
                truncate
                rounded-[9px]
                border
                border-emerald-400/10
                bg-emerald-400/[0.04]
                px-2
                py-1.5
                text-center
                text-[7px]
                font-semibold
                text-emerald-200
              "
            >
              {
                text.evidenceStrong
              }
            </div>
          </div>
        </section>


        {/* SAFETY */}

        <section
          className="
            mt-3
            flex
            items-start
            gap-2.5
            rounded-[16px]
            border
            border-red-400/12
            bg-red-400/[0.035]
            p-3
          "
        >
          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-[9px]
              border
              border-red-300/12
              text-[10px]
              font-bold
              text-red-200
            "
          >
            !
          </div>

          <div
            className="
              min-w-0
            "
          >
            <p
              className="
                text-[9px]
                font-semibold
                text-red-100
              "
            >
              {
                text.safetyTitle
              }
            </p>

            <p
              className="
                mt-1
                text-[8px]
                leading-3.5
                text-red-100/60
              "
            >
              {
                text.safetyText
              }
            </p>
          </div>
        </section>


        {/* QUICK REFERENCE */}

        <section
          className="
            mt-4
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <p
              className="
                text-[11px]
                font-semibold
              "
            >
              {
                text.quickReference
              }
            </p>

            <span
              className="
                text-[8px]
                text-zinc-700
              "
            >
              {
                filteredTopics.length
              }
            </span>
          </div>


          <div
            className="
              mt-2
              flex
              min-h-[40px]
              items-center
              rounded-[12px]
              border
              border-white/[0.06]
              bg-[#05080e]
              px-3
            "
          >
            <span
              className="
                shrink-0
                text-zinc-600
              "
            >
              <SearchIcon />
            </span>

            <input
              value={
                query
              }
              onChange={(
                event
              ) =>
                setQuery(
                  event.target
                    .value
                )
              }
              placeholder={
                text.searchPlaceholder
              }
              className="
                min-w-0
                flex-1
                bg-transparent
                px-2.5
                text-[10px]
                text-white
                outline-none
                placeholder:text-zinc-700
              "
            />

            {query && (
              <button
                type="button"
                onClick={() =>
                  setQuery("")
                }
                className="
                  text-[12px]
                  text-zinc-600
                "
              >
                ×
              </button>
            )}
          </div>


          {filteredTopics.length >
          0 ? (
            <div
              className="
                mt-2
                space-y-1.5
              "
            >
              {filteredTopics.map(
                (
                  topic
                ) => (
                  <button
                    key={
                      topic.id
                    }
                    type="button"
                    onClick={() =>
                      setSelectedTopic(
                        topic
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-[15px]
                      border
                      border-white/[0.055]
                      bg-[#05080e]
                      px-3
                      py-2.5
                      text-left
                    "
                  >
                    <span
                      className={`
                        flex
                        h-9
                        min-w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-[10px]
                        border
                        px-1.5
                        text-[7px]
                        font-bold

                        ${
                          accents[
                            topic.accent
                          ]
                        }
                      `}
                    >
                      {
                        topic.code
                      }
                    </span>


                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <p
                        className="
                          truncate
                          text-[10px]
                          font-semibold
                          text-zinc-200
                        "
                      >
                        {
                          topic.title[
                            language
                          ]
                        }
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-[8px]
                          text-zinc-600
                        "
                      >
                        {
                          topic.short[
                            language
                          ]
                        }
                      </p>
                    </div>


                    <span
                      className="
                        shrink-0
                        text-[10px]
                        text-zinc-700
                      "
                    >
                      →
                    </span>
                  </button>
                )
              )}
            </div>
          ) : (
            <div
              className="
                mt-2
                rounded-[15px]
                border
                border-white/[0.05]
                bg-[#05080e]
                p-4
                text-[10px]
                text-zinc-600
              "
            >
              {
                text.noResults
              }
            </div>
          )}
        </section>
      </div>


      {/* RESULT CONCEPT MODAL */}

      <Modal
        open={
          selectedResultConcept !==
          null
        }
        onClose={() =>
          setSelectedResultConcept(
            null
          )
        }
        eyebrow={
          text.resultGuide
        }
        title={
          selectedResultConcept
            ?.title[
              language
            ] ?? ""
        }
        description={
          selectedResultConcept
            ?.short[
              language
            ] ?? ""
        }
      >
        {selectedResultConcept && (
          <div>
            <div
              className="
                rounded-[14px]
                border
                border-blue-400/10
                bg-blue-500/[0.03]
                p-3
              "
            >
              <p
                className="
                  text-[11px]
                  leading-5
                  text-zinc-300
                "
              >
                {
                  selectedResultConcept
                    .explanation[
                    language
                  ]
                }
              </p>
            </div>


            <div
              className="
                mt-3
                space-y-2
              "
            >
              {selectedResultConcept.examples[
                language
              ].map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="
                      flex
                      gap-2.5
                      rounded-[12px]
                      border
                      border-white/[0.05]
                      bg-white/[0.015]
                      p-3
                    "
                  >
                    <span
                      className="
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-blue-400/10
                        text-[9px]
                        font-semibold
                        text-blue-200
                      "
                    >
                      {
                        index + 1
                      }
                    </span>

                    <p
                      className="
                        text-[10px]
                        leading-4
                        text-zinc-400
                      "
                    >
                      {item}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </Modal>


      {/* TOPIC MODAL */}

      <Modal
        open={
          selectedTopic !==
          null
        }
        onClose={() =>
          setSelectedTopic(
            null
          )
        }
        eyebrow={
          selectedTopic?.code ??
          text.eyebrow
        }
        title={
          selectedTopic
            ?.title[
              language
            ] ?? ""
        }
        description={
          selectedTopic
            ?.short[
              language
            ] ?? ""
        }
      >
        {selectedTopic && (
          <div>
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-blue-100/60
              "
            >
              {
                text.keyPoints
              }
            </p>


            <div
              className="
                mt-2.5
                space-y-2
              "
            >
              {selectedTopic.bullets[
                language
              ].map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="
                      flex
                      gap-2.5
                      rounded-[12px]
                      border
                      border-white/[0.05]
                      bg-white/[0.015]
                      p-3
                    "
                  >
                    <span
                      className="
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-blue-400/10
                        text-[9px]
                        font-semibold
                        text-blue-200
                      "
                    >
                      {
                        index + 1
                      }
                    </span>

                    <p
                      className="
                        text-[10px]
                        leading-4
                        text-zinc-400
                      "
                    >
                      {item}
                    </p>
                  </div>
                )
              )}
            </div>


            <p
              className="
                mt-4
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-zinc-600
              "
            >
              {text.more}
            </p>


            <div
              className="
                mt-2
                space-y-1
              "
            >
              {selectedTopic.details[
                language
              ].map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="
                      flex
                      gap-2
                      border-b
                      border-white/[0.045]
                      py-2.5
                      last:border-0
                    "
                  >
                    <span
                      className="
                        mt-1.5
                        h-1
                        w-1
                        shrink-0
                        rounded-full
                        bg-zinc-600
                      "
                    />

                    <p
                      className="
                        text-[10px]
                        leading-4
                        text-zinc-400
                      "
                    >
                      {item}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}