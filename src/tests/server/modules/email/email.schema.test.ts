/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from "vitest";
import { emailOptionsSchema } from "~/server/api/modules/email/email.schema";

describe("emailOptionsSchema", () => {
  const validTextEmail = {
    to: "test@example.com",
    subject: "Test Subject",
    text: "Test message",
  };

  const validHtmlEmail = {
    to: "test@example.com",
    subject: "Test Subject",
    html: "<p>Test message</p>",
  };

  it("should validate email with text content", () => {
    const result = emailOptionsSchema.safeParse(validTextEmail);
    expect(result.success).toBe(true);
  });

  it("should validate email with html content", () => {
    const result = emailOptionsSchema.safeParse(validHtmlEmail);
    expect(result.success).toBe(true);
  });

  it("should accept single email address as to", () => {
    const result = emailOptionsSchema.safeParse(validTextEmail);
    expect(result.success).toBe(true);
  });

  it("should accept array of email addresses as to", () => {
    const result = emailOptionsSchema.safeParse({
      ...validTextEmail,
      to: ["test1@example.com", "test2@example.com"],
    });
    expect(result.success).toBe(true);
  });

  it("should require valid email format in to", () => {
    const result = emailOptionsSchema.safeParse({
      ...validTextEmail,
      to: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("should require valid email formats in array", () => {
    const result = emailOptionsSchema.safeParse({
      ...validTextEmail,
      to: ["valid@example.com", "invalid-email"],
    });
    expect(result.success).toBe(false);
  });

  it("should require subject", () => {
    const { subject: _subject, ...rest } = validTextEmail;
    const result = emailOptionsSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("should require non-empty subject", () => {
    const result = emailOptionsSchema.safeParse({
      ...validTextEmail,
      subject: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when neither text nor html is provided", () => {
    const result = emailOptionsSchema.safeParse({
      to: "test@example.com",
      subject: "Test",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("text"))).toBe(
        true,
      );
      expect(result.error.issues.some((i) => i.path.includes("html"))).toBe(
        true,
      );
    }
  });

  it("should fail when both text and html are provided", () => {
    const result = emailOptionsSchema.safeParse({
      to: "test@example.com",
      subject: "Test",
      text: "Text content",
      html: "<p>HTML content</p>",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("text"))).toBe(
        true,
      );
      expect(result.error.issues.some((i) => i.path.includes("html"))).toBe(
        true,
      );
    }
  });

  it("should accept optional attachments", () => {
    const result = emailOptionsSchema.safeParse({
      ...validTextEmail,
      attachments: [
        {
          filename: "test.pdf",
          content: "file content",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("should validate attachment has filename", () => {
    const result = emailOptionsSchema.safeParse({
      ...validTextEmail,
      attachments: [
        {
          filename: "",
          content: "file content",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should accept Buffer as attachment content", () => {
    const result = emailOptionsSchema.safeParse({
      ...validTextEmail,
      attachments: [
        {
          filename: "test.pdf",
          content: Buffer.from("test"),
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("should accept optional contentType in attachments", () => {
    const result = emailOptionsSchema.safeParse({
      ...validTextEmail,
      attachments: [
        {
          filename: "test.pdf",
          content: "file content",
          contentType: "application/pdf",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("should accept multiple attachments", () => {
    const result = emailOptionsSchema.safeParse({
      ...validTextEmail,
      attachments: [
        {
          filename: "test1.pdf",
          content: "content1",
        },
        {
          filename: "test2.pdf",
          content: Buffer.from("content2"),
          contentType: "application/pdf",
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
