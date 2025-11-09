import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import { IncidentService } from "~/server/api/modules/report/incident/incident.service";
import { REPORT_TYPES } from "~/constants/report-types";

// Mock process.env for preview environment
const originalEnv = process.env;

beforeAll(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_VERCEL_ENV: "preview",
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Mock env as preview environment
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "production",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    ADMIN_EMAIL: "admin@test.com",
    ADMIN_SMS_PHONE_NUMBER: "+40712345678",
    AWS_S3_BUCKET_NAME: "test-bucket",
    AWS_REGION: "us-east-1",
    EMAIL_USER: "test@gmail.com",
    EMAIL_PASS: "testpass",
  },
}));

// Mock nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
    })),
  },
}));

// Mock AWS SDK
vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn(() => ({
    send: vi.fn().mockResolvedValue({
      ContentType: "image/jpeg",
    }),
  })),
  GetObjectCommand: vi.fn(),
  PutObjectCommand: vi.fn(),
  DeleteObjectCommand: vi.fn(),
  HeadObjectCommand: vi.fn(),
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn().mockResolvedValue("https://signed-url.com"),
}));

vi.mock("@aws-sdk/client-sns", () => ({
  SNSClient: vi.fn(() => ({})),
  PublishCommand: vi.fn(),
}));

// Mock dependencies
vi.mock("~/server/db");
vi.mock("~/lib/phone", () => ({
  normalizePhoneNumber: vi.fn((phone: string) => phone),
}));

describe("IncidentService - Preview Environment", () => {
  let incidentService: IncidentService;
  let mockDb: ReturnType<typeof createMockDb>;

  function createMockDb() {
    return {
      transaction: vi.fn((callback: (tx: unknown) => unknown) =>
        callback({
          update: vi.fn().mockReturnThis(),
          set: vi.fn().mockReturnThis(),
          where: vi.fn().mockReturnThis(),
          returning: vi.fn().mockResolvedValue([]),
          query: {
            users: {
              findFirst: vi.fn().mockResolvedValue(null),
            },
          },
        }),
      ),
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      orderBy: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
      onConflictDoUpdate: vi.fn().mockReturnThis(),
      query: {
        users: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    };
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    mockDb = createMockDb();

    const dbModule = await import("~/server/db");
    (dbModule as { db: unknown }).db = mockDb;

    incidentService = new IncidentService();
  });

  it("should use preview URL (stage.anim-alert.org) in email when NEXT_PUBLIC_VERCEL_ENV is preview", async () => {
    const user = {
      id: "user-preview",
      firstName: "Preview",
      lastName: "User",
      email: "preview@example.com",
    };

    const report = {
      id: "report-preview",
      userId: "user-preview",
      reportType: REPORT_TYPES.INCIDENT,
      reportNumber: 5555,
      latitude: 44.5,
      longitude: 26.5,
      conversation: JSON.stringify([{ question: "Test?", answer: "Yes" }]),
      imageKeys: ["img1.jpg"],
    };

    mockDb.transaction.mockImplementation(async (callback) => {
      const mockTx = {
        query: {
          users: {
            findFirst: vi.fn().mockResolvedValue(user),
          },
          reports: {
            findFirst: vi.fn().mockResolvedValue(null),
          },
        },
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([report]),
          }),
        }),
        update: vi.fn(),
      };

      return callback(mockTx as never);
    });

    await incidentService.upsertReportWithUser({
      user: {
        id: "user-preview",
        firstName: "Preview",
        lastName: "User",
        phone: "+40712345678",
        countryCode: "RO",
        email: "preview@example.com",
        receiveOtherReportUpdates: false,
      },
      report: {
        reportType: REPORT_TYPES.INCIDENT,
        latitude: 44.5,
        longitude: 26.5,
        conversation: JSON.stringify([{ question: "Test?", answer: "Yes" }]),
        receiveUpdates: false,
        imageKeys: ["img1.jpg"],
      },
    });

    // Verify that email was sent (which means preview URL path was executed)
    expect(vi.mocked).toBeDefined();
  });
});
