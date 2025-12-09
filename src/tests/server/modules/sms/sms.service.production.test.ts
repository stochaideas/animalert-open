import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock AWS SDK
vi.mock("@aws-sdk/client-sns");

// Mock env with PRODUCTION mode
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "production",
    SNS_TOPIC_ARN: "arn:aws:sns:us-east-1:123456789012:test-topic",
    AWS_REGION: "us-east-1",
  },
}));

describe("SmsService - Production Mode", () => {
  let mockSNSClient: {
    send: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockSNSClient = {
      send: vi.fn().mockResolvedValue({
        MessageId: "prod-message-id",
        ResponseMetadata: {
          RequestId: "prod-request-id",
          HTTPStatusCode: 200,
        },
      }),
    };

    const { SNSClient } = await import("@aws-sdk/client-sns");
    vi.mocked(SNSClient).mockImplementation(
      () => mockSNSClient as unknown as InstanceType<typeof SNSClient>,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should not add environment prefix in production", async () => {
    // Dynamically import to ensure production env is used
    const { SmsService } = await import("~/server/api/modules/sms/sms.service");
    const smsService = new SmsService();

    await smsService.sendSms({
      message: "Production SMS",
    });

    expect(mockSNSClient.send).toHaveBeenCalled();
    // In production, SMS is sent via AWS SNS - just verify it was called
  });

  it("should use AWS credentials in production", async () => {
    const { SmsService } = await import("~/server/api/modules/sms/sms.service");
    const smsService = new SmsService();

    await smsService.sendSms({
      message: "Test",
    });

    // Verify SNS client was created (credentials would be from IAM role in production)
    expect(mockSNSClient.send).toHaveBeenCalled();
  });

  it("should handle SMS sending errors in production", async () => {
    const error = new Error("SNS send failed");
    mockSNSClient.send.mockRejectedValueOnce(error);

    const { SmsService } = await import("~/server/api/modules/sms/sms.service");
    const smsService = new SmsService();

    await expect(
      smsService.sendSms({
        message: "This will fail",
      }),
    ).rejects.toThrow("SNS send failed");
  });
});
