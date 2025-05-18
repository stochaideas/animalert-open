import nodemailer, { type Transporter } from "nodemailer";
import { type z } from "zod";

import { env } from "~/env";
import { type emailOptionsSchema } from "./email.schema";

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
      await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
      });
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}
