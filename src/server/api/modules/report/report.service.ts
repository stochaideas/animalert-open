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
import type { SmsService } from "../sms/sms.service";
import { REPORT_TYPES } from "~/constants/report-types";

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

  async getReportFiles(reportNumber: number) {
    const report = await db.query.reports.findFirst({
      where: eq(reports.reportNumber, reportNumber),
      columns: {
        imageKeys: true,
      },
    });

    if (!report) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Report with number ${reportNumber} not found`,
      });
    }

    if (!report.imageKeys?.length) {
      return [];
    }

    const fileKeys = report.imageKeys.filter(
      (key): key is string => key !== undefined,
    );

    const fileUrls = await Promise.all(
      fileKeys.map((key) => this.s3Service.getObjectSignedUrl(key)),
    );

    return fileUrls;
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

    const reportType = result.report?.reportType as REPORT_TYPES;
    const conversation = result.report?.conversation;

    if (
      isUpdate &&
      (reportType === REPORT_TYPES.PRESENCE ||
        reportType === REPORT_TYPES.CONFLICT ||
        (reportType === REPORT_TYPES.INCIDENT &&
          conversation &&
          Array.isArray(JSON.parse(conversation) as unknown[]) &&
          (JSON.parse(conversation) as unknown[]).length > 0))
    ) {
      // Send admin SMS notification for new report
      await this.sendAdminReportSms(result);
    }

    return result;
  }

  /**
   * Sends an SMS notification to the admin with details about a newly created or updated report.
   *
   * The SMS includes user information, report details (such as coordinates, images, and chatbot conversation),
   * and a Google Maps link if coordinates are available. The message is formatted in Romanian.
   *
   * @param result - The result object containing user and report data.
   * @param result.user - The user who submitted the report. If undefined, an error is thrown.
   * @param result.report - The report details. If undefined, an error is thrown.
   * @param result.isUpdate - Optional flag indicating if the report is an update.
   * @throws {TRPCError} If either the user or report data is missing.
   */
  protected async sendAdminReportSms(result: {
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
    const { user, report } = result;

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

    const imagesCount = report.imageKeys?.length;

    let objectNameRomanian = "";

    switch (reportType as REPORT_TYPES) {
      case REPORT_TYPES.INCIDENT:
        objectNameRomanian = "Raport incident";
        break;
      case REPORT_TYPES.PRESENCE:
        objectNameRomanian = "Raport prezență";
        break;
      case REPORT_TYPES.CONFLICT:
        objectNameRomanian = "Raport conflict/interacțiune";
        break;
      default:
        objectNameRomanian = "Raport";
        break;
    }

    const message = `
${objectNameRomanian} nou creat
----------------
Utilizator: ${user.lastName} ${user.firstName}
Telefon: ${user.phone}
Email: ${user.email ?? "Nespecificat"}
Actualizări: ${user.receiveOtherReportUpdates ? "Da" : "Nu"}

Detalii raport
----------------
${mapsUrl ? `Harta: ${mapsUrl}` : ""}
Imagini: ${imagesCount} fișiere atașate
Răspunsuri utilizator (chat-bot):
${
  conversationArray.length > 0
    ? conversationArray
        .map(
          (item) =>
            `Q: ${item.question}\nA: ${Array.isArray(item.answer) ? item.answer.join(", ") : item.answer}`,
        )
        .join("\n")
    : "N/A"
}`.trim();

    await this.smsService.sendSms({
      message,
    });
  }
}
