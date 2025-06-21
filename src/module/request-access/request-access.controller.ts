import { insertRequestAccess } from "@/src/db";
import { factory } from "@/src/util/factory";
import { successfulResponse } from "@/src/util/response";
import { zValidator } from "@/src/util/validator";
import RequestAccessService from "./request-access.service";

const createRequestAccessHander = factory.createHandlers(
  zValidator("json", insertRequestAccess),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await RequestAccessService.createRequestAccess(payload);

    return successfulResponse(c, "Request access successful", data);
  },
);

const RequestAccessController = {
  createRequestAccessHander,
};

export default RequestAccessController;
