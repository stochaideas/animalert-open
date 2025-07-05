import { z } from "zod";
import { COUNTIES } from "~/constants/counties";
import { phoneNumberSchema } from "~/lib/phone";
import { SOLICITATION_TYPES } from "~/app/contact/_constants/solicitation-types";

export const contactSchema = z.object({
  lastName: z.string(),
  firstName: z.string(),
  phone: phoneNumberSchema,
  email: z.string().email(),
  county: z.enum(Object.keys(COUNTIES) as [string, ...string[]]),
  solicitationType: z.enum(
    Object.keys(SOLICITATION_TYPES) as [string, ...string[]],
  ),
  message: z.string(),
});
