import { env } from "~/env";
import type { Coordinates } from "~/types/coordinates";
import { requireServerEnv } from "~/server/utils/env";

export class GeolocationService {
  private getApiKey() {
    return requireServerEnv(
      "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
      env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    );
  }

  async mapsGeocode(coordinates: Coordinates) {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("latlng", `${coordinates.lat},${coordinates.lng}`);
    url.searchParams.set("key", this.getApiKey());

    const res = await fetch(url.toString());

    const data = (await res.json()) as {
      results: Array<{
        formatted_address: string;
        geometry: {
          location: {
            lat: number;
            lng: number;
          };
        };
      }>;
      status: string;
      error_message?: string;
    };

    if (data.status !== "OK")
      throw new Error(data.error_message ?? "No address");

    const firstResult = data.results[0];

    if (!firstResult) {
      throw new Error("No address found for the given coordinates.");
    }

    const result = {
      formattedAddress: firstResult.formatted_address,
      geometry: {
        location: {
          lat: firstResult.geometry.location.lat,
          lng: firstResult.geometry.location.lng,
        },
      },
    };

    return result;
  }

  async placeAutocomplete(input: { address: string }) {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
    );
    url.searchParams.set("input", input.address);
    url.searchParams.set("key", this.getApiKey());
    url.searchParams.set("language", "ro");
    url.searchParams.set("components", "country:ro");
    url.searchParams.set("types", "mapsGeocode");

    const res = await fetch(url.toString());

    const data = (await res.json()) as {
      predictions: Array<{
        description: string;
        place_id: string;
      }>;
      status: string;
      error_message?: string;
    };

    if (data.status !== "OK")
      throw new Error(data.error_message ?? "No predictions");

    return data.predictions.map(
      (p: { description: string; place_id: string }) => ({
        description: p.description,
        placeId: p.place_id,
      }),
    );
  }

  async placeDetails(input: { placeId: string }) {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/details/json",
    );
    url.searchParams.set("place_id", input.placeId);
    url.searchParams.set("fields", "geometry,formatted_address");
    url.searchParams.set("key", this.getApiKey());
    url.searchParams.set("language", "ro");

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch place details");
    const data = (await res.json()) as {
      result: {
        formatted_address: string;
        geometry: {
          location: {
            lat: number;
            lng: number;
          };
        };
      };
      status: string;
      error_message?: string;
    };

    if (data.status !== "OK")
      throw new Error(data.error_message ?? "No details");

    return {
      formatted_address: data.result.formatted_address,
      location: {
        lat: data.result.geometry.location.lat,
        lng: data.result.geometry.location.lng,
      },
    };
  }
}
