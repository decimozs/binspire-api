import { UnauthorizedError } from "@/src/util/error";
import { factory } from "@/src/util/factory";
import { OrgRepository } from "./org.repository";

const orgMiddleware = factory.createMiddleware(async (c, next) => {
  const orgId = c.req.header("x-org-id");

  if (!orgId) throw new UnauthorizedError("Missing x-org-id header");

  const org = await OrgRepository.findById(orgId);

  if (!org) throw new UnauthorizedError("Org not found");

  c.set("orgId", orgId);

  await next();
});

export default orgMiddleware;
