import { requestsAccessTable } from "@/src/db";
import type { InsertRequestAccess, UpdateRequestAccess } from "@/src/db";
import db from "@/src/lib/db";
import { eq, inArray } from "drizzle-orm";

async function findAll(orgId: string) {
  return await db.query.requestsAccessTable.findMany({
    where: (table, { eq }) => eq(table.orgId, orgId),
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });
}

async function findById(id: string) {
  return await db.query.requestsAccessTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function findByEmail(email: string) {
  return await db.query.requestsAccessTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });
}

async function insert(data: InsertRequestAccess) {
  return await db.insert(requestsAccessTable).values(data).returning();
}

async function update(id: string, data: UpdateRequestAccess) {
  return await db
    .update(requestsAccessTable)
    .set(data)
    .where(eq(requestsAccessTable.id, id))
    .returning();
}

async function remove(id: string) {
  return await db
    .delete(requestsAccessTable)
    .where(eq(requestsAccessTable.id, id))
    .returning();
}

async function batchUpdate(ids: string[], data: UpdateRequestAccess) {
  return await db
    .update(requestsAccessTable)
    .set(data)
    .where(inArray(requestsAccessTable.id, ids))
    .returning();
}

async function batchRemove(ids: string[]) {
  return await db
    .delete(requestsAccessTable)
    .where(inArray(requestsAccessTable.id, ids))
    .returning();
}

export const RequestAccessRepository = {
  findAll,
  findById,
  findByEmail,
  insert,
  update,
  remove,
  batchRemove,
  batchUpdate,
};
