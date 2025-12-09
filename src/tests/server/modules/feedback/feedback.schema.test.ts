/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from "vitest";
import { feedbackSchema } from "~/server/api/modules/feedback/feedback.schema";
import { FEEDBACK_RATINGS } from "~/constants/feedback-ratings";

describe("feedbackSchema", () => {
  const validData = {
    rating: FEEDBACK_RATINGS["😊"],
    text: "Great experience!",
  };

  it("should validate correct feedback data", () => {
    const result = feedbackSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should require rating", () => {
    const { rating: _rating, ...rest } = validData;
    const result = feedbackSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("should require text", () => {
    const { text: _text, ...rest } = validData;
    const result = feedbackSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("should validate rating is from enum", () => {
    const result = feedbackSchema.safeParse({
      rating: "INVALID_RATING",
      text: "Test",
    });
    expect(result.success).toBe(false);
  });

  it("should accept all valid feedback ratings", () => {
    Object.values(FEEDBACK_RATINGS).forEach((rating) => {
      const result = feedbackSchema.safeParse({
        rating,
        text: "Test feedback",
      });
      expect(result.success).toBe(true);
    });
  });

  it("should accept optional id", () => {
    const result = feedbackSchema.safeParse({
      ...validData,
      id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("should accept empty text string", () => {
    const result = feedbackSchema.safeParse({
      rating: FEEDBACK_RATINGS["😊"],
      text: "",
    });
    expect(result.success).toBe(true);
  });

  it("should accept long text", () => {
    const result = feedbackSchema.safeParse({
      rating: FEEDBACK_RATINGS["😊"],
      text: "a".repeat(1000),
    });
    expect(result.success).toBe(true);
  });

  it("should accept text with special characters", () => {
    const result = feedbackSchema.safeParse({
      rating: FEEDBACK_RATINGS["😊"],
      text: "Special chars: !@#$%^&*()_+-=[]{}|;':\",./<>? și ăîșțâ",
    });
    expect(result.success).toBe(true);
  });

  it("should accept text with newlines", () => {
    const result = feedbackSchema.safeParse({
      rating: FEEDBACK_RATINGS["😊"],
      text: "Line 1\nLine 2\nLine 3",
    });
    expect(result.success).toBe(true);
  });
});
