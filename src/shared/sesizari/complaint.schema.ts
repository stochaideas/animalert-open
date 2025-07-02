import { z } from "zod";
import { COUNTIES } from "~/constants/counties";

const countyCodes = Object.keys(COUNTIES) as [keyof typeof COUNTIES];

export const complaintSchema = z.object({
  firstName: z.string().min(1, "Prenumele este obligatoriu"),
  lastName: z.string().min(1, "Numele de familie este obligatoriu"),
  email: z.string().email("Adresa de email invalida"),

  country: z.literal("Romania"), 
  county: z.enum(countyCodes, {
    errorMap: () => ({ message: "Va rugam sa selectati un judet" }),
  }),
  city: z.string().min(1, "Orasul/Localitatea este obligatorie"),
  street: z.string().min(1, "Strada este obligatorie"),
  houseNumber: z.string().min(1, "Numarul este obligatoriu"),

  building: z.string().optional(),
  staircase: z.string().optional(),
  apartment: z.string().optional(),

  phoneNumber: z
    .string()
    .min(10, "Numarul de telefon este prea scurt")
    .max(15, "Numarul de telefon este prea lung"),

  incidentType: z.number(),
  incidentDate: z.string().optional(),
  incidentCounty: z.enum(countyCodes, {
    errorMap: () => ({ message: "Va rugam sa selectati un judet" }),
  }),
  incidentCity: z.string().optional(),
  incidentAddress: z.string().optional(),
  destinationInstitute: z
    .string()
    .min(1, "Destinatarul petitiei este obligatorie"),

  incidentDescription: z
    .string()
    .min(10, "Continutul trebuie sa aiba o lungime minima de 10 caractere"),
});
