import env from "@/src/config/env";
import type { GeoJsonError, GeoJsonResponse } from "@/src/lib/types";
import z from "zod/v4";

export const directionParamsSchema = z.object({
  profile: z.string().optional(),
  start: z.string(),
  end: z.string(),
});

type DirectionParams = z.infer<typeof directionParamsSchema>;

async function getDirections({
  start,
  end,
  profile = "driving-car",
}: DirectionParams): Promise<GeoJsonResponse | GeoJsonError> {
  if (!env?.ORS_API_KEY) {
    throw new Error("ORS_API_KEY is not defined in environment variables");
  }

  const [startLng, startLat] = start.split(",").map(Number);
  const [endLng, endLat] = end.split(",").map(Number);

  const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: env.ORS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [
        [startLng, startLat],
        [endLng, endLat],
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Error fetching directions: ${response.statusText}`);
  }

  return response.json() as Promise<GeoJsonResponse | GeoJsonError>;
}

const DirectionService = {
  getDirections,
};

export default DirectionService;
