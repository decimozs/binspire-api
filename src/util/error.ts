import { StatusCodes } from "http-status-codes";
import type { ZodIssue } from "zod/v4";

export class NotFoundError extends Error {
  status: number;

  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.status = StatusCodes.NOT_FOUND;
  }
}

export class UnauthorizedError extends Error {
  status: number;

  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";
    this.status = StatusCodes.UNAUTHORIZED;
  }
}

export class BadRequestError extends Error {
  status: number;

  constructor(message = "Bad request", cause: ZodIssue[]) {
    super(message);
    this.name = "BadRequestError";
    this.cause = cause.toString();
    this.status = StatusCodes.BAD_REQUEST;
  }
}

export class ConflictError extends Error {
  status: number;

  constructor(message = "Resource already exists") {
    super(message);
    this.name = "ConflictError";
    this.status = StatusCodes.CONFLICT;
  }
}
