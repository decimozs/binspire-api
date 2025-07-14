import { factory } from "@/src/util/factory";
import DirectionService, { directionParamsSchema } from "./direction.service";
import { zValidator } from "@/src/util/validator";
import { successfulResponse } from "@/src/util/response";

const getHandler = factory.createHandlers(
  zValidator("json", directionParamsSchema),
  async (c) => {
    const payload = c.req.valid("json");

    console.log("Fetching directions with payload:", payload);

    const data = await DirectionService.getDirections(payload);

    console.log("Directions fetched successfully:", data);
    return successfulResponse(c, "Directions fetched successfully", data);
  },
);

const DirectionController = {
  getHandler,
};

export default DirectionController;
