export const roleValues = ["admin", "collector"] as const;
export const permissionValues = ["viewer", "editor", "superuser"] as const;
export const statusValues = [
  "pending",
  "approved",
  "rejected",
  "archived",
] as const;
export const verificationTypeValues = [
  "email-verification",
  "forgot-password",
  "request-access",
  "access-approved",
  "access-rejected",
  "create-account",
] as const;
export const unAuthenticatedRoutes = [
  "/",
  "/checkhealth",
  "/api/v1/ws",
  "/api/v1/ws/admin",
  "/api/v1/ws/collector",
  "/api/v1/verifications/*",
  "/api/v1/verifications",
  "/api/v1/auth/login",
  "/api/v1/auth/sign-up",
  "/api/v1/requests-access",
  "/api/v1/requests-access/email/*",
  "/api/v1/auth/reset-password",
  "/api/v1/emails",
];
