import {
  AdvancedMarker,
  APIProvider,
  Map,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { env } from "~/env";

type Position = {
  lat: number;
  lng: number;
};

export function GoogleMap({
  position,
  setPosition,
}: {
  position: Position | null;
  setPosition: (position: google.maps.LatLngLiteral) => void;
}) {
  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

  const onClickMap = (event: MapMouseEvent) => {
    const lat = event.detail.latLng?.lat;
    const lng = event.detail.latLng?.lng;
    if (lat && lng && position) {
      setPosition({ lat, lng });
    }
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ width: "100%", height: "100%" }}>
        {position ? (
          <Map
            onClick={onClickMap}
            defaultCenter={position}
            defaultZoom={13}
            mapId={mapId}
            streetViewControl={false}
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
