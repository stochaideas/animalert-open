import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  IMAGE_MAX_SIZE,
  VIDEO_MAX_SIZE,
} from "~/constants/file-constants";

export const presignedUrlSchema = z
  .object({
    fileName: z.string(),
    fileType: z.string(),
    fileSize: z.number().int().positive(),
  })
  .superRefine((data, ctx) => {
    const isValidType = ACCEPTED_IMAGE_TYPES.concat(
      ACCEPTED_VIDEO_TYPES,
    ).includes(data.fileType);

    if (!isValidType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tip fișier invalid",
        path: ["fileType"],
      });
    }

    if (ACCEPTED_IMAGE_TYPES.includes(data.fileType)) {
      if (data.fileSize > IMAGE_MAX_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Imaginea nu trebuie să depășească ${IMAGE_MAX_SIZE / 1024 / 1024}MB`,
          path: ["fileSize"],
        });
      }
    } else if (ACCEPTED_VIDEO_TYPES.includes(data.fileType)) {
      if (data.fileSize > VIDEO_MAX_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Videoclipul nu trebuie să depășească ${VIDEO_MAX_SIZE / 1024 / 1024 / 1024}GB`,
          path: ["fileSize"],
        });
      }
    }
  });
