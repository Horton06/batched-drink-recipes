const VOLUME_TO_ML: Record<string, number> = {
  tsp: 4.93,
  tbsp: 14.79,
  floz: 29.57,
  cup: 236.59,
  pint: 473.18,
  quart: 946.35,
  gallon: 3785.41,
  ml: 1,
  liter: 1000,
  l: 1000,
}

const WEIGHT_TO_G: Record<string, number> = {
  g: 1,
  kg: 1000,
  oz: 28.35,
  lb: 453.59,
}

const DENSITIES: Record<string, number> = {
  water: 1.0,
  syrup: 1.4,
  honey: 1.42,
  tea: 1.0,
  liquid: 1.0,
  other: 1.0,
}

export function convertToGrams(amount: number, unit: string, ingredientType = "other"): number {
  const u = unit.toLowerCase().trim()
  if (u === "g" || u === "gram" || u === "grams") return amount
  if (u in WEIGHT_TO_G) return amount * WEIGHT_TO_G[u]
  if (u in VOLUME_TO_ML) {
    const ml = amount * VOLUME_TO_ML[u]
    const density = DENSITIES[ingredientType] || 1.0
    return ml * density
  }
  return amount
}

const BOTTLE_TO_G: Record<string, number> = {
  "bottle-12oz": 384,
  "bottle-33oz": 1057,
}

export function targetToGrams(amount: number, unit: string, baseWeight: number): number {
  if (unit === "batch") return baseWeight * amount
  if (unit in BOTTLE_TO_G) return amount * BOTTLE_TO_G[unit]
  if (unit in WEIGHT_TO_G) return amount * WEIGHT_TO_G[unit]
  if (unit in VOLUME_TO_ML) return amount * VOLUME_TO_ML[unit]
  return amount
}

export function getTargetUnits() {
  return [
    { value: "gallon", label: "Gallons" },
    { value: "liter", label: "Liters" },
    { value: "quart", label: "Quarts" },
    { value: "ml", label: "Milliliters" },
    { value: "g", label: "Grams" },
    { value: "kg", label: "Kilograms" },
    { value: "batch", label: "Batches" },
    { value: "bottle-12oz", label: "Bottles (12 oz)" },
    { value: "bottle-33oz", label: "Bottles (33 oz)" },
  ]
}

export function getAvailableUnits() {
  return [
    { value: "g", label: "Grams (g)", type: "weight" as const },
    { value: "kg", label: "Kilograms (kg)", type: "weight" as const },
    { value: "oz", label: "Ounces (oz)", type: "weight" as const },
    { value: "lb", label: "Pounds (lb)", type: "weight" as const },
    { value: "ml", label: "Milliliters (ml)", type: "volume" as const },
    { value: "liter", label: "Liters (L)", type: "volume" as const },
    { value: "tsp", label: "Teaspoons", type: "volume" as const },
    { value: "tbsp", label: "Tablespoons", type: "volume" as const },
    { value: "floz", label: "Fluid Ounces", type: "volume" as const },
    { value: "cup", label: "Cups", type: "volume" as const },
    { value: "gallon", label: "Gallons", type: "volume" as const },
  ]
}

export function formatNumber(value: number): string {
  if (value >= 100) return Math.round(value).toString()
  if (value >= 10) return value.toFixed(1)
  return value.toFixed(2)
}

export function formatGrams(value: number): string {
  return Math.round(value).toLocaleString() + "g"
}

export function detectIngredientType(name: string): "tea" | "syrup" | "other" {
  const lowerName = name.toLowerCase().trim()

  if (lowerName.includes("tea")) {
    return "tea"
  }

  if (lowerName.includes("syrup")) {
    return "syrup"
  }

  return "other"
}

export const TEA_BATCH_YIELD_G = 1850

export function calculateTeaBatches(gramsNeeded: number): number {
  return Math.ceil(gramsNeeded / TEA_BATCH_YIELD_G)
}
