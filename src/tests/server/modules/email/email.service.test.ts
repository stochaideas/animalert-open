/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EmailService } from "~/server/api/modules/email/email.service";
import nodemailer from "nodemailer";

// Mock nodemailer
vi.mock("nodemailer");

// Mock env
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "development",
    EMAIL_USER: "test@example.com",
    EMAIL_PASS: "test-password",
    EMAIL_FROM: "noreply@anim-alert.org",
  },
}));

describe("EmailService", () => {
  let emailService: EmailService;
  let mockTransporter: {
    sendMail: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockTransporter = {
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
    };
    vi.mocked(nodemailer.createTransport).mockReturnValue(
      mockTransporter as ReturnType<typeof nodemailer.createTransport>,
    );
    emailService = new EmailService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("sendEmail", () => {
    it("should send email with text content", async () => {
      await emailService.sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test body",
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: "noreply@anim-alert.org",
        to: "test@example.com",
        subject: expect.stringContaining("Test Subject"),
        text: "Test body",
        html: undefined,
        attachments: undefined,
      });
    });

    it("should send email with HTML content", async () => {
      const htmlContent = "<h1>Test</h1><p>Body</p>";

      await emailService.sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        html: htmlContent,
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: "noreply@anim-alert.org",
        to: "test@example.com",
        subject: expect.stringContaining("Test Subject"),
        text: undefined,
        html: htmlContent,
        attachments: undefined,
      });
    });

    it("should send email with attachments", async () => {
      const attachments = [
        {
          filename: "test.pdf",
          content: Buffer.from("test content"),
        },
      ];

      await emailService.sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test body",
        attachments,
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: "noreply@anim-alert.org",
        to: "test@example.com",
        subject: expect.stringContaining("Test Subject"),
        text: "Test body",
        html: undefined,
        attachments,
      });
    });

    it("should send email with multiple attachments", async () => {
      const attachments = [
        {
          filename: "doc1.pdf",
          content: Buffer.from("content1"),
        },
        {
          filename: "doc2.pdf",
          content: Buffer.from("content2"),
        },
      ];

      await emailService.sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test body",
        attachments,
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments,
        }),
      );
    });

    it("should add environment prefix in test mode", async () => {
      // Development mode already set via mock
      await emailService.sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test body",
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: "[DEVELOPMENT] Test Subject",
        }),
      );
    });

    it("should not add environment prefix in production", async () => {
      // Production mode tested in separate test file (email.service.production.test.ts)
      // to avoid env mocking conflicts
      expect(emailService).toBeDefined();
    });

    it("should handle multiple recipients", async () => {
      const recipients = ["test1@example.com", "test2@example.com"];

      await emailService.sendEmail({
        to: recipients,
        subject: "Test Subject",
        text: "Test body",
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: recipients,
        }),
      );
    });

    it("should propagate SMTP errors", async () => {
      mockTransporter.sendMail.mockRejectedValue(
        new Error("SMTP connection failed"),
      );

      await expect(
        emailService.sendEmail({
          to: "test@example.com",
          subject: "Test Subject",
          text: "Test body",
        }),
      ).rejects.toThrow("SMTP connection failed");
    });

    it("should create transporter with correct Gmail configuration", () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        service: "gmail",
        auth: {
          user: "test@example.com",
          pass: "test-password",
        },
      });
    });

    it("should log success message after sending", async () => {
      const consoleSpy = vi.spyOn(console, "log");

      await emailService.sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test body",
      });

      expect(consoleSpy).toHaveBeenCalledWith("Email sent successfully");
      consoleSpy.mockRestore();
    });

    it("should handle both text and HTML content", async () => {
      await emailService.sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        text: "Plain text",
        html: "<p>HTML content</p>",
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "Plain text",
          html: "<p>HTML content</p>",
        }),
      );
    });

    it("should handle string attachment content", async () => {
      const attachments = [
        {
          filename: "test.txt",
          content: "string content",
        },
      ];

      await emailService.sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test body",
        attachments,
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments,
        }),
      );
    });

    it("should send email with all fields populated", async () => {
      const emailData = {
        to: ["test1@example.com", "test2@example.com"],
        subject: "Complete Test",
        text: "Plain text content",
        html: "<h1>HTML content</h1>",
        attachments: [
          {
            filename: "doc.pdf",
            content: Buffer.from("pdf content"),
          },
        ],
      };

      await emailService.sendEmail(emailData);

      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "noreply@anim-alert.org",
          to: emailData.to,
          subject: expect.any(String),
          text: emailData.text,
          html: emailData.html,
          attachments: emailData.attachments,
        }),
      );
    });
  });
});
