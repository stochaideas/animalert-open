import { describe, it, expect, vi, beforeEach } from "vitest";
import { S3Service } from "~/server/api/modules/s3/s3.service";

// Mock env as production
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "production",
    AWS_S3_BUCKET_NAME: "test-bucket",
    AWS_REGION: "us-east-1",
  },
}));

// Mock AWS SDK
vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn(() => ({
    send: vi.fn().mockResolvedValue({
      ContentType: "image/jpeg",
    }),
  })),
  GetObjectCommand: vi.fn(),
  PutObjectCommand: vi.fn(),
  DeleteObjectCommand: vi.fn(),
  HeadObjectCommand: vi.fn(),
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn().mockResolvedValue("https://signed-url.com"),
}));

describe("S3Service - Production", () => {
  let s3Service: S3Service;

  beforeEach(() => {
    vi.clearAllMocks();
    s3Service = new S3Service();
  });

  it("should create S3Client without explicit credentials in production", async () => {
    expect(s3Service).toBeDefined();

    // Import S3Client to check it was called correctly
    const { S3Client } = await import("@aws-sdk/client-s3");

    // In production, credentials should be undefined (uses IAM role)
    expect(S3Client).toHaveBeenCalledWith({
      region: "us-east-1",
      credentials: undefined,
    });
  });
  it("should use production configuration", async () => {
    const result = await s3Service.getObjectSignedUrl("test-key.jpg");

    expect(result).toBeDefined();
    expect(result.url).toBe("https://signed-url.com");
  });
});
