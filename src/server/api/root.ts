import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { incidentRouter } from "./modules/report/incident/incident.router";
import { presenceRouter } from "./modules/report/presence/presence.router";
import { conflictRouter } from "./modules/report/conflict/conflict.router";
import { contactRouter } from "./modules/contact/contact.router";
import { geolocationRouter } from "./modules/geolocation/geolocation.router";
import { s3Router } from "./modules/s3/s3.router";
import { complaintRouter } from "./modules/complaint/complaint.router";
import { feedbackRouter } from "./modules/feedback/feedback.router";
import { reportRouter } from "./modules/report/report.router";
import { complaintTemplateRouter } from "./modules/complaint-template/complaintTemplate.router";
import { reportRouter } from "./modules/report/report.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  report: reportRouter,
  complaint: complaintRouter,
  incident: incidentRouter,
  presence: presenceRouter,
  conflict: conflictRouter,
  contact: contactRouter,
  complaintTemplate: complaintTemplateRouter,
  feedback: feedbackRouter,
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
