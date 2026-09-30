"use client";

// VEHICLE LIBRARY FINAL: brand cards -> click brand -> show models

import {
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
  getLocalizedVehicleProfile,
  vehicleFamilyProfiles,
} from "@/data/vehicleProfiles";

import {
  getVehicleImage,
} from "@/data/vehicleImages";


type Language =
  | "ro"
  | "en";


/*
 * Monochrome brand logos are loaded from the Simple Icons CDN.
 * Unknown / unsupported brands automatically fall back to initials.
 *
 * For production, you can later download the SVGs into:
 * public/brand-logos/
 * and replace these URLs with local paths.
 */
const brandLogoSlugs: Record<
  string,
  string
> = {
  Audi: "audi",
  BMW: "bmw",
  "Mercedes-Benz": "mercedes",
  Mercedes: "mercedes",
  Volkswagen: "volkswagen",
  Volvo: "volvo",
  Toyota: "toyota",
  Honda: "honda",
  Ford: "ford",
  Renault: "renault",
  Peugeot: "peugeot",
  Citroen: "citroen",
  Citroën: "citroen",
  Skoda: "skoda",
  Škoda: "skoda",
  SEAT: "seat",
  Seat: "seat",
  CUPRA: "cupra",
  Cupra: "cupra",
  Opel: "opel",
  Hyundai: "hyundai",
  Kia: "kia",
  Nissan: "nissan",
  Mazda: "mazda",
  Mitsubishi: "mitsubishi",
  Subaru: "subaru",
  Suzuki: "suzuki",
  Fiat: "fiat",
  "Alfa Romeo": "alfaromeo",
  Jeep: "jeep",
  "Land Rover": "landrover",
  Porsche: "porsche",
  Tesla: "tesla",
  Dacia: "dacia",
  MINI: "mini",
  Mini: "mini",
  Lexus: "lexus",
  Infiniti: "infiniti",
  Chevrolet: "chevrolet",
  Cadillac: "cadillac",
  Dodge: "dodge",
  Jaguar: "jaguar",
  Ferrari: "ferrari",
  Lamborghini: "lamborghini",
  Maserati: "maserati",
  Bentley: "bentley",
  "Rolls-Royce": "rollsroyce",
  "Aston Martin": "astonmartin",
  McLaren: "mclaren",
  Acura: "acura",
  GMC: "gmc",
  Buick: "buick",
  Genesis: "genesis",
  Smart: "smart",
  smart: "smart",
  Saab: "saab",
  Lancia: "lancia",
};


function getInitials(
  value: string
) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part.charAt(0)
    )
    .join("")
    .toUpperCase();
}


function BrandLogo({
  manufacturer,
  size = "normal",
}: {
  manufacturer: string;
  size?: "normal" | "large";
}) {
  const [
    failed,
    setFailed,
  ] =
    useState(false);


  const slug =
    brandLogoSlugs[
      manufacturer
    ];


  const logoUrl =
    slug
      ? `https://cdn.simpleicons.org/${slug}/ffffff`
      : null;


  const dimensions =
    size === "large"
      ? "h-16 w-16"
      : "h-12 w-12";


  const imageDimensions =
    size === "large"
      ? "h-9 w-9"
      : "h-7 w-7";


  return (
    <div
      className={`
        flex
        ${dimensions}
        shrink-0
        items-center
        justify-center
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
      `}
    >
      {!failed &&
      logoUrl ? (
        <img
          src={logoUrl}
          alt={`${manufacturer} logo`}
          className={`
            ${imageDimensions}
            object-contain
            opacity-90
          `}
          loading="lazy"
          onError={() =>
            setFailed(true)
          }
        />
      ) : (
        <span
          className="
            text-[11px]
            font-bold
            tracking-[0.08em]
            text-zinc-300
          "
        >
          {getInitials(
            manufacturer
          )}
        </span>
      )}
    </div>
  );
}


