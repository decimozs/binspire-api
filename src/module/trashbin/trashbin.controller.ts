import { factory } from "@/src/util/factory";
import { zValidator } from "@/src/util/validator";
import TrashbinService from "./trashbin.service";
import { successfulResponse } from "@/src/util/response";
import { IdParamSchema } from "../verification/verification.controller";
import { createTrashbinSchema, updateTrashbinSchema } from "@/src/db";
import z from "zod/v4";
import { BatchIdSchema } from "../request-access/request-access.controller";

const getAllHandler = factory.createHandlers(async (c) => {
  const data = await TrashbinService.getAll();
  return successfulResponse(c, "Successfully get trashbins", data);
});

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await TrashbinService.getById(id);

    return successfulResponse(
      c,
      `Successfully get trashbin with id of: ${id}`,
      data,
    );
  },
);

const createHandler = factory.createHandlers(
  zValidator("json", createTrashbinSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const userId = c.get("session").userId;
    const orgId = c.get("orgId");
    const data = await TrashbinService.create(payload, orgId, userId);

    return successfulResponse(
      c,
      `Successfully created trashbin with id of: ${data.id}`,
      data,
    );
  },
);

const updateHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  zValidator("json", updateTrashbinSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const userId = c.get("session").userId;
    const orgId = c.get("orgId");
    const data = await TrashbinService.update(id, payload, orgId, userId);

    return successfulResponse(
      c,
      `Successfully updated trashbin with id of: ${id}`,
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
    const data = await TrashbinService.remove(id, orgId, userId);

    return successfulResponse(
      c,
      `Successfully deleted trashbin with id of: ${id}`,
      data,
    );
  },
);

const BatchUpdateSchema = z.object({
  ids: z.array(z.string().min(1, "At least one ID required")),
  data: updateTrashbinSchema.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});

const batchUpdateHandler = factory.createHandlers(
  zValidator("json", BatchUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await TrashbinService.batchUpdate({ payload });

    return successfulResponse(
      c,
      `Successfully updated ${data.count} trashbins`,
      data,
    );
  },
);

const batchDeleteHandler = factory.createHandlers(
  zValidator("json", BatchIdSchema),
  async (c) => {
    const { ids } = c.req.valid("json");
    const data = await TrashbinService.batchRemove(ids);

    return successfulResponse(
      c,
      `Successfully deleted ${data.count} trashbins`,
      data,
    );
  },
);

const TrashbinController = {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  batchUpdateHandler,
  batchDeleteHandler,
};

export default TrashbinController;
