import { z } from "zod";
import {
  REPORT_TYPES,
  VICTIM_STATUS_INTERNAL,
  VICTIM_STATUS_PUBLIC,
} from "~/constants/report-types";

export const adminUpdateReportSchema = z.object({
  id: z.string(),
  reportNumber: z.number().optional(),
  reportType: z.nativeEnum(REPORT_TYPES).optional(),
  victimStatusInternal: z.nativeEnum(VICTIM_STATUS_INTERNAL).optional(),
  victimStatusPublic: z.nativeEnum(VICTIM_STATUS_PUBLIC).optional(),
  receiveUpdates: z.boolean().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  imageKeys: z.string().array(),
  conversation: z.string().optional(),
  address: z.string().optional(),
});
