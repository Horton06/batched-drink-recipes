"use client"

import type { Recipe } from "@/types/recipe"
import { formatGrams, calculateTeaBatches } from "@/utils/unit-conversion"

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
            <th className="w-28 px-4 py-3 text-right font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Base
            </th>
            <th className="w-32 px-4 py-3 text-right font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Scaled
            </th>
          </tr>
        </thead>
        <tbody>
          {recipe.ingredients.map((ing, i) => {
            const scaledAmount = ing.baseAmount * scaleFactor
            const isTea = ing.type === "tea"
            const batches = isTea ? calculateTeaBatches(scaledAmount) : 0

            return (
              <tr
                key={ing.name + i}
                className="border-b last:border-b-0 transition-colors hover:bg-accent/50"
              >
                <td className="px-4 py-3 text-sm text-foreground">{ing.name}</td>
                <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-muted-foreground">
                  {ing.baseAmount}g
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="font-mono text-sm font-medium tabular-nums text-foreground">
                    {formatGrams(scaledAmount)}
                  </div>
                  {isTea && scaleFactor > 1 && (
                    <div className="mt-1 text-xs text-emerald-400">
                      🍵 {batches} batch{batches !== 1 ? "es" : ""}
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="bg-card">
            <td className="px-4 py-3 text-sm font-semibold text-foreground">
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
        {recipe.ingredients.map((ing, i) => {
          const scaledAmount = ing.baseAmount * scaleFactor
          const isTea = ing.type === "tea"
          const batches = isTea ? calculateTeaBatches(scaledAmount) : 0

          return (
            <div key={ing.name + i} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{ing.name}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{ing.baseAmount}g base</p>
              </div>
              <div className="ml-4 text-right">
                <p className="font-mono text-sm font-medium tabular-nums text-foreground">
                  {formatGrams(scaledAmount)}
                </p>
                {isTea && scaleFactor > 1 && (
                  <p className="mt-1 text-xs text-emerald-400">
                    🍵 {batches} batch{batches !== 1 ? "es" : ""}
                  </p>
                )}
              </div>
            </div>
          )
        })}
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
