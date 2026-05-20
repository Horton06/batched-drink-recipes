"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Printer, GlassWater, Menu, X } from "lucide-react"
import { Toaster, toast } from "sonner"
import type { Recipe } from "@/types/recipe"
import { targetToGrams } from "@/utils/unit-conversion"
import { getAllRecipes, saveRecipe, updateRecipe, deleteRecipe } from "@/services/recipe-service"
import { SAMPLE_RECIPES, SAMPLE_RECIPE_IDS } from "@/lib/sample-recipes"
import { RecipeForm } from "@/components/recipe-form"
import { RecipeEditForm } from "@/components/recipe-edit-form"
import { RecipePrint } from "@/components/recipe-print"
import { RecipeDetail } from "@/components/recipe-detail"
import { RecipeSidebar } from "@/components/recipe-sidebar"
import { DeleteDialog } from "@/components/delete-dialog"
import { cn } from "@/lib/utils"

type Tab = "recipes" | "add" | "print"
type SortBy = "default" | "az" | "za" | "ingredients"

const TABS: { key: Tab; label: string }[] = [
  { key: "recipes", label: "Recipes" },
  { key: "add", label: "Add" },
  { key: "print", label: "Print" },
]

/**
 * Top-level app shell.
 *
 * State here is intentionally lifted: recipes / selectedId / scale settings /
 * tab / sort / drag state. Child components are presentational.
 */
