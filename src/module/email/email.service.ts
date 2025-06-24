import transporter from "@/src/lib/email";
import { verificationTypeValues } from "@/src/util/constant";
import { z } from "zod/v4";
import { VerificationRepository } from "../verification/verification.repository";
import { expiresAtTime } from "@/src/util/time";
import { generateHashedToken } from "@/src/util/hashing";
import db from "@/src/lib/db";
import { NotFoundError } from "@/src/util/error";

export const emailSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  type: z.enum(verificationTypeValues),
});

export type EmailPayload = z.infer<typeof emailSchema>;

async function sendEmail(payload: EmailPayload) {
  const { email, type } = payload;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!user) {
    throw new NotFoundError(
      "User not found with this email. Please create account first.",
    );
  }

  const { raw, hash } = generateHashedToken();
  const expiresAt = expiresAtTime;

  const [insertedVerification] = await VerificationRepository.insert({
    email,
    identifier: type,
    expiresAt,
    value: hash,
  });

  if (!insertedVerification) throw new Error("Failed to insert verification");

  const verification = insertedVerification;

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

    case "email-verification": {
      subject = "Verify Your Email Address";
      text = "Please verify your email address by clicking the link provided.";
      html = `<p>Please verify your email by clicking the link below:</p>
              <a href="https://yourdomain.com/verify?email=${encodeURIComponent(email)}">Verify Email</a>`;
      break;
    }

    case "forgot-password": {
      subject = "Reset Your Password";
      text = "You requested a password reset. Click the link below to proceed.";
      html = `<p>You requested a password reset. Click the link below to reset your password:</p>
              <a href="https://binspire-web.onrender.com/auth/reset-password?token=${raw}">Reset Password</a>`;
      break;
    }

    default: {
      throw new Error("Invalid email type");
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
