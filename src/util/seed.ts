import db from "../lib/db";
import argon2 from "argon2";
import { resetDB } from "./reset";
import { accountsTable, orgsTable, usersTable } from "../db";

const [org] = await db
  .insert(orgsTable)
  .values({
    name: "test-org",
    slug: "test_org",
  })
  .returning();

if (!org) throw new Error("Failed to seed org table");

const [user] = await db
  .insert(usersTable)
  .values({
    orgId: org.id,
    name: "Admin",
    email: "admin@gmail.com",
    permission: "superuser",
    role: "admin",
    isOnline: false,
  })
  .returning();

if (!user) throw new Error("Failed to seed user table");

const hashedPassword = await argon2.hash("admin12345");

await db.insert(accountsTable).values({
  userId: user.id,
  password: hashedPassword,
});

console.log("✅ Seeded one org, user, and account.");
console.log("org: ", org);
console.log("user: ", user);
