"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Search, Plus, Printer, Pencil, Trash2, GlassWater, Menu, X, GripVertical } from "lucide-react"
import { Toaster, toast } from "sonner"
import type { Recipe } from "@/types/recipe"
import { targetToGrams, getTargetUnits, formatGrams } from "@/utils/unit-conversion"
import { getAllRecipes, saveRecipe, updateRecipe, deleteRecipe } from "@/services/recipe-service"
import { RecipeTable } from "@/components/recipe-table"
import { RecipeForm } from "@/components/recipe-form"
import { RecipeEditForm } from "@/components/recipe-edit-form"
import { RecipePrint } from "@/components/recipe-print"

// ---------------------------------------------------------------------------
// Sample recipes -- optimized specs with target notes
// ---------------------------------------------------------------------------
function getSampleRecipes(): Recipe[] {
  return [
    {
      id: "strawberry-lemonade",
      name: "Strawberry Lemonade",
      totalWeight: 250.5,
      notes: "Brix: 9-10° | TA: 0.6-0.7% | pH: 2.8-3.0 | Salinity: 0.04%",
      ingredients: [
        { name: "Lemon Concentrate", baseAmount: 34, unit: "g", type: "liquid" },
        { name: "Water", baseAmount: 177.5, unit: "g", type: "water" },
        { name: "Strawberry Syrup", baseAmount: 22.5, unit: "g", type: "syrup" },
        { name: "Cane Syrup", baseAmount: 15.5, unit: "g", type: "syrup" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "blueberry-lemonade",
      name: "Blueberry Lemonade",
      totalWeight: 250.5,
      notes: "Brix: 9-10° | TA: 0.6-0.7% | pH: 2.8-3.0 | Salinity: 0.04%",
      ingredients: [
        { name: "Lemon Concentrate", baseAmount: 34, unit: "g", type: "liquid" },
        { name: "Water", baseAmount: 177.5, unit: "g", type: "water" },
        { name: "Blueberry Syrup", baseAmount: 22.5, unit: "g", type: "syrup" },
        { name: "Cane Syrup", baseAmount: 15.5, unit: "g", type: "syrup" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "mango-earl-grey",
      name: "Mango Earl Grey",
      totalWeight: 259,
      notes: "Brix: 7° | TA: 0.15% | pH: 4.0-4.3 | Salinity: 0.04%",
      ingredients: [
        { name: "Earl Grey Tea", baseAmount: 220, unit: "g", type: "tea" },
        { name: "Mango Syrup", baseAmount: 28, unit: "g", type: "syrup" },
        { name: "Lime Juice", baseAmount: 10, unit: "g", type: "liquid" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "blueberry-pomegranate-hibiscus",
      name: "Blueberry Pomegranate Hibiscus",
      totalWeight: 258.5,
      notes: "Brix: 9° | TA: 0.85% | pH: 2.6-2.8 | Salinity: 0.04%",
      ingredients: [
        { name: "Hibiscus Tea", baseAmount: 220, unit: "g", type: "tea" },
        { name: "Pomegranate Syrup", baseAmount: 20, unit: "g", type: "syrup" },
        { name: "Blueberry Syrup", baseAmount: 12, unit: "g", type: "syrup" },
        { name: "Vanilla Syrup", baseAmount: 6, unit: "g", type: "syrup" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "cold-brew",
      name: "Cold Brew",
      totalWeight: 250.5,
      notes: "Brix: 0° | TA: 0.05% | pH: 5.0-5.5 | Salinity: 0.04%",
      ingredients: [
        { name: "Cold Brew Concentrate", baseAmount: 125, unit: "g", type: "liquid" },
        { name: "Water", baseAmount: 124.5, unit: "g", type: "water" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "peach-palmer",
      name: "Peach Palmer",
      totalWeight: 250.5,
      notes: "Brix: 10-11° | TA: 0.30-0.35% | pH: 3.2-3.5 | Salinity: 0.04%",
      ingredients: [
        { name: "Peach Tea", baseAmount: 106, unit: "g", type: "tea" },
        { name: "Lemon Concentrate", baseAmount: 17, unit: "g", type: "liquid" },
        { name: "Water", baseAmount: 88.5, unit: "g", type: "water" },
        { name: "Pure Cane Syrup", baseAmount: 38, unit: "g", type: "syrup" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "mango-green-tea-lemonade",
      name: "Mango Green Tea Lemonade",
      totalWeight: 251,
      notes: "Brix: 8.5° | TA: 0.25-0.30% | pH: 3.5-3.8 | Salinity: 0.04%",
      ingredients: [
        { name: "Green Tea", baseAmount: 130, unit: "g", type: "tea" },
        { name: "Lemon Concentrate", baseAmount: 15.5, unit: "g", type: "liquid" },
        { name: "Water", baseAmount: 71, unit: "g", type: "water" },
        { name: "Mango Syrup", baseAmount: 24, unit: "g", type: "syrup" },
        { name: "Pure Cane Syrup", baseAmount: 10, unit: "g", type: "syrup" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "blossom-berry-lemonade-bbl",
      name: "Blossom Berry Lemonade (BBL)",
      totalWeight: 250,
      notes: "Brix: 9° | TA: 0.6-0.7% | pH: 2.8-3.0 | Salinity: 0.04%",
      ingredients: [
        { name: "Lemon Concentrate", baseAmount: 34, unit: "g", type: "liquid" },
        { name: "Water", baseAmount: 177.5, unit: "g", type: "water" },
        { name: "Blueberry Syrup", baseAmount: 15, unit: "g", type: "syrup" },
        { name: "Pomegranate Syrup", baseAmount: 15, unit: "g", type: "syrup" },
        { name: "Cane Syrup", baseAmount: 7.5, unit: "g", type: "syrup" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "quince-cooler",
      name: "Quince Cooler",
      totalWeight: 257,
      notes: "Brix: 9° | TA: 0.35% | pH: 3.3-3.6 | Salinity: 0.04%",
      ingredients: [
        { name: "Quince Tea", baseAmount: 198, unit: "g", type: "tea" },
        { name: "Lemon Concentrate", baseAmount: 22, unit: "g", type: "liquid" },
        { name: "Mango Syrup", baseAmount: 22, unit: "g", type: "syrup" },
        { name: "Pure Cane Syrup", baseAmount: 14, unit: "g", type: "syrup" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "blueberry-pomegranate-earl-grey",
      name: "Blueberry Pomegranate Earl Grey",
      totalWeight: 260,
      notes: "Brix: 7° | TA: 0.15% | pH: 3.8-4.2 | Salinity: 0.04%",
      ingredients: [
        { name: "Earl Grey", baseAmount: 217, unit: "g", type: "tea" },
        { name: "Blueberry Syrup", baseAmount: 12, unit: "g", type: "syrup" },
        { name: "Pomegranate Syrup", baseAmount: 12, unit: "g", type: "syrup" },
        { name: "Cane Syrup", baseAmount: 8, unit: "g", type: "syrup" },
        { name: "Lime Juice", baseAmount: 10, unit: "g", type: "liquid" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "guava-green-tea",
      name: "Guava Green Tea",
      totalWeight: 253.5,
      notes: "Brix: 7.5° | TA: 0.30% | pH: 3.8-4.2 | Salinity: 0.04%",
      ingredients: [
        { name: "Green Tea", baseAmount: 170, unit: "g", type: "tea" },
        { name: "Peach Tea", baseAmount: 30, unit: "g", type: "tea" },
        { name: "Lime Juice", baseAmount: 21.5, unit: "g", type: "liquid" },
        { name: "Guava Syrup", baseAmount: 22, unit: "g", type: "syrup" },
        { name: "Pear Syrup", baseAmount: 9, unit: "g", type: "syrup" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "strawberry-bloom",
      name: "Strawberry Bloom",
      totalWeight: 254,
      notes: "Brix: 7° | TA: 0.20% | pH: 4.0-4.5 | Salinity: 0.04%",
      ingredients: [
        { name: "Green Tea", baseAmount: 206, unit: "g", type: "tea" },
        { name: "Strawberry Rose Syrup", baseAmount: 20, unit: "g", type: "syrup" },
        { name: "Lime Juice", baseAmount: 16, unit: "g", type: "liquid" },
        { name: "Cane Syrup", baseAmount: 11, unit: "g", type: "syrup" },
        { name: "Saline Solution (20%)", baseAmount: 0.5, unit: "g", type: "other" },
      ],
    },
    {
      id: "lucky-revival",
      name: "Steady State (Lucky Revival)",
      totalWeight: 259,
      notes: "Brix: 8° | TA: 0.14% | pH: 3.8-4.0 | Salinity: 0.12% | Na: ~230mg | K: ~113mg",
      ingredients: [
        { name: "Coconut Water", baseAmount: 125, unit: "g", type: "water" },
        { name: "Cucumber Gatorade", baseAmount: 50, unit: "g", type: "liquid" },
        { name: "Peach Tea", baseAmount: 50, unit: "g", type: "tea" },
        { name: "Lime Juice", baseAmount: 17.5, unit: "g", type: "liquid" },
        { name: "Pear Syrup", baseAmount: 15, unit: "g", type: "syrup" },
        { name: "Saline Solution (20%)", baseAmount: 1.5, unit: "g", type: "other" },
      ],
    },
  ]
}

// ---------------------------------------------------------------------------
// Tabs / Sort / Filter
// ---------------------------------------------------------------------------
type Tab = "recipes" | "add" | "print"
type SortBy = "default" | "az" | "za" | "ingredients"

// ---------------------------------------------------------------------------
// Main App
// ---------------------------------------------------------------------------
export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(getSampleRecipes)
  const [selectedId, setSelectedId] = useState<string>("strawberry-lemonade")
  const [tab, setTab] = useState<Tab>("recipes")
  const [search, setSearch] = useState("")
  const [targetAmount, setTargetAmount] = useState(1)
  const [targetUnit, setTargetUnit] = useState("gallon")
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Recipe | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>("default")
  const [recipeOrder, setRecipeOrder] = useState<string[]>(() => getSampleRecipes().map((r) => r.id))
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const selected = recipes.find((r) => r.id === selectedId) || recipes[0]
  const effectiveTargetAmount = Math.max(0.1, targetAmount)
  const targetGrams = targetToGrams(effectiveTargetAmount, targetUnit, selected?.totalWeight || 250)
  const scaleFactor = selected ? targetGrams / selected.totalWeight : 1

  // Silent Neon sync on mount
  useEffect(() => {
    getAllRecipes().then((dbRecipes) => {
      if (dbRecipes.length > 0) {
        const sampleIds = new Set(getSampleRecipes().map((r) => r.id))
        const extras = dbRecipes.filter((r) => !sampleIds.has(r.id))
        if (extras.length > 0) {
          setRecipes((prev) => [...prev, ...extras])
          setRecipeOrder((prev) => [...prev, ...extras.map((r) => r.id)])
        }
      }
    })
  }, [])

  const processedRecipes = useMemo(() => {
    let result = recipes.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    )

    if (sortBy === "az") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "za") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortBy === "ingredients") {
      result = [...result].sort((a, b) => b.ingredients.length - a.ingredients.length)
    } else {
      // Recently added: sort by recipeOrder (insertion order), unknown IDs go to the end
      result = [...result].sort((a, b) => {
        const ai = recipeOrder.indexOf(a.id)
        const bi = recipeOrder.indexOf(b.id)
        return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi)
      })
    }

    return result
  }, [recipes, search, sortBy, recipeOrder])

  const handleSelectRecipe = useCallback((id: string) => {
    setSelectedId(id)
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

  const handleDragStart = useCallback((id: string) => {
    setDragId(id)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault()
    setDragOverId(id)
  }, [])

  const handleDrop = useCallback(
    (targetId: string) => {
      if (!dragId || dragId === targetId) {
        setDragId(null)
        setDragOverId(null)
        return
      }
      setRecipeOrder((prev) => {
        // Ensure every recipe ID is represented in the order array
        const allIds = recipes.map((r) => r.id)
        const full = [...prev, ...allIds.filter((id) => !prev.includes(id))]
        const fromIdx = full.indexOf(dragId)
        const toIdx = full.indexOf(targetId)
        if (fromIdx === -1 || toIdx === -1) return prev
        full.splice(fromIdx, 1)
        full.splice(toIdx, 0, dragId)
        return full
      })
      setDragId(null)
      setDragOverId(null)
    },
    [dragId, recipes]
  )

  const handleDragEnd = useCallback(() => {
    setDragId(null)
    setDragOverId(null)
  }, [])

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <Toaster theme="dark" position="bottom-right" />

      {/* Delete confirmation overlay */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-lg border bg-card p-6">
            <h3 className="text-base font-semibold text-card-foreground">Delete recipe?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {'"' + deleteConfirm.name + '" will be permanently removed.'}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-md border px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRecipe(deleteConfirm)}
                className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground transition-colors hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent md:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
              <GlassWater className="h-4 w-4" />
            </div>
            <h1 className="text-base font-semibold tracking-tight text-card-foreground">Batched</h1>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {(
            [
              { key: "recipes", label: "Recipes" },
              { key: "add", label: "Add" },
              { key: "print", label: "Print" },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key)
                setEditingRecipe(null)
              }}
              className={
                "rounded-md px-3 py-1.5 text-sm transition-colors " +
                (tab === t.key
                  ? "bg-brand text-brand-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
              }
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={
            "fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col overflow-hidden border-r bg-card pt-14 transition-transform duration-200 md:relative md:z-auto md:w-64 md:translate-x-0 md:pt-0 lg:w-72 " +
            (sidebarOpen ? "translate-x-0" : "-translate-x-full")
          }
        >
          {/* Search + Sort controls */}
          <div className="border-b p-3 space-y-2">
            <div className="flex h-9 items-center gap-2 rounded-md border bg-background px-3 transition-colors focus-within:ring-1 focus-within:ring-ring">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="h-7 w-full rounded-md border bg-background px-2 text-xs text-foreground outline-none transition-colors focus:ring-1 focus:ring-ring"
            >
              <option value="default">Recently added</option>
              <option value="az">Name A–Z</option>
              <option value="za">Name Z–A</option>
              <option value="ingredients">Most ingredients</option>
            </select>
          </div>

          {/* Recipe list */}
          <div className="flex-1 overflow-y-auto py-1">
            {processedRecipes.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No recipes found</div>
            ) : (
              processedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  draggable={sortBy === "default"}
                  onDragStart={() => handleDragStart(recipe.id)}
                  onDragOver={(e) => handleDragOver(e, recipe.id)}
                  onDrop={() => handleDrop(recipe.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    handleSelectRecipe(recipe.id)
                    setTab("recipes")
                  }}
                  className={
                    "group mx-1.5 my-0.5 flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 transition-colors " +
                    (recipe.id === selectedId
                      ? "bg-brand/10 text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground") +
                    (dragOverId === recipe.id && dragId !== recipe.id
                      ? " ring-1 ring-brand/50"
                      : "")
                  }
                >
                  {sortBy === "default" && (
                    <GripVertical className="mr-1.5 h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground/40 opacity-0 group-hover:opacity-100 active:cursor-grabbing" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{recipe.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {recipe.ingredients.length} ingredients &middot; {formatGrams(recipe.totalWeight)} base
                    </p>
                  </div>
                  <div className="ml-2 flex shrink-0 items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingRecipe(recipe)
                        setTab("recipes")
                      }}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label={"Edit " + recipe.name}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm(recipe)
                      }}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={"Delete " + recipe.name}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar footer */}
          <div className="border-t p-3">
            <button
              onClick={() => {
                setTab("add")
                setSidebarOpen(false)
              }}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-brand text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
            >
              <Plus className="h-4 w-4" />
              New Recipe
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {tab === "recipes" && !editingRecipe && selected && (
            <div className="mx-auto max-w-3xl p-4 md:p-8">
              {/* Recipe header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">
                  {selected.name}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Base recipe: {formatGrams(selected.totalWeight)} &middot; {selected.ingredients.length} ingredients
                </p>
              </div>

              {/* Scaling controls */}
              <div className="mb-6 rounded-lg border bg-card p-4">
                <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Scale
                </span>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Amount</label>
                    <input
                      type="number"
                      min={0.1}
                      step={0.5}
                      value={targetAmount || ""}
                      onChange={(e) => {
                        const val = e.target.value
                        const parsed = val === "" ? 0 : parseFloat(val)
                        setTargetAmount(isNaN(parsed) ? 0 : parsed)
                      }}
                      onBlur={() => {
                        if (targetAmount < 0.1) setTargetAmount(0.1)
                      }}
                      className="h-9 w-24 rounded-md border bg-background px-3 font-mono text-sm tabular-nums text-foreground outline-none transition-colors focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Unit</label>
                    <select
                      value={targetUnit}
                      onChange={(e) => setTargetUnit(e.target.value)}
                      className="h-9 rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:ring-1 focus:ring-ring"
                    >
                      {getTargetUnits().map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex h-9 items-center rounded-md bg-brand/10 px-3 font-mono text-sm font-medium tabular-nums text-brand">
                    {formatGrams(targetGrams)} total
                  </div>
                </div>
              </div>

              {/* Ingredient table */}
              <RecipeTable recipe={selected} scaleFactor={scaleFactor} />

              {/* Notes */}
              {selected.notes && (
                <div className="mt-4 rounded-lg border bg-card p-4">
                  <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Notes
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selected.notes}</p>
                </div>
              )}
            </div>
          )}

          {tab === "recipes" && editingRecipe && (
            <div className="mx-auto max-w-2xl p-4 md:p-8">
              <RecipeEditForm recipe={editingRecipe} onSave={handleEditRecipe} onCancel={() => setEditingRecipe(null)} />
            </div>
          )}

          {tab === "add" && (
            <div className="mx-auto max-w-2xl p-4 md:p-8">
              <RecipeForm onAdd={handleAddRecipe} />
            </div>
          )}

          {tab === "print" && selected && (
            <div className="mx-auto max-w-2xl p-4 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Print Recipe</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Print a scaled recipe sheet for {selected.name}
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
                >
                  <Printer className="h-4 w-4" />
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
    </div>
  )
}
