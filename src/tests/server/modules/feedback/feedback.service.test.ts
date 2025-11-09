/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FeedbackService } from "~/server/api/modules/feedback/feedback.service";
import * as dbModule from "~/server/db";

// Mock the database
vi.mock("~/server/db", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue([{ id: 1 }]),
    })),
  },
}));

describe("FeedbackService", () => {
  let feedbackService: FeedbackService;
  let mockDb: any;

  beforeEach(() => {
    vi.clearAllMocks();
    feedbackService = new FeedbackService();
    mockDb = dbModule.db;
  });

  describe("insertFeedback", () => {
    it("should insert feedback with valid data", async () => {
      const feedbackData = {
        rating: "GOOD" as const,
        text: "Great service!",
      };

      await feedbackService.insertFeedback(feedbackData);

      expect(mockDb.insert).toHaveBeenCalled();
    });

    it("should insert feedback with all rating types", async () => {
      const ratings = [
        "VERY_GOOD",
        "GOOD",
        "NEUTRAL",
        "BAD",
        "VERY_BAD",
      ] as const;

      for (const rating of ratings) {
        vi.clearAllMocks();
        await feedbackService.insertFeedback({
          rating,
          text: `Feedback for ${rating}`,
        });

        expect(mockDb.insert).toHaveBeenCalled();
      }
    });

    it("should insert feedback with long text", async () => {
      const feedbackData = {
        rating: "NEUTRAL" as const,
        text: "A".repeat(500),
      };

      await feedbackService.insertFeedback(feedbackData);

      expect(mockDb.insert).toHaveBeenCalled();
    });

    it("should insert feedback with minimal text", async () => {
      const feedbackData = {
        rating: "GOOD" as const,
        text: "Ok",
      };

      await feedbackService.insertFeedback(feedbackData);

      expect(mockDb.insert).toHaveBeenCalled();
    });

    it("should return database insert result", async () => {
      const feedbackData = {
        rating: "VERY_GOOD" as const,
        text: "Excellent!",
      };

      const result = await feedbackService.insertFeedback(feedbackData);

      expect(result).toBeDefined();
    });

    it("should propagate database errors", async () => {
      const feedbackData = {
        rating: "BAD" as const,
        text: "Not good",
      };

      const mockError = new Error("Database error");
      mockDb.insert.mockImplementation(() => ({
        values: vi.fn().mockRejectedValue(mockError),
      }));

      await expect(
        feedbackService.insertFeedback(feedbackData),
      ).rejects.toThrow("Database error");
    });
  });
});
