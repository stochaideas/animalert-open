import nodemailer, { type Transporter } from "nodemailer";
import { type z } from "zod";

import { env } from "~/env";
import { type emailOptionsSchema } from "./email.schema";
import { requireServerEnv } from "~/server/utils/env";

const environment = env.NODE_ENV;

export class EmailService {
  private transporter: Transporter | null = null;

  private getTransporter() {
    if (this.transporter) {
      return this.transporter;
    }

    const user = requireServerEnv("EMAIL_USER", env.EMAIL_USER);
    const pass = requireServerEnv("EMAIL_PASS", env.EMAIL_PASS);

    this.transporter = nodemailer.createTransport({
      service: env.NODEMAILER_SERVICE ?? "gmail",
      auth: {
        user,
        pass,
      },
    });

    return this.transporter;
  }

  /**
   * Sends an email using configured transporter
   */
  async sendEmail(data: z.infer<typeof emailOptionsSchema>): Promise<void> {
    const subjectPrefix =
      environment === "production" ? "" : `[${environment.toUpperCase()}] `;

    const transporter = this.getTransporter();
    const sender = env.EMAIL_FROM ?? env.EMAIL_USER;

    if (!sender) {
      throw new Error(
        "EMAIL_FROM environment variable is not configured. Provide EMAIL_FROM or EMAIL_USER to send emails.",
      );
    }

    await transporter.sendMail({
      from: sender,
      to: data.to,
      subject: subjectPrefix + data.subject,
      text: data.text,
      html: data.html,
      attachments: data.attachments,
    });
    console.log("Email sent successfully");
  }
}
