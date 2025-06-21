import type { ZodSchema } from "zod/v4";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";
import { BadRequestError } from "./error";

export const zValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result) => {
    if (!result.success) {
      console.log("Zod error: ", result?.error);
      throw new BadRequestError("Bad request", result?.error.issues);
    }
  });
