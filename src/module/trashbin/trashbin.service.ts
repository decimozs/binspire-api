import type { BatchUpdatePayload } from "@/src/lib/types";
import TrashbinRepository from "./trashbin.repository";
import type { InsertTrashbin, UpdateTrashbin } from "@/src/db";
import ActivityService from "../actvity/activity.service";

async function getAll() {
  return await TrashbinRepository.findAll();
}

async function getById(id: string) {
  const trashbin = await TrashbinRepository.findById(id);

  if (!trashbin) {
    throw new Error("Trashbin not found");
  }

  return trashbin;
}

async function create(data: InsertTrashbin, orgId: string, userId: string) {
  const [createdTrashbin] = await TrashbinRepository.insert(data);

  if (!createdTrashbin) {
    throw new Error("Failed to create trashbin");
  }

  const insertedHistory = await ActivityService.create({
    orgId,
    actorId: userId,
    entity: "trashbin",
    action: "create",
    referenceId: createdTrashbin.id,
    description: "Deployed a new trashbin",
    isArchive: false,
  });

  if (!insertedHistory) {
    throw new Error("Failed to log history for trashbin creation");
  }

  return createdTrashbin;
}

async function update(
  id: string,
  data: UpdateTrashbin,
  orgId: string,
  userId: string,
) {
  const trashbin = await getById(id);

  const [updatedTrashbin] = await TrashbinRepository.update(id, data);

  if (!updatedTrashbin) {
    throw new Error("Failed to update trashbin");
  }

  const insertedHistory = await HistoryService.create({
    orgId,
    actorId: userId,
    entity: "trashbin",
    action: "update",
    referenceId: updatedTrashbin.id,
    description: "Updated a trashbin",
    isArchive: false,
    changes: {
      before: {
        ...trashbin,
      },
      after: {
        ...updatedTrashbin,
      },
    },
  });

  if (!insertedHistory) {
    throw new Error("Failed to log history for trashbin update");
  }

  return updatedTrashbin;
}

async function remove(id: string, orgId: string, userId: string) {
  const trashbin = await getById(id);

  const [deletedTrashbin] = await TrashbinRepository.remove(id);

  if (!deletedTrashbin) {
    throw new Error("Failed to delete trashbin");
  }

  const insertedHistory = await ActivityService.create({
    orgId,
    actorId: userId,
    entity: "trashbin",
    action: "delete",
    referenceId: deletedTrashbin.id,
    description: "Deleted a trashbin",
    isArchive: false,
    changes: {
      before: {
        status: trashbin.isArchive ? "archived" : "active",
      },
      after: {
        status: "deleted",
      },
    },
  });

  if (!insertedHistory) {
    throw new Error("Failed to log history for trashbin deletion");
  }

  return deletedTrashbin;
}

async function batchUpdate({
  payload,
}: {
  payload: BatchUpdatePayload<UpdateTrashbin>;
}) {
  const { ids, data } = payload;

  if (ids.length === 0) {
    throw new Error("No IDs provided for batch update");
  }

  const updatedDatas = await TrashbinRepository.batchUpdate(ids, data);

  return {
    count: updatedDatas.length,
    updatedIds: updatedDatas.map((d) => d.id),
  };
}

async function batchRemove(ids: string[]) {
  if (ids.length === 0) {
    throw new Error("No IDs provided for batch deletion");
  }

  const deleted = await TrashbinRepository.batchRemove(ids);
  return {
    count: deleted.length,
    deletedIds: deleted.map((d) => d.id),
  };
}

export const TrashbinService = {
  getAll,
  getById,
  create,
  update,
  remove,
  batchUpdate,
  batchRemove,
};

export default TrashbinService;
