-- ============================================================================
-- ZionCity Seed Data
-- ============================================================================
-- Categories, demo users, and demo tasks
-- ============================================================================

BEGIN;

-- Categories
INSERT INTO categories (name) VALUES
  ('Creative Economy'),
  ('Mechanics / Auto'),
  ('Civic Action'),
  ('IT Support'),
  ('Web / Websites'),
  ('Graphic Design'),
  ('Video Editing'),
  ('Gardening'),
  ('Cleaning / Organizing'),
  ('Moving / Transport'),
  ('Tutoring / Mentoring'),
  ('Pets'),
  ('Other')
ON CONFLICT (name) DO NOTHING;

-- Demo users
INSERT INTO users (email, password, display_name, full_name, country_code, role)
VALUES
  ('alice@zioncity.local', 'hashed-password-alice', 'Alice', 'Alice Example', 'LU', 'USER'),
  ('bob@zioncity.local', 'hashed-password-bob', 'Bob', 'Bob Example', 'LU', 'USER'),
  ('carol@zioncity.local', 'hashed-password-carol', 'Carol', 'Carol Example', 'US', 'USER')
ON CONFLICT (email) DO NOTHING;

-- Seed balances
INSERT INTO user_balances (user_id, balance_zion)
SELECT id, 1000 FROM users
WHERE email IN ('alice@zioncity.local', 'bob@zioncity.local', 'carol@zioncity.local')
ON CONFLICT (user_id) DO NOTHING;

-- Demo tasks
WITH
  cat_web AS (
    SELECT id FROM categories WHERE name = 'Web / Websites'
  ),
  cat_garden AS (
    SELECT id FROM categories WHERE name = 'Gardening'
  ),
  u_alice AS (
    SELECT id FROM users WHERE email = 'alice@zioncity.local'
  ),
  u_bob AS (
    SELECT id FROM users WHERE email = 'bob@zioncity.local'
  )
INSERT INTO tasks (
  creator_id,
  taker_id,
  title,
  description,
  category_id,
  reward_zion,
  location_text,
  deadline_at,
  status
)
SELECT
  u_alice.id,
  u_bob.id,
  'Landing page refresh',
  'Update hero section and improve CTA layout.',
  cat_web.id,
  250,
  'Remote',
  now() + interval '7 days',
  'IN_PROGRESS'
FROM u_alice, u_bob, cat_web
UNION ALL
SELECT
  u_alice.id,
  NULL,
  'Community garden cleanup',
  'Help clean and reorganize the shared garden area.',
  cat_garden.id,
  120,
  'Luxembourg City',
  now() + interval '10 days',
  'OPEN'
FROM u_alice, cat_garden
ON CONFLICT DO NOTHING;

COMMIT;
