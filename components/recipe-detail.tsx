"use client"

import type { Recipe } from "@/types/recipe"
import { RecipeTable } from "@/components/recipe-table"
import { ScaleControls } from "@/components/scale-controls"

interface RecipeDetailProps {
  recipe: Recipe
  targetAmount: number
  targetUnit: string
  targetGrams: number
  scaleFactor: number
  onTargetAmountChange: (next: number) => void
  onTargetUnitChange: (next: string) => void
}

/**
 * Read-only recipe view: header, scale controls, ingredient table, notes.
 * Sticky scale controls on mobile so adjusting amount keeps the table visible.
 */
export function RecipeDetail({
  recipe,
  targetAmount,
  targetUnit,
  targetGrams,
  scaleFactor,
  onTargetAmountChange,
  onTargetUnitChange,
}: RecipeDetailProps) {
  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
          {recipe.name}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Base recipe: {Math.round(recipe.totalWeight).toLocaleString()}g ·{" "}
          {recipe.ingredients.length} ingredients
        </p>
      </header>

      <ScaleControls
        targetAmount={targetAmount}
        targetUnit={targetUnit}
        targetGrams={targetGrams}
        onTargetAmountChange={onTargetAmountChange}
        onTargetUnitChange={onTargetUnitChange}
      />

      <RecipeTable recipe={recipe} scaleFactor={scaleFactor} />

      {recipe.notes && (
        <aside className="rounded-lg border bg-card p-4" aria-label="Recipe notes">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Notes
          </span>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {recipe.notes}
          </p>
        </aside>
      )}
    </div>
  )
}
