import nodemailer, { type Transporter } from "nodemailer";
import { type z } from "zod";

import { env } from "~/env";
import { type emailOptionsSchema } from "./email.schema";

const environment = env.NODE_ENV;

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }

  /**
   * Sends an email using configured transporter
   */
  async sendEmail(data: z.infer<typeof emailOptionsSchema>): Promise<void> {
    try {
      const subjectPrefix =
        environment === "production" ? "" : `[${environment.toUpperCase()}] `;

      await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: data.to,
        subject: subjectPrefix + data.subject,
        text: data.text,
        html: data.html,
        attachments: data.attachments,
      });
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}
