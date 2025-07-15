import app from "./lib/app";
import { ping } from "./lib/db";
import { pingMQTT } from "./lib/mqtt";
import { websocket } from "./lib/websocket";

await ping();
await pingMQTT();

export default {
  fetch: app.fetch,
  port: 8080,
  websocket,
};
