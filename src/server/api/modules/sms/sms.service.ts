import {
  SNSClient,
  PublishCommand,
  type SNSClientConfig,
  type PublishCommandInput,
} from "@aws-sdk/client-sns";
import { env } from "~/env";
import type { smsOptionsSchema } from "./sms.schema";
import type { z } from "zod";
import { normalizePhoneNumber } from "~/lib/phone";

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

  private resolvePhoneNumber(rawPhone?: string | null) {
    if (!rawPhone) return null;

    try {
      return normalizePhoneNumber(rawPhone);
    } catch (error) {
      console.warn("Failed to normalize phone number, falling back to raw input", {
        rawPhone,
        error,
      });

      if (rawPhone.startsWith("+")) return rawPhone;
      if (rawPhone.startsWith("00")) return `+${rawPhone.slice(2)}`;
      return `+${rawPhone}`;
    }
  }

  /**
   * Sends an SMS message to the specified phone number or SNS topic.
   *
   * @param input - Contains the message and optional phone number.
   * @returns A promise that resolves when the SMS has been sent successfully.
   * @throws Will throw an error if the SMS fails to send or required configuration is missing.
   */
  async sendSms(input: z.infer<typeof smsOptionsSchema>) {
    const messagePrefix =
      env.NODE_ENV === "production" ? "" : `[${env.NODE_ENV.toUpperCase()}] `;

    const normalizedPhone = this.resolvePhoneNumber(input.phoneNumber);
    const message = messagePrefix + input.message;

    const commandInput: PublishCommandInput = normalizedPhone
      ? {
          Message: message,
          PhoneNumber: normalizedPhone,
        }
      : {
          Message: message,
          TopicArn: env.SNS_TOPIC_ARN,
        };

    if (!commandInput.PhoneNumber && !commandInput.TopicArn) {
      throw new Error(
        "SNS configuration missing: provide either a phone number or SNS topic ARN",
      );
    }

    const command = new PublishCommand(commandInput);

    try {
      if (env.NODE_ENV === "development") {
        console.info("Development mode: SMS sending is simulated.");
        console.info(
          `Target: ${normalizedPhone ?? env.SNS_TOPIC_ARN ?? "<no-topic>"}`,
        );
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

      console.log("SMS sent successfully", {
        target: normalizedPhone ?? env.SNS_TOPIC_ARN,
      });

      return response;
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw error;
    }
  }
}
