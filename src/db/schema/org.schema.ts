import { index, pgTable, text } from "drizzle-orm/pg-core";
import { insertExcludedFields, timestamps } from "../base";
import { nanoid } from "nanoid";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";

export const orgsTable = pgTable(
  "orgs",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    ...timestamps,
  },
  (table) => {
    return {
      nameIdx: index("org_name_idx").on(table.name),
    };
  },
);

export const insertOrgSchema = createInsertSchema(orgsTable)
  .omit(insertExcludedFields)
  .strict();

export const updateOrgSchema = insertOrgSchema.partial();

export type Org = typeof orgsTable.$inferSelect;
export type InsertOrg = z.infer<typeof insertOrgSchema>;
export type UpdateOrg = z.infer<typeof updateOrgSchema>;
