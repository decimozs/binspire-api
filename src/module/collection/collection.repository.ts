import { collectionsTable } from "@/src/db";
import type { InsertCollection, UpdateCollection } from "@/src/db";
import db from "@/src/lib/db";
import { eq, inArray } from "drizzle-orm";

async function findAll(orgId: string) {
  return await db.query.collectionsTable.findMany({
    where: (table, { eq }) => eq(table.orgId, orgId),
  });
}

async function findById(id: string) {
  return await db.query.collectionsTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function insert(data: InsertCollection) {
  return await db.insert(collectionsTable).values(data).returning();
}

async function update(id: string, data: UpdateCollection) {
  return await db
    .update(collectionsTable)
    .set(data)
    .where(eq(collectionsTable.id, id))
    .returning();
}

async function remove(id: string) {
  return await db
    .delete(collectionsTable)
    .where(eq(collectionsTable.id, id))
    .returning();
}

async function batchUpdate(ids: string[], data: UpdateCollection) {
  return await db
    .update(collectionsTable)
    .set(data)
    .where(inArray(collectionsTable.id, ids))
    .returning();
}

async function batchRemove(ids: string[]) {
  return await db
    .delete(collectionsTable)
    .where(inArray(collectionsTable.id, ids))
    .returning();
}

const CollectionRepository = {
  findAll,
  findById,
  insert,
  update,
  remove,
  batchUpdate,
  batchRemove,
};

export default CollectionRepository;
