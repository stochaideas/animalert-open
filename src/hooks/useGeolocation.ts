// src/hooks/useGeolocation.ts
import { useEffect, useState } from "react";

type Position = {
  lat: number;
  lng: number;
};

export const useGeolocation = () => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  return { position, setPosition, error };
};
