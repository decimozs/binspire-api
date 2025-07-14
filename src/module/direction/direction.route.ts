import { factory } from "@/src/util/factory";
import DirectionController from "./direction.controller";

const directionRoute = factory
  .createApp()
  .post("/protected/directions", ...DirectionController.getHandler);

export default directionRoute;
