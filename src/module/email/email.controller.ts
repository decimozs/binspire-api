import { factory } from "@/src/util/factory";
import { zValidator } from "@/src/util/validator";
import EmailService, { emailSchema } from "./email.service";
import { successfulResponse } from "@/src/util/response";

const sendEmailHandler = factory.createHandlers(
  zValidator("json", emailSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await EmailService.sendEmail(payload);

    return successfulResponse(c, "Email sent.", data);
  },
);

const EmailController = {
  sendEmailHandler,
};

export default EmailController;
