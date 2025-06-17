import { pgEnum } from "drizzle-orm/pg-core";
import { permissionValues, roleValues, statusValues } from "../util/constant";

export const roleEnum = pgEnum("role", roleValues);
export const permissionEnum = pgEnum("permission", permissionValues);
export const statusEnum = pgEnum("status", statusValues);
