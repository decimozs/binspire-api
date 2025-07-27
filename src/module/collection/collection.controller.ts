import { factory } from "@/src/util/factory";
import { zValidator } from "@/src/util/validator";
import { successfulResponse } from "@/src/util/response";
import { IdParamSchema } from "../verification/verification.controller";
import { createCollectionSchema, updateCollectionSchema } from "@/src/db";
import z from "zod/v4";
import { BatchIdSchema } from "../request-access/request-access.controller";
import CollectionService from "./collection.service";

const getAllHandler = factory.createHandlers(async (c) => {
  const orgId = c.get("orgId");
  const data = await CollectionService.getAll(orgId);
  return successfulResponse(c, "Successfully retrieved collections", data);
});

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await CollectionService.getById(id);

    return successfulResponse(
      c,
      `Successfully retrieved collection with id: ${id}`,
      data,
    );
  },
);

const createHandler = factory.createHandlers(
  zValidator("json", createCollectionSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await CollectionService.create(payload);

    return successfulResponse(
      c,
      `Successfully created collection with id: ${data.id}`,
      data,
    );
  },
);

const updateHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  zValidator("json", updateCollectionSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const userId = c.get("session").userId;
    const orgId = c.get("orgId");
    const data = await CollectionService.update(id, payload, orgId, userId);

    return successfulResponse(
      c,
      `Successfully updated collection with id: ${id}`,
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
    const data = await CollectionService.remove(id, orgId, userId);

    return successfulResponse(
      c,
      `Successfully deleted collection with id: ${id}`,
      data,
    );
  },
);

const BatchUpdateSchema = z.object({
  ids: z.array(z.string().min(1, "At least one ID required")),
  data: updateCollectionSchema.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});

const batchUpdateHandler = factory.createHandlers(
  zValidator("json", BatchUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await CollectionService.batchUpdate({ payload });

    return successfulResponse(
      c,
      `Successfully updated ${data.count} collections`,
      data,
    );
  },
);

const batchDeleteHandler = factory.createHandlers(
  zValidator("json", BatchIdSchema),
  async (c) => {
    const { ids } = c.req.valid("json");
    const data = await CollectionService.batchRemove(ids);

    return successfulResponse(
      c,
      `Successfully deleted ${data.count} collections`,
      data,
    );
  },
);

const CollectionController = {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  batchUpdateHandler,
  batchDeleteHandler,
};

export default CollectionController;
