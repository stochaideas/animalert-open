"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { env } from "~/env";

export function GoogleMap() {
  const [position, setPosition] = useState<
    google.maps.LatLngLiteral | undefined
  >();

  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string;

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setPosition({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  const onClickMap = (event: MapMouseEvent) => {
    const lat = event.detail.latLng?.lat;
    const lng = event.detail.latLng?.lng;
    if (lat && lng && position) {
      setPosition({ lat, lng });
    }
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ width: "100%", height: "100vh" }}>
        {position ? (
          <Map
            onClick={onClickMap}
            defaultCenter={position}
            defaultZoom={13}
            mapId={mapId}
          >
            <AdvancedMarker position={position} />
          </Map>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-xl font-semibold">Loading...</p>
          </div>
        )}
      </div>
    </APIProvider>
  );
}
