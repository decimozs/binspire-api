import {
  requestsAccessTable,
  type InsertRequestAccess,
  type UpdateRequestAccess,
} from "@/src/db";
import db from "@/src/lib/db";
import { eq } from "drizzle-orm";

async function findAll() {
  return await db.query.requestsAccessTable.findMany();
}

async function findById(id: string) {
  return await db.query.requestsAccessTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function insert(data: InsertRequestAccess) {
  return await db.insert(requestsAccessTable).values(data).returning();
}

async function update(data: UpdateRequestAccess) {
  return await db.update(requestsAccessTable).set(data).returning();
}

async function remove(id: string) {
  return await db
    .delete(requestsAccessTable)
    .where(eq(requestsAccessTable.id, id))
    .returning();
}

export const RequestAccessRepository = {
  findAll,
  findById,
  insert,
  update,
  remove,
};
