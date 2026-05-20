"use client"

import { useState } from "react"
import type { Recipe, IngredientType } from "@/types/recipe"
import {
  RecipeFields,
  type RecipeFieldsValue,
  totalGrams,
} from "@/components/recipe-fields"
import { convertToGrams } from "@/utils/unit-conversion"

interface RecipeEditFormProps {
  recipe: Recipe
  onSave: (recipe: Recipe) => void
  onCancel: () => void
}

export function RecipeEditForm({ recipe, onSave, onCancel }: RecipeEditFormProps) {
  const [value, setValue] = useState<RecipeFieldsValue>(() => ({
    name: recipe.name,
    notes: recipe.notes || "",
    ingredients: recipe.ingredients.map((ing) => ({
      name: ing.name,
      amount: ing.originalAmount || ing.baseAmount,
      unit: ing.originalUnit || ing.unit,
      type: ing.type as IngredientType,
    })),
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.name.trim()) return
    if (value.ingredients.some((ing) => !ing.name.trim())) return
    const total = totalGrams(value.ingredients)
    if (total <= 0) return

    const updated: Recipe = {
      ...recipe,
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

    onSave(updated)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Edit Recipe</h2>

      <RecipeFields value={value} onChange={setValue} idPrefix={`edit-${recipe.id}`} />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-12 flex-1 rounded-md border text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:h-11"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-12 flex-1 rounded-md bg-brand text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:h-11"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}
