import { eq } from "drizzle-orm";
import { db } from "~/server/db";

import {
  incidents,
  type InsertIncident,
  type Incident,
} from "./incident.schema";
import { users } from "../users/user.schema";
import { TRPCError } from "@trpc/server";
import { normalizePhoneNumber } from "~/lib/phone";

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
      id: string;
      firstName: string;
      lastName: string;
      phone: string;
      email?: string | null;
    };
    incident: {
      confidentiality: boolean;
      latitude: number;
      longitude: number;
    };
  }) {
    return db.transaction(async (tx) => {
      // Normalize input data phone number before checking and inserting
      const normalizedPhoneNumber = normalizePhoneNumber(data.user.phone);

      // Check existing user or create new
      let user = await tx.query.users.findFirst({
        where: eq(users.phone, normalizedPhoneNumber),
      });

      if (!user) {
        [user] = await tx
          .insert(users)
          .values({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            phone: normalizedPhoneNumber,
            email: data.user.email,
          })
          .onConflictDoUpdate({
            target: users.id,
            set: {
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              email: data.user.email,
              phone: normalizedPhoneNumber,
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
          userId: user.id,
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
