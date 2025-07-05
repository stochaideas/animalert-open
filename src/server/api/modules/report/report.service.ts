import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { reports, type upsertReportWithUserSchema } from "./report.schema";
import { users } from "../user/user.schema";
import { TRPCError } from "@trpc/server";
import { normalizePhoneNumber } from "~/lib/phone";
import { type EmailService } from "../email/email.service";
import {
  handlePostgresError,
  type PostgresError,
} from "~/server/db/postgres-error";
import type { z } from "zod";
import type { S3Service } from "../s3/s3.service";
import { streamToBuffer } from "~/lib/stream-to-buffer";
import type { Readable } from "stream";
import { env } from "~/env";
import { REPORT_TYPES } from "~/constants/report-types";

export class ReportService {
  protected emailService: EmailService;
  protected s3Service: S3Service;

  constructor(emailService: EmailService, s3Service: S3Service) {
    this.emailService = emailService;
    this.s3Service = s3Service;
  }

  async upsertReportWithUser(data: z.infer<typeof upsertReportWithUserSchema>) {
    let isUpdate = false;

    const result = await db.transaction(async (tx) => {
      try {
        let report, user;

        if (data.report.id) {
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

          [report] = await tx
            .update(reports)
            .set({
              ...data.report,
              imageKeys: data.report.imageKeys.filter(
                (url): url is string => url !== undefined,
              ),
            })
            .where(eq(reports.id, data.report.id))
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

          [report] = await tx
            .insert(reports)
            .values({
              userId: user.id,
              reportType: data.report.reportType,
              latitude: data.report.latitude,
              longitude: data.report.longitude,
              receiveUpdates: data.report.receiveUpdates,
              imageKeys: data.report.imageKeys,
              conversation: data.report.conversation,
            })
            .returning();
        }

        return {
          user,
          report,
          isUpdate,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        handlePostgresError(error as PostgresError);
      }
    });

    await this.sendReportEmail(result);

    return result;
  }

  protected getEmailTemplates(reportType: REPORT_TYPES, actionType: string) {
    let subjectPrefix = "";
    let adminTitle = "";
    let userTitle = "";
    let userThanks = "";
    switch (reportType) {
      case REPORT_TYPES.PRESENCE:
        subjectPrefix = "Raport prezență";
        adminTitle = `📋 Raport ${actionType} - AnimAlert`;
        userTitle = `✅ Raportul tău de prezență a fost ${actionType}`;
        userThanks = "Îți mulțumim că ai raportat o prezență pe AnimAlert.";
        break;
      case REPORT_TYPES.INCIDENT:
        subjectPrefix = "Raport incident";
        adminTitle = `🚨 Incident ${actionType} - AnimAlert`;
        userTitle = `✅ Raportul tău de incident a fost ${actionType}`;
        userThanks = "Îți mulțumim că ai raportat un incident pe AnimAlert.";
        break;
      case REPORT_TYPES.CONFLICT:
        subjectPrefix = "Raport conflict/interacțiune";
        adminTitle = `⚠️ Conflict/Interacțiune ${actionType} - AnimAlert`;
        userTitle = `✅ Raportul tău de conflict/interacțiune a fost ${actionType}`;
        userThanks =
          "Îți mulțumim că ai raportat un conflict/o interacțiune pe AnimAlert.";
        break;
      default:
        subjectPrefix = "Raport";
        adminTitle = `📋 Raport ${actionType} - AnimAlert`;
        userTitle = `✅ Raportul tău a fost ${actionType}`;
        userThanks = "Îți mulțumim pentru raportul trimis pe AnimAlert.";
    }
    return {
      subjectPrefix,
      adminTitle,
      userTitle,
      userThanks,
    };
  }

  protected async sendReportEmail(result: {
    user:
      | {
          id: string;
          firstName: string;
          lastName: string;
          phone: string;
          email: string | null;
          receiveOtherReportUpdates: boolean | null;
        }
      | undefined;
    report:
      | {
          id: string;
          reportNumber: number;
          reportType: string;
          latitude?: number | null;
          longitude?: number | null;
          address?: string | null;
          conversation?: string | null;
          receiveUpdates: boolean | null;
          imageKeys?: string[] | null;
          createdAt?: Date | null;
          updatedAt?: Date | null;
        }
      | undefined;
    isUpdate?: boolean;
  }) {
    const { user, report, isUpdate } = result;

    if (!user || !report) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User or report data is missing",
      });
    }

    const { latitude, longitude, conversation, reportType } = report;

    let conversationArray: {
      question: string;
      answer: string | string[];
    }[] = [];
    if (conversation) {
      try {
        conversationArray = JSON.parse(conversation) as {
          question: string;
          answer: string | string[];
        }[];
      } catch {
        conversationArray = [];
      }
    }

    const mapsUrl =
      latitude && longitude
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : null;

    const actionType = isUpdate ? "actualizat" : "nou creat";
    const imagesCount = report.imageKeys?.length;

    const { subjectPrefix, adminTitle, userTitle, userThanks } =
      this.getEmailTemplates(reportType as REPORT_TYPES, actionType);

    const attachments = [];

    if (report.imageKeys && report.imageKeys.length > 0) {
      for (const [idx, key] of report.imageKeys.entries()) {
        const s3ObjectResponse = await this.s3Service.getObject(key);
        const buffer = await streamToBuffer(s3ObjectResponse.Body as Readable);
        const contentType =
          s3ObjectResponse.ContentType ?? "application/octet-stream";
        const filename = `file-${idx + 1}`;
        attachments.push({
          filename: filename + "." + contentType.split("/")[1],
          content: buffer,
          contentType,
        });
      }
    }

    /*
      EMAIL TO BE SENT TO ADMIN
    */

    const adminHtml = `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${adminTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#f6f6f6;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);font-family:'Poppins',Arial,sans-serif;overflow:hidden;">
    <div style="background:oklch(84.42% 0.172 84.93);padding:32px 0;text-align:center;">
      <span style="font-family:'Baloo 2',Arial,sans-serif;font-size:2rem;font-weight:800;color:oklch(22.64% 0 0);letter-spacing:-1px;">
        ${adminTitle}
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
          <li><strong>Primește alte actualizări:</strong> ${user.receiveOtherReportUpdates ? "Da" : "Nu"}</li>
        </ul>
      </div>
      <!-- Presence Info -->
      <div style="margin-bottom:24px;">
        <div style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.25rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
          📍 Detalii raport prezență
        </div>
        <ul style="padding-left:18px;margin:0;list-style-type:none;">
          <li><strong>Status actualizări:</strong> ${report.receiveUpdates ? "Activat" : "Dezactivat"}</li>
          <li>
            <strong>Adresă:</strong> ${report.address ?? "Nespecificată"}
            ${
              report.latitude && report.longitude
                ? `<br><a href="https://www.google.com/maps?q=${report.latitude},${report.longitude}" style="color:oklch(84.42% 0.172 84.93);text-decoration:underline;">🗺️ Vezi pe Google Maps</a>`
                : ""
            }
          </li>
          <li>
            <strong>Imagini atașate:</strong>
            ${
              report.imageKeys && report.imageKeys.length > 0
                ? `<ul style="padding-left:18px;margin:0;">
                  ${report.imageKeys
                    .map(
                      (url, idx) =>
                        `<li style="margin-bottom:4px;">
                          <a href="${url}" style="color:oklch(84.42% 0.172 84.93);text-decoration:underline;">
                            fișier ${idx + 1}
                          </a>
                        </li>`,
                    )
                    .join("")}
                </ul>`
                : "Nicio imagine atașată"
            }
          </li>
          <li><strong>Data creării:</strong> ${report.createdAt ? new Date(report.createdAt).toLocaleString("ro-RO") : "N/A"}</li>
          <li><strong>Ultima actualizare:</strong> ${report.updatedAt ? new Date(report.updatedAt).toLocaleString("ro-RO") : "N/A"}</li>
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
              : `<li style="padding:6px 0;">Niciun răspuns înregistrat.</li>`
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
      subject: `🚨 ${subjectPrefix} ${actionType.toUpperCase()} - ${report.reportNumber}`,
      html: adminHtml,
      text: `
