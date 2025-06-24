import { factory } from "@/src/util/factory";
import { zValidator } from "@/src/util/validator";
import {
  AuthService,
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
} from "./auth.service";
import type { LoginPayload, SignUpPayload } from "./auth.service";
import { setCookie } from "hono/cookie";
import { successfulResponse } from "@/src/util/response";
import env from "@/src/config/env";

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
      secure: env?.NODE_ENV === "production",
      sameSite: env?.NODE_ENV === "production" ? "None" : "Lax",
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
      secure: env?.NODE_ENV === "production",
      sameSite: env?.NODE_ENV === "production" ? "None" : "Lax",
      expires: session.expiresAt,
    });

    c.set("session", session);

    return successfulResponse(c, "Sign up successful", user);
  },
);

const logoutHandler = factory.createHandlers(async (c) => {
  const session = c.get("session");

  const { token } = await AuthService.logout(session);

  setCookie(c, "session_token", "", {
    path: "/",
    httpOnly: true,
    secure: env?.NODE_ENV === "production",
    sameSite: env?.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 0,
  });

  return successfulResponse(c, "User logout", token);
});

const checkSessionHandler = factory.createHandlers(async (c) => {
  const session = c.get("session");

  const { user } = await AuthService.checkSession(session);

  return successfulResponse(c, "User is authenticated", user);
});

const resetPasswordHandler = factory.createHandlers(
  zValidator("json", resetPasswordSchema),
  async (c) => {
    const payload = c.req.valid("json");

    await AuthService.resetPassword(payload);

    return successfulResponse(c, "Successfully reset password");
  },
);

export const AuthController = {
  loginHandler,
  signUpHandler,
  logoutHandler,
  checkSessionHandler,
  resetPasswordHandler,
};
