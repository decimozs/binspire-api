import { createBunWebSocket } from "hono/bun";
import type { ServerWebSocket } from "bun";
import { factory } from "../util/factory";
import { logger } from "./logging";
import type { WSContext } from "hono/ws";

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

const connectedAdmins = new Set<WSContext>();
const connectedCollectors = new Set<WSContext>();

const adminWsRoute = factory.createApp().get(
  "/ws/admin",
  upgradeWebSocket(() => {
    return {
      onOpen(_, ws) {
        connectedAdmins.add(ws);
        logger.info("New admin connected");
      },
      onMessage(event, ws) {
        logger.info(`Message from admin: ${event.data.toString()}`);
        ws.send("Hello from server!");
      },
      onClose(_, ws) {
        connectedAdmins.delete(ws);
        logger.info("Admin disconnected");
      },
    };
  }),
);

const collectorWsRoute = factory.createApp().get(
  "/ws/collector",
  upgradeWebSocket(() => {
    return {
      onOpen(_, ws) {
        connectedCollectors.add(ws);
        logger.info("New collector connected");
      },
      onMessage(event) {
        logger.info(`Message from collectors: ${event.data.toString()}`);
      },
      onClose(_, ws) {
        connectedCollectors.delete(ws);
        logger.info("collector disconnected");
      },
    };
  }),
);

const broadcastToAdmins = (message: object) => {
  const payload = JSON.stringify(message);
  connectedAdmins.forEach((ws) => {
    if (ws.readyState === 1) {
      ws.send(payload);
    }
  });
};

const broadcastToCollectors = (message: object) => {
  const payload = JSON.stringify(message);
  connectedCollectors.forEach((ws) => {
    if (ws.readyState === 1) {
      ws.send(payload);
    }
  });
};

export {
  upgradeWebSocket,
  websocket,
  adminWsRoute,
  collectorWsRoute,
  broadcastToAdmins,
  broadcastToCollectors,
};
