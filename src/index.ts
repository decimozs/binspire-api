import { Hono } from "hono";

const app = new Hono();

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

export default app;
