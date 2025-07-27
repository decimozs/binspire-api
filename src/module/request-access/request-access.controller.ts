import { insertRequestAccessSchema, updateRequestAccessSchema } from "@/src/db";
import { factory } from "@/src/util/factory";
import { successfulResponse } from "@/src/util/response";
import { zValidator } from "@/src/util/validator";
import RequestAccessService from "./request-access.service";
import { IdParamSchema } from "../verification/verification.controller";
import z from "zod/v4";

export const EmailParamsSchema = z.object({
  email: z.email("Must be a valid email address.").min(1, "Email is required."),
});

const getAllHandler = factory.createHandlers(async (c) => {
  const orgId = c.get("orgId");
  const data = await RequestAccessService.getAll(orgId);
  return successfulResponse(c, "Successfully get request access data", data);
});

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await RequestAccessService.getById(id);
    return successfulResponse(c, "Successfully get request access", data);
  },
);

const getByEmailHandler = factory.createHandlers(
  zValidator("param", EmailParamsSchema),
  async (c) => {
    const { email } = c.req.valid("param");
    const data = await RequestAccessService.getByEmail(email);
    return successfulResponse(
      c,
      "Successfully get request access by email",
      data,
    );
  },
);

const createRequestAccessHander = factory.createHandlers(
  zValidator("json", insertRequestAccessSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await RequestAccessService.create(payload);

    return successfulResponse(c, "Request access successful", data);
  },
);

const updateHandler = factory.createHandlers(
  zValidator("json", updateRequestAccessSchema),
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const userId = c.get("session").userId;
    const orgId = c.get("orgId");
    const data = await RequestAccessService.update(id, payload, orgId, userId);

    return successfulResponse(c, "Request access updated successfully", data);
  },
);

const deleteHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const userId = c.get("session").userId;
    const orgId = c.get("orgId");
    const data = await RequestAccessService.remove(id, orgId, userId);

    return successfulResponse(c, "Request access deleted successfully", data);
  },
);

export const BatchIdSchema = z.object({
  ids: z.array(z.string().min(1, "At least one ID required")),
});

const BatchUpdateSchema = z.object({
  ids: z.array(z.string().min(1, "At least one ID required")),
  data: updateRequestAccessSchema.refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided for update",
    },
  ),
});

const batchUpdateHandler = factory.createHandlers(
  zValidator("json", BatchUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await RequestAccessService.batchUpdate({ payload });

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
    const data = await RequestAccessService.batchRemove(ids);

    return successfulResponse(
      c,
      "Request access batch deleted successfully",
      data,
    );
  },
);

const RequestAccessController = {
  getAllHandler,
  getByIdHandler,
  getByEmailHandler,
  createRequestAccessHander,
  deleteHandler,
  batchDeleteHandler,
  updateHandler,
  batchUpdateHandler,
};

export default RequestAccessController;
