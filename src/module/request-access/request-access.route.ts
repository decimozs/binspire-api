import { factory } from "@/src/util/factory";
import RequestAccessController from "./request-access.controller";

const requestAccessRoute = factory
  .createApp()
  .get("/protected/requests-access", ...RequestAccessController.getAllHandler)
  .get(
    "/requests-access/email/:email",
    ...RequestAccessController.getByEmailHandler,
  )
  .get(
    "/protected/requests-access/:id",
    ...RequestAccessController.getByIdHandler,
  )
  .post(
    "/requests-access",
    ...RequestAccessController.createRequestAccessHander,
  )
  .patch(
    "/protected/requests-access/batch",
    ...RequestAccessController.batchUpdateHandler,
  )
  .patch(
    "/protected/requests-access/:id",
    ...RequestAccessController.updateHandler,
  )
  .delete(
    "/protected/requests-access/batch",
    ...RequestAccessController.batchDeleteHandler,
  )
  .delete(
    "/protected/requests-access/:id",
    ...RequestAccessController.deleteHandler,
  );

export default requestAccessRoute;
