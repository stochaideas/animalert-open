import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const s3Router = createTRPCRouter({
  getPresignedUrl: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        incidentId: z.string(),
        fileName: z.string(),
        fileType: z.string().regex(/^image\/(png|jpeg|jpg|svg\+xml|gif|webp)$/),
      }),
    )
    .mutation(async ({ input }) => {
      const key = `uploads/users/${input.userId}/incidents/${input.incidentId}/${Date.now()}-${input.fileName}`;

      const command = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: key,
        ContentType: input.fileType,
      });

      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

      const publicUrl = `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
      return { url: signedUrl, publicUrl }; // Update return type
    }),
});
