import { Hono } from "hono";
import { cors } from "hono/cors";
import type { AppBindings } from "./types";

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

export default app;
