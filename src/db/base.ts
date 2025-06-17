import type { AnyZodObject } from "zod";
import { timestamp } from "drizzle-orm/pg-core";

export const insertExcludedFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Partial<Record<keyof AnyZodObject["shape"], true>>;

export const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
};
