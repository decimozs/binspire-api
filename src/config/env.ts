/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "development") {
  config({ path: ".env" });
} else {
  config({ path: ".env.production" });
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "testing", "production"]),
  HIVEMQ_CLUSTER_URL: z.string(),
  HIVEMQ_PORT: z.string(),
  HIVEMQ_WS_PORT: z.string(),
  HIVEMQ_USERNAME: z.string(),
  HIVEMQ_PASSWORD: z.string(),
  RENDER_HOSTNAME: z.string(),
  DATABASE_URL: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  API_PORT: z.coerce.number().default(8080),
  GMAIL_HOST: z.string(),
  GMAIL_USER: z.string(),
  GMAIL_PASS: z.string(),
  ORS_API_KEY: z.string(),
});

const { data: env, error } = envSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment variables");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env;
