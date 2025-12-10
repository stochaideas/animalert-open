import { describe, it, expect } from "vitest";
import { contactFormSchema } from "~/app/contact/_schemas/contact-form-schema";

describe("contactFormSchema", () => {
  const validContactData = {
    firstName: "Maria",
    lastName: "Popescu",
    phone: "0745678901",
    countryCode: "RO",
    email: "maria@example.com",
    county: "B",
    solicitationType: "general" as const,
    message: "I would like to volunteer",
  };

  describe("Valid data", () => {
    it("should validate correct contact form with Romanian phone", () => {
      const result = contactFormSchema.safeParse(validContactData);
      expect(result.success).toBe(true);
    });

    it("should validate contact form with US phone", () => {
      const data = {
        ...validContactData,
        phone: "4155551234",
        countryCode: "US",
      };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate contact form with French phone", () => {
      const data = {
        ...validContactData,
        phone: "0623456789",
        countryCode: "FR",
      };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate different solicitation types", () => {
      const types = [
        "general",
        "error",
        "event",
        "membership",
        "partnership",
        "sponsorship",
        "platformSuggestion",
      ] as const;

      types.forEach((type) => {
        const data = {
          ...validContactData,
          solicitationType: type,
        };
        const result = contactFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Phone validation", () => {
    it("should reject invalid phone number", () => {
      const data = {
        ...validContactData,
        phone: "invalid",
      };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject empty phone number", () => {
      const data = {
        ...validContactData,
        phone: "",
      };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate phone with international prefix", () => {
      const data = {
        ...validContactData,
        phone: "+40745678901",
      };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject phone number with wrong country code", () => {
      const data = {
        ...validContactData,
        phone: "0745678901", // Romanian number
        countryCode: "US", // US country code - clearly incompatible
      };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Required fields", () => {
    it("should require firstName", () => {
      const data = { ...validContactData, firstName: "" };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require lastName", () => {
      const data = { ...validContactData, lastName: "" };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require phone", () => {
      const data = { ...validContactData, phone: "" };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require email", () => {
      const data = { ...validContactData, email: "" };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require county", () => {
      const data = { ...validContactData, county: undefined };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require solicitationType", () => {
      const data = { ...validContactData, solicitationType: undefined };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require message", () => {
      const data = { ...validContactData, message: "" };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require countryCode", () => {
      const data = { ...validContactData, countryCode: undefined };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Email validation", () => {
    it("should validate correct email", () => {
      const data = { ...validContactData, email: "test@domain.com" };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const data = { ...validContactData, email: "not-an-email" };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject email without domain", () => {
      const data = { ...validContactData, email: "test@" };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
