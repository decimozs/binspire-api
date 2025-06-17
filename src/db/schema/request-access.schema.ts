import { boolean, index, pgTable, text } from "drizzle-orm/pg-core";
import { insertExcludedFields, timestamps } from "../base";
import { nanoid } from "nanoid";
import { orgsTable } from "./org.schema";
import { permissionEnum, roleEnum, statusEnum } from "../enum";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";

export const requestsAccessTable = pgTable(
  "requests_access",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .primaryKey(),
    orgId: text("org_id")
      .references(() => orgsTable.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    reason: text("reason").notNull(),
    permission: permissionEnum().notNull(),
    role: roleEnum().notNull(),
    status: statusEnum().notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      orgIdIndex: index("requests_access_org_id_idx").on(table.orgId),
    };
  },
);

export const insertRequestAccess = createInsertSchema(requestsAccessTable)
  .omit(insertExcludedFields)
  .strict();

export const updateRequestAccess = insertRequestAccess.partial();

export type RequestAccess = typeof requestsAccessTable.$inferSelect;
export type InsertRequestAccess = z.infer<typeof insertRequestAccess>;
export type UpdateRequestAccess = z.infer<typeof updateRequestAccess>;
