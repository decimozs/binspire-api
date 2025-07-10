import env from "@/src/config/env";
import { sessionsTable } from "@/src/db";
import db from "@/src/lib/db";
import { UnauthorizedError } from "@/src/util/error";
import { factory } from "@/src/util/factory";
import { eq } from "drizzle-orm";
import { getCookie, setCookie } from "hono/cookie";

const sessionMiddleware = factory.createMiddleware(async (c, next) => {
  const token = getCookie(c, "session_token") as string;

  if (!token) throw new UnauthorizedError("Missing session token");

  const session = await db.query.sessionsTable.findFirst({
    where: (table, { eq }) => eq(table.token, token),
  });

  if (!session) throw new UnauthorizedError("Invalid session token");

  const now = new Date();

  if (new Date(session.expiresAt) < now) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));

    setCookie(c, "session_token", "", {
      path: "/",
      httpOnly: true,
      secure: env?.NODE_ENV === "production",
      sameSite: env?.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 0,
    });

    throw new UnauthorizedError("Session expired");
  }

  c.set("session", session);

  await next();
});

export default sessionMiddleware;
