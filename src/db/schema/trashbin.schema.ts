import { boolean, numeric, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../base";
import type z from "zod/v4";
import { createInsertSchema } from "drizzle-zod";
import { orgsTable } from "./org.schema";
import { nanoid } from "nanoid";

export const trashbinsTable = pgTable("trashbins", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  orgId: text("org_id")
    .references(() => orgsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 6 }),
  longitude: numeric("longitude", { precision: 10, scale: 6 }),
  isOperational: boolean("is_operational").notNull().default(false),
  isArchive: boolean("is_archive").notNull().default(false),
  isCollected: boolean("is_collected").notNull().default(false),
  ...timestamps,
});

export const createTrashbinSchema = createInsertSchema(trashbinsTable);

export const updateTrashbinSchema = createTrashbinSchema.partial();

export type Trashbin = typeof trashbinsTable.$inferSelect;

export type InsertTrashbin = z.infer<typeof createTrashbinSchema>;
export type UpdateTrashbin = z.infer<typeof updateTrashbinSchema>;
