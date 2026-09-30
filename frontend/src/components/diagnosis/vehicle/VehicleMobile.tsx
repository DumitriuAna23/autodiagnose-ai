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

  year?:
    | number
    | null;

  vehicle_context?: {
    additional_information?:
      | string
      | null;
  };
};


const brandLogoSlugs:
  Partial<
    Record<
      Manufacturer,
      string
    >
  > = {
  Audi: "audi",
  BMW: "bmw",
  Ford: "ford",
  "Mercedes-Benz":
    "mercedes",
  Opel: "opel",
  Renault: "renault",
  Skoda: "skoda",
  Toyota: "toyota",
  Volkswagen:
    "volkswagen",
  Volvo: "volvo",
};


function BrandMark({
  manufacturer,
}: {
  manufacturer:
    Manufacturer;
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
      .slice(
        0,
        2
      )
      .map(
        (
          part
        ) =>
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
        src={
          logoUrl
        }
        alt={`${manufacturer} logo`}
        onError={() =>
          setFailed(
            true
          )
        }
        className="
          h-10
          w-16
          object-contain
          opacity-90
        "
      />
    );
  }


  return (
    <span
      className="
        text-[16px]
        font-semibold
        tracking-[0.1em]
        text-zinc-300
      "
    >
      {
        initials
      }
    </span>
  );
}


