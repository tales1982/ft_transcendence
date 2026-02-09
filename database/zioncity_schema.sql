-- ============================================================================
-- ZionCity Task Marketplace - PostgreSQL Database Schema
-- ============================================================================
-- Target: PostgreSQL 15+
-- Primary Keys: BIGSERIAL (matches current codebase Long IDs)
-- Timestamps: timestamptz
-- Features: Soft deletes, analytics views, token ledger, chat system
-- Generated: 2026-02-09
-- ============================================================================

BEGIN;

-- Enable required extensions (pg_trgm is optional but safe to include)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ----------------------------------------------------------------------------
-- Enum types
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE task_status AS ENUM (
      'OPEN',
      'IN_PROGRESS',
      'SUBMITTED',
      'APPROVED',
      'CANCELLED',
      'REJECTED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'token_reason') THEN
    CREATE TYPE token_reason AS ENUM (
      'TASK_REWARD',
      'ADJUSTMENT',
      'REFUND'
    );
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- Helper functions
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION enforce_task_hashtag_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM task_hashtags WHERE task_id = NEW.task_id) >= 3 THEN
    RAISE EXCEPTION 'Task % already has maximum number of hashtags (3)', NEW.task_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_task_submission()
RETURNS TRIGGER AS $$
DECLARE
  v_status task_status;
  v_taker_id BIGINT;
BEGIN
  SELECT status, taker_id
    INTO v_status, v_taker_id
    FROM tasks
   WHERE id = NEW.task_id
     AND deleted_at IS NULL;

  IF v_status IS NULL THEN
    RAISE EXCEPTION 'Task % not found or deleted', NEW.task_id;
  END IF;

  IF v_status <> 'IN_PROGRESS' THEN
    RAISE EXCEPTION 'Task % is not in progress', NEW.task_id;
  END IF;

  IF v_taker_id IS NULL OR v_taker_id <> NEW.submitted_by_user_id THEN
    RAISE EXCEPTION 'Submission user must be the current taker for task %', NEW.task_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- USERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                   BIGSERIAL PRIMARY KEY,
  email                TEXT NOT NULL UNIQUE,
  password             TEXT NOT NULL,
  display_name         TEXT,
  full_name            TEXT,
  country_code         CHAR(2),
  phone                TEXT,
  address_line         TEXT,
  city_or_area         TEXT,
  wallet_address       TEXT,
  public_profile       BOOLEAN NOT NULL DEFAULT FALSE,
  show_activity_badges BOOLEAN NOT NULL DEFAULT TRUE,
  role                 TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at           TIMESTAMPTZ,
  CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$')
);

CREATE INDEX IF NOT EXISTS idx_users_country_code ON users(country_code);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id   BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- ----------------------------------------------------------------------------
-- TASKS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  id           BIGSERIAL PRIMARY KEY,
  creator_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  taker_id     BIGINT REFERENCES users(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  category_id  BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  reward_zion  INTEGER NOT NULL CHECK (reward_zion > 0),
  location_text TEXT NOT NULL,
  deadline_at  TIMESTAMPTZ NOT NULL,
  status       task_status NOT NULL DEFAULT 'OPEN',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ,
  CHECK (taker_id IS NULL OR taker_id <> creator_id),
  CHECK (deadline_at >= created_at)
);

CREATE INDEX IF NOT EXISTS idx_tasks_status_category_deadline
  ON tasks(status, category_id, deadline_at);
CREATE INDEX IF NOT EXISTS idx_tasks_creator_id ON tasks(creator_id);
CREATE INDEX IF NOT EXISTS idx_tasks_taker_id ON tasks(taker_id);

CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- HASHTAGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hashtags (
  id       BIGSERIAL PRIMARY KEY,
  tag_text TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS task_hashtags (
  task_id    BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  hashtag_id BIGINT NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, hashtag_id)
);

CREATE INDEX IF NOT EXISTS idx_task_hashtags_hashtag_id
  ON task_hashtags(hashtag_id);

CREATE TRIGGER trg_task_hashtags_limit
BEFORE INSERT ON task_hashtags
FOR EACH ROW
EXECUTE FUNCTION enforce_task_hashtag_limit();

