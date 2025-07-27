import type { InsertHistory, UpdateHistory } from "@/src/db";
import HistoryRepository from "./history.repository";
import type { BatchUpdatePayload } from "@/src/lib/types";

async function getAll(orgId: string) {
  if (!orgId) {
    throw new Error("Organization ID is required to fetch histories");
  }

  return await HistoryRepository.findAll(orgId);
}

async function getById(id: string) {
  const history = await HistoryRepository.findById(id);

  if (!history) throw new Error("History not found");

  return history;
}

async function getByUserId(userId: string) {
  const histories = await HistoryRepository.findByUserId(userId);

  if (!histories || histories.length === 0) {
    throw new Error("No history records found for this user");
  }

  return histories;
}

async function create(data: InsertHistory) {
  const [insertedHistory] = await HistoryRepository.insert(data);

  if (!insertedHistory) throw new Error("Failed to create history");

  return insertedHistory;
}

async function update(id: string, data: UpdateHistory) {
  await getById(id);

  const [updatedHistory] = await HistoryRepository.update(id, data);

  if (!updatedHistory) throw new Error("Failed to update history");

  return updatedHistory;
}

async function remove(id: string) {
  await getById(id);

  const [deletedHistory] = await HistoryRepository.remove(id);

  if (!deletedHistory) throw new Error("Failed to delete history");

  return deletedHistory;
}

async function batchRemove(ids: string[]) {
  if (ids.length === 0) {
    throw new Error("No IDs provided for batch deletion");
  }

  const deletedHistories = await HistoryRepository.batchRemove(ids);

  return {
    deletedCount: deletedHistories.length,
    deletedActivities: deletedHistories,
  };
}

async function batchUpdate({
  payload,
}: {
  payload: BatchUpdatePayload<UpdateHistory>;
}) {
  const { ids, data } = payload;

  if (ids.length === 0) {
    throw new Error("No IDs provided for batch update");
  }

  const updatedHistories = await HistoryRepository.batchUpdate(ids, data);

  return {
    updatedCount: updatedHistories.length,
    updatedActivities: updatedHistories,
  };
}

const HistoryService = {
  getAll,
  getById,
  getByUserId,
  create,
  update,
  remove,
  batchRemove,
  batchUpdate,
};

export default HistoryService;
