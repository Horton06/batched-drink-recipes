export type IngredientType = "tea" | "syrup" | "water" | "liquid" | "other"

export interface Ingredient {
  name: string
  baseAmount: number
  unit: string
  type: IngredientType
  originalAmount?: number
  originalUnit?: string
}

export interface Recipe {
  id: string
  name: string
  totalWeight: number
  ingredients: Ingredient[]
  notes?: string
}
