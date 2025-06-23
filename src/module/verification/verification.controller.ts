import { factory } from "@/src/util/factory";
import { zValidator } from "@/src/util/validator";
import { z } from "zod/v4";
import VerificationService from "./verification.service";
import { successfulResponse } from "@/src/util/response";

export const IdParamSchema = z.object({
  id: z.string().min(1),
});

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await VerificationService.getById(id);
    return successfulResponse(c, "Verification validated successfully", data);
  },
);

const VerificationController = {
  getByIdHandler,
};

export default VerificationController;
