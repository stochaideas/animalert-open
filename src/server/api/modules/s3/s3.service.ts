import { env } from "~/env";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
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

  /**
   * Retrieves an object from the configured AWS S3 bucket using the specified key.
   *
   * @param key - The key (path/filename) of the object to retrieve from the S3 bucket.
   * @returns A promise that resolves to the response from the S3 GetObjectCommand.
   * @throws Will throw an error if the object cannot be retrieved from S3.
   */
  async getObject(key: string) {
    const command = new GetObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    try {
      const response = await this.s3.send(command);
      return response;
    } catch (error) {
      console.error("Error getting object from S3:", error);
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

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: input.fileType,
    });

    await this.s3.send(command);

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 60 });

    return { key, url: signedUrl };
  }

  /**
   * Uploads a PDF buffer to the `animalert-pdfs` bucket.
   *
   * @param buffer - The PDF content as a Buffer
   * @param fileName - The desired S3 key 
   * @returns The uploaded key
   */
  async uploadPdfBuffer(buffer: Buffer, fileName: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_PDF_BUCKET_NAME, 
      Key: fileName,
      Body: buffer,
      ContentType: "application/pdf",
      ACL: "private", 
    });

    try {
      await this.s3.send(command);
      return fileName;
    } catch (error) {
      console.error("Failed to upload PDF to S3:", error);
      throw error;
    }
  }
}
