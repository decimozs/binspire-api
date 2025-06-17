import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  RENDER_HOSTNAME: z.string(),
  DATABASE_URL: z.string(),
  EXTERNAL_DB_URL: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  API_PORT: z.coerce.number().default(8080),
});

/* eslint-disable node/no-process-env */
const { data: env, error } = envSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment variables");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env;
