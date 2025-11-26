import { env } from "~/env";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  type S3ClientConfig,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import type { presignedUrlSchema } from "./s3.schema";
import type { z } from "zod";
import { requireServerEnv } from "~/server/utils/env";

export class S3Service {
  private s3: S3Client | null = null;

  private getClient() {
    if (this.s3) {
      return this.s3;
    }

  // private createS3Client() {
  //   const isDev = env.NODE_ENV === "development";
    const region = requireServerEnv("AWS_REGION", env.AWS_REGION);

    const config: S3ClientConfig = {
    //   region: env.AWS_REGION,
    //   forcePathStyle: isDev, // critical for LocalStack
    //   // endpoint: isDev ? env.AWS_ENDPOINT_URL_S3 : undefined,
    //   credentials:
    //     env.NODE_ENV === "development"
    //       ? {
    //           accessKeyId: env.AWS_ACCESS_KEY_ID,
    //           secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    //         }
    //       : undefined,
    // };

    // return new S3Client(config);
      region,
    };

    if (env.NODE_ENV === "development") {
      const accessKeyId = requireServerEnv(
        "AWS_ACCESS_KEY_ID",
        env.AWS_ACCESS_KEY_ID,
      );
      const secretAccessKey = requireServerEnv(
        "AWS_SECRET_ACCESS_KEY",
        env.AWS_SECRET_ACCESS_KEY,
      );

      config.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    this.s3 = new S3Client(config);
    return this.s3;
  }

  private getBucketName() {
    return requireServerEnv("AWS_S3_BUCKET_NAME", env.AWS_S3_BUCKET_NAME);
  }

  /**
   * Retrieves an object from the configured AWS S3 bucket using the specified key.
   *
   * @param key - The key (path/filename) of the object to retrieve from the S3 bucket.
   * @returns A promise that resolves to the response from the S3 GetObjectCommand.
   * @throws Will throw an error if the object cannot be retrieved from S3.
   */
  async getObject(key: string) {
    const bucket = this.getBucketName();
    const client = this.getClient();

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const response = await client.send(command);
      return response;
    } catch (error) {
      console.error("Error getting object from S3:", error);
      throw error;
    }
  }

  /**
   * Generates a pre-signed URL for accessing an object stored in an AWS S3 bucket.
   *
   * @param key - The key (path/filename) of the S3 object for which to generate the signed URL.
   * @returns A promise that resolves to the signed URL string, valid for 60 seconds.
   * @throws Will throw an error if the signed URL cannot be generated.
   */
  async getObjectSignedUrl(key: string) {
    const bucket = this.getBucketName();
    const client = this.getClient();

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    // Get file type
    const headCommand = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const headResponse = await client.send(headCommand);
      const contentType = headResponse.ContentType;

      const signedUrl = await getSignedUrl(client, command, { expiresIn: 60 });
      return {
        url: signedUrl,
        type: contentType ?? "application/octet-stream", // Default to binary if no type is found
      };
    } catch (error) {
      console.error("Error generating signed URL for S3 object:", error);
      throw error;
    }
  }

  /**
   * Generates a presigned URL for uploading a file to S3.
   *
   * @param input - The validated input object containing fileName and fileType, conforming to `presignedUrlSchema`.
   * @returns An object containing the generated S3 key and the presigned upload URL.
   *
   * @remarks
   * - The file will be uploaded to the `uploads/` directory with a unique UUID prefix.
   * - The presigned URL is valid for 180 seconds.
   * - The method uses AWS S3's `PutObjectCommand` to create the upload request.
   *
   * @throws Will throw an error if the S3 command fails.
   */
  async getUploadFileSignedUrl(input: z.infer<typeof presignedUrlSchema>) {
    const key = `uploads/${uuidv4()}-${input.fileName}`;

    const bucket = this.getBucketName();
    const client = this.getClient();

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: input.fileType,
    });

    // await client.send(command);

    // Generate the signed URL - valid for 3 minutes; adjust as needed; max is 7 days (604800 seconds)
    // beware of security implications of long-lived URLs; shorter is generally better
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 180 });

      // In dev, getSignedUrl uses the internal Docker host "localstack",
      // which the browser cannot resolve. Replace it with localhost.
      // const url =
      //     env.NODE_ENV === "development"
      //         ? signedUrl.replace(
      //             env.AWS_ENDPOINT_URL_S3,
      //             env.AWS_S3_PUBLIC_ENDPOINT ?? "http://localhost:4566",
      //         )
      //         : signedUrl;

      return { key, url: signedUrl };
  }
}
