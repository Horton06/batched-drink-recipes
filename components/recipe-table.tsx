"use client"

import type { Recipe, IngredientType } from "@/types/recipe"
import { formatGrams } from "@/utils/unit-conversion"

const TYPE_STYLES: Record<IngredientType, string> = {
  tea: "bg-emerald-900/30 text-emerald-400 border-emerald-800/40",
  syrup: "bg-amber-900/30 text-amber-400 border-amber-800/40",
  water: "bg-sky-900/30 text-sky-400 border-sky-800/40",
  liquid: "bg-violet-900/30 text-violet-400 border-violet-800/40",
  other: "bg-muted text-muted-foreground border-border",
}

interface RecipeTableProps {
  recipe: Recipe
  scaleFactor: number
}

export function RecipeTable({ recipe, scaleFactor }: RecipeTableProps) {
  const totalScaled = recipe.ingredients.reduce(
    (sum, ing) => sum + ing.baseAmount * scaleFactor,
    0
  )

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Desktop table */}
      <table className="hidden w-full md:table">
        <thead>
          <tr className="border-b bg-card">
            <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Ingredient
            </th>
            <th className="w-24 px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Type
            </th>
            <th className="w-28 px-4 py-3 text-right font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Base
            </th>
            <th className="w-32 px-4 py-3 text-right font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Scaled
            </th>
          </tr>
        </thead>
        <tbody>
          {recipe.ingredients.map((ing, i) => (
            <tr
              key={ing.name + i}
              className="border-b last:border-b-0 transition-colors hover:bg-accent/50"
            >
              <td className="px-4 py-3 text-sm text-foreground">{ing.name}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    "inline-block rounded-full border px-2 py-0.5 text-xs " +
                    (TYPE_STYLES[ing.type as IngredientType] || TYPE_STYLES.other)
                  }
                >
                  {ing.type}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-muted-foreground">
                {ing.baseAmount}g
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm font-medium tabular-nums text-foreground">
                {formatGrams(ing.baseAmount * scaleFactor)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-card">
            <td className="px-4 py-3 text-sm font-semibold text-foreground" colSpan={2}>
              Total
            </td>
            <td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums text-muted-foreground">
              {formatGrams(recipe.totalWeight)}
            </td>
            <td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums text-brand">
              {formatGrams(totalScaled)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Mobile card list */}
      <div className="divide-y md:hidden">
        {recipe.ingredients.map((ing, i) => (
          <div key={ing.name + i} className="flex items-center justify-between px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{ing.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={
                    "inline-block rounded-full border px-1.5 py-0.5 text-[10px] " +
                    (TYPE_STYLES[ing.type as IngredientType] || TYPE_STYLES.other)
                  }
                >
                  {ing.type}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{ing.baseAmount}g base</span>
              </div>
            </div>
            <p className="ml-4 font-mono text-sm font-medium tabular-nums text-foreground">
              {formatGrams(ing.baseAmount * scaleFactor)}
            </p>
          </div>
        ))}
        <div className="flex items-center justify-between bg-card px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Total</p>
          <p className="font-mono text-sm font-semibold tabular-nums text-brand">
            {formatGrams(totalScaled)}
          </p>
        </div>
      </div>
    </div>
  )
}
