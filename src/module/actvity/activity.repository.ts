import {
  activityTable,

} from "@/src/db";
import type { InsertActivity, UpdateActivity } from "@/src/db";
import db from "@/src/lib/db";
import { eq, inArray } from "drizzle-orm";

async function findAll() {
  return await db.query.activityTable.findMany();
}

async function findById(id: string) {
  return await db.query.activityTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function findByUserId(userId: string) {
  return await db.query.activityTable.findMany({
    where: (table, { eq }) => eq(table.actorId, userId),
  });
}

async function insert(data: InsertActivity) {
  return await db.insert(activityTable).values(data).returning();
}

async function update(id: string, data: UpdateActivity) {
  return await db
    .update(activityTable)
    .set(data)
    .where(eq(activityTable.id, id))
    .returning();
}

async function remove(id: string) {
  return await db
    .delete(activityTable)
    .where(eq(activityTable.id, id))
    .returning();
}

async function batchUpdate(ids: string[], data: UpdateActivity) {
  return await db
    .update(activityTable)
    .set(data)
    .where(inArray(activityTable.id, ids))
    .returning();
}

async function batchRemove(ids: string[]) {
  return await db
    .delete(activityTable)
    .where(inArray(activityTable.id, ids))
    .returning();
}

const ActivityRepository = {
  findAll,
  findById,
  findByUserId,
  insert,
  update,
  remove,
  batchRemove,
  batchUpdate,
};

export default ActivityRepository;
