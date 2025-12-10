import { describe, it, expect } from "vitest";
import { smsOptionsSchema } from "~/server/api/modules/sms/sms.schema";

describe("smsOptionsSchema", () => {
  it("should validate correct SMS options", () => {
    const result = smsOptionsSchema.safeParse({
      message: "Test message",
    });
    expect(result.success).toBe(true);
  });

  it("should require message", () => {
    const result = smsOptionsSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should require non-empty message", () => {
    const result = smsOptionsSchema.safeParse({
      message: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject message longer than 160 characters", () => {
    const result = smsOptionsSchema.safeParse({
      message: "a".repeat(161),
    });
    expect(result.success).toBe(false);
  });

  it("should accept message exactly 160 characters", () => {
    const result = smsOptionsSchema.safeParse({
      message: "a".repeat(160),
    });
    expect(result.success).toBe(true);
  });

  it("should accept message with 1 character", () => {
    const result = smsOptionsSchema.safeParse({
      message: "a",
    });
    expect(result.success).toBe(true);
  });

  it("should accept message with Unicode characters", () => {
    const result = smsOptionsSchema.safeParse({
      message: "Mesaj în română: ăîșțâ 🐾",
    });
    expect(result.success).toBe(true);
  });

  it("should accept message with special characters", () => {
    const result = smsOptionsSchema.safeParse({
      message: "Special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?",
    });
    expect(result.success).toBe(true);
  });
});
