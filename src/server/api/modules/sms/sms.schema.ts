import { z } from "zod";

export const smsOptionsSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required"),
});
