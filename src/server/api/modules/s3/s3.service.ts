import { env } from "~/env";
import {
  S3Client,
  PutObjectCommand,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import type { presignedUrlSchema } from "./s3.schema";
import type { z } from "zod";

export class S3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = this.createS3Client();
  }

  private createS3Client() {
    const config: S3ClientConfig = {
      region: env.AWS_REGION,
      credentials:
        env.NODE_ENV === "development"
          ? {
              accessKeyId: env.AWS_ACCESS_KEY_ID,
              secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            }
          : undefined,
    };

    return new S3Client(config);
  }

  async getUploadFileSignedUrl(input: z.infer<typeof presignedUrlSchema>) {
    const key = `uploads/${uuidv4()}-${input.fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: input.fileType,
    });

    await this.s3.send(command);

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 180 });

    return { key, url: signedUrl };
  }
}
