import { UAT_GEOFENCES, type UatGeofence } from "~/constants/uat-contacts";

const EARTH_RADIUS_KM = 6371;

export type GeofenceMatch = {
  geofence: UatGeofence;
  distanceKm: number;
  withinFence: boolean;
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const haversineDistanceKm = (
  pointA: { lat: number; lng: number },
  pointB: { lat: number; lng: number },
) => {
  const dLat = toRadians(pointB.lat - pointA.lat);
  const dLng = toRadians(pointB.lng - pointA.lng);

  const lat1 = toRadians(pointA.lat);
  const lat2 = toRadians(pointB.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
};

export class UatGeofenceService {
  private geofences: UatGeofence[];

  constructor(geofences: UatGeofence[] = UAT_GEOFENCES) {
    this.geofences = geofences;
  }

  resolve(lat: number, lng: number): GeofenceMatch | null {
    if (!this.geofences.length) {
      return null;
    }

    let bestMatch: GeofenceMatch | null = null;

    for (const geofence of this.geofences) {
      const distanceKm = haversineDistanceKm(geofence.centroid, { lat, lng });
      const withinFence = distanceKm <= geofence.radiusKm;

      if (!bestMatch || distanceKm < bestMatch.distanceKm) {
        bestMatch = { geofence, distanceKm, withinFence };

        if (withinFence) {
          break;
        }
      }
    }

    return bestMatch;
  }
}
