/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ContactService } from "~/server/api/modules/contact/contact.service";
import type { EmailService } from "~/server/api/modules/email/email.service";
import type { emailOptionsSchema } from "~/server/api/modules/email/email.schema";
import type { z } from "zod";

type EmailOptions = z.infer<typeof emailOptionsSchema>;

// Mock the EmailService
vi.mock("~/server/api/modules/email/email.service");

// Mock env
vi.mock("~/env", () => ({
  env: {
    EMAIL_ADMIN: "admin@anim-alert.org",
  },
}));

describe("ContactService", () => {
  let contactService: ContactService;
  let mockEmailService: { sendEmail: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();
    contactService = new ContactService();
    mockEmailService = (
      contactService as unknown as { emailService: EmailService }
    ).emailService as unknown as { sendEmail: ReturnType<typeof vi.fn> };
  });

  describe("insertContact", () => {
    it("should send email to admin with correct HTML and text content", async () => {
      const contactData = {
        firstName: "John",
        lastName: "Doe",
        phone: "0712345678",
        email: "john@example.com",
        county: "B",
        solicitationType: "general",
        message: "Test message\nSecond line",
      };

      const mockSendEmail = vi.fn().mockResolvedValue(undefined);
      mockEmailService.sendEmail = mockSendEmail;

      await contactService.insertContact(contactData);

      // Should call sendEmail twice: once for admin, once for user
      expect(mockSendEmail).toHaveBeenCalledTimes(2);

      // Check admin email
      const adminCall = mockSendEmail.mock.calls[0]![0] as EmailOptions;
      expect(adminCall.to).toBe("admin@anim-alert.org");
      expect(adminCall.subject).toContain("Contact Nou");
      expect(adminCall.subject).toContain("Mesaj general");
      expect(adminCall.html).toContain("Doe John");
      expect(adminCall.html).toContain("0712345678");
      expect(adminCall.html).toContain("john@example.com");
      expect(adminCall.html).toContain("București");
      expect(adminCall.html).toContain("Test message");
      expect(adminCall.html).toContain("Second line");
      expect(adminCall.text).toContain("Doe John");
      expect(adminCall.text).toContain("București");
    });

    it("should send confirmation email to user when email is provided", async () => {
      const contactData = {
        firstName: "Jane",
        lastName: "Smith",
        phone: "0723456789",
        email: "jane@example.com",
        county: "CJ",
        solicitationType: "error",
        message: "Bug report",
      };

      const mockSendEmail = vi.fn().mockResolvedValue(undefined);
      mockEmailService.sendEmail = mockSendEmail;

      await contactService.insertContact(contactData);

      // Check user email
      const userCall = mockSendEmail.mock.calls[1]![0];
      expect(userCall.to).toBe("jane@example.com");
      expect(userCall.subject).toBe("Mulțumim pentru mesajul tău - AnimAlert");
      expect(userCall.html).toContain("Bună, Jane!");
      expect(userCall.html).toContain("AnimAlert");
      expect(userCall.text).toContain("Bună, Jane!");
      expect(userCall.text).toContain("AnimAlert");
    });

    it("should handle different county codes correctly", async () => {
      const contactData = {
        firstName: "Test",
        lastName: "User",
        phone: "0734567890",
        email: "test@example.com",
        county: "TM",
        solicitationType: "partnership",
        message: "Partnership inquiry",
      };

      const mockSendEmail = vi.fn().mockResolvedValue(undefined);
      mockEmailService.sendEmail = mockSendEmail;

      await contactService.insertContact(contactData);

      const adminCall = mockSendEmail.mock.calls[0]![0];
      expect(adminCall.html).toContain("Timiș");
    });

    it("should handle different solicitation types correctly", async () => {
      const contactData = {
        firstName: "Test",
        lastName: "User",
        phone: "0745678901",
        email: "test@example.com",
        county: "B",
        solicitationType: "sponsorship",
        message: "Sponsorship offer",
      };

      const mockSendEmail = vi.fn().mockResolvedValue(undefined);
      mockEmailService.sendEmail = mockSendEmail;

      await contactService.insertContact(contactData);

      const adminCall = mockSendEmail.mock.calls[0]![0];
      expect(adminCall.subject).toContain(
        "Propunere de sponsorizare/finanțare",
      );
    });

    it("should handle unknown county code by displaying code itself", async () => {
      const contactData = {
        firstName: "Test",
        lastName: "User",
        phone: "0756789012",
        email: "test@example.com",
        county: "UNKNOWN",
        solicitationType: "general",
        message: "Test",
      };

      const mockSendEmail = vi.fn().mockResolvedValue(undefined);
      mockEmailService.sendEmail = mockSendEmail;

      await contactService.insertContact(contactData);

      const adminCall = mockSendEmail.mock.calls[0]![0];
      expect(adminCall.html).toContain("UNKNOWN");
    });

    it("should handle unknown solicitation type by displaying type itself", async () => {
      const contactData = {
        firstName: "Test",
        lastName: "User",
        phone: "0767890123",
        email: "test@example.com",
        county: "B",
        solicitationType: "unknownType",
        message: "Test",
      };

      const mockSendEmail = vi.fn().mockResolvedValue(undefined);
      mockEmailService.sendEmail = mockSendEmail;

      await contactService.insertContact(contactData);

      const adminCall = mockSendEmail.mock.calls[0]![0];
      expect(adminCall.subject).toContain("unknownType");
    });

    it("should handle multiline messages correctly in HTML", async () => {
      const contactData = {
        firstName: "Test",
        lastName: "User",
        phone: "0778901234",
        email: "test@example.com",
        county: "B",
        solicitationType: "general",
        message: "Line 1\nLine 2\nLine 3\nLine 4",
      };

      const mockSendEmail = vi.fn().mockResolvedValue(undefined);
      mockEmailService.sendEmail = mockSendEmail;

      await contactService.insertContact(contactData);

      const adminCall = mockSendEmail.mock.calls[0]![0];
      expect(adminCall.html).toContain("<p");
      expect(adminCall.html).toContain("Line 1");
      expect(adminCall.html).toContain("Line 2");
      expect(adminCall.html).toContain("Line 3");
      expect(adminCall.html).toContain("Line 4");
    });

    it("should propagate email service errors", async () => {
      const contactData = {
        firstName: "Test",
        lastName: "User",
        phone: "0789012345",
        email: "test@example.com",
        county: "B",
        solicitationType: "general",
        message: "Test",
      };

      const mockSendEmail = vi.fn().mockRejectedValue(new Error("SMTP error"));
      mockEmailService.sendEmail = mockSendEmail;

      await expect(contactService.insertContact(contactData)).rejects.toThrow(
        "SMTP error",
      );
    });

    it("should include phone link in admin email", async () => {
      const contactData = {
        firstName: "Test",
        lastName: "User",
        phone: "0790123456",
        email: "test@example.com",
        county: "B",
        solicitationType: "general",
        message: "Test",
      };

      const mockSendEmail = vi.fn().mockResolvedValue(undefined);
      mockEmailService.sendEmail = mockSendEmail;

      await contactService.insertContact(contactData);

      const adminCall = mockSendEmail.mock.calls[0]![0];
      expect(adminCall.html).toContain('href="tel:0790123456"');
    });

    it("should include AnimAlert branding in all emails", async () => {
      const contactData = {
        firstName: "Test",
        lastName: "User",
        phone: "0701234567",
        email: "test@example.com",
        county: "B",
        solicitationType: "general",
        message: "Test",
      };

      const mockSendEmail = vi.fn().mockResolvedValue(undefined);
      mockEmailService.sendEmail = mockSendEmail;

      await contactService.insertContact(contactData);

      const adminCall = mockSendEmail.mock.calls[0]![0];
      const userCall = mockSendEmail.mock.calls[1]![0];

      expect(adminCall.html).toContain("AnimAlert");
      expect(adminCall.text).toContain("AnimAlert");
      expect(userCall.html).toContain("AnimAlert");
      expect(userCall.text).toContain("AnimAlert");
    });

    it("should handle all valid solicitation types", async () => {
      const types = [
        "general",
        "error",
        "event",
        "membership",
        "partnership",
        "sponsorship",
        "platformSuggestion",
      ];

      for (const type of types) {
        vi.clearAllMocks();
        const contactData = {
          firstName: "Test",
          lastName: "User",
          phone: "0712345678",
          email: "test@example.com",
          county: "B",
          solicitationType: type,
          message: "Test",
        };

        const mockSendEmail = vi.fn().mockResolvedValue(undefined);
        mockEmailService.sendEmail = mockSendEmail;

        await contactService.insertContact(contactData);

        expect(mockSendEmail).toHaveBeenCalledTimes(2);
      }
    });

    it("should handle contact without optional email", async () => {
      const contactData = {
        firstName: "Test",
        lastName: "User",
        phone: "0712345678",
        email: "",
        county: "B",
        solicitationType: "general",
        message: "Test",
      };

      const mockSendEmail = vi.fn().mockResolvedValue(undefined);
      mockEmailService.sendEmail = mockSendEmail;

      await contactService.insertContact(contactData);

      // Should only send admin email, not user email
      expect(mockSendEmail).toHaveBeenCalledTimes(1);
      const adminCall = mockSendEmail.mock.calls[0]![0];
      expect(adminCall.to).toBe("admin@anim-alert.org");
    });
  });
});
