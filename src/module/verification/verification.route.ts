import { factory } from "@/src/util/factory";
import VerificationController from "./verification.controller";

const verificationRoute = factory
  .createApp()
  .get("/verifications/:token", ...VerificationController.getByTokenHandler);

export default verificationRoute;
