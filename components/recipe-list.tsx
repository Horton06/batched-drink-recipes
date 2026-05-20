"use client"

import { GripVertical, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import type { Recipe } from "@/types/recipe"
import { formatGrams } from "@/utils/unit-conversion"
import { cn } from "@/lib/utils"

export type SortBy = "default" | "az" | "za" | "ingredients"

interface RecipeListProps {
  recipes: Recipe[]
  selectedId: string
  sortBy: SortBy
  dragId: string | null
  dragOverId: string | null
  /** Called when a row is selected. Used to also close mobile drawer. */
  onSelect: (id: string) => void
  onEdit: (recipe: Recipe) => void
  onDelete: (recipe: Recipe) => void
  /** Reorder helpers — mouse drag */
  onDragStart: (id: string) => void
  onDragOver: (e: React.DragEvent, id: string) => void
  onDrop: (id: string) => void
  onDragEnd: () => void
  /** Reorder helpers — keyboard / touch */
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}

/**
 * Sidebar recipe list. Pure presentation — receives all state from parent.
 * Adds explicit move-up / move-down buttons in default sort so reorder is
 * available without a mouse (covers keyboard + touch).
 */
export function RecipeList({
  recipes,
  selectedId,
  sortBy,
  dragId,
  dragOverId,
  onSelect,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
}: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        No recipes found.
      </div>
    )
  }

  const reorderable = sortBy === "default"

  return (
    <ul role="list" className="py-1">
      {recipes.map((recipe, index) => {
        const isSelected = recipe.id === selectedId
        const isDragTarget = dragOverId === recipe.id && dragId !== recipe.id
        return (
          <li
            key={recipe.id}
            draggable={reorderable}
            onDragStart={() => onDragStart(recipe.id)}
            onDragOver={(e) => onDragOver(e, recipe.id)}
            onDrop={() => onDrop(recipe.id)}
            onDragEnd={onDragEnd}
            className={cn(
              "group mx-1.5 my-0.5 flex items-center gap-1 rounded-md transition-colors",
              isSelected
                ? "bg-brand/10 text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isDragTarget && "ring-1 ring-brand/50"
            )}
          >
            {reorderable && (
              <span
                aria-hidden="true"
                className="ml-1 hidden h-9 w-5 items-center justify-center text-muted-foreground/40 md:flex md:cursor-grab md:active:cursor-grabbing md:opacity-0 md:group-hover:opacity-100"
              >
                <GripVertical className="h-3.5 w-3.5" />
              </span>
            )}
            <button
              type="button"
              onClick={() => onSelect(recipe.id)}
              aria-current={isSelected ? "true" : undefined}
              className="min-w-0 flex-1 rounded-md px-2 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
            >
              <span className="block truncate text-sm font-medium">{recipe.name}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {recipe.ingredients.length} ingredients · {formatGrams(recipe.totalWeight)} base
              </span>
            </button>
            <div className="flex shrink-0 items-center gap-0.5 pr-1.5">
              {reorderable && (
                <>
                  <IconButton
                    label={`Move ${recipe.name} up`}
                    onClick={() => onMoveUp(recipe.id)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </IconButton>
                  <IconButton
                    label={`Move ${recipe.name} down`}
                    onClick={() => onMoveDown(recipe.id)}
                    disabled={index === recipes.length - 1}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </IconButton>
                </>
              )}
              <IconButton
                label={`Edit ${recipe.name}`}
                onClick={() => onEdit(recipe)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                label={`Delete ${recipe.name}`}
                tone="destructive"
                onClick={() => onDelete(recipe)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function IconButton({
  label,
  onClick,
  children,
  disabled,
  tone = "default",
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  tone?: "default" | "destructive"
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-30",
        tone === "destructive"
          ? "hover:bg-destructive/10 hover:text-destructive"
          : "hover:bg-accent hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}
