import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { S3Controller } from "./s3.controller";
import { presignedUrlSchema } from "./s3.schema";

const s3Controller = new S3Controller();

export const s3Router = createTRPCRouter({
  getPresignedUrl: publicProcedure
    .input(presignedUrlSchema)
    .mutation(async ({ input }) => {
      return s3Controller.getPresignedUrl(input);
    }),
});
