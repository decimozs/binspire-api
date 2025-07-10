import { factory } from "@/src/util/factory";
import ActivityController from "./activity.controller";

const activityRoute = factory
  .createApp()
  .get("/protected/activity", ...ActivityController.getAllHandler)
  .delete("/protected/activity/batch", ...ActivityController.batchDeleteHandler)
  .get("/protected/activity/user/:id", ...ActivityController.getByUserIdHandler)
  .get("/protected/activity/:id", ...ActivityController.getByIdHandler)
  .post("/protected/activity", ...ActivityController.createHandler)
  .patch("/protected/activity/:id", ...ActivityController.updateHandler)
  .delete("/protected/activity/:id", ...ActivityController.deleteHandler);

export default activityRoute;
