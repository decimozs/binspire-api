import type { Session } from "../db";
import type { Database } from "./db";

export interface AppBindings {
  Variables: {
    session: Session;
    db: Database;
  };
}
