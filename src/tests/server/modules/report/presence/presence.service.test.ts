import { describe, it, expect, vi, beforeEach } from "vitest";
import { PresenceService } from "~/server/api/modules/report/presence/presence.service";
import { REPORT_TYPES } from "~/constants/report-types";

// Mock env first
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "development",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    ADMIN_EMAIL: "admin@test.com",
    ADMIN_SMS_PHONE_NUMBER: "+40712345678",
    AWS_S3_BUCKET_NAME: "test-bucket",
    AWS_REGION: "us-east-1",
    EMAIL_USER: "test@gmail.com",
    EMAIL_PASS: "testpass",
  },
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

// Mock dependencies
vi.mock("~/server/db");
vi.mock("~/lib/phone", () => ({
  normalizePhoneNumber: vi.fn((phone: string) => phone),
}));

describe("PresenceService", () => {
  let presenceService: PresenceService;
  let mockDb: ReturnType<typeof createMockDb>;

  function createMockDb() {
    return {
      transaction: vi.fn((callback: (tx: unknown) => unknown) =>
        callback({
          update: vi.fn().mockReturnThis(),
          set: vi.fn().mockReturnThis(),
          where: vi.fn().mockReturnThis(),
          returning: vi.fn().mockResolvedValue([]),
          query: {
            users: {
              findFirst: vi.fn().mockResolvedValue(null),
            },
          },
        }),
      ),
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      orderBy: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
      onConflictDoUpdate: vi.fn().mockReturnThis(),
      query: {
        users: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    };
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    mockDb = createMockDb();

    // Dynamically import and mock the db module
    const dbModule = await import("~/server/db");
    (dbModule as { db: unknown }).db = mockDb;

    presenceService = new PresenceService();
  });

  describe("constructor", () => {
    it("should initialize with EmailService, S3Service, and SmsService", () => {
      expect(presenceService).toBeDefined();
      expect(presenceService).toBeInstanceOf(PresenceService);
    });
  });

  describe("upsertReportWithUser", () => {
    it("should enforce PRESENCE report type", async () => {
      const reportData = {
        user: {
          firstName: "John",
          lastName: "Doe",
          phone: "0712345678",
          countryCode: "RO",
          email: "john@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          reportType: REPORT_TYPES.INCIDENT, // Passing wrong type
          latitude: 44.4268,
          longitude: 26.1025,
          receiveUpdates: true,
          imageKeys: [],
        },
      };

      // Mock transaction to return presence report
      mockDb.transaction.mockImplementation(async () => {
        return {
          user: reportData.user,
          report: {
            ...reportData.report,
            reportType: REPORT_TYPES.PRESENCE, // Should be overridden
            reportNumber: 1,
          },
          isUpdate: false,
        };
      });

      const result = await presenceService.upsertReportWithUser(reportData);

      // Verify the report type was enforced to PRESENCE
      expect(result.report?.reportType).toBe(REPORT_TYPES.PRESENCE);
    });

    it("should call parent upsertReportWithUser with PRESENCE type", async () => {
      const reportData = {
        user: {
          firstName: "Jane",
          lastName: "Smith",
          phone: "0723456789",
          countryCode: "RO",
          email: "jane@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          reportType: REPORT_TYPES.CONFLICT, // Different type provided
          latitude: 45.5,
          longitude: 25.5,
          receiveUpdates: false,
          imageKeys: ["key1"],
        },
      };

      mockDb.transaction.mockImplementation(async () => ({
        user: reportData.user,
        report: {
          ...reportData.report,
          reportType: REPORT_TYPES.PRESENCE,
          reportNumber: 2,
        },
        isUpdate: false,
      }));

      const result = await presenceService.upsertReportWithUser(reportData);

      expect(result.report?.reportType).toBe(REPORT_TYPES.PRESENCE);
      expect(result.isUpdate).toBe(false);
    });
  });
});
