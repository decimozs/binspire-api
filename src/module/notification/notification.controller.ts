import NotificationService from "./notification.service";
import { factory } from "@/src/util/factory";
import { successfulResponse } from "@/src/util/response";
import { zValidator } from "@/src/util/validator";
import { IdParamSchema } from "../verification/verification.controller";
import { createNotificationSchema, updateNotificationSchema } from "@/src/db";

const getAllHandler = factory.createHandlers(async (c) => {
  const data = await NotificationService.findAll();
  return successfulResponse(c, "Successfully retrieved notifications", data);
});

const getByIdHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await NotificationService.findById(id);

    return successfulResponse(
      c,
      `Successfully retrieved notification with id: ${id}`,
      data,
    );
  },
);

const getByFCMTokenHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await NotificationService.findByFCMToken(id);

    return successfulResponse(
      c,
      `Successfully retrieved notification with FCM token: ${id}`,
      data,
    );
  },
);

const createHandler = factory.createHandlers(
  zValidator("json", createNotificationSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const data = await NotificationService.insert(payload);

    return successfulResponse(
      c,
      `Successfully created notification with id: ${data.id}`,
      data,
    );
  },
);

const updateHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  zValidator("json", updateNotificationSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const data = await NotificationService.update(id, payload);

    return successfulResponse(
      c,
      `Successfully updated notification with id: ${id}`,
      data,
    );
  },
);

const removeHandler = factory.createHandlers(
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await NotificationService.remove(id);

    return successfulResponse(
      c,
      `Successfully removed notification with id: ${id}`,
      data,
    );
  },
);

const NotificationController = {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  removeHandler,
  getByFCMTokenHandler,
};

export default NotificationController;
