import type { Session } from "../db";
import type { Database } from "./db";

export interface AppBindings {
  Variables: {
    session: Session;
    db: Database;
    orgId: string;
  };
}

export interface BatchUpdatePayload<T> {
  ids: string[];
  data: T;
}
