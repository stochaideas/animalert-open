// External dependencies
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { z } from "zod";

// Application-specific modules
import { db } from "~/server/db";
import { reports, type upsertReportWithUserSchema } from "./report.schema";
import { users } from "../user/user.schema";
import { normalizePhoneNumber } from "~/lib/phone";
import { env } from "~/env";
import { REPORT_TYPES } from "~/constants/report-types";
import { format } from "~/lib/date-formatter";

// Service and error handling types
import { type EmailService } from "../email/email.service";
import type { S3Service } from "../s3/s3.service";
import type { SmsService } from "../sms/sms.service";
import {
  handlePostgresError,
  type PostgresError,
} from "~/server/db/postgres-error";
import type { User } from "@clerk/nextjs/server";

/**
 * Service for handling report creation, updates, notifications, and file retrieval.
 */
export class ReportService {
  protected emailService: EmailService;
  protected s3Service: S3Service;
  protected smsService: SmsService;

  /**
   * Creates an instance of the service and injects required dependencies.
   *
   * @param emailService - Service responsible for sending emails.
   * @param s3Service - Service for interacting with AWS S3 storage.
   * @param smsService - Service responsible for sending SMS messages.
   */
  constructor(
    emailService: EmailService,
    s3Service: S3Service,
    smsService: SmsService,
  ) {
    this.emailService = emailService;
    this.s3Service = s3Service;
    this.smsService = smsService;
  }

