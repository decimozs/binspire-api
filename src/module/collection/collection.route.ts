import { factory } from "@/src/util/factory";
import CollectionController from "./collection.controller";

const collectionRoute = factory
  .createApp()
  .get("/protected/collections", ...CollectionController.getAllHandler)
  .delete(
    "/protected/collections/batch",
    ...CollectionController.batchDeleteHandler,
  )
  .patch(
    "/protected/collections/batch",
    ...CollectionController.batchUpdateHandler,
  )
  .get("/protected/collections/:id", ...CollectionController.getByIdHandler)
  .post("/protected/collections", ...CollectionController.createHandler)
  .patch("/protected/collections/:id", ...CollectionController.updateHandler)
  .delete("/protected/collections/:id", ...CollectionController.deleteHandler);

export default collectionRoute;
