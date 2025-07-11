import { factory } from "@/src/util/factory";
import TaskController from "./task.controller";

const taskRoute = factory
  .createApp()
  .get("/protected/tasks", ...TaskController.getAllHandler)
  .get("/protected/tasks/user_id/:id", ...TaskController.getByUserIdHandler)
  .get("/protected/tasks/:id", ...TaskController.getByIdHandler)
  .post("/protected/tasks", ...TaskController.createHandler)
  .patch("/protected/tasks/:id", ...TaskController.updateHandler)
  .delete("/protected/tasks/:id", ...TaskController.deleteHandler);

export default taskRoute;
