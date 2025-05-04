import { IncidentService } from "./incident.service";
import { type upsertIncidentWithUserSchema } from "./incident.schema";
import { type z } from "zod";

export class IncidentController {
  private incidentService: IncidentService;

  constructor() {
    this.incidentService = new IncidentService();
  }

  async upsertIncidentWithUser(
    data: z.infer<typeof upsertIncidentWithUserSchema>,
  ) {
    return this.incidentService.upsertIncidentWithUser(data);
  }
}
