/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import nodemailer from "nodemailer";

// Mock nodemailer
vi.mock("nodemailer");

// Mock env with PRODUCTION mode
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "production",
    EMAIL_USER: "test@example.com",
    EMAIL_PASS: "test-password",
    EMAIL_FROM: "noreply@anim-alert.org",
  },
}));

describe("EmailService - Production Mode", () => {
  let mockTransporter: {
    sendMail: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockTransporter = {
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
    };
    vi.mocked(nodemailer.createTransport).mockReturnValue(
      mockTransporter as ReturnType<typeof nodemailer.createTransport>,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should not add environment prefix in production", async () => {
    // Dynamically import to ensure production env is used
    const { EmailService } = await import(
      "~/server/api/modules/email/email.service"
    );
    const emailService = new EmailService();

    await emailService.sendEmail({
      to: "test@example.com",
      subject: "Production Subject",
      text: "Production body",
    });

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: "noreply@anim-alert.org",
      to: "test@example.com",
      subject: "Production Subject", // No [PRODUCTION] prefix
      text: "Production body",
      html: undefined,
      attachments: undefined,
    });
  });

  it("should send production emails without environment tags", async () => {
    const { EmailService } = await import(
      "~/server/api/modules/email/email.service"
    );
    const emailService = new EmailService();

    await emailService.sendEmail({
      to: "customer@example.com",
      subject: "Welcome to Our Service",
      html: "<h1>Welcome!</h1>",
    });

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Welcome to Our Service",
      }),
    );
    // Ensure no [DEVELOPMENT], [TEST], etc. prefix
    expect(mockTransporter.sendMail).not.toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringMatching(/^\[.*\]/),
      }),
    );
  });
});
