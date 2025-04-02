"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import { env } from "~/env";

export function GoogleMap() {
  const [position, setPosition] = useState<google.maps.LatLngLiteral>({
    lat: 53.54992,
    lng: 10.00678,
  });

  // const position = { lat: 53.54992, lng: 10.00678 };
  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string;

  const onClickMap = (event: MapMouseEvent) => {
    const lat = event.detail.latLng?.lat;
    const lng = event.detail.latLng?.lng;
    if (lat && lng) {
      setPosition({ lat, lng });
    }
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ width: "100%", height: "100vh" }}>
        <Map
          onClick={onClickMap}
          defaultCenter={position}
          defaultZoom={13}
          mapId={mapId}
        >
          <AdvancedMarker position={position} />
        </Map>
      </div>
    </APIProvider>
  );
}
