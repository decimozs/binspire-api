import transporter from "@/src/lib/email";
import { z } from "zod/v4";

export const emailSchema = z.object({
  to: z.email({ message: "Invalid email" }),
  subject: z.string(),
  text: z.string(),
  html: z.string(),
});

export type EmailPayload = z.infer<typeof emailSchema>;

async function sendEmail(payload: EmailPayload) {
  const info = await transporter.sendMail({
    from: `"Binspire" <contact@binspire.com>`,
    ...payload,
  });

  return info;
}

const EmailService = {
  sendEmail,
};

export default EmailService;
