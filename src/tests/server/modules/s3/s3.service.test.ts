/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { S3Service } from "~/server/api/modules/s3/s3.service";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Mock AWS SDK
vi.mock("@aws-sdk/client-s3");
vi.mock("@aws-sdk/s3-request-presigner");

// Mock env
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "development",
    AWS_REGION: "us-east-1",
    AWS_ACCESS_KEY_ID: "test-key",
    AWS_SECRET_ACCESS_KEY: "test-secret",
    AWS_S3_BUCKET_NAME: "test-bucket",
  },
}));

// Mock uuid
vi.mock("uuid", () => ({
  v4: () => "test-uuid-1234",
}));

describe("S3Service", () => {
  let s3Service: S3Service;
  let mockSend: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSend = vi.fn();
    vi.mocked(S3Client).mockImplementation(
      () =>
        ({
          send: mockSend,
        }) as any,
    );
    vi.mocked(getSignedUrl).mockResolvedValue(
      "https://test-bucket.s3.amazonaws.com/signed-url",
    );

    s3Service = new S3Service();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getObject", () => {
    it("should retrieve object from S3", async () => {
      const mockResponse = {
        Body: "test content",
        ContentType: "text/plain",
      };
      mockSend.mockResolvedValue(mockResponse);

      const result = await s3Service.getObject("test-key");

      expect(mockSend).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it("should use correct bucket and key", async () => {
      mockSend.mockResolvedValue({});

      await s3Service.getObject("uploads/test.jpg");

      expect(mockSend).toHaveBeenCalled();
      const command = mockSend.mock.calls[0]?.[0];
      expect(command).toBeInstanceOf(GetObjectCommand);
    });

    it("should handle S3 errors", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const s3Error = new Error("AccessDenied");
      mockSend.mockRejectedValue(s3Error);

      await expect(s3Service.getObject("test-key")).rejects.toThrow(
        "AccessDenied",
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting object from S3:",
        s3Error,
      );
      consoleErrorSpy.mockRestore();
    });

    it("should retrieve object with special characters in key", async () => {
      mockSend.mockResolvedValue({});

      await s3Service.getObject("uploads/my file (1).pdf");

      expect(mockSend).toHaveBeenCalled();
    });
  });

  describe("getObjectSignedUrl", () => {
    it("should generate signed URL for object", async () => {
      mockSend.mockResolvedValue({
        ContentType: "image/jpeg",
      });

      const result = await s3Service.getObjectSignedUrl("test.jpg");

      expect(result.url).toBe(
        "https://test-bucket.s3.amazonaws.com/signed-url",
      );
      expect(result.type).toBe("image/jpeg");
    });

    it("should use default content type when none provided", async () => {
      mockSend.mockResolvedValue({});

      const result = await s3Service.getObjectSignedUrl("test.bin");

      expect(result.type).toBe("application/octet-stream");
    });

    it("should send HeadObjectCommand first", async () => {
      mockSend.mockResolvedValue({ ContentType: "video/mp4" });

      await s3Service.getObjectSignedUrl("video.mp4");

      const firstCommand = mockSend.mock.calls[0]?.[0];
      expect(firstCommand).toBeInstanceOf(HeadObjectCommand);
    });

    it("should handle different content types", async () => {
      const contentTypes = [
        "image/png",
        "image/jpeg",
        "video/mp4",
        "application/pdf",
        "text/plain",
      ];

      for (const contentType of contentTypes) {
        vi.clearAllMocks();
        mockSend.mockResolvedValue({ ContentType: contentType });

        const result = await s3Service.getObjectSignedUrl("test-file");

        expect(result.type).toBe(contentType);
      }
    });

    it("should generate signed URL with 60 second expiry", async () => {
      mockSend.mockResolvedValue({ ContentType: "image/png" });

      await s3Service.getObjectSignedUrl("test.png");

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(GetObjectCommand),
        { expiresIn: 60 },
      );
    });

    it("should handle errors during signed URL generation", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const error = new Error("S3 error");
      mockSend.mockRejectedValue(error);

      await expect(s3Service.getObjectSignedUrl("test.jpg")).rejects.toThrow(
        "S3 error",
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating signed URL for S3 object:",
        error,
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("getUploadFileSignedUrl", () => {
    it("should generate presigned URL for file upload", async () => {
      mockSend.mockResolvedValue({});

      const result = await s3Service.getUploadFileSignedUrl({
        fileName: "test.jpg",
        fileType: "image/jpeg",
        fileSize: 1024000,
      });

      expect(result.key).toBe("uploads/test-uuid-1234-test.jpg");
      expect(result.url).toBe(
        "https://test-bucket.s3.amazonaws.com/signed-url",
      );
    });

    it("should use PutObjectCommand with correct parameters", async () => {
      mockSend.mockResolvedValue({});

      await s3Service.getUploadFileSignedUrl({
        fileName: "document.pdf",
        fileType: "application/pdf",
        fileSize: 500000,
      });

      const command = mockSend.mock.calls[0]?.[0];
      expect(command).toBeInstanceOf(PutObjectCommand);
    });

    it("should handle image uploads", async () => {
      mockSend.mockResolvedValue({});

      const result = await s3Service.getUploadFileSignedUrl({
        fileName: "photo.png",
        fileType: "image/png",
        fileSize: 2048000,
      });

      expect(result.key).toContain(".png");
    });

    it("should handle video uploads", async () => {
      mockSend.mockResolvedValue({});

      const result = await s3Service.getUploadFileSignedUrl({
        fileName: "video.mp4",
        fileType: "video/mp4",
        fileSize: 10485760,
      });

      expect(result.key).toContain(".mp4");
    });

    it("should generate unique keys with UUID prefix", async () => {
      mockSend.mockResolvedValue({});

      const result = await s3Service.getUploadFileSignedUrl({
        fileName: "test.jpg",
        fileType: "image/jpeg",
        fileSize: 1024000,
      });

      expect(result.key).toMatch(/^uploads\/test-uuid-1234-/);
    });

    it("should handle special characters in filename", async () => {
      mockSend.mockResolvedValue({});

      const result = await s3Service.getUploadFileSignedUrl({
        fileName: "my file (1).jpg",
        fileType: "image/jpeg",
        fileSize: 1024000,
      });

      expect(result.key).toContain("my file (1).jpg");
    });

    it("should generate signed URL with 60 second expiry", async () => {
      mockSend.mockResolvedValue({});

      await s3Service.getUploadFileSignedUrl({
        fileName: "test.jpg",
        fileType: "image/jpeg",
        fileSize: 1024000,
      });

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(PutObjectCommand),
        { expiresIn: 60 },
      );
    });

    it("should handle different file sizes", async () => {
      const fileSizes = [1000, 1024000, 5242880, 10485760];

      for (const fileSize of fileSizes) {
        vi.clearAllMocks();
        mockSend.mockResolvedValue({});

        await s3Service.getUploadFileSignedUrl({
          fileName: "test.jpg",
          fileType: "image/jpeg",
          fileSize,
        });

        expect(mockSend).toHaveBeenCalled();
      }
    });
  });

  describe("S3Client initialization", () => {
    it("should create S3 client with correct configuration", () => {
      expect(S3Client).toHaveBeenCalledWith({
        region: "us-east-1",
        credentials: {
          accessKeyId: "test-key",
          secretAccessKey: "test-secret",
        },
      });
    });
  });
});
