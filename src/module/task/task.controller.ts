import { factory } from "@/src/util/factory";
import { zValidator } from "@/src/util/validator";
import TaskService from "./task.service";
import { successfulResponse } from "@/src/util/response";
import { IdParamSchema } from "../verification/verification.controller";
import { createTaskSchema, updateTaskSchema } from "@/src/db";

const getAllHandler = factory.createHandlers(async (c) => {
  const data = await TaskService.getAll();
  return successfulResponse(c, "Successfully retrieved tasks", data);
});

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await TaskService.getById(id);

    return successfulResponse(
      c,
      `Successfully retrieved task with id: ${id}`,
      data,
    );
  },
);

const getByUserIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await TaskService.getByUserId(id);

    return successfulResponse(
      c,
      `Successfully retrieved tasks for user with id: ${id}`,
      data,
    );
  },
);

const createHandler = factory.createHandlers(
  zValidator("json", createTaskSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const userId = c.get("session").userId;
    const orgId = c.get("orgId");
    const data = await TaskService.create(payload, orgId, userId);

    return successfulResponse(
      c,
      `Successfully created task with id: ${data.id}`,
      data,
    );
  },
);

const updateHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  zValidator("json", updateTaskSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const userId = c.get("session").userId;
    const orgId = c.get("orgId");
    const data = await TaskService.update(id, payload, orgId, userId);

    return successfulResponse(
      c,
      `Successfully updated task with id: ${id}`,
      data,
    );
  },
);

const deleteHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const userId = c.get("session").userId;
    const orgId = c.get("orgId");
    const data = await TaskService.remove(id, orgId, userId);

    return successfulResponse(
      c,
      `Successfully deleted task with id: ${id}`,
      data,
    );
  },
);

const TaskController = {
  getAllHandler,
  getByIdHandler,
  getByUserIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
};

export default TaskController;
