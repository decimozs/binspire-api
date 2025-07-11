import { tasksTable } from "@/src/db";
import type { InsertTask, UpdateTask } from "@/src/db";
import db from "@/src/lib/db";
import { eq } from "drizzle-orm";

async function findAll() {
  return await db.query.tasksTable.findMany();
}

async function findById(id: string) {
  return await db.query.tasksTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

async function findByUserId(userId: string) {
  return await db.query.tasksTable.findMany({
    where: (table, { eq }) => eq(table.assignedTo, userId),
  });
}

async function insert(data: InsertTask) {
  return await db.insert(tasksTable).values(data).returning();
}

async function update(id: string, data: UpdateTask) {
  return await db
    .update(tasksTable)
    .set(data)
    .where(eq(tasksTable.id, id))
    .returning();
}

async function remove(id: string) {
  return await db.delete(tasksTable).where(eq(tasksTable.id, id)).returning();
}

const TaskRepository = {
  findAll,
  findById,
  findByUserId,
  insert,
  update,
  remove,
};

export default TaskRepository;
