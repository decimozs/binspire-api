import type { BatchUpdatePayload } from "@/src/lib/types";
import CollectionRepository from "./collection.repository";
import type { InsertCollection, UpdateCollection } from "@/src/db";
import HistoryService from "../history/history.service";

async function getAll() {
  return await CollectionRepository.findAll();
}

async function getById(id: string) {
  const collection = await CollectionRepository.findById(id);

  if (!collection) {
    throw new Error("Collection not found");
  }

  return collection;
}

async function create(data: InsertCollection) {
  const [createdCollection] = await CollectionRepository.insert(data);

  if (!createdCollection) {
    throw new Error("Failed to create collection");
  }

  return createdCollection;
}

async function update(
  id: string,
  data: UpdateCollection,
  orgId: string,
  userId: string,
) {
  const collection = await getById(id);

  const [updatedCollection] = await CollectionRepository.update(id, data);

  if (!updatedCollection) {
    throw new Error("Failed to update collection");
  }

  const insertedHistory = await HistoryService.create({
    orgId,
    actorId: userId,
    entity: "collection",
    action: "update",
    referenceId: updatedCollection.id,
    description: "Updated a collection",
    isArchive: false,
    changes: {
      before: {
        ...collection,
      },
      after: {
        ...updatedCollection,
      },
    },
  });

  if (!insertedHistory) {
    throw new Error("Failed to log history for collection update");
  }

  return updatedCollection;
}

async function remove(id: string, orgId: string, userId: string) {
  const collection = await getById(id);

  const [deletedCollection] = await CollectionRepository.remove(id);

  if (!deletedCollection) {
    throw new Error("Failed to delete collection");
  }

  const insertedHistory = await HistoryService.create({
    orgId,
    actorId: userId,
    entity: "collection",
    action: "delete",
    referenceId: deletedCollection.id,
    description: "Deleted a collection",
    isArchive: false,
    changes: {
      before: {
        status: collection.isArchive ? "archived" : "active",
      },
      after: {
        status: "deleted",
      },
    },
  });

  if (!insertedHistory) {
    throw new Error("Failed to log history for collection deletion");
  }

  return deletedCollection;
}

async function batchUpdate({
  payload,
}: {
  payload: BatchUpdatePayload<UpdateCollection>;
}) {
  const { ids, data } = payload;

  if (ids.length === 0) {
    throw new Error("No IDs provided for batch update");
  }

  const updatedDatas = await CollectionRepository.batchUpdate(ids, data);

  return {
    count: updatedDatas.length,
    updatedIds: updatedDatas.map((d) => d.id),
  };
}

async function batchRemove(ids: string[]) {
  if (ids.length === 0) {
    throw new Error("No IDs provided for batch deletion");
  }

  const deleted = await CollectionRepository.batchRemove(ids);

  return {
    count: deleted.length,
    deletedIds: deleted.map((d) => d.id),
  };
}

const CollectionService = {
  getAll,
  getById,
  create,
  update,
  remove,
  batchUpdate,
  batchRemove,
};

export default CollectionService;
