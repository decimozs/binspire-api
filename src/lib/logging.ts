import { pinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";
import env from "../config/env";

export function logging() {
  return pinoLogger({
    pino: pino(
      {
        level: "info",
      },
      env?.NODE_ENV === "production" ? undefined : pretty(),
    ),
  });
}
