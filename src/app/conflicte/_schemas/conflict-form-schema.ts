import { z } from "zod";
import { phoneNumberRefine } from "~/lib/phone";
import {
  IMAGE_MAX_SIZE,
  VIDEO_MAX_SIZE,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
} from "~/constants/file-constants";

export const conflictFormSchema = z
  .object({
    lastName: z.string().min(1, {
      message: "Numele de familie este necesar",
    }),
    firstName: z.string().min(1, {
      message: "Prenumele este necesar",
    }),
    phone: z.string().nonempty({ message: "Numărul de telefon este necesar" }),
    countryCode: z.string(),
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
          VIDEO_MAX_SIZE / (1024 * 1024 * 1024),
        )}GB`,
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validate phone number with country code
    if (!phoneNumberRefine(data.phone, data.countryCode)) {
      ctx.addIssue({
        path: ["phone"],
        code: z.ZodIssueCode.custom,
        message: "Numărul de telefon este invalid",
      });
    }

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
