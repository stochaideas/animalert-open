import { z } from "zod";
import { COUNTIES } from "~/constants/counties";
import { phoneNumberSchema } from "~/lib/phone";
import { SOLICITATION_TYPES } from "../_constants/solicitation-types";

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
    .min(1, {
      message: "Adresa de email este necesară",
    }),
  county: z.enum(Object.keys(COUNTIES) as [string, ...string[]], {
    errorMap: () => ({ message: "Județul este necesar" }),
  }),
  solicitationType: z.enum(
    Object.keys(SOLICITATION_TYPES) as [string, ...string[]],
    {
      errorMap: () => ({ message: "Tipul solicitării este necesar" }),
    },
  ),
  message: z.string().min(1, {
    message: "Mesajul este necesar",
  }),
});
