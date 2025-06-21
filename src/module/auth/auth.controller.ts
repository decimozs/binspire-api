import { factory } from "@/src/util/factory";
import { zValidator } from "@/src/util/validator";
import { AuthService, loginSchema, signUpSchema } from "./auth.service";
import type { LoginPayload, SignUpPayload } from "./auth.service";
import { deleteCookie, setCookie } from "hono/cookie";
import { successfulResponse } from "@/src/util/response";

const loginHandler = factory.createHandlers(
  zValidator("json", loginSchema),
  async (c) => {
    const data = c.req.valid("json");

    const ipAddress = c.req.header("X-Forwarded-For");

    const userAgent = c.req.header("user-agent");

    const payload = {
      ...data,
      ipAddress,
      userAgent,
    } as LoginPayload;

    const { session, user } = await AuthService.login(payload);

    setCookie(c, "session_token", session.token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      expires: session.expiresAt,
    });

    c.set("session", session);

    return successfulResponse(c, "Login successful", user);
  },
);

const signUpHandler = factory.createHandlers(
  zValidator("json", signUpSchema),
  async (c) => {
    const data = c.req.valid("json");

    const ipAddress = c.req.header("x-forwarded-for");

    const userAgent = c.req.header("user-agent");

    const payload = {
      ...data,
      ipAddress,
      userAgent,
    } as SignUpPayload;

    const { session, user } = await AuthService.signUp(payload);

    setCookie(c, "session_token", session.token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      expires: session.expiresAt,
    });

    return successfulResponse(c, "Sign up successful", user);
  },
);

const logoutHandler = factory.createHandlers(async (c) => {
  const session = c.get("session");

  const { token } = await AuthService.logout(session);

  deleteCookie(c, "session_token");

  return successfulResponse(c, "User logout", token);
});

const checkSessionHandler = factory.createHandlers(async (c) => {
  const session = c.get("session");

  const { user } = await AuthService.checkSession(session);

  return successfulResponse(c, "User is authenticated", user);
});

export const AuthController = {
  loginHandler,
  signUpHandler,
  logoutHandler,
  checkSessionHandler,
};
