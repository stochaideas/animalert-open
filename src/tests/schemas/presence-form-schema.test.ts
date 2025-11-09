import { describe, it, expect } from "vitest";
import { presenceFormSchema } from "~/app/raporteaza-prezenta/_schemas/presence-form-schema";

describe("presenceFormSchema", () => {
  const validPresenceData = {
    firstName: "Jane",
    lastName: "Smith",
    phone: "0723456789",
    countryCode: "RO",
    email: "jane@example.com",
    confidentiality: true,
    receiveUpdates: false,
    receiveOtherReportUpdates: false,
  };

  describe("Valid data", () => {
    it("should validate correct presence report with Romanian phone", () => {
      const result = presenceFormSchema.safeParse(validPresenceData);
      expect(result.success).toBe(true);
    });

    it("should validate presence report with US phone", () => {
      const data = {
        ...validPresenceData,
        phone: "3105551234",
        countryCode: "US",
      };
      const result = presenceFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate presence report with German phone", () => {
      const data = {
        ...validPresenceData,
        phone: "015112345678",
        countryCode: "DE",
      };
      const result = presenceFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Phone validation", () => {
    it("should reject invalid phone number", () => {
      const data = {
        ...validPresenceData,
        phone: "abc",
      };
      const result = presenceFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject empty phone number", () => {
      const data = {
        ...validPresenceData,
        phone: "",
      };
      const result = presenceFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate phone with correct country code", () => {
      const data = {
        ...validPresenceData,
        phone: "+33612345678",
        countryCode: "FR",
      };
      const result = presenceFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Required fields", () => {
    it("should require firstName", () => {
      const data = { ...validPresenceData, firstName: "" };
      const result = presenceFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require lastName", () => {
      const data = { ...validPresenceData, lastName: "" };
      const result = presenceFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require confidentiality", () => {
      const data = { ...validPresenceData, confidentiality: false };
      const result = presenceFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require countryCode", () => {
      const data = { ...validPresenceData, countryCode: undefined };
      const result = presenceFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
