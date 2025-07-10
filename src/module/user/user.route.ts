import { factory } from "@/src/util/factory";
import { UserController } from "./user.controller";

const userRoute = factory
  .createApp()
  .get("/protected/users", ...UserController.getAllHandler)
  .delete("/protected/users/batch", ...UserController.batchDeleteHandler)
  .patch("/protected/users/batch", ...UserController.batchUpdateHandler)
  .get("/protected/users/:id", ...UserController.getByIdHandler)
  .patch("/protected/users/:id", ...UserController.updateHandler)
  .delete("/protected/users/:id", ...UserController.deleteHandler);

export default userRoute;
