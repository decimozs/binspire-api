import { NotFoundError } from "@/src/util/error";
import { VerificationRepository } from "./verification.repository";

async function getById(id: string) {
  const verification = await VerificationRepository.findById(id);

  if (!verification) throw new NotFoundError("Verification not found");

  return verification;
}

const VerificationService = {
  getById,
};

export default VerificationService;
