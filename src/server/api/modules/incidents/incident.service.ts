import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  incidents,
  type InsertIncident,
  type Incident,
} from "./incident.schema";

export class IncidentService {
  async findAll(): Promise<Incident[]> {
    return db.select().from(incidents);
  }

  async findById(id: string): Promise<Incident | undefined> {
    const result = await db
      .select()
      .from(incidents)
      .where(eq(incidents.id, id));

    if (!result[0]) {
      throw new Error("Incident not found");
    }

    return result[0];
  }

  async create(incidentData: InsertIncident): Promise<Incident> {
    const result = await db.insert(incidents).values(incidentData).returning();

    if (!result[0]) {
      throw new Error("Failed to create incident");
    }

    return result[0];
  }

  async update(
    id: string,
    incidentData: Partial<InsertIncident>,
  ): Promise<Incident | undefined> {
    const result = await db
      .update(incidents)
      .set(incidentData)
      .where(eq(incidents.id, id))
      .returning();

    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(incidents).where(eq(incidents.id, id));

    return !!result;
  }
}
