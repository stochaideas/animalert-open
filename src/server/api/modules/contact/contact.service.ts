import { type z } from "zod";
import { env } from "~/env";
import { type contactSchema } from "./contact.schema";
import { EmailService } from "../email/email.service";
import { COUNTIES } from "~/constants/counties";
import { SOLICITATION_TYPES } from "~/app/contact/_constants/solicitation-types";

export class ContactService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async insertContact(data: z.infer<typeof contactSchema>): Promise<void> {
    const countyLabel =
      COUNTIES[data.county as keyof typeof COUNTIES] ?? data.county;
    const solicitationLabel =
      (data.solicitationType in SOLICITATION_TYPES
        ? SOLICITATION_TYPES[
            data.solicitationType as keyof typeof SOLICITATION_TYPES
          ]
        : undefined) ?? data.solicitationType;

    const adminHtml = `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Nou - AnimAlert</title>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#f6f6f6;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);font-family:'Poppins',Arial,sans-serif;overflow:hidden;">
    <div style="background:oklch(84.42% 0.172 84.93);padding:32px 0;text-align:center;">
      <span style="font-family:'Baloo 2',Arial,sans-serif;font-size:2rem;font-weight:800;color:oklch(22.64% 0 0);letter-spacing:-1px;">
        📨 Contact Nou - AnimAlert
      </span>
    </div>
    <div style="padding:32px;">
      <!-- User Info -->
      <div style="margin-bottom:24px;">
        <div style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.25rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
          👤 Informații contact
        </div>
        <ul style="padding-left:18px;margin:0;list-style-type:none;">
          <li><strong>Nume:</strong> ${data.lastName} ${data.firstName}</li>
          <li><strong>Telefon:</strong> <a href="tel:${data.phone}" style="color:oklch(84.42% 0.172 84.93);text-decoration:underline;">${data.phone}</a></li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Județ:</strong> ${countyLabel}</li>
          <li><strong>Tip solicitare:</strong> ${solicitationLabel}</li>
        </ul>
      </div>
      <!-- Message Content -->
      <div style="margin-bottom:24px;">
        <div style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.25rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
          📝 Mesaj
        </div>
        <div style="padding:12px;background:#f8f8f8;border-radius:8px;">
          ${data.message
            .split("\n")
            .map((paragraph) => `<p style="margin:0 0 8px 0;">${paragraph}</p>`)
            .join("")}
        </div>
      </div>
      <div style="font-size:0.95rem;color:#888;text-align:center;margin-top:32px;">
        Acest mesaj a fost trimis prin formularul de contact de pe AnimAlert
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();

    const adminText = `
Contact Nou - AnimAlert
=======================

Informații contact:
-------------------
Nume: ${data.lastName} ${data.firstName}
Telefon: ${data.phone}
Email: ${data.email}
Județ: ${countyLabel}
Tip solicitare: ${solicitationLabel}

Mesaj:
------
${data.message}
    `.trim();

    await this.emailService.sendEmail({
      to: env.EMAIL_ADMIN,
      subject: `📩 Contact Nou - ${solicitationLabel}`,
      html: adminHtml,
      text: adminText,
    });

    const userHtml = `
  <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 32px;">
    <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #e7e7e7; padding: 32px;">
      <h2 style="color: #2d7a2d; margin-top: 0;">Mulțumim pentru mesaj!</h2>
      <p style="font-size: 1.1em; color: #333;">
        Bună, ${data.firstName}!
      </p>
      <p style="font-size: 1.1em; color: #333;">
        Îți mulțumim că ai contactat echipa <strong>AnimAlert</strong>.<br>
        Am primit mesajul tău și vom reveni cu un răspuns în cel mai scurt timp posibil.
      </p>
      <p style="font-size: 1.1em; color: #d97706; font-weight: bold; margin-top: 32px;">
        Nu uita! Dacă întâmpini o urgență, raporteaz-o <a href="https://anim-alert.org" style="color: #2563eb; text-decoration: underline;">aici</a>!
      </p>
      <p style="font-size: 1em; color: #666; margin-top: 32px;">
        Toate cele bune,<br>
        <strong>Echipa AnimAlert</strong>
      </p>
    </div>
  </div>
`.trim();

    const userText = `
Mulțumim pentru mesajul tău!

Bună, ${data.firstName}!

Îți mulțumim că ai contactat echipa AnimAlert.
Am primit mesajul tău și vom reveni cu un răspuns în cel mai scurt timp posibil.

Nu uita! Dacă întâmpini o urgență, raporteaz-o aici: https://anim-alert.org

Toate cele bune,
Echipa AnimAlert
`.trim();

    if (data.email) {
      await this.emailService.sendEmail({
        to: data.email,
        subject: "Mulțumim pentru mesajul tău - AnimAlert",
        html: userHtml,
        text: userText,
      });
    }
  }
}
