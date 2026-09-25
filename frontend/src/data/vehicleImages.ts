import type { Manufacturer } from "./vehicleCatalog";

export type VehicleImageMap = Partial<
  Record<Manufacturer, Record<string, string>>
>;

export const vehicleImages: VehicleImageMap = {
  Audi: {
    A1: "/vehicles/audi/audi_a1.png",
    A3: "/vehicles/audi/audi_a3.png",
    A4: "/vehicles/audi/audi_a4.png",
    A5: "/vehicles/audi/audi_a5.png",
    A6: "/vehicles/audi/audi_a6.png",
    Q3: "/vehicles/audi/audi_q3.png",
    Q5: "/vehicles/audi/audi_q5.png",
    Q7: "/vehicles/audi/audi_q7.png",
  },

  BMW: {
    "1 Series": "/vehicles/bmw/bmw_1_series-Photoroom.png",
    "2 Series": "/vehicles/bmw/bmw_2_series.png",
    "3 Series": "/vehicles/bmw/bmw_3_series.png",
    "4 Series": "/vehicles/bmw/bmw_4_series.png",
    "5 Series": "/vehicles/bmw/bmw_5_series.png",
    X1: "/vehicles/bmw/bmw_x1.png",
    X3: "/vehicles/bmw/bmw_x3.png",
    X5: "/vehicles/bmw/bmw_x5.png",
  },

  Ford: {
    Fiesta: "/vehicles/ford/ford_fiesta.png",
    Focus: "/vehicles/ford/ford_focus.png",
    Mondeo: "/vehicles/ford/ford_mondeo.png",
    Kuga: "/vehicles/ford/ford_kuga.png",
    Puma: "/vehicles/ford/ford_puma.png",
    Mustang: "/vehicles/ford/ford_mustang.png",
  },

  "Mercedes-Benz": {
    "A-Class": "/vehicles/mercedes-benz/mercedes_A-Class.png",
    "B-Class": "/vehicles/mercedes-benz/mercedes_B-Class.png",
    "C-Class": "/vehicles/mercedes-benz/mercedes_C-Class.png",
    "E-Class": "/vehicles/mercedes-benz/mercedes_E-Class.png",
    GLA: "/vehicles/mercedes-benz/mercedes_GLA.png",
    GLC: "/vehicles/mercedes-benz/mercedes_GLC.png",
    GLE: "/vehicles/mercedes-benz/mercedes_GLE.png",
  },

  Opel: {
    Corsa: "/vehicles/opel/opel_corsa.png",
    Astra: "/vehicles/opel/opel_astra.png",
    Insignia: "/vehicles/opel/opel_insignia.png",
    Mokka: "/vehicles/opel/opel_mokka.png",
    Crossland: "/vehicles/opel/opel_crossland.png",
  },

  Renault: {
    Clio: "/vehicles/renault/renault_clio.png",
    Megane: "/vehicles/renault/renault_megane.png",
    Captur: "/vehicles/renault/renault_captur.png",
    Kadjar: "/vehicles/renault/renault_kadjar.png",
    Austral: "/vehicles/renault/renault_austral.png",
  },

  Skoda: {
    Fabia: "/vehicles/skoda/skoda_fabia.png",
    Octavia: "/vehicles/skoda/skoda_octavia.png",
    Superb: "/vehicles/skoda/skoda_superb.png",
    Scala: "/vehicles/skoda/skoda_scala.png",
    Karoq: "/vehicles/skoda/skoda_karoq.png",
    Kodiaq: "/vehicles/skoda/skoda_kodiaq.png",
  },

  Toyota: {
    Yaris: "/vehicles/toyota/toyota_yaris.png",
    Corolla: "/vehicles/toyota/toyota_corolla.png",
    Camry: "/vehicles/toyota/toyota_camry.png",
    "C-HR": "/vehicles/toyota/toyota_C-HR.png",
    RAV4: "/vehicles/toyota/toyota_RAV4.png",
    Prius: "/vehicles/toyota/toyota_prius.png",
  },

  Volkswagen: {
    Polo: "/vehicles/volkswagen/volkswagen_polo.png",
    Golf: "/vehicles/volkswagen/volkswagen_golf.png",
    Passat: "/vehicles/volkswagen/volkswagen_passat.png",
    Arteon: "/vehicles/volkswagen/volkswagen_arteon.png",

    // IMPORTANT:
    // vehicleCatalog.ts currently contains "T-Roc",
    // but the image you currently have is "volkswagen_T-Cross.png".
    // Do NOT map T-Roc to this image, because they are different models.
    "T-Cross": "/vehicles/volkswagen/volkswagen_T-Cross.png",

    Tiguan: "/vehicles/volkswagen/volkswagen_tiguan.png",
    Touareg: "/vehicles/volkswagen/volkswagen_touareg.png",
  },

  Volvo: {
    S60: "/vehicles/volvo/volvo_S60.png",
    S90: "/vehicles/volvo/volvo_S90.png",
    V60: "/vehicles/volvo/volvo_V60.png",
    XC40: "/vehicles/volvo/volvo_XC40.png",
    XC60: "/vehicles/volvo/volvo_XC60.png",
    XC90: "/vehicles/volvo/volvo_XC90.png",
  },
};

export function getVehicleImage(
  manufacturer: string,
  model: string
): string | null {
  const manufacturerImages =
    vehicleImages[manufacturer as Manufacturer];

  return manufacturerImages?.[model] ?? null;
}