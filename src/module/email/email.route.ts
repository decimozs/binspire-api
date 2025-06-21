import { factory } from "@/src/util/factory";
import EmailController from "./email.controller";

const emailRoute = factory
  .createApp()
  .post("/emails", ...EmailController.sendEmailHandler);

export default emailRoute;
