import { factory } from "@/src/util/factory";
import HistoryController from "./history.controller";

const historyRoute = factory
  .createApp()
  .get("/protected/history", ...HistoryController.getAllHandler)
  .delete("/protected/history/batch", ...HistoryController.batchRemoveHandler)
  .patch("/protected/history/batch", ...HistoryController.batchUpdateHandler)
  .get("/protected/history/user/:id", ...HistoryController.getByUserIdHandler)
  .get("/protected/history/:id", ...HistoryController.getByIdHandler)
  .post("/protected/history", ...HistoryController.createHandler)
  .patch("/protected/history/:id", ...HistoryController.updateHandler)
  .delete("/protected/history/:id", ...HistoryController.deleteHandler);

export default historyRoute;
