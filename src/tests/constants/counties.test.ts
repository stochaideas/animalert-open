import { describe, it, expect } from "vitest";
import { COUNTIES } from "~/constants/counties";

describe("counties", () => {
  describe("COUNTIES constant", () => {
    it("should have exactly 42 Romanian counties (41 counties + Bucharest)", () => {
      const countyCount = Object.keys(COUNTIES).length;
      expect(countyCount).toBe(42);
    });

    it("should include Bucharest with code 'B'", () => {
      expect(COUNTIES.B).toBe("București");
    });

    it("should have all county codes as uppercase letters", () => {
      Object.keys(COUNTIES).forEach((code) => {
        expect(code).toMatch(/^[A-Z]{1,2}$/);
      });
    });

    it("should have all county names as non-empty strings", () => {
      Object.values(COUNTIES).forEach((name) => {
        expect(typeof name).toBe("string");
        expect(name.length).toBeGreaterThan(0);
      });
    });

    it("should include major counties", () => {
      expect(COUNTIES.CJ).toBe("Cluj");
      expect(COUNTIES.TM).toBe("Timiș");
      expect(COUNTIES.IS).toBe("Iași");
      expect(COUNTIES.CT).toBe("Constanța");
      expect(COUNTIES.BV).toBe("Brașov");
    });

    it("should have unique county codes", () => {
      const codes = Object.keys(COUNTIES);
      const uniqueCodes = new Set(codes);
      expect(codes.length).toBe(uniqueCodes.size);
    });

    it("should have Romanian diacritics in county names", () => {
      // Check for proper Romanian characters
      expect(COUNTIES.AG).toBe("Argeș");
      expect(COUNTIES.DB).toBe("Dâmbovița");
      expect(COUNTIES.CL).toBe("Călărași");
      expect(COUNTIES.SJ).toBe("Sălaj");
    });

    it("should be accessible by county code", () => {
      // Test that we can access counties by their codes
      expect(COUNTIES["AB"]).toBeDefined();
      expect(COUNTIES["MM"]).toBeDefined();
      expect(COUNTIES["IF"]).toBeDefined();
    });

    it("should include all historical regions", () => {
      // Moldova region
      expect(COUNTIES.IS).toBeDefined();
      expect(COUNTIES.BC).toBeDefined();

      // Transylvania region
      expect(COUNTIES.CJ).toBeDefined();
      expect(COUNTIES.BV).toBeDefined();

      // Wallachia region
      expect(COUNTIES.B).toBeDefined();
      expect(COUNTIES.DB).toBeDefined();
    });

    it("should not have duplicate county names", () => {
      const names = Object.values(COUNTIES);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });
  });
});
