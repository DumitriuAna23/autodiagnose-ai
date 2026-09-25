"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  vehicleCatalog,
} from "@/data/vehicleCatalog";

import type {
  Manufacturer,
} from "@/data/vehicleCatalog";

import {
  getVehicleImage,
} from "@/data/vehicleImages";

import {
  getLocalizedVehicleProfile,
} from "@/data/vehicleProfiles";


type Language =
  | "ro"
  | "en";

type FuelType =
  | "petrol"
  | "diesel"
  | "hybrid"
  | "electric"
  | "";


type LibrarySelection = {
  manufacturer?: string;
  model?: string;
  model_verified?: boolean;
};


type StoredVehicle = {
  manufacturer?: string;
  model?: string;
  model_verified?: boolean;
  fuel?: string;
  year?: number | null;
  vehicle_context?: {
    additional_information?: string | null;
  };
};



const brandLogoSlugs: Partial<
  Record<Manufacturer, string>
> = {
  Audi: "audi",
  BMW: "bmw",
  Ford: "ford",
  "Mercedes-Benz": "mercedes",
  Opel: "opel",
  Renault: "renault",
  Skoda: "skoda",
  Toyota: "toyota",
  Volkswagen: "volkswagen",
  Volvo: "volvo",
};


function BrandMark({
  manufacturer,
  compact = false,
}: {
  manufacturer: Manufacturer;
  compact?: boolean;
}) {
  const [
    failed,
    setFailed,
  ] = useState(false);

  const slug =
    brandLogoSlugs[
      manufacturer
    ];

  const logoUrl =
    slug
      ? `https://cdn.simpleicons.org/${slug}/ffffff`
      : null;

  const initials =
    manufacturer
      .split(/[\s-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part.charAt(0)
      )
      .join("")
      .toUpperCase();

  if (
    !failed &&
    logoUrl
  ) {
    return (
      <img
        src={logoUrl}
        alt={`${manufacturer} logo`}
        onError={() =>
          setFailed(true)
        }
        className={`
          object-contain
          opacity-95
          drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)]
          ${
            compact
              ? "h-14 w-24"
              : "h-28 w-44 sm:h-32 sm:w-52"
          }
        `}
      />
    );
  }

  return (
    <span
      className={`
        font-semibold
        tracking-[0.12em]
        text-zinc-200
        ${
          compact
            ? "text-lg"
            : "text-4xl"
        }
      `}
    >
      {initials}
    </span>
  );
}


const fuelOptions: {
  value: Exclude<FuelType, "">;
  icon: "drop" | "diesel" | "hybrid" | "electric";
}[] = [
  {
    value: "petrol",
    icon: "drop",
  },
  {
    value: "diesel",
    icon: "diesel",
  },
  {
    value: "hybrid",
    icon: "hybrid",
  },
  {
    value: "electric",
    icon: "electric",
  },
];


function FuelIcon({
  type,
}: {
  type:
    | "drop"
    | "diesel"
    | "hybrid"
    | "electric";
}) {
  if (type === "electric") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <path
          d="M13.5 2 6.8 13h4.7L10.5 22 17.2 11h-4.7L13.5 2Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "hybrid") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <path
          d="M12 3v18M7 8.5C7 5.5 9 3 12 3c3 0 5 2.5 5 5.5 0 2.2-1.2 4.1-3 5.1M17 15.5c0 3-2 5.5-5 5.5-3 0-5-2.5-5-5.5 0-2.2 1.2-4.1 3-5.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "diesel") {
    return (
      <div
        className="
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-md
          border
          border-current/35
          text-[10px]
          font-bold
        "
      >
        D
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M12 3.2s5 5.4 5 10a5 5 0 0 1-10 0c0-4.6 5-10 5-10Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}


export default function VehiclePage() {
  const router =
    useRouter();

  const [
    language,
    setLanguage,
  ] =
    useState<Language>(
      "en"
    );

  const [
    manufacturer,
    setManufacturer,
  ] =
    useState<
      Manufacturer | ""
    >("");

  const [
    model,
    setModel,
  ] =
    useState("");

  const [
    manualModel,
    setManualModel,
  ] =
    useState("");

  const [
    modelNotListed,
    setModelNotListed,
  ] =
    useState(false);

  const [
    fuel,
    setFuel,
  ] =
    useState<FuelType>("");

  const [
    year,
    setYear,
  ] =
    useState("");

  const [
    yearUnknown,
    setYearUnknown,
  ] =
    useState(false);

  const [
    additionalVehicleInfo,
    setAdditionalVehicleInfo,
  ] =
    useState("");

  const [
    selectedFromLibrary,
    setSelectedFromLibrary,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    fuelHelpOpen,
    setFuelHelpOpen,
  ] =
    useState(false);

  const [
    showConfirmation,
    setShowConfirmation,
  ] =
    useState(false);


  const [
    selectionReady,
    setSelectionReady,
  ] =
    useState(false);


  const content = {
    en: {
      step:
        "STEP 1 OF DIAGNOSIS",

      title:
        "Configure your vehicle",

      description:
        "Confirm the vehicle family, then add the details that describe your exact car.",

      selectedVehicle:
        "SELECTED VEHICLE",

      selectedFromLibrary:
        "Selected from vehicle library",

      manualModelBadge:
        "Manually entered model",

      changeVehicle:
        "Change vehicle",

      chooseVehicle:
        "Choose vehicle",

      chooseFromLibrary:
        "Open vehicle library",

      manufacturer:
        "Manufacturer",

      selectManufacturer:
        "Select manufacturer",

      model:
        "Model",

      selectModel:
        "Select model",

      modelNotListed:
        "My model isn't listed",

      manualModel:
        "Enter your model",

      manualModelPlaceholder:
        "e.g. Golf Plus",

      detailsTitle:
        "Your vehicle details",

      detailsDescription:
        "These details describe the specific vehicle being diagnosed and help avoid irrelevant conclusions.",

      year:
        "Model year",

      yearPlaceholder:
        "Select year",

      yearUnknown:
        "I don't know the exact year",

      fuel:
        "Fuel type",

      fuelDescription:
        "Choose the propulsion type of this specific vehicle.",

      petrol:
        "Petrol",

      diesel:
        "Diesel",

      hybrid:
        "Hybrid",

      electric:
        "Electric",

      fuelHelp:
        "Not sure which one to choose?",

      additionalInfo:
        "Other vehicle information",

      optional:
        "Optional",

      additionalInfoPlaceholder:
        "Example: 2.0 TDI, 150 hp, automatic transmission, quattro. Stage 1. EGR replaced last year...",

      additionalInfoHelp:
        "Add details that may matter for diagnosis. Do not worry if you do not know all of them.",

      infoMotor:
        "engine",

      infoPower:
        "power",

      infoGearbox:
        "transmission",

      infoDrive:
        "drivetrain",

      infoMods:
        "modifications",

      infoRepairs:
        "recent repairs",

      summary:
        "Diagnostic input",

      summaryDescription:
        "This information will be attached to the case before symptom collection starts.",

      family:
        "Vehicle family",

      exactYear:
        "Year",

      selectedFuel:
        "Fuel",

      notSet:
        "Not selected",

      unknown:
        "Unknown",

      continue:
        "Continue to symptoms",

      requiredManufacturer:
        "Select a valid manufacturer.",

      requiredModel:
        "Select or enter your vehicle model.",

      requiredFuel:
        "Select the vehicle fuel type.",

      invalidYear:
        "Select a valid vehicle year.",

      confirmation:
        "CONFIRM VEHICLE",

      confirmationTitle:
        "Check the vehicle before continuing",

      confirmationDescription:
        "These details will be used as context for the diagnostic analysis.",

      exactMatch:
        "Catalog model",

      partialMatch:
        "Manual model",

      exactMatchDescription:
        "The manufacturer and model were selected from the vehicle catalog.",

      partialMatchDescription:
        "The manufacturer is known, but the model was entered manually. Model-specific conclusions will be treated more cautiously.",

      back:
        "Back",

      confirm:
        "Confirm and continue",

      dataWarningTitle:
        "Check vehicle information",

      dataWarningDescription:
        "Some details may conflict. Review them before continuing.",

      fuelHelpTitle:
        "How can you identify the fuel type?",

      fuelHelpIntro:
        "Check the fuel-door label, registration documents or vehicle information display.",

      gotIt:
        "Got it",

      catalogProfile:
        "Range profile",

      available:
        "Available",
    },

    ro: {
      step:
        "PASUL 1 AL DIAGNOZEI",

      title:
        "Configurează vehiculul",

      description:
        "Confirmă gama vehiculului, apoi completează datele care descriu exact mașina ta.",

      selectedVehicle:
        "VEHICUL SELECTAT",

      selectedFromLibrary:
        "Selectat din biblioteca de vehicule",

      manualModelBadge:
        "Model introdus manual",

      changeVehicle:
        "Schimbă vehiculul",

      chooseVehicle:
        "Alege vehiculul",

      chooseFromLibrary:
        "Deschide biblioteca de vehicule",

      manufacturer:
        "Marcă",

      selectManufacturer:
        "Alege marca",

      model:
        "Model",

      selectModel:
        "Alege modelul",

      modelNotListed:
        "Modelul meu nu apare în listă",

      manualModel:
        "Introdu modelul",

      manualModelPlaceholder:
        "ex. Golf Plus",

      detailsTitle:
        "Detaliile vehiculului tău",

      detailsDescription:
        "Aceste date descriu exemplarul pe care îl diagnostichezi și ajută la evitarea concluziilor nepotrivite.",

      year:
        "An fabricație",

      yearPlaceholder:
        "Alege anul",

      yearUnknown:
        "Nu știu anul exact",

      fuel:
        "Tip combustibil",

      fuelDescription:
        "Alege tipul de propulsie al acestui vehicul.",

      petrol:
        "Benzină",

      diesel:
        "Diesel",

      hybrid:
        "Hibrid",

      electric:
        "Electric",

      fuelHelp:
        "Nu știi ce variantă să alegi?",

      additionalInfo:
        "Alte informații despre vehicul",

      optional:
        "Opțional",

      additionalInfoPlaceholder:
        "Exemplu: 2.0 TDI, 150 CP, cutie automată, quattro. Stage 1. EGR schimbat anul trecut...",

      additionalInfoHelp:
        "Adaugă detalii care pot conta în diagnostic. Nu este nicio problemă dacă nu le cunoști pe toate.",

      infoMotor:
        "motor",

      infoPower:
        "putere",

      infoGearbox:
        "cutie",

      infoDrive:
        "tracțiune",

      infoMods:
        "modificări",

      infoRepairs:
        "reparații recente",

      summary:
        "Date pentru diagnostic",

      summaryDescription:
        "Aceste informații vor fi atașate cazului înainte de colectarea simptomelor.",

      family:
        "Familie vehicul",

      exactYear:
        "An",

      selectedFuel:
        "Combustibil",

      notSet:
        "Neselectat",

      unknown:
        "Necunoscut",

      continue:
        "Continuă la simptome",

      requiredManufacturer:
        "Selectează o marcă validă.",

      requiredModel:
        "Selectează sau introdu modelul vehiculului.",

      requiredFuel:
        "Selectează tipul de combustibil.",

      invalidYear:
        "Selectează un an valid pentru vehicul.",

      confirmation:
        "CONFIRMARE VEHICUL",

      confirmationTitle:
        "Verifică vehiculul înainte de a continua",

      confirmationDescription:
        "Aceste date vor fi folosite drept context pentru analiza de diagnostic.",

      exactMatch:
        "Model din catalog",

      partialMatch:
        "Model manual",

      exactMatchDescription:
        "Marca și modelul au fost selectate din catalogul de vehicule.",

      partialMatchDescription:
        "Marca este cunoscută, dar modelul a fost introdus manual. Concluziile specifice modelului vor fi tratate mai prudent.",

      back:
        "Înapoi",

      confirm:
        "Confirmă și continuă",

      dataWarningTitle:
        "Verifică informațiile vehiculului",

      dataWarningDescription:
        "Unele detalii se pot contrazice. Verifică-le înainte de a continua.",

      fuelHelpTitle:
        "Cum identifici tipul de combustibil?",

      fuelHelpIntro:
        "Verifică eticheta de la clapeta rezervorului, certificatul de înmatriculare sau informațiile afișate de vehicul.",

      gotIt:
        "Am înțeles",

      catalogProfile:
        "Profil gamă",

      available:
        "Disponibil",
    },
  };


  const text =
    content[language];


  const currentYear =
    new Date().getFullYear();


  const yearOptions =
    useMemo(
      () =>
        Array.from(
          {
            length:
              currentYear -
              1949 +
              1,
          },
          (
            _,
            index
          ) =>
            currentYear +
            1 -
            index
        ).filter(
          (value) =>
            value >= 1950
        ),
      [currentYear]
    );


  const selectedModelName =
    modelNotListed
      ? manualModel.trim()
      : model;


  const vehicleImage =
    manufacturer &&
    selectedModelName &&
    !modelNotListed
      ? getVehicleImage(
          manufacturer,
          selectedModelName
        )
      : null;


  const profile =
    manufacturer &&
    selectedModelName &&
    !modelNotListed
      ? getLocalizedVehicleProfile(
          manufacturer,
          selectedModelName,
          language
        )
      : null;


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );

    if (
      savedLanguage ===
        "ro" ||
      savedLanguage ===
        "en"
    ) {
      setLanguage(
        savedLanguage
      );
    }


    const rawSelection =
      localStorage.getItem(
        "vehicleLibrarySelection"
      );

    if (rawSelection) {
      try {
        const selection =
          JSON.parse(
            rawSelection
          ) as LibrarySelection;

        const selectedManufacturer =
          selection.manufacturer;

        const selectedModel =
          selection.model;

        if (
          selectedManufacturer &&
          selectedModel &&
          Object.prototype.hasOwnProperty.call(
            vehicleCatalog,
            selectedManufacturer
          )
        ) {
          const typedManufacturer =
            selectedManufacturer as Manufacturer;

          const isCatalogModel =
            (
              vehicleCatalog[
                typedManufacturer
              ] as readonly string[]
            ).includes(
              selectedModel
            );

          setManufacturer(
            typedManufacturer
          );

          setSelectedFromLibrary(
            true
          );

          if (
            selection.model_verified ===
              false ||
            !isCatalogModel
          ) {
            setModel("");
            setManualModel(
              selectedModel
            );
            setModelNotListed(
              true
            );
          } else {
            setModel(
              selectedModel
            );
            setManualModel("");
            setModelNotListed(
              false
            );
          }

          setSelectionReady(
            true
          );
          return;
        }
      } catch {
        // Ignore malformed local data and continue with the fallback below.
      }
    }


    const rawVehicle =
      localStorage.getItem(
        "diagnosticVehicle"
      );

    if (rawVehicle) {
      try {
        const stored =
          JSON.parse(
            rawVehicle
          ) as StoredVehicle;

        if (
          stored.manufacturer &&
          stored.model &&
          Object.prototype.hasOwnProperty.call(
            vehicleCatalog,
            stored.manufacturer
          )
        ) {
          const typedManufacturer =
            stored.manufacturer as Manufacturer;

          const storedModel =
            stored.model;

          const isCatalogModel =
            (
              vehicleCatalog[
                typedManufacturer
              ] as readonly string[]
            ).includes(
              storedModel
            );

          setManufacturer(
            typedManufacturer
          );

          setSelectedFromLibrary(
            false
          );

          if (
            stored.model_verified ===
              false ||
            !isCatalogModel
          ) {
            setModel("");
            setManualModel(
              storedModel
            );
            setModelNotListed(
              true
            );
          } else {
            setModel(
              storedModel
            );
            setManualModel("");
            setModelNotListed(
              false
            );
          }

          if (
            stored.fuel ===
              "petrol" ||
            stored.fuel ===
              "diesel" ||
            stored.fuel ===
              "hybrid" ||
            stored.fuel ===
              "electric"
          ) {
            setFuel(
              stored.fuel
            );
          }

          if (
            typeof stored.year ===
              "number"
          ) {
            setYear(
              String(
                stored.year
              )
            );
          } else if (
            stored.year === null
          ) {
            setYearUnknown(
              true
            );
          }

          const savedInfo =
            stored.vehicle_context
              ?.additional_information;

          if (
            typeof savedInfo ===
              "string"
          ) {
            setAdditionalVehicleInfo(
              savedInfo
            );
          }

          setSelectionReady(
            true
          );
          return;
        }
      } catch {
        // Ignore malformed local data and redirect to the vehicle library.
      }
    }


    router.replace(
      "/diagnosis/vehicles"
    );
  }, [router]);





  function openVehicleLibrary() {
    localStorage.removeItem(
      "vehicleLibrarySelection"
    );

    router.push(
      "/diagnosis/vehicles"
    );
  }


  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!manufacturer) {
      setError(
        text.requiredManufacturer
      );
      return;
    }

    if (
      !modelNotListed &&
      !model
    ) {
      setError(
        text.requiredModel
      );
      return;
    }

    if (
      modelNotListed &&
      !manualModel.trim()
    ) {
      setError(
        text.requiredModel
      );
      return;
    }

    if (!fuel) {
      setError(
        text.requiredFuel
      );
      return;
    }

    if (
      !yearUnknown &&
      year
    ) {
      const numericYear =
        Number(year);

      if (
        numericYear < 1950 ||
        numericYear >
          currentYear + 1
      ) {
        setError(
          text.invalidYear
        );
        return;
      }
    }

    setShowConfirmation(
      true
    );
  }


  function confirmVehicle() {
    if (!manufacturer) {
      return;
    }

    const vehicle = {
      manufacturer,

      manufacturer_verified:
        true,

      model:
        modelNotListed
          ? manualModel.trim()
          : model,

      model_verified:
        !modelNotListed,

      fuel,

      year:
        yearUnknown ||
        !year
          ? null
          : Number(year),

      vehicle_match:
        modelNotListed
          ? "partial"
          : "exact",

      reference_model:
        null,

      vehicle_context: {
        additional_information:
          additionalVehicleInfo
            .trim() || null,
      },
    };

    localStorage.setItem(
      "diagnosticVehicle",
      JSON.stringify(
        vehicle
      )
    );

    localStorage.removeItem(
      "vehicleLibrarySelection"
    );

    router.push(
      "/diagnosis/symptoms"
    );
  }


  function getFuelLabel() {
    if (
      fuel === "petrol"
    ) {
      return text.petrol;
    }

    if (
      fuel === "diesel"
    ) {
      return text.diesel;
    }

    if (
      fuel === "hybrid"
    ) {
      return text.hybrid;
    }

    if (
      fuel === "electric"
    ) {
      return text.electric;
    }

    return text.notSet;
  }


  function getVehicleDataWarnings() {
    const warnings:
      string[] = [];

    const info =
      additionalVehicleInfo
        .trim()
        .toLowerCase();

    if (!info) {
      return warnings;
    }

    const containsAny = (
      keywords:
        string[]
    ) =>
      keywords.some(
        (keyword) =>
          info.includes(
            keyword
          )
      );

    const combustionKeywords = [
      "diesel",
      "motorină",
      "motorina",
      "benzină",
      "benzina",
      "petrol",
      "gasoline",
      "turbo",
      "biturbo",
      "egr",
      "dpf",
      "injector",
      "injectoare",
      "bujie",
      "bujii",
      "spark plug",
      "motor termic",
      "combustion engine",
    ];

    const naturallyAspiratedKeywords = [
      "aspirat",
      "aspirated",
      "naturally aspirated",
    ];

    const turboKeywords = [
      "turbo",
      "biturbo",
    ];

    const manualTransmissionKeywords = [
      "cutie manuală",
      "cutie manuala",
      "transmisie manuală",
      "transmisie manuala",
      "manual transmission",
      "manual gearbox",
    ];

    const automaticTransmissionKeywords = [
      "cutie automată",
      "cutie automata",
      "transmisie automată",
      "transmisie automata",
      "automatic transmission",
      "automatic gearbox",
    ];

    const hybridDieselKeywords = [
      "hybrid diesel",
      "hibrid diesel",
      "diesel hybrid",
    ];

    const hybridPetrolKeywords = [
      "hybrid petrol",
      "hibrid benzină",
      "hibrid benzina",
      "petrol hybrid",
      "gasoline hybrid",
    ];

    if (
      fuel ===
        "electric" &&
      containsAny(
        combustionKeywords
      )
    ) {
      warnings.push(
        language === "ro"
          ? "Ai selectat un vehicul electric, dar informațiile suplimentare menționează elemente specifice unui motor termic."
          : "You selected an electric vehicle, but the additional information mentions combustion-engine-specific elements."
      );
    }

    if (
      fuel ===
        "petrol" &&
      containsAny(
        hybridDieselKeywords
      )
    ) {
      warnings.push(
        language === "ro"
          ? "Ai selectat benzină, dar informațiile suplimentare descriu un sistem hibrid diesel."
          : "You selected petrol, but the additional information describes a diesel hybrid system."
      );
    }

    if (
      fuel ===
        "diesel" &&
      containsAny(
        hybridPetrolKeywords
      )
    ) {
      warnings.push(
        language === "ro"
          ? "Ai selectat diesel, dar informațiile suplimentare descriu un sistem hibrid pe benzină."
          : "You selected diesel, but the additional information describes a petrol hybrid system."
      );
    }

    if (
      containsAny(
        naturallyAspiratedKeywords
      ) &&
      containsAny(
        turboKeywords
      )
    ) {
      warnings.push(
        language === "ro"
          ? "Motorul este descris simultan ca aspirat și turbo/biturbo."
          : "The engine is described as both naturally aspirated and turbo/biturbo."
      );
    }

    if (
      containsAny(
        manualTransmissionKeywords
      ) &&
      containsAny(
        automaticTransmissionKeywords
      )
    ) {
      warnings.push(
        language === "ro"
          ? "Transmisia este descrisă simultan ca manuală și automată."
          : "The transmission is described as both manual and automatic."
      );
    }

    return warnings;
  }


  const vehicleDataWarnings =
    getVehicleDataWarnings();


  const additionalInfoTags = [
    text.infoMotor,
    text.infoPower,
    text.infoGearbox,
    text.infoDrive,
    text.infoMods,
    text.infoRepairs,
  ];


  const hasVehicle =
    Boolean(
      manufacturer &&
        selectedModelName
    );


  if (
    !selectionReady
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#060912]
        "
      />
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
          max-w-6xl
          px-6
          py-10
          lg:px-10
          lg:py-12
        "
      >
        {/* HEADER */}

        <section>
          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.20em]
              text-blue-300/65
            "
          >
            {text.step}
          </p>

          <div
            className="
              mt-3
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >
            <div>
              <h1
                className="
                  text-4xl
                  font-semibold
                  tracking-[-0.045em]
                  text-white
                  sm:text-[44px]
                "
              >
                {text.title}
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-[15px]
                  leading-7
                  text-zinc-400
                "
              >
                {
                  text.description
                }
              </p>
            </div>

            <button
              type="button"
              onClick={
                openVehicleLibrary
              }
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-4
                py-2.5
                text-[13px]
                font-semibold
                text-zinc-300
                transition
                hover:border-white/[0.14]
                hover:bg-white/[0.05]
                hover:text-white
              "
            >
              <span>
                {
                  text.chooseFromLibrary
                }
              </span>
              <span
                className="
                  text-blue-300
                "
              >
                →
              </span>
            </button>
          </div>
        </section>


        {/* VEHICLE SELECTED / DIRECT SELECTION */}

        {hasVehicle && (
          <section
            className="
              relative
              mt-8
              overflow-hidden
              rounded-[30px]
              border
              border-white/[0.07]
              bg-[linear-gradient(135deg,rgba(12,18,30,0.96),rgba(7,11,19,0.96))]
              p-6
              shadow-[0_24px_70px_rgba(0,0,0,0.20)]
              sm:p-7
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-72
                w-72
                rounded-full
                bg-blue-500/[0.10]
                blur-[90px]
              "
            />

            <div
              className="
                relative
                grid
                gap-6
                lg:grid-cols-[minmax(0,0.9fr)_minmax(380px,1.1fr)]
                lg:items-center
              "
            >
              <div>
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-blue-100/60
                    "
                  >
                    {
                      text.selectedVehicle
                    }
                  </span>

                  <span
                    className="
                      h-1
                      w-1
                      rounded-full
                      bg-zinc-700
                    "
                  />

                  <span
                    className={`
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold
                      ${
                        modelNotListed
                          ? "border-amber-300/12 bg-amber-300/[0.04] text-amber-200/80"
                          : "border-emerald-300/12 bg-emerald-300/[0.04] text-emerald-200/80"
                      }
                    `}
                  >
                    {modelNotListed
                      ? text.manualModelBadge
                      : selectedFromLibrary
                      ? text.selectedFromLibrary
                      : text.exactMatch}
                  </span>
                </div>

                <h2
                  className="
                    mt-4
                    text-[34px]
                    font-semibold
                    tracking-[-0.045em]
                    text-white
                  "
                >
                  {manufacturer}{" "}
                  {
                    selectedModelName
                  }
                </h2>

                {profile && (
                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className="
                        rounded-full
                        border
                        border-blue-400/12
                        bg-blue-500/[0.05]
                        px-3
                        py-1.5
                        text-[11px]
                        font-medium
                        text-blue-100
                      "
                    >
                      {
                        profile.segment
                      }
                    </span>

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-emerald-400/10
                        bg-emerald-400/[0.035]
                        px-3
                        py-1.5
                        text-[11px]
                        font-medium
                        text-emerald-200/80
                      "
                    >
                      <span
                        className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-emerald-400
                        "
                      />
                      {
                        text.catalogProfile
                      }{" "}
                      ·{" "}
                      {
                        text.available
                      }
                    </span>
                  </div>
                )}

                <p
                  className="
                    mt-5
                    max-w-xl
                    text-[13px]
                    leading-6
                    text-zinc-400
                  "
                >
                  {modelNotListed
                    ? text.partialMatchDescription
                    : text.exactMatchDescription}
                </p>

                <button
                  type="button"
                  onClick={
                    openVehicleLibrary
                  }
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.025]
                    px-4
                    py-2.5
                    text-[12px]
                    font-semibold
                    text-zinc-300
                    transition
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  {
                    text.changeVehicle
                  }
                </button>
              </div>

              <div
                className="
                  relative
                  min-h-[250px]
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-white/[0.06]
                  bg-[radial-gradient(circle_at_50%_42%,rgba(59,130,246,0.13),rgba(8,13,24,0.30)_45%,rgba(0,0,0,0.18)_80%)]
                  p-4
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-[0.16]
                    [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
                    [background-size:30px_30px]
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-x-[20%]
                    bottom-7
                    h-6
                    rounded-full
                    bg-black/75
                    blur-2xl
                  "
                />

                {vehicleImage ? (
                  <img
                    src={
                      vehicleImage
                    }
                    alt={`${manufacturer} ${selectedModelName}`}
                    className="
                      relative
                      z-10
                      h-[235px]
                      w-full
                      object-contain
                      object-center
                      drop-shadow-[0_24px_34px_rgba(0,0,0,0.45)]
                    "
                  />
                ) : modelNotListed &&
                  manufacturer ? (
                  <div
                    className="
                      relative
                      z-10
                      flex
                      h-[235px]
                      items-center
                      justify-center
                    "
                  >
                    <BrandMark
                      manufacturer={
                        manufacturer
                      }
                    />
                  </div>
                ) : (
                  <div
                    className="
                      relative
                      z-10
                      flex
                      h-[235px]
                      items-center
                      justify-center
                    "
                  >
                    <div
                      className="
                        flex
                        h-20
                        w-28
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-white/[0.025]
                      "
                    >
                      <svg
                        viewBox="0 0 64 28"
                        fill="none"
                        aria-hidden="true"
                        className="
                          h-10
                          w-16
                          text-blue-200/45
                        "
                      >
                        <path
                          d="M8 19h48M15 18l5-8h21l8 8M18 19a4 4 0 1 0 8 0M43 19a4 4 0 1 0 8 0"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}


        {/* CONFIGURATION */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            mt-8
            grid
            gap-6
            xl:grid-cols-[minmax(0,1fr)_320px]
          "
        >
          <div
            className="
              space-y-6
            "
          >
            <section
              className="
                rounded-[28px]
                border
                border-white/[0.07]
                bg-[#080d18]
                p-6
                sm:p-7
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-blue-100/60
                  "
                >
                  {
                    text.detailsTitle
                  }
                </p>

                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-[13px]
                    leading-6
                    text-zinc-400
                  "
                >
                  {
                    text.detailsDescription
                  }
                </p>
              </div>

              {/* YEAR */}

              <div
                className="
                  mt-7
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <label
                    className="
                      text-[13px]
                      font-semibold
                      text-zinc-200
                    "
                  >
                    {text.year}
                  </label>

                  <span
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.10em]
                      text-zinc-600
                    "
                  >
                    {language ===
                    "ro"
                      ? "Vehicul specific"
                      : "Specific vehicle"}
                  </span>
                </div>

                <div
                  className="
                    mt-3
                    grid
                    gap-3
                    sm:grid-cols-[minmax(0,1fr)_auto]
                    sm:items-center
                  "
                >
                  <select
                    value={
                      year
                    }
                    disabled={
                      yearUnknown
                    }
                    onChange={(
                      event
                    ) => {
                      setYear(
                        event
                          .target
                          .value
                      );
                      setError("");
                    }}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-[#0b111d]
                      px-4
                      text-[14px]
                      text-white
                      outline-none
                      transition
                      disabled:cursor-not-allowed
                      disabled:opacity-35
                      focus:border-blue-400/45
                    "
                  >
                    <option value="">
                      {
                        text.yearPlaceholder
                      }
                    </option>

                    {yearOptions.map(
                      (
                        item
                      ) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>

                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2.5
                      rounded-xl
                      border
                      border-white/[0.07]
                      bg-white/[0.02]
                      px-4
                      py-3
                      text-[12px]
                      text-zinc-300
                    "
                  >
                    <input
                      type="checkbox"
                      checked={
                        yearUnknown
                      }
                      onChange={(
                        event
                      ) => {
                        setYearUnknown(
                          event
                            .target
                            .checked
                        );

                        if (
                          event
                            .target
                            .checked
                        ) {
                          setYear(
                            ""
                          );
                        }
                      }}
                      className="
                        h-4
                        w-4
                        accent-blue-500
                      "
                    />

                    <span>
                      {
                        text.yearUnknown
                      }
                    </span>
                  </label>
                </div>
              </div>


              {/* FUEL */}

              <div
                className="
                  mt-8
                  border-t
                  border-white/[0.06]
                  pt-7
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                  "
                >
                  <div>
                    <label
                      className="
                        text-[13px]
                        font-semibold
                        text-zinc-200
                      "
                    >
                      {text.fuel}
                    </label>

                    <p
                      className="
                        mt-1
                        text-[12px]
                        text-zinc-500
                      "
                    >
                      {
                        text.fuelDescription
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFuelHelpOpen(
                        true
                      )
                    }
                    className="
                      w-fit
                      text-[11px]
                      font-semibold
                      text-blue-200/70
                      transition
                      hover:text-blue-100
                    "
                  >
                    {
                      text.fuelHelp
                    }
                  </button>
                </div>

                <div
                  className="
                    mt-4
                    grid
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-4
                  "
                >
                  {fuelOptions.map(
                    (
                      option
                    ) => {
                      const selected =
                        fuel ===
                        option.value;

                      const label =
                        option.value ===
                        "petrol"
                          ? text.petrol
                          : option.value ===
                            "diesel"
                          ? text.diesel
                          : option.value ===
                            "hybrid"
                          ? text.hybrid
                          : text.electric;

                      return (
                        <button
                          key={
                            option.value
                          }
                          type="button"
                          onClick={() => {
                            setFuel(
                              option.value
                            );
                            setError("");
                          }}
                          className={`
                            group
                            relative
                            overflow-hidden
                            rounded-[18px]
                            border
                            px-4
                            py-4
                            text-left
                            transition
                            ${
                              selected
                                ? "border-blue-400/35 bg-blue-500/[0.09] shadow-[0_14px_32px_rgba(37,99,235,0.10)]"
                                : "border-white/[0.07] bg-white/[0.018] hover:border-white/[0.13] hover:bg-white/[0.035]"
                            }
                          `}
                        >
                          <div
                            className={`
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              border
                              transition
                              ${
                                selected
                                  ? "border-blue-300/20 bg-blue-400/[0.10] text-blue-200"
                                  : "border-white/[0.07] bg-white/[0.025] text-zinc-500 group-hover:text-zinc-300"
                              }
                            `}
                          >
                            <FuelIcon
                              type={
                                option.icon
                              }
                            />
                          </div>

                          <div
                            className="
                              mt-4
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >
                            <span
                              className={`
                                text-[13px]
                                font-semibold
                                ${
                                  selected
                                    ? "text-white"
                                    : "text-zinc-300"
                                }
                              `}
                            >
                              {label}
                            </span>

                            <span
                              className={`
                                h-2
                                w-2
                                rounded-full
                                ${
                                  selected
                                    ? "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.55)]"
                                    : "bg-zinc-800"
                                }
                              `}
                            />
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </section>


            {/* ADDITIONAL INFO */}

            <section
              className="
                rounded-[28px]
                border
                border-white/[0.07]
                bg-[#080d18]
                p-6
                sm:p-7
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-start
                  sm:justify-between
                "
              >
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <h2
                      className="
                        text-[15px]
                        font-semibold
                        text-white
                      "
                    >
                      {
                        text.additionalInfo
                      }
                    </h2>

                    <span
                      className="
                        rounded-full
                        border
                        border-white/[0.07]
                        bg-white/[0.025]
                        px-2
                        py-1
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.08em]
                        text-zinc-500
                      "
                    >
                      {
                        text.optional
                      }
                    </span>
                  </div>

                  <p
                    className="
                      mt-2
                      max-w-2xl
                      text-[12px]
                      leading-5
                      text-zinc-500
                    "
                  >
                    {
                      text.additionalInfoHelp
                    }
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {additionalInfoTags.map(
                  (
                    item
                  ) => (
                    <span
                      key={
                        item
                      }
                      className="
                        rounded-full
                        border
                        border-white/[0.06]
                        bg-white/[0.018]
                        px-2.5
                        py-1.5
                        text-[10px]
                        text-zinc-500
                      "
                    >
                      {item}
                    </span>
                  )
                )}
              </div>

              <textarea
                value={
                  additionalVehicleInfo
                }
                onChange={(
                  event
                ) =>
                  setAdditionalVehicleInfo(
                    event
                      .target
                      .value
                  )
                }
                rows={6}
                placeholder={
                  text.additionalInfoPlaceholder
                }
                className="
                  mt-4
                  w-full
                  resize-none
                  rounded-[18px]
                  border
                  border-white/[0.08]
                  bg-[#0b111d]
                  px-4
                  py-4
                  text-[14px]
                  leading-6
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  focus:border-blue-400/40
                  focus:shadow-[0_0_0_3px_rgba(59,130,246,0.05)]
                "
              />

              {vehicleDataWarnings.length >
                0 && (
                <div
                  className="
                    mt-4
                    rounded-[18px]
                    border
                    border-amber-300/12
                    bg-amber-300/[0.035]
                    p-4
                  "
                >
                  <p
                    className="
                      text-[12px]
                      font-semibold
                      text-amber-100
                    "
                  >
                    {
                      text.dataWarningTitle
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      leading-5
                      text-amber-100/60
                    "
                  >
                    {
                      text.dataWarningDescription
                    }
                  </p>

                  <div
                    className="
                      mt-3
                      space-y-2
                    "
                  >
                    {vehicleDataWarnings.map(
                      (
                        warning
                      ) => (
                        <p
                          key={
                            warning
                          }
                          className="
                            text-[12px]
                            leading-5
                            text-amber-100/80
                          "
                        >
                          •{" "}
                          {
                            warning
                          }
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>


          {/* SUMMARY */}

          <aside
            className="
              h-fit
              rounded-[26px]
              border
              border-white/[0.07]
              bg-[#080d18]
              p-5
              xl:sticky
              xl:top-6
            "
          >
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-blue-100/60
              "
            >
              {text.summary}
            </p>

            <p
              className="
                mt-2
                text-[12px]
                leading-5
                text-zinc-500
              "
            >
              {
                text.summaryDescription
              }
            </p>

            <div
              className="
                mt-5
                divide-y
                divide-white/[0.06]
                rounded-[18px]
                border
                border-white/[0.06]
                bg-black/10
              "
            >
              <div
                className="
                  px-4
                  py-3.5
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.10em]
                    text-zinc-600
                  "
                >
                  {text.family}
                </p>

                <p
                  className="
                    mt-1.5
                    text-[13px]
                    font-medium
                    text-zinc-200
                  "
                >
                  {hasVehicle
                    ? `${manufacturer} ${selectedModelName}`
                    : text.notSet}
                </p>
              </div>

              <div
                className="
                  px-4
                  py-3.5
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.10em]
                    text-zinc-600
                  "
                >
                  {
                    text.exactYear
                  }
                </p>

                <p
                  className="
                    mt-1.5
                    text-[13px]
                    font-medium
                    text-zinc-200
                  "
                >
                  {yearUnknown
                    ? text.unknown
                    : year ||
                      text.notSet}
                </p>
              </div>

              <div
                className="
                  px-4
                  py-3.5
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.10em]
                    text-zinc-600
                  "
                >
                  {
                    text.selectedFuel
                  }
                </p>

                <p
                  className="
                    mt-1.5
                    text-[13px]
                    font-medium
                    text-zinc-200
                  "
                >
                  {
                    getFuelLabel()
                  }
                </p>
              </div>
            </div>

            {error && (
              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-red-400/12
                  bg-red-400/[0.035]
                  px-3.5
                  py-3
                  text-[12px]
                  leading-5
                  text-red-200
                "
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="
                group
                mt-5
                flex
                w-full
                items-center
                justify-between
                rounded-[14px]
                bg-blue-500
                px-4
                py-3.5
                text-[13px]
                font-semibold
                text-white
                shadow-[0_14px_35px_rgba(37,99,235,0.18)]
                transition
                hover:bg-blue-400
                hover:shadow-[0_18px_42px_rgba(37,99,235,0.24)]
              "
            >
              <span>
                {text.continue}
              </span>

              <span
                className="
                  transition-transform
                  group-hover:translate-x-0.5
                "
              >
                →
              </span>
            </button>
          </aside>
        </form>
      </div>


      {/* FUEL HELP MODAL */}

      {fuelHelpOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/75
            px-5
            py-8
            backdrop-blur-sm
          "
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setFuelHelpOpen(
                false
              );
            }
          }}
        >
          <div
            className="
              max-h-[88vh]
              w-full
              max-w-xl
              overflow-y-auto
              rounded-[26px]
              border
              border-white/[0.08]
              bg-[#080d18]
              p-6
              shadow-2xl
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-5
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-blue-200/60
                  "
                >
                  {text.fuel}
                </p>

                <h2
                  className="
                    mt-2
                    text-xl
                    font-semibold
                    text-white
                  "
                >
                  {
                    text.fuelHelpTitle
                  }
                </h2>

                <p
                  className="
                    mt-2
                    text-[13px]
                    leading-6
                    text-zinc-400
                  "
                >
                  {
                    text.fuelHelpIntro
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFuelHelpOpen(
                    false
                  )
                }
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  text-lg
                  text-zinc-500
                  transition
                  hover:text-white
                "
              >
                ×
              </button>
            </div>

            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-2
              "
            >
              {fuelOptions.map(
                (
                  option
                ) => {
                  const label =
                    option.value ===
                    "petrol"
                      ? text.petrol
                      : option.value ===
                        "diesel"
                      ? text.diesel
                      : option.value ===
                        "hybrid"
                      ? text.hybrid
                      : text.electric;

                  const description =
                    option.value ===
                    "petrol"
                      ? language ===
                        "ro"
                        ? "Pe documente poate apărea benzină; la alimentare se folosesc standard combustibili de tip E5/E10."
                        : "Registration documents may indicate petrol; common pump labels include E5/E10."
                      : option.value ===
                        "diesel"
                      ? language ===
                        "ro"
                        ? "În documente sau la clapetă poate apărea Diesel / Motorină."
                        : "Documents or the fuel door may indicate Diesel."
                      : option.value ===
                        "hybrid"
                      ? language ===
                        "ro"
                        ? "Folosește un motor termic împreună cu un sistem electric; poate apărea Hybrid, HEV sau PHEV."
                        : "Combines a combustion engine with an electric system; Hybrid, HEV or PHEV may be shown."
                      : language ===
                        "ro"
                      ? "Este propulsat electric și are port de încărcare pentru bateria de tracțiune."
                      : "Powered electrically and has a charging port for the traction battery.";

                  return (
                    <div
                      key={
                        option.value
                      }
                      className="
                        rounded-[18px]
                        border
                        border-white/[0.06]
                        bg-white/[0.018]
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-blue-400/10
                          bg-blue-500/[0.045]
                          text-blue-200
                        "
                      >
                        <FuelIcon
                          type={
                            option.icon
                          }
                        />
                      </div>

                      <p
                        className="
                          mt-3
                          text-[13px]
                          font-semibold
                          text-white
                        "
                      >
                        {label}
                      </p>

                      <p
                        className="
                          mt-1.5
                          text-[12px]
                          leading-5
                          text-zinc-500
                        "
                      >
                        {
                          description
                        }
                      </p>
                    </div>
                  );
                }
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setFuelHelpOpen(
                  false
                )
              }
              className="
                mt-6
                w-full
                rounded-xl
                bg-white
                px-5
                py-3
                text-[13px]
                font-semibold
                text-black
                transition
                hover:bg-zinc-200
              "
            >
              {text.gotIt}
            </button>
          </div>
        </div>
      )}


      {/* CONFIRMATION MODAL */}

      {showConfirmation && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/75
            px-5
            py-8
            backdrop-blur-sm
          "
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowConfirmation(
                false
              );
            }
          }}
        >
          <div
            className="
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-[28px]
              border
              border-white/[0.08]
              bg-[#080d18]
              p-6
              shadow-[0_30px_100px_rgba(0,0,0,0.55)]
              sm:p-7
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-5
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-blue-200/60
                  "
                >
                  {
                    text.confirmation
                  }
                </p>

                <h2
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    tracking-[-0.03em]
                    text-white
                  "
                >
                  {
                    text.confirmationTitle
                  }
                </h2>

                <p
                  className="
                    mt-2
                    text-[13px]
                    leading-6
                    text-zinc-400
                  "
                >
                  {
                    text.confirmationDescription
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowConfirmation(
                    false
                  )
                }
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  text-lg
                  text-zinc-500
                  transition
                  hover:text-white
                "
              >
                ×
              </button>
            </div>

            <div
              className="
                mt-6
                grid
                gap-4
                sm:grid-cols-[150px_1fr]
                sm:items-center
              "
            >
              <div
                className="
                  relative
                  h-[110px]
                  overflow-hidden
                  rounded-[18px]
                  border
                  border-white/[0.06]
                  bg-[radial-gradient(circle_at_50%_45%,rgba(59,130,246,0.12),rgba(0,0,0,0.1)_65%)]
                "
              >
                {vehicleImage ? (
                  <img
                    src={
                      vehicleImage
                    }
                    alt={`${manufacturer} ${selectedModelName}`}
                    className="
                      h-full
                      w-full
                      object-contain
                      p-2
                    "
                  />
                ) : modelNotListed &&
                  manufacturer ? (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                    "
                  >
                    <BrandMark
                      manufacturer={
                        manufacturer
                      }
                      compact
                    />
                  </div>
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                      text-zinc-700
                    "
                  >
                    AUTO
                  </div>
                )}
              </div>

              <div>
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-white
                    "
                  >
                    {manufacturer}{" "}
                    {
                      selectedModelName
                    }
                  </h3>

                  <span
                    className={`
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold
                      ${
                        modelNotListed
                          ? "border-amber-300/12 bg-amber-300/[0.04] text-amber-200/80"
                          : "border-emerald-300/12 bg-emerald-300/[0.04] text-emerald-200/80"
                      }
                    `}
                  >
                    {modelNotListed
                      ? text.partialMatch
                      : text.exactMatch}
                  </span>
                </div>

                <p
                  className="
                    mt-2
                    text-[12px]
                    leading-5
                    text-zinc-500
                  "
                >
                  {modelNotListed
                    ? text.partialMatchDescription
                    : text.exactMatchDescription}
                </p>
              </div>
            </div>

            <div
              className="
                mt-5
                grid
                gap-3
                sm:grid-cols-2
              "
            >
              <div
                className="
                  rounded-[16px]
                  border
                  border-white/[0.06]
                  bg-black/10
                  px-4
                  py-3.5
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.10em]
                    text-zinc-600
                  "
                >
                  {text.exactYear}
                </p>

                <p
                  className="
                    mt-1.5
                    text-[13px]
                    font-medium
                    text-zinc-200
                  "
                >
                  {yearUnknown
                    ? text.unknown
                    : year ||
                      text.unknown}
                </p>
              </div>

              <div
                className="
                  rounded-[16px]
                  border
                  border-white/[0.06]
                  bg-black/10
                  px-4
                  py-3.5
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.10em]
                    text-zinc-600
                  "
                >
                  {
                    text.selectedFuel
                  }
                </p>

                <p
                  className="
                    mt-1.5
                    text-[13px]
                    font-medium
                    text-zinc-200
                  "
                >
                  {
                    getFuelLabel()
                  }
                </p>
              </div>
            </div>

            {additionalVehicleInfo.trim() && (
              <div
                className="
                  mt-4
                  rounded-[16px]
                  border
                  border-white/[0.06]
                  bg-black/10
                  px-4
                  py-4
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.10em]
                    text-zinc-600
                  "
                >
                  {
                    text.additionalInfo
                  }
                </p>

                <p
                  className="
                    mt-2
                    whitespace-pre-wrap
                    text-[12px]
                    leading-5
                    text-zinc-300
                  "
                >
                  {
                    additionalVehicleInfo.trim()
                  }
                </p>
              </div>
            )}

            {vehicleDataWarnings.length >
              0 && (
              <div
                className="
                  mt-4
                  rounded-[16px]
                  border
                  border-amber-300/12
                  bg-amber-300/[0.035]
                  p-4
                "
              >
                <p
                  className="
                    text-[12px]
                    font-semibold
                    text-amber-100
                  "
                >
                  {
                    text.dataWarningTitle
                  }
                </p>

                <div
                  className="
                    mt-2
                    space-y-1.5
                  "
                >
                  {vehicleDataWarnings.map(
                    (
                      warning
                    ) => (
                      <p
                        key={
                          warning
                        }
                        className="
                          text-[12px]
                          leading-5
                          text-amber-100/75
                        "
                      >
                        •{" "}
                        {
                          warning
                        }
                      </p>
                    )
                  )}
                </div>
              </div>
            )}

            <div
              className="
                mt-6
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowConfirmation(
                    false
                  )
                }
                className="
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  px-5
                  py-3
                  text-[13px]
                  font-semibold
                  text-zinc-300
                  transition
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                {text.back}
              </button>

              <button
                type="button"
                onClick={
                  confirmVehicle
                }
                className="
                  rounded-xl
                  bg-blue-500
                  px-5
                  py-3
                  text-[13px]
                  font-semibold
                  text-white
                  shadow-[0_14px_35px_rgba(37,99,235,0.18)]
                  transition
                  hover:bg-blue-400
                "
              >
                {text.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
