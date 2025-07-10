import db from "@/src/lib/db";
import type { InsertIssue, UpdateIssue } from "@/src/db";
import { issuesTable } from "@/src/db";
import { eq, inArray } from "drizzle-orm";

async function findAll() {
  return await db.query.issuesTable.findMany();
}

async function findById(id: string) {
  return await db.query.issuesTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function insert(data: InsertIssue) {
  return await db.insert(issuesTable).values(data).returning();
}

async function update(id: string, data: UpdateIssue) {
  return await db
    .update(issuesTable)
    .set(data)
    .where(eq(issuesTable.id, id))
    .returning();
}

async function remove(id: string) {
  return await db.delete(issuesTable).where(eq(issuesTable.id, id)).returning();
}

async function batchUpdate(ids: string[], data: UpdateIssue) {
  return await db
    .update(issuesTable)
    .set(data)
    .where(inArray(issuesTable.id, ids))
    .returning();
}

async function batchRemove(ids: string[]) {
  return await db
    .delete(issuesTable)
    .where(inArray(issuesTable.id, ids))
    .returning();
}

const IssueRepository = {
  findAll,
  findById,
  insert,
  update,
  remove,
  batchUpdate,
  batchRemove,
};

export default IssueRepository;
