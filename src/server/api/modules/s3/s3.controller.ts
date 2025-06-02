import { S3Service } from "./s3.service";
import { type z } from "zod";
import { type presignedUrlSchema } from "./s3.schema";

export class S3Controller {
  private s3Service: S3Service;

  constructor() {
    this.s3Service = new S3Service();
  }

  async getUploadFileSignedUrl(input: z.infer<typeof presignedUrlSchema>) {
    return this.s3Service.getUploadFileSignedUrl(input);
  }
}
