import { eq } from "drizzle-orm";
import { db } from "~/server/db";

import { incidents } from "./incident.schema";
import { users } from "../users/user.schema";
import { TRPCError } from "@trpc/server";
import { normalizePhoneNumber } from "~/lib/phone";

export class IncidentService {
  async upsertIncidentWithUser(data: {
    user: {
      id?: string;
      firstName: string;
      lastName: string;
      phone: string;
      email?: string;
      receiveOtherIncidentUpdates: boolean;
    };
    incident: {
      id?: string;
      latitude?: number;
      longitude?: number;
      receiveIncidentUpdates: boolean;
      imageUrls: string[];
    };
  }) {
    return db.transaction(async (tx) => {
      if (data.incident.id) {
        if (!data.user.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User ID is required for updating the user",
          });
        }
        await tx.update(users).set(data.user).where(eq(users.id, data.user.id));

        const [incident] = await tx
          .update(incidents)
          .set({
            ...data.incident,
            imageUrls: data.incident.imageUrls.filter(
              (url): url is string => url !== undefined,
            ),
          })
          .where(eq(incidents.id, data.incident.id))
          .returning();

        return incident;
      }

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
          latitude: data.incident.latitude,
          longitude: data.incident.longitude,
          receiveIncidentUpdates: data.incident.receiveIncidentUpdates,
          imageUrls: data.incident.imageUrls,
        })
        .returning();

      return incident;
    });
  }
}
