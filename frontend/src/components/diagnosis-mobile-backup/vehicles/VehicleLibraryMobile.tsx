"use client";

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


const brandLogoSlugs:
  Record<
    string,
    string
  > = {
  Audi: "audi",
  BMW: "bmw",
  "Mercedes-Benz":
    "mercedes",
  Mercedes:
    "mercedes",
  Volkswagen:
    "volkswagen",
  Volvo: "volvo",
  Toyota: "toyota",
  Honda: "honda",
  Ford: "ford",
  Renault: "renault",
  Peugeot: "peugeot",
  Citroen: "citroen",
  "Citroën": "citroen",
  Skoda: "skoda",
  "Škoda": "skoda",
  SEAT: "seat",
  Seat: "seat",
  CUPRA: "cupra",
  Cupra: "cupra",
  Opel: "opel",
  Hyundai: "hyundai",
  Kia: "kia",
  Nissan: "nissan",
  Mazda: "mazda",
  Mitsubishi:
    "mitsubishi",
  Subaru: "subaru",
  Suzuki: "suzuki",
  Fiat: "fiat",
  "Alfa Romeo":
    "alfaromeo",
  Jeep: "jeep",
  "Land Rover":
    "landrover",
  Porsche: "porsche",
  Tesla: "tesla",
  Dacia: "dacia",
  MINI: "mini",
  Mini: "mini",
  Lexus: "lexus",
  Infiniti: "infiniti",
  Chevrolet:
    "chevrolet",
  Cadillac: "cadillac",
  Dodge: "dodge",
  Jaguar: "jaguar",
  Ferrari: "ferrari",
  Lamborghini:
    "lamborghini",
  Maserati: "maserati",
  Bentley: "bentley",
  "Rolls-Royce":
    "rollsroyce",
  "Aston Martin":
    "astonmartin",
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
}


