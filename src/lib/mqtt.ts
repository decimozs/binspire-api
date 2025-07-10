import mqtt from "mqtt";
import type { IClientOptions, MqttProtocol } from "mqtt";
import env from "../config/env";
import { logger } from "./logging";
import fs from "node:fs";

const caFile = fs.readFileSync("../../hivemq-ca.crt");

interface MQTTCredentials {
  host?: string;
  port?: number;
  protocol: MqttProtocol;
  username?: string;
  password?: string;
}

function initMQTT(
  credentials: MQTTCredentials = {
    host: env?.HIVEMQ_CLUSTER_URL,
    port: Number(env?.HIVEMQ_PORT),
    protocol: "mqtts",
    username: env?.HIVEMQ_USERNAME,
    password: env?.HIVEMQ_PASSWORD,
  },
) {
  const url = `${credentials.protocol}://${credentials.host}:${credentials.port}`;

  const options: IClientOptions = {
    username: credentials.username,
    password: credentials.password,
    reconnectPeriod: 1000,
    protocol: credentials.protocol,
    ca: caFile,
    rejectUnauthorized: true,
  };

  const mqttClient = mqtt.connect(url, options);

  mqttClient.on("connect", () => {
    logger.info("Connected to MQTT broker");
  });

  mqttClient.on("error", (err) => {
    logger.error("MQTT connection error:", err);
  });

  return mqttClient;
}

const mqttClient = initMQTT();

export type MQTTClient = ReturnType<typeof initMQTT>;

export async function pingMQTT(): Promise<void> {
  if (mqttClient.connected) {
    logger.info("MQTT is connected");
    return;
  }

  return new Promise((resolve, reject) => {
    mqttClient.once("connect", () => {
      logger.info("MQTT is now connected");
      resolve();
    });

    mqttClient.once("error", (err) => {
      reject(err);
    });
  });
}

export default mqttClient;
