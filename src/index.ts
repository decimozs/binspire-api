import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello from Binspire API!");
});

export default app;
