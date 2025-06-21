import {
  sessionsTable,

} from "@/src/db";
import type { InsertSession, UpdateSession } from "@/src/db";
import db from "@/src/lib/db";
import { eq } from "drizzle-orm";

async function findAll() {
  return await db.query.sessionsTable.findMany();
}

async function findById(id: string) {
  return await db.query.sessionsTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function insert(data: InsertSession) {
  return await db.insert(sessionsTable).values(data).returning();
}

async function update(data: UpdateSession) {
  return await db.update(sessionsTable).set(data).returning();
}

async function remove(id: string) {
  return await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.id, id))
    .returning();
}

export const SessionRepository = {
  findAll,
  findById,
  insert,
  update,
  remove,
};
