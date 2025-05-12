import { EmailService } from "./email.service";
import { type emailOptionsSchema } from "./email.schema";
import { type z } from "zod";

export class EmailController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async upsertEmailWithUser(data: z.infer<typeof emailOptionsSchema>) {
    return this.emailService.sendEmail(data);
  }
}
