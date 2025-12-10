import { describe, it, expect, beforeEach, vi } from "vitest";
import { ReportController } from "~/server/api/modules/report/report.controller";
import { ReportService } from "~/server/api/modules/report/report.service";
import type { EmailService } from "~/server/api/modules/email/email.service";
import type { S3Service } from "~/server/api/modules/s3/s3.service";
import type { SmsService } from "~/server/api/modules/sms/sms.service";
import { REPORT_TYPES } from "~/constants/report-types";
import type { User } from "@clerk/nextjs/server";

// Mock the dependencies
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

describe("ReportController", () => {
  let controller: ReportController;
  let mockService: ReportService;

  const mockUser: User = {
    id: "user-123",
    emailAddresses: [
      {
        id: "email-1",
        emailAddress: "user@example.com",
      },
    ],
  } as User;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mocks with minimal implementation
    const mockEmailService = { sendEmail: vi.fn() };
    const mockS3Service = {
      getObjectSignedUrl: vi.fn(),
      getUploadFileSignedUrl: vi.fn(),
    };
    const mockSmsService = { sendSms: vi.fn() };

    mockService = new ReportService(
      mockEmailService as unknown as EmailService,
      mockS3Service as unknown as S3Service,
      mockSmsService as unknown as SmsService,
    );

    controller = new ReportController(mockService);
  });

  it("should instantiate with ReportService", () => {
    expect(controller).toBeDefined();
  });

  describe("getReport", () => {
    it("should call reportService.getReport", async () => {
      const spy = vi
        .spyOn(mockService, "getReport")
        .mockResolvedValue(undefined);

      await controller.getReport(mockUser, "report-1");

      expect(spy).toHaveBeenCalledWith(mockUser, "report-1");
    });
  });

  describe("getReportsByUser", () => {
    it("should call reportService.getReportsByUser", async () => {
      const spy = vi
        .spyOn(mockService, "getReportsByUser")
        .mockResolvedValue([]);

      await controller.getReportsByUser(mockUser);

      expect(spy).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("upsertReportWithUser", () => {
    it("should call reportService.upsertReportWithUser", async () => {
      const data = {
        user: {
          firstName: "John",
          lastName: "Doe",
          phone: "0712345678",
          countryCode: "RO",
          email: "john@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          reportType: REPORT_TYPES.CONFLICT,
          latitude: 44.4268,
          longitude: 26.1025,
          receiveUpdates: true,
          imageKeys: [],
        },
      };

      const spy = vi
        .spyOn(mockService, "upsertReportWithUser")
        .mockResolvedValue({
          user: data.user as never,
          report: { ...data.report, reportNumber: 1 } as never,
          isUpdate: false,
        });

      await controller.upsertReportWithUser(data);

      expect(spy).toHaveBeenCalledWith(data);
    });
  });

  describe("getReportFiles", () => {
    it("should call reportService.getReportFiles", async () => {
      const spy = vi.spyOn(mockService, "getReportFiles").mockResolvedValue([]);

      await controller.getReportFiles(mockUser, "report-1");

      expect(spy).toHaveBeenCalledWith(mockUser, "report-1");
    });
  });

  describe("listReportsWithUser", () => {
    it("should call reportService.listReportsWithUser", async () => {
      const spy = vi
        .spyOn(mockService, "listReportsWithUser")
        .mockResolvedValue([]);

      await controller.listReportsWithUser();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("getReportWithUser", () => {
    it("should call reportService.getReportWithUser", async () => {
      const spy = vi.spyOn(mockService, "getReportWithUser").mockResolvedValue({
        report: {
          id: "report-1",
          reportNumber: 1,
          reportType: REPORT_TYPES.CONFLICT,
          userId: "user-1",
          receiveUpdates: true,
          latitude: 44.4268,
          longitude: 26.1025,
          imageKeys: [],
          conversation: null,
          address: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        user: null,
      });

      await controller.getReportWithUser("report-1");

      expect(spy).toHaveBeenCalledWith("report-1");
    });
  });

  describe("updateReportWithUser", () => {
    it("should call reportService.updateReportWithUser", async () => {
      const data = {
        user: {
          firstName: "Jane",
          lastName: "Smith",
          phone: "0723456789",
          countryCode: "RO",
          email: "jane@example.com",
          receiveOtherReportUpdates: false,
        },
        report: {
          reportType: REPORT_TYPES.INCIDENT,
          latitude: 45.5,
          longitude: 25.5,
          receiveUpdates: false,
          imageKeys: ["key1"],
        },
      };

      const spy = vi
        .spyOn(mockService, "updateReportWithUser")
        .mockResolvedValue({
          user: data.user as never,
          report: { ...data.report, reportNumber: 2 } as never,
        });

      await controller.updateReportWithUser(data);

      expect(spy).toHaveBeenCalledWith(data);
    });
  });
});
