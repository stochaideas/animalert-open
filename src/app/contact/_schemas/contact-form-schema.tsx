import { z } from "zod";
import { phoneNumberSchema } from "~/lib/phone";

export const contactFormSchema = z.object({
  lastName: z.string().min(1, {
    message: "Numele de familie este necesar",
  }),
  firstName: z.string().min(1, {
    message: "Prenumele este necesar",
  }),
  phone: phoneNumberSchema,
  email: z
    .string()
    .email({
      message: "Adresa de email nu este validă",
    })
    .optional(),
  county: z.string().default("Cluj"),
  message: z.string(),
});
