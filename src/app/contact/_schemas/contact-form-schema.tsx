import { z } from "zod";
import { COUNTIES } from "~/constants/counties";
import { phoneNumberSchema } from "~/lib/phone";

export const contactFormSchema = z.object({
  lastName: z.string().min(1, {
    message: "Numele de familie este necesar",
  }),
  firstName: z.string().min(1, {
    message: "Prenumele este necesar",
  }),
  phone: phoneNumberSchema,
  email: z.string().email({
    message: "Adresa de email nu este validă",
  }),
  county: z.enum(Object.keys(COUNTIES) as [string, ...string[]]),
  message: z.string(),
});
