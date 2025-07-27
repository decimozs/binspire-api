import { trashbinsTable } from "@/src/db";
import type { InsertTrashbin, UpdateTrashbin } from "@/src/db";
import db from "@/src/lib/db";
import { eq, inArray } from "drizzle-orm";

async function findAll(orgId: string) {
  return await db.query.trashbinsTable.findMany({
    where: (table, { eq }) => eq(table.orgId, orgId),
  });
}

async function findById(id: string) {
  return await db.query.trashbinsTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function insert(data: InsertTrashbin) {
  return await db.insert(trashbinsTable).values(data).returning();
}

async function update(id: string, data: UpdateTrashbin) {
  return await db
    .update(trashbinsTable)
    .set(data)
    .where(eq(trashbinsTable.id, id))
    .returning();
}

async function remove(id: string) {
  return await db
    .delete(trashbinsTable)
    .where(eq(trashbinsTable.id, id))
    .returning();
}

async function batchUpdate(ids: string[], data: UpdateTrashbin) {
  return await db
    .update(trashbinsTable)
    .set(data)
    .where(inArray(trashbinsTable.id, ids))
    .returning();
}

async function batchRemove(ids: string[]) {
  return await db
    .delete(trashbinsTable)
    .where(inArray(trashbinsTable.id, ids))
    .returning();
}

const TrashbinRepository = {
  findAll,
  findById,
  insert,
  update,
  remove,
  batchUpdate,
  batchRemove,
};

export default TrashbinRepository;