${adminTitle}
----------------
Utilizator: ${user.lastName} ${user.firstName}
Telefon: ${user.phone}
Email: ${user.email ?? "Nespecificat"}
Actualizări: ${user.receiveOtherReportUpdates ? "Da" : "Nu"}

Detalii raport
----------------
Coordonate: ${latitude ?? "N/A"}, ${longitude ?? "N/A"}
${mapsUrl ? `Harta: ${mapsUrl}` : ""}
Imagini: ${imagesCount} fișiere atașate
          `.trim(),
      attachments: attachments,
    });

    /*
      EMAIL TO BE SENT TO USER
    */

    if (actionType === "nou creat" && report.receiveUpdates && user.email) {
      const userHtml = `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${userTitle} - AnimAlert</title>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#f6f6f6;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);font-family:'Poppins',Arial,sans-serif;overflow:hidden;">
    <div style="background:oklch(84.42% 0.172 84.93);padding:32px 0;text-align:center;">
      <span style="font-family:'Baloo 2',Arial,sans-serif;font-size:2rem;font-weight:800;color:oklch(22.64% 0 0);letter-spacing:-1px;">
        ${userTitle}
      </span>
    </div>
    <div style="padding:32px;">
      <div style="font-size:1.1rem;margin-bottom:24px;">
        Bună, <strong>${user.firstName}</strong>!<br>
        ${userThanks} Am primit detaliile tale și vom reveni cu actualizări dacă este necesar.
      </div>
      <div style="font-size:0.95rem;color:#888;text-align:center;margin-top:32px;">
        Dacă ai întrebări sau dorești să adaugi detalii, răspunde la acest email sau contactează-ne.<br>
        Mulțumim pentru implicare!<br>
        Echipa AnimAlert
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

      await this.emailService.sendEmail({
        to: user.email,
        subject: `✅ ${subjectPrefix} ${actionType} - AnimAlert`,
        html: userHtml,
        text: `
Salut, ${user.firstName},

${userThanks}
Raportul tău a fost ${actionType} și va fi analizat în cel mai scurt timp.

Dacă ai nevoie de ajutor sau vrei să adaugi detalii, răspunde la acest email.

Echipa AnimAlert
    `.trim(),
      });
    }
  }
}
