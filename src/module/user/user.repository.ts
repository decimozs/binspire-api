import { usersTable } from "@/src/db";
import type { InsertUser, UpdateUser } from "@/src/db";
import db from "@/src/lib/db";
import { eq, inArray } from "drizzle-orm";

async function findAll(orgId: string) {
  return await db.query.usersTable.findMany({
    where: (table, { eq }) => eq(table.orgId, orgId),
  });
}

async function findById(id: string) {
  return await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function insert(data: InsertUser) {
  return await db.insert(usersTable).values(data).returning();
}

async function update(id: string, data: UpdateUser) {
  return await db
    .update(usersTable)
    .set(data)
    .where(eq(usersTable.id, id))
    .returning();
}

async function remove(id: string) {
  return await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
}

async function batchUpdate(ids: string[], data: UpdateUser) {
  return await db
    .update(usersTable)
    .set(data)
    .where(inArray(usersTable.id, ids))
    .returning();
}

async function batchRemove(ids: string[]) {
  return await db
    .delete(usersTable)
    .where(inArray(usersTable.id, ids))
    .returning();
}

export const UserRepository = {
  findAll,
  findById,
  insert,
  update,
  remove,
  batchUpdate,
  batchRemove,
};
