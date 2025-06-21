import { factory } from "@/src/util/factory";
import { AuthController } from "./auth.controller";

const authRoute = factory
  .createApp()
  .get("/auth/session", ...AuthController.checkSessionHandler)
  .get("/auth/logout", ...AuthController.logoutHandler)
  .post("/auth/login", ...AuthController.loginHandler)
  .post("/auth/sign-up", ...AuthController.signUpHandler);

export default authRoute;
