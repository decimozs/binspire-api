import { OrgRepository } from "./org.repository";

async function getOrgById(id: string) {
  return await OrgRepository.findById(id);
}

const OrgService = {
  getOrgById,
};

export default OrgService;
