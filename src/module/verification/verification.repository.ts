import { verificationsTable } from "@/src/db";
import type { InsertVerification, UpdateVerification } from "@/src/db";
import db from "@/src/lib/db";
import { eq } from "drizzle-orm";

async function findAll() {
  return await db.query.verificationsTable.findMany();
}

async function findById(id: string) {
  return await db.query.verificationsTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function findByToken(token: string) {
  return await db.query.verificationsTable.findFirst({
    where: (table, { eq }) => eq(table.value, token),
  });
}

async function insert(data: InsertVerification) {
  return await db.insert(verificationsTable).values(data).returning();
}

async function update(data: UpdateVerification) {
  return await db.update(verificationsTable).set(data).returning();
}

async function remove(id: string) {
  return await db
    .delete(verificationsTable)
    .where(eq(verificationsTable.id, id))
    .returning();
}

export const VerificationRepository = {
  findAll,
  findById,
  findByToken,
  insert,
  update,
  remove,
};
