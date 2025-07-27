import { factory } from "@/src/util/factory";
import OrgController from "./org.controller";

const orgRoute = factory
  .createApp()
  .get("/protected/orgs/:id", ...OrgController.getByIdHandler);

export default orgRoute;
