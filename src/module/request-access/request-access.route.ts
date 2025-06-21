import { factory } from "@/src/util/factory";
import RequestAccessController from "./request-access.controller";

const requestAccessRoute = factory
  .createApp()
  .post(
    "/requests-access",
    ...RequestAccessController.createRequestAccessHander,
  );

export default requestAccessRoute;
