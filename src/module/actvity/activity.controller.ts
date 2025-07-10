import { successfulResponse } from "@/src/util/response";
import ActivityService from "./activity.service";
import { factory } from "@/src/util/factory";
import { IdParamSchema } from "../verification/verification.controller";
import { zValidator } from "@/src/util/validator";
import { insertActivitySchema, updateActivitySchema } from "@/src/db";
import { BatchIdSchema } from "../request-access/request-access.controller";

const getAllHandler = factory.createHandlers(async (c) => {
  const data = await ActivityService.getAll();
  return successfulResponse(c, "Successfully retrieved activities", data);
});

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await ActivityService.getById(id);

    return successfulResponse(
      c,
      `Successfully retrieved activity with id: ${id}`,
      data,
    );
  },
);

const getByUserIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await ActivityService.getByUserId(id);

    return successfulResponse(
      c,
      `Successfully retrieved activities for user with id: ${id}`,
      data,
    );
  },
);

const createHandler = factory.createHandlers(
  zValidator("json", insertActivitySchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await ActivityService.create(payload);

    return successfulResponse(c, "Activity created successfully", data);
  },
);

const updateHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  zValidator("json", updateActivitySchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const data = await ActivityService.update(id, payload);

    return successfulResponse(
      c,
      `Successfully updated activity with id: ${id}`,
      data,
    );
  },
);

const deleteHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await ActivityService.remove(id);

    return successfulResponse(
      c,
      `Successfully deleted activity with id: ${id}`,
      data,
    );
  },
);

const batchDeleteHandler = factory.createHandlers(
  zValidator("json", BatchIdSchema),
  async (c) => {
    const { ids } = c.req.valid("json");
    const data = await ActivityService.batchRemove(ids);

    return successfulResponse(c, "Successfully deleted activities", data);
  },
);

const ActivityController = {
  getAllHandler,
  getByIdHandler,
  getByUserIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  batchDeleteHandler,
};

export default ActivityController;
