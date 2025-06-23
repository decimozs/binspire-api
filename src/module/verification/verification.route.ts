import { factory } from "@/src/util/factory";
import VerificationController from "./verification.controller";

const verificationRoute = factory
  .createApp()
  .get("/verifications/:id", ...VerificationController.getByIdHandler);

export default verificationRoute;
