import { factory } from "@/src/util/factory";
import { zValidator } from "@/src/util/validator";
import { UserService } from "./user.service";
import { successfulResponse } from "@/src/util/response";
import { IdParamSchema } from "../verification/verification.controller";
import { updateUserSchema } from "@/src/db";
import z from "zod/v4";
import { BatchIdSchema } from "../request-access/request-access.controller";

const getAllHandler = factory.createHandlers(async (c) => {
  const orgId = c.get("orgId");
  const data = await UserService.getAll(orgId);
  return successfulResponse(c, "Successfully get users", data);
});

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await UserService.getById(id);

    return successfulResponse(
      c,
      `Successfully get user with id of: ${id}`,
      data,
    );
  },
);

const updateHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  zValidator("json", updateUserSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const userId = c.get("session").userId;
    const orgId = c.get("orgId");
    const data = await UserService.update(id, payload, orgId, userId);

    return successfulResponse(
      c,
      `Successfully get user with id of: ${id}`,
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
    const data = await UserService.remove(id, orgId, userId);

    return successfulResponse(
      c,
      `Successfully deleted user with id of: ${id}`,
      data,
    );
  },
);

const BatchUpdateSchema = z.object({
  ids: z.array(z.string().min(1, "At least one ID required")),
  data: updateUserSchema.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});

const batchUpdateHandler = factory.createHandlers(
  zValidator("json", BatchUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await UserService.batchUpdate({ payload });

    return successfulResponse(
      c,
      "Request access batch updated successfully",
      data,
    );
  },
);

const batchDeleteHandler = factory.createHandlers(
  zValidator("json", BatchIdSchema),
  async (c) => {
    const { ids } = c.req.valid("json");
    const data = await UserService.batchRemove(ids);

    return successfulResponse(
      c,
      "Request access batch deleted successfully",
      data,
    );
  },
);

export const UserController = {
  getAllHandler,
  getByIdHandler,
  updateHandler,
  deleteHandler,
  batchUpdateHandler,
  batchDeleteHandler,
};
