import { IncidentService } from "./incident.service";
import { TRPCError } from "@trpc/server";
import { type insertIncidentSchema } from "./incident.schema";
import { type z } from "zod";

export class IncidentController {
  private incidentService: IncidentService;

  constructor() {
    this.incidentService = new IncidentService();
  }

  async getAllIncidents() {
    return this.incidentService.findAll();
  }

  async getIncidentById(id: string) {
    const incident = await this.incidentService.findById(id);
    if (!incident) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Incident with id ${id} not found`,
      });
    }
    return incident;
  }

  async createIncident(incidentData: z.infer<typeof insertIncidentSchema>) {
    return this.incidentService.create(incidentData);
  }

  async updateIncident(
    id: string,
    incidentData: Partial<z.infer<typeof insertIncidentSchema>>,
  ) {
    const incident = await this.incidentService.update(id, incidentData);
    if (!incident) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Incident with id ${id} not found`,
      });
    }
    return incident;
  }

  async deleteIncident(id: string) {
    const success = await this.incidentService.delete(id);
    if (!success) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Incident with id ${id} not found`,
      });
    }
    return { success };
  }
}
