import { pgTable, text } from "drizzle-orm/pg-core";
import { insertExcludedFields, timestamps } from "../base";
import { nanoid } from "nanoid";
import { createInsertSchema } from "drizzle-zod";
import type z from "zod/v4";
import { usersTable } from "./user.schema";

export const notificationTable = pgTable("notifications", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  fcmToken: text("fcm_token").notNull(),
  ...timestamps,
});

export const createNotificationSchema = createInsertSchema(
  notificationTable,
).omit({
  ...insertExcludedFields,
});

export const updateNotificationSchema = createNotificationSchema.partial();

export type Notification = typeof notificationTable.$inferSelect;
export type InsertNotification = z.infer<typeof createNotificationSchema>;
export type UpdateNotification = z.infer<typeof updateNotificationSchema>;
