import { orgsTable } from "@/src/db";
import type { InsertOrg, UpdateOrg } from "@/src/db";
import db from "@/src/lib/db";
import { eq } from "drizzle-orm";

async function findAll() {
  return await db.query.orgsTable.findMany();
}

async function findById(id: string) {
  return await db.query.orgsTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function insert(data: InsertOrg) {
  return await db.insert(orgsTable).values(data).returning();
}

async function update(data: UpdateOrg) {
  return await db.update(orgsTable).set(data).returning();
}

async function remove(id: string) {
  return await db.delete(orgsTable).where(eq(orgsTable.id, id)).returning();
}

export const OrgRepository = {
  findAll,
  findById,
  insert,
  update,
  remove,
};
