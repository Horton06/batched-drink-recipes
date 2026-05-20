"use client"

import { useState } from "react"
import type { Recipe } from "@/types/recipe"
import {
  RecipeFields,
  type RecipeFieldsValue,
  totalGrams,
} from "@/components/recipe-fields"
import { convertToGrams } from "@/utils/unit-conversion"

interface RecipeFormProps {
  onAdd: (recipe: Recipe) => void
}

const EMPTY_VALUE: RecipeFieldsValue = {
  name: "",
  notes: "",
  ingredients: [{ name: "", amount: 0, unit: "g", type: "other" }],
}

export function RecipeForm({ onAdd }: RecipeFormProps) {
  const [value, setValue] = useState<RecipeFieldsValue>(EMPTY_VALUE)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.name.trim()) return
    if (value.ingredients.some((ing) => !ing.name.trim())) return
    const total = totalGrams(value.ingredients)
    if (total <= 0) return

    const recipe: Recipe = {
      id: value.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name: value.name.trim(),
      totalWeight: total,
      notes: value.notes.trim() || undefined,
      ingredients: value.ingredients.map((ing) => ({
        name: ing.name.trim(),
        baseAmount: convertToGrams(ing.amount, ing.unit, ing.type),
        unit: "g",
        type: ing.type,
        originalAmount: ing.unit !== "g" ? ing.amount : undefined,
        originalUnit: ing.unit !== "g" ? ing.unit : undefined,
      })),
    }

    onAdd(recipe)
    setValue(EMPTY_VALUE)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Add Recipe</h2>

      <RecipeFields value={value} onChange={setValue} idPrefix="add" />

      <button
        type="submit"
        className="h-12 w-full rounded-md bg-brand text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:h-11"
      >
        Save Recipe
      </button>
    </form>
  )
}
