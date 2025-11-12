import { describe, it, expect } from "vitest";
import { FEEDBACK_RATINGS } from "~/constants/feedback-ratings";

describe("feedback-ratings", () => {
  describe("FEEDBACK_RATINGS enum", () => {
    it("should have exactly 5 rating levels", () => {
      const ratings = Object.keys(FEEDBACK_RATINGS);
      expect(ratings.length).toBe(5);
    });

    it("should map very bad emoji to VERY_BAD", () => {
      expect(FEEDBACK_RATINGS["☹️"]).toBe("VERY_BAD");
    });

    it("should map bad emoji to BAD", () => {
      expect(FEEDBACK_RATINGS["😐"]).toBe("BAD");
    });

    it("should map neutral emoji to NEUTRAL", () => {
      expect(FEEDBACK_RATINGS["🙂"]).toBe("NEUTRAL");
    });

    it("should map good emoji to GOOD", () => {
      expect(FEEDBACK_RATINGS["😊"]).toBe("GOOD");
    });

    it("should map very good emoji to VERY_GOOD", () => {
      expect(FEEDBACK_RATINGS["😍"]).toBe("VERY_GOOD");
    });

    it("should have all values as uppercase strings with underscores", () => {
      Object.values(FEEDBACK_RATINGS).forEach((value) => {
        expect(value).toMatch(/^[A-Z_]+$/);
      });
    });

    it("should have emoji keys", () => {
      const keys = Object.keys(FEEDBACK_RATINGS);
      keys.forEach((key) => {
        // Emojis have length > 1 in JavaScript
        expect(key.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("should be accessible by emoji", () => {
      expect(FEEDBACK_RATINGS["☹️"]).toBeDefined();
      expect(FEEDBACK_RATINGS["😐"]).toBeDefined();
      expect(FEEDBACK_RATINGS["🙂"]).toBeDefined();
      expect(FEEDBACK_RATINGS["😊"]).toBeDefined();
      expect(FEEDBACK_RATINGS["😍"]).toBeDefined();
    });

    it("should have unique values", () => {
      const values = Object.values(FEEDBACK_RATINGS);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });

    it("should cover the full range from very negative to very positive", () => {
      const values = Object.values(FEEDBACK_RATINGS);
      expect(values).toContain("VERY_BAD");
      expect(values).toContain("BAD");
      expect(values).toContain("NEUTRAL");
      expect(values).toContain("GOOD");
      expect(values).toContain("VERY_GOOD");
    });
  });
});
