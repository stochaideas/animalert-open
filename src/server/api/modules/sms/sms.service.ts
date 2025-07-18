import {
  SNSClient,
  PublishCommand,
  type SNSClientConfig,
} from "@aws-sdk/client-sns";
import { env } from "~/env";
import type { smsOptionsSchema } from "./sms.schema";
import type { z } from "zod";

export class SmsService {
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = this.createSnsClient();
  }

  private createSnsClient() {
    const config: SNSClientConfig = {
      region: process.env.AWS_REGION,
      credentials:
        env.NODE_ENV === "development"
          ? {
              accessKeyId: env.AWS_ACCESS_KEY_ID ?? "",
              secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "",
            }
          : undefined,
    };

    return new SNSClient(config);
  }

  /**
   * Sends an SMS message to the specified phone number using AWS SNS.
   *
   * @param phoneNumber - The recipient's phone number in E.164 format (e.g., "+1234567890").
   * @param message - The content of the SMS message to be sent.
   * @returns A promise that resolves when the SMS has been sent successfully.
   * @throws Will throw an error if the SMS fails to send.
   */
  async sendSms(input: z.infer<typeof smsOptionsSchema>) {
    const messagePrefix =
      env.NODE_ENV === "production" ? "" : `[${env.NODE_ENV.toUpperCase()}] `;

    const command = new PublishCommand({
      Message: messagePrefix + input.message,
      TopicArn: env.SNS_TOPIC_ARN,
    });

    try {
      // Simulate SMS sending in development mode
      if (env.NODE_ENV === "development") {
        console.info("Development mode: SMS sending is simulated.");
        console.info(`Message: ${input.message}`);
        return Promise.resolve({
          MessageId: "simulated-message-id",
          ResponseMetadata: {
            RequestId: "simulated-request-id",
            HTTPStatusCode: 200,
          },
        });
      }

      const response = await this.snsClient.send(command);

      console.log("SMS sent successfully");

      return response;
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw error;
    }
  }
}
