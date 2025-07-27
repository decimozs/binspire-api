import IssueRepository from "./issue.repository";
import type { InsertIssue, UpdateIssue } from "@/src/db";
import type { BatchUpdatePayload } from "@/src/lib/types";
import ActivityService from "../actvity/activity.service";

async function getAll(orgId: string) {
  if (!orgId) {
    throw new Error("Organization ID is required to fetch issues");
  }

  return await IssueRepository.findAll(orgId);
}

async function getById(id: string) {
  const issue = await IssueRepository.findById(id);

  if (!issue) throw new Error("Issue not found");

  return issue;
}

async function create(data: InsertIssue, orgId: string, userId: string) {
  const [createdIssue] = await IssueRepository.insert(data);

  if (!createdIssue) throw new Error("Failed to create issue");

  const insertedHistory = await ActivityService.create({
    orgId,
    actorId: userId,
    entity: "issue",
    action: "create",
    referenceId: createdIssue.id,
    description: "Created a new issue",
    isArchive: false,
  });

  if (!insertedHistory)
    throw new Error("Failed to log history for issue deletion");

  return createdIssue;
}

async function update(
  id: string,
  data: UpdateIssue,
  orgId: string,
  userId: string,
) {
  const issue = await getById(id);

  const [updatedIssue] = await IssueRepository.update(id, data);

  if (!updatedIssue) throw new Error("Failed to update issue");

  const insertedHistory = await ActivityService.create({
    orgId,
    actorId: userId,
    entity: "issue",
    action: "update",
    referenceId: updatedIssue.id,
    description: "Updated an issue",
    isArchive: false,
    changes: {
      before: {
        ...issue,
      },
      after: {
        ...updatedIssue,
      },
    },
  });

  if (!insertedHistory)
    throw new Error("Failed to log history for issue update");

  return updatedIssue;
}

async function remove(id: string, orgId: string, userId: string) {
  const issue = await getById(id);

  const [deletedIssue] = await IssueRepository.remove(id);

  if (!deletedIssue) throw new Error("Failed to delete issue");

  const insertedHistory = await ActivityService.create({
    orgId,
    actorId: userId,
    entity: "issue",
    action: "delete",
    referenceId: deletedIssue.id,
    description: "Deleted an issue",
    isArchive: false,
    changes: {
      before: {
        status: issue.status,
      },
      after: {
        status: "deleted",
      },
    },
  });

  if (!insertedHistory)
    throw new Error("Failed to log history for issue deletion");

  return deletedIssue;
}

async function batchUpdate({
  payload,
}: {
  payload: BatchUpdatePayload<UpdateIssue>;
}) {
  const { ids, data } = payload;

  if (ids.length === 0) {
    throw new Error("No IDs provided for batch update");
  }

  const updatedDatas = await IssueRepository.batchUpdate(ids, data);

  if (updatedDatas.length === 0) {
    throw new Error("No issues were updated");
  }

  return {
    count: updatedDatas.length,
    updatedIds: updatedDatas.map((d) => d.id),
  };
}

async function batchRemove(ids: string[]) {
  if (ids.length === 0) {
    throw new Error("No IDs provided for batch removal");
  }

  const removedDatas = await IssueRepository.batchRemove(ids);

  if (removedDatas.length === 0) {
    throw new Error("No issues were removed");
  }

  return {
    count: removedDatas.length,
    removedIds: removedDatas.map((d) => d.id),
  };
}

const IssueService = {
  getAll,
  getById,
  create,
  update,
  remove,
  batchUpdate,
  batchRemove,
};

export default IssueService;
