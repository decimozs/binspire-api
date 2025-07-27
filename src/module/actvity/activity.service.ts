import type { InsertActivity, UpdateActivity } from "@/src/db";
import ActivityRepository from "./activity.repository";

async function getAll(orgId: string) {
  if (!orgId) {
    throw new Error("Organization ID is required to fetch activities");
  }

  return await ActivityRepository.findAll(orgId);
}

async function getById(id: string) {
  const activity = await ActivityRepository.findById(id);

  if (!activity) throw new Error("Activity not found");

  return activity;
}

async function getByUserId(userId: string) {
  const activities = await ActivityRepository.findByUserId(userId);

  if (!activities || activities.length === 0) {
    throw new Error("No activities found for this user");
  }

  return activities;
}

async function create(data: InsertActivity) {
  const [insertedActivity] = await ActivityRepository.insert(data);

  if (!insertedActivity) throw new Error("Failed to create activity");

  return insertedActivity;
}

async function update(id: string, data: UpdateActivity) {
  await getById(id);

  const [updatedActivity] = await ActivityRepository.update(id, data);

  if (!updatedActivity) throw new Error("Failed to update activity");

  return updatedActivity;
}

async function remove(id: string) {
  await getById(id);

  const [deletedActivity] = await ActivityRepository.remove(id);

  if (!deletedActivity) throw new Error("Failed to delete activity");

  return deletedActivity;
}

async function batchRemove(ids: string[]) {
  if (ids.length === 0) {
    throw new Error("No IDs provided for batch deletion");
  }

  const deletedActivities = await ActivityRepository.batchRemove(ids);

  return {
    count: deletedActivities.length,
    deletedIds: deletedActivities.map((d) => d.id),
  };
}

const ActivityService = {
  getAll,
  getById,
  getByUserId,
  create,
  update,
  remove,
  batchRemove,
};

export default ActivityService;
