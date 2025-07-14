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

export interface GeoJsonResponse {
  type: string;
  bbox: number[];
  features: GeoJsonFeature[];
  metadata: GeoJsonMetadata;
}

export interface GeoJsonFeature {
  bbox: number[];
  type: string;
  properties: GeoJsonProperties;
  geometry: GeoJsonGeometry;
}

export interface GeoJsonProperties {
  segments: GeoJsonSegment[];
  way_points: number[]; // Keeping this snake_case if matching API spec
  summary: GeoJsonSummary;
}

export interface GeoJsonSegment {
  distance: number;
  duration: number;
  steps: GeoJsonStep[];
}

export interface GeoJsonStep {
  distance: number;
  duration: number;
  type: number;
  instruction: string;
  name: string;
  way_points: number[];
}

export interface GeoJsonSummary {
  distance: number;
  duration: number;
}

export interface GeoJsonGeometry {
  coordinates: number[][];
  type: string;
}

export interface GeoJsonMetadata {
  attribution: string;
  service: string;
  timestamp: number;
  query: GeoJsonQuery;
  engine: GeoJsonEngine;
}

export interface GeoJsonQuery {
  coordinates: number[][];
  profile: string;
  profileName: string;
  format: string;
}

export interface GeoJsonEngine {
  version: string;
  buildDate: string;
  graphDate: string;
  osmDate: string;
  graphVersion?: string;
}

export interface GeoJsonErrorResponse {
  error: GeoJsonError;
  info: GeoJsonErrorInfo;
}

export interface GeoJsonError {
  code: number;
  message: string;
}

export interface GeoJsonErrorInfo {
  engine: GeoJsonEngine;
  timestamp: number;
}
