import { sql } from "drizzle-orm";
import db from "../lib/db";

export async function resetDB() {
  await db.execute(sql`
    DO $$
    DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END
    $$;
  `);

  await db.execute(sql`
    DO $$
    DECLARE
      r RECORD;
    BEGIN
      FOR r IN (
        SELECT n.nspname AS enum_schema, t.typname AS enum_type
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        GROUP BY enum_schema, enum_type
      ) LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.enum_schema) || '.' || quote_ident(r.enum_type) || ' CASCADE';
      END LOOP;
    END
    $$;
  `);

  console.log("✅ Database reset complete: all tables and enums dropped.");
}

resetDB();
