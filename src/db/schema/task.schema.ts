import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "../base";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";
import { orgsTable } from "./org.schema";
import { nanoid } from "nanoid";
import { usersTable } from "./user.schema";

export const tasksTable = pgTable("tasks", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  orgId: text("org_id")
    .references(() => orgsTable.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  assignedTo: text("assigned_to").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  priority: text("priority").default("normal"),
  referenceId: text("reference_id").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  dueAt: timestamp("due_at").notNull(),
  ...timestamps,
});

export const createTaskSchema = createInsertSchema(tasksTable);

export const updateTaskSchema = createTaskSchema.partial();

export type Task = typeof tasksTable.$inferSelect;
export type InsertTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
