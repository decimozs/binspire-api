import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import env from "../config/env";
import * as schema from "../db/index";

function initDatabase(url: string | undefined = env?.DATABASE_URL) {
  if (!url) throw new Error("URL is not provided");

  const client = postgres(url);

  return drizzle(client, { schema });
}

const db = initDatabase();

export type Database = ReturnType<typeof initDatabase>;

export default db;
