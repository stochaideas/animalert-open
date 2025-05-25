import { z } from "zod";
import { LOCATION_FOUND_OPTIONS } from "../_constants/location-found-options";
import { IS_ANIMAL_INJURED_OPTIONS } from "../_constants/is-animal-injured-options";
import { OBSERVED_SIGNS_OPTIONS } from "../_constants/observed-signs-options";
import { IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS } from "../_constants/is-in-dangerous-environment";
import { WANTS_UPDATES_OPTIONS } from "../_constants/wants-updates-options";

export const presenceReportFormSchema = z
  .object({
    observed_animal_type: z
      .string()
      .min(1, "Te rugăm să specifici tipul de animal."),
    location_found: z.enum(
      Object.keys(LOCATION_FOUND_OPTIONS) as [
        keyof typeof LOCATION_FOUND_OPTIONS,
      ],
      {
        required_error: "Te rugăm să specifici locația.",
        invalid_type_error: "Valoare invalidă pentru locație.",
      },
    ),
    location_details: z.string().optional(),
    is_animal_injured: z.enum(
      Object.keys(IS_ANIMAL_INJURED_OPTIONS) as [
        keyof typeof IS_ANIMAL_INJURED_OPTIONS,
      ],
      {
        required_error:
          "Te rugăm să selectezi dacă animalul este rănit sau afectat.",
        invalid_type_error: "Valoare invalidă pentru starea animalului.",
      },
    ),
    observed_signs: z
      .array(
        z.enum(
          Object.keys(OBSERVED_SIGNS_OPTIONS) as [
            keyof typeof OBSERVED_SIGNS_OPTIONS,
          ],
        ),
      )
      .min(1, "Te rugăm să specifici ce semne observi."),
    observed_signs_details: z.string().optional(),
    is_in_dangerous_environment: z.enum(
      Object.keys(IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS) as [
        keyof typeof IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS,
      ],
      {
        required_error: "Te rugăm să selectezi dacă mediul este periculos.",
        invalid_type_error: "Valoare invalidă pentru tipul mediului.",
      },
    ),
    observation_datetime: z
      .string()
      .min(1, "Te rugăm să specifici data și ora observației."),
    has_media: z.boolean({
      required_error:
        "Te rugăm să selectezi dacă ai fotografii sau înregistrări video.",
    }),
    wants_updates: z
      .array(
        z.enum(
          Object.keys(WANTS_UPDATES_OPTIONS) as [
            keyof typeof WANTS_UPDATES_OPTIONS,
          ],
        ),
      )
      .min(
        1,
        "Te rugăm să selectezi dacă dorești să fii contactat pentru actualizări.",
      ),
    contact_details: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.location_found === "OTHER" &&
      (!data.location_details || data.location_details.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Te rugăm să specifici detalii pentru locație.",
        path: ["location_details"],
      });
    }

    if (
      data.observed_signs.includes("OTHER") &&
      (!data.observed_signs_details ||
        data.observed_signs_details.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Te rugăm să specifici detalii pentru semnele observate.",
        path: ["observed_signs_details"],
      });
    }

    if (
      (data.wants_updates.includes("EMAIL") ||
        data.wants_updates.includes("PHONE")) &&
      (!data.contact_details || data.contact_details.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Te rugăm să specifici datele de contact.",
        path: ["contact_details"],
      });
    }
  });
