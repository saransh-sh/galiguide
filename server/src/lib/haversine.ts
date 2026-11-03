/**
 * Spatial Geodesy and Haversine Distance Calculations
 */

export const EARTH_RADIUS_KM = 6371.0;

export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (degrees: number): number => (degrees * Math.PI) / 180.0;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2.0) *
      Math.sin(dLon / 2.0);

  const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 1000.0) / 1000.0;
}

export function getBoundingBox(
  lat: number,
  lng: number,
  radiusKm: number
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  const deltaLat = radiusKm / 111.045;
  const radLat = (lat * Math.PI) / 180.0;
  const cosLat = Math.cos(radLat);
  const deltaLng = radiusKm / (111.045 * Math.max(cosLat, 0.00001));

  return {
    minLat: lat - deltaLat,
    maxLat: lat + deltaLat,
    minLng: lng - deltaLng,
    maxLng: lng + deltaLng,
  };
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 0.05) {
    return 'Right here (< 50m)';
  }
  if (distanceKm < 1.0) {
    const meters = Math.round(distanceKm * 1000.0);
    return `${meters} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}
