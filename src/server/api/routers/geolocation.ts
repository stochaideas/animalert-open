import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

const googleMapsApiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export const geolocationRouter = createTRPCRouter({
  getAddress: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${input.lat},${input.lng}&key=${googleMapsApiKey}`,
      );

      const data = (await response.json()) as {
        results: Array<{
          formatted_address: string;
          geometry: {
            location: {
              lat: number;
              lng: number;
            };
          };
        }>;
      };

      console.log(data.results[0]);

      const firstResult = data.results[0];

      if (!firstResult) {
        throw new Error("No results found for the given coordinates.");
      }

      const result = {
        formatted_address: firstResult.formatted_address,
        geometry: {
          location: {
            lat: firstResult.geometry.location.lat,
            lng: firstResult.geometry.location.lng,
          },
        },
      };

      return result;
    }),
  autocomplete: publicProcedure
    .input(z.object({ input: z.string().min(2) }))
    .query(async ({ input }) => {
      const url = new URL(
        "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      );
      url.searchParams.set("input", input.input);
      url.searchParams.set("key", googleMapsApiKey);
      url.searchParams.set("language", "ro");
      url.searchParams.set("components", "country:ro");
      url.searchParams.set("types", "geocode");

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch predictions");
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
          place_id: p.place_id,
        }),
      );
    }),

  placeDetails: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(async ({ input }) => {
      const url = new URL(
        "https://maps.googleapis.com/maps/api/place/details/json",
      );
      url.searchParams.set("place_id", input.placeId);
      url.searchParams.set("fields", "geometry,formatted_address");
      url.searchParams.set("key", googleMapsApiKey);
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
    }),
});
