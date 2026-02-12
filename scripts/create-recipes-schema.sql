-- Neon PostgreSQL schema for Batched Drink Recipes

CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  total_weight DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  base_amount DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);
