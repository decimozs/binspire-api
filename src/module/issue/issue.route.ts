import { factory } from "@/src/util/factory";
import IssueController from "./issue.controller";

const issueRoute = factory
  .createApp()
  .get("/protected/issues", ...IssueController.getAllHandler)
  .delete("/protected/issues/batch", ...IssueController.batchDeleteHandler)
  .patch("/protected/issues/batch", ...IssueController.batchUpdateHandler)
  .get("/protected/issues/:id", ...IssueController.getByIdHandler)
  .post("/protected/issues", ...IssueController.createHandler)
  .patch("/protected/issues/:id", ...IssueController.updateHandler)
  .delete("/protected/issues/:id", ...IssueController.deleteHandler);

export default issueRoute;
