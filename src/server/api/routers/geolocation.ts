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
});