const fuelOptions: {
  value:
    Exclude<
      FuelType,
      ""
    >;

  icon:
    | "drop"
    | "diesel"
    | "hybrid"
    | "electric";
}[] = [
  {
    value:
      "petrol",

    icon:
      "drop",
  },

  {
    value:
      "diesel",

    icon:
      "diesel",
  },

  {
    value:
      "hybrid",

    icon:
      "hybrid",
  },

  {
    value:
      "electric",

    icon:
      "electric",
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
  if (
    type === "electric"
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-4 w-4"
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


  if (
    type === "hybrid"
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-4 w-4"
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


  if (
    type === "diesel"
  ) {
    return (
      <div
        className="
          flex
          h-4
          w-4
          items-center
          justify-center
          rounded
          border
          border-current/30
          text-[12px]
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
      className="h-4 w-4"
    >
      <path
        d="M12 3.2s5 5.4 5 10a5 5 0 0 1-10 0c0-4.6 5-10 5-10Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}


export default function VehicleMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );


  const [
    manufacturer,
    setManufacturer,
  ] = useState<
    Manufacturer | ""
  >("");


  const [
    model,
    setModel,
  ] = useState("");


  const [
    manualModel,
    setManualModel,
  ] = useState("");


  const [
    modelNotListed,
    setModelNotListed,
  ] = useState(false);


  const [
    fuel,
    setFuel,
  ] = useState<FuelType>(
    ""
  );


  const [
    year,
    setYear,
  ] = useState("");


  const [
    yearUnknown,
    setYearUnknown,
  ] = useState(false);


  const [
    additionalVehicleInfo,
    setAdditionalVehicleInfo,
  ] = useState("");


  const [
    selectedFromLibrary,
    setSelectedFromLibrary,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    fuelHelpOpen,
    setFuelHelpOpen,
  ] = useState(false);


  const [
    showConfirmation,
    setShowConfirmation,
  ] = useState(false);


  const [
    selectionReady,
    setSelectionReady,
  ] = useState(false);


  const text = {
    en: {
      step:
        "STEP 1 OF DIAGNOSIS",

      title:
        "Configure vehicle",

      description:
        "Add the details for the exact vehicle being diagnosed.",

      selectedVehicle:
        "SELECTED VEHICLE",

      selectedFromLibrary:
        "Library model",

      manualModelBadge:
        "Manual model",

      changeVehicle:
        "Change",

      detailsTitle:
        "Vehicle details",

      year:
        "Model year",

      yearPlaceholder:
        "Select year",

      yearUnknown:
        "I don't know the exact year",

      fuel:
        "Fuel type",

      petrol:
        "Petrol",

      diesel:
        "Diesel",

      hybrid:
        "Hybrid",

      electric:
        "Electric",

      fuelHelp:
        "Not sure?",

      additionalInfo:
        "Other vehicle information",

      optional:
        "Optional",

      additionalInfoPlaceholder:
        "2.0 TDI, 150 hp, automatic, Stage 1, recent repairs...",

      additionalInfoHelp:
        "Engine, power, transmission, drivetrain, modifications or recent repairs.",

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

      family:
        "Vehicle",

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
        "Check vehicle",

      confirmationDescription:
        "These details will be used as diagnostic context.",

      exactMatch:
        "Catalog model",

      partialMatch:
        "Manual model",

      exactMatchDescription:
        "Manufacturer and model were selected from the vehicle catalog.",

      partialMatchDescription:
        "The model was entered manually, so model-specific conclusions will be treated more cautiously.",

      back:
        "Back",

      confirm:
        "Confirm and continue",

      dataWarningTitle:
        "Check vehicle information",

      dataWarningDescription:
        "Some information may conflict.",

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
        "ConfigureazÄƒ vehiculul",

      description:
        "CompleteazÄƒ datele vehiculului exact pe care Ã®l diagnostichezi.",

      selectedVehicle:
        "VEHICUL SELECTAT",

      selectedFromLibrary:
        "Model din bibliotecÄƒ",

      manualModelBadge:
        "Model manual",

      changeVehicle:
        "SchimbÄƒ",

      detailsTitle:
        "Detalii vehicul",

      year:
        "An fabricaÈ›ie",

      yearPlaceholder:
        "Alege anul",

      yearUnknown:
        "Nu È™tiu anul exact",

      fuel:
        "Tip combustibil",

      petrol:
        "BenzinÄƒ",

      diesel:
        "Diesel",

      hybrid:
        "Hibrid",

      electric:
        "Electric",

      fuelHelp:
        "Nu eÈ™ti sigur?",

      additionalInfo:
        "Alte informaÈ›ii",

      optional:
        "OpÈ›ional",

      additionalInfoPlaceholder:
        "2.0 TDI, 150 CP, automatÄƒ, Stage 1, reparaÈ›ii recente...",

      additionalInfoHelp:
        "Motor, putere, cutie, tracÈ›iune, modificÄƒri sau reparaÈ›ii recente.",

      infoMotor:
        "motor",

      infoPower:
        "putere",

      infoGearbox:
        "cutie",

      infoDrive:
        "tracÈ›iune",

      infoMods:
        "modificÄƒri",

      infoRepairs:
        "reparaÈ›ii recente",

      summary:
        "Date diagnostic",

      family:
        "Vehicul",

      exactYear:
        "An",

      selectedFuel:
        "Combustibil",

      notSet:
        "Neselectat",

      unknown:
        "Necunoscut",

      continue:
        "ContinuÄƒ la simptome",

      requiredManufacturer:
        "SelecteazÄƒ o marcÄƒ validÄƒ.",

      requiredModel:
        "SelecteazÄƒ sau introdu modelul vehiculului.",

      requiredFuel:
        "SelecteazÄƒ tipul de combustibil.",

      invalidYear:
        "SelecteazÄƒ un an valid.",

      confirmation:
        "CONFIRMARE VEHICUL",

      confirmationTitle:
        "VerificÄƒ vehiculul",

      confirmationDescription:
        "Aceste date vor fi folosite drept context pentru diagnostic.",

      exactMatch:
        "Model din catalog",

      partialMatch:
        "Model manual",

      exactMatchDescription:
        "Marca È™i modelul au fost selectate din catalog.",

      partialMatchDescription:
        "Modelul a fost introdus manual, astfel Ã®ncÃ¢t concluziile specifice vor fi tratate mai prudent.",

      back:
        "ÃŽnapoi",

      confirm:
        "ConfirmÄƒ È™i continuÄƒ",

      dataWarningTitle:
        "VerificÄƒ informaÈ›iile",

      dataWarningDescription:
        "Unele informaÈ›ii se pot contrazice.",

      fuelHelpTitle:
        "Cum identifici tipul de combustibil?",

      fuelHelpIntro:
        "VerificÄƒ eticheta de la clapeta rezervorului, certificatul sau informaÈ›iile vehiculului.",

      gotIt:
        "Am Ã®nÈ›eles",

      catalogProfile:
        "Profil gamÄƒ",

      available:
        "Disponibil",
    },
  }[language];


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
          (
            value
          ) =>
            value >=
            1950
        ),
      [
        currentYear,
      ]
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
      savedLanguage === "ro" ||
      savedLanguage === "en"
    ) {
      setLanguage(
        savedLanguage
      );
    }


    const rawSelection =
      localStorage.getItem(
        "vehicleLibrarySelection"
      );


    if (
      rawSelection
    ) {
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
            setModel(
              ""
            );

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

            setManualModel(
              ""
            );

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
        // Ignore malformed local data.
      }
    }


    const rawVehicle =
      localStorage.getItem(
        "diagnosticVehicle"
      );


    if (
      rawVehicle
    ) {
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
            setModel(
              ""
            );

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

            setManualModel(
              ""
            );

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
            stored.year ===
            null
          ) {
            setYearUnknown(
              true
            );
          }


          const savedInfo =
            stored
              .vehicle_context
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
        // Ignore malformed local data.
      }
    }


    router.replace(
      "/diagnosis/vehicles"
    );

  }, [
    router,
  ]);


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

    setError(
      ""
    );


    if (
      !manufacturer
    ) {
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


    if (
      !fuel
    ) {
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
        Number(
          year
        );


      if (
        numericYear <
          1950 ||
        numericYear >
          currentYear +
            1
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
    if (
      !manufacturer
    ) {
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
          : Number(
              year
            ),

      vehicle_match:
        modelNotListed
          ? "partial"
          : "exact",

      reference_model:
        null,

      vehicle_context: {
        additional_information:
          additionalVehicleInfo
            .trim() ||
          null,
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
        (
          keyword
        ) =>
          info.includes(
            keyword
          )
      );


    const combustionKeywords = [
      "diesel",
      "motorinÄƒ",
      "motorina",
      "benzinÄƒ",
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
      "cutie manualÄƒ",
      "cutie manuala",
      "transmisie manualÄƒ",
      "transmisie manuala",
      "manual transmission",
      "manual gearbox",
    ];


    const automaticTransmissionKeywords = [
      "cutie automatÄƒ",
      "cutie automata",
      "transmisie automatÄƒ",
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
      "hibrid benzinÄƒ",
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
          ? "Ai selectat un vehicul electric, dar informaÈ›iile suplimentare menÈ›ioneazÄƒ elemente specifice unui motor termic."
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
          ? "Ai selectat benzinÄƒ, dar informaÈ›iile suplimentare descriu un sistem hibrid diesel."
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
          ? "Ai selectat diesel, dar informaÈ›iile suplimentare descriu un sistem hibrid pe benzinÄƒ."
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
          ? "Motorul este descris simultan ca aspirat È™i turbo/biturbo."
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
          ? "Transmisia este descrisÄƒ simultan ca manualÄƒ È™i automatÄƒ."
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
      <main className="min-h-screen bg-[#060912]" />
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
        {/* HEADER */}

        <div
          className="
            flex
            items-start
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
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-blue-300/55
              "
            >
              {
                text.step
              }
            </p>

            <h1
              className="
                mt-1.5
                text-[23px]
                font-semibold
                leading-[1.05]
                tracking-[-0.045em]
              "
            >
              {
                text.title
              }
            </h1>

            <p
              className="
                mt-1.5
                text-[12px]
                leading-4
                text-zinc-600
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
              shrink-0
              rounded-[10px]
              border
              border-white/[0.06]
              bg-white/[0.02]
              px-2.5
              py-2
              text-[12px]
              font-semibold
              text-zinc-500
            "
          >
            {
              text.changeVehicle
            }
          </button>
        </div>


        {/* VEHICLE */}

        {hasVehicle && (
          <section
            className="
              mt-3
              overflow-hidden
              rounded-[18px]
              border
              border-blue-400/[0.09]
              bg-[#080d18]
              p-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-[72px]
                  w-[108px]
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[12px]
                  border
                  border-white/[0.05]
                  bg-[radial-gradient(circle_at_50%_45%,rgba(59,130,246,0.11),transparent_70%)]
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
                      p-1
                    "
                  />
                ) : manufacturer ? (
                  <BrandMark
                    manufacturer={
                      manufacturer
                    }
                  />
                ) : null}
              </div>


              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-blue-200/45
                  "
                >
                  {
                    text.selectedVehicle
                  }
                </p>

                <h2
                  className="
                    mt-1
                    truncate
                    text-[14px]
                    font-semibold
                  "
                >
                  {manufacturer}{" "}
                  {
                    selectedModelName
                  }
                </h2>


                <div
                  className="
                    mt-1.5
                    flex
                    flex-wrap
                    items-center
                    gap-1.5
                  "
                >
                  <span
                    className={`
                      rounded-full
                      border
                      px-2
                      py-1
                      text-[12px]
                      font-semibold

                      ${
                        modelNotListed
                          ? "border-amber-300/10 text-amber-200/70"
                          : "border-emerald-300/10 text-emerald-200/70"
                      }
                    `}
                  >
                    {modelNotListed
                      ? text.manualModelBadge
                      : selectedFromLibrary
                      ? text.selectedFromLibrary
                      : text.exactMatch}
                  </span>

                  {profile && (
                    <span
                      className="
                        truncate
                        text-[12px]
                        text-zinc-600
                      "
                    >
                      {
                        profile.segment
                      }
                    </span>
                  )}
                </div>
              </div>
            </div>


            <details
              className="
                mt-2
                border-t
                border-white/[0.045]
                pt-2
              "
            >
              <summary
                className="
                  cursor-pointer
                  select-none
                  text-[12px]
                  font-semibold
                  text-zinc-600
                "
              >
                {modelNotListed
                  ? text.partialMatch
                  : text.exactMatch}
              </summary>

              <p
                className="
                  mt-2
                  text-[12px]
                  leading-3.5
                  text-zinc-600
                "
              >
                {modelNotListed
                  ? text.partialMatchDescription
                  : text.exactMatchDescription}
              </p>
            </details>
          </section>
        )}


        {/* FORM */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            mt-3
          "
        >
          <section
            className="
              rounded-[18px]
              border
              border-white/[0.06]
              bg-[#080d18]
              p-3.5
            "
          >
            <p
              className="
                text-[12px]
                font-semibold
                text-zinc-200
              "
            >
              {
                text.detailsTitle
              }
            </p>


            {/* YEAR */}

            <div
              className="
                mt-3
              "
            >
              <label
                className="
                  text-[12px]
                  font-semibold
                  text-zinc-500
                "
              >
                {
                  text.year
                }
              </label>


              <div
                className="
                  mt-1.5
                  grid
                  grid-cols-[1fr_auto]
                  gap-2
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
                      event.target
                        .value
                    );

                    setError(
                      ""
                    );
                  }}
                  className="
                    h-[40px]
                    min-w-0
                    rounded-[10px]
                    border
                    border-white/[0.07]
                    bg-[#0b111d]
                    px-3
                    text-[12px]
                    text-white
                    outline-none
                    disabled:opacity-35
                    focus:border-blue-400/35
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
                    gap-1.5
                    rounded-[10px]
                    border
                    border-white/[0.06]
                    px-2.5
                    text-[12px]
                    text-zinc-500
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
                        event.target
                          .checked
                      );

                      if (
                        event.target
                          .checked
                      ) {
                        setYear(
                          ""
                        );
                      }
                    }}
                    className="
                      h-3.5
                      w-3.5
                      accent-blue-500
                    "
                  />

                  <span
                    className="
                      max-w-[86px]
                      leading-3
                    "
                  >
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
                mt-3
                border-t
                border-white/[0.045]
                pt-3
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
                <label
                  className="
                    text-[12px]
                    font-semibold
                    text-zinc-500
                  "
                >
                  {
                    text.fuel
                  }
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setFuelHelpOpen(
                      true
                    )
                  }
                  className="
                    text-[12px]
                    font-semibold
                    text-blue-300/55
                  "
                >
                  {
                    text.fuelHelp
                  }
                </button>
              </div>


              <div
                className="
                  mt-2
                  grid
                  grid-cols-4
                  gap-1.5
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

                          setError(
                            ""
                          );
                        }}
                        className={`
                          flex
                          min-w-0
                          flex-col
                          items-center
                          justify-center
                          gap-1.5
                          rounded-[11px]
                          border
                          px-1
                          py-2.5

                          ${
                            selected
                              ? "border-blue-400/30 bg-blue-500/[0.08] text-blue-100"
                              : "border-white/[0.055] bg-black/10 text-zinc-600"
                          }
                        `}
                      >
                        <FuelIcon
                          type={
                            option.icon
                          }
                        />

                        <span
                          className="
                            truncate
                            text-[12px]
                            font-semibold
                          "
                        >
                          {label}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </section>


          {/* ADDITIONAL */}

          <details
            className="
              mt-2
              overflow-hidden
              rounded-[18px]
              border
              border-white/[0.06]
              bg-[#080d18]
            "
          >
            <summary
              className="
                cursor-pointer
                select-none
                px-3.5
                py-3
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
                <div>
                  <p
                    className="
                      text-[12px]
                      font-semibold
                      text-zinc-200
                    "
                  >
                    {
                      text.additionalInfo
                    }
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[12px]
                      text-zinc-600
                    "
                  >
                    {
                      text.additionalInfoHelp
                    }
                  </p>
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-white/[0.05]
                    px-2
                    py-1
                    text-[12px]
                    uppercase
                    text-zinc-700
                  "
                >
                  {
                    text.optional
                  }
                </span>
              </div>
            </summary>


            <div
              className="
                border-t
                border-white/[0.045]
                p-3
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  gap-1
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
                        border-white/[0.05]
                        px-2
                        py-1
                        text-[12px]
                        text-zinc-600
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
                    event.target
                      .value
                  )
                }
                rows={4}
                placeholder={
                  text.additionalInfoPlaceholder
                }
                className="
                  mt-2.5
                  w-full
                  resize-none
                  rounded-[11px]
                  border
                  border-white/[0.07]
                  bg-[#0b111d]
                  px-3
                  py-2.5
                  text-[12px]
                  leading-4
                  text-white
                  outline-none
                  placeholder:text-zinc-700
                  focus:border-blue-400/30
                "
              />


              {vehicleDataWarnings.length >
                0 && (
                <div
                  className="
                    mt-2
                    rounded-[11px]
                    border
                    border-amber-300/10
                    bg-amber-300/[0.03]
                    p-2.5
                  "
                >
                  <p
                    className="
                      text-[12px]
                      font-semibold
                      text-amber-200
                    "
                  >
                    {
                      text.dataWarningTitle
                    }
                  </p>

                  {vehicleDataWarnings.map(
                    (
                      warning
                    ) => (
                      <p
                        key={
                          warning
                        }
                        className="
                          mt-1
                          text-[12px]
                          leading-3.5
                          text-amber-100/65
                        "
                      >
                        â€¢{" "}
                        {
                          warning
                        }
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          </details>


          {/* SUMMARY */}

          <section
            className="
              mt-2
              rounded-[18px]
              border
              border-blue-400/[0.09]
              bg-[#05080e]
              p-3
            "
          >
            <p
              className="
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-blue-200/50
              "
            >
              {
                text.summary
              }
            </p>


            <div
              className="
                mt-2
                grid
                grid-cols-3
                divide-x
                divide-white/[0.045]
                rounded-[11px]
                border
                border-white/[0.05]
              "
            >
              <div
                className="
                  min-w-0
                  px-2
                  py-2
                "
              >
                <p
                  className="
                    text-[12px]
                    uppercase
                    text-zinc-700
                  "
                >
                  {
                    text.family
                  }
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-[12px]
                    font-semibold
                    text-zinc-300
                  "
                >
                  {hasVehicle
                    ? `${manufacturer} ${selectedModelName}`
                    : text.notSet}
                </p>
              </div>


              <div
                className="
                  min-w-0
                  px-2
                  py-2
                "
              >
                <p
                  className="
                    text-[12px]
                    uppercase
                    text-zinc-700
                  "
                >
                  {
                    text.exactYear
                  }
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-[12px]
                    font-semibold
                    text-zinc-300
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
                  min-w-0
                  px-2
                  py-2
                "
              >
                <p
                  className="
                    text-[12px]
                    uppercase
                    text-zinc-700
                  "
                >
                  {
                    text.selectedFuel
                  }
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-[12px]
                    font-semibold
                    text-zinc-300
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
                  mt-2
                  rounded-[10px]
                  border
                  border-red-400/10
                  bg-red-400/[0.03]
                  px-3
                  py-2
                  text-[12px]
                  text-red-200
                "
              >
                {error}
              </div>
            )}


            <button
              type="submit"
              className="
                mt-2
                flex
                min-h-[42px]
                w-full
                items-center
                justify-between
                rounded-[11px]
                bg-blue-500
                px-3.5
                text-[12px]
                font-semibold
                text-white
                shadow-[0_10px_25px_rgba(37,99,235,0.15)]
              "
            >
              <span>
                {
                  text.continue
                }
              </span>

              <span>
                â†’
              </span>
            </button>
          </section>
        </form>
      </div>


      {/* FUEL HELP */}

      {fuelHelpOpen && (
        <div
          className="
      fixed
      inset-0
      z-[100]
      flex
      items-center
      justify-center
      bg-black/75
      px-3
      py-4
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
              mx-auto
              max-h-[82dvh]
              w-full
              max-w-[520px]
              overflow-y-auto
              rounded-[22px]
              border
              border-white/[0.07]
              bg-[#080d18]
              p-4
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div>
                <p
                  className="
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-blue-200/50
                  "
                >
                  {
                    text.fuel
                  }
                </p>

                <h2
                  className="
                    mt-1
                    text-[15px]
                    font-semibold
                  "
                >
                  {
                    text.fuelHelpTitle
                  }
                </h2>

                <p
                  className="
                    mt-1
                    text-[12px]
                    leading-4
                    text-zinc-600
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
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-[9px]
                  border
                  border-white/[0.06]
                  text-zinc-500
                "
              >
                Ã—
              </button>
            </div>


            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-2
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
                        ? "ÃŽn acte poate apÄƒrea BenzinÄƒ; la pompÄƒ E5/E10."
                        : "Documents may show Petrol; common labels are E5/E10."
                      : option.value ===
                        "diesel"
                      ? language ===
                        "ro"
                        ? "ÃŽn acte sau la clapetÄƒ poate apÄƒrea Diesel / MotorinÄƒ."
                        : "Documents or fuel door may show Diesel."
                      : option.value ===
                        "hybrid"
                      ? language ===
                        "ro"
                        ? "Motor termic + sistem electric; HEV sau PHEV."
                        : "Combustion engine plus electric system; HEV or PHEV."
                      : language ===
                        "ro"
                      ? "Propulsie electricÄƒ È™i port de Ã®ncÄƒrcare."
                      : "Electric propulsion with a traction-battery charging port.";


                  return (
                    <div
                      key={
                        option.value
                      }
                      className="
                        rounded-[13px]
                        border
                        border-white/[0.055]
                        bg-black/10
                        p-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-[8px]
                          border
                          border-blue-400/10
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
                          mt-2
                          text-[12px]
                          font-semibold
                        "
                      >
                        {label}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[12px]
                          leading-3.5
                          text-zinc-600
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
                mt-3
                min-h-[40px]
                w-full
                rounded-[10px]
                bg-white
                text-[12px]
                font-semibold
                text-black
              "
            >
              {
                text.gotIt
              }
            </button>
          </div>
        </div>
      )}


      {/* CONFIRMATION */}

      {showConfirmation && (
        <div
          className="
      fixed
      inset-0
      z-[100]
      flex
      items-center
      justify-center
      bg-black/75
      px-3
      py-4
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
              mx-auto
              max-h-[86dvh]
              w-full
              max-w-[520px]
              overflow-y-auto
              rounded-[22px]
              border
              border-white/[0.07]
              bg-[#080d18]
              p-4
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div>
                <p
                  className="
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-blue-200/50
                  "
                >
                  {
                    text.confirmation
                  }
                </p>

                <h2
                  className="
                    mt-1
                    text-[16px]
                    font-semibold
                  "
                >
                  {
                    text.confirmationTitle
                  }
                </h2>

                <p
                  className="
                    mt-1
                    text-[12px]
                    leading-3.5
                    text-zinc-600
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
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-[9px]
                  border
                  border-white/[0.06]
                  text-zinc-500
                "
              >
                Ã—
              </button>
            </div>


            <div
              className="
                mt-3
                flex
                items-center
                gap-3
                rounded-[14px]
                border
                border-white/[0.055]
                bg-black/10
                p-2.5
              "
            >
              <div
                className="
                  flex
                  h-[66px]
                  w-[100px]
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[10px]
                  border
                  border-white/[0.05]
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
                      p-1
                    "
                  />
                ) : manufacturer ? (
                  <BrandMark
                    manufacturer={
                      manufacturer
                    }
                  />
                ) : null}
              </div>


              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    truncate
                    text-[12px]
                    font-semibold
                  "
                >
                  {manufacturer}{" "}
                  {
                    selectedModelName
                  }
                </p>

                <span
                  className={`
                    mt-1
                    inline-block
                    rounded-full
                    border
                    px-2
                    py-1
                    text-[12px]
                    font-semibold

                    ${
                      modelNotListed
                        ? "border-amber-300/10 text-amber-200"
                        : "border-emerald-300/10 text-emerald-200"
                    }
                  `}
                >
                  {modelNotListed
                    ? text.partialMatch
                    : text.exactMatch}
                </span>
              </div>
            </div>


            <div
              className="
                mt-2
                grid
                grid-cols-2
                gap-2
              "
            >
              <div
                className="
                  rounded-[11px]
                  border
                  border-white/[0.05]
                  bg-black/10
                  px-3
                  py-2
                "
              >
                <p
                  className="
                    text-[12px]
                    uppercase
                    text-zinc-700
                  "
                >
                  {
                    text.exactYear
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-[12px]
                    font-semibold
                    text-zinc-300
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
                  rounded-[11px]
                  border
                  border-white/[0.05]
                  bg-black/10
                  px-3
                  py-2
                "
              >
                <p
                  className="
                    text-[12px]
                    uppercase
                    text-zinc-700
                  "
                >
                  {
                    text.selectedFuel
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-[12px]
                    font-semibold
                    text-zinc-300
                  "
                >
                  {
                    getFuelLabel()
                  }
                </p>
              </div>
            </div>


            {additionalVehicleInfo.trim() && (
              <details
                className="
                  mt-2
                  rounded-[11px]
                  border
                  border-white/[0.05]
                  bg-black/10
                "
              >
                <summary
                  className="
                    cursor-pointer
                    px-3
                    py-2
                    text-[12px]
                    font-semibold
                    text-zinc-600
                  "
                >
                  {
                    text.additionalInfo
                  }
                </summary>

                <p
                  className="
                    border-t
                    border-white/[0.04]
                    px-3
                    py-2.5
                    whitespace-pre-wrap
                    text-[12px]
                    leading-3.5
                    text-zinc-500
                  "
                >
                  {
                    additionalVehicleInfo.trim()
                  }
                </p>
              </details>
            )}


            {vehicleDataWarnings.length >
              0 && (
              <div
                className="
                  mt-2
                  rounded-[11px]
                  border
                  border-amber-300/10
                  bg-amber-300/[0.03]
                  p-2.5
                "
              >
                <p
                  className="
                    text-[12px]
                    font-semibold
                    text-amber-200
                  "
                >
                  {
                    text.dataWarningTitle
                  }
                </p>

                {vehicleDataWarnings.map(
                  (
                    warning
                  ) => (
                    <p
                      key={
                        warning
                      }
                      className="
                        mt-1
                        text-[12px]
                        leading-3.5
                        text-amber-100/65
                      "
                    >
                      â€¢{" "}
                      {
                        warning
                      }
                    </p>
                  )
                )}
              </div>
            )}


            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-2
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
                  min-h-[40px]
                  rounded-[10px]
                  border
                  border-white/[0.07]
                  text-[12px]
                  font-semibold
                  text-zinc-400
                "
              >
                {
                  text.back
                }
              </button>


              <button
                type="button"
                onClick={
                  confirmVehicle
                }
                className="
                  min-h-[40px]
                  rounded-[10px]
                  bg-blue-500
                  text-[12px]
                  font-semibold
                  text-white
                "
              >
                {
                  text.confirm
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

