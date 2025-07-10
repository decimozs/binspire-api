import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { insertExcludedFields, timestamps } from "../base";
import { orgsTable } from "./org.schema";
import { nanoid } from "nanoid";
import { usersTable } from "./user.schema";
import { createInsertSchema } from "drizzle-zod";
import type z from "zod/v4";

export const historyTable = pgTable("history", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  orgId: text("org_id")
    .references(() => orgsTable.id, { onDelete: "cascade" })
    .notNull(),
  actorId: text("actor_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  entity: text("entity").notNull(),
  action: text("action").notNull(),
  description: text("description").notNull(),
  isArchive: boolean("is_archive").notNull().default(false),
  ...timestamps,
});

export const insertHistorySchema = createInsertSchema(historyTable)
  .omit({
    ...insertExcludedFields,
  })
  .strict();

export const updateHistorySchema = insertHistorySchema.partial();

export type History = typeof historyTable.$inferSelect;
export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type UpdateHistory = z.infer<typeof updateHistorySchema>;