-- ----------------------------------------------------------------------------
-- TASK STATUS HISTORY (AUDIT)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_status_events (
  id             BIGSERIAL PRIMARY KEY,
  task_id        BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  actor_user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  from_status    task_status,
  to_status      task_status NOT NULL,
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_status_events_task_id_created_at
  ON task_status_events(task_id, created_at);

-- ----------------------------------------------------------------------------
-- TASK SUBMISSIONS / PROOF
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_submissions (
  id                    BIGSERIAL PRIMARY KEY,
  task_id               BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  submitted_by_user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  proof_text            TEXT NOT NULL,
  proof_attachment_url  TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (task_id)
);

CREATE INDEX IF NOT EXISTS idx_task_submissions_task_id
  ON task_submissions(task_id);

CREATE TRIGGER trg_task_submissions_validate
BEFORE INSERT ON task_submissions
FOR EACH ROW
EXECUTE FUNCTION validate_task_submission();

-- ----------------------------------------------------------------------------
-- TOKEN SYSTEM (ZION)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_balances (
  user_id      BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance_zion INTEGER NOT NULL DEFAULT 0 CHECK (balance_zion >= 0),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_user_balances_updated_at
BEFORE UPDATE ON user_balances
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS token_ledger (
  id              BIGSERIAL PRIMARY KEY,
  from_user_id    BIGINT REFERENCES users(id) ON DELETE SET NULL,
  to_user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  amount_zion     INTEGER NOT NULL CHECK (amount_zion > 0),
  reason          token_reason NOT NULL,
  related_task_id BIGINT REFERENCES tasks(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (from_user_id IS NULL OR from_user_id <> to_user_id)
);

CREATE INDEX IF NOT EXISTS idx_token_ledger_to_user_id_created_at
  ON token_ledger(to_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_token_ledger_related_task_id
  ON token_ledger(related_task_id);
CREATE INDEX IF NOT EXISTS idx_token_ledger_related_task_reason
  ON token_ledger(related_task_id, reason);

CREATE UNIQUE INDEX IF NOT EXISTS uq_token_ledger_task_reward
  ON token_ledger(related_task_id)
  WHERE reason = 'TASK_REWARD';

-- ----------------------------------------------------------------------------
-- CHAT (1:1)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
  id         BIGSERIAL PRIMARY KEY,
  user_a_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (user_a_id <> user_b_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_conversations_user_pair
  ON conversations(LEAST(user_a_id, user_b_id), GREATEST(user_a_id, user_b_id));

CREATE TABLE IF NOT EXISTS messages (
  id              BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created_at
  ON messages(conversation_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- ANALYTICS VIEWS (ignore soft deletes)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW country_category_supply_view AS
SELECT
  u.country_code,
  c.name AS category_name,
  COUNT(*) AS tasks_created_count,
  COUNT(*) FILTER (WHERE t.status = 'OPEN') AS tasks_created_open_count,
  COUNT(*) FILTER (WHERE t.status = 'APPROVED') AS tasks_created_approved_count
FROM tasks t
JOIN users u ON u.id = t.creator_id
JOIN categories c ON c.id = t.category_id
WHERE t.deleted_at IS NULL
  AND u.deleted_at IS NULL
GROUP BY u.country_code, c.name;

CREATE OR REPLACE VIEW country_category_demand_view AS
SELECT
  u.country_code,
  c.name AS category_name,
  COUNT(*) AS tasks_taken_count,
  COUNT(*) FILTER (WHERE t.status = 'APPROVED') AS tasks_completed_count
FROM tasks t
JOIN users u ON u.id = t.taker_id
JOIN categories c ON c.id = t.category_id
WHERE t.taker_id IS NOT NULL
  AND t.deleted_at IS NULL
  AND u.deleted_at IS NULL
GROUP BY u.country_code, c.name;

CREATE OR REPLACE VIEW user_category_offer_view AS
SELECT
  t.creator_id AS user_id,
  c.name AS category_name,
  COUNT(*) AS created_count,
  COUNT(*) FILTER (WHERE t.status = 'APPROVED') AS approved_created_count
FROM tasks t
JOIN categories c ON c.id = t.category_id
JOIN users u ON u.id = t.creator_id
WHERE t.deleted_at IS NULL
  AND u.deleted_at IS NULL
GROUP BY t.creator_id, c.name;

CREATE OR REPLACE VIEW user_category_work_view AS
SELECT
  t.taker_id AS user_id,
  c.name AS category_name,
  COUNT(*) AS taken_count,
  COUNT(*) FILTER (WHERE t.status = 'APPROVED') AS completed_count
FROM tasks t
JOIN categories c ON c.id = t.category_id
JOIN users u ON u.id = t.taker_id
WHERE t.taker_id IS NOT NULL
  AND t.deleted_at IS NULL
  AND u.deleted_at IS NULL
GROUP BY t.taker_id, c.name;

CREATE OR REPLACE VIEW category_trends_monthly_view AS
SELECT
  date_trunc('month', t.created_at) AS month_start,
  c.name AS category_name,
  COUNT(*) AS created_count,
  COUNT(*) FILTER (WHERE t.taker_id IS NOT NULL) AS taken_count,
  COUNT(*) FILTER (WHERE t.status = 'APPROVED') AS approved_count
FROM tasks t
JOIN categories c ON c.id = t.category_id
WHERE t.deleted_at IS NULL
GROUP BY month_start, c.name;

CREATE OR REPLACE VIEW category_trends_weekly_view AS
SELECT
  date_trunc('week', t.created_at) AS week_start,
  c.name AS category_name,
  COUNT(*) AS created_count,
  COUNT(*) FILTER (WHERE t.taker_id IS NOT NULL) AS taken_count,
  COUNT(*) FILTER (WHERE t.status = 'APPROVED') AS approved_count
FROM tasks t
JOIN categories c ON c.id = t.category_id
WHERE t.deleted_at IS NULL
GROUP BY week_start, c.name;

CREATE OR REPLACE VIEW top_workers_by_category_view AS
SELECT
  c.name AS category_name,
  u.id AS user_id,
  u.display_name,
  u.country_code,
  COUNT(*) AS completed_count
FROM tasks t
JOIN categories c ON c.id = t.category_id
JOIN users u ON u.id = t.taker_id
WHERE t.taker_id IS NOT NULL
  AND t.status = 'APPROVED'
  AND t.deleted_at IS NULL
  AND u.deleted_at IS NULL
GROUP BY c.name, u.id, u.display_name, u.country_code;

COMMIT;
