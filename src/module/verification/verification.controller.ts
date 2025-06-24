import { factory } from "@/src/util/factory";
import { zValidator } from "@/src/util/validator";
import { z } from "zod/v4";
import VerificationService from "./verification.service";
import { successfulResponse } from "@/src/util/response";

export const IdParamSchema = z.object({
  id: z.string().min(1),
});

export const TokenParamSchema = z.object({
  token: z.string().min(1),
});

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await VerificationService.getById(id);
    return successfulResponse(c, "Verification validated successfully", data);
  },
);

const getByTokenHandler = factory.createHandlers(
  zValidator("param", TokenParamSchema),
  async (c) => {
    const { token } = c.req.valid("param");
    const data = await VerificationService.getByToken(token);
    return successfulResponse(c, "Verification validated successfully", data);
  },
);

const VerificationController = {
  getByIdHandler,
  getByTokenHandler,
};

export default VerificationController;
