import { factory } from "@/src/util/factory";
import TrashbinController from "./trashbin.controller";

const trashbinRoute = factory
  .createApp()
  .get("/protected/trashbins", ...TrashbinController.getAllHandler)
  .delete(
    "/protected/trashbins/batch",
    ...TrashbinController.batchDeleteHandler,
  )
  .patch("/protected/trashbins/batch", ...TrashbinController.batchUpdateHandler)
  .get("/protected/trashbins/:id", ...TrashbinController.getByIdHandler)
  .post("/protected/trashbins", ...TrashbinController.createHandler)
  .patch("/protected/trashbins/:id", ...TrashbinController.updateHandler)
  .delete("/protected/trashbins/:id", ...TrashbinController.deleteHandler);

export default trashbinRoute;
