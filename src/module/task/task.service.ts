import ActivityService from "../actvity/activity.service";
import TaskRepository from "./task.repository";
import type { InsertTask, UpdateTask } from "@/src/db";

async function getAll() {
  return await TaskRepository.findAll();
}

async function getById(id: string) {
  const task = await TaskRepository.findById(id);

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
}

async function getByUserId(userId: string) {
  await TaskRepository.findByUserId(userId);
  return await TaskRepository.findByUserId(userId);
}

async function create(data: InsertTask, orgId: string, userId: string) {
  const [createdTask] = await TaskRepository.insert(data);

  if (!createdTask) {
    throw new Error("Failed to create task");
  }

  const insertedHistory = await ActivityService.create({
    orgId,
    actorId: userId,
    entity: "task",
    action: "create",
    referenceId: createdTask.id,
    description: "Created a new task",
    isArchive: false,
  });

  if (!insertedHistory) {
    throw new Error("Failed to log history for task creation");
  }

  return createdTask;
}

async function update(
  id: string,
  data: UpdateTask,
  orgId: string,
  userId: string,
) {
  const task = await getById(id);

  const [updatedTask] = await TaskRepository.update(id, data);

  if (!updatedTask) {
    throw new Error("Failed to update task");
  }

  const insertedHistory = await ActivityService.create({
    orgId,
    actorId: userId,
    entity: "task",
    action: "update",
    referenceId: updatedTask.id,
    description: `Updated task ${task.title}`,
    isArchive: false,
  });

  if (!insertedHistory) {
    throw new Error("Failed to log history for task update");
  }

  return updatedTask;
}

async function remove(id: string, orgId: string, userId: string) {
  const task = await getById(id);

  const [deletedTask] = await TaskRepository.remove(id);

  if (!deletedTask) {
    throw new Error("Failed to delete task");
  }

  const insertedHistory = await ActivityService.create({
    orgId,
    actorId: userId,
    entity: "task",
    action: "delete",
    referenceId: deletedTask.id,
    description: `Deleted task ${task.title}`,
    isArchive: false,
  });

  if (!insertedHistory) {
    throw new Error("Failed to log history for task deletion");
  }

  return deletedTask;
}

const TaskService = {
  getAll,
  getById,
  getByUserId,
  create,
  update,
  remove,
};

export default TaskService;
