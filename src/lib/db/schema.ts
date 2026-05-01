import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Projects table
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url"),
  apiKey: text("api_key").notNull().unique(),
  status: text("status", { enum: ["active", "paused", "archived"] }).notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Metrics table
export const metrics = sqliteTable("metrics", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["counter", "gauge", "histogram"] }).notNull(),
  name: text("name").notNull(),
  value: real("value").notNull(),
  tags: text("tags", { mode: "json" }).$type<Record<string, string>>().default({}),
  timestamp: text("timestamp").notNull(),
  receivedAt: text("received_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Uptime checks table
export const uptimeChecks = sqliteTable("uptime_checks", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["up", "down", "degraded"] }).notNull(),
  latency: integer("latency"), // in milliseconds
  checkedAt: text("checked_at").notNull(),
});

// Errors table
export const errors = sqliteTable("errors", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  stackTrace: text("stack_trace"),
  fingerprint: text("fingerprint").notNull(), // hash for grouping similar errors
  count: integer("count").notNull().default(1),
  firstSeen: text("first_seen").notNull().default(sql`CURRENT_TIMESTAMP`),
  lastSeen: text("last_seen").notNull().default(sql`CURRENT_TIMESTAMP`),
  resolved: integer("resolved", { mode: "boolean" }).notNull().default(false),
});

// Types
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Metric = typeof metrics.$inferSelect;
export type NewMetric = typeof metrics.$inferInsert;
export type UptimeCheck = typeof uptimeChecks.$inferSelect;
export type NewUptimeCheck = typeof uptimeChecks.$inferInsert;
export type Error = typeof errors.$inferSelect;
export type NewError = typeof errors.$inferInsert;