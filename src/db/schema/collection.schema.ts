import { boolean, integer, numeric, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../base";
import type z from "zod/v4";
import { createInsertSchema } from "drizzle-zod";
import { trashbinsTable } from "./trashbin.schema";
import { nanoid } from "nanoid";

export const collectionsTable = pgTable("collections", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  trashbinId: text("trashbin_id")
    .references(() => trashbinsTable.id, { onDelete: "cascade" })
    .notNull(),
  weightLevel: numeric("weight_level", { precision: 10, scale: 2 }),
  wasteLevel: integer("waste_level"),
  batteryLevel: integer("battery_level"),
  isFull: boolean("is_full").default(false),
  isArchive: boolean("is_archive").notNull().default(false),
  ...timestamps,
});

export const createCollectionSchema = createInsertSchema(collectionsTable);

export const updateCollectionSchema = createCollectionSchema.partial();

export type Collection = typeof collectionsTable.$inferSelect;
export type InsertCollection = z.infer<typeof createCollectionSchema>;
export type UpdateCollection = z.infer<typeof updateCollectionSchema>;
