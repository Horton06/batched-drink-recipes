"use client"

import type { Recipe } from "@/types/recipe"
import { formatGrams, calculateTeaBatches } from "@/utils/unit-conversion"
import { cn } from "@/lib/utils"

interface RecipeTableProps {
  recipe: Recipe
  scaleFactor: number
}

/**
 * Ingredient list, optimized for both desktop tabular reading and
 * mobile scanning. Single source of truth for row data; one renderer
 * per breakpoint to keep semantics correct (real <table> on desktop,
 * description-list-style cards on mobile).
 */
export function RecipeTable({ recipe, scaleFactor }: RecipeTableProps) {
  const rows = recipe.ingredients.map((ing) => {
    const scaledAmount = ing.baseAmount * scaleFactor
    const isTea = ing.type === "tea"
    return {
      ing,
      scaledAmount,
      isTea,
      batches: isTea ? calculateTeaBatches(scaledAmount) : 0,
    }
  })
  const totalScaled = rows.reduce((sum, r) => sum + r.scaledAmount, 0)
  const showBatches = scaleFactor > 1

  return (
    <section
      aria-label="Ingredients"
      className="overflow-hidden rounded-lg border bg-card"
    >
      {/* Desktop / tablet: real table */}
      <table className="hidden w-full md:table">
        <thead>
          <tr className="border-b">
            <th scope="col" className={thClass + " text-left"}>
              Ingredient
            </th>
            <th scope="col" className={thClass + " w-28 text-right"}>
              Base
            </th>
            <th scope="col" className={thClass + " w-32 text-right"}>
              Scaled
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ ing, scaledAmount, isTea, batches }, i) => (
            <tr
              key={ing.name + i}
              className="border-b last:border-b-0 transition-colors hover:bg-accent/40"
            >
              <td className="px-4 py-3 text-sm text-foreground">
                <span>{ing.name}</span>
                {isTea && (
                  <span className="ml-2 align-middle text-xs font-medium text-success">
                    Tea
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-muted-foreground">
                {ing.baseAmount}g
              </td>
              <td className="px-4 py-3 text-right">
                <div className="font-mono text-sm font-medium tabular-nums text-foreground">
                  {formatGrams(scaledAmount)}
                </div>
                {isTea && showBatches && (
                  <div className="mt-1 text-xs text-success">
                    {batches} batch{batches !== 1 ? "es" : ""}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-muted/40">
            <td className="px-4 py-3 text-sm font-semibold text-foreground">Total</td>
            <td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums text-muted-foreground">
              {formatGrams(recipe.totalWeight)}
            </td>
            <td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums text-brand">
              {formatGrams(totalScaled)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Mobile: dense list */}
      <ul className="divide-y md:hidden" aria-label="Ingredients (mobile view)">
        {rows.map(({ ing, scaledAmount, isTea, batches }, i) => (
          <li
            key={ing.name + i}
            className="flex items-baseline justify-between gap-3 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {ing.name}
                {isTea && (
                  <span className="ml-2 align-middle text-[11px] font-medium uppercase tracking-wide text-success">
                    Tea
                  </span>
                )}
              </p>
              <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                {ing.baseAmount}g base
                {isTea && showBatches && (
                  <span className="ml-2 text-success">
                    · {batches} batch{batches !== 1 ? "es" : ""}
                  </span>
                )}
              </p>
            </div>
            <p className="shrink-0 text-right font-mono text-base font-semibold tabular-nums text-foreground">
              {formatGrams(scaledAmount)}
            </p>
          </li>
        ))}
        <li className="flex items-center justify-between bg-muted/40 px-4 py-3">
          <span className="text-sm font-semibold text-foreground">Total</span>
          <span className="font-mono text-base font-semibold tabular-nums text-brand">
            {formatGrams(totalScaled)}
          </span>
        </li>
      </ul>
    </section>
  )
}

const thClass = cn(
  "px-4 py-3 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground"
)
