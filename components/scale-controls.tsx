"use client"

import { useId } from "react"
import { getTargetUnits, formatGrams } from "@/utils/unit-conversion"
import { cn } from "@/lib/utils"

interface ScaleControlsProps {
  targetAmount: number
  targetUnit: string
  targetGrams: number
  onTargetAmountChange: (next: number) => void
  onTargetUnitChange: (next: string) => void
}

/**
 * Sticky scale controls. On mobile this clings to the top of the scroll
 * container so the user can keep adjusting the batch size while scanning
 * the ingredient table beneath it.
 */
export function ScaleControls({
  targetAmount,
  targetUnit,
  targetGrams,
  onTargetAmountChange,
  onTargetUnitChange,
}: ScaleControlsProps) {
  const id = useId()
  const amountId = `${id}-amount`
  const unitId = `${id}-unit`

  return (
    <fieldset
      className={cn(
        "sticky top-0 z-10 -mx-4 rounded-none border-y bg-card/95 px-4 py-3 backdrop-blur",
        "sm:static sm:mx-0 sm:rounded-lg sm:border sm:px-4 sm:py-4 sm:backdrop-blur-none"
      )}
    >
      <legend className="px-1 font-mono text-xs uppercase tracking-widest text-muted-foreground sm:mb-3">
        Scale
      </legend>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={amountId} className="text-xs font-medium text-muted-foreground">
            Amount
          </label>
          <input
            id={amountId}
            type="number"
            inputMode="decimal"
            min={0.1}
            step={0.5}
            value={targetAmount || ""}
            onChange={(e) => {
              const val = e.target.value
              const parsed = val === "" ? 0 : parseFloat(val)
              onTargetAmountChange(isNaN(parsed) ? 0 : parsed)
            }}
            onBlur={() => {
              if (targetAmount < 0.1) onTargetAmountChange(0.1)
            }}
            className="h-11 w-24 rounded-md border bg-background px-3 font-mono text-sm tabular-nums text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring sm:h-9"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={unitId} className="text-xs font-medium text-muted-foreground">
            Unit
          </label>
          <select
            id={unitId}
            value={targetUnit}
            onChange={(e) => onTargetUnitChange(e.target.value)}
            className="h-11 rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring sm:h-9"
          >
            {getTargetUnits().map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        <div
          aria-live="polite"
          aria-atomic="true"
          className="flex h-11 items-center rounded-md border border-brand/30 bg-brand/10 px-3 font-mono text-sm font-semibold tabular-nums text-brand sm:h-9"
        >
          {formatGrams(targetGrams)} total
        </div>
      </div>
    </fieldset>
  )
}
