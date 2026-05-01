/**
 * Database initialization script
 * Run with: npx tsx src/lib/db/migrate.ts
 */

import Database from "better-sqlite3";
import { mkdirSync, existsSync } from "fs";
import { dirname } from "path";

const dbPath = process.env.DATABASE_PATH || "./data/sideprojectapm.db";

// Ensure data directory exists
if (!existsSync(dirname(dbPath))) {
  mkdirSync(dirname(dbPath), { recursive: true });
  console.log(`Created data directory: ${dirname(dbPath)}`);
}

const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT,
    api_key TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'paused', 'archived')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS metrics (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('counter', 'gauge', 'histogram')),
    name TEXT NOT NULL,
    value REAL NOT NULL,
    tags TEXT DEFAULT '{}',
    timestamp TEXT NOT NULL,
    received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS uptime_checks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('up', 'down', 'degraded')),
    latency INTEGER,
    checked_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS errors (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    message TEXT NOT NULL,
    stack_trace TEXT,
    fingerprint TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    first_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )
`);

// Create indexes for common queries
db.exec(`CREATE INDEX IF NOT EXISTS idx_metrics_project_id ON metrics(project_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics(timestamp)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_metrics_name ON metrics(name)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_uptime_checks_project_id ON uptime_checks(project_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_uptime_checks_checked_at ON uptime_checks(checked_at)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_errors_project_id ON errors(project_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_errors_fingerprint ON errors(fingerprint)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_errors_resolved ON errors(resolved)`);

console.log("✅ Database initialized successfully");
console.log(`📁 Database location: ${dbPath}`);

db.close();