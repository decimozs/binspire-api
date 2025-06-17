import { pgTable, text, index, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import type { z } from "zod/v4";
import { insertUserSchema, usersTable } from "./user.schema";
import { orgsTable } from "./org.schema";
import { permissionEnum, roleEnum } from "../enum";
import { insertExcludedFields, timestamps } from "../base";
import { createInsertSchema } from "drizzle-zod";

export const sessionsTable = pgTable(
  "sessions",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .primaryKey(),
    userId: text("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    orgId: text("org_id")
      .references(() => orgsTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    role: roleEnum().notNull(),
    permission: permissionEnum().notNull(),
    ...timestamps,
  },
  (table) => ({
    userIdIdx: index("idx_sessions_user_id").on(table.userId),
    tokenIdx: index("idx_sessions_token").on(table.token),
  }),
);

export const insertSessionSchema = createInsertSchema(sessionsTable)
  .omit(insertExcludedFields)
  .strict();

export const updateSessionSchema = insertUserSchema.partial();

export type Session = typeof sessionsTable.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type UpdateSession = z.infer<typeof updateSessionSchema>;
