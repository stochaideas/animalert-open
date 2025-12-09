import Handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache compiled templates
const templateCache: Map<string, HandlebarsTemplateDelegate> = new Map<
  string,
  HandlebarsTemplateDelegate
>();

/**
 * Loads and compiles a Handlebars template from the templates directory.
 * Templates are cached for performance.
 *
 * @param templateName - The name of the template file (e.g., 'admin-email.html.hbs')
 * @returns The compiled Handlebars template function
 */
function loadTemplate(templateName: string): HandlebarsTemplateDelegate {
  // Check cache first
  const cached = templateCache.get(templateName);
  if (cached) {
    return cached;
  }

  // Load and compile template
  const templatePath = path.join(__dirname, "templates", templateName);
  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const compiled = Handlebars.compile(templateSource);

  // Cache the compiled template
  templateCache.set(templateName, compiled);

  return compiled;
}

/**
 * Data structure for admin email template
 */
export interface AdminEmailTemplateData {
  adminTitle: string;
  user: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
    receiveOtherReportUpdates: boolean | null;
  };
  report: {
    reportNumber: number;
    reportType: string;
    receiveUpdates: boolean | null;
    address: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  hasCoordinates: boolean;
  mapsUrl: string | null;
  imagesCount: number;
  actualImagesCount: number;
  actualVideosCount: number;
  hasImages: boolean;
  hasVideos: boolean;
  hasFiles: boolean;
  singleImage: boolean;
  singleVideo: boolean;
  reportDetailsUrl: string;
  createdAt: string;
  updatedAt: string;
  hasConversation: boolean;
  conversationArray: Array<{
    question: string;
    answer: string | string[];
    isArray: boolean;
  }>;
}

/**
 * Data structure for user email template
 */
export interface UserEmailTemplateData {
  userTitle: string;
  userThanks: string;
  actionType: string;
  user: {
    firstName: string;
  };
  report: {
    reportNumber: number;
  };
  myReportsUrl: string;
  contactUrl: string;
  reportDetailsUrl: string;
  hasFiles: boolean;
}

/**
 * Data structure for admin SMS template
 */
export interface AdminSmsTemplateData {
  typeLabel: string;
  reportNumber: number;
  userName: string;
  userPhone: string;
  address: string | null;
  hasFiles: boolean;
  fileParts: string;
  adminReportUrl: string | null;
  mapsUrl: string | null;
}

/**
 * Renders the admin email HTML template
 */
export function renderAdminEmailHtml(data: AdminEmailTemplateData): string {
  const template = loadTemplate("admin-email.html.hbs");
  return template(data).trim();
}

/**
 * Renders the admin email plain text template
 */
export function renderAdminEmailText(data: AdminEmailTemplateData): string {
  const template = loadTemplate("admin-email.txt.hbs");
  return template(data).trim();
}

/**
 * Renders the user email HTML template
 */
export function renderUserEmailHtml(data: UserEmailTemplateData): string {
  const template = loadTemplate("user-email.html.hbs");
  return template(data).trim();
}

/**
 * Renders the user email plain text template
 */
export function renderUserEmailText(data: UserEmailTemplateData): string {
  const template = loadTemplate("user-email.txt.hbs");
  return template(data).trim();
}

/**
 * Renders the admin SMS template
 */
export function renderAdminSms(data: AdminSmsTemplateData): string {
  const template = loadTemplate("admin-sms.txt.hbs");
  return template(data).trim();
}
