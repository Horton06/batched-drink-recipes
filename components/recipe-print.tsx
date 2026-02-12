"use client"

import type { Recipe } from "@/types/recipe"
import { formatGrams } from "@/utils/unit-conversion"

interface RecipePrintProps {
  recipe: Recipe
  scaleFactor: number
  targetAmount: number
  targetUnit: string
  targetGrams: number
}

export function RecipePrint({ recipe, scaleFactor, targetAmount, targetUnit, targetGrams }: RecipePrintProps) {
  const totalScaled = recipe.ingredients.reduce(
    (sum, ing) => sum + ing.baseAmount * scaleFactor,
    0
  )

  return (
    <div className="print-area bg-background p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 border-b pb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">{recipe.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Scaled to {targetAmount} {targetUnit}
          {targetUnit !== "g" && ` (${formatGrams(targetGrams)})`}
        </p>
      </div>

      {/* Ingredients table */}
      <table className="mb-8 w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Ingredient
            </th>
            <th className="w-20 py-2 text-left font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Type
            </th>
            <th className="w-28 py-2 text-right font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {recipe.ingredients.map((ing, i) => (
            <tr key={ing.name + i} className="border-b border-border/50">
              <td className="py-2.5 text-sm text-foreground">{ing.name}</td>
              <td className="py-2.5 text-xs capitalize text-muted-foreground">{ing.type}</td>
              <td className="py-2.5 text-right font-mono text-sm font-medium tabular-nums text-foreground">
                {formatGrams(ing.baseAmount * scaleFactor)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-foreground/20">
            <td className="py-2.5 text-sm font-bold text-foreground" colSpan={2}>
              Total
            </td>
            <td className="py-2.5 text-right font-mono text-sm font-bold tabular-nums text-foreground">
              {formatGrams(totalScaled)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Notes */}
      {recipe.notes && (
        <div className="mb-8">
          <h3 className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">Notes</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{recipe.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t pt-6 text-center text-xs text-muted-foreground">
        Batched &middot; Printed {new Date().toLocaleDateString()}
      </div>
    </div>
  )
}
