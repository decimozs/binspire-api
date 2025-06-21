import { index, pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { usersTable } from "./user.schema";
import { insertExcludedFields, timestamps } from "../base";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";

export const accountsTable = pgTable(
  "accounts",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    password: text("password"),
    ...timestamps,
  },
  (table) => ({
    userIdIdx: index("account_user_id_idx").on(table.userId),
  }),
);

export const insertAccountSchema = createInsertSchema(accountsTable)
  .omit(insertExcludedFields)
  .strict();

export const updateAccountSchema = insertAccountSchema.partial();

export type Account = typeof accountsTable.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type UpdateAccount = z.infer<typeof updateAccountSchema>;
