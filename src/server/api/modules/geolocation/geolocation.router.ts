import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { GeolocationController } from "./geolocation.controller";

const geolocationController = new GeolocationController();

export const geolocationRouter = createTRPCRouter({
  mapsGeocode: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return geolocationController.mapsGeocode(input);
    }),
  placeAutocomplete: publicProcedure
    .input(z.object({ address: z.string().min(2) }))
    .query(async ({ input }) => {
      return geolocationController.placeAutocomplete(input);
    }),
  placeDetails: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(async ({ input }) => {
      return geolocationController.placeDetails(input);
    }),
});
