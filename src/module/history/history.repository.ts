import { historyTable } from "@/src/db";
import type { InsertHistory, UpdateHistory } from "@/src/db";
import db from "@/src/lib/db";
import { eq, inArray } from "drizzle-orm";

async function findAll() {
  return await db.query.historyTable.findMany();
}

async function findById(id: string) {
  return await db.query.historyTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function findByUserId(userId: string) {
  return await db.query.historyTable.findMany({
    where: (table, { eq }) => eq(table.actorId, userId),
  });
}

async function insert(data: InsertHistory) {
  return await db.insert(historyTable).values(data).returning();
}

async function update(id: string, data: UpdateHistory) {
  return await db
    .update(historyTable)
    .set(data)
    .where(eq(historyTable.id, id))
    .returning();
}

async function remove(id: string) {
  return await db
    .delete(historyTable)
    .where(eq(historyTable.id, id))
    .returning();
}

async function batchUpdate(ids: string[], data: UpdateHistory) {
  return await db
    .update(historyTable)
    .set(data)
    .where(inArray(historyTable.id, ids))
    .returning();
}

async function batchRemove(ids: string[]) {
  return await db
    .delete(historyTable)
    .where(inArray(historyTable.id, ids))
    .returning();
}

const HistoryRepository = {
  findAll,
  findById,
  findByUserId,
  insert,
  update,
  remove,
  batchRemove,
  batchUpdate,
};

export default HistoryRepository;
