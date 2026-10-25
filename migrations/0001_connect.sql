-- Contact requests from the /connect form and from AI agents (POST /api/connect).
-- Rows are deleted automatically after 90 days by the Worker's hourly cleanup.

CREATE TABLE requests (
  id             TEXT PRIMARY KEY,          -- short public ID, e.g. r_7k2m9qxa (safe to show the bot)
  token_hash     TEXT NOT NULL UNIQUE,      -- SHA-256 of the private status-link token (the token itself is never stored)
  created_at     TEXT NOT NULL,             -- ISO 8601, UTC
  source         TEXT NOT NULL CHECK (source IN ('person', 'agent')),
  name           TEXT NOT NULL,
  email          TEXT NOT NULL,
  company        TEXT,
  link           TEXT,
  agent          TEXT,                      -- which AI agent sent it, if it said
  wants          TEXT NOT NULL,             -- JSON array of keys, e.g. ["email","resume"]
  note           TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'approved', 'declined', 'revoked')),
  approved_items TEXT,                      -- JSON array, set on approval
  decided_at     TEXT,
  expires_at     TEXT,                      -- approved links stop working after this
  ip_hash        TEXT NOT NULL,             -- keyed hash of the sender's IP, only for rate limits
  notified       INTEGER NOT NULL DEFAULT 0 -- 1 once Grok Bot accepted the ping
);

CREATE INDEX requests_ip_created ON requests (ip_hash, created_at);
CREATE INDEX requests_created ON requests (created_at);

-- An audit trail: created, notified, approved, declined, viewed, revoked...
CREATE TABLE events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id TEXT NOT NULL,
  at         TEXT NOT NULL,
  kind       TEXT NOT NULL,
  detail     TEXT
);

CREATE INDEX events_request ON events (request_id);
