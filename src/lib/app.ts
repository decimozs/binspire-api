import { Hono } from "hono";
import { cors } from "hono/cors";
import type { AppBindings } from "./types";
import authRoute from "../module/auth/auth.route";
import { errorResponse } from "../util/response";
import { logging } from "./logging";
import { except } from "hono/combine";
import requestAccessRoute from "../module/request-access/request-access.route";
import emailRoute from "../module/email/email.route";
import verificationRoute from "../module/verification/verification.route";
import sessionMiddleware from "../module/session/session.middleware";
import { unAuthenticatedRoutes } from "../util/constant";
import orgMiddleware from "../module/org/org.middleware";
import userRoute from "../module/user/user.route";
import trashbinRoute from "../module/trashbin/trashbin.route";
import collectionRoute from "../module/collection/collection.route";
import issueRoute from "../module/issue/issue.route";
import activityRoute from "../module/actvity/activity.route";
import historyRoute from "../module/history/history.route";
import taskRoute from "../module/task/task.route";
import directionRoute from "../module/direction/direction.route";
import { adminWsRoute, collectorWsRoute } from "./websocket";
import notificationRoute from "../module/notification/notification.route";
import orgRoute from "../module/org/org.route";

function initApp() {
  const app = new Hono<AppBindings>({ strict: false });

  app.use(
    "*",
    cors({
      origin: ["http://localhost:5173", "https://binspire-web.onrender.com"],
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  );

  app.use(
    "*",
    except(
      [
        "/",
        "/checkhealth",
        "/notifications",
        "/api/v1/ws/admin",
        "/api/v1/ws/collector",
        "/api/v1/auth/*",
        "/api/v1/emails/*",
        "/api/v1/requests-access/*",
      ],
      orgMiddleware,
    ),
  );

  app.use(
    "*",
    except(
      [
        "/",
        "/checkhealth",
        "/notifications",
        "/api/v1/ws/admin",
        "/api/v1/ws/collector",
        ...unAuthenticatedRoutes,
      ],
      sessionMiddleware,
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

const routes = [
  authRoute,
  requestAccessRoute,
  emailRoute,
  verificationRoute,
  userRoute,
  trashbinRoute,
  collectionRoute,
  issueRoute,
  activityRoute,
  historyRoute,
  taskRoute,
  directionRoute,
  adminWsRoute,
  collectorWsRoute,
  notificationRoute,
  orgRoute,
] as const;

routes.forEach((route) => {
  app.route("/api/v1", route);
});

export default app;
