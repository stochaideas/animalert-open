import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReportService } from "~/server/api/modules/report/report.service";
import { REPORT_TYPES } from "~/constants/report-types";
import { TRPCError } from "@trpc/server";
import type { User } from "@clerk/nextjs/server";
import type { EmailService } from "~/server/api/modules/email/email.service";
import type { S3Service } from "~/server/api/modules/s3/s3.service";
import type { SmsService } from "~/server/api/modules/sms/sms.service";

// Mock env first
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

// Mock dependencies
vi.mock("~/server/db");
vi.mock("~/lib/phone", () => ({
  normalizePhoneNumber: vi.fn((phone: string) => phone),
}));

// Create mock services
const mockEmailService: Partial<EmailService> = {
  sendEmail: vi.fn().mockResolvedValue(undefined),
};

const mockS3Service: Partial<S3Service> = {
  getObjectSignedUrl: vi.fn().mockResolvedValue({
    url: "https://s3.amazonaws.com/test-signed-url",
    type: "image/jpeg",
  }),
  getUploadFileSignedUrl: vi.fn().mockResolvedValue({
    key: "uploads/test-key",
    url: "https://s3.amazonaws.com/upload-url",
  }),
};

const mockSmsService: Partial<SmsService> = {
  sendSms: vi.fn().mockResolvedValue({
    MessageId: "test-message-id",
  }),
};

// Create a mock User factory
const createMockUser = (overrides?: Partial<User>): User =>
  ({
    id: "user-123",
    emailAddresses: [
      {
        id: "email-1",
        emailAddress: "user@example.com",
        verification: null,
        linkedTo: [],
      },
    ] as unknown as User["emailAddresses"],
    primaryEmailAddressId: "email-1",
    publicMetadata: {},
    firstName: "Test",
    lastName: "User",
    passwordEnabled: false,
    totpEnabled: false,
    backupCodeEnabled: false,
    twoFactorEnabled: false,
    banned: false,
    locked: false,
    createdAt: 0,
    updatedAt: 0,
    imageUrl: "",
    hasImage: false,
    primaryEmailAddress: null,
    primaryPhoneNumber: null,
    primaryWeb3Wallet: null,
    lastSignInAt: null,
    externalId: null,
    username: null,
    phoneNumbers: [],
    web3Wallets: [],
    externalAccounts: [],
    samlAccounts: [],
    passkeys: [],
    createOrganizationEnabled: false,
    createOrganizationsLimit: null,
    deleteSelfEnabled: false,
    publicData: {},
    privateMetadata: {},
    unsafeMetadata: {},
    legalAcceptedAt: null,
    profileImageUrl: "",
    fullName: null,
    ...overrides,
  }) as unknown as User;

