import { z } from "zod";

export const smsOptionsSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(160, "Message cannot exceed 160 characters"),
});
