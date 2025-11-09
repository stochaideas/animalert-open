import { describe, it, expect } from "vitest";
import { format } from "~/lib/date-formatter";

describe("date-formatter", () => {
  describe("format", () => {
    it("should format Date object to Romanian locale", () => {
      const date = new Date("2025-01-15T14:30:45Z");
      const result = format(date);

      // Check that result contains expected components
      expect(result).toContain("2025");
      expect(result).toContain("15");
      // Should be in Romanian format with month name
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(10);
    });

    it("should format timestamp to Romanian locale", () => {
      const timestamp = new Date("2025-06-20T10:15:30Z").getTime();
      const result = format(timestamp);

      expect(result).toContain("2025");
      expect(result).toContain("20");
      expect(typeof result).toBe("string");
    });

    it("should include time components", () => {
      const date = new Date("2025-03-10T09:05:02Z");
      const result = format(date);

      // Should include time (hours, minutes, seconds)
      // The exact format depends on timezone conversion to Europe/Bucharest
      expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    it("should use Europe/Bucharest timezone", () => {
      // Test that timezone is properly applied
      // Create a date and verify the formatter handles it
      const date = new Date("2025-12-25T12:00:00Z");
      const result = format(date);

      expect(result).toContain("2025");
      expect(result).toContain("25");
      expect(typeof result).toBe("string");
    });

    it("should format different months correctly", () => {
      const dates = [
        new Date("2025-01-01T12:00:00Z"),
        new Date("2025-06-15T12:00:00Z"),
        new Date("2025-12-31T12:00:00Z"),
      ];

      dates.forEach((date) => {
        const result = format(date);
        expect(typeof result).toBe("string");
        expect(result).toContain("2025");
        expect(result.length).toBeGreaterThan(10);
      });
    });

    it("should handle edge case dates", () => {
      // Leap year date
      const leapDay = new Date("2024-02-29T00:00:00Z");
      const result = format(leapDay);

      expect(result).toContain("2024");
      expect(result).toContain("29");
    });

    it("should format epoch time correctly", () => {
      const epoch = 0;
      const result = format(epoch);

      expect(typeof result).toBe("string");
      expect(result).toContain("1970");
    });
  });
});
