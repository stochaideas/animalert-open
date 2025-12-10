import { describe, it, expect } from "vitest";
import { incidentFormSchema } from "~/app/raporteaza-incident/_schemas/incident-form-schema";

describe("incidentFormSchema", () => {
  const validIncidentData = {
    firstName: "John",
    lastName: "Doe",
    phone: "0712345678",
    countryCode: "RO",
    email: "john@example.com",
    confidentiality: true,
    receiveUpdates: false,
    receiveOtherReportUpdates: false,
  };

  describe("Valid data", () => {
    it("should validate correct incident report with Romanian phone", () => {
      const result = incidentFormSchema.safeParse(validIncidentData);
      expect(result.success).toBe(true);
    });

    it("should validate incident report with US phone", () => {
      const data = {
        ...validIncidentData,
        phone: "2125551234",
        countryCode: "US",
      };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate incident report with UK phone", () => {
      const data = {
        ...validIncidentData,
        phone: "07400123456",
        countryCode: "GB",
      };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate incident report with international phone format", () => {
      const data = {
        ...validIncidentData,
        phone: "+40712345678",
      };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Phone validation", () => {
    it("should reject invalid Romanian phone number", () => {
      const data = {
        ...validIncidentData,
        phone: "123",
      };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path.includes("phone")),
        ).toBe(true);
      }
    });

    it("should reject empty phone number", () => {
      const data = {
        ...validIncidentData,
        phone: "",
      };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate phone with country code", () => {
      const data = {
        ...validIncidentData,
        phone: "0712345678",
        countryCode: "RO",
      };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject invalid phone for selected country", () => {
      const data = {
        ...validIncidentData,
        phone: "0712345678", // Romanian number
        countryCode: "US", // US country code
      };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Required fields", () => {
    it("should require firstName", () => {
      const data = { ...validIncidentData, firstName: "" };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require firstName to be at least 3 characters", () => {
      const data = { ...validIncidentData, firstName: "Jo" };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require lastName", () => {
      const data = { ...validIncidentData, lastName: "" };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require lastName to be at least 3 characters", () => {
      const data = { ...validIncidentData, lastName: "Do" };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require confidentiality", () => {
      const data = { ...validIncidentData, confidentiality: undefined };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require confidentiality to be true", () => {
      const data = { ...validIncidentData, confidentiality: false };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require countryCode", () => {
      const data = { ...validIncidentData, countryCode: undefined };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Email validation", () => {
    it("should validate correct email", () => {
      const data = { ...validIncidentData, email: "test@example.com" };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const data = { ...validIncidentData, email: "invalid-email" };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should allow empty email", () => {
      const data = { ...validIncidentData, email: "" };
      const result = incidentFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
