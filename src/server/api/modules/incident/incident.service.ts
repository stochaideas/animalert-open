import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { incidents } from "./incident.schema";
import { users } from "../user/user.schema";
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
      imageKeys: string[];
      conversation: string;
      address: string;
    };
  }) {
    let isUpdate = false;

    const result = await db.transaction(async (tx) => {
      let incident, user;

      if (data.incident.id) {
        isUpdate = true;
        if (!data.user.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User ID is required for updating the user",
          });
        }

        const normalizedPhoneNumber = normalizePhoneNumber(data.user.phone);
        await tx
          .update(users)
          .set({ ...data.user, phone: normalizedPhoneNumber })
          .where(eq(users.id, data.user.id));

        [incident] = await tx
          .update(incidents)
          .set({
            ...data.incident,
            imageKeys: data.incident.imageKeys.filter(
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
            imageKeys: data.incident.imageKeys,
            conversation: data.incident.conversation,
          })
          .returning();
      }

      return {
        user,
        incident,
      };
    });

    const { user, incident } = result;

    if (user && incident) {
      const { latitude, longitude, conversation } = incident;

      let conversationArray: { question: string; answer: string | string[] }[] =
        [];
      if (conversation) {
        try {
          conversationArray = JSON.parse(conversation) as {
            question: string;
            answer: string | string[];
          }[];
        } catch {
          // Optionally log the error or handle it as needed
          conversationArray = [];
        }
      }

      const mapsUrl =
        latitude && longitude
          ? `https://www.google.com/maps?q=${latitude},${longitude}`
          : null;

      const actionType = isUpdate ? "actualizat" : "nou creat";
      const imagesCount = incident.imageKeys?.length;

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
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);font-family:'Poppins',Arial,sans-serif;overflow:hidden;">
    <div style="background:oklch(84.42% 0.172 84.93);padding:32px 0;text-align:center;">
      <span style="font-family:'Baloo 2',Arial,sans-serif;font-size:2rem;font-weight:800;color:oklch(22.64% 0 0);letter-spacing:-1px;">
        📋 Raport ${actionType} - AnimAlert
      </span>
    </div>
    <div style="padding:32px;">
      <!-- User Info -->
      <div style="margin-bottom:24px;">
        <div style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.25rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
          👤 Informații utilizator
        </div>
        <ul style="padding-left:18px;margin:0;list-style-type:none;">
          <li><strong>Nume complet:</strong> ${user.lastName} ${user.firstName}</li>
          <li><strong>Telefon:</strong> <a href="tel:${user.phone}" style="color:oklch(84.42% 0.172 84.93);text-decoration:underline;">${user.phone}</a></li>
          <li><strong>Email:</strong> ${user.email ?? "Nespecificat"}</li>
          <li><strong>Primește alte actualizări:</strong> ${user.receiveOtherIncidentUpdates ? "Da" : "Nu"}</li>
        </ul>
      </div>
      <!-- Incident Info -->
      <div style="margin-bottom:24px;">
        <div style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.25rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
          📍 Detalii incident
        </div>
        <ul style="padding-left:18px;margin:0;list-style-type:none;">
          <li><strong>Status actualizări:</strong> ${incident.receiveIncidentUpdates ? "Activat" : "Dezactivat"}</li>
          <li>
            <strong>Adresă:</strong> ${incident.address ?? "Nespecificată"}
            ${
              incident.latitude && incident.longitude
                ? `<br><a href="https://www.google.com/maps?q=${incident.latitude},${incident.longitude}" style="color:oklch(84.42% 0.172 84.93);text-decoration:underline;">🗺️ Vezi pe Google Maps</a>`
                : ""
            }
          </li>
          <li>
            <strong>Imagini atașate:</strong>
            ${
              incident.imageKeys && incident.imageKeys.length > 0
                ? `<ul style="padding-left:18px;margin:0;">${incident.imageKeys.map((url) => `<li style="margin-bottom:4px;"><a href="${url}" style="color:oklch(84.42% 0.172 84.93);text-decoration:underline;">${url.split("/").pop()}</a></li>`).join("")}</ul>`
                : "Nicio imagine atașată"
            }
          </li>
          <li><strong>Data creării:</strong> ${incident.createdAt ? new Date(incident.createdAt).toLocaleString("ro-RO") : "N/A"}</li>
          <li><strong>Ultima actualizare:</strong> ${incident.updatedAt ? new Date(incident.updatedAt).toLocaleString("ro-RO") : "N/A"}</li>
        </ul>
      </div>
      <!-- Chatbot Conversation as List -->
      <div style="margin-bottom:24px;">
        <div style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.25rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
          💬 Răspunsuri utilizator (chat-bot)
        </div>
        <ul style="padding-left:18px;margin:0;">
          ${
            conversationArray.length > 0
              ? conversationArray
                  .map(
                    (item, idx) => `
                      <li style="margin-bottom:12px;">
                        <div style="font-weight:600;color:oklch(42.58% 0.113 130.14);margin-bottom:4px;">
                          ${item?.question ?? `Pasul ${idx + 1}`}
                        </div>
                        <div>
                          ${
                            Array.isArray(item.answer)
                              ? item.answer
                                  .map(
                                    (a) =>
                                      `<span style="display:inline-block;margin-right:8px;">${a}</span>`,
                                  )
                                  .join("")
                              : item.answer
                          }
                        </div>
                      </li>
                    `,
                  )
                  .join("")
              : `<li style="padding:6px 0;">Nicio răspuns înregistrat.</li>`
          }
        </ul>
      </div>
      <div style="font-size:0.95rem;color:#888;text-align:center;margin-top:32px;">
        Mulțumim pentru implicare!<br>Echipa AnimAlert
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

      await this.emailService.sendEmail({
        to: env.EMAIL_ADMIN,
        subject: `🚨 Raport ${actionType.toUpperCase()} - ${incident.incidentReportNumber}`,
        html,
        text: `
Raport ${actionType}
----------------
Utilizator: ${user.lastName} ${user.firstName}
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

      return result;
    }
  }
}
