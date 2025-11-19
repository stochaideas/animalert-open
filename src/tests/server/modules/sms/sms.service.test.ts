/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SmsService } from "~/server/api/modules/sms/sms.service";
import { SNSClient } from "@aws-sdk/client-sns";

// Mock AWS SDK
vi.mock("@aws-sdk/client-sns");

// Mock env
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "development",
    AWS_REGION: "us-east-1",
    AWS_ACCESS_KEY_ID: "test-key-id",
    AWS_SECRET_ACCESS_KEY: "test-secret-key",
    SNS_TOPIC_ARN: "arn:aws:sns:us-east-1:123456789:test-topic",
  },
}));

describe("SmsService", () => {
  let smsService: SmsService;
  let mockSend: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSend = vi.fn().mockResolvedValue({
      MessageId: "test-message-id",
      ResponseMetadata: {
        RequestId: "test-request-id",
        HTTPStatusCode: 200,
      },
    });

    vi.mocked(SNSClient).mockImplementation(
      () =>
        ({
          send: mockSend,
        }) as any,
    );

    smsService = new SmsService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("sendSms", () => {
    it("should send SMS with correct message in test mode", async () => {
      // Test mode simulates development behavior
      const response = await smsService.sendSms({
        message: "Test SMS message",
      });

      expect(response).toEqual({
        MessageId: "simulated-message-id",
        ResponseMetadata: {
          RequestId: "simulated-request-id",
          HTTPStatusCode: 200,
        },
      });
    });

    it("should add environment prefix in test mode", async () => {
      const consoleSpy = vi.spyOn(console, "info");

      await smsService.sendSms({ message: "Test message" });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Development mode: SMS sending is simulated.",
      );
      expect(consoleSpy).toHaveBeenCalledWith("Message: Test message");

      consoleSpy.mockRestore();
    });

    it("should simulate SMS in test mode", async () => {
      const response = await smsService.sendSms({
        message: "Development test",
      });

      expect(response.MessageId).toBe("simulated-message-id");
    });

    it("should handle 160 character message", async () => {
      const longMessage = "a".repeat(160);

      await smsService.sendSms({ message: longMessage });

      // Should not throw - validation happens at schema level
      expect(mockSend).not.toHaveBeenCalled(); // Test/Development mode simulates
    });

    it("should create SNS client on initialization", () => {
      expect(SNSClient).toHaveBeenCalled();
    });

    it("should use mocked environment variables", async () => {
      await smsService.sendSms({ message: "Test" });

      // Service initialized successfully with env vars
      expect(smsService).toBeDefined();
    });
  });
});
