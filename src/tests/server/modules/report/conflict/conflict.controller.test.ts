import { describe, it, expect, beforeEach, vi } from "vitest";
import { ConflictController } from "~/server/api/modules/report/conflict/conflict.controller";

// Mock the dependencies
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "development",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    ADMIN_EMAIL: "admin@test.com",
    ADMIN_SMS_PHONE_NUMBER: "+40712345678",
    AWS_S3_BUCKET_NAME: "test-bucket",
    AWS_REGION: "us-east-1",
  },
}));

vi.mock("~/server/db");
vi.mock("~/lib/phone", () => ({
  normalizePhoneNumber: vi.fn((phone: string) => phone),
}));

// Mock nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
    })),
  },
}));

// Mock AWS SDK
vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn(() => ({})),
  GetObjectCommand: vi.fn(),
  PutObjectCommand: vi.fn(),
  DeleteObjectCommand: vi.fn(),
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn().mockResolvedValue("https://signed-url.com"),
}));

vi.mock("@aws-sdk/client-sns", () => ({
  SNSClient: vi.fn(() => ({})),
  PublishCommand: vi.fn(),
}));

describe("ConflictController", () => {
  let controller: ConflictController;

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new ConflictController();
  });

  it("should instantiate with ConflictService", () => {
    expect(controller).toBeDefined();
  });
});
