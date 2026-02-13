"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { Recipe, IngredientType } from "@/types/recipe"
import { convertToGrams, getAvailableUnits } from "@/utils/unit-conversion"

interface RecipeEditFormProps {
  recipe: Recipe
  onSave: (recipe: Recipe) => void
  onCancel: () => void
}

const TYPES: { value: IngredientType; label: string }[] = [
  { value: "other", label: "Other" },
  { value: "tea", label: "Tea" },
  { value: "syrup", label: "Syrup" },
  { value: "water", label: "Water" },
  { value: "liquid", label: "Liquid / Concentrate" },
]

interface FormIngredient {
  name: string
  amount: number
  unit: string
  type: IngredientType
}

export function RecipeEditForm({ recipe, onSave, onCancel }: RecipeEditFormProps) {
  const [name, setName] = useState(recipe.name)
  const [notes, setNotes] = useState(recipe.notes || "")
  const [ingredients, setIngredients] = useState<FormIngredient[]>(
    recipe.ingredients.map((ing) => ({
      name: ing.name,
      amount: ing.originalAmount || ing.baseAmount,
      unit: ing.originalUnit || ing.unit,
      type: ing.type as IngredientType,
    }))
  )
  const units = getAvailableUnits()

  const totalWeight = ingredients.reduce(
    (sum, ing) => sum + convertToGrams(ing.amount, ing.unit, ing.type),
    0
  )

  const updateIngredient = (i: number, patch: Partial<FormIngredient>) => {
    setIngredients((prev) => prev.map((ing, idx) => (idx === i ? { ...ing, ...patch } : ing)))
  }

  const removeIngredient = (i: number) => {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    if (ingredients.some((ing) => !ing.name.trim())) return
    if (totalWeight <= 0) return

    const updated: Recipe = {
      ...recipe,
      name: name.trim(),
      totalWeight,
      notes: notes.trim() || undefined,
      ingredients: ingredients.map((ing) => ({
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
    <form onSubmit={handleSubmit}>
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">Edit Recipe</h2>

      <div className="mb-4">
        <label className="mb-1.5 block font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Recipe Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Preparation steps, storage instructions, etc."
          rows={3}
          className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Ingredients</h3>
        <span className="rounded-md bg-brand/10 px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-brand">
          {Math.round(totalWeight)}g total
        </span>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        {ingredients.map((ing, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                required
                value={ing.name}
                onChange={(e) => updateIngredient(i, { name: e.target.value })}
                placeholder="Ingredient name"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  min={0}
                  step={0.01}
                  value={ing.amount || ""}
                  onChange={(e) => {
                    const val = e.target.value
                    updateIngredient(i, { amount: val === "" ? 0 : parseFloat(val) })
                  }}
                  placeholder="0"
                  className="h-9 w-24 rounded-md border bg-background px-3 font-mono text-sm text-foreground outline-none transition-colors focus:ring-1 focus:ring-ring"
                />
                <select
                  value={ing.unit}
                  onChange={(e) => updateIngredient(i, { unit: e.target.value })}
                  className="h-9 rounded-md border bg-background px-2 text-sm text-foreground outline-none transition-colors focus:ring-1 focus:ring-ring"
                >
                  {units.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
                <select
                  value={ing.type}
                  onChange={(e) => updateIngredient(i, { type: e.target.value as IngredientType })}
                  className="h-9 rounded-md border bg-background px-2 text-sm text-foreground outline-none transition-colors focus:ring-1 focus:ring-ring"
                >
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove ingredient"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              {ing.unit !== "g" && ing.amount > 0 && (
                <p className="text-xs text-muted-foreground">
                  = {Math.round(convertToGrams(ing.amount, ing.unit, ing.type))}g
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setIngredients((prev) => [...prev, { name: "", amount: 0, unit: "g", type: "other" }])}
        className="mb-4 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        Add Ingredient
      </button>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 flex-1 rounded-md border text-sm text-foreground transition-colors hover:bg-accent"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-10 flex-1 rounded-md bg-brand text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}
