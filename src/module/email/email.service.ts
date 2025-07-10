import transporter from "@/src/lib/email";
import { verificationTypeValues } from "@/src/util/constant";
import { z } from "zod/v4";
import { VerificationRepository } from "../verification/verification.repository";
import { expiresAtTime } from "@/src/util/time";
import { generateHashedToken } from "@/src/util/hashing";
import db from "@/src/lib/db";
import { NotFoundError } from "@/src/util/error";
import type { Verification } from "@/src/db";

export const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  type: z.enum(verificationTypeValues),
});

export type EmailPayload = z.infer<typeof emailSchema>;

async function sendEmail(payload: EmailPayload) {
  const { email, type } = payload;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (
    !user &&
    !["request-access", "access-approved", "access-rejected"].includes(type)
  ) {
    throw new NotFoundError(
      "User not found with this email. Please create an account first.",
    );
  }

  let raw: string | undefined;
  let verification: Verification;

  if (!["access-approved", "access-rejected"].includes(type)) {
    const token = generateHashedToken();
    raw = token.raw;
    const expiresAt = expiresAtTime;

    const [insertedVerification] = await VerificationRepository.insert({
      email,
      identifier: type,
      expiresAt,
      value: token.hash,
    });

    if (!insertedVerification) {
      throw new Error("Failed to insert verification");
    }

    verification = insertedVerification;
  }

  let subject = "";
  let text = "";
  let html = "";

  switch (type) {
    case "request-access": {
      subject = "Access Request Received";
      text =
        "Thank you for requesting access. Our team will review your request shortly.";
      html = `<p>Thank you for <strong>requesting access</strong>. Our team will review your request shortly.</p>`;
      break;
    }

    case "access-approved": {
      subject = "Access Request Approved";
      text = "Congratulations! Your access request has been approved.";
      html = `<p><strong>Congratulations!</strong> Your access request has been approved. You may now log in and start using the system.</p>`;
      break;
    }

    case "access-rejected": {
      subject = "Access Request Rejected";
      text = "We're sorry. Your access request has been rejected.";
      html = `<p>We're sorry to inform you that your <strong>access request has been rejected</strong>. Please contact the administrator if you believe this was a mistake.</p>`;
      break;
    }

    case "email-verification": {
      subject = "Verify Your Email Address";
      text = "Please verify your email address by clicking the link provided.";
      html = `<p>Please verify your email by clicking the link below:</p>
            <a href="https://yourdomain.com/verify?email=${encodeURIComponent(email)}">Verify Email</a>`;
      break;
    }

    case "forgot-password": {
      if (!raw) throw new Error("Token not generated for forgot-password");
      subject = "Reset Your Password";
      text = "You requested a password reset. Click the link below to proceed.";
      html = `<p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="https://binspire-web.onrender.com/auth/reset-password?token=${raw}">Reset Password</a>`;
      break;
    }
  }

  const info = await transporter.sendMail({
    from: `"Binspire" <contact@binspire.com>`,
    to: email,
    subject,
    text,
    html,
  });

  return {
    verification,
    info,
  };
}

const EmailService = {
  sendEmail,
};

export default EmailService;
