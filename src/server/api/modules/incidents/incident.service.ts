import { eq } from "drizzle-orm";
import { db } from "~/server/db";

import {
  incidents,
  type InsertIncident,
  type Incident,
} from "./incident.schema";
import { users } from "../users/user.schema";
import { TRPCError } from "@trpc/server";

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

  async createIncidentWithUser(data: {
    user: {
      phone: string;
      firstName: string;
      lastName: string;
      email?: string | null;
    };
    incident: {
      confidentiality: boolean;
      latitude: number;
      longitude: number;
    };
  }) {
    return db.transaction(async (tx) => {
      // Check existing user or create new
      let user = await tx.query.users.findFirst({
        where: eq(users.phone, data.user.phone),
      });

      if (!user) {
        [user] = await tx
          .insert(users)
          .values({
            phone: data.user.phone,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
          })
          .onConflictDoUpdate({
            target: users.phone,
            set: {
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              email: data.user.email,
            },
          })
          .returning();
      }

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      // Create incident
      const [incident] = await tx
        .insert(incidents)
        .values({
          userPhone: user.phone,
          confidentiality: data.incident.confidentiality,
          latitude: data.incident.latitude,
          longitude: data.incident.longitude,
        })
        .returning();

      return incident;
    });
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
