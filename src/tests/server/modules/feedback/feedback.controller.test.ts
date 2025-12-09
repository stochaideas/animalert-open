import { describe, it, expect, beforeEach, vi } from "vitest";
import { FeedbackController } from "~/server/api/modules/feedback/feedback.controller";
import { FeedbackService } from "~/server/api/modules/feedback/feedback.service";
import { FEEDBACK_RATINGS } from "~/constants/feedback-ratings";

// Mock dependencies
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "development",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
  },
}));

vi.mock("~/server/db");

describe("FeedbackController", () => {
  let controller: FeedbackController;
  let mockService: FeedbackService;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new FeedbackController();
    mockService = controller.feedbackService;
  });

  it("should instantiate with FeedbackService", () => {
    expect(controller).toBeDefined();
    expect(mockService).toBeInstanceOf(FeedbackService);
  });

  describe("insertFeedback", () => {
    it("should call feedbackService.insertFeedback", async () => {
      const data = {
        rating: FEEDBACK_RATINGS["😍"],
        text: "Great service!",
      };

      const spy = vi.spyOn(mockService, "insertFeedback").mockResolvedValue([]);

      await controller.insertFeedback(data);

      expect(spy).toHaveBeenCalledWith(data);
    });
  });
});
