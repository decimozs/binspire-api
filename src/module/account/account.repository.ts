import { accountsTable } from "@/src/db";
import type { InsertAccount, UpdateAccount } from "@/src/db";
import db from "@/src/lib/db";
import { eq } from "drizzle-orm";

async function findAll() {
  return await db.query.accountsTable.findMany();
}

async function findById(id: string) {
  return await db.query.accountsTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function insert(data: InsertAccount) {
  return await db.insert(accountsTable).values(data).returning();
}

async function update(data: UpdateAccount) {
  return await db.update(accountsTable).set(data).returning();
}

async function remove(id: string) {
  return await db
    .delete(accountsTable)
    .where(eq(accountsTable.id, id))
    .returning();
}

export const AccountRepository = {
  findAll,
  findById,
  insert,
  update,
  remove,
};