describe("ReportService", () => {
  let reportService: ReportService;
  let mockDb: ReturnType<typeof createMockDb>;

  function createMockDb() {
    return {
      transaction: vi.fn((callback: (tx: unknown) => unknown) =>
        callback(mockDb),
      ),
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([
        {
          id: "test-user-id",
          firstName: "John",
          lastName: "Doe",
          phone: "0712345678",
          email: "test@example.com",
          countryCode: "RO",
        },
      ]),
      onConflictDoUpdate: vi.fn().mockReturnThis(),
      query: {
        users: {
          findFirst: vi.fn().mockResolvedValue({
            id: "test-user-id",
            firstName: "John",
            lastName: "Doe",
            phone: "0712345678",
            email: "test@example.com",
            countryCode: "RO",
          }),
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

    reportService = new ReportService(
      mockEmailService as EmailService,
      mockS3Service as S3Service,
      mockSmsService as SmsService,
    );
  });

  describe("constructor", () => {
    it("should initialize with required services", () => {
      expect(reportService).toBeDefined();
    });
  });

  describe("getReport", () => {
    it("should throw error when user is not authenticated", async () => {
      await expect(reportService.getReport(null, "report-id")).rejects.toThrow(
        TRPCError,
      );

      try {
        await reportService.getReport(null, "report-id");
      } catch (error) {
        expect((error as TRPCError).code).toBe("UNAUTHORIZED");
        expect((error as TRPCError).message).toContain("authenticated");
      }
    });

    it("should throw error when user email not found", async () => {
      const userWithoutEmail = createMockUser({
        emailAddresses: [] as unknown as User["emailAddresses"],
        primaryEmailAddressId: "non-existent",
      });

      await expect(
        reportService.getReport(userWithoutEmail, "report-id"),
      ).rejects.toThrow(TRPCError);
    });

    it("should throw error when report not found", async () => {
      const mockUser = createMockUser();
      mockDb.orderBy.mockResolvedValue([]);

      await expect(
        reportService.getReport(mockUser, "non-existent-id"),
      ).rejects.toThrow(TRPCError);

      try {
        await reportService.getReport(mockUser, "non-existent-id");
      } catch (error) {
        expect((error as TRPCError).code).toBe("NOT_FOUND");
      }
    });

    it("should return report for matching user email", async () => {
      const mockUser = createMockUser();
      const mockReport = {
        id: "report-123",
        reportNumber: 1,
        reportType: REPORT_TYPES.PRESENCE,
      };

      // Fix: Mock the query chain properly
      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([
        {
          report: mockReport,
          user: { email: "user@example.com" },
        },
      ]);

      const result = await reportService.getReport(mockUser, "report-123");

      expect(result).toEqual(mockReport);
    });

    it("should allow admin to access any report", async () => {
      const adminUser = createMockUser({
        publicMetadata: { role: "admin" },
      });

      const mockReport = {
        id: "report-123",
        reportNumber: 1,
        reportType: REPORT_TYPES.INCIDENT,
      };

      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([
        {
          report: mockReport,
          user: { email: "other@example.com" },
        },
      ]);

      const result = await reportService.getReport(adminUser, "report-123");

      expect(result).toEqual(mockReport);
    });

    it("should throw FORBIDDEN when user tries to access another user's report", async () => {
      const mockUser = createMockUser();

      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([
        {
          report: { id: "report-123" },
          user: { email: "other@example.com" },
        },
      ]);

      await expect(
        reportService.getReport(mockUser, "report-123"),
      ).rejects.toThrow(TRPCError);

      try {
        await reportService.getReport(mockUser, "report-123");
      } catch (error) {
        expect((error as TRPCError).code).toBe("FORBIDDEN");
      }
    });
  });

  describe("getReportsByUser", () => {
    it("should throw error when user is not authenticated", async () => {
      await expect(reportService.getReportsByUser(null)).rejects.toThrow(
        TRPCError,
      );
    });

    it("should throw error when user email not found", async () => {
      const userWithoutEmail = createMockUser({
        primaryEmailAddressId: "non-existent",
      });

      await expect(
        reportService.getReportsByUser(userWithoutEmail),
      ).rejects.toThrow(TRPCError);
    });

    it("should return user's reports ordered by creation date", async () => {
      const mockUser = createMockUser();
      const mockReports = [
        { report: { id: "report-1", reportType: REPORT_TYPES.PRESENCE } },
        { report: { id: "report-2", reportType: REPORT_TYPES.INCIDENT } },
      ];

      mockDb.orderBy.mockResolvedValue(mockReports);

      const result = await reportService.getReportsByUser(mockUser);

      expect(result).toEqual(mockReports);
      expect(mockDb.orderBy).toHaveBeenCalled();
    });
  });

  describe("getEmailTemplates", () => {
    it("should return presence report templates", () => {
      const templates = (
        reportService as unknown as {
          getEmailTemplates: (
            reportType: string,
            actionType: string,
          ) => unknown;
        }
      ).getEmailTemplates(REPORT_TYPES.PRESENCE, "creat");

      expect(templates).toHaveProperty("subjectPrefix", "Raport prezență");
      expect(templates).toHaveProperty("adminTitle");
      expect(templates).toHaveProperty("userTitle");
      expect(templates).toHaveProperty("userThanks");
    });

    it("should return incident report templates", () => {
      const templates = (
        reportService as unknown as {
          getEmailTemplates: (
            reportType: string,
            actionType: string,
          ) => unknown;
        }
      ).getEmailTemplates(REPORT_TYPES.INCIDENT, "actualizat");

      expect(templates).toHaveProperty("subjectPrefix", "Raport incident");
    });

    it("should return conflict report templates", () => {
      const templates = (
        reportService as unknown as {
          getEmailTemplates: (
            reportType: string,
            actionType: string,
          ) => unknown;
        }
      ).getEmailTemplates(REPORT_TYPES.CONFLICT, "creat");

      expect(templates).toHaveProperty(
        "subjectPrefix",
        "Raport conflict/interacțiune",
      );
    });

    it("should return default templates for unknown type", () => {
      const templates = (
        reportService as unknown as {
          getEmailTemplates: (
            reportType: string,
            actionType: string,
          ) => unknown;
        }
      ).getEmailTemplates("UNKNOWN_TYPE", "creat");

      expect(templates).toHaveProperty("subjectPrefix", "Raport");
    });
  });

  describe("upsertReportWithUser - Create", () => {
    it("should create new user and report when report.id is not provided", async () => {
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
          reportType: REPORT_TYPES.PRESENCE,
          latitude: 44.4268,
          longitude: 26.1025,
          receiveUpdates: true,
          imageKeys: ["key1", "key2"],
          conversation: JSON.stringify([{ q: "Test", a: "Answer" }]),
        },
      };

      mockDb.query.users.findFirst.mockResolvedValue(null);

      // Mock transaction to return both user and report
      mockDb.transaction.mockImplementation(async () => {
        return {
          user: { id: "new-user-id", ...reportData.user },
          report: {
            id: "new-report-id",
            reportNumber: 1,
            ...reportData.report,
          },
          isUpdate: false,
        };
      });

      const result = await reportService.upsertReportWithUser(reportData);

      expect(result.isUpdate).toBe(false);
      expect(result.user).toBeDefined();
      expect(result.report).toBeDefined();
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });

    it("should use existing user when phone number matches", async () => {
      const existingUser = {
        id: "existing-user-id",
        firstName: "John",
        lastName: "Doe",
        phone: "0712345678",
        email: "john@example.com",
        countryCode: "RO",
        receiveOtherReportUpdates: false,
      };

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
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 45.5,
          longitude: 25.5,
          receiveUpdates: false,
          imageKeys: [],
        },
      };

      mockDb.query.users.findFirst.mockResolvedValue(existingUser);
      mockDb.transaction.mockImplementation(async () => ({
        user: existingUser,
        report: {
          id: "new-report-id",
          reportNumber: 2,
          userId: existingUser.id,
          ...reportData.report,
        },
        isUpdate: false,
      }));

      const result = await reportService.upsertReportWithUser(reportData);

      expect(result.user?.id).toBe("existing-user-id");
      expect(result.isUpdate).toBe(false);
    });
  });

  describe("upsertReportWithUser - Update", () => {
    it("should update existing user and report when report.id is provided", async () => {
      const updateData = {
        user: {
          id: "user-123",
          firstName: "Jane Updated",
          lastName: "Smith Updated",
          phone: "0723456789",
          countryCode: "RO",
          email: "jane.updated@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          id: "report-123",
          reportType: REPORT_TYPES.CONFLICT,
          latitude: 44.5,
          longitude: 26.5,
          receiveUpdates: true,
          imageKeys: ["key1", "key2", "key3"],
          conversation: JSON.stringify([{ q: "Update", a: "Response" }]),
        },
      };

      // Mock the database operations for update path
      mockDb.transaction.mockImplementation(
        async (callback: (tx: unknown) => unknown) => {
          // Setup mocks for update operations
          mockDb.update.mockReturnThis();
          mockDb.set.mockReturnThis();
          mockDb.where.mockReturnThis();
          mockDb.returning.mockResolvedValue([updateData.user]);

          // Execute the actual callback to set isUpdate flag properly
          const result = await callback(mockDb);
          return result;
        },
      );

      mockDb.returning
        .mockResolvedValueOnce([updateData.user])
        .mockResolvedValueOnce([
          {
            ...updateData.report,
            reportNumber: 5,
          },
        ]);

      const result = await reportService.upsertReportWithUser(updateData);

      expect(result.isUpdate).toBe(true);
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
      // Note: SMS sending tested separately - requires complex transaction mocking
    });

    it("should throw error when user.id is missing during update", async () => {
      const invalidUpdateData = {
        user: {
          firstName: "Jane",
          lastName: "Smith",
          phone: "0723456789",
          countryCode: "RO",
          email: "jane@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          id: "report-123",
          reportType: REPORT_TYPES.PRESENCE,
          latitude: 44.4268,
          longitude: 26.1025,
          receiveUpdates: true,
          imageKeys: [],
        },
      };

      mockDb.transaction.mockImplementation(
        async (callback: (tx: unknown) => unknown) => {
          return callback(mockDb);
        },
      );

      await expect(
        reportService.upsertReportWithUser(invalidUpdateData),
      ).rejects.toThrow(TRPCError);
    });

    it("should handle presence report type correctly", async () => {
      const updateData = {
        user: {
          id: "user-123",
          firstName: "John",
          lastName: "Doe",
          phone: "0712345678",
          countryCode: "RO",
          email: "john@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          id: "report-123",
          reportType: REPORT_TYPES.PRESENCE,
          latitude: 44.4268,
          longitude: 26.1025,
          receiveUpdates: true,
          imageKeys: [],
        },
      };

      mockDb.transaction.mockImplementation(async () => ({
        user: updateData.user,
        report: {
          ...updateData.report,
          reportNumber: 10,
        },
        isUpdate: true,
      }));

      const result = await reportService.upsertReportWithUser(updateData);

      expect(result.isUpdate).toBe(true);
      expect(result.report?.reportType).toBe(REPORT_TYPES.PRESENCE);
    });

    it("should handle conflict report type correctly", async () => {
      const updateData = {
        user: {
          id: "user-123",
          firstName: "John",
          lastName: "Doe",
          phone: "0712345678",
          countryCode: "RO",
          email: "john@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          id: "report-123",
          reportType: REPORT_TYPES.CONFLICT,
          latitude: 44.4268,
          longitude: 26.1025,
          receiveUpdates: true,
          imageKeys: [],
        },
      };

      mockDb.transaction.mockImplementation(async () => ({
        user: updateData.user,
        report: {
          ...updateData.report,
          reportNumber: 11,
        },
        isUpdate: true,
      }));

      const result = await reportService.upsertReportWithUser(updateData);

      expect(result.isUpdate).toBe(true);
      expect(result.report?.reportType).toBe(REPORT_TYPES.CONFLICT);
    });

    it("should handle incident report type with conversation correctly", async () => {
      const updateData = {
        user: {
          id: "user-123",
          firstName: "John",
          lastName: "Doe",
          phone: "0712345678",
          countryCode: "RO",
          email: "john@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          id: "report-123",
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 44.4268,
          longitude: 26.1025,
          receiveUpdates: true,
          imageKeys: [],
          conversation: JSON.stringify([{ q: "Q1", a: "A1" }]),
        },
      };

      mockDb.transaction.mockImplementation(async () => ({
        user: updateData.user,
        report: {
          ...updateData.report,
          reportNumber: 12,
        },
        isUpdate: true,
      }));

      const result = await reportService.upsertReportWithUser(updateData);

      expect(result.isUpdate).toBe(true);
      expect(result.report?.reportType).toBe(REPORT_TYPES.INCIDENT);
      expect(result.report?.conversation).toBeTruthy();
    });

    it("should not send SMS for incident report without conversation", async () => {
      const updateData = {
        user: {
          id: "user-123",
          firstName: "John",
          lastName: "Doe",
          phone: "0712345678",
          countryCode: "RO",
          email: "john@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          id: "report-123",
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 44.4268,
          longitude: 26.1025,
          receiveUpdates: true,
          imageKeys: [],
        },
      };

      mockDb.transaction.mockImplementation(async () => ({
        user: updateData.user,
        report: {
          ...updateData.report,
          reportNumber: 13,
        },
        isUpdate: true,
      }));

      (mockSmsService.sendSms as ReturnType<typeof vi.fn>).mockClear();

      await reportService.upsertReportWithUser(updateData);

      expect(mockSmsService.sendSms).not.toHaveBeenCalled();
    });
  });

  describe("upsertReportWithUser - Error Handling", () => {
    it("should rethrow TRPCError without modification", async () => {
      const trpcError = new TRPCError({
        code: "BAD_REQUEST",
        message: "Test error",
      });

      mockDb.transaction.mockRejectedValue(trpcError);

      await expect(
        reportService.upsertReportWithUser({
          user: {
            firstName: "Test",
            lastName: "User",
            phone: "0712345678",
            countryCode: "RO",
            email: "test@example.com",
            receiveOtherReportUpdates: false,
          },
          report: {
            reportType: REPORT_TYPES.PRESENCE,
            latitude: 44,
            longitude: 26,
            receiveUpdates: true,
            imageKeys: [],
          },
        }),
      ).rejects.toThrow(TRPCError);
    });

    it("should handle admin email errors gracefully", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      // Make email service throw an error
      const sendEmailMock = mockEmailService.sendEmail as ReturnType<
        typeof vi.fn
      >;
      sendEmailMock.mockRejectedValueOnce(
        new Error("Email service unavailable"),
      );

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
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 45.5,
          longitude: 25.5,
          receiveUpdates: false,
          imageKeys: [],
        },
      };

      mockDb.transaction.mockImplementation(async () => {
        return {
          user: { id: "user-id", ...reportData.user },
          report: {
            id: "report-id",
            reportNumber: 1,
            ...reportData.report,
          },
          isUpdate: false,
        };
      });

      // Should complete successfully even if email fails
      const result = await reportService.upsertReportWithUser(reportData);

      expect(result).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error sending admin email:",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it("should handle user email errors gracefully", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

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
          reportType: REPORT_TYPES.PRESENCE,
          latitude: 45.5,
          longitude: 25.5,
          receiveUpdates: true, // User wants updates
          imageKeys: [],
        },
      };

      // First email (admin) succeeds, second email (user) fails
      const sendEmailMock = mockEmailService.sendEmail as ReturnType<
        typeof vi.fn
      >;
      sendEmailMock
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error("User email failed"));

      mockDb.transaction.mockImplementation(async () => {
        return {
          user: {
            id: "user-id",
            ...reportData.user,
          },
          report: {
            id: "report-id",
            reportNumber: 2,
            ...reportData.report,
          },
          isUpdate: false,
        };
      });

      const result = await reportService.upsertReportWithUser(reportData);

      expect(result).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error sending user email:",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it("should retry admin email without attachments on size limit error", async () => {
      const consoleSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => undefined);
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      const reportData = {
        user: {
          firstName: "Test",
          lastName: "User",
          phone: "0712345678",
          countryCode: "RO",
          email: "test@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 45.5,
          longitude: 25.5,
          receiveUpdates: false,
          imageKeys: ["large-file-1.jpg", "large-file-2.jpg"],
        },
      };

      // Create an error with responseCode 552 (size limit exceeded)
      const sizeLimitError = new Error("Message too large") as Error & {
        responseCode?: number;
      };
      sizeLimitError.responseCode = 552;

      // First call fails with size limit, second call should succeed
      const sendEmailMock = mockEmailService.sendEmail as ReturnType<
        typeof vi.fn
      >;
      sendEmailMock
        .mockRejectedValueOnce(sizeLimitError)
        .mockResolvedValueOnce(undefined);

      mockDb.transaction.mockImplementation(async () => {
        return {
          user: { id: "user-id", ...reportData.user },
          report: {
            id: "report-id",
            reportNumber: 3,
            ...reportData.report,
          },
          isUpdate: false,
        };
      });

      const result = await reportService.upsertReportWithUser(reportData);

      expect(result).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Email size limit exceeded, retrying without attachments",
      );
      // Should be called twice - once with attachments, once without
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2);

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it("should log error when retry also fails after size limit error", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => undefined);

      const reportData = {
        user: {
          firstName: "Test",
          lastName: "User",
          phone: "0712345678",
          countryCode: "RO",
          email: "test@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 45.5,
          longitude: 25.5,
          receiveUpdates: false,
          imageKeys: ["file1.jpg"],
        },
      };

      const sizeLimitError = new Error("Message too large") as Error & {
        responseCode?: number;
      };
      sizeLimitError.responseCode = 552;

      const retryError = new Error("Retry also failed");

      // First call fails with size limit, retry also fails
      const sendEmailMock = mockEmailService.sendEmail as ReturnType<
        typeof vi.fn
      >;
      sendEmailMock
        .mockRejectedValueOnce(sizeLimitError)
        .mockRejectedValueOnce(retryError);

      mockDb.transaction.mockImplementation(async () => {
        return {
          user: { id: "user-id", ...reportData.user },
          report: {
            id: "report-id",
            reportNumber: 4,
            ...reportData.report,
          },
          isUpdate: false,
        };
      });

      const result = await reportService.upsertReportWithUser(reportData);

      expect(result).toBeDefined();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Email size limit exceeded, retrying without attachments",
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error sending admin email:",
        retryError,
      );

      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });

  describe("getReportWithUser", () => {
    it("should get a report with user data by report ID", async () => {
      const mockReport = {
        id: "report-1",
        reportNumber: 1,
        reportType: REPORT_TYPES.CONFLICT,
        userId: "user-1",
        receiveUpdates: true,
        latitude: 44.4268,
        longitude: 26.1025,
        imageKeys: ["key1"],
        conversation: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUser = {
        id: "user-1",
        firstName: "John",
        lastName: "Doe",
        phone: "+40712345678",
        countryCode: "RO",
        email: "john@example.com",
        receiveOtherReportUpdates: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([{ report: mockReport, user: mockUser }]);

      const result = await reportService.getReportWithUser("report-1");

      expect(result).toEqual({ report: mockReport, user: mockUser });
      expect(mockDb.select).toHaveBeenCalled();
    });

    it("should throw NOT_FOUND error when report does not exist", async () => {
      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([]);

      await expect(
        reportService.getReportWithUser("non-existent-id"),
      ).rejects.toThrow(TRPCError);
    });
  });

  describe("updateReportWithUser", () => {
    it("should update existing user and report", async () => {
      const data = {
        user: {
          id: "user-1",
          firstName: "Jane",
          lastName: "Smith",
          phone: "0723456789",
          countryCode: "RO",
          email: "jane@example.com",
          receiveOtherReportUpdates: true,
        },
        report: {
          id: "report-1",
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 45.5,
          longitude: 25.5,
          receiveUpdates: false,
          imageKeys: ["key1", "key2"],
          conversation: JSON.stringify([{ q: "Test", a: "Answer" }]),
          address: "Test Address",
        },
      };

      const updatedReport = {
        id: "report-1",
        reportNumber: 1,
        reportType: REPORT_TYPES.INCIDENT,
        userId: "user-1",
        receiveUpdates: false,
        latitude: 45.5,
        longitude: 25.5,
        imageKeys: ["key1", "key2"],
        conversation: data.report.conversation,
        address: "Test Address",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the update operations
      mockDb.update.mockReturnThis();
      mockDb.set.mockReturnThis();
      mockDb.where.mockResolvedValue(undefined);

      // Mock getReportWithUser call
      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([
        { report: updatedReport, user: data.user },
      ]);

      const result = await reportService.updateReportWithUser(data);

      expect(result).toBeDefined();
      if (result) {
        expect(result.report).toBeDefined();
      }
      expect(mockDb.update).toHaveBeenCalledTimes(2); // Once for user, once for report
    });

    it("should throw BAD_REQUEST error when user ID is missing", async () => {
      const data = {
        user: {
          firstName: "Jane",
          lastName: "Smith",
          phone: "0723456789",
          countryCode: "RO",
          email: "jane@example.com",
          receiveOtherReportUpdates: true,
        },
        report: {
          id: "report-1",
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 45.5,
          longitude: 25.5,
          receiveUpdates: false,
          imageKeys: [],
        },
      };

      await expect(reportService.updateReportWithUser(data)).rejects.toThrow(
        TRPCError,
      );
    });

    it("should throw BAD_REQUEST error when report ID is missing", async () => {
      const data = {
        user: {
          id: "user-1",
          firstName: "Jane",
          lastName: "Smith",
          phone: "0723456789",
          countryCode: "RO",
          email: "jane@example.com",
          receiveOtherReportUpdates: true,
        },
        report: {
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 45.5,
          longitude: 25.5,
          receiveUpdates: false,
          imageKeys: [],
        },
      };

      await expect(reportService.updateReportWithUser(data)).rejects.toThrow(
        TRPCError,
      );
    });
  });

  describe("getReportFiles", () => {
    it("should throw UNAUTHORIZED when user is null", async () => {
      await expect(
        reportService.getReportFiles(null, "report-123"),
      ).rejects.toThrow(
        new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must be authenticated to access report files.",
        }),
      );
    });

    it("should throw UNAUTHORIZED when user has no email and is not admin", async () => {
      const userWithoutEmail = createMockUser({
        emailAddresses: [],
        publicMetadata: { role: "user" },
      });

      await expect(
        reportService.getReportFiles(userWithoutEmail, "report-123"),
      ).rejects.toThrow(
        new TRPCError({
          code: "UNAUTHORIZED",
          message: "User email not found or not verified.",
        }),
      );
    });

    it("should return signed URLs for admin user", async () => {
      const adminUser = createMockUser({
        publicMetadata: { role: "admin" },
      });

      const mockReport = {
        id: "report-123",
        userId: "user-1",
        reportNumber: 1,
        reportType: REPORT_TYPES.INCIDENT,
        latitude: 45.5,
        longitude: 25.5,
        imageKeys: ["image1.jpg", "image2.jpg"],
        receiveUpdates: false,
        conversation: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([
        {
          report: mockReport,
          user: { email: "admin@example.com" },
        },
      ]);

      const result = await reportService.getReportFiles(
        adminUser,
        "report-123",
      );

      expect(result).toBeDefined();
      expect(mockS3Service.getObjectSignedUrl).toHaveBeenCalled();
    });

    it("should throw NOT_FOUND when report doesn't exist", async () => {
      const mockUser = createMockUser();

      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([]);

      await expect(
        reportService.getReportFiles(mockUser, "nonexistent-id"),
      ).rejects.toThrow(
        new TRPCError({
          code: "NOT_FOUND",
          message: "Report with id nonexistent-id not found",
        }),
      );
    });

    it("should return empty array when report has no images", async () => {
      const mockUser = createMockUser();

      const mockReport = {
        id: "report-123",
        userId: "user-1",
        reportNumber: 1,
        reportType: REPORT_TYPES.INCIDENT,
        latitude: 45.5,
        longitude: 25.5,
        imageKeys: [],
        receiveUpdates: false,
        conversation: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([
        {
          report: mockReport,
          user: { email: "user@example.com" },
        },
      ]);

      const result = await reportService.getReportFiles(mockUser, "report-123");

      expect(result).toEqual([]);
      expect(mockS3Service.getObjectSignedUrl).not.toHaveBeenCalled();
    });

    it("should return signed URLs for all image keys", async () => {
      const mockUser = createMockUser();

      const mockReport = {
        id: "report-123",
        userId: "user-1",
        reportNumber: 1,
        reportType: REPORT_TYPES.INCIDENT,
        latitude: 45.5,
        longitude: 25.5,
        imageKeys: ["image1.jpg", "image2.jpg", "image3.jpg"],
        receiveUpdates: false,
        conversation: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([
        {
          report: mockReport,
          user: { email: "user@example.com" },
        },
      ]);

      const result = await reportService.getReportFiles(mockUser, "report-123");

      expect(result).toHaveLength(3);
      expect(mockS3Service.getObjectSignedUrl).toHaveBeenCalled();
    });

    it("should filter out undefined image keys", async () => {
      const mockUser = createMockUser();

      const mockReport = {
        id: "report-123",
        userId: "user-1",
        reportNumber: 1,
        reportType: REPORT_TYPES.INCIDENT,
        latitude: 45.5,
        longitude: 25.5,
        imageKeys: ["image1.jpg", undefined, "image2.jpg"],
        receiveUpdates: false,
        conversation: null,
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([
        {
          report: mockReport,
          user: { email: "user@example.com" },
        },
      ]);

      const result = await reportService.getReportFiles(mockUser, "report-123");

      expect(result).toHaveLength(2);
      expect(mockS3Service.getObjectSignedUrl).toHaveBeenCalled();
    });
  });

  describe("listReportsWithUser", () => {
    it("should return all reports with user data ordered by creation date", async () => {
      const mockReports = [
        {
          report: {
            id: "report-1",
            userId: "user-1",
            reportNumber: 1,
            reportType: REPORT_TYPES.INCIDENT,
            latitude: 45.5,
            longitude: 25.5,
            imageKeys: [],
            receiveUpdates: false,
            conversation: null,
            address: null,
            createdAt: new Date("2024-01-02"),
            updatedAt: new Date(),
          },
          user: {
            id: "user-1",
            firstName: "John",
            lastName: "Doe",
            phone: "+40712345678",
            countryCode: "RO",
            email: "john@example.com",
            receiveOtherReportUpdates: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        {
          report: {
            id: "report-2",
            userId: "user-2",
            reportNumber: 2,
            reportType: REPORT_TYPES.PRESENCE,
            latitude: 46.5,
            longitude: 26.5,
            imageKeys: [],
            receiveUpdates: true,
            conversation: null,
            address: null,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date(),
          },
          user: {
            id: "user-2",
            firstName: "Jane",
            lastName: "Smith",
            phone: "+40723456789",
            countryCode: "RO",
            email: "jane@example.com",
            receiveOtherReportUpdates: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];

      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.orderBy.mockResolvedValue(mockReports);

      const result = await reportService.listReportsWithUser();

      expect(result).toEqual(mockReports);
      expect(result).toHaveLength(2);
      expect(result[0]?.report.id).toBe("report-1");
      expect(result[0]?.user?.firstName).toBe("John");
      expect(result[1]?.report.id).toBe("report-2");
      expect(result[1]?.user?.firstName).toBe("Jane");
    });

    it("should return empty array when no reports exist", async () => {
      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.leftJoin.mockReturnThis();
      mockDb.orderBy.mockResolvedValue([]);

      const result = await reportService.listReportsWithUser();

      expect(result).toEqual([]);
    });
  });

  describe("sendAdminReportSms", () => {
    it("should send SMS with report number", async () => {
      // Access protected method for testing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await (reportService as any).sendAdminReportSms(1234);

      expect(mockSmsService.sendSms).toHaveBeenCalledWith({
        message: "Raport nou creat: 1234",
      });
    });

    it("should throw error when report number is missing", async () => {
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        (reportService as any).sendAdminReportSms(undefined),
      ).rejects.toThrow(
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Report number is missing",
        }),
      );
    });

    it("should throw error when report number is null", async () => {
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        (reportService as any).sendAdminReportSms(null),
      ).rejects.toThrow(
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Report number is missing",
        }),
      );
    });

    it("should format message correctly with different report numbers", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await (reportService as any).sendAdminReportSms(9999);

      expect(mockSmsService.sendSms).toHaveBeenCalledWith({
        message: "Raport nou creat: 9999",
      });
    });
  });
});
