import db from "@/src/lib/db";
import { UnauthorizedError } from "@/src/util/error";
import { factory } from "@/src/util/factory";
import { except } from "hono/combine";
import { getCookie } from "hono/cookie";

const sessionMiddleware = factory.createMiddleware(
  except(
    ["/auth/login", "/auth/sign-up", "/requests-access", "/emails"],
    async (c, next) => {
      const token = getCookie(c, "session_token") as string;

      const session = await db.query.sessionsTable.findFirst({
        where: (table, { eq }) => eq(table.token, token),
      });

      if (!session) throw new UnauthorizedError("Invalid token");

      c.set("session", session);

      await next();
    },
  ),
);

export default sessionMiddleware;
