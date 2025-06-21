import { createFactory } from "hono/factory";
import type { AppBindings } from "../lib/types";

export const factory = createFactory<AppBindings>();
