import { z } from "zod";

const PHONE_PATTERN = /^\+?\d{8,15}$/;

export const smsOptionsSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(160, "Message cannot exceed 160 characters"),
  phoneNumber: z
    .string()
    .regex(PHONE_PATTERN, "Phone number must be in international format")
    .optional(),
});
