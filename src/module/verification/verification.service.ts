import { NotFoundError } from "@/src/util/error";
import { VerificationRepository } from "./verification.repository";
import { createHash } from "node:crypto";

async function getById(id: string) {
  const verification = await VerificationRepository.findById(id);

  if (!verification) throw new NotFoundError("Verification not found");

  return verification;
}

async function getByToken(token: string) {
  const hashedToken = createHash("sha256").update(token).digest("hex");
  const verification = await VerificationRepository.findByToken(hashedToken);

  if (!verification) throw new NotFoundError("Verification token not found");

  return verification;
}

const VerificationService = {
  getById,
  getByToken,
};

export default VerificationService;