export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(SAMPLE_RECIPES)
  const [selectedId, setSelectedId] = useState<string>(SAMPLE_RECIPES[0].id)
  const [tab, setTab] = useState<Tab>("recipes")
  const [search, setSearch] = useState("")
  const [targetAmount, setTargetAmount] = useState(1)
  const [targetUnit, setTargetUnit] = useState("gallon")
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Recipe | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>("default")
  const [recipeOrder, setRecipeOrder] = useState<string[]>(SAMPLE_RECIPE_IDS)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const selected = recipes.find((r) => r.id === selectedId) || recipes[0]
  const effectiveTargetAmount = Math.max(0.1, targetAmount)
  const targetGrams = targetToGrams(
    effectiveTargetAmount,
    targetUnit,
    selected?.totalWeight || 250
  )
  const scaleFactor = selected ? targetGrams / selected.totalWeight : 1

  // Hydrate from Neon when available; fall through to samples otherwise.
  useEffect(() => {
    getAllRecipes().then((dbRecipes) => {
      if (dbRecipes.length > 0) {
        setRecipes(dbRecipes)
        setRecipeOrder(dbRecipes.map((r) => r.id))
      }
    })
  }, [])

  const processedRecipes = useMemo(() => {
    const q = search.toLowerCase()
    let result = recipes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    )

    if (sortBy === "az") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "za") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortBy === "ingredients") {
      result = [...result].sort((a, b) => b.ingredients.length - a.ingredients.length)
    } else {
      result = [...result].sort((a, b) => {
        const ai = recipeOrder.indexOf(a.id)
        const bi = recipeOrder.indexOf(b.id)
        return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi)
      })
    }
    return result
  }, [recipes, search, sortBy, recipeOrder])

  /* --------------------------------------------------------------------- */
  /* Handlers                                                              */
  /* --------------------------------------------------------------------- */

  const handleSelectRecipe = useCallback((id: string) => {
    setSelectedId(id)
    setEditingRecipe(null)
    setTab("recipes")
    setSidebarOpen(false)
  }, [])

  const handleAddRecipe = useCallback((recipe: Recipe) => {
    setRecipes((prev) => [...prev, recipe])
    setRecipeOrder((prev) => [...prev, recipe.id])
    setSelectedId(recipe.id)
    setTab("recipes")
    toast.success("Recipe added")
    saveRecipe(recipe)
  }, [])

  const handleEditRecipe = useCallback((updated: Recipe) => {
    setRecipes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    setEditingRecipe(null)
    setTab("recipes")
    toast.success("Recipe updated")
    updateRecipe(updated)
  }, [])

  const handleDeleteRecipe = useCallback(
    (recipe: Recipe) => {
      setRecipes((prev) => {
        const next = prev.filter((r) => r.id !== recipe.id)
        if (selectedId === recipe.id && next.length > 0) {
          setSelectedId(next[0].id)
        }
        return next
      })
      setRecipeOrder((prev) => prev.filter((id) => id !== recipe.id))
      setDeleteConfirm(null)
      toast.success("Recipe deleted")
      deleteRecipe(recipe.id)
    },
    [selectedId]
  )

  const reorderById = useCallback(
    (id: string, direction: -1 | 1) => {
      setRecipeOrder((prev) => {
        const allIds = recipes.map((r) => r.id)
        const full = [...prev, ...allIds.filter((rid) => !prev.includes(rid))]
        const fromIdx = full.indexOf(id)
        if (fromIdx === -1) return prev
        const toIdx = fromIdx + direction
        if (toIdx < 0 || toIdx >= full.length) return prev
        full.splice(fromIdx, 1)
        full.splice(toIdx, 0, id)
        return full
      })
    },
    [recipes]
  )

  const handleMoveUp = useCallback((id: string) => reorderById(id, -1), [reorderById])
  const handleMoveDown = useCallback((id: string) => reorderById(id, 1), [reorderById])

  const handleDragStart = useCallback((id: string) => setDragId(id), [])
  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault()
    setDragOverId(id)
  }, [])
  const handleDragEnd = useCallback(() => {
    setDragId(null)
    setDragOverId(null)
  }, [])
  const handleDrop = useCallback(
    (targetId: string) => {
      if (!dragId || dragId === targetId) {
        handleDragEnd()
        return
      }
      setRecipeOrder((prev) => {
        const allIds = recipes.map((r) => r.id)
        const full = [...prev, ...allIds.filter((id) => !prev.includes(id))]
        const fromIdx = full.indexOf(dragId)
        const toIdx = full.indexOf(targetId)
        if (fromIdx === -1 || toIdx === -1) return prev
        full.splice(fromIdx, 1)
        full.splice(toIdx, 0, dragId)
        return full
      })
      handleDragEnd()
    },
    [dragId, recipes, handleDragEnd]
  )

  const onTabClick = (next: Tab) => {
    setTab(next)
    setEditingRecipe(null)
  }

  /* --------------------------------------------------------------------- */
  /* Render                                                                */
  /* --------------------------------------------------------------------- */

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <Toaster theme="dark" position="bottom-center" closeButton richColors />

      <DeleteDialog
        recipeName={deleteConfirm?.name ?? null}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDeleteRecipe(deleteConfirm)}
      />

      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-card px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-controls="recipe-sidebar"
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? "Close recipe list" : "Open recipe list"}
            className="flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
          >
            {sidebarOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <GlassWater aria-hidden="true" className="h-4 w-4" />
            </div>
            <h1 className="text-base font-semibold tracking-tight text-card-foreground">
              Batched
            </h1>
          </div>
        </div>

        {/* Top tab bar (>=sm). Mobile uses bottom tab bar. */}
        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => onTabClick(t.key)}
              aria-current={tab === t.key ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                tab === t.key
                  ? "bg-brand text-brand-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <RecipeSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          recipes={processedRecipes}
          selectedId={selectedId}
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          dragId={dragId}
          dragOverId={dragOverId}
          onSelect={handleSelectRecipe}
          onEdit={(recipe) => {
            setEditingRecipe(recipe)
            setTab("recipes")
            setSidebarOpen(false)
          }}
          onDelete={(recipe) => setDeleteConfirm(recipe)}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onAddRecipe={() => {
            setTab("add")
            setSidebarOpen(false)
          }}
        />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto overscroll-contain pb-16 sm:pb-0"
        >
          {tab === "recipes" && !editingRecipe && selected && (
            <div className="mx-auto max-w-3xl p-4 sm:p-6 md:p-8">
              <RecipeDetail
                recipe={selected}
                targetAmount={targetAmount}
                targetUnit={targetUnit}
                targetGrams={targetGrams}
                scaleFactor={scaleFactor}
                onTargetAmountChange={setTargetAmount}
                onTargetUnitChange={setTargetUnit}
              />
            </div>
          )}

          {tab === "recipes" && editingRecipe && (
            <div className="mx-auto max-w-2xl p-4 sm:p-6 md:p-8">
              <RecipeEditForm
                recipe={editingRecipe}
                onSave={handleEditRecipe}
                onCancel={() => setEditingRecipe(null)}
              />
            </div>
          )}

          {tab === "add" && (
            <div className="mx-auto max-w-2xl p-4 sm:p-6 md:p-8">
              <RecipeForm onAdd={handleAddRecipe} />
            </div>
          )}

          {tab === "print" && selected && (
            <div className="mx-auto max-w-2xl p-4 sm:p-6 md:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Print Recipe
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Print a scaled recipe sheet for {selected.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:h-10 sm:self-start"
                >
                  <Printer aria-hidden="true" className="h-4 w-4" />
                  Print
                </button>
              </div>
              <div className="overflow-hidden rounded-lg border">
                <RecipePrint
                  recipe={selected}
                  scaleFactor={scaleFactor}
                  targetAmount={targetAmount}
                  targetUnit={targetUnit}
                  targetGrams={targetGrams}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom tab bar (mobile) */}
      <nav
        aria-label="Primary (mobile)"
        className="no-print fixed inset-x-0 bottom-0 z-30 flex h-14 shrink-0 items-stretch border-t bg-card sm:hidden"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onTabClick(t.key)}
            aria-current={tab === t.key ? "page" : undefined}
            className={cn(
              "relative flex flex-1 items-center justify-center text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
              tab === t.key
                ? "text-brand"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === t.key && (
              <span
                aria-hidden="true"
                className="absolute inset-x-6 top-0 h-0.5 rounded-b-full bg-brand"
              />
            )}
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
