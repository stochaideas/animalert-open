import { z } from "zod";
import { phoneNumberSchema } from "~/lib/phone";
import {
  IMAGE_MAX_SIZE,
  VIDEO_MAX_SIZE,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
} from "~/constants/file-constants";

export const incidentFormSchema = z
  .object({
    lastName: z
      .string({
        required_error: "Numele de familie este necesar",
        invalid_type_error: "Numele de familie trebuie să fie un text",
      })
      .min(3, {
        message: "Numele de familie trebuie să aibă cel puțin 3 caractere",
      }),
    firstName: z
      .string({
        required_error: "Prenumele este necesar",
        invalid_type_error: "Prenumele trebuie să fie un text",
      })
      .min(3, {
        message: "Prenumele trebuie să aibă cel puțin 3 caractere",
      }),
    phone: phoneNumberSchema,
    email: z
      .string()
      .email({
        message: "Adresa de email nu este validă",
      })
      .or(z.literal(""))
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    confidentiality: z.boolean().refine((val) => val === true, {
      message: "Trebuie să accepți Politica de confidențialitate",
    }),
    receiveUpdates: z.boolean().optional(),
    receiveOtherReportUpdates: z.boolean().optional(),
    // Image 1
    image1: z
      .instanceof(File, {
        message: "Fișierul trebuie să fie o imagine",
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Fișierul trebuie să fie o imagine",
      })
      .refine((file) => file.size <= IMAGE_MAX_SIZE, {
        message: `Imaginea nu trebuie să depășească ${Math.round(
          IMAGE_MAX_SIZE / (1024 * 1024),
        )}MB`,
      })
      .optional(),

    // Image 2
    image2: z
      .instanceof(File, {
        message: "Fișierul trebuie să fie o imagine",
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Fișierul trebuie să fie o imagine",
      })
      .refine((file) => file.size <= IMAGE_MAX_SIZE, {
        message: `Imaginea nu trebuie să depășească ${Math.round(
          IMAGE_MAX_SIZE / (1024 * 1024),
        )}MB`,
      })
      .optional(),

    // Image 3
    image3: z
      .instanceof(File, {
        message: "Fișierul trebuie să fie o imagine",
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Fișierul trebuie să fie o imagine",
      })
      .refine((file) => file.size <= IMAGE_MAX_SIZE, {
        message: `Imaginea nu trebuie să depășească ${Math.round(
          IMAGE_MAX_SIZE / (1024 * 1024),
        )}MB`,
      })
      .optional(),

    // Video 1
    video1: z
      .instanceof(File, {
        message: "Fișierul trebuie să fie un video",
      })
      .refine((file) => ACCEPTED_VIDEO_TYPES.includes(file.type), {
        message: "Fișierul trebuie să fie un video",
      })
      .refine((file) => file.size <= VIDEO_MAX_SIZE, {
        message: `Videoclipul nu trebuie să depășească ${Math.round(
          VIDEO_MAX_SIZE / (1024 * 1024),
        )}MB`,
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.receiveUpdates) {
      if (!data.email) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message:
            "Adresa de email este necesară dacă dorești să primești actualizări pe email.",
        });
      }
    }
  });
