import { ContactService } from "./contact.service";
import { type contactSchema } from "./contact.schema";
import { type z } from "zod";

export class ContactController {
  private contactService: ContactService;

  constructor() {
    this.contactService = new ContactService();
  }

  async upsertContactWithUser(data: z.infer<typeof contactSchema>) {
    return this.contactService.insertContact(data);
  }
}
