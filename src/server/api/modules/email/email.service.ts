import nodemailer, { type Transporter } from "nodemailer";
import { type z } from "zod";

import { env } from "~/env";
import { type emailOptionsSchema } from "./email.schema";

const environment = env.NODE_ENV;

export class EmailService {
  private transporter: Transporter;

  constructor() {
    if (env.NODE_ENV === "development") {
      // If we are in dev mode, send all the mails to mailhog.
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST ?? "mailhog",
        port: env.SMTP_PORT ?? 1025,
        secure: false,
        auth: undefined,
      });
      return;
    }
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
    const subjectPrefix =
      environment === "production" ? "" : `[${environment.toUpperCase()}] `;

    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to: data.to,
      cc: data.cc,
        subject: subjectPrefix + data.subject,
        text: data.text,
        html: data.html,
        attachments: data.attachments,
      });
      console.log("Email sent successfully");

  }
}
