import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../base";
import type z from "zod/v4";
import { createInsertSchema } from "drizzle-zod";
import { usersTable } from "./user.schema";
import { nanoid } from "nanoid";
import { orgsTable } from "./org.schema";

export const issuesTable = pgTable("issues", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  orgId: text("org_id")
    .references(() => orgsTable.id, { onDelete: "cascade" })
    .notNull(),
  reporterId: text("reporter_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"),
  category: text("category").notNull(),
  referenceId: text("reference_id"),
  priority: text("priority").notNull().default("medium"),
  isArchive: boolean("is_archive").notNull().default(false),
  ...timestamps,
});

export const createIssueSchema = createInsertSchema(issuesTable);

export const updateIssueSchema = createIssueSchema.partial();

export type Issue = typeof issuesTable.$inferSelect;
export type InsertIssue = z.infer<typeof createIssueSchema>;
export type UpdateIssue = z.infer<typeof updateIssueSchema>;
