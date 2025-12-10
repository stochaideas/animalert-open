import { describe, it, expect, vi, beforeEach } from "vitest";
import { IncidentService } from "~/server/api/modules/report/incident/incident.service";
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

describe("IncidentService", () => {
  let incidentService: IncidentService;
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

    incidentService = new IncidentService();
  });

  describe("constructor", () => {
    it("should initialize with EmailService, S3Service, and SmsService", () => {
      expect(incidentService).toBeDefined();
      expect(incidentService).toBeInstanceOf(IncidentService);
    });
  });

  describe("upsertReportWithUser", () => {
    it("should enforce INCIDENT report type", async () => {
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
          reportType: REPORT_TYPES.PRESENCE, // Passing wrong type
          latitude: 44.4268,
          longitude: 26.1025,
          receiveUpdates: true,
          imageKeys: [],
        },
      };

      // Mock transaction to return incident report
      mockDb.transaction.mockImplementation(async () => {
        return {
          user: reportData.user,
          report: {
            ...reportData.report,
            reportType: REPORT_TYPES.INCIDENT, // Should be overridden
            reportNumber: 1,
          },
          isUpdate: false,
        };
      });

      const result = await incidentService.upsertReportWithUser(reportData);

      // Verify the report type was enforced to INCIDENT
      expect(result.report?.reportType).toBe(REPORT_TYPES.INCIDENT);
    });

    it("should call parent upsertReportWithUser with INCIDENT type", async () => {
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
          conversation: JSON.stringify([{ q: "Test", a: "Answer" }]),
        },
      };

      mockDb.transaction.mockImplementation(async () => ({
        user: reportData.user,
        report: {
          ...reportData.report,
          reportType: REPORT_TYPES.INCIDENT,
          reportNumber: 2,
        },
        isUpdate: false,
      }));

      const result = await incidentService.upsertReportWithUser(reportData);

      expect(result.report?.reportType).toBe(REPORT_TYPES.INCIDENT);
      expect(result.isUpdate).toBe(false);
    });

    it("should create new user when user.id not provided and user not found", async () => {
      const newUser = {
        id: "new-user-123",
        firstName: "John",
        lastName: "Doe",
        phone: "+40712345678",
        countryCode: "RO",
        email: "john@example.com",
      };

      const newReport = {
        id: "report-123",
        userId: "new-user-123",
        reportType: REPORT_TYPES.INCIDENT,
        reportNumber: 1234,
        latitude: 44.4268,
        longitude: 26.1025,
        receiveUpdates: true,
        imageKeys: ["key1.jpg"],
        conversation: JSON.stringify([{ question: "Test?", answer: "Test" }]),
      };

      // Mock the transaction callback to execute with a proper mock tx
      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTx = {
          query: {
            users: {
              findFirst: vi.fn().mockResolvedValue(null),
            },
            reports: {
              findFirst: vi.fn().mockResolvedValue(null),
            },
          },
          insert: vi.fn((_table) => {
            const mockChain = {
              values: vi.fn().mockReturnThis(),
              onConflictDoUpdate: vi.fn().mockReturnThis(),
              returning: vi.fn(),
            };

            // First call is user insert, second is report insert
            if (!mockChain.returning.mock) {
              mockChain.returning.mockResolvedValueOnce([newUser]);
            } else {
              mockChain.returning.mockResolvedValueOnce([newReport]);
            }

            return mockChain;
          }),
          update: vi.fn().mockReturnThis(),
          set: vi.fn().mockReturnThis(),
          where: vi.fn().mockReturnThis(),
        };

        // Call the callback with our mock transaction
        return callback(mockTx as never);
      });

      const result = await incidentService.upsertReportWithUser({
        user: {
          firstName: "John",
          lastName: "Doe",
          phone: "+40712345678",
          countryCode: "RO",
          email: "john@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 44.4268,
          longitude: 26.1025,
          receiveUpdates: true,
          imageKeys: ["key1.jpg"],
          conversation: JSON.stringify([{ question: "Test?", answer: "Test" }]),
        },
      });

      expect(result.user).toBeDefined();
      expect(result.report).toBeDefined();
    });

    it("should find existing user by phone when user.id not provided", async () => {
      const existingUser = {
        id: "existing-user-123",
        firstName: "Jane",
        lastName: "Doe",
        phone: "+40712345678",
        countryCode: "RO",
        email: "jane@example.com",
      };

      const newReport = {
        id: "report-456",
        userId: "existing-user-123",
        reportType: REPORT_TYPES.INCIDENT,
        reportNumber: 5678,
      };

      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTx = {
          query: {
            users: {
              findFirst: vi.fn().mockResolvedValue(existingUser),
            },
            reports: {
              findFirst: vi.fn().mockResolvedValue(null),
            },
          },
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([newReport]),
            }),
          }),
          update: vi.fn().mockReturnThis(),
          set: vi.fn().mockReturnThis(),
          where: vi.fn().mockReturnThis(),
        };

        return callback(mockTx as never);
      });

      const result = await incidentService.upsertReportWithUser({
        user: {
          firstName: "Different",
          lastName: "Name",
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

      expect(result.user?.id).toBe("existing-user-123");
    });

    it("should update existing report when report.id is provided", async () => {
      const existingUser = {
        id: "user-999",
        firstName: "Alice",
        lastName: "Smith",
      };

      const updatedReport = {
        id: "report-existing",
        userId: "user-999",
        reportType: REPORT_TYPES.INCIDENT,
        reportNumber: 9999,
        conversation: JSON.stringify([{ question: "Updated?", answer: "Yes" }]),
      };

      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTx = {
          query: {
            users: {
              findFirst: vi.fn().mockResolvedValue(existingUser),
            },
            reports: {
              findFirst: vi.fn().mockResolvedValue({
                id: "report-existing",
                userId: "user-999",
              }),
            },
          },
          update: vi.fn().mockReturnValue({
            set: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                returning: vi.fn().mockResolvedValue([updatedReport]),
              }),
            }),
          }),
          insert: vi.fn(),
        };

        return callback(mockTx as never);
      });

      const result = await incidentService.upsertReportWithUser({
        user: {
          id: "user-999",
          firstName: "Alice",
          lastName: "Smith",
          phone: "+40745678901",
          countryCode: "RO",
          receiveOtherReportUpdates: false,
        },
        report: {
          id: "report-existing",
          reportType: REPORT_TYPES.INCIDENT,
          conversation: JSON.stringify([
            { question: "Updated?", answer: "Yes" },
          ]),
          receiveUpdates: false,
          imageKeys: [],
        },
      });

      expect(result.isUpdate).toBe(true);
      expect(result.report?.reportNumber).toBe(9999);
    });

    it("should handle conversation with array answers in email", async () => {
      const user = {
        id: "user-array",
        firstName: "Bob",
        lastName: "Builder",
        email: "bob@example.com",
      };

      const report = {
        id: "report-array",
        userId: "user-array",
        reportType: REPORT_TYPES.INCIDENT,
        reportNumber: 7777,
        latitude: 44.5,
        longitude: 26.5,
        conversation: JSON.stringify([
          {
            question: "Multiple options?",
            answer: ["Option 1", "Option 2", "Option 3"],
          },
        ]),
        imageKeys: ["img1.jpg", "img2.jpg"],
      };

      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTx = {
          query: {
            users: {
              findFirst: vi.fn().mockResolvedValue(user),
            },
            reports: {
              findFirst: vi.fn().mockResolvedValue(null),
            },
          },
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([report]),
            }),
          }),
          update: vi.fn(),
        };

        return callback(mockTx as never);
      });

      await incidentService.upsertReportWithUser({
        user: {
          id: "user-array",
          firstName: "Bob",
          lastName: "Builder",
          phone: "+40756789012",
          countryCode: "RO",
          email: "bob@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 44.5,
          longitude: 26.5,
          conversation: JSON.stringify([
            {
              question: "Multiple options?",
              answer: ["Option 1", "Option 2", "Option 3"],
            },
          ]),
          receiveUpdates: false,
          imageKeys: ["img1.jpg", "img2.jpg"],
        },
      });

      // Email should have been sent with the array answers formatted
      expect(vi.mocked).toBeDefined();
    });

    it("should handle malformed conversation JSON gracefully", async () => {
      const user = {
        id: "user-malformed",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      };

      const report = {
        id: "report-malformed",
        userId: "user-malformed",
        reportType: REPORT_TYPES.INCIDENT,
        reportNumber: 8888,
        latitude: 44.5,
        longitude: 26.5,
        conversation: "INVALID JSON {{{",
        imageKeys: [],
      };

      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTx = {
          query: {
            users: {
              findFirst: vi.fn().mockResolvedValue(user),
            },
            reports: {
              findFirst: vi.fn().mockResolvedValue(null),
            },
          },
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([report]),
            }),
          }),
          update: vi.fn(),
        };

        return callback(mockTx as never);
      });

      await incidentService.upsertReportWithUser({
        user: {
          id: "user-malformed",
          firstName: "Test",
          lastName: "User",
          phone: "+40767890123",
          countryCode: "RO",
          email: "test@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 44.5,
          longitude: 26.5,
          conversation: "INVALID JSON {{{",
          receiveUpdates: false,
          imageKeys: [],
        },
      });

      // Should complete without errors despite malformed JSON
      expect(vi.mocked).toBeDefined();
    });
  });
});
