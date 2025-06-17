import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { insertExcludedFields, timestamps } from "../base";
import { nanoid } from "nanoid";
import { orgsTable } from "./org.schema";
import { permissionEnum, roleEnum } from "../enum";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  orgId: text("org_id")
    .references(() => orgsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  permission: permissionEnum().notNull(),
  role: roleEnum().notNull(),
  isOnline: boolean("is_online").notNull().default(false),
  ...timestamps,
});

export const insertUserSchema = createInsertSchema(usersTable)
  .omit(insertExcludedFields)
  .strict();

export const updateUserSchema = insertUserSchema.partial();

export type User = typeof usersTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
