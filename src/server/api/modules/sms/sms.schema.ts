import { z } from "zod";
import { phoneNumberRefine } from "~/lib/phone";

export const smsOptionsSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine(phoneNumberRefine, { message: "Invalid phone number" }),
  message: z
    .string()
    .min(1, "Message is required")
    .max(160, "Message cannot exceed 160 characters"),
});
