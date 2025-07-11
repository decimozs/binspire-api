import type { InsertUser, UpdateUser } from "@/src/db";
import { UserRepository } from "./user.repository";
import { NotFoundError } from "@/src/util/error";
import type { BatchUpdatePayload } from "@/src/lib/types";
import ActivityService from "../actvity/activity.service";

async function getAll() {
  return await UserRepository.findAll();
}

async function getById(id: string) {
  const user = await UserRepository.findById(id);

  if (!user) throw new NotFoundError("User not found");

  return user;
}

async function create(data: InsertUser) {
  const [createUser] = await UserRepository.insert(data);

  if (!createUser) throw new Error("Failed to create user");

  return createUser;
}

async function update(
  id: string,
  data: UpdateUser,
  orgId: string,
  userId: string,
) {
  const user = await getById(id);

  const [updateUser] = await UserRepository.update(id, data);

  if (!updateUser) throw new Error("Failed to update user");

  const insertedHistory = await ActivityService.create({
    orgId,
    actorId: userId,
    entity: "user",
    action: "update",
    referenceId: updateUser.id,
    description: "Updated a user",
    isArchive: false,
    changes: {
      before: {
        ...user,
      },
      after: {
        ...updateUser,
      },
    },
  });

  if (!insertedHistory) {
    throw new Error("Failed to log history for user update");
  }

  return updateUser;
}

async function remove(id: string, orgId: string, userId: string) {
  const user = await getById(id);

  const [deletedUser] = await UserRepository.remove(id);

  if (!deletedUser) throw new Error("Failed to delete user");

  const insertedHistory = await ActivityService.create({
    orgId,
    actorId: userId,
    entity: "user",
    action: "delete",
    referenceId: deletedUser.id,
    description: "Deleted a user",
    isArchive: false,
    changes: {
      before: {
        status: user.isArchive ? "archived" : "active",
      },
      after: {
        status: "deleted",
      },
    },
  });

  if (!insertedHistory) {
    throw new Error("Failed to log history for user deletion");
  }

  return deletedUser;
}

async function batchUpdate({
  payload,
}: {
  payload: BatchUpdatePayload<UpdateUser>;
}) {
  const { ids, data } = payload;

  if (ids.length === 0) {
    throw new Error("No IDs provided for batch deletion");
  }

  const updatedDatas = await UserRepository.batchUpdate(ids, data);

  return {
    count: updatedDatas.length,
    updatedIds: updatedDatas.map((d) => d.id),
  };
}

async function batchRemove(ids: string[]) {
  if (ids.length === 0) {
    throw new Error("No IDs provided for batch deletion");
  }

  const deleted = await UserRepository.batchRemove(ids);

  return {
    count: deleted.length,
    deletedIds: deleted.map((d) => d.id),
  };
}

export const UserService = {
  getAll,
  getById,
  create,
  update,
  remove,
  batchRemove,
  batchUpdate,
};
