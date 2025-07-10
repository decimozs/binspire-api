import { factory } from "@/src/util/factory";
import { IdParamSchema } from "../verification/verification.controller";
import { BatchIdSchema } from "../request-access/request-access.controller";
import { zValidator } from "@/src/util/validator";
import { insertHistorySchema, updateHistorySchema } from "@/src/db";
import { successfulResponse } from "@/src/util/response";
import HistoryService from "./history.service";
import z from "zod/v4";

const getAllHandler = factory.createHandlers(async (c) => {
  const data = await HistoryService.getAll();
  return successfulResponse(c, "Successfully retrieved histories", data);
});

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await HistoryService.getById(id);
    return successfulResponse(
      c,
      `Successfully retrieved history with id: ${id}`,
      data,
    );
  },
);

const getByUserIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await HistoryService.getByUserId(id);
    return successfulResponse(
      c,
      `Successfully retrieved histories for user with id: ${id}`,
      data,
    );
  },
);

const createHandler = factory.createHandlers(
  zValidator("json", insertHistorySchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await HistoryService.create(payload);
    return successfulResponse(c, "History created successfully", data);
  },
);

const updateHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  zValidator("json", updateHistorySchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const data = await HistoryService.update(id, payload);
    return successfulResponse(
      c,
      `History with id: ${id} updated successfully`,
      data,
    );
  },
);

const deleteHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await HistoryService.remove(id);
    return successfulResponse(
      c,
      `History with id: ${id} deleted successfully`,
      data,
    );
  },
);

const BatchUpdateSchema = z.object({
  ids: z.array(z.string().min(1, "At least one ID required")),
  data: updateHistorySchema.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});

const batchRemoveHandler = factory.createHandlers(
  zValidator("json", BatchIdSchema),
  async (c) => {
    const { ids } = c.req.valid("json");
    const data = await HistoryService.batchRemove(ids);
    return successfulResponse(c, "Histories deleted successfully", data);
  },
);

const batchUpdateHandler = factory.createHandlers(
  zValidator("json", BatchUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await HistoryService.batchUpdate({ payload });
    return successfulResponse(c, "Histories updated successfully", data);
  },
);

const HistoryController = {
  getAllHandler,
  getByIdHandler,
  getByUserIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  batchRemoveHandler,
  batchUpdateHandler,
};

export default HistoryController;
