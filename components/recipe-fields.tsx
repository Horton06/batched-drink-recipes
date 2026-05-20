"use client"

import { useState, useId } from "react"
import { Plus, Trash2, Info } from "lucide-react"
import type { IngredientType } from "@/types/recipe"
import { convertToGrams, getAvailableUnits, detectIngredientType } from "@/utils/unit-conversion"
import { cn } from "@/lib/utils"

export interface FormIngredient {
  name: string
  amount: number
  unit: string
  type: IngredientType
}

export interface RecipeFieldsValue {
  name: string
  notes: string
  ingredients: FormIngredient[]
}

interface RecipeFieldsProps {
  value: RecipeFieldsValue
  onChange: (value: RecipeFieldsValue) => void
  /**
   * Used to namespace input ids so the same form rendered twice
   * (e.g. add + edit) cannot collide on element ids.
   */
  idPrefix?: string
}

/**
 * Shared field set used by both Add and Edit forms.
 * Renders name + notes + ingredient editor and exposes value via onChange.
 * Pure controlled component: no submission logic, no toast, no persistence.
 */
export function RecipeFields({ value, onChange, idPrefix }: RecipeFieldsProps) {
  const reactId = useId()
  const prefix = idPrefix ?? reactId
  const nameId = `${prefix}-name`
  const notesId = `${prefix}-notes`
  const helpId = `${prefix}-help`

  const [showHelp, setShowHelp] = useState(false)
  const units = getAvailableUnits()

  const totalWeight = value.ingredients.reduce(
    (sum, ing) => sum + convertToGrams(ing.amount, ing.unit, ing.type),
    0
  )

  const setName = (name: string) => onChange({ ...value, name })
  const setNotes = (notes: string) => onChange({ ...value, notes })
  const setIngredients = (ingredients: FormIngredient[]) =>
    onChange({ ...value, ingredients })

  const updateIngredient = (i: number, patch: Partial<FormIngredient>) => {
    setIngredients(
      value.ingredients.map((ing, idx) => {
        if (idx !== i) return ing
        const updated = { ...ing, ...patch }
        if (patch.name !== undefined) {
          updated.type = detectIngredientType(updated.name)
        }
        return updated
      })
    )
  }

  const removeIngredient = (i: number) => {
    setIngredients(value.ingredients.filter((_, idx) => idx !== i))
  }

  const addIngredient = () =>
    setIngredients([...value.ingredients, { name: "", amount: 0, unit: "g", type: "other" }])

  return (
    <div className="flex flex-col gap-6">
      {/* Name */}
      <div>
        <label
          htmlFor={nameId}
          className="mb-1.5 block font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground"
        >
          Recipe Name
        </label>
        <input
          id={nameId}
          type="text"
          required
          value={value.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mango Green Tea Lemonade"
          className={inputClass + " h-11"}
        />
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor={notesId}
          className="mb-1.5 block font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground"
        >
          Notes (optional)
        </label>
        <textarea
          id={notesId}
          value={value.notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Preparation steps, storage instructions, etc."
          rows={3}
          className={inputClass + " min-h-[88px] resize-y py-2"}
        />
      </div>

      {/* Help disclosure */}
      <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          aria-expanded={showHelp}
          aria-controls={helpId}
          className="flex w-full items-center justify-between gap-2 rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <span className="flex items-center gap-2">
            <Info aria-hidden="true" className="h-4 w-4 text-brand" />
            <span className="text-sm font-medium text-foreground">How to add ingredients</span>
          </span>
          <span className="text-xs text-muted-foreground">{showHelp ? "Hide" : "Show"}</span>
        </button>
        {showHelp && (
          <div
            id={helpId}
            className="mt-3 space-y-2 border-t border-brand/10 pt-3 text-sm leading-relaxed text-muted-foreground"
          >
            <p>
              <strong className="text-foreground">Ingredient names:</strong> Include &quot;tea&quot;
              or &quot;syrup&quot; in the name for automatic type detection.
            </p>
            <ul className="space-y-1 pl-4">
              <li>
                <strong className="text-success">Tea</strong> — e.g., &quot;Earl Grey Tea&quot;,
                &quot;Green Tea&quot; (used for batch calculations).
              </li>
              <li>
                <strong className="text-warning">Syrup</strong> — e.g., &quot;Simple Syrup&quot;,
                &quot;Vanilla Syrup&quot; (uses 1.4x density).
              </li>
              <li>Other ingredients use standard density (1.0x).</li>
            </ul>
            <p className="pt-2">
              <strong className="text-foreground">Units:</strong> Enter ingredients in any unit
              (oz, ml, cups, etc.) and they&apos;ll be automatically converted to grams.
            </p>
          </div>
        )}
      </div>

      {/* Ingredients header */}
      <div className="-mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Ingredients</h3>
        <span
          aria-live="polite"
          aria-atomic="true"
          className="rounded-md border border-brand/20 bg-brand/10 px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-brand"
        >
          {Math.round(totalWeight)}g total
        </span>
      </div>

      {/* Ingredient rows */}
      <div className="flex flex-col gap-3">
        {value.ingredients.map((ing, i) => {
          const nameInputId = `${prefix}-ing-name-${i}`
          const amountInputId = `${prefix}-ing-amount-${i}`
          const unitInputId = `${prefix}-ing-unit-${i}`
          return (
            <div key={i} className="rounded-lg border bg-card p-3 sm:p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor={nameInputId} className="sr-only">
                    Ingredient {i + 1} name
                  </label>
                  <input
                    id={nameInputId}
                    type="text"
                    required
                    value={ing.name}
                    onChange={(e) => updateIngredient(i, { name: e.target.value })}
                    placeholder="Ingredient name"
                    className={inputClass + " h-11 flex-1"}
                  />
                  {ing.type === "tea" && <TypeChip kind="tea" />}
                  {ing.type === "syrup" && <TypeChip kind="syrup" />}
                </div>
                <div className="flex gap-2">
                  <label htmlFor={amountInputId} className="sr-only">
                    Ingredient {i + 1} amount
                  </label>
                  <input
                    id={amountInputId}
                    type="number"
                    inputMode="decimal"
                    required
                    min={0}
                    step={0.01}
                    value={ing.amount || ""}
                    onChange={(e) => {
                      const val = e.target.value
                      updateIngredient(i, {
                        amount: val === "" ? 0 : parseFloat(val) || 0,
                      })
                    }}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value)
                      if (isNaN(val) || val <= 0) updateIngredient(i, { amount: 0.1 })
                    }}
                    placeholder="0"
                    className={inputClass + " h-11 w-24 font-mono"}
                  />
                  <label htmlFor={unitInputId} className="sr-only">
                    Ingredient {i + 1} unit
                  </label>
                  <select
                    id={unitInputId}
                    value={ing.unit}
                    onChange={(e) => updateIngredient(i, { unit: e.target.value })}
                    className={inputClass + " h-11 flex-1"}
                  >
                    {units.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                  {value.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      aria-label={`Remove ingredient ${i + 1}`}
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
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
          )
        })}
      </div>

      <button
        type="button"
        onClick={addIngredient}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
        Add Ingredient
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------------- */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------- */

export const inputClass = cn(
  "w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none",
  "transition-colors placeholder:text-muted-foreground",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
)

function TypeChip({ kind }: { kind: "tea" | "syrup" }) {
  const styles =
    kind === "tea"
      ? "border-success/30 bg-success/10 text-success"
      : "border-warning/30 bg-warning/10 text-warning"
  const label = kind === "tea" ? "Tea" : "Syrup"
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-2 py-1 text-xs font-medium",
        styles
      )}
    >
      {label}
    </span>
  )
}

/**
 * Compute total grams from form ingredients. Exported so submit handlers
 * can validate without re-implementing.
 */
export function totalGrams(ingredients: FormIngredient[]): number {
  return ingredients.reduce(
    (sum, ing) => sum + convertToGrams(ing.amount, ing.unit, ing.type),
    0
  )
}
