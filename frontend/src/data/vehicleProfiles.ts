import type { Manufacturer } from "./vehicleCatalog";

export type Language = "ro" | "en";

type LocalizedText = {
  ro: string;
  en: string;
};

export type VehicleFamilyProfile = {
  segment: LocalizedText;
  bodyStyles: LocalizedText[];
  commonTraits: LocalizedText[];
};

type VehicleProfilesMap = Partial<
  Record<Manufacturer, Record<string, VehicleFamilyProfile>>
>;

const t = (ro: string, en: string): LocalizedText => ({ ro, en });

export const vehicleFamilyProfiles: VehicleProfilesMap = {
  Audi: {
    A1: {
      segment: t("Clasă mică premium", "Premium small car"),
      bodyStyles: [t("Hatchback", "Hatchback")],
      commonTraits: [
        t("Format compact, orientat în special spre utilizare urbană.", "Compact format aimed primarily at urban use."),
        t("Poziționare premium în clasa mică, cu accent pe finisare și tehnologie.", "Premium positioning in the small-car class, with emphasis on finish and technology."),
      ],
    },
    A3: {
      segment: t("Compact premium", "Premium compact"),
      bodyStyles: [t("Hatchback", "Hatchback"), t("Sedan", "Sedan")],
      commonTraits: [
        t("Gamă compactă premium, potrivită atât pentru oraș, cât și pentru drumuri lungi.", "Premium compact range suited to both urban and long-distance use."),
        t("Caroserii și motorizări variate în funcție de generație și piață.", "Body styles and powertrains vary by generation and market."),
      ],
    },
    A4: {
      segment: t("Mediu premium", "Premium midsize"),
      bodyStyles: [t("Sedan", "Sedan"), t("Avant / break", "Avant / estate")],
      commonTraits: [
        t("Gamă orientată spre confort, utilizare zilnică și drumuri lungi.", "Range focused on comfort, everyday use and long-distance driving."),
        t("Disponibilitatea tracțiunii și a motorizărilor diferă între generații.", "Drivetrain and powertrain availability differs between generations."),
      ],
    },
    A5: {
      segment: t("Mediu premium", "Premium midsize"),
      bodyStyles: [t("Coupé / Sportback", "Coupé / Sportback"), t("Cabriolet", "Convertible")],
      commonTraits: [
        t("Gamă cu design mai sportiv și siluetă mai joasă decât modelele Audi convenționale.", "Range with a sportier design and lower silhouette than conventional Audi models."),
        t("Configurațiile de caroserie diferă în funcție de generație.", "Body configurations vary by generation."),
      ],
    },
    A6: {
      segment: t("Executive premium", "Premium executive"),
      bodyStyles: [t("Sedan", "Sedan"), t("Avant / break", "Avant / estate")],
      commonTraits: [
        t("Gamă de dimensiuni mari, orientată spre confort și călătorii lungi.", "Large model range focused on comfort and long-distance travel."),
        t("Nivel ridicat de tehnologie și echipare, variabil în funcție de generație.", "High level of technology and equipment, varying by generation."),
      ],
    },
    Q3: {
      segment: t("SUV compact premium", "Premium compact SUV"),
      bodyStyles: [t("SUV", "SUV"), t("Sportback", "Sportback")],
      commonTraits: [
        t("Poziție de condus mai înaltă și format potrivit pentru utilizare urbană și de familie.", "Higher driving position and a format suited to urban and family use."),
        t("Configurațiile de tracțiune și motorizare diferă între versiuni și generații.", "Drivetrain and powertrain configurations vary by version and generation."),
      ],
    },
    Q5: {
      segment: t("SUV mediu premium", "Premium midsize SUV"),
      bodyStyles: [t("SUV", "SUV"), t("Sportback", "Sportback")],
      commonTraits: [
        t("Echilibru între confort, spațiu și utilizare zilnică.", "Balance of comfort, space and everyday usability."),
        t("Gamă premium de familie, cu multiple configurații în funcție de generație.", "Premium family-oriented range with multiple configurations depending on generation."),
      ],
    },
    Q7: {
      segment: t("SUV mare premium", "Premium large SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV de dimensiuni mari, orientat spre spațiu, confort și călătorii lungi.", "Large SUV focused on space, comfort and long-distance travel."),
        t("Numărul de locuri și configurația tehnică pot varia în funcție de versiune și generație.", "Seating and technical configuration may vary by version and generation."),
      ],
    },
  },

  BMW: {
    "1 Series": {
      segment: t("Compact premium", "Premium compact"),
      bodyStyles: [t("Hatchback", "Hatchback")],
      commonTraits: [
        t("Model compact premium, orientat spre agilitate și utilizare zilnică.", "Premium compact model focused on agility and everyday use."),
        t("Arhitectura și sistemele de tracțiune diferă între generații.", "Architecture and drivetrain systems differ between generations."),
      ],
    },
    "2 Series": {
      segment: t("Compact premium", "Premium compact"),
      bodyStyles: [t("Coupé", "Coupé"), t("Gran Coupé", "Gran Coupé")],
      commonTraits: [
        t("Familie compactă cu accent mai pronunțat pe design și caracter dinamic.", "Compact family with a stronger emphasis on design and dynamic character."),
        t("Subgamele Seria 2 pot avea arhitecturi și caroserii foarte diferite.", "2 Series sub-ranges can use very different architectures and body styles."),
      ],
    },
    "3 Series": {
      segment: t("Mediu premium", "Premium midsize"),
      bodyStyles: [t("Sedan", "Sedan"), t("Touring / break", "Touring / estate")],
      commonTraits: [
        t("Gamă premium de clasă medie cu accent pe echilibru între confort și dinamică.", "Premium midsize range balancing comfort and driving dynamics."),
        t("Disponibilă în mai multe configurații de propulsie și tracțiune, în funcție de generație.", "Available with multiple powertrain and drivetrain configurations depending on generation."),
      ],
    },
    "4 Series": {
      segment: t("Mediu premium", "Premium midsize"),
      bodyStyles: [t("Coupé", "Coupé"), t("Gran Coupé", "Gran Coupé")],
      commonTraits: [
        t("Gamă cu poziționare mai sportivă și siluetă mai joasă decât Seria 3.", "Range with sportier positioning and a lower silhouette than the 3 Series."),
        t("Include mai multe tipuri de caroserie în funcție de generație.", "Includes multiple body styles depending on generation."),
      ],
    },
    "5 Series": {
      segment: t("Executive premium", "Premium executive"),
      bodyStyles: [t("Sedan", "Sedan"), t("Touring / break", "Touring / estate")],
      commonTraits: [
        t("Gamă executive orientată spre confort, tehnologie și călătorii lungi.", "Executive range focused on comfort, technology and long-distance travel."),
        t("Configurațiile de propulsie variază semnificativ între generații.", "Powertrain configurations vary significantly between generations."),
      ],
    },
    X1: {
      segment: t("SUV compact premium", "Premium compact SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV compact premium, potrivit pentru utilizare urbană și de familie.", "Premium compact SUV suited to urban and family use."),
        t("Spațiu practic într-un format mai compact decât modelele X3 și X5.", "Practical space in a smaller format than X3 and X5."),
      ],
    },
    X3: {
      segment: t("SUV mediu premium", "Premium midsize SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV premium de dimensiuni medii, orientat spre versatilitate.", "Premium midsize SUV focused on versatility."),
        t("Echilibru între confort, spațiu și caracter dinamic.", "Balance of comfort, space and dynamic character."),
      ],
    },
    X5: {
      segment: t("SUV mare premium", "Premium large SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV premium de dimensiuni mari, cu accent pe confort și performanță rutieră.", "Large premium SUV focused on comfort and on-road performance."),
        t("Gamă disponibilă istoric cu numeroase tipuri de propulsie.", "Range historically offered with numerous powertrain types."),
      ],
    },
  },

  Ford: {
    Fiesta: {
      segment: t("Clasă mică", "Small car"),
      bodyStyles: [t("Hatchback", "Hatchback")],
      commonTraits: [
        t("Format compact și ușor de utilizat în mediul urban.", "Compact format well suited to urban use."),
        t("Gamă cunoscută pentru dimensiuni reduse și caracter practic.", "Range known for small dimensions and practical character."),
      ],
    },
    Focus: {
      segment: t("Compact", "Compact"),
      bodyStyles: [t("Hatchback", "Hatchback"), t("Break", "Estate")],
      commonTraits: [
        t("Model compact de volum, destinat utilizării zilnice și de familie.", "Mainstream compact model intended for everyday and family use."),
        t("Caroseriile și motorizările diferă între generații și piețe.", "Body styles and powertrains vary by generation and market."),
      ],
    },
    Mondeo: {
      segment: t("Mediu", "Midsize"),
      bodyStyles: [t("Sedan / liftback", "Sedan / liftback"), t("Break", "Estate")],
      commonTraits: [
        t("Gamă de clasă medie orientată spre confort și spațiu.", "Midsize range focused on comfort and space."),
        t("Potrivită pentru drumuri lungi și utilizare de familie.", "Well suited to long-distance and family use."),
      ],
    },
    Kuga: {
      segment: t("SUV compact-mediu", "Compact-midsize SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV de familie cu poziție de condus înaltă și spațiu practic.", "Family SUV with a higher driving position and practical space."),
        t("Motorizările și sistemele de tracțiune diferă între generații.", "Powertrains and drivetrains differ between generations."),
      ],
    },
    Puma: {
      segment: t("Crossover subcompact", "Subcompact crossover"),
      bodyStyles: [t("Crossover", "Crossover")],
      commonTraits: [
        t("Format compact cu poziție de condus mai înaltă decât un hatchback convențional.", "Compact format with a higher driving position than a conventional hatchback."),
        t("Orientat spre utilizare urbană și flexibilitate zilnică.", "Focused on urban use and everyday flexibility."),
      ],
    },
    Mustang: {
      segment: t("Sport / grand tourer", "Sports / grand tourer"),
      bodyStyles: [t("Coupé", "Coupé"), t("Cabriolet", "Convertible")],
      commonTraits: [
        t("Model sportiv cu identitate puternică și orientare spre performanță.", "Sports model with a strong identity and performance focus."),
        t("Configurațiile de motor și transmisie variază între generații.", "Engine and transmission configurations vary between generations."),
      ],
    },
  },

  "Mercedes-Benz": {
    "A-Class": {
      segment: t("Compact premium", "Premium compact"),
      bodyStyles: [t("Hatchback", "Hatchback"), t("Sedan", "Sedan")],
      commonTraits: [
        t("Poarta de intrare în gama compactă premium Mercedes-Benz.", "Entry point into the Mercedes-Benz premium compact range."),
        t("Orientată spre utilizare urbană, tehnologie și confort zilnic.", "Focused on urban use, technology and everyday comfort."),
      ],
    },
    "B-Class": {
      segment: t("Compact premium / monovolum", "Premium compact / MPV"),
      bodyStyles: [t("Monovolum compact", "Compact MPV")],
      commonTraits: [
        t("Accent mai mare pe spațiu interior și accesibilitate decât A-Class.", "Greater emphasis on interior space and accessibility than the A-Class."),
        t("Orientată spre utilizare practică și de familie.", "Focused on practical and family use."),
      ],
    },
    "C-Class": {
      segment: t("Mediu premium", "Premium midsize"),
      bodyStyles: [t("Sedan", "Sedan"), t("Break", "Estate")],
      commonTraits: [
        t("Gamă premium de clasă medie, echilibrată între confort și dinamică.", "Premium midsize range balancing comfort and dynamics."),
        t("Caroseriile disponibile diferă între generații.", "Available body styles differ between generations."),
      ],
    },
    "E-Class": {
      segment: t("Executive premium", "Premium executive"),
      bodyStyles: [t("Sedan", "Sedan"), t("Break", "Estate")],
      commonTraits: [
        t("Gamă executive orientată spre confort, rafinament și călătorii lungi.", "Executive range focused on comfort, refinement and long-distance travel."),
        t("Nivel ridicat de tehnologie și asistență, variabil în funcție de generație.", "High level of technology and assistance, varying by generation."),
      ],
    },
    GLA: {
      segment: t("SUV compact premium", "Premium compact SUV"),
      bodyStyles: [t("SUV / crossover", "SUV / crossover")],
      commonTraits: [
        t("SUV compact premium cu accent pe utilizare urbană.", "Premium compact SUV with an urban-use focus."),
        t("Format mai compact și mai jos decât SUV-urile Mercedes-Benz mai mari.", "Smaller and lower format than larger Mercedes-Benz SUVs."),
      ],
    },
    GLC: {
      segment: t("SUV mediu premium", "Premium midsize SUV"),
      bodyStyles: [t("SUV", "SUV"), t("SUV Coupé", "SUV Coupé")],
      commonTraits: [
        t("SUV premium de dimensiuni medii, orientat spre confort și versatilitate.", "Premium midsize SUV focused on comfort and versatility."),
        t("Disponibil în mai multe stiluri de caroserie și propulsie, în funcție de generație.", "Available with multiple body and powertrain styles depending on generation."),
      ],
    },
    GLE: {
      segment: t("SUV mare premium", "Premium large SUV"),
      bodyStyles: [t("SUV", "SUV"), t("SUV Coupé", "SUV Coupé")],
      commonTraits: [
        t("SUV premium mare, orientat spre spațiu, confort și prezență rutieră.", "Large premium SUV focused on space, comfort and road presence."),
        t("Configurațiile tehnice variază mult între versiuni și generații.", "Technical configurations vary widely between versions and generations."),
      ],
    },
  },

  Opel: {
    Corsa: {
      segment: t("Clasă mică", "Small car"),
      bodyStyles: [t("Hatchback", "Hatchback")],
      commonTraits: [
        t("Model compact pentru utilizare urbană și zilnică.", "Compact model for urban and everyday use."),
        t("Gamă longevivă, cu motorizări diferite în funcție de generație.", "Long-running range with different powertrains depending on generation."),
      ],
    },
    Astra: {
      segment: t("Compact", "Compact"),
      bodyStyles: [t("Hatchback", "Hatchback"), t("Break", "Estate")],
      commonTraits: [
        t("Model compact de familie, orientat spre utilizare zilnică.", "Family compact model focused on everyday use."),
        t("Caroseriile și tehnologia diferă între generații.", "Body styles and technology differ between generations."),
      ],
    },
    Insignia: {
      segment: t("Mediu-mare", "Midsize-large"),
      bodyStyles: [t("Liftback / sedan", "Liftback / sedan"), t("Break", "Estate")],
      commonTraits: [
        t("Model de clasă medie-mare cu accent pe confort și drumuri lungi.", "Midsize-large model focused on comfort and long-distance travel."),
        t("Poziționat istoric în partea superioară a gamei Opel de autoturisme.", "Historically positioned near the top of Opel's passenger-car range."),
      ],
    },
    Mokka: {
      segment: t("SUV subcompact", "Subcompact SUV"),
      bodyStyles: [t("SUV / crossover", "SUV / crossover")],
      commonTraits: [
        t("SUV compact orientat spre oraș și utilizare zilnică.", "Compact SUV focused on urban and everyday use."),
        t("Design și tehnologie diferite semnificativ între generații.", "Design and technology differ significantly between generations."),
      ],
    },
    Crossland: {
      segment: t("Crossover subcompact", "Subcompact crossover"),
      bodyStyles: [t("Crossover", "Crossover")],
      commonTraits: [
        t("Model orientat spre spațiu practic într-un format compact.", "Model focused on practical space in a compact format."),
        t("Destinat în principal utilizării urbane și de familie.", "Intended primarily for urban and family use."),
      ],
    },
  },

  Renault: {
    Clio: {
      segment: t("Clasă mică", "Small car"),
      bodyStyles: [t("Hatchback", "Hatchback")],
      commonTraits: [
        t("Model urban compact și una dintre gamele de bază Renault.", "Compact urban model and one of Renault's core ranges."),
        t("Motorizările și tehnologia au evoluat semnificativ între generații.", "Powertrains and technology have evolved significantly between generations."),
      ],
    },
    Megane: {
      segment: t("Compact", "Compact"),
      bodyStyles: [t("Hatchback", "Hatchback"), t("Break / sedan", "Estate / sedan")],
      commonTraits: [
        t("Gamă compactă orientată spre utilizare de familie și drumuri zilnice.", "Compact range focused on family and everyday use."),
        t("Caroseria și tipul de propulsie diferă mult între generații.", "Body style and powertrain type vary widely between generations."),
      ],
    },
    Captur: {
      segment: t("Crossover subcompact", "Subcompact crossover"),
      bodyStyles: [t("Crossover", "Crossover")],
      commonTraits: [
        t("Crossover urban bazat pe un format compact și practic.", "Urban crossover based on a compact and practical format."),
        t("Poziție de condus mai înaltă și spațiu flexibil pentru utilizare zilnică.", "Higher driving position and flexible space for everyday use."),
      ],
    },
    Kadjar: {
      segment: t("SUV compact", "Compact SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV compact de familie, orientat spre versatilitate.", "Compact family SUV focused on versatility."),
        t("A precedat Austral în gama Renault europeană.", "Preceded Austral in Renault's European range."),
      ],
    },
    Austral: {
      segment: t("SUV compact-mediu", "Compact-midsize SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV Renault din segmentul C, orientat spre tehnologie și spațiu.", "Renault C-segment SUV focused on technology and space."),
        t("A fost introdus ca succesor al lui Kadjar în gama europeană.", "Introduced as Kadjar's successor in the European range."),
      ],
    },
  },

  Skoda: {
    Fabia: {
      segment: t("Clasă mică", "Small car"),
      bodyStyles: [t("Hatchback", "Hatchback")],
      commonTraits: [
        t("Model compact, orientat spre utilizare practică și urbană.", "Compact model focused on practical and urban use."),
        t("Una dintre gamele tradiționale de volum ale mărcii.", "One of the brand's traditional volume model ranges."),
      ],
    },
    Octavia: {
      segment: t("Compact de familie", "Family compact"),
      bodyStyles: [t("Liftback", "Liftback"), t("Combi / break", "Combi / estate")],
      commonTraits: [
        t("Accent puternic pe spațiu interior și portbagaj.", "Strong emphasis on interior and luggage space."),
        t("Una dintre gamele centrale și cele mai răspândite Škoda.", "One of Škoda's core and most widespread model ranges."),
      ],
    },
    Superb: {
      segment: t("Mediu-mare / flagship", "Midsize-large / flagship"),
      bodyStyles: [t("Liftback / sedan", "Liftback / sedan"), t("Combi / break", "Combi / estate")],
      commonTraits: [
        t("Model de vârf al gamei tradiționale Škoda, cu accent pe spațiu și confort.", "Flagship of Škoda's traditional range, focused on space and comfort."),
        t("Orientat spre călătorii lungi și utilizare de familie sau business.", "Focused on long-distance, family and business use."),
      ],
    },
    Scala: {
      segment: t("Compact", "Compact"),
      bodyStyles: [t("Hatchback", "Hatchback")],
      commonTraits: [
        t("Hatchback compact cu accent pe spațiu practic și utilizare zilnică.", "Compact hatchback focused on practical space and everyday use."),
        t("Poziționat între modelele mici și gama Octavia.", "Positioned between smaller models and the Octavia range."),
      ],
    },
    Karoq: {
      segment: t("SUV compact", "Compact SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV compact de familie, orientat spre versatilitate și spațiu.", "Compact family SUV focused on versatility and space."),
        t("Format mai compact decât Kodiaq.", "Smaller format than Kodiaq."),
      ],
    },
    Kodiaq: {
      segment: t("SUV mare", "Large SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV de dimensiuni mari cu accent pe spațiu și utilizare de familie.", "Large SUV focused on space and family use."),
        t("Disponibilitatea numărului de locuri și a motorizărilor depinde de versiune și generație.", "Seating and powertrain availability depends on version and generation."),
      ],
    },
  },

  Toyota: {
    Yaris: {
      segment: t("Clasă mică", "Small car"),
      bodyStyles: [t("Hatchback", "Hatchback")],
      commonTraits: [
        t("Model compact destinat în principal utilizării urbane.", "Compact model intended primarily for urban use."),
        t("Gamă cunoscută pentru dimensiuni reduse și eficiență.", "Range known for small dimensions and efficiency."),
      ],
    },
    Corolla: {
      segment: t("Compact", "Compact"),
      bodyStyles: [t("Hatchback / sedan", "Hatchback / sedan"), t("Touring / break", "Touring / estate")],
      commonTraits: [
        t("Gamă compactă globală, orientată spre fiabilitate și utilizare zilnică.", "Global compact range focused on reliability and everyday use."),
        t("Caroseriile și sistemele de propulsie diferă între piețe și generații.", "Body styles and powertrains differ by market and generation."),
      ],
    },
    Camry: {
      segment: t("Sedan mediu-mare", "Midsize-large sedan"),
      bodyStyles: [t("Sedan", "Sedan")],
      commonTraits: [
        t("Sedan orientat spre confort, spațiu și călătorii lungi.", "Sedan focused on comfort, space and long-distance travel."),
        t("Poziționat peste Corolla ca dimensiuni și confort.", "Positioned above Corolla in size and comfort."),
      ],
    },
    "C-HR": {
      segment: t("Crossover compact", "Compact crossover"),
      bodyStyles: [t("Crossover", "Crossover")],
      commonTraits: [
        t("Crossover compact cu design distinct și orientare urbană.", "Compact crossover with distinctive design and urban focus."),
        t("Accent pe eficiență și tehnologie de propulsie electrificată în generațiile recente.", "Emphasis on efficiency and electrified powertrains in recent generations."),
      ],
    },
    RAV4: {
      segment: t("SUV compact-mediu", "Compact-midsize SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV de familie orientat spre spațiu și versatilitate.", "Family SUV focused on space and versatility."),
        t("Una dintre gamele SUV globale de volum ale Toyota.", "One of Toyota's global high-volume SUV ranges."),
      ],
    },
    Prius: {
      segment: t("Liftback electrificat", "Electrified liftback"),
      bodyStyles: [t("Liftback", "Liftback")],
      commonTraits: [
        t("Gamă asociată în principal cu propulsia hibridă și eficiența.", "Range primarily associated with hybrid propulsion and efficiency."),
        t("Siluetă orientată spre aerodinamică și utilizare practică.", "Silhouette focused on aerodynamics and practical use."),
      ],
    },
  },

  Volkswagen: {
    Polo: {
      segment: t("Clasă mică", "Small car"),
      bodyStyles: [t("Hatchback", "Hatchback")],
      commonTraits: [
        t("Model compact destinat utilizării urbane și zilnice.", "Compact model intended for urban and everyday use."),
        t("Poziționat sub Golf în gama Volkswagen.", "Positioned below Golf in the Volkswagen range."),
      ],
    },
    Golf: {
      segment: t("Compact", "Compact"),
      bodyStyles: [t("Hatchback", "Hatchback"), t("Variant / break", "Variant / estate")],
      commonTraits: [
        t("Model compact central în gama Volkswagen.", "Core compact model in the Volkswagen range."),
        t("Gamă disponibilă în numeroase configurații de propulsie și performanță.", "Range offered with numerous powertrain and performance configurations."),
      ],
    },
    Passat: {
      segment: t("Mediu", "Midsize"),
      bodyStyles: [t("Sedan", "Sedan"), t("Variant / break", "Variant / estate")],
      commonTraits: [
        t("Gamă orientată spre confort, spațiu și drumuri lungi.", "Range focused on comfort, space and long-distance travel."),
        t("Utilizare frecventă de familie și business.", "Commonly used for family and business purposes."),
      ],
    },
    Arteon: {
      segment: t("Mediu-mare", "Midsize-large"),
      bodyStyles: [t("Fastback", "Fastback"), t("Shooting Brake", "Shooting Brake")],
      commonTraits: [
        t("Model cu design mai expresiv și poziționare mai premium decât Passat.", "Model with more expressive design and more premium positioning than Passat."),
        t("Accent pe stil, confort și utilizare pentru drumuri lungi.", "Emphasis on style, comfort and long-distance use."),
      ],
    },
    "T-Roc": {
      segment: t("Crossover compact", "Compact crossover"),
      bodyStyles: [t("Crossover / SUV", "Crossover / SUV")],
      commonTraits: [
        t("Crossover compact poziționat între modelele mici și SUV-urile Volkswagen mai mari.", "Compact crossover positioned between smaller cars and larger Volkswagen SUVs."),
        t("Orientat spre utilizare urbană și flexibilitate zilnică.", "Focused on urban use and everyday flexibility."),
      ],
    },
    Tiguan: {
      segment: t("SUV compact-mediu", "Compact-midsize SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV de familie orientat spre spațiu și versatilitate.", "Family SUV focused on space and versatility."),
        t("Una dintre gamele SUV de volum ale Volkswagen.", "One of Volkswagen's mainstream SUV ranges."),
      ],
    },
    Touareg: {
      segment: t("SUV mare premium", "Premium large SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV mare poziționat în partea superioară a gamei Volkswagen.", "Large SUV positioned near the top of the Volkswagen range."),
        t("Accent pe confort, tehnologie și călătorii lungi.", "Emphasis on comfort, technology and long-distance travel."),
      ],
    },
  },

  Volvo: {
    S60: {
      segment: t("Sedan mediu premium", "Premium midsize sedan"),
      bodyStyles: [t("Sedan", "Sedan")],
      commonTraits: [
        t("Sedan premium de clasă medie, orientat spre confort și siguranță.", "Premium midsize sedan focused on comfort and safety."),
        t("Caracter dinamic într-un format mai compact decât S90.", "Dynamic character in a smaller format than S90."),
      ],
    },
    S90: {
      segment: t("Sedan executive premium", "Premium executive sedan"),
      bodyStyles: [t("Sedan", "Sedan")],
      commonTraits: [
        t("Sedan mare premium, orientat spre confort și rafinament.", "Large premium sedan focused on comfort and refinement."),
        t("Poziționat peste S60 ca dimensiuni și spațiu.", "Positioned above S60 in size and space."),
      ],
    },
    V60: {
      segment: t("Break mediu premium", "Premium midsize estate"),
      bodyStyles: [t("Break / estate", "Estate")],
      commonTraits: [
        t("Model premium de familie cu accent pe spațiu de încărcare și versatilitate.", "Premium family model focused on cargo space and versatility."),
        t("Împarte poziționarea de clasă cu S60, dar într-o caroserie break.", "Shares its class positioning with S60 but in an estate body."),
      ],
    },
    XC40: {
      segment: t("SUV compact premium", "Premium compact SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV compact premium pentru utilizare urbană și de familie.", "Premium compact SUV for urban and family use."),
        t("Cel mai compact dintre modelele XC din această bibliotecă.", "Smallest of the XC models in this library."),
      ],
    },
    XC60: {
      segment: t("SUV mediu premium", "Premium midsize SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV premium mediu, orientat spre confort și versatilitate.", "Premium midsize SUV focused on comfort and versatility."),
        t("Poziționat între XC40 și XC90 ca dimensiuni.", "Positioned between XC40 and XC90 in size."),
      ],
    },
    XC90: {
      segment: t("SUV mare premium", "Premium large SUV"),
      bodyStyles: [t("SUV", "SUV")],
      commonTraits: [
        t("SUV mare premium, orientat spre spațiu, confort și familie.", "Large premium SUV focused on space, comfort and family use."),
        t("Poziționat în partea superioară a gamei SUV Volvo.", "Positioned at the upper end of Volvo's SUV range."),
      ],
    },
  },
};

export function getLocalizedVehicleProfile(
  manufacturer: Manufacturer,
  model: string,
  language: Language
) {
  const profile =
    vehicleFamilyProfiles[manufacturer]?.[model];

  if (!profile) {
    return null;
  }

  return {
    segment: profile.segment[language],
    bodyStyles: profile.bodyStyles.map(
      (item) => item[language]
    ),
    commonTraits: profile.commonTraits.map(
      (item) => item[language]
    ),
  };
}