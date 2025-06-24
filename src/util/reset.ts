import { verificationsTable } from "../db";
import db from "../lib/db";

async function resetDB() {
  await db.delete(verificationsTable);
}

resetDB();
