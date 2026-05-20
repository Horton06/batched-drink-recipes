"use client"

import { useEffect, useRef } from "react"
import { Search, Plus } from "lucide-react"
import type { Recipe } from "@/types/recipe"
import { RecipeList, type SortBy } from "@/components/recipe-list"
import { cn } from "@/lib/utils"

interface RecipeSidebarProps {
  open: boolean
  onClose: () => void
  recipes: Recipe[]
  selectedId: string
  search: string
  onSearchChange: (value: string) => void
  sortBy: SortBy
  onSortChange: (value: SortBy) => void
  dragId: string | null
  dragOverId: string | null
  onSelect: (id: string) => void
  onEdit: (recipe: Recipe) => void
  onDelete: (recipe: Recipe) => void
  onDragStart: (id: string) => void
  onDragOver: (e: React.DragEvent, id: string) => void
  onDrop: (id: string) => void
  onDragEnd: () => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onAddRecipe: () => void
}

/**
 * Off-canvas drawer on mobile, persistent column on >=md.
 *
 * When open on mobile we lock body scroll, trap Escape, and the backdrop
 * click closes the drawer. Focus is sent to the search input on open so the
 * keyboard flow makes sense.
 */
export function RecipeSidebar({
  open,
  onClose,
  recipes,
  selectedId,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
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
  onAddRecipe,
}: RecipeSidebarProps) {
  const searchRef = useRef<HTMLInputElement>(null)

  // Body scroll lock + Escape-to-close while drawer is open on mobile
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    // Defer so the transition doesn't fight focus styles
    const id = window.setTimeout(() => searchRef.current?.focus(), 50)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener("keydown", onKey)
      window.clearTimeout(id)
    }
  }, [open, onClose])

  return (
    <>
      {/* Backdrop (mobile only) */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-background/70 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        id="recipe-sidebar"
        aria-label="Recipes"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[88%] max-w-sm shrink-0 flex-col border-r bg-card pt-14 transition-transform duration-200 ease-out",
          "md:relative md:z-auto md:w-64 md:max-w-none md:translate-x-0 md:pt-0 lg:w-72",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="space-y-2 border-b p-3">
          <div className="flex h-11 items-center gap-2 rounded-md border bg-background px-3 transition-colors focus-within:ring-2 focus-within:ring-ring sm:h-9">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
            <label htmlFor="recipe-search" className="sr-only">
              Search recipes
            </label>
            <input
              id="recipe-search"
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search recipes..."
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <label htmlFor="recipe-sort" className="sr-only">
            Sort recipes
          </label>
          <select
            id="recipe-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className="h-9 w-full rounded-md border bg-background px-2 text-xs text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="default">Recently added</option>
            <option value="az">Name A–Z</option>
            <option value="za">Name Z–A</option>
            <option value="ingredients">Most ingredients</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <RecipeList
            recipes={recipes}
            selectedId={selectedId}
            sortBy={sortBy}
            dragId={dragId}
            dragOverId={dragOverId}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          />
        </div>

        <div className="border-t p-3">
          <button
            type="button"
            onClick={onAddRecipe}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:h-10"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            New Recipe
          </button>
        </div>
      </aside>
    </>
  )
}