export default function VehicleLibraryPage() {
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
    query,
    setQuery,
  ] =
    useState("");


  const [
    selectedManufacturer,
    setSelectedManufacturer,
  ] =
    useState<
      Manufacturer | null
    >(null);


  const [
    manualModel,
    setManualModel,
  ] =
    useState("");


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
  }, []);


  const content = {
    en: {
      eyebrow:
        "VEHICLE LIBRARY",

      title:
        "Explore vehicle families",

      description:
        "Choose a manufacturer to open its model family. The library stays generation-neutral, so it focuses on traits shared across the range rather than a specific production year.",

      searchPlaceholder:
        "Search manufacturer or model...",

      manufacturers:
        "Manufacturers",

      manufacturer:
        "manufacturer",

      modelFamilies:
        "Model families",

      models:
        "models",

      model:
        "model",

      chooseBrand:
        "Choose a manufacturer",

      chooseBrandDescription:
        "Select a brand below to reveal the model families currently available in the catalog.",

      selectedRange:
        "Selected manufacturer",

      changeBrand:
        "Close models",

      commonProfile:
        "Family profile",

      traits:
        "Common traits",

      profileUnavailable:
        "Verified family profile not added yet.",

      profileUnavailableDescription:
        "The model is already available in the catalog. Shared characteristics will appear here after they are verified.",

      verifiedProfile:
        "Family profile available",

      noResults:
        "No manufacturer or model matches your search.",

      noModels:
        "No model matches the current search for this manufacturer.",

      back:
        "Back to dashboard",

      dataRule:
        "No year-specific specifications are shown in this library.",

      searchHint:
        "You can also search for a model name; the matching manufacturer will remain visible.",

      openDiagnosis:
        "Start diagnosis",

      brandModels:
        "View models",

      clearSearch:
        "Clear search",

      modelNotListed:
        "Model not listed?",

      modelNotListedDescription:
        "Enter the model manually. It will be marked as unverified until technical data is confirmed.",

      manualModelPlaceholder:
        "e.g. Golf Plus",

      useManualModel:
        "Use this model",

      manualModelRequired:
        "Enter a model name first.",
    },

    ro: {
      eyebrow:
        "BIBLIOTECĂ VEHICULE",

      title:
        "Explorează gamele de vehicule",

      description:
        "Alege o marcă pentru a deschide familia ei de modele. Biblioteca rămâne independentă de generație și pune accent pe trăsăturile comune ale gamei, nu pe un anumit an.",

      searchPlaceholder:
        "Caută marcă sau model...",

      manufacturers:
        "Mărci",

      manufacturer:
        "marcă",

      modelFamilies:
        "Familii de modele",

      models:
        "modele",

      model:
        "model",

      chooseBrand:
        "Alege o marcă",

      chooseBrandDescription:
        "Apasă pe una dintre mărcile de mai jos pentru a vedea modelele disponibile în catalog.",

      selectedRange:
        "Marcă selectată",

      changeBrand:
        "Închide modelele",

      commonProfile:
        "Profilul gamei",

      traits:
        "Trăsături comune",

      profileUnavailable:
        "Profilul verificat al gamei nu este încă adăugat.",

      profileUnavailableDescription:
        "Modelul este deja disponibil în catalog. Caracteristicile comune vor apărea aici după verificare.",

      verifiedProfile:
        "Profil de gamă disponibil",

      noResults:
        "Nicio marcă sau model nu corespunde căutării.",

      noModels:
        "Niciun model al acestei mărci nu corespunde căutării.",

      back:
        "Înapoi la panou",

      dataRule:
        "În această bibliotecă nu afișăm specificații dependente de an.",

      searchHint:
        "Poți căuta și direct un model; marca lui va rămâne vizibilă.",

      openDiagnosis:
        "Începe diagnostic",

      brandModels:
        "Vezi modelele",

      clearSearch:
        "Șterge căutarea",

      modelNotListed:
        "Modelul nu apare?",

      modelNotListedDescription:
        "Introdu modelul manual. Va fi marcat ca neverificat până când datele tehnice sunt confirmate.",

      manualModelPlaceholder:
        "ex. Golf Plus",

      useManualModel:
        "Folosește acest model",

      manualModelRequired:
        "Introdu mai întâi numele modelului.",
    },
  };


  const text =
    content[language];


  const manufacturers =
    Object.keys(
      vehicleCatalog
    ) as Manufacturer[];


  const totalFamilies =
    manufacturers.reduce(
      (
        total,
        manufacturer
      ) =>
        total +
        vehicleCatalog[
          manufacturer
        ].length,
      0
    );


  const filteredManufacturers =
    useMemo(
      () => {
        const normalized =
          query
            .trim()
            .toLowerCase();


        if (
          !normalized
        ) {
          return manufacturers;
        }


        return manufacturers.filter(
          (
            manufacturer
          ) => {
            const brandMatch =
              manufacturer
                .toLowerCase()
                .includes(
                  normalized
                );


            const modelMatch =
              vehicleCatalog[
                manufacturer
              ].some(
                (
                  model
                ) =>
                  model
                    .toLowerCase()
                    .includes(
                      normalized
                    )
              );


            return (
              brandMatch ||
              modelMatch
            );
          }
        );
      },
      [
        query,
        manufacturers,
      ]
    );


  const selectedModels =
    useMemo(
      () => {
        if (
          !selectedManufacturer
        ) {
          return [];
        }


        const models =
          vehicleCatalog[
            selectedManufacturer
          ];


        const normalized =
          query
            .trim()
            .toLowerCase();


        if (
          !normalized
        ) {
          return models;
        }


        const brandMatches =
          selectedManufacturer
            .toLowerCase()
            .includes(
              normalized
            );


        if (
          brandMatches
        ) {
          return models;
        }


        return models.filter(
          (
            model
          ) =>
            model
              .toLowerCase()
              .includes(
                normalized
              )
        );
      },
      [
        selectedManufacturer,
        query,
      ]
    );


  function selectManufacturer(
    manufacturer:
      Manufacturer
  ) {
    setManualModel("");

    setSelectedManufacturer(
      (
        current
      ) =>
        current ===
        manufacturer
          ? null
          : manufacturer
    );


    window.setTimeout(
      () => {
        document
          .getElementById(
            "vehicle-models-section"
          )
          ?.scrollIntoView({
            behavior:
              "smooth",
            block:
              "start",
          });
      },
      80
    );
  }


  function startDiagnosis(
    manufacturer:
      Manufacturer,
    model:
      string
  ) {
    localStorage.setItem(
      "vehicleLibrarySelection",
      JSON.stringify({
        manufacturer,
        model,
      })
    );


    router.push(
      "/diagnosis/vehicle"
    );
  }


  function startManualDiagnosis() {
    if (
      !selectedManufacturer ||
      !manualModel.trim()
    ) {
      return;
    }


    localStorage.setItem(
      "vehicleLibrarySelection",
      JSON.stringify({
        manufacturer:
          selectedManufacturer,
        model:
          manualModel.trim(),
        model_verified:
          false,
      })
    );


    router.push(
      "/diagnosis/vehicle"
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
      <div className="ad-page">

        {/* HERO */}

        <section
          className="
            ad-surface
            relative
            overflow-hidden
            rounded-[30px]
            p-7
            sm:p-9
            lg:p-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-blue-500/[0.09]
              blur-[95px]
            "
          />


          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              h-64
              w-64
              rounded-full
              bg-cyan-300/[0.035]
              blur-[85px]
            "
          />


          <div
            className="
              relative
              grid
              gap-8
              lg:grid-cols-[minmax(0,1fr)_320px]
              lg:items-end
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-blue-400/15
                  bg-blue-500/[0.05]
                  px-3.5
                  py-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-blue-400
                    shadow-[0_0_12px_rgba(96,165,250,0.65)]
                  "
                />

                <span
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-blue-100/80
                  "
                >
                  {text.eyebrow}
                </span>
              </div>


              <h1
                className="
                  mt-6
                  max-w-3xl
                  text-[2.25rem]
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.04em]
                  text-white
                  sm:text-[2.9rem]
                "
              >
                {text.title}
              </h1>


              <p
                className="
                  mt-4
                  max-w-3xl
                  text-[16px]
                  leading-7
                  text-zinc-300
                "
              >
                {text.description}
              </p>
            </div>


            <div
              className="
                rounded-[24px]
                border
                border-white/[0.06]
                bg-black/10
                p-5
              "
            >
              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <div
                  className="
                    rounded-2xl
                    border
                    border-white/[0.055]
                    bg-white/[0.015]
                    p-4
                  "
                >
                  <p
                    className="
                      text-[29px]
                      font-semibold
                      tracking-[-0.04em]
                      text-white
                    "
                  >
                    {
                      manufacturers.length
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      text-[12px]
                      text-zinc-400
                    "
                  >
                    {text.manufacturers}
                  </p>
                </div>


                <div
                  className="
                    rounded-2xl
                    border
                    border-white/[0.055]
                    bg-white/[0.015]
                    p-4
                  "
                >
                  <p
                    className="
                      text-[29px]
                      font-semibold
                      tracking-[-0.04em]
                      text-white
                    "
                  >
                    {
                      totalFamilies
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      text-[12px]
                      text-zinc-400
                    "
                  >
                    {text.modelFamilies}
                  </p>
                </div>
              </div>


              <p
                className="
                  mt-4
                  text-[12px]
                  leading-5
                  text-zinc-500
                "
              >
                {text.dataRule}
              </p>
            </div>
          </div>
        </section>


        {/* SEARCH */}

        <section
          className="
            ad-surface
            mt-6
            rounded-[24px]
            p-4
            sm:p-5
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                w-full
                lg:max-w-xl
              "
            >
              <div
                className="
                  flex
                  min-h-12
                  items-center
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-black/10
                  px-4
                  transition
                  focus-within:border-blue-400/25
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="
                    h-4
                    w-4
                    shrink-0
                    text-zinc-500
                  "
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />

                  <path
                    d="m20 20-3.5-3.5"
                    strokeLinecap="round"
                  />
                </svg>


                <input
                  type="search"
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
                    px-3
                    text-[14px]
                    text-white
                    outline-none
                    placeholder:text-zinc-600
                  "
                />


                {query && (
                  <button
                    type="button"
                    onClick={() =>
                      setQuery(
                        ""
                      )
                    }
                    className="
                      text-[12px]
                      font-semibold
                      text-zinc-500
                      transition
                      hover:text-white
                    "
                  >
                    ×
                  </button>
                )}
              </div>


              <p
                className="
                  mt-2
                  text-[11px]
                  text-zinc-600
                "
              >
                {text.searchHint}
              </p>
            </div>


            <div
              className="
                inline-flex
                w-fit
                rounded-xl
                border
                border-white/[0.07]
                bg-black/10
                p-1
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
                    onClick={() => {
                      setLanguage(
                        item
                      );

                      localStorage.setItem(
                        "language",
                        item
                      );
                    }}
                    className={`
                      rounded-lg
                      px-3
                      py-2
                      text-[12px]
                      font-semibold
                      transition
                      ${
                        language ===
                        item
                          ? "bg-white/[0.08] text-white"
                          : "text-zinc-500 hover:text-zinc-200"
                      }
                    `}
                  >
                    {
                      item.toUpperCase()
                    }
                  </button>
                )
              )}
            </div>
          </div>
        </section>


        {/* BRANDS */}

        <section
          className="
            mt-8
          "
        >
          <div
            className="
              mb-5
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-blue-100/65
                "
              >
                {text.manufacturers}
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
                {text.chooseBrand}
              </h2>

              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-blue-200/45">
                BRAND SELECTOR
              </p>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-[14px]
                  leading-6
                  text-zinc-400
                "
              >
                {
                  text.chooseBrandDescription
                }
              </p>
            </div>


            <span
              className="
                text-[12px]
                font-medium
                text-zinc-500
              "
            >
              {
                filteredManufacturers.length
              }{" "}
              {filteredManufacturers.length ===
              1
                ? text.manufacturer
                : text.manufacturers.toLowerCase()}
            </span>
          </div>


          {filteredManufacturers.length >
          0 ? (
            <div
              className="
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
                2xl:grid-cols-4
              "
            >
              {filteredManufacturers.map(
                (
                  manufacturer
                ) => {
                  const selected =
                    selectedManufacturer ===
                    manufacturer;


                  const modelCount =
                    vehicleCatalog[
                      manufacturer
                    ].length;


                  const profileCount =
                    vehicleCatalog[
                      manufacturer
                    ].filter(
                      (
                        model
                      ) =>
                        Boolean(
                          vehicleFamilyProfiles[
                            manufacturer
                          ]?.[
                            model
                          ]
                        )
                    ).length;


                  return (
                    <button
                      key={
                        manufacturer
                      }
                      type="button"
                      onClick={() =>
                        selectManufacturer(
                          manufacturer
                        )
                      }
                      className={`
                        group
                        relative
                        overflow-hidden
                        rounded-[22px]
                        border
                        p-4
                        text-left
                        transition-all
                        duration-200
                        ${
                          selected
                            ? "border-blue-400/25 bg-blue-500/[0.055] shadow-[0_18px_45px_rgba(37,99,235,0.08)]"
                            : "border-white/[0.06] bg-[#080d18] hover:-translate-y-0.5 hover:border-white/[0.11] hover:bg-white/[0.018]"
                        }
                      `}
                    >
                      <div
                        className={`
                          pointer-events-none
                          absolute
                          -right-12
                          -top-14
                          h-32
                          w-32
                          rounded-full
                          blur-[50px]
                          transition
                          ${
                            selected
                              ? "bg-blue-500/[0.11]"
                              : "bg-blue-500/[0.035] group-hover:bg-blue-500/[0.06]"
                          }
                        `}
                      />


                      <div
                        className="
                          relative
                          flex
                          items-center
                          gap-4
                        "
                      >
                        <BrandLogo
                          manufacturer={
                            manufacturer
                          }
                        />


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <h3
                            className="
                              truncate
                              text-[16px]
                              font-semibold
                              tracking-[-0.02em]
                              text-white
                            "
                          >
                            {
                              manufacturer
                            }
                          </h3>


                          <div
                            className="
                              mt-1.5
                              flex
                              flex-wrap
                              items-center
                              gap-x-3
                              gap-y-1
                              text-[11px]
                              text-zinc-500
                            "
                          >
                            <span>
                              {modelCount} {Number(modelCount) === 1 ? text.model : text.models}
                            </span>


                            {profileCount >
                              0 && (
                              <>
                                <span
                                  className="
                                    text-zinc-700
                                  "
                                >
                                  •
                                </span>

                                <span
                                  className="
                                    text-emerald-300/70
                                  "
                                >
                                  {
                                    profileCount
                                  }{" "}
                                  {language === "ro"
                                    ? profileCount === 1
                                      ? "profil"
                                      : "profiluri"
                                    : profileCount === 1
                                    ? "profile"
                                    : "profiles"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>


                        <div
                          className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            text-[14px]
                            transition
                            ${
                              selected
                                ? "rotate-90 border-blue-400/20 bg-blue-500/[0.08] text-blue-100"
                                : "border-white/[0.06] bg-white/[0.02] text-zinc-500 group-hover:text-zinc-200"
                            }
                          `}
                        >
                          →
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          ) : (
            <div
              className="
                ad-surface
                rounded-[24px]
                p-8
                text-center
              "
            >
              <p
                className="
                  text-[15px]
                  text-zinc-400
                "
              >
                {text.noResults}
              </p>


              <button
                type="button"
                onClick={() =>
                  setQuery(
                    ""
                  )
                }
                className="
                  mt-4
                  text-[13px]
                  font-semibold
                  text-blue-200
                "
              >
                {text.clearSearch}
              </button>
            </div>
          )}
        </section>


        {/* SELECTED BRAND / MODELS */}

        {selectedManufacturer && (
          <section
            id="vehicle-models-section"
            className="
              ad-surface
              relative
              mt-8
              scroll-mt-6
              overflow-hidden
              rounded-[30px]
              p-6
              sm:p-7
              lg:p-8
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-60
                w-60
                rounded-full
                bg-blue-500/[0.07]
                blur-[75px]
              "
            />


            <div
              className="
                relative
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-5
                  border-b
                  border-white/[0.06]
                  pb-6
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >
                  <BrandLogo
                    manufacturer={
                      selectedManufacturer
                    }
                    size="large"
                  />


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
                      {text.selectedRange}
                    </p>


                    <h2
                      className="
                        mt-1.5
                        text-[28px]
                        font-semibold
                        tracking-[-0.035em]
                        text-white
                      "
                    >
                      {
                        selectedManufacturer
                      }
                    </h2>


                    <p
                      className="
                        mt-1
                        text-[13px]
                        text-zinc-400
                      "
                    >
                      {
                        vehicleCatalog[
                          selectedManufacturer
                        ].length
                      }{" "}
                      {Number(
                        vehicleCatalog[
                          selectedManufacturer
                        ].length
                      ) === 1
                        ? text.model
                        : text.models}
                    </p>
                  </div>
                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSelectedManufacturer(
                      null
                    )
                  }
                  className="
                    w-fit
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
                  {text.changeBrand}
                </button>
              </div>


              {selectedModels.length >
              0 ? (
                <div
                  className="
                    mt-6
                    grid
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-3
                  "
                >
                  {selectedModels.map(
                    (
                      model
                    ) => {
                      const profile =
                        getLocalizedVehicleProfile(
                          selectedManufacturer,
                          model,
                          language
                        );

                      const vehicleImage =
                        getVehicleImage(
                          selectedManufacturer,
                          model
                        );


                      return (
                        <article
                          key={
                            model
                          }
                          className="
                            group
                            relative
                            overflow-hidden
                            rounded-[26px]
                            border
                            border-white/[0.07]
                            bg-[linear-gradient(180deg,rgba(14,20,33,0.92),rgba(7,11,19,0.96))]
                            p-[1px]
                            shadow-[0_18px_45px_rgba(0,0,0,0.16)]
                            transition
                            duration-300
                            hover:-translate-y-1
                            hover:border-blue-400/20
                            hover:shadow-[0_26px_70px_rgba(0,0,0,0.28)]
                          "
                        >
                          <div
                            className="
                              pointer-events-none
                              absolute
                              -right-20
                              -top-20
                              h-52
                              w-52
                              rounded-full
                              bg-blue-500/[0.08]
                              blur-[70px]
                              transition
                              duration-500
                              group-hover:bg-blue-500/[0.13]
                            "
                          />

                          <div
                            className="
                              pointer-events-none
                              absolute
                              inset-x-8
                              top-0
                              h-px
                              bg-gradient-to-r
                              from-transparent
                              via-blue-300/25
                              to-transparent
                              opacity-60
                            "
                          />

                          <div
                            className="
                              relative
                              flex
                              h-full
                              flex-col
                              rounded-[25px]
                              bg-black/[0.06]
                              p-5
                            "
                          >
                            {/* CARD HEADER */}
                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >
                              <div
                                className="
                                  min-w-0
                                "
                              >
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
                                      tracking-[0.15em]
                                      text-blue-100/55
                                    "
                                  >
                                    {
                                      selectedManufacturer
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
                                    className="
                                      text-[10px]
                                      font-medium
                                      uppercase
                                      tracking-[0.11em]
                                      text-zinc-500
                                    "
                                  >
                                    {language === "ro"
                                      ? "Gamă model"
                                      : "Model range"}
                                  </span>
                                </div>

                                <h3
                                  className="
                                    mt-2
                                    text-[26px]
                                    font-semibold
                                    tracking-[-0.04em]
                                    text-white
                                  "
                                >
                                  {model}
                                </h3>
                              </div>

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  border
                                  border-emerald-400/10
                                  bg-emerald-400/[0.045]
                                  px-2.5
                                  py-1.5
                                "
                              >
                                <span
                                  className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-emerald-400
                                    shadow-[0_0_10px_rgba(52,211,153,0.45)]
                                  "
                                />
                                <span
                                  className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.08em]
                                    text-emerald-200/80
                                  "
                                >
                                  {language === "ro"
                                    ? "În catalog"
                                    : "Catalogued"}
                                </span>
                              </div>
                            </div>

                            {/* VEHICLE HERO */}
                            <div
                              className="
                                relative
                                mt-4
                                overflow-hidden
                                rounded-[20px]
                                border
                                border-white/[0.06]
                                bg-[linear-gradient(180deg,rgba(16,24,39,0.66),rgba(7,11,18,0.70))]
                                px-3
                                pb-2
                                pt-3
                              "
                            >
                              <div
                                className="
                                  pointer-events-none
                                  absolute
                                  inset-0
                                  opacity-[0.20]
                                  [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
                                  [background-size:28px_28px]
                                "
                              />

                              <div
                                className="
                                  pointer-events-none
                                  absolute
                                  left-1/2
                                  top-[45%]
                                  h-32
                                  w-64
                                  -translate-x-1/2
                                  -translate-y-1/2
                                  rounded-full
                                  bg-blue-500/[0.09]
                                  blur-[55px]
                                "
                              />

                              <div
                                className="
                                  pointer-events-none
                                  absolute
                                  inset-x-[18%]
                                  bottom-5
                                  h-4
                                  rounded-full
                                  bg-black/70
                                  blur-xl
                                "
                              />

                              {vehicleImage ? (
                                <img
                                  src={vehicleImage}
                                  alt={`${selectedManufacturer} ${model}`}
                                  loading="lazy"
                                  className="
                                    relative
                                    z-10
                                    h-[195px]
                                    w-full
                                    object-contain
                                    object-center
                                    drop-shadow-[0_22px_30px_rgba(0,0,0,0.48)]
                                    transition
                                    duration-500
                                    ease-out
                                    group-hover:-translate-y-1
                                    group-hover:scale-[1.035]
                                  "
                                />
                              ) : (
                                <div
                                  className="
                                    relative
                                    z-10
                                    flex
                                    h-[195px]
                                    items-center
                                    justify-center
                                  "
                                >
                                  <div
                                    className="
                                      flex
                                      h-16
                                      w-24
                                      items-center
                                      justify-center
                                      rounded-2xl
                                      border
                                      border-white/[0.06]
                                      bg-white/[0.02]
                                    "
                                  >
                                    <svg
                                      viewBox="0 0 64 28"
                                      fill="none"
                                      aria-hidden="true"
                                      className="
                                        h-9
                                        w-14
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

                              <div
                                className="
                                  absolute
                                  bottom-3
                                  left-3
                                  z-20
                                  flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  border
                                  border-white/[0.07]
                                  bg-black/35
                                  px-2.5
                                  py-1.5
                                  backdrop-blur-md
                                "
                              >
                                <span
                                  className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-blue-300/80
                                  "
                                />
                                <span
                                  className="
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-[0.08em]
                                    text-zinc-300
                                  "
                                >
                                  {language === "ro"
                                    ? "Vizual gamă"
                                    : "Range visual"}
                                </span>
                              </div>
                            </div>

                            {/* INTELLIGENCE STRIP */}
                            <div
                              className="
                                mt-4
                                grid
                                grid-cols-2
                                gap-2.5
                              "
                            >
                              <div
                                className="
                                  rounded-[14px]
                                  border
                                  border-white/[0.055]
                                  bg-white/[0.018]
                                  px-3
                                  py-2.5
                                "
                              >
                                <p
                                  className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-zinc-500
                                  "
                                >
                                  {language === "ro"
                                    ? "Catalog"
                                    : "Catalog"}
                                </p>

                                <div
                                  className="
                                    mt-1.5
                                    flex
                                    items-center
                                    gap-2
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
                                  <span
                                    className="
                                      text-[12px]
                                      font-medium
                                      text-zinc-200
                                    "
                                  >
                                    {language === "ro"
                                      ? "Model disponibil"
                                      : "Model available"}
                                  </span>
                                </div>
                              </div>

                              <div
                                className="
                                  rounded-[14px]
                                  border
                                  border-white/[0.055]
                                  bg-white/[0.018]
                                  px-3
                                  py-2.5
                                "
                              >
                                <p
                                  className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-zinc-500
                                  "
                                >
                                  {language === "ro"
                                    ? "Profil gamă"
                                    : "Range profile"}
                                </p>

                                <div
                                  className="
                                    mt-1.5
                                    flex
                                    items-center
                                    gap-2
                                  "
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      profile
                                        ? "bg-emerald-400"
                                        : "bg-amber-300"
                                    }`}
                                  />
                                  <span
                                    className="
                                      text-[12px]
                                      font-medium
                                      text-zinc-200
                                    "
                                  >
                                    {profile
                                      ? language === "ro"
                                        ? "Disponibil"
                                        : "Available"
                                      : language === "ro"
                                      ? "Necompletat"
                                      : "Not added"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* PROFILE */}
                            {profile ? (
                              <>
                                <div
                                  className="
                                    mt-4
                                    flex
                                    flex-wrap
                                    gap-2
                                  "
                                >
                                  {profile.segment && (
                                    <span
                                      className="
                                        rounded-full
                                        border
                                        border-blue-400/12
                                        bg-blue-500/[0.05]
                                        px-2.5
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
                                  )}

                                  {profile.bodyStyles
                                    ?.slice(
                                      0,
                                      2
                                    )
                                    .map(
                                      (
                                        value
                                      ) => (
                                        <span
                                          key={
                                            value
                                          }
                                          className="
                                            rounded-full
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            px-2.5
                                            py-1.5
                                            text-[11px]
                                            text-zinc-300
                                          "
                                        >
                                          {value}
                                        </span>
                                      )
                                    )}
                                </div>

                                {profile.commonTraits &&
                                  profile.commonTraits.length >
                                    0 && (
                                  <div
                                    className="
                                      mt-4
                                    "
                                  >
                                    <p
                                      className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.12em]
                                        text-zinc-500
                                      "
                                    >
                                      {text.traits}
                                    </p>

                                    <div
                                      className="
                                        mt-2
                                        space-y-2
                                      "
                                    >
                                      {profile.commonTraits
                                        .slice(
                                          0,
                                          2
                                        )
                                        .map(
                                          (
                                            trait
                                          ) => (
                                            <div
                                              key={
                                                trait
                                              }
                                              className="
                                                flex
                                                gap-2.5
                                              "
                                            >
                                              <span
                                                className="
                                                  mt-2
                                                  h-1.5
                                                  w-1.5
                                                  shrink-0
                                                  rounded-full
                                                  bg-blue-300/70
                                                "
                                              />
                                              <p
                                                className="
                                                  text-[13px]
                                                  leading-5
                                                  text-zinc-300
                                                "
                                              >
                                                {
                                                  trait
                                                }
                                              </p>
                                            </div>
                                          )
                                        )}
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : null}

                            {/* CTA */}
                            <div
                              className="
                                mt-auto
                                pt-4
                              "
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  startDiagnosis(
                                    selectedManufacturer,
                                    model
                                  )
                                }
                                className="
                                  group/button
                                  relative
                                  flex
                                  w-full
                                  items-center
                                  justify-between
                                  overflow-hidden
                                  rounded-[14px]
                                  border
                                  border-blue-400/15
                                  bg-[linear-gradient(90deg,rgba(37,99,235,0.10),rgba(14,165,233,0.045))]
                                  px-4
                                  py-3
                                  text-[12px]
                                  font-semibold
                                  text-blue-50
                                  transition
                                  hover:border-blue-300/25
                                  hover:bg-[linear-gradient(90deg,rgba(37,99,235,0.16),rgba(14,165,233,0.07))]
                                "
                              >
                                <span
                                  className="
                                    pointer-events-none
                                    absolute
                                    inset-y-0
                                    -left-16
                                    w-16
                                    skew-x-[-18deg]
                                    bg-white/[0.05]
                                    transition-transform
                                    duration-500
                                    group-hover/button:translate-x-[420px]
                                  "
                                />

                                <span
                                  className="
                                    relative
                                  "
                                >
                                  {
                                    text.openDiagnosis
                                  }
                                </span>

                                <span
                                  className="
                                    relative
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/[0.08]
                                    bg-white/[0.035]
                                    transition
                                    group-hover/button:translate-x-0.5
                                    group-hover/button:bg-white/[0.06]
                                  "
                                >
                                  →
                                </span>
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              ) : (
                <div
                  className="
                    mt-6
                    rounded-[22px]
                    border
                    border-white/[0.055]
                    bg-black/10
                    p-7
                    text-center
                  "
                >
                  <p
                    className="
                      text-[14px]
                      text-zinc-400
                    "
                  >
                    {text.noModels}
                  </p>
                </div>
              )}


              <div
                className="
                  mt-6
                  rounded-[22px]
                  border
                  border-dashed
                  border-white/[0.10]
                  bg-white/[0.012]
                  p-5
                "
              >
                <div
                  className="
                    grid
                    gap-4
                    lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)]
                    lg:items-center
                  "
                >
                  <div>
                    <h3
                      className="
                        text-[16px]
                        font-semibold
                        text-white
                      "
                    >
                      {text.modelNotListed}
                    </h3>

                    <p
                      className="
                        mt-2
                        max-w-2xl
                        text-[13px]
                        leading-6
                        text-zinc-400
                      "
                    >
                      {text.modelNotListedDescription}
                    </p>
                  </div>


                  <div
                    className="
                      flex
                      flex-col
                      gap-2
                      sm:flex-row
                    "
                  >
                    <input
                      type="text"
                      value={manualModel}
                      onChange={(event) =>
                        setManualModel(
                          event.target.value
                        )
                      }
                      placeholder={
                        text.manualModelPlaceholder
                      }
                      className="
                        min-h-11
                        min-w-0
                        flex-1
                        rounded-xl
                        border
                        border-white/[0.07]
                        bg-black/10
                        px-4
                        text-[14px]
                        text-white
                        outline-none
                        transition
                        placeholder:text-zinc-600
                        focus:border-blue-400/25
                      "
                    />

                    <button
                      type="button"
                      disabled={
                        !manualModel.trim()
                      }
                      onClick={
                        startManualDiagnosis
                      }
                      className="
                        min-h-11
                        rounded-xl
                        bg-blue-500
                        px-4
                        text-[13px]
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-400
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      {text.useManualModel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}


        <button
          type="button"
          onClick={() =>
            router.push(
              "/dashboard"
            )
          }
          className="
            mt-9
            text-[13px]
            font-medium
            text-zinc-500
            transition
            hover:text-zinc-200
          "
        >
          ← {text.back}
        </button>
      </div>
    </main>
  );
}
