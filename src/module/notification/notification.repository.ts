import {
  notificationTable,

} from "@/src/db";
import type { InsertNotification, UpdateNotification } from "@/src/db";
import db from "@/src/lib/db";
import { eq } from "drizzle-orm";

async function findAll() {
  return await db.query.notificationTable.findMany();
}

async function findById(id: string) {
  return await db.query.notificationTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function findByFCMToken(token: string) {
  return await db.query.notificationTable.findFirst({
    where: (table, { eq }) => eq(table.fcmToken, token),
  });
}

async function insert(data: InsertNotification) {
  return await db.insert(notificationTable).values(data).returning();
}

async function update(id: string, data: UpdateNotification) {
  return await db
    .update(notificationTable)
    .set(data)
    .where(eq(notificationTable.id, id))
    .returning();
}

async function remove(id: string) {
  return await db
    .delete(notificationTable)
    .where(eq(notificationTable.id, id))
    .returning();
}

const NotificationRepository = {
  findAll,
  findById,
  findByFCMToken,
  insert,
  update,
  remove,
};

export default NotificationRepository;
