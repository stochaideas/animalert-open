import { describe, it, expect } from "vitest";
import { conflictFormSchema } from "~/app/conflicte/_schemas/conflict-form-schema";

describe("conflictFormSchema", () => {
  const validConflictData = {
    firstName: "Alex",
    lastName: "Ionescu",
    phone: "0734567890",
    countryCode: "RO",
    email: "alex@example.com",
    confidentiality: true,
    receiveUpdates: false,
    receiveOtherReportUpdates: false,
  };

  describe("Valid data", () => {
    it("should validate correct conflict report with Romanian phone", () => {
      const result = conflictFormSchema.safeParse(validConflictData);
      expect(result.success).toBe(true);
    });

    it("should validate conflict report with Italian phone", () => {
      const data = {
        ...validConflictData,
        phone: "3123456789",
        countryCode: "IT",
      };
      const result = conflictFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate conflict report with Spanish phone", () => {
      const data = {
        ...validConflictData,
        phone: "612345678",
        countryCode: "ES",
      };
      const result = conflictFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Phone validation", () => {
    it("should reject invalid phone number", () => {
      const data = {
        ...validConflictData,
        phone: "12345",
      };
      const result = conflictFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject empty phone number", () => {
      const data = {
        ...validConflictData,
        phone: "",
      };
      const result = conflictFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate international phone format", () => {
      const data = {
        ...validConflictData,
        phone: "+40734567890",
      };
      const result = conflictFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Required fields", () => {
    it("should require firstName", () => {
      const data = { ...validConflictData, firstName: "" };
      const result = conflictFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require lastName", () => {
      const data = { ...validConflictData, lastName: "" };
      const result = conflictFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require confidentiality", () => {
      const data = { ...validConflictData, confidentiality: false };
      const result = conflictFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require countryCode", () => {
      const data = { ...validConflictData, countryCode: undefined };
      const result = conflictFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
