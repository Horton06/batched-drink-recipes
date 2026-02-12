"use server"

import type { Recipe } from "@/types/recipe"
import { getSQL } from "@/lib/db"

export async function getAllRecipes(): Promise<Recipe[]> {
  const sql = getSQL()
  if (!sql) return []

  try {
    const recipes = await sql`
      SELECT id, name, total_weight, notes
      FROM recipes
      ORDER BY created_at DESC
    `

    if (!recipes.length) return []

    const ingredients = await sql`
      SELECT recipe_id, name, base_amount, unit, type
      FROM ingredients
      ORDER BY id ASC
    `

    const ingMap = new Map<string, typeof ingredients>()
    for (const ing of ingredients) {
      const list = ingMap.get(ing.recipe_id) || []
      list.push(ing)
      ingMap.set(ing.recipe_id, list)
    }

    return recipes.map((r) => ({
      id: r.id,
      name: r.name,
      totalWeight: Number(r.total_weight),
      notes: r.notes || undefined,
      ingredients: (ingMap.get(r.id) || []).map((i) => ({
        name: i.name,
        baseAmount: Number(i.base_amount),
        unit: i.unit,
        type: i.type,
      })),
    }))
  } catch {
    return []
  }
}

export async function saveRecipe(recipe: Recipe): Promise<boolean> {
  const sql = getSQL()
  if (!sql) return false

  try {
    const rows = await sql`
      INSERT INTO recipes (id, name, total_weight, notes)
      VALUES (${recipe.id}, ${recipe.name}, ${recipe.totalWeight}, ${recipe.notes || null})
      RETURNING id
    `

    const recipeId = rows[0]?.id
    if (!recipeId) return false

    for (const ing of recipe.ingredients) {
      await sql`
        INSERT INTO ingredients (recipe_id, name, base_amount, unit, type)
        VALUES (${recipeId}, ${ing.name}, ${ing.baseAmount}, ${ing.unit}, ${ing.type})
      `
    }

    return true
  } catch {
    return false
  }
}

export async function updateRecipe(recipe: Recipe): Promise<boolean> {
  const sql = getSQL()
  if (!sql) return false

  try {
    await sql`
      UPDATE recipes
      SET name = ${recipe.name}, total_weight = ${recipe.totalWeight}, notes = ${recipe.notes || null}
      WHERE id = ${recipe.id}
    `

    await sql`DELETE FROM ingredients WHERE recipe_id = ${recipe.id}`

    for (const ing of recipe.ingredients) {
      await sql`
        INSERT INTO ingredients (recipe_id, name, base_amount, unit, type)
        VALUES (${recipe.id}, ${ing.name}, ${ing.baseAmount}, ${ing.unit}, ${ing.type})
      `
    }

    return true
  } catch {
    return false
  }
}

export async function deleteRecipe(id: string): Promise<boolean> {
  const sql = getSQL()
  if (!sql) return false

  try {
    await sql`DELETE FROM recipes WHERE id = ${id}`
    return true
  } catch {
    return false
  }
}
