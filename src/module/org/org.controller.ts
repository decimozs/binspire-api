import { factory } from "@/src/util/factory";
import { zValidator } from "@/src/util/validator";
import { IdParamSchema } from "../verification/verification.controller";
import OrgService from "./org.service";
import { successfulResponse } from "@/src/util/response";

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await OrgService.getOrgById(id);
    return successfulResponse(
      c,
      `Successfully retrieved organization with id: ${id}`,
      data,
    );
  },
);

const OrgController = {
  getByIdHandler,
};

export default OrgController;