function BrandLogo({
  manufacturer,
  large = false,
}: {
  manufacturer: string;
  large?: boolean;
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


  return (
    <div
      className={`
        flex
        shrink-0
        items-center
        justify-center
        rounded-[11px]
        border
        border-white/[0.06]
        bg-white/[0.025]

        ${
          large
            ? "h-10 w-10"
            : "h-8 w-8"
        }
      `}
    >
      {!failed &&
      logoUrl ? (
        <img
          src={
            logoUrl
          }
          alt={`${manufacturer} logo`}
          loading="lazy"
          onError={() =>
            setFailed(
              true
            )
          }
          className={`
            object-contain
            opacity-90

            ${
              large
                ? "h-6 w-6"
                : "h-5 w-5"
            }
          `}
        />
      ) : (
        <span
          className="
            text-[8px]
            font-bold
            tracking-[0.06em]
            text-zinc-300
          "
        >
          {
            getInitials(
              manufacturer
            )
          }
        </span>
      )}
    </div>
  );
}


function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


export default function VehicleLibraryMobile() {
  const router =
    useRouter();


  const [
    language,
    setLanguage,
  ] = useState<Language>(
    "en"
  );


  const [
    query,
    setQuery,
  ] = useState("");


  const [
    selectedManufacturer,
    setSelectedManufacturer,
  ] = useState<
    Manufacturer | null
  >(null);


  const [
    manualModel,
    setManualModel,
  ] = useState("");


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
  }, []);


  const text = {
    en: {
      eyebrow:
        "VEHICLE LIBRARY",

      title:
        "Choose your vehicle",

      description:
        "Select the manufacturer and model you want to diagnose.",

      searchPlaceholder:
        "Search manufacturer or model...",

      manufacturers:
        "Manufacturers",

      modelFamilies:
        "Model families",

      chooseBrand:
        "Choose manufacturer",

      selectedRange:
        "Selected manufacturer",

      models:
        "models",

      model:
        "model",

      changeBrand:
        "Close",

      verifiedProfile:
        "Profile available",

      profileUnavailable:
        "Profile pending",

      traits:
        "Common traits",

      openDiagnosis:
        "Use vehicle",

      modelNotListed:
        "Model not listed?",

      modelNotListedDescription:
        "Enter it manually. It will be treated as an unverified model.",

      manualModelPlaceholder:
        "e.g. Golf Plus",

      useManualModel:
        "Use model",

      noResults:
        "No manufacturer matches your search.",

      noModels:
        "No matching models.",

      clearSearch:
        "Clear search",

      back:
        "Back",

      dataRule:
        "The library uses model families rather than year-specific specifications.",
    },

    ro: {
      eyebrow:
        "BIBLIOTECĂ VEHICULE",

      title:
        "Alege vehiculul",

      description:
        "Selectează marca și modelul vehiculului pe care vrei să îl diagnostichezi.",

      searchPlaceholder:
        "Caută marcă sau model...",

      manufacturers:
        "Mărci",

      modelFamilies:
        "Game modele",

      chooseBrand:
        "Alege marca",

      selectedRange:
        "Marcă selectată",

      models:
        "modele",

      model:
        "model",

      changeBrand:
        "Închide",

      verifiedProfile:
        "Profil disponibil",

      profileUnavailable:
        "Profil necompletat",

      traits:
        "Trăsături comune",

      openDiagnosis:
        "Folosește vehiculul",

      modelNotListed:
        "Modelul nu apare?",

      modelNotListedDescription:
        "Introdu-l manual. Va fi tratat ca model neverificat.",

      manualModelPlaceholder:
        "ex. Golf Plus",

      useManualModel:
        "Folosește modelul",

      noResults:
        "Nicio marcă nu corespunde căutării.",

      noModels:
        "Niciun model nu corespunde.",

      clearSearch:
        "Șterge căutarea",

      back:
        "Înapoi",

      dataRule:
        "Biblioteca folosește game de modele, nu specificații dependente de an.",
    },
  }[language];


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


        if (
          selectedManufacturer
            .toLowerCase()
            .includes(
              normalized
            )
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
    setManualModel(
      ""
    );


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
            "mobile-vehicle-models"
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
              -right-16
              -top-20
              h-40
              w-40
              rounded-full
              bg-blue-500/[0.10]
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
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-blue-400
                  "
                />

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-blue-200/60
                  "
                >
                  {
                    text.eyebrow
                  }
                </p>
              </div>


              <div
                className="
                  flex
                  rounded-[9px]
                  border
                  border-white/[0.06]
                  bg-black/10
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
                        rounded-[7px]
                        px-2
                        py-1.5
                        text-[7px]
                        font-bold

                        ${
                          language ===
                          item
                            ? "bg-white/[0.08] text-white"
                            : "text-zinc-600"
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


            <h1
              className="
                mt-3.5
                text-[23px]
                font-semibold
                leading-[1.05]
                tracking-[-0.045em]
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
                mt-3
                flex
                gap-1.5
              "
            >
              <div
                className="
                  rounded-[11px]
                  border
                  border-white/[0.055]
                  bg-black/10
                  px-3
                  py-2
                "
              >
                <p
                  className="
                    text-[16px]
                    font-semibold
                  "
                >
                  {
                    manufacturers.length
                  }
                </p>

                <p
                  className="
                    text-[6px]
                    uppercase
                    tracking-[0.08em]
                    text-zinc-600
                  "
                >
                  {
                    text.manufacturers
                  }
                </p>
              </div>


              <div
                className="
                  rounded-[11px]
                  border
                  border-white/[0.055]
                  bg-black/10
                  px-3
                  py-2
                "
              >
                <p
                  className="
                    text-[16px]
                    font-semibold
                  "
                >
                  {
                    totalFamilies
                  }
                </p>

                <p
                  className="
                    text-[6px]
                    uppercase
                    tracking-[0.08em]
                    text-zinc-600
                  "
                >
                  {
                    text.modelFamilies
                  }
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* SEARCH */}

        <div
          className="
            mt-2.5
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
              text-zinc-600
            "
          >
            <SearchIcon />
          </span>

          <input
            type="search"
            value={
              query
            }
            onChange={(
              event
            ) =>
              setQuery(
                event.target.value
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


        {/* BRANDS */}

        <section
          className="
            mt-4
          "
        >
          <div
            className="
              mb-2
              flex
              items-center
              justify-between
            "
          >
            <p
              className="
                text-[10px]
                font-semibold
                text-zinc-200
              "
            >
              {
                text.chooseBrand
              }
            </p>

            <span
              className="
                text-[8px]
                text-zinc-700
              "
            >
              {
                filteredManufacturers.length
              }
            </span>
          </div>


          {filteredManufacturers.length >
          0 ? (
            <div
              className="
                grid
                grid-cols-2
                gap-2
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
                        flex
                        min-w-0
                        items-center
                        gap-2.5
                        rounded-[15px]
                        border
                        px-2.5
                        py-2.5
                        text-left

                        ${
                          selected
                            ? "border-blue-400/25 bg-blue-500/[0.07]"
                            : "border-white/[0.055] bg-[#05080e]"
                        }
                      `}
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
                        <p
                          className="
                            truncate
                            text-[10px]
                            font-semibold
                            text-zinc-200
                          "
                        >
                          {
                            manufacturer
                          }
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[7px]
                            text-zinc-600
                          "
                        >
                          {modelCount}{" "}
                          {
                            text.models
                          }

                          {profileCount >
                            0 &&
                            ` · ${profileCount} ✓`}
                        </p>
                      </div>


                      <span
                        className={`
                          text-[10px]

                          ${
                            selected
                              ? "rotate-90 text-blue-300"
                              : "text-zinc-800"
                          }
                        `}
                      >
                        →
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          ) : (
            <div
              className="
                rounded-[16px]
                border
                border-white/[0.05]
                bg-[#05080e]
                p-4
                text-center
              "
            >
              <p
                className="
                  text-[10px]
                  text-zinc-600
                "
              >
                {
                  text.noResults
                }
              </p>

              <button
                type="button"
                onClick={() =>
                  setQuery("")
                }
                className="
                  mt-2
                  text-[9px]
                  font-semibold
                  text-blue-300
                "
              >
                {
                  text.clearSearch
                }
              </button>
            </div>
          )}
        </section>


        {/* MODELS */}

        {selectedManufacturer && (
          <section
            id="mobile-vehicle-models"
            className="
              mt-3
              scroll-mt-20
              rounded-[19px]
              border
              border-blue-400/[0.10]
              bg-[#05080e]
              p-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-2.5
              "
            >
              <BrandLogo
                manufacturer={
                  selectedManufacturer
                }
                large
              />


              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.11em]
                    text-blue-200/50
                  "
                >
                  {
                    text.selectedRange
                  }
                </p>

                <h2
                  className="
                    mt-0.5
                    truncate
                    text-[15px]
                    font-semibold
                  "
                >
                  {
                    selectedManufacturer
                  }
                </h2>
              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedManufacturer(
                    null
                  )
                }
                className="
                  rounded-[9px]
                  border
                  border-white/[0.06]
                  px-2.5
                  py-1.5
                  text-[7px]
                  font-semibold
                  text-zinc-500
                "
              >
                {
                  text.changeBrand
                }
              </button>
            </div>


            {selectedModels.length >
            0 ? (
              <div
                className="
                  mt-3
                  space-y-2
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
                          overflow-hidden
                          rounded-[15px]
                          border
                          border-white/[0.055]
                          bg-black/10
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            p-2.5
                          "
                        >
                          <div
                            className="
                              flex
                              h-[62px]
                              w-[94px]
                              shrink-0
                              items-center
                              justify-center
                              overflow-hidden
                              rounded-[11px]
                              border
                              border-white/[0.05]
                              bg-[radial-gradient(circle_at_50%_45%,rgba(59,130,246,0.10),transparent_70%)]
                            "
                          >
                            {vehicleImage ? (
                              <img
                                src={
                                  vehicleImage
                                }
                                alt={`${selectedManufacturer} ${model}`}
                                loading="lazy"
                                className="
                                  h-full
                                  w-full
                                  object-contain
                                  p-1.5
                                "
                              />
                            ) : (
                              <span
                                className="
                                  text-[8px]
                                  text-zinc-700
                                "
                              >
                                AUTO
                              </span>
                            )}
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
                                text-zinc-100
                              "
                            >
                              {model}
                            </p>

                            {profile?.segment && (
                              <p
                                className="
                                  mt-0.5
                                  truncate
                                  text-[8px]
                                  text-blue-200/55
                                "
                              >
                                {
                                  profile.segment
                                }
                              </p>
                            )}

                            <div
                              className="
                                mt-1.5
                                flex
                                items-center
                                gap-1.5
                              "
                            >
                              <span
                                className={`
                                  h-1.5
                                  w-1.5
                                  rounded-full

                                  ${
                                    profile
                                      ? "bg-emerald-400"
                                      : "bg-amber-300"
                                  }
                                `}
                              />

                              <span
                                className="
                                  text-[7px]
                                  text-zinc-600
                                "
                              >
                                {profile
                                  ? text.verifiedProfile
                                  : text.profileUnavailable}
                              </span>
                            </div>
                          </div>


                          <button
                            type="button"
                            onClick={() =>
                              startDiagnosis(
                                selectedManufacturer,
                                model
                              )
                            }
                            className="
                              shrink-0
                              rounded-[10px]
                              bg-blue-500
                              px-3
                              py-2.5
                              text-[8px]
                              font-semibold
                              text-white
                            "
                          >
                            {
                              text.openDiagnosis
                            }
                          </button>
                        </div>


                        {profile &&
                          profile.commonTraits &&
                          profile.commonTraits.length >
                            0 && (
                          <details
                            className="
                              border-t
                              border-white/[0.045]
                            "
                          >
                            <summary
                              className="
                                cursor-pointer
                                select-none
                                px-3
                                py-2
                                text-[7px]
                                font-semibold
                                text-zinc-600
                              "
                            >
                              {
                                text.traits
                              }
                            </summary>

                            <div
                              className="
                                space-y-1.5
                                border-t
                                border-white/[0.04]
                                px-3
                                py-2.5
                              "
                            >
                              {profile.commonTraits
                                .slice(
                                  0,
                                  3
                                )
                                .map(
                                  (
                                    trait
                                  ) => (
                                    <p
                                      key={
                                        trait
                                      }
                                      className="
                                        text-[8px]
                                        leading-3.5
                                        text-zinc-500
                                      "
                                    >
                                      •{" "}
                                      {
                                        trait
                                      }
                                    </p>
                                  )
                                )}
                            </div>
                          </details>
                        )}
                      </article>
                    );
                  }
                )}
              </div>
            ) : (
              <p
                className="
                  mt-3
                  rounded-[12px]
                  border
                  border-white/[0.05]
                  p-3
                  text-[9px]
                  text-zinc-600
                "
              >
                {
                  text.noModels
                }
              </p>
            )}


            {/* MANUAL */}

            <div
              className="
                mt-3
                rounded-[14px]
                border
                border-dashed
                border-white/[0.08]
                p-3
              "
            >
              <p
                className="
                  text-[10px]
                  font-semibold
                  text-zinc-200
                "
              >
                {
                  text.modelNotListed
                }
              </p>

              <p
                className="
                  mt-1
                  text-[8px]
                  leading-3.5
                  text-zinc-600
                "
              >
                {
                  text.modelNotListedDescription
                }
              </p>


              <div
                className="
                  mt-2.5
                  grid
                  grid-cols-[1fr_auto]
                  gap-2
                "
              >
                <input
                  type="text"
                  value={
                    manualModel
                  }
                  onChange={(
                    event
                  ) =>
                    setManualModel(
                      event.target.value
                    )
                  }
                  placeholder={
                    text.manualModelPlaceholder
                  }
                  className="
                    min-h-[38px]
                    min-w-0
                    rounded-[10px]
                    border
                    border-white/[0.06]
                    bg-black/10
                    px-3
                    text-[10px]
                    text-white
                    outline-none
                    placeholder:text-zinc-700
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
                    min-h-[38px]
                    rounded-[10px]
                    bg-blue-500
                    px-3
                    text-[8px]
                    font-semibold
                    text-white
                    disabled:opacity-35
                  "
                >
                  {
                    text.useManualModel
                  }
                </button>
              </div>
            </div>
          </section>
        )}


        <p
          className="
            mt-3
            text-center
            text-[7px]
            leading-3
            text-zinc-800
          "
        >
          {
            text.dataRule
          }
        </p>


        <button
          type="button"
          onClick={() =>
            router.push(
              "/dashboard"
            )
          }
          className="
            mt-3
            text-[8px]
            font-medium
            text-zinc-600
          "
        >
          ← {text.back}
        </button>
      </div>
    </main>
  );
}