// src/hooks/useGeolocation.ts
import { useEffect, useState } from "react";
import type { Coordinates } from "~/types/coordinates";

export const useGeolocation = (initialCoordinates?: Coordinates | null) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(
    initialCoordinates ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch geolocation if no initial coordinates provided
    if (!initialCoordinates) {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }

      const success = (pos: GeolocationPosition) => {
        setCoordinates({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      };

      const error = (err: GeolocationPositionError) => {
        setError(`Geolocation error (${err.code}): ${err.message}`);
      };

      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    }
  }, [initialCoordinates]); // Re-run if initialCoordinates changes

  return {
    coordinates,
    setCoordinates,
    error,
    isUsingInitialCoordinates: !!initialCoordinates,
  };
};
