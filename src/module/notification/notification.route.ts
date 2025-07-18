import { factory } from "@/src/util/factory";
import NotificationController from "./notification.controller";

const notificationRoute = factory
  .createApp()
  .get("/notifications", ...NotificationController.getAllHandler)
  .get(
    "/notifications/fcm_token/:id",
    ...NotificationController.getByFCMTokenHandler,
  )
  .get("/notifications/:id", ...NotificationController.getByIdHandler)
  .post("/notifications", ...NotificationController.createHandler)
  .patch("/notifications/:id", ...NotificationController.updateHandler)
  .delete("/notifications/:id", ...NotificationController.removeHandler);

export default notificationRoute;
