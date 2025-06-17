import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { insertExcludedFields, timestamps } from "../base";
import { nanoid } from "nanoid";
import { orgsTable } from "./org.schema";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";

export const verificationsTable = pgTable(
  "verifications",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at")
      .$defaultFn(() => new Date(Date.now() + 10 * 60 * 1000))
      .notNull(),
    ...timestamps,
  },
  (table) => ({
    identifierIdx: index("verifications_identifier_idx").on(table.identifier),
  }),
);

export const insertVerificationSchema = createInsertSchema(verificationsTable)
  .omit(insertExcludedFields)
  .strict();

export const updateVerificationSchema = insertVerificationSchema.partial();

export type Verification = typeof verificationsTable.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type UpdateVerification = z.infer<typeof updateVerificationSchema>;
