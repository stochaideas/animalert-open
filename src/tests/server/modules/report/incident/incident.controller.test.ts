import { describe, it, expect, beforeEach, vi } from "vitest";
import { IncidentController } from "~/server/api/modules/report/incident/incident.controller";
import { REPORT_TYPES } from "~/constants/report-types";

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

describe("IncidentController", () => {
  let controller: IncidentController;

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new IncidentController();
  });

  it("should instantiate with IncidentService", () => {
    expect(controller).toBeDefined();
  });

  it("should have upsertReportWithUser method", () => {
    expect(typeof controller.upsertReportWithUser).toBe("function");
  });

  it("should call upsertReportWithUser and return result", async () => {
    // Mock the db transaction
    const { db } = await import("~/server/db");
    const mockDb = db as unknown as {
      transaction: ReturnType<typeof vi.fn>;
    };

    const mockResult = {
      user: {
        id: "test-user",
        firstName: "Test",
        lastName: "User",
      },
      report: {
        id: "test-report",
        reportType: REPORT_TYPES.INCIDENT,
        reportNumber: 1234,
      },
      isUpdate: false,
    };

    mockDb.transaction.mockImplementation(async (callback) => {
      const mockTx = {
        query: {
          users: {
            findFirst: vi.fn().mockResolvedValue(mockResult.user),
          },
          reports: {
            findFirst: vi.fn().mockResolvedValue(null),
          },
        },
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockResult.report]),
          }),
        }),
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return callback(mockTx as never);
    });

    const result = await controller.upsertReportWithUser({
      user: {
        id: "test-user",
        firstName: "Test",
        lastName: "User",
        phone: "+40712345678",
        countryCode: "RO",
        receiveOtherReportUpdates: false,
      },
      report: {
        reportType: REPORT_TYPES.INCIDENT,
        receiveUpdates: false,
        imageKeys: [],
      },
    });

    expect(result.user).toBeDefined();
    expect(result.report).toBeDefined();
  });
});
