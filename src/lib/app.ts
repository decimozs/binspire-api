import { Hono } from "hono";
import { cors } from "hono/cors";
import type { AppBindings } from "./types";
import authRoute from "../module/auth/auth.route";
import { errorResponse } from "../util/response";
import { logging } from "./logging";
import { getCookie } from "hono/cookie";
import db from "./db";
import { UnauthorizedError } from "../util/error";
import { except } from "hono/combine";
import requestAccessRoute from "../module/request-access/request-access.route";
import emailRoute from "../module/email/email.route";

function initApp() {
  const app = new Hono<AppBindings>({ strict: false });

  app.use(
    "*",
    cors({
      origin: ["http://localhost:5173", "https://binspire-web.onrender.com"],
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
  );

  app.use(
    "*",
    except(
      [
        "/api/v1/auth/login",
        "/api/v1/auth/sign-up",
        "/api/v1/requests-access",
        "/api/v1/emails",
      ],
      async (c, next) => {
        const token = getCookie(c, "session_token") as string;

        const session = await db.query.sessionsTable.findFirst({
          where: (table, { eq }) => eq(table.token, token),
        });

        if (!session) throw new UnauthorizedError("Invalid token");

        c.set("session", session);

        await next();
      },
    ),
  );

  app.use(logging());

  app.onError((err, c) => {
    return errorResponse(c, err);
  });

  app.get("/", (c) => {
    return c.text("Hello from Binspire API!");
  });

  app.get("/checkhealth", (c) => {
    return c.json(
      {
        success: true,
        message: "All systems is normal",
      },
      200,
    );
  });

  return app;
}

const app = initApp();

const routes = [authRoute, requestAccessRoute, emailRoute] as const;

routes.forEach((route) => {
  app.route("/api/v1", route);
});

export default app;
