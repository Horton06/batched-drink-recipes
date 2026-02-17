-- Seed script: optimized drink recipes with target spec notes
-- Run after create-recipes-schema.sql
-- Safe to re-run: uses ON CONFLICT DO NOTHING

-- ============================================================
-- 1. Strawberry Lemonade
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'strawberry-lemonade',
  'Strawberry Lemonade',
  250.5,
  'Brix: 9-10° | TA: 0.6-0.7% | pH: 2.8-3.0 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('strawberry-lemonade', 'Lemon Concentrate',    34,    'g', 'liquid'),
  ('strawberry-lemonade', 'Water',                177.5, 'g', 'water'),
  ('strawberry-lemonade', 'Strawberry Syrup',     22.5,  'g', 'syrup'),
  ('strawberry-lemonade', 'Cane Syrup',           15.5,  'g', 'syrup'),
  ('strawberry-lemonade', 'Saline Solution (20%)', 0.5,  'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. Blueberry Lemonade
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'blueberry-lemonade',
  'Blueberry Lemonade',
  250.5,
  'Brix: 9-10° | TA: 0.6-0.7% | pH: 2.8-3.0 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('blueberry-lemonade', 'Lemon Concentrate',    34,    'g', 'liquid'),
  ('blueberry-lemonade', 'Water',                177.5, 'g', 'water'),
  ('blueberry-lemonade', 'Blueberry Syrup',      22.5,  'g', 'syrup'),
  ('blueberry-lemonade', 'Cane Syrup',           15.5,  'g', 'syrup'),
  ('blueberry-lemonade', 'Saline Solution (20%)', 0.5,  'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. Mango Earl Grey
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'mango-earl-grey',
  'Mango Earl Grey',
  259,
  'Brix: 7° | TA: 0.15% | pH: 4.0-4.3 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('mango-earl-grey', 'Earl Grey Tea',           220,  'g', 'tea'),
  ('mango-earl-grey', 'Mango Syrup',             28,   'g', 'syrup'),
  ('mango-earl-grey', 'Lime Juice',              10,   'g', 'liquid'),
  ('mango-earl-grey', 'Saline Solution (20%)',    0.5, 'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. Blueberry Pomegranate Hibiscus
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'blueberry-pomegranate-hibiscus',
  'Blueberry Pomegranate Hibiscus',
  258.5,
  'Brix: 9° | TA: 0.85% | pH: 2.6-2.8 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('blueberry-pomegranate-hibiscus', 'Hibiscus Tea',            220,  'g', 'tea'),
  ('blueberry-pomegranate-hibiscus', 'Pomegranate Syrup',       20,   'g', 'syrup'),
  ('blueberry-pomegranate-hibiscus', 'Blueberry Syrup',         12,   'g', 'syrup'),
  ('blueberry-pomegranate-hibiscus', 'Vanilla Syrup',            6,   'g', 'syrup'),
  ('blueberry-pomegranate-hibiscus', 'Saline Solution (20%)',    0.5, 'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. Cold Brew
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'cold-brew',
  'Cold Brew',
  250.5,
  'Brix: 0° | TA: 0.05% | pH: 5.0-5.5 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('cold-brew', 'Cold Brew Concentrate',  125,   'g', 'liquid'),
  ('cold-brew', 'Water',                  124.5, 'g', 'water'),
  ('cold-brew', 'Saline Solution (20%)',    0.5, 'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 6. Peach Palmer
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'peach-palmer',
  'Peach Palmer',
  250.5,
  'Brix: 10-11° | TA: 0.30-0.35% | pH: 3.2-3.5 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('peach-palmer', 'Peach Tea',              106,  'g', 'tea'),
  ('peach-palmer', 'Lemon Concentrate',       17,  'g', 'liquid'),
  ('peach-palmer', 'Water',                   88.5,'g', 'water'),
  ('peach-palmer', 'Pure Cane Syrup',         38,  'g', 'syrup'),
  ('peach-palmer', 'Saline Solution (20%)',    0.5,'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. Mango Green Tea Lemonade
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'mango-green-tea-lemonade',
  'Mango Green Tea Lemonade',
  251,
  'Brix: 8.5° | TA: 0.25-0.30% | pH: 3.5-3.8 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('mango-green-tea-lemonade', 'Green Tea',              130,  'g', 'tea'),
  ('mango-green-tea-lemonade', 'Lemon Concentrate',       15.5,'g', 'liquid'),
  ('mango-green-tea-lemonade', 'Water',                   71,  'g', 'water'),
  ('mango-green-tea-lemonade', 'Mango Syrup',             24,  'g', 'syrup'),
  ('mango-green-tea-lemonade', 'Pure Cane Syrup',         10,  'g', 'syrup'),
  ('mango-green-tea-lemonade', 'Saline Solution (20%)',    0.5,'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. Blossom Berry Lemonade (BBL)
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'blossom-berry-lemonade-bbl',
  'Blossom Berry Lemonade (BBL)',
  250,
  'Brix: 9° | TA: 0.6-0.7% | pH: 2.8-3.0 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('blossom-berry-lemonade-bbl', 'Lemon Concentrate',    34,   'g', 'liquid'),
  ('blossom-berry-lemonade-bbl', 'Water',                177.5,'g', 'water'),
  ('blossom-berry-lemonade-bbl', 'Blueberry Syrup',      15,   'g', 'syrup'),
  ('blossom-berry-lemonade-bbl', 'Pomegranate Syrup',    15,   'g', 'syrup'),
  ('blossom-berry-lemonade-bbl', 'Cane Syrup',            7.5, 'g', 'syrup'),
  ('blossom-berry-lemonade-bbl', 'Saline Solution (20%)', 0.5, 'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. Quince Cooler
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'quince-cooler',
  'Quince Cooler',
  257,
  'Brix: 9° | TA: 0.35% | pH: 3.3-3.6 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('quince-cooler', 'Quince Tea',             198,  'g', 'tea'),
  ('quince-cooler', 'Lemon Concentrate',       22,  'g', 'liquid'),
  ('quince-cooler', 'Mango Syrup',             22,  'g', 'syrup'),
  ('quince-cooler', 'Pure Cane Syrup',         14,  'g', 'syrup'),
  ('quince-cooler', 'Saline Solution (20%)',    0.5,'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 10. Blueberry Pomegranate Earl Grey
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'blueberry-pomegranate-earl-grey',
  'Blueberry Pomegranate Earl Grey',
  260,
  'Brix: 7° | TA: 0.15% | pH: 3.8-4.2 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('blueberry-pomegranate-earl-grey', 'Earl Grey',              217,  'g', 'tea'),
  ('blueberry-pomegranate-earl-grey', 'Blueberry Syrup',        12,   'g', 'syrup'),
  ('blueberry-pomegranate-earl-grey', 'Pomegranate Syrup',      12,   'g', 'syrup'),
  ('blueberry-pomegranate-earl-grey', 'Cane Syrup',              8,   'g', 'syrup'),
  ('blueberry-pomegranate-earl-grey', 'Lime Juice',             10,   'g', 'liquid'),
  ('blueberry-pomegranate-earl-grey', 'Saline Solution (20%)',   0.5, 'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 11. Guava Green Tea
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'guava-green-tea',
  'Guava Green Tea',
  253.5,
  'Brix: 7.5° | TA: 0.30% | pH: 3.8-4.2 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('guava-green-tea', 'Green Tea',              170,  'g', 'tea'),
  ('guava-green-tea', 'Peach Tea',               30,  'g', 'tea'),
  ('guava-green-tea', 'Lime Juice',              21.5,'g', 'liquid'),
  ('guava-green-tea', 'Guava Syrup',             22,  'g', 'syrup'),
  ('guava-green-tea', 'Pear Syrup',               9,  'g', 'syrup'),
  ('guava-green-tea', 'Saline Solution (20%)',    0.5,'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 12. Strawberry Bloom
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'strawberry-bloom',
  'Strawberry Bloom',
  254,
  'Brix: 7° | TA: 0.20% | pH: 4.0-4.5 | Salinity: 0.04%'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('strawberry-bloom', 'Green Tea',              206,  'g', 'tea'),
  ('strawberry-bloom', 'Strawberry Rose Syrup',   20,  'g', 'syrup'),
  ('strawberry-bloom', 'Lime Juice',              16,  'g', 'liquid'),
  ('strawberry-bloom', 'Cane Syrup',              11,  'g', 'syrup'),
  ('strawberry-bloom', 'Saline Solution (20%)',    0.5,'g', 'other')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 13. Steady State (Lucky Revival)
-- ============================================================
INSERT INTO recipes (id, name, total_weight, notes) VALUES (
  'lucky-revival',
  'Steady State (Lucky Revival)',
  259,
  'Brix: 8° | TA: 0.14% | pH: 3.8-4.0 | Salinity: 0.12% | Na: ~230mg | K: ~113mg'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, base_amount, unit, type) VALUES
  ('lucky-revival', 'Coconut Water',           125,  'g', 'water'),
  ('lucky-revival', 'Cucumber Gatorade',        50,  'g', 'liquid'),
  ('lucky-revival', 'Peach Tea',                50,  'g', 'tea'),
  ('lucky-revival', 'Lime Juice',               17.5,'g', 'liquid'),
  ('lucky-revival', 'Pear Syrup',               15,  'g', 'syrup'),
  ('lucky-revival', 'Saline Solution (20%)',     1.5,'g', 'other')
ON CONFLICT DO NOTHING;
