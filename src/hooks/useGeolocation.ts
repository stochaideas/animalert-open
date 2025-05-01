// src/hooks/useGeolocation.ts
import { useEffect, useState } from "react";
import type { Position } from "~/app/raporteaza-incident/_types/position";

export const useGeolocation = (initialPosition?: Position | null) => {
  const [position, setPosition] = useState<Position | null>(
    initialPosition ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch geolocation if no initial position provided
    if (!initialPosition) {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }

      const success = (pos: GeolocationPosition) => {
        setPosition({
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
  }, [initialPosition]); // Re-run if initialPosition changes

  return {
    position,
    setPosition,
    error,
    isUsingInitialPosition: !!initialPosition,
  };
};
