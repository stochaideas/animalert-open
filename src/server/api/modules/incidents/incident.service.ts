import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { incidents } from "./incident.schema";
import { users } from "../users/user.schema";
import { TRPCError } from "@trpc/server";
import { normalizePhoneNumber } from "~/lib/phone";
import { EmailService } from "../email/email.service";
import { env } from "~/env";

export class IncidentService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

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
    const result = await db.transaction(async (tx) => {
      let incident,
        user,
        isUpdate = false;

      if (data.incident.id) {
        isUpdate = true;
        if (!data.user.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User ID is required for updating the user",
          });
        }
        await tx.update(users).set(data.user).where(eq(users.id, data.user.id));
        [incident] = await tx
          .update(incidents)
          .set({
            ...data.incident,
            imageUrls: data.incident.imageUrls.filter(
              (url): url is string => url !== undefined,
            ),
          })
          .where(eq(incidents.id, data.incident.id))
          .returning();
        user = await tx.query.users.findFirst({
          where: eq(users.id, data.user.id),
        });
      } else {
        // Normalize input data phone number before checking and inserting
        const normalizedPhoneNumber = normalizePhoneNumber(data.user.phone);
        user = await tx.query.users.findFirst({
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

        [incident] = await tx
          .insert(incidents)
          .values({
            userId: user.id,
            latitude: data.incident.latitude,
            longitude: data.incident.longitude,
            receiveIncidentUpdates: data.incident.receiveIncidentUpdates,
            imageUrls: data.incident.imageUrls,
          })
          .returning();
      }

      if (user && incident) {
        const { latitude, longitude } = incident;
        const mapsUrl =
          latitude && longitude
            ? `https://www.google.com/maps?q=${latitude},${longitude}`
            : null;

        const actionType = isUpdate ? "actualizat" : "nou creat";
        const imagesCount = incident.imageUrls?.length;

        const html = `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport ${actionType} - AnimAlert</title>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#f6f6f6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f6f6;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);font-family:'Poppins',Arial,sans-serif;overflow:hidden;">
          <tr>
            <td style="background:oklch(84.42% 0.172 84.93);padding:32px 0;text-align:center;">
              <span style="font-family:'Baloo 2',Arial,sans-serif;font-size:2rem;font-weight:800;color:oklch(22.64% 0 0);letter-spacing:-1px;">
                📋 Raport ${actionType} - AnimAlert
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <!-- User Table -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.25rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
                    👤 Informații utilizator
                  </td>
                </tr>
                <tr>
                  <td style="font-weight:600;padding:6px 0;color:oklch(42.58% 0.113 130.14);">Nume complet:</td>
                  <td style="padding:6px 0;">${user.firstName} ${user.lastName}</td>
                </tr>
                <tr>
                  <td style="font-weight:600;padding:6px 0;color:oklch(42.58% 0.113 130.14);">Telefon:</td>
                  <td style="padding:6px 0;">
                    <a href="tel:${user.phone}" style="color:oklch(84.42% 0.172 84.93);text-decoration:underline;">${user.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="font-weight:600;padding:6px 0;color:oklch(42.58% 0.113 130.14);">Email:</td>
                  <td style="padding:6px 0;">${user.email ?? "Nespecificat"}</td>
                </tr>
                <tr>
                  <td style="font-weight:600;padding:6px 0;color:oklch(42.58% 0.113 130.14);">Primește alte actualizări:</td>
                  <td style="padding:6px 0;">${user.receiveOtherIncidentUpdates ? "Da" : "Nu"}</td>
                </tr>
              </table>
              <!-- Incident Table -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.25rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
                    📍 Detalii incident
                  </td>
                </tr>
                <tr>
                  <td style="font-weight:600;padding:6px 0;color:oklch(42.58% 0.113 130.14);">Status actualizări:</td>
                  <td style="padding:6px 0;">${incident.receiveIncidentUpdates ? "Activat" : "Dezactivat"}</td>
                </tr>
                <tr>
                  <td style="font-weight:600;padding:6px 0;color:oklch(42.58% 0.113 130.14);">Coordonate:</td>
                  <td style="padding:6px 0;">
                    ${incident.latitude ?? "N/A"}, ${incident.longitude ?? "N/A"}
                    ${incident.latitude && incident.longitude ? `<br><a href="https://www.google.com/maps?q=${incident.latitude},${incident.longitude}" style="color:oklch(84.42% 0.172 84.93);text-decoration:underline;">🗺️ Vezi pe Google Maps</a>` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="font-weight:600;padding:6px 0;color:oklch(42.58% 0.113 130.14);vertical-align:top;">Imagini atașate:</td>
                  <td style="padding:6px 0;">
                    ${
                      incident.imageUrls && incident.imageUrls.length > 0
                        ? `<ul style="padding-left:18px;margin:0;">${incident.imageUrls.map((url) => `<li style="margin-bottom:4px;"><a href="${url}" style="color:oklch(84.42% 0.172 84.93);text-decoration:underline;">${url.split("/").pop()}</a></li>`).join("")}</ul>`
                        : "Nicio imagine atașată"
                    }
                  </td>
                </tr>
                <tr>
                  <td style="font-weight:600;padding:6px 0;color:oklch(42.58% 0.113 130.14);">Data creării:</td>
                  <td style="padding:6px 0;">${incident.createdAt ? new Date(incident.createdAt).toLocaleString("ro-RO") : "N/A"}</td>
                </tr>
                <tr>
                  <td style="font-weight:600;padding:6px 0;color:oklch(42.58% 0.113 130.14);">Ultima actualizare:</td>
                  <td style="padding:6px 0;">${incident.updatedAt ? new Date(incident.updatedAt).toLocaleString("ro-RO") : "N/A"}</td>
                </tr>
              </table>
              <div style="font-size:0.95rem;color:#888;text-align:center;margin-top:32px;">
                Mulțumim pentru implicare!<br>Echipa AnimAlert
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

        await this.emailService.sendEmail({
          to: env.EMAIL_ADMIN,
          subject: `🚨 Raport ${actionType.toUpperCase()} - ${user.firstName} ${user.lastName}`,
          html,
          text: `
Raport ${actionType}
----------------
Utilizator: ${user.firstName} ${user.lastName}
Telefon: ${user.phone}
Email: ${user.email ?? "Nespecificat"}
Actualizări: ${user.receiveOtherIncidentUpdates ? "Da" : "Nu"}

Detalii incident
----------------
Coordonate: ${latitude ?? "N/A"}, ${longitude ?? "N/A"}
${mapsUrl ? `Harta: ${mapsUrl}` : ""}
Imagini: ${imagesCount} fișiere atașate
          `.trim(),
        });
      }
    });

    return result;
  }
}
