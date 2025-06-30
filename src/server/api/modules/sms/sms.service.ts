import {
  SNSClient,
  PublishCommand,
  type SNSClientConfig,
} from "@aws-sdk/client-sns";
import { env } from "~/env";

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
              accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
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
  async sendSms(message: string) {
    const command = new PublishCommand({
      Message: message,
      TopicArn: env.SNS_TOPIC_ARN,
    });

    try {
      const response = await this.snsClient.send(command);
      return response;
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw error;
    }
  }
}
