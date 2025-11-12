import { describe, it, expect } from "vitest";
import { REPORT_TYPES } from "~/constants/report-types";

describe("report-types", () => {
  describe("REPORT_TYPES enum", () => {
    it("should have exactly 3 report types", () => {
      const types = Object.keys(REPORT_TYPES);
      expect(types.length).toBe(3);
    });

    it("should have INCIDENT type", () => {
      expect(REPORT_TYPES.INCIDENT).toBe("INCIDENT");
    });

    it("should have PRESENCE type", () => {
      expect(REPORT_TYPES.PRESENCE).toBe("PRESENCE");
    });

    it("should have CONFLICT type", () => {
      expect(REPORT_TYPES.CONFLICT).toBe("CONFLICT");
    });

    it("should have all values as uppercase strings", () => {
      Object.values(REPORT_TYPES).forEach((value) => {
        expect(value).toMatch(/^[A-Z_]+$/);
        expect(value).toBe(value.toUpperCase());
      });
    });

    it("should have keys matching values", () => {
      expect(REPORT_TYPES.INCIDENT).toBe("INCIDENT");
      expect(REPORT_TYPES.PRESENCE).toBe("PRESENCE");
      expect(REPORT_TYPES.CONFLICT).toBe("CONFLICT");
    });

    it("should have unique values", () => {
      const values = Object.values(REPORT_TYPES);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });

    it("should be accessible by key", () => {
      expect(REPORT_TYPES["INCIDENT"]).toBeDefined();
      expect(REPORT_TYPES["PRESENCE"]).toBeDefined();
      expect(REPORT_TYPES["CONFLICT"]).toBeDefined();
    });

    it("should cover all animal-related report categories", () => {
      const values = Object.values(REPORT_TYPES);
      expect(values).toContain("INCIDENT");
      expect(values).toContain("PRESENCE");
      expect(values).toContain("CONFLICT");
    });
  });
});
