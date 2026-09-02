export const vehicleCatalog = {
  Audi: ["A1", "A3", "A4", "A5", "A6", "Q3", "Q5", "Q7"],
  BMW: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "X1", "X3", "X5"],
  Ford: ["Fiesta", "Focus", "Mondeo", "Kuga", "Puma", "Mustang"],
  "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "E-Class", "GLA", "GLC", "GLE"],
  Opel: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland"],
  Renault: ["Clio", "Megane", "Captur", "Kadjar", "Austral"],
  Skoda: ["Fabia", "Octavia", "Superb", "Scala", "Karoq", "Kodiaq"],
  Toyota: ["Yaris", "Corolla", "Camry", "C-HR", "RAV4", "Prius"],
  Volkswagen: ["Polo", "Golf", "Passat", "Arteon", "T-Roc", "Tiguan", "Touareg"],
  Volvo: ["S60", "S90", "V60", "XC40", "XC60", "XC90"],
} as const;

export type Manufacturer = keyof typeof vehicleCatalog;