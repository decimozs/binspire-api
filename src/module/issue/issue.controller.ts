import IssueService from "./issue.service";
import { factory } from "@/src/util/factory";
import { successfulResponse } from "@/src/util/response";
import { IdParamSchema } from "../verification/verification.controller";
import { createIssueSchema, updateIssueSchema } from "@/src/db";
import z from "zod/v4";
import { BatchIdSchema } from "../request-access/request-access.controller";
import { zValidator } from "@/src/util/validator";

const getAllHandler = factory.createHandlers(async (c) => {
  const data = await IssueService.getAll();
  return successfulResponse(c, "Successfully retrieved issues", data);
});

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await IssueService.getById(id);

    return successfulResponse(
      c,
      `Successfully retrieved issue with id: ${id}`,
      data,
    );
  },
);

const createHandler = factory.createHandlers(
  zValidator("json", createIssueSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const userId = c.get("session").userId;
    const orgId = c.get("orgId");
    const data = await IssueService.create(payload, orgId, userId);

    return successfulResponse(
      c,
      `Successfully created issue with id: ${data.id}`,
      data,
    );
  },
);

const updateHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  zValidator("json", updateIssueSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const userId = c.get("session").userId;
    const orgId = c.get("orgId");
    const data = await IssueService.update(id, payload, orgId, userId);

    return successfulResponse(
      c,
      `Successfully updated issue with id: ${id}`,
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
    const data = await IssueService.remove(id, orgId, userId);

    return successfulResponse(
      c,
      `Successfully deleted issue with id: ${id}`,
      data,
    );
  },
);

const BatchUpdateSchema = z.object({
  ids: z.array(z.string().min(1, "At least one ID required")),
  data: updateIssueSchema.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});

const batchUpdateHandler = factory.createHandlers(
  zValidator("json", BatchUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await IssueService.batchUpdate({ payload });

    return successfulResponse(
      c,
      `Successfully updated ${data.count} issues`,
      data,
    );
  },
);

const batchDeleteHandler = factory.createHandlers(
  zValidator("json", BatchIdSchema),
  async (c) => {
    const { ids } = c.req.valid("json");
    const data = await IssueService.batchRemove(ids);

    return successfulResponse(
      c,
      `Successfully deleted ${data.count} issues`,
      data,
    );
  },
);

const IssueController = {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  batchUpdateHandler,
  batchDeleteHandler,
};

export default IssueController;
