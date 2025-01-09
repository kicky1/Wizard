import { GeoJSON } from "@/types/map";

export const validateGeoJSON = (data: GeoJSON): string | null => {
  if (!data.type || data.type !== 'Feature') {
    return 'Invalid GeoJSON: Must be a Feature type';
  }

  if (!data.geometry?.coordinates) {
    return 'Invalid GeoJSON: Missing coordinates';
  }

  if (!data.properties?.description) {
    return 'Invalid GeoJSON: Missing description in properties';
  }

  return null;
};