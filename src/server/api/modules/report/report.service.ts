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
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
} from "~/constants/file-constants";

// Service and error handling types
import { type EmailService } from "../email/email.service";
import type { S3Service } from "../s3/s3.service";
import type { SmsService } from "../sms/sms.service";
import {
  handlePostgresError,
  type PostgresError,
} from "~/server/db/postgres-error";
import type { User } from "@clerk/nextjs/server";
import {
  renderAdminEmailHtml,
  renderAdminEmailText,
  renderUserEmailHtml,
  renderUserEmailText,
  renderAdminSms,
  type AdminEmailTemplateData,
  type UserEmailTemplateData,
  type AdminSmsTemplateData,
} from "./report.templates";

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
      // Count images vs videos for SMS using S3 ContentType
      let smsImagesCount = 0;
      let smsVideosCount = 0;

      if (result.report?.imageKeys && result.report.imageKeys.length > 0) {
        // Fetch ContentType for each file from S3
        const fileTypes = await Promise.all(
          result.report.imageKeys.map(async (key) => {
            try {
              const fileInfo = await this.s3Service.getObjectSignedUrl(key);
              return fileInfo.type;
            } catch (error) {
              console.error(`Error getting file type for key ${key}:`, error);
              return null;
            }
          }),
        );

        // Count by type using constants
        fileTypes.forEach((type) => {
          if (type && ACCEPTED_IMAGE_TYPES.includes(type)) {
            smsImagesCount++;
          } else if (type && ACCEPTED_VIDEO_TYPES.includes(type)) {
            smsVideosCount++;
          }
        });
      }

      await this.sendAdminReportSms({
        reportType,
        reportNumber: result.report?.reportNumber,
        reportId: result.report?.id,
        userName: `${result.user?.lastName} ${result.user?.firstName}`,
        userPhone: result.user?.phone ?? "",
        address: result.report?.address ?? undefined,
        imagesCount: smsImagesCount,
        videosCount: smsVideosCount,
        latitude: result.report?.latitude ?? undefined,
        longitude: result.report?.longitude ?? undefined,
      });
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

    // Count images vs videos based on S3 ContentType metadata
    let actualImagesCount = 0;
    let actualVideosCount = 0;

    if (report.imageKeys && report.imageKeys.length > 0) {
      // Fetch ContentType for each file from S3
      const fileTypes = await Promise.all(
        report.imageKeys.map(async (key) => {
          try {
            const fileInfo = await this.s3Service.getObjectSignedUrl(key);
            return fileInfo.type;
          } catch (error) {
            console.error(`Error getting file type for key ${key}:`, error);
            return null;
          }
        }),
      );

      // Count by type using constants
      fileTypes.forEach((type) => {
        if (type && ACCEPTED_IMAGE_TYPES.includes(type)) {
          actualImagesCount++;
        } else if (type && ACCEPTED_VIDEO_TYPES.includes(type)) {
          actualVideosCount++;
        }
      });
    }

    // Determine base URL based on environment
    let baseUrl = "https://anim-alert.org/";
    if (process.env.NODE_ENV === "development") {
      baseUrl = "http://localhost:3000";
    } else if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
      baseUrl = "https://stage.anim-alert.org";
    }

    const reportDetailsUrl = `${baseUrl}/incidentele-mele/${report.id}`;

    const { subjectPrefix, adminTitle, userTitle, userThanks } =
      this.getEmailTemplates(reportType as REPORT_TYPES, actionType);

    // Prepare template data for admin email
    const adminTemplateData: AdminEmailTemplateData = {
      adminTitle,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        receiveOtherReportUpdates: user.receiveOtherReportUpdates,
      },
      report: {
        reportNumber: report.reportNumber,
        reportType,
        receiveUpdates: report.receiveUpdates,
        address: report.address ?? null,
        latitude: latitude,
        longitude: longitude,
      },
      hasCoordinates: !!(latitude && longitude),
      mapsUrl,
      imagesCount: imagesCount ?? 0,
      actualImagesCount,
      actualVideosCount,
      hasImages: actualImagesCount > 0,
      hasVideos: actualVideosCount > 0,
      hasFiles: !!(imagesCount && imagesCount > 0),
      singleImage: actualImagesCount === 1,
      singleVideo: actualVideosCount === 1,
      reportDetailsUrl,
      createdAt: report.createdAt ? format(report.createdAt) : "N/A",
      updatedAt: report.updatedAt ? format(report.updatedAt) : "N/A",
      hasConversation: conversationArray.length > 0,
      conversationArray: conversationArray.map((item) => ({
        question: item.question,
        answer: item.answer,
        isArray: Array.isArray(item.answer),
      })),
    };

    /*
      EMAIL TO BE SENT TO ADMIN
    */

    const adminHtml = renderAdminEmailHtml(adminTemplateData);
    const adminEmailText = renderAdminEmailText(adminTemplateData);

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
      const myReportsUrl = `${baseUrl}/incidentele-mele`;
      const contactUrl = `${baseUrl}/contact`;

      // Prepare template data for user email
      const userTemplateData: UserEmailTemplateData = {
        userTitle,
        userThanks,
        actionType,
        user: {
          firstName: user.firstName,
        },
        report: {
          reportNumber: report.reportNumber,
        },
        myReportsUrl,
        contactUrl,
        reportDetailsUrl,
        hasFiles: !!(imagesCount && imagesCount > 0),
      };

      const userHtml = renderUserEmailHtml(userTemplateData);
      const userEmailText = renderUserEmailText(userTemplateData);

      try {
        await this.emailService.sendEmail({
          to: user.email,
          subject: `✅ ${subjectPrefix} ${actionType} - AnimAlert`,
          html: userHtml,
          text: userEmailText,
        });
      } catch (error) {
        console.error("Error sending user email:", error);
      }
    }
  }

  /**
   * Sends a detailed SMS notification to the admin when a new report is created.
   *
   * The SMS message will contain important details in a concise format:
   * - Report type and number
   * - User name and phone
   * - Address (first 30 chars if available)
   * - Number of images and videos
   * - Link to admin report page (if space permits)
   * - Google Maps link (if space permits and coordinates available)
   *
   * @param data - Object containing report details
   * @param data.reportType - The type of report (INCIDENT, PRESENCE, CONFLICT)
   * @param data.reportNumber - The unique number identifying the newly created report
   * @param data.reportId - The UUID of the report for generating admin link
   * @param data.userName - Full name of the user who created the report
   * @param data.userPhone - Phone number of the user
   * @param data.address - Location/address of the report (optional)
   * @param data.imagesCount - Number of image files (optional)
   * @param data.videosCount - Number of video files (optional)
   * @param data.latitude - Latitude coordinate (optional)
   * @param data.longitude - Longitude coordinate (optional)
   * @throws {TRPCError} Throws an error with code "INTERNAL_SERVER_ERROR" if required data is missing.
   *
   * @example
   * await this.sendAdminReportSms({
   *   reportType: REPORT_TYPES.INCIDENT,
   *   reportNumber: 1234,
   *   reportId: "abc-123",
   *   userName: "Ion Popescu",
   *   userPhone: "+40712345678",
   *   address: "Str. Exemple nr. 1, București",
   *   imagesCount: 2,
   *   videosCount: 1,
   *   latitude: 44.4268,
   *   longitude: 26.1025
   * });
   * // SMS sent: "INCIDENT #1234\nIon Popescu\nTel: +40712345678\nLoc: Str. Exemple nr. 1, Bucures...\n2 img, 1 vid\nAdmin: https://anim-alert.org/admin/r...\nMaps: https://goo.gl/maps/..."
   */
  protected async sendAdminReportSms(data: {
    reportType: REPORT_TYPES;
    reportNumber?: number;
    reportId?: string;
    userName: string;
    userPhone: string;
    address?: string;
    imagesCount?: number;
    videosCount?: number;
    latitude?: number;
    longitude?: number;
  }) {
    if (!data.reportNumber) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Report number is missing",
      });
    }

    // Get report type label (no emojis)
    let typeLabel = "RAPORT";

    switch (data.reportType) {
      case REPORT_TYPES.INCIDENT:
        typeLabel = "INCIDENT";
        break;
      case REPORT_TYPES.PRESENCE:
        typeLabel = "PREZENTA";
        break;
      case REPORT_TYPES.CONFLICT:
        typeLabel = "CONFLICT";
        break;
    }

    // Determine base URL based on environment
    let baseUrl = "https://anim-alert.org";
    if (process.env.NODE_ENV === "development") {
      baseUrl = "http://localhost:3000";
    } else if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
      baseUrl = "https://stage.anim-alert.org";
    }

    // Truncate address if too long (keep first 30 chars)
    let truncatedAddress: string | null = null;
    if (data.address) {
      truncatedAddress =
        data.address.length > 30
          ? data.address.substring(0, 27) + "..."
          : data.address;
    }

    // Build file parts string
    const fileParts: string[] = [];
    if (data.imagesCount && data.imagesCount > 0) {
      fileParts.push(`${data.imagesCount} img`);
    }
    if (data.videosCount && data.videosCount > 0) {
      fileParts.push(`${data.videosCount} vid`);
    }

    // Generate URLs
    const adminReportUrl = data.reportId
      ? `${baseUrl}/admin/reports/${data.reportId}`
      : null;
    const mapsUrl =
      data.latitude && data.longitude
        ? `https://maps.google.com/?q=${data.latitude},${data.longitude}`
        : null;

    // Prepare template data for SMS
    const smsTemplateData: AdminSmsTemplateData = {
      typeLabel,
      reportNumber: data.reportNumber,
      userName: data.userName,
      userPhone: data.userPhone,
      address: truncatedAddress,
      hasFiles: fileParts.length > 0,
      fileParts: fileParts.join(", "),
      adminReportUrl: null,
      mapsUrl: null,
    };

    // Render initial message to check length
    let message = renderAdminSms(smsTemplateData);

    // Check if we can fit URLs (SMS limit is ~160 chars for single, ~300 for multi)
    // We'll use a limit of 280 chars to stay within 2 SMS segments
    const urlSpace = 280 - message.length;

    // Add admin URL if it fits (need ~50 chars)
    if (adminReportUrl && urlSpace > 60) {
      smsTemplateData.adminReportUrl = adminReportUrl;
      message = renderAdminSms(smsTemplateData);
    }

    // Add maps URL if it fits and there's still space (need ~50 chars)
    const remainingSpace = 280 - message.length;
    if (mapsUrl && remainingSpace > 60) {
      smsTemplateData.mapsUrl = mapsUrl;
      message = renderAdminSms(smsTemplateData);
    }

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
