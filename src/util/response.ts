import type { Context } from "hono";
import type { HTTPResponseError } from "hono/types";
import { BadRequestError } from "./error";
import { ZodError } from "zod";

export function successfulResponse<T>(
  c: Context,
  message: string,
  payload?: T,
) {
  return c.json({
    status: true,
    message,
    payload,
  });
}

export function errorResponse(c: Context, err: Error | HTTPResponseError) {
  const status =
    typeof (err as any)?.status === "number" ? (err as any).status : 500;

  const responseBody: Record<string, any> = {
    status: false,
    message: err.message,
  };

  if (err instanceof BadRequestError && err.cause instanceof ZodError) {
    responseBody.cause = err.cause.flatten();
  }

  return c.json(responseBody, status);
}
