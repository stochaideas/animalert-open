/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from "vitest";
import { contactSchema } from "~/server/api/modules/contact/contact.schema";

describe("contactSchema", () => {
  const validData = {
    lastName: "Popescu",
    firstName: "Ion",
    phone: "0712345678", // Romanian phone number without country code
    email: "ion@example.com",
    county: "CJ",
    solicitationType: "general",
    message: "Test message",
  };

  it("should validate correct contact data", () => {
    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should require lastName", () => {
    const { lastName: _lastName, ...rest } = validData;
    const result = contactSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("should require firstName", () => {
    const { firstName: _firstName, ...rest } = validData;
    const result = contactSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("should require phone", () => {
    const { phone: _phone, ...rest } = validData;
    const result = contactSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("should validate phone number format", () => {
    const result = contactSchema.safeParse({
      ...validData,
      phone: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("should require email", () => {
    const { email: _email, ...rest } = validData;
    const result = contactSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("should validate email format", () => {
    const result = contactSchema.safeParse({
      ...validData,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("should require county", () => {
    const { county: _county, ...rest } = validData;
    const result = contactSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("should validate county is from enum", () => {
    const result = contactSchema.safeParse({
      ...validData,
      county: "INVALID_COUNTY",
    });
    expect(result.success).toBe(false);
  });

  it("should require solicitationType", () => {
    const { solicitationType: _solicitationType, ...rest } = validData;
    const result = contactSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("should validate solicitationType is from enum", () => {
    const result = contactSchema.safeParse({
      ...validData,
      solicitationType: "INVALID_TYPE",
    });
    expect(result.success).toBe(false);
  });

  it("should require message", () => {
    const { message: _message, ...rest } = validData;
    const result = contactSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("should accept all valid county codes", () => {
    const countyCodes = [
      "AB",
      "AR",
      "AG",
      "BC",
      "BH",
      "BN",
      "BT",
      "BV",
      "BR",
      "BZ",
      "CS",
      "CL",
      "CJ",
      "CT",
      "CV",
      "DB",
      "DJ",
      "GL",
      "GR",
      "GJ",
      "HR",
      "HD",
      "IL",
      "IS",
      "IF",
      "MM",
      "MH",
      "MS",
      "NT",
      "OT",
      "PH",
      "SM",
      "SJ",
      "SB",
      "SV",
      "TR",
      "TM",
      "TL",
      "VS",
      "VL",
      "VN",
      "B",
    ];

    countyCodes.forEach((county) => {
      const result = contactSchema.safeParse({
        ...validData,
        county,
      });
      expect(result.success).toBe(true);
    });
  });

  it("should accept all valid solicitation types", () => {
    const types = [
      "general",
      "error",
      "event",
      "membership",
      "partnership",
      "sponsorship",
      "platformSuggestion",
    ];

    types.forEach((solicitationType) => {
      const result = contactSchema.safeParse({
        ...validData,
        solicitationType,
      });
      expect(result.success).toBe(true);
    });
  });
});
