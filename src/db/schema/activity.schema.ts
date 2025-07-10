import { boolean, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { insertExcludedFields, timestamps } from "../base";
import { createInsertSchema } from "drizzle-zod";
import type z from "zod/v4";
import { orgsTable } from "./org.schema";
import { nanoid } from "nanoid";
import { usersTable } from "./user.schema";

export const activityTable = pgTable("activity", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  orgId: text("org_id")
    .references(() => orgsTable.id, { onDelete: "cascade" })
    .notNull(),
  actorId: text("actor_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  referenceId: text("reference_id").notNull(),
  entity: text("entity").notNull(),
  action: text("action").notNull(),
  description: text("description").notNull(),
  changes: jsonb("changes"),
  isArchive: boolean("is_archive").notNull().default(false),
  ...timestamps,
});

export const insertActivitySchema = createInsertSchema(activityTable)
  .omit({
    ...insertExcludedFields,
  })
  .strict();

export const updateActivitySchema = insertActivitySchema.partial();

export type Activity = typeof activityTable.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type UpdateActivity = z.infer<typeof updateActivitySchema>;
