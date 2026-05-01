import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from 'better-sqlite3';
import * as schema from "./schema";

const dbPath = process.env.DATABASE_PATH || "./data/sideprojectapm.db";

// Ensure data directory exists
import { mkdirSync, existsSync } from "fs";
import { dirname } from "path";
if (!existsSync(dirname(dbPath))) {
  mkdirSync(dirname(dbPath), { recursive: true });
}

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

export { schema };