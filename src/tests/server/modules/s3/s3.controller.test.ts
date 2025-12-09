/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { S3Controller } from "~/server/api/modules/s3/s3.controller";
import { S3Service } from "~/server/api/modules/s3/s3.service";

// Mock dependencies
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "development",
    AWS_S3_BUCKET_NAME: "test-bucket",
    AWS_REGION: "us-east-1",
  },
}));

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn(() => ({})),
  GetObjectCommand: vi.fn(),
  PutObjectCommand: vi.fn(),
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn().mockResolvedValue("https://signed-url.com"),
}));

describe("S3Controller", () => {
  let controller: S3Controller;
  let mockService: S3Service;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new S3Controller();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockService = (controller as any).s3Service as S3Service;
  });

  it("should instantiate with S3Service", () => {
    expect(controller).toBeDefined();
    expect(mockService).toBeInstanceOf(S3Service);
  });

  describe("getObject", () => {
    it("should call s3Service.getObject", async () => {
      const key = "test-key";
      const mockOutput = {
        $metadata: {},
        Body: undefined,
      };

      const spy = vi
        .spyOn(mockService, "getObject")
        .mockResolvedValue(mockOutput);

      await controller.getObject(key);

      expect(spy).toHaveBeenCalledWith(key);
    });
  });

  describe("getUploadFileSignedUrl", () => {
    it("should call s3Service.getUploadFileSignedUrl", async () => {
      const input = {
        fileType: "image/jpeg",
        fileName: "test.jpg",
        fileSize: 1024,
      };

      const spy = vi
        .spyOn(mockService, "getUploadFileSignedUrl")
        .mockResolvedValue({
          key: "uploads/test.jpg",
          url: "https://signed-url.com",
        });

      await controller.getUploadFileSignedUrl(input);

      expect(spy).toHaveBeenCalledWith(input);
    });
  });
});
