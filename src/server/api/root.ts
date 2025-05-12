import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { geolocationRouter } from "./modules/geolocation/geolocation.router";
import { incidentRouter } from "./modules/incident/incident.router";
import { s3Router } from "./modules/s3/s3.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  incident: incidentRouter,
  geolocation: geolocationRouter,
  s3: s3Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
