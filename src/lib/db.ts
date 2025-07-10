import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import env from "../config/env";
import * as schema from "../db/index";
import { logger } from "./logging";

function initDatabase(url: string | undefined = env?.DATABASE_URL) {
  if (!url) throw new Error("URL is not provided");

  const client = neon(url);
  return drizzle(client, { schema });
}

const db = initDatabase();

export type Database = ReturnType<typeof initDatabase>;

export async function ping() {
  try {
    await db.execute("SELECT 1");
    logger.info("Database connected");
  } catch (error) {
    throw new Error("Failled to connect to the database: ", {
      cause: error,
    });
  }
}

export default db;
