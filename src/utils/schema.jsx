import { sql } from "drizzle-orm";
import { integer, varchar, pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

// users schema
export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull(),
  age: integer("age").notNull(),
  location: varchar("location").notNull(),
  folders: text("folders")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  treatmentCounts: integer("treatment_counts").notNull(),
  folder: text("folder")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  createdBy: varchar("created_by").notNull(),
  cancerHistory: varchar("cancer_history", { length: 10 }).notNull().default("no"),
  screeningStatus: varchar("screening_status", { length: 20 }).notNull().default("never"),
  cancerType: varchar("cancer_type", { length: 100 }),
});

// records schema
export const Records = pgTable("records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => Users.id)
    .notNull(),
  recordName: varchar("record_name").notNull(),
  analysisResult: varchar("analysis_result").notNull(),
  analysisData: jsonb("analysis_data"),
  kanbanRecords: varchar("kanban_records").notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  files: jsonb("files").notNull().default([]),
});

// kanban boards schema
export const KanbanBoards = pgTable("kanban_boards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id).notNull(),
  boardData: jsonb("board_data").notNull(),
});
