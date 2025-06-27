import { z } from "zod";

export const complaintSchema = z.object({
  // complaintData: z.object({
  //   name: z.string(),
  //   email: z.string(),
  //   phoneNumber: z.string(),
  //   address: z.string(),
  //   generationDate: z.date(),
  //   species: z.string().optional(),
  //   destinationInstitute: z.string(),
  //   subject: z.string(),
  //   incidentDate: z.string(),
  //   incidentLocation: z.string(),
  //   incidentDescription: z.string(),
  //   attachments: z.string(),
  // }),
  template: z.string(),
});
