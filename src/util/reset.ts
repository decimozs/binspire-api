import {
  accountsTable,
  orgsTable,
  requestsAccessTable,
  sessionsTable,
  usersTable,
  verificationsTable,
} from "../db";
import db from "../lib/db";

export async function resetDB() {
  await db.delete(verificationsTable);
  await db.delete(sessionsTable);
  await db.delete(requestsAccessTable);
  await db.delete(accountsTable);
  await db.delete(usersTable);
  await db.delete(orgsTable);
}

resetDB();

console.log("✅ Database tables deleted");
