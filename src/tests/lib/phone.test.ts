import { describe, it, expect } from "vitest";
import {
  normalizePhoneNumber,
  phoneNumberRefine,
  phoneNumberWithCountrySchema,
} from "~/lib/phone";

describe("normalizePhoneNumber", () => {
  describe("Romanian phone numbers", () => {
    it("should normalize Romanian phone number with +40 prefix", () => {
      const result = normalizePhoneNumber("+40712345678", "RO");
      expect(result).toBe("+40712345678");
    });

    it("should normalize Romanian phone number without prefix", () => {
      const result = normalizePhoneNumber("0712345678", "RO");
      expect(result).toBe("+40712345678");
    });

    it("should normalize Romanian phone number with 0040 prefix", () => {
      const result = normalizePhoneNumber("0040712345678", "RO");
      expect(result).toBe("+40712345678");
    });

    it("should normalize Romanian phone number with spaces", () => {
      const result = normalizePhoneNumber("0712 345 678", "RO");
      expect(result).toBe("+40712345678");
    });
  });

  describe("US phone numbers", () => {
    it("should normalize US phone number with +1 prefix", () => {
      const result = normalizePhoneNumber("+12125551234", "US");
      expect(result).toBe("+12125551234");
    });

    it("should normalize US phone number without prefix", () => {
      const result = normalizePhoneNumber("2125551234", "US");
      expect(result).toBe("+12125551234");
    });

    it("should normalize US phone number with formatting", () => {
      const result = normalizePhoneNumber("(212) 555-1234", "US");
      expect(result).toBe("+12125551234");
    });
  });

  describe("UK phone numbers", () => {
    it("should normalize UK phone number with +44 prefix", () => {
      const result = normalizePhoneNumber("+447911123456", "GB");
      expect(result).toBe("+447911123456");
    });

    it("should normalize UK phone number with 0 prefix", () => {
      const result = normalizePhoneNumber("07911123456", "GB");
      expect(result).toBe("+447911123456");
    });
  });

  describe("Edge cases", () => {
    it("should return original string for empty string", () => {
      const result = normalizePhoneNumber("", "RO");
      expect(result).toBe("");
    });

    it("should normalize short number with country code", () => {
      const result = normalizePhoneNumber("123", "RO");
      // Library parses it and adds country code even if invalid
      expect(result).toBe("+40123");
    });

    it("should return original string for non-numeric string", () => {
      const result = normalizePhoneNumber("abcdefg", "RO");
      expect(result).toBe("abcdefg");
    });

    it("should handle phone number with special characters", () => {
      const result = normalizePhoneNumber("+40-712-345-678", "RO");
      expect(result).toBe("+40712345678");
    });
  });
});

describe("phoneNumberRefine", () => {
  describe("Romanian validation", () => {
    it("should validate correct Romanian phone number", () => {
      const result = phoneNumberRefine("0712345678", "RO");
      expect(result).toBe(true);
    });

    it("should validate Romanian phone number with prefix", () => {
      const result = phoneNumberRefine("+40712345678", "RO");
      expect(result).toBe(true);
    });

    it("should reject invalid Romanian phone number", () => {
      const result = phoneNumberRefine("123", "RO");
      expect(result).toBe(false);
    });

    it("should reject empty string", () => {
      const result = phoneNumberRefine("", "RO");
      expect(result).toBe(false);
    });
  });

  describe("US validation", () => {
    it("should validate correct US phone number", () => {
      const result = phoneNumberRefine("2125551234", "US");
      expect(result).toBe(true);
    });

    it("should validate US phone number with prefix", () => {
      const result = phoneNumberRefine("+12125551234", "US");
      expect(result).toBe(true);
    });

    it("should validate US phone number with formatting", () => {
      const result = phoneNumberRefine("(212) 555-1234", "US");
      expect(result).toBe(true);
    });

    it("should reject invalid US phone number", () => {
      const result = phoneNumberRefine("123", "US");
      expect(result).toBe(false);
    });
  });

  describe("Multiple countries", () => {
    it("should validate German phone number", () => {
      const result = phoneNumberRefine("+4915112345678", "DE");
      expect(result).toBe(true);
    });

    it("should validate French phone number", () => {
      const result = phoneNumberRefine("+33612345678", "FR");
      expect(result).toBe(true);
    });

    it("should validate Italian phone number", () => {
      const result = phoneNumberRefine("+393123456789", "IT");
      expect(result).toBe(true);
    });

    it("should validate Spanish phone number", () => {
      const result = phoneNumberRefine("+34612345678", "ES");
      expect(result).toBe(true);
    });
  });
});

describe("phoneNumberWithCountrySchema", () => {
  it("should validate correct phone and country code", () => {
    const result = phoneNumberWithCountrySchema.safeParse({
      phone: "0712345678",
      countryCode: "RO",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid phone number", () => {
    const result = phoneNumberWithCountrySchema.safeParse({
      phone: "123",
      countryCode: "RO",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain(
        "Numărul de telefon este invalid",
      );
    }
  });

  it("should use default country code if not provided", () => {
    const result = phoneNumberWithCountrySchema.safeParse({
      phone: "0712345678",
    });
    expect(result.success).toBe(true);
  });

  it("should validate US phone number", () => {
    const result = phoneNumberWithCountrySchema.safeParse({
      phone: "2125551234",
      countryCode: "US",
    });
    expect(result.success).toBe(true);
  });

  it("should validate phone number with international prefix", () => {
    const result = phoneNumberWithCountrySchema.safeParse({
      phone: "+40712345678",
      countryCode: "RO",
    });
    expect(result.success).toBe(true);
  });
});
