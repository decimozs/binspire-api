import {
  requestsAccessTable,

} from "@/src/db";
import type { InsertRequestAccess as RequestAccessPayload } from "@/src/db";
import db from "@/src/lib/db";
import { ConflictError, NotFoundError } from "@/src/util/error";
import EmailService from "../email/email.service";

async function createRequestAccess(payload: RequestAccessPayload) {
  const { email, orgId } = payload;

  const result = await db.transaction(async (tx) => {
    const user = await tx.query.usersTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (user) throw new ConflictError("Email is already use");

    const org = await tx.query.orgsTable.findFirst({
      where: (table, { eq }) => eq(table.id, orgId),
    });

    if (!org) throw new NotFoundError("Org not found");

    const requestAccess = await tx.query.requestsAccessTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (requestAccess) {
      throw new ConflictError(
        "You have already submitted a request. Please wait for approval.",
      );
    }

    const [insertedRequestAccess] = await tx
      .insert(requestsAccessTable)
      .values(payload)
      .returning();

    if (!insertedRequestAccess)
      throw new Error("Failed to create request access");

    const emailMessage = await EmailService.sendEmail({
      to: email,
      subject: "Request Access Received – We'll Get Back to You Soon",
      text: "We've received your access request. Our team will review it and contact you shortly.",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4CAF50;">Access Request Received</h2>
      <p>Hi there,</p>
      <p>Thank you for requesting access. We’ve received your request and our team will review it shortly.</p>
      <p>If your request is approved, you’ll receive a confirmation email with further instructions.</p>
      <p>We appreciate your patience!</p>
      <br />
      <p>Best regards,</p>
      <p><strong>Binspire Team</strong></p>
    </div>
  `,
    });

    return emailMessage;
  });

  return result;
}

const RequestAccessService = {
  createRequestAccess,
};

export default RequestAccessService;
