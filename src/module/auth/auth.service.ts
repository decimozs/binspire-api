import { sessionsTable, usersTable } from "@/src/db";
import type { Session } from "@/src/db";
import db from "@/src/lib/db";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/src/util/error";
import argon2 from "argon2";
import { SessionRepository } from "../session/session.repository";
import { expiresAtTime } from "@/src/util/time";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { UserRepository } from "../user/user.repository";
import { AccountRepository } from "../account/account.repository";
import { permissionValues, roleValues } from "@/src/util/constant";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginPayload = z.infer<typeof loginSchema> & {
  ipAddress?: string;
  userAgent?: string;
};

export async function login(payload: LoginPayload) {
  const { email, password, ipAddress, userAgent } = payload;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!user) throw new NotFoundError("User not found");

  const userId = user.id;
  const orgId = user.orgId;
  const role = user.role;
  const permission = user.permission;

  const account = await db.query.accountsTable.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
  });

  if (!account) throw new NotFoundError("Account not found");

  const accountPassword = account.password as string;

  const validatePassword = await argon2.verify(accountPassword, password);

  if (!validatePassword) throw new UnauthorizedError("Invalid password");

  const [session] = await SessionRepository.insert({
    userId,
    orgId,
    expiresAt: expiresAtTime,
    ipAddress,
    userAgent,
    role,
    permission,
  });

  if (!session) throw new Error("Failed to create session");

  await db
    .update(usersTable)
    .set({ isOnline: true })
    .where(eq(usersTable.id, userId));

  return {
    session,
    user: {
      id: userId,
      email,
      role,
      permission,
    },
  };
}

export const signUpSchema = z
  .object({
    userData: z.object({
      name: z.string(),
      orgId: z.string(),
      email: z.string().email(),
      permission: z.enum(permissionValues),
      role: z.enum(roleValues),
    }),
    accountData: z.object({
      password: z.string().min(6),
    }),
  })
  .strict();

export type SignUpPayload = z.infer<typeof signUpSchema> & {
  ipAddress?: string;
  userAgent?: string;
};

export async function signUp(payload: SignUpPayload) {
  const { userData, accountData, ipAddress, userAgent } = payload;

  const email = userData.email;

  const result = await db.transaction(async (tx) => {
    const user = await tx.query.usersTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (user) {
      throw new ConflictError("Email is already use");
    }

    const org = await db.query.orgsTable.findFirst({
      where: (table, { eq }) => eq(table.id, userData.orgId),
    });

    if (!org) throw new NotFoundError("Org not found");

    const [inserUser] = await UserRepository.insert(userData);

    if (!inserUser) {
      tx.rollback();
      throw new Error("Failed to insert user");
    }

    const hashPassword = await argon2.hash(accountData.password);

    const [insertAccount] = await AccountRepository.insert({
      userId: inserUser.id,
      password: hashPassword,
    });

    if (!insertAccount) throw new Error("Failed to insert account");

    const userId = inserUser.id;
    const orgId = inserUser.orgId;
    const role = inserUser.role;
    const permission = inserUser.permission;

    const [session] = await SessionRepository.insert({
      userId,
      orgId,
      expiresAt: expiresAtTime,
      ipAddress,
      userAgent,
      role,
      permission,
    });

    if (!session) throw new Error("Failed to create session");

    await db
      .update(usersTable)
      .set({ isOnline: true })
      .where(eq(usersTable.id, userId));

    return {
      session,
      user: {
        id: userId,
        email,
        role,
        permission,
      },
    };
  });

  return result;
}

async function logout(session: Session) {
  const { token } = session;

  const [deleteSession] = await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.token, token))
    .returning();

  if (!deleteSession) throw new Error("Faild to delete session");

  return {
    ...deleteSession,
  };
}

async function checkSession(session: Session) {
  if (!session || !session.token) {
    throw new UnauthorizedError("Missing session token");
  }

  const { userId } = session;

  if (!userId) throw new UnauthorizedError("Not authenticated");

  const user = await UserRepository.findById(userId);

  if (!user) throw new UnauthorizedError("Invalid session");

  return { user };
}

export const resetPasswordSchema = z
  .object({
    email: z
      .email({ message: "Please enter a valid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/\d/, { message: "Password must contain at least 1 number" })
      .regex(/[a-z]/, {
        message: "Password must contain at least 1 lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least 1 uppercase letter",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;

async function resetPassword(payload: ResetPasswordPayload) {
  const { email, password } = payload;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!user) throw new NotFoundError("User not found");

  const hashPassword = await argon2.hash(password);

  const [updatedAccount] = await AccountRepository.update({
    userId: user.id,
    password: hashPassword,
  });

  if (!updatedAccount) throw new Error("Failed to update account");
}

export const AuthService = {
  login,
  signUp,
  logout,
  checkSession,
  resetPassword,
};
