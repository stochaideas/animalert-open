import { z } from "zod";

export const emailOptionsSchema = z
  .object({
    to: z.union([z.string().email(), z.array(z.string().email())]),
    cc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
    subject: z.string().min(1, "Email subject is required"),
    text: z.string().optional(),
    html: z.string().optional(),
    attachments: z
      .array(
        z.object({
          filename: z.string().min(1, "Attachment filename is required"),
          content: z.union([z.string(), z.instanceof(Buffer)]),
          contentType: z.string().optional(),
        }),
      )
      .optional(),
  })
  .superRefine((val, ctx) => {
    const hasText = !!val.text;
    const hasHtml = !!val.html;

    if (!hasText && !hasHtml) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either 'text' or 'html' must be provided",
        path: ["text"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either 'text' or 'html' must be provided",
        path: ["html"],
      });
    }

    if (hasText && hasHtml) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only one of 'text' or 'html' can be provided",
        path: ["text"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only one of 'text' or 'html' can be provided",
        path: ["html"],
      });
    }
  });
