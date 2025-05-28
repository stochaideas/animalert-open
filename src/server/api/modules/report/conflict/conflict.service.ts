import { type upsertReportWithUserSchema } from "../report.schema";
import { EmailService } from "../../email/email.service";
import { env } from "~/env";
import { ReportService } from "../report.service";
import type { z } from "zod";
import { REPORT_TYPES } from "~/constants/report-types";

export class ConflictService extends ReportService {
  constructor() {
    super(new EmailService());
  }

  async upsertReportWithUser(data: z.infer<typeof upsertReportWithUserSchema>) {
    const result = await super.upsertReportWithUser({
      ...data,
      report: { ...data.report, reportType: REPORT_TYPES.CONFLICT },
    });

    const { user, report, isUpdate } = result;

    if (user && report) {
      const { latitude, longitude, conversation } = report;

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
      const imagesCount = report.imageKeys?.length;

      /*
        EMAIL TO BE SENT TO ADMIN
      */

      const adminHtml = `
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
          <li><strong>Primește alte actualizări:</strong> ${user.receiveOtherReportUpdates ? "Da" : "Nu"}</li>
        </ul>
      </div>
      <!-- Conflict Info -->
      <div style="margin-bottom:24px;">
        <div style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.25rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
          📍 Detalii raport conflict/interacțiune
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
                ? `<ul style="padding-left:18px;margin:0;">${report.imageKeys.map((url) => `<li style="margin-bottom:4px;"><a href="${url}" style="color:oklch(84.42% 0.172 84.93);text-decoration:underline;">${url.split("/").pop()}</a></li>`).join("")}</ul>`
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
        subject: `🚨 Raport conflict/interacțiune ${actionType.toUpperCase()} - ${report.reportNumber}`,
        html: adminHtml,
        text: `
Raport ${actionType}
----------------
Utilizator: ${user.lastName} ${user.firstName}
Telefon: ${user.phone}
Email: ${user.email ?? "Nespecificat"}
Actualizări: ${user.receiveOtherReportUpdates ? "Da" : "Nu"}

Detalii raport conflict/interacțiune
----------------
Coordonate: ${latitude ?? "N/A"}, ${longitude ?? "N/A"}
${mapsUrl ? `Harta: ${mapsUrl}` : ""}
Imagini: ${imagesCount} fișiere atașate
          `.trim(),
      });

      /*
        EMAIL TO BE SENT TO USER
      */

      if (report.receiveUpdates && user.email) {
        const userHtml = `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmare raport ${actionType} - AnimAlert</title>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#f6f6f6;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);font-family:'Poppins',Arial,sans-serif;overflow:hidden;">
    <div style="background:oklch(84.42% 0.172 84.93);padding:32px 0;text-align:center;">
      <span style="font-family:'Baloo 2',Arial,sans-serif;font-size:2rem;font-weight:800;color:oklch(22.64% 0 0);letter-spacing:-1px;">
        ✅ Raportul tău a fost ${actionType}
      </span>
    </div>
    <div style="padding:32px;">
      <div style="font-size:1.1rem;margin-bottom:24px;">
        Bună, <strong>${user.firstName}</strong>!<br>
        Îți mulțumim că ai raportat un conflict / o interacțiune pe AnimAlert. Am primit detaliile tale și vom reveni cu actualizări dacă este necesar.
      </div>
      <div style="margin-bottom:24px;">
        <div style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.15rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
          📍 Rezumat raport conflict/interacțiune
        </div>
        <ul style="padding-left:18px;margin:0;list-style-type:none;">
          <li><strong>Adresă:</strong> ${report.address ?? "Nespecificată"}</li>
          ${
            report.latitude && report.longitude
              ? `<li><a href="https://www.google.com/maps?q=${report.latitude},${report.longitude}" style="color:oklch(84.42% 0.172 84.93);text-decoration:underline;">🗺️ Vezi locația pe Google Maps</a></li>`
              : ""
          }
          <li><strong>Imagini trimise:</strong> ${
            report.imageKeys && report.imageKeys.length > 0
              ? `${report.imageKeys.length} imagine${report.imageKeys.length > 1 ? "i" : ""} atașat${report.imageKeys.length > 1 ? "e" : "ă"}`
              : "Nicio imagine atașată"
          }</li>
        </ul>
      </div>
      ${
        conversationArray.length > 0
          ? `<div style="margin-bottom:24px;">
              <div style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.15rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
                💬 Răspunsurile tale
              </div>
              <ul style="padding-left:18px;margin:0;">
                ${conversationArray
                  .map(
                    (item, idx) => `
                  <li style="margin-bottom:10px;">
                    <div style="font-weight:600;">${item?.question ?? `Pasul ${idx + 1}`}</div>
                    <div>${Array.isArray(item.answer) ? item.answer.join(", ") : item.answer}</div>
                  </li>
                `,
                  )
                  .join("")}
              </ul>
            </div>`
          : ""
      }
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
          subject: `✅ Confirmare raport conflict/interacțiune ${actionType} - AnimAlert`,
          html: userHtml,
          text: `
Salut, ${user.firstName},

Îți mulțumim că ai raportat un conflict / o interacțiune pe AnimAlert!
Raportul tău a fost ${actionType} și va fi analizat în cel mai scurt timp.

Rezumat report conflict/interacțiune:
- Adresă: ${report.address ?? "Nespecificată"}
- Locație: ${report.address ?? "Nespecificată"}
- Imagini: ${imagesCount} atașate

Dacă ai nevoie de ajutor sau vrei să adaugi detalii, răspunde la acest email.

Echipa AnimAlert
    `.trim(),
        });
      }
    }

    return result;
  }
}