  /**
   * Retrieves a single report from the database by its unique identifier.
   *
   * @param id - The unique identifier of the report to retrieve.
   * @returns A promise that resolves to the report object if found, or `null` if no report matches the given ID.
   */
  async getReport(user: User | null, id: string) {
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User must be authenticated to access reports.",
      });
    }

    const currentUserEmail = user?.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    )?.emailAddress;

    if (!currentUserEmail) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User email not found or not verified.",
      });
    }

    // Query report joined with user email by report ID
    const result = await db
      .select({
        report: reports,
        user: users,
      })
      .from(reports)
      .leftJoin(users, eq(reports.userId, users.id))
      .where(eq(reports.id, id))
      .limit(1);

    if (!result.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Report with id ${id} not found`,
      });
    }

    // Validate if emails match
    if (
      result[0]?.user?.email !== currentUserEmail &&
      user.publicMetadata.role !== "admin"
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to access this report.",
      });
    }

    // Return the matched report (you may want to include user info too if needed)
    return result[0]?.report;
  }

  /**
   * Retrieves all reports associated with a specific user by their email address.
   *
   * @param email - The email address of the user whose reports are to be fetched.
   * @returns A promise that resolves to an array of report objects, each including the associated user information, ordered by creation date in descending order.
   */
  async getReportsByUser(user: User | null) {
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User must be authenticated to access reports.",
      });
    }

    const currentUserEmail = user?.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    )?.emailAddress;

    if (!currentUserEmail) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User email not found or not verified.",
      });
    }

    return await db
      .select({ report: reports })
      .from(reports)
      .leftJoin(users, eq(reports.userId, users.id))
      .where(eq(users.email, currentUserEmail))
      .orderBy(desc(reports.createdAt));
  }

  /**
   * Creates or updates a report and its associated user in a single transaction.
   *
   * - If `data.report.id` is provided, updates the existing report and user.
   * - If `data.report.id` is not provided, creates a new user (if not found by phone) and a new report.
   * - Normalizes the user's phone number before database operations.
   * - Throws a `TRPCError` if required user information is missing or if user creation fails.
   * - On update, sends an admin SMS notification for certain report types.
   *
   * @param data - The input data containing user and report information, validated by `upsertReportWithUserSchema`.
   * @returns An object containing the user, report, and a boolean `isUpdate` indicating if the operation was an update.
   * @throws {TRPCError} If required fields are missing or if a database error occurs.
   */
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

          // Ensure phone number is normalized before updating
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

        // Handle and rethrow Postgres-specific errors
        handlePostgresError(error as PostgresError);
      }
    });

    // Send notification emails after transaction
    await this.sendReportEmail(result);

    const reportType = result.report?.reportType as REPORT_TYPES;
    const conversation = result.report?.conversation;

    // Send admin SMS notification for specific scenarios
    if (
      isUpdate &&
      (reportType === REPORT_TYPES.PRESENCE ||
        reportType === REPORT_TYPES.CONFLICT ||
        (reportType === REPORT_TYPES.INCIDENT &&
          conversation &&
          Array.isArray(JSON.parse(conversation) as unknown[]) &&
          (JSON.parse(conversation) as unknown[]).length > 0))
    ) {
      await this.sendAdminReportSms(result.report?.reportNumber);
    }

    return result;
  }

  /**
   * Generates localized email template strings (subject prefix, admin title, user title, and user thank you message)
   * based on the provided report type and action type.
   *
   * @param reportType - The type of report (e.g., PRESENCE, INCIDENT, CONFLICT) from the REPORT_TYPES enum.
   * @param actionType - A string describing the action performed (e.g., "creat", "actualizat").
   * @returns An object containing the following template strings:
   *   - subjectPrefix: The prefix for the email subject line.
   *   - adminTitle: The title used in emails sent to administrators.
   *   - userTitle: The title used in emails sent to users.
   *   - userThanks: A thank you message for the user.
   *
   * @remarks
   * This method is used to ensure consistent and context-aware email content for both admins and users,
   * adapting the message to the specific type of report and action performed.
   *
   * @example
   * const templates = this.getEmailTemplates(REPORT_TYPES.PRESENCE, "nou creat");
   * // templates.subjectPrefix === "Raport prezență"
   * // templates.adminTitle === "📋 Raport creat - AnimAlert"
   * // templates.userTitle === "✅ Raportul tău de prezență a fost creat"
   * // templates.userThanks === "Îți mulțumim că ai raportat o prezență pe AnimAlert."
   */
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

  /**
   * Sends detailed report emails to both the admin and the reporting user, including all relevant report and user information,
   * formatted for both HTML and plain text, and handles attachments and error scenarios.
   *
   * @param result - An object containing:
   *   - user: The reporting user's details (id, name, phone, email, notification preferences).
   *   - report: The report details (id, number, type, coordinates, address, conversation, update preferences, images, timestamps).
   *   - isUpdate (optional): Boolean indicating if the report is an update or a new creation.
   * @throws {TRPCError} Throws an error with code "INTERNAL_SERVER_ERROR" if user or report data is missing.
   * @remarks
   * This method generates and sends two types of emails:
   *   1. **Admin Email**: Contains comprehensive report and user details, chatbot Q&A, and attaches images if present. If the email size exceeds limits, retries without attachments.
   *   2. **User Email**: Sent only for new reports when the user has opted in for updates and provided an email. Includes a thank you message and confirmation.
   *
   * The method also parses chatbot conversation data, generates Google Maps links for coordinates, and localizes content using `getEmailTemplates`.
   *
   * @example
   * await this.sendReportEmail({
   *   user: { id: "1", firstName: "Ana", lastName: "Pop", phone: "0712345678", email: "ana@example.com", receiveOtherReportUpdates: true },
   *   report: { id: "r1", reportNumber: 123, reportType: REPORT_TYPES.PRESENCE, latitude: 46.77, longitude: 23.59, receiveUpdates: true },
   *   isUpdate: false
   * });
   */
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

    // Parse chatbot conversation if present
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

    // Determine base URL based on environment
    let baseUrl = "https://anim-alert.org/";
    if (process.env.NODE_ENV === "development") {
      baseUrl = "http://localhost:3000";
    } else if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
      baseUrl = "https://stage.anim-alert.org";
    }

    const fileUploadsUrl = `${baseUrl}/file-uploads/${report.reportNumber}`;

    const { subjectPrefix, adminTitle, userTitle, userThanks } =
      this.getEmailTemplates(reportType as REPORT_TYPES, actionType);

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
      <!-- Report Info -->
      <div style="margin-bottom:24px;">
        <div style="font-family:'Baloo 2',Arial,sans-serif;font-size:1.25rem;font-weight:700;color:oklch(42.58% 0.113 130.14);padding-bottom:8px;">
          📍 Detalii raport
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
          <li>Link imagini și videoclipuri atașate: <a href="${fileUploadsUrl}">${fileUploadsUrl}</a></li>
          <li><strong>Data creării:</strong> ${report.createdAt ? format(report.createdAt) : "N/A"}</li>
          <li><strong>Ultima actualizare:</strong> ${report.updatedAt ? format(report.updatedAt) : "N/A"}</li>
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

    const adminEmailText = `
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
          `.trim();

    try {
      await this.emailService.sendEmail({
        to: env.EMAIL_ADMIN,
        subject: `🚨 ${subjectPrefix} ${actionType.toUpperCase()} - ${report.reportNumber}`,
        html: adminHtml,
        text: adminEmailText,
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "responseCode" in error &&
        (error as { responseCode?: unknown }).responseCode === 552
      ) {
        // Retry without attachments if size limit exceeded
        console.warn("Email size limit exceeded, retrying without attachments");

        try {
          await this.emailService.sendEmail({
            to: env.EMAIL_ADMIN,
            subject: `🚨 ${subjectPrefix} ${actionType.toUpperCase()} - ${report.reportNumber} - FĂRĂ ATAȘAMENTE`,
            html: adminHtml,
            text: adminEmailText,
          });
        } catch (error) {
          console.error("Error sending admin email:", error);
        }
      } else {
        console.error("Error sending admin email:", error);
      }
    }

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

      try {
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
      } catch (error) {
        console.error("Error sending user email:", error);
      }
    }
  }

  /**
   * Sends a simple SMS notification to the admin when a new report is created.
   *
   * The SMS message will contain only the report number in the following format:
   * "Raport nou creat: {reportNumber}"
   *
   * @param reportNumber - The unique number identifying the newly created report.
   * @throws {TRPCError} Throws an error with code "INTERNAL_SERVER_ERROR" if the report number is missing.
   *
   * @example
   * await this.sendAdminReportSms(1234);
   * // SMS sent: "Raport nou creat: 1234"
   */
  protected async sendAdminReportSms(reportNumber?: number) {
    if (!reportNumber) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Report number is missing",
      });
    }

    const message = `Raport nou creat: ${reportNumber}`;

    await this.smsService.sendSms({
      message,
    });
  }

  /**
   * Retrieves signed URLs for the image files associated with a specific report.
   *
   * @param reportId - The unique id identifying the report.
   * @returns A promise that resolves to an array of signed URLs for the report's image files.
   * @throws {TRPCError} If the report with the specified id is not found.
   */
  async getReportFiles(user: User | null, id: string) {
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User must be authenticated to access report files.",
      });
    }

    const currentUserEmail = user?.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    )?.emailAddress;

    if (!currentUserEmail && user.publicMetadata.role !== "admin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User email not found or not verified.",
      });
    }

    const report = await this.getReport(user, id);

    if (!report) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Report with id ${id} not found`,
      });
    }

    if (!report.imageKeys?.length) {
      return [];
    }

    // Filter out undefined keys before requesting signed URLs
    const fileKeys = report.imageKeys.filter(
      (key): key is string => key !== undefined,
    );

    const fileUrls = await Promise.all(
      fileKeys.map((key) => this.s3Service.getObjectSignedUrl(key)),
    );

    return fileUrls;
  }

  // List all reports with user data
  async listReportsWithUser() {
    return await db
      .select({ report: reports, user: users })
      .from(reports)
      .leftJoin(users, eq(reports.userId, users.id))
      .orderBy(desc(reports.createdAt));
  }

  // Get a single report (with user) by report ID
  async getReportWithUser(id: string) {
    const result = await db
      .select({ report: reports, user: users })
      .from(reports)
      .leftJoin(users, eq(reports.userId, users.id))
      .where(eq(reports.id, id))
      .limit(1);

    if (!result.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Report with id ${id} not found`,
      });
    }
    return result[0];
  }

  // Update report and user data
  async updateReportWithUser(data: z.infer<typeof upsertReportWithUserSchema>) {
    const { user, report } = data;
    const normalizedPhone = normalizePhoneNumber(user.phone);

    if (!user.id || !report.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User ID and Report ID are required for update",
      });
    }

    // Update user
    await db
      .update(users)
      .set({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: normalizedPhone,
        email: user.email,
        receiveOtherReportUpdates: user.receiveOtherReportUpdates,
      })
      .where(eq(users.id, user.id));

    // Update report
    await db
      .update(reports)
      .set({
        reportType: report.reportType,
        receiveUpdates: report.receiveUpdates,
        latitude: report.latitude,
        longitude: report.longitude,
        imageKeys: report.imageKeys,
        conversation: report.conversation,
        address: report.address,
      })
      .where(eq(reports.id, report.id));

    // Return updated report with user data
    return this.getReportWithUser(report.id);
  }
}
