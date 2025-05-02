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
  confidentiality: z.boolean().refine((val) => val === true, {
    message: "Trebuie să accepți Politica de confidențialitate",
  }),
  receiveIncidentUpdates: z.boolean().optional(),
  receiveOtherIncidentUpdates: z.boolean().optional(),
  image1: z
    .instanceof(File, {
      message: "Fișierul trebuie să fie o imagine",
    })
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
          "image/webp",
        ].includes(file.type),
      { message: "Fișierul trebuie să fie o imagine" },
    )
    .optional(),
  image2: z
    .instanceof(File, {
      message: "Fișierul trebuie să fie o imagine",
    })
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
          "image/webp",
        ].includes(file.type),
      { message: "Fișierul trebuie să fie o imagine" },
    )
    .optional(),
  image4: z
    .instanceof(File, {
      message: "Fișierul trebuie să fie o imagine",
    })
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
          "image/webp",
        ].includes(file.type),
      { message: "Fișierul trebuie să fie o imagine" },
    )
    .optional(),
  image3: z
    .instanceof(File, {
      message: "Fișierul trebuie să fie o imagine",
    })
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
          "image/webp",
        ].includes(file.type),
      { message: "Fișierul trebuie să fie o imagine" },
    )
    .optional(),
});
