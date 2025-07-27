import { requestsAccessTable } from "@/src/db";
import type {
  InsertRequestAccess as RequestAccessPayload,
  UpdateRequestAccess,
} from "@/src/db";
import db from "@/src/lib/db";
import { ConflictError, NotFoundError } from "@/src/util/error";
import EmailService from "../email/email.service";
import { RequestAccessRepository } from "./request-access.repository";
import transporter from "@/src/lib/email";
import { generateHashedToken } from "@/src/util/hashing";
import { expiresAtTime } from "@/src/util/time";
import { VerificationRepository } from "../verification/verification.repository";
import type { BatchUpdatePayload } from "@/src/lib/types";
import ActivityService from "../actvity/activity.service";

async function getAll(orgId: string) {
  if (!orgId) {
    throw new Error("Organization ID is required to fetch request accesses");
  }

  return await RequestAccessRepository.findAll(orgId);
}

async function getById(id: string) {
  const requestAccess = await RequestAccessRepository.findById(id);

  if (!requestAccess) throw new Error("Request access not found");

  return requestAccess;
}

async function getByEmail(email: string) {
  const requestAccess = await RequestAccessRepository.findByEmail(email);

  if (!requestAccess) throw new NotFoundError("Request access not found");

  return requestAccess;
}

async function create(payload: RequestAccessPayload) {
  const { email, orgId } = payload;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (user) throw new ConflictError("Email is already use");

  const org = await db.query.orgsTable.findFirst({
    where: (table, { eq }) => eq(table.id, orgId),
  });

  if (!org) throw new NotFoundError("Org not found");

  const requestAccess = await db.query.requestsAccessTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (requestAccess) {
    throw new ConflictError(
      "You have already submitted a request. Please wait for approval.",
    );
  }

  const [insertedRequestAccess] = await db
    .insert(requestsAccessTable)
    .values(payload)
    .returning();

  if (!insertedRequestAccess)
    throw new Error("Failed to create request access");

  const emailMessage = await EmailService.sendEmail({
    email,
    type: "request-access",
  });

  return emailMessage;
}

async function update(
  id: string,
  data: UpdateRequestAccess,
  orgId: string,
  userId: string,
) {
  const { email } = data;

  if (!email) throw new Error("Email is required for updating request access");

  const requestAccess = await getById(id);

  const [updatedRequestAccess] = await RequestAccessRepository.update(id, data);

  if (!updatedRequestAccess) throw new Error("Failed to update request access");

  if (data.status === "approved") {
    const token = generateHashedToken();
    const raw = token.raw;
    const expiresAt = expiresAtTime;

    const [insertedVerification] = await VerificationRepository.insert({
      email,
      identifier: "create-account",
      expiresAt,
      value: token.hash,
    });

    if (!insertedVerification) {
      throw new Error("Failed to insert verification");
    }

    const info = await transporter.sendMail({
      from: `"Binspire" <contact@binspire.com>`,
      to: email,
      subject: "Access Request Approved",
      text: "Congratulations! Your access request has been approved.",
      html: `
    <p><strong>Congratulations!</strong> Your access request has been approved.</p>
    <p>Please confirm your account by clicking the link below:</p>
    <p><a href="https://binspire-web.onrender.com/auth/create-account?token=${raw}">Confirm your account</a></p>
  `,
    });

    const insertedHistory = await ActivityService.create({
      orgId,
      actorId: userId,
      entity: "request-access",
      action: "update",
      referenceId: updatedRequestAccess.id,
      description: "Updated a request access",
      isArchive: false,
      changes: {
        before: {
          ...requestAccess,
        },
        after: {
          ...updatedRequestAccess,
        },
      },
    });

    if (!insertedHistory) {
      throw new Error("Failed to log history for request access update");
    }

    return { info, updatedRequestAccess };
  } else if (data.status === "rejected") {
    const info = await transporter.sendMail({
      from: `"Binspire" <contact@binspire.com>`,
      to: email,
      subject: "Access Request Rejected",
      text: "We're sorry. Your access request has been rejected.",
      html: `<p>We're sorry to inform you that your <strong>access request has been rejected</strong>. Please contact the administrator if you believe this was a mistake.</p>`,
    });

    const insertedHistory = await ActivityService.create({
      orgId,
      actorId: userId,
      entity: "request-access",
      action: "update",
      referenceId: updatedRequestAccess.id,
      description: "Updated a request access",
      isArchive: false,
      changes: {
        before: {
          ...requestAccess,
        },
        after: {
          ...updatedRequestAccess,
        },
      },
    });

    if (!insertedHistory) {
      throw new Error("Failed to log history for request access update");
    }

    return { info, updatedRequestAccess };
  }
}

async function remove(id: string, orgId: string, userId: string) {
  const requestAccess = await getById(id);

  const [deletedRequestAccess] = await RequestAccessRepository.remove(id);

  if (!deletedRequestAccess) throw new Error("Failed to delete request access");

  const insertedHistory = await ActivityService.create({
    orgId,
    actorId: userId,
    entity: "request-access",
    action: "delete",
    referenceId: deletedRequestAccess.id,
    description: "Deleted a request access",
    isArchive: false,
    changes: {
      before: {
        status: requestAccess.status ? requestAccess.status : "pending",
      },
      after: {
        status: "deleted",
      },
    },
  });

  if (!insertedHistory) {
    throw new Error("Failed to log history for request access deletion");
  }

  return deletedRequestAccess;
}

async function batchUpdate({
  payload,
}: {
  payload: BatchUpdatePayload<UpdateRequestAccess>;
}) {
  const { ids, data } = payload;

  if (ids.length === 0) {
    throw new Error("No IDs provided for batch deletion");
  }

  const updatedDatas = await RequestAccessRepository.batchUpdate(ids, data);

  return {
    count: updatedDatas.length,
    updatedIds: updatedDatas.map((d) => d.id),
  };
}

async function batchRemove(ids: string[]) {
  if (ids.length === 0) {
    throw new Error("No IDs provided for batch deletion");
  }

  const deleted = await RequestAccessRepository.batchRemove(ids);

  return {
    count: deleted.length,
    deletedIds: deleted.map((d) => d.id),
  };
}

const RequestAccessService = {
  getAll,
  getById,
  getByEmail,
  create,
  update,
  remove,
  batchRemove,
  batchUpdate,
};

export default RequestAccessService;
