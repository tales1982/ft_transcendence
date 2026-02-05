-- ZionCity Task Marketplace - PostgreSQL schema (MVP + recommended tables)
-- Generated: 2026-02-05 10:37:57Z

-- Recommended extensions (optional)
-- CREATE EXTENSION IF NOT EXISTS citext;   -- case-insensitive email
-- CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gen_random_uuid()

BEGIN;

-- =========
-- USERS
-- =========
CREATE TABLE IF NOT EXISTS users (
  id              BIGSERIAL PRIMARY KEY,
  email           TEXT NOT NULL UNIQUE,
  password_hash   TEXT,
  status          TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_profile (
  user_id     BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name   TEXT,
  country     TEXT NOT NULL,
  phone       TEXT,
  address     TEXT,
  avatar_url  TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_wallets (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chain_id        INTEGER NOT NULL,
  address         TEXT NOT NULL,
  is_primary      BOOLEAN NOT NULL DEFAULT false,
  connected_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  disconnected_at TIMESTAMPTZ,
  UNIQUE (chain_id, address)
);
CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id ON user_wallets(user_id);

-- =========
-- MARKETPLACE / TASKS
-- =========
CREATE TABLE IF NOT EXISTS task_categories (
  id        BIGSERIAL PRIMARY KEY,
  name      TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS tasks (
  id               BIGSERIAL PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  category_id      BIGINT REFERENCES task_categories(id),
  reward_amount    NUMERIC(20, 6) NOT NULL DEFAULT 0,
  currency         TEXT NOT NULL DEFAULT 'ZION',
  location_text    TEXT,
  deadline_at      TIMESTAMPTZ,
  creator_user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  taken_by_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, SUBMITTED, APPROVED, CANCELLED
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_creator ON tasks(creator_user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_taken_by ON tasks(taken_by_user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category_id);

CREATE TABLE IF NOT EXISTS task_tags (
  id   BIGSERIAL PRIMARY KEY,
  tag  TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS task_tag_map (
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id  BIGINT NOT NULL REFERENCES task_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_task_tag_map_tag_id ON task_tag_map(tag_id);

-- =========
-- SUBMISSIONS / PROOF
-- =========
CREATE TABLE IF NOT EXISTS task_submissions (
  id                   BIGSERIAL PRIMARY KEY,
  task_id               BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  submitted_by_user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  proof_text            TEXT,
  status                TEXT NOT NULL DEFAULT 'SUBMITTED', -- SUBMITTED, APPROVED, REJECTED
  submitted_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at           TIMESTAMPTZ,
  reviewed_by_user_id   BIGINT REFERENCES users(id) ON DELETE SET NULL,
  review_notes          TEXT
);
CREATE INDEX IF NOT EXISTS idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_status ON task_submissions(status);

CREATE TABLE IF NOT EXISTS task_attachments (
  id                 BIGSERIAL PRIMARY KEY,
  task_id            BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  submission_id      BIGINT REFERENCES task_submissions(id) ON DELETE SET NULL,
  uploaded_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  file_name          TEXT NOT NULL,
  mime_type          TEXT,
  size_bytes         BIGINT,
  storage_url        TEXT NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments(task_id);

CREATE TABLE IF NOT EXISTS task_status_history (
  id               BIGSERIAL PRIMARY KEY,
  task_id          BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  from_status      TEXT,
  to_status        TEXT NOT NULL,
  changed_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  changed_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason           TEXT
);
CREATE INDEX IF NOT EXISTS idx_task_status_history_task_id ON task_status_history(task_id);

-- =========
-- CHAT
-- =========
CREATE TABLE IF NOT EXISTS conversations (
  id         BIGSERIAL PRIMARY KEY,
  task_id    BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_conversations_task_id ON conversations(task_id);

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);

CREATE TABLE IF NOT EXISTS messages (
  id              BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  content         TEXT NOT NULL,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at         TIMESTAMPTZ,
  type            TEXT NOT NULL DEFAULT 'TEXT' -- TEXT, SYSTEM, ATTACHMENT
);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_user_id ON messages(sender_user_id);

-- =========
-- TOKENS / PAYMENTS (internal ledger + balances)
-- =========
CREATE TABLE IF NOT EXISTS token_accounts (
  user_id          BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  available_balance NUMERIC(20, 6) NOT NULL DEFAULT 0,
  locked_balance    NUMERIC(20, 6) NOT NULL DEFAULT 0,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS token_ledger (
  id             BIGSERIAL PRIMARY KEY,
  tx_type        TEXT NOT NULL, -- DEPOSIT, WITHDRAW, ESCROW_LOCK, ESCROW_RELEASE, TASK_PAYOUT, ADJUSTMENT
  from_user_id   BIGINT REFERENCES users(id) ON DELETE SET NULL,
  to_user_id     BIGINT REFERENCES users(id) ON DELETE SET NULL,
  task_id        BIGINT REFERENCES tasks(id) ON DELETE SET NULL,
  amount         NUMERIC(20, 6) NOT NULL,
  chain_tx_hash  TEXT,
  metadata       JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_token_ledger_from_user_id ON token_ledger(from_user_id);
CREATE INDEX IF NOT EXISTS idx_token_ledger_to_user_id ON token_ledger(to_user_id);
CREATE INDEX IF NOT EXISTS idx_token_ledger_task_id ON token_ledger(task_id);
CREATE INDEX IF NOT EXISTS idx_token_ledger_tx_type ON token_ledger(tx_type);

CREATE TABLE IF NOT EXISTS task_escrows (
  task_id       BIGINT PRIMARY KEY REFERENCES tasks(id) ON DELETE CASCADE,
  locked_amount NUMERIC(20, 6) NOT NULL,
  status        TEXT NOT NULL DEFAULT 'LOCKED', -- LOCKED, RELEASED, REFUNDED
  locked_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  released_at   TIMESTAMPTZ
);

-- =========
-- OPTIONAL (quality + UX)
-- =========
CREATE TABLE IF NOT EXISTS reviews (
  id           BIGSERIAL PRIMARY KEY,
  task_id      BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  from_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  to_user_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (task_id, from_user_id, to_user_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_to_user_id ON reviews(to_user_id);

CREATE TABLE IF NOT EXISTS notifications (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

COMMIT;
