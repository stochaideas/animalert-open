import { describe, it, expect } from "vitest";
import { upsertReportWithUserSchema } from "~/server/api/modules/report/report.schema";
import { REPORT_TYPES } from "~/constants/report-types";

describe("upsertReportWithUserSchema", () => {
  const validData = {
    user: {
      firstName: "Ion",
      lastName: "Popescu",
      phone: "+40712345678",
      countryCode: "RO",
      email: "ion@example.com",
      receiveOtherReportUpdates: false,
    },
    report: {
      reportType: REPORT_TYPES.INCIDENT,
      receiveUpdates: false,
      latitude: 46.7712,
      longitude: 23.6236,
      imageKeys: ["key1.jpg", "key2.jpg"],
      conversation: "Test conversation",
      address: "Test address",
    },
  };

  it("should validate correct report with user data", () => {
    const result = upsertReportWithUserSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should require user firstName", () => {
    const { firstName: _firstName, ...userRest } = validData.user;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      user: userRest,
    });
    expect(result.success).toBe(false);
  });

  it("should require user lastName", () => {
    const { lastName: _lastName, ...userRest } = validData.user;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      user: userRest,
    });
    expect(result.success).toBe(false);
  });

  it("should require user phone", () => {
    const { phone: _phone, ...userRest } = validData.user;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      user: userRest,
    });
    expect(result.success).toBe(false);
  });

  it("should validate phone number format", () => {
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      user: {
        ...validData.user,
        phone: "invalid",
      },
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty phone", () => {
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      user: {
        ...validData.user,
        phone: "",
      },
    });
    expect(result.success).toBe(false);
  });

  it("should default countryCode to RO", () => {
    const { countryCode: _countryCode, ...userRest } = validData.user;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      user: {
        ...userRest,
        phone: "+40712345678",
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.user.countryCode).toBe("RO");
    }
  });

  it("should accept optional user id", () => {
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      user: {
        ...validData.user,
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
    });
    expect(result.success).toBe(true);
  });

  it("should accept optional user email", () => {
    const { email, ...userRest } = validData.user;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      user: userRest,
    });
    expect(result.success).toBe(true);
  });

  it("should default receiveOtherReportUpdates to false", () => {
    const { receiveOtherReportUpdates, ...userRest } = validData.user;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      user: userRest,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.user.receiveOtherReportUpdates).toBe(false);
    }
  });

  it("should require report reportType", () => {
    const { reportType, ...reportRest } = validData.report;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      report: reportRest,
    });
    expect(result.success).toBe(false);
  });

  it("should validate reportType is from enum", () => {
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      report: {
        ...validData.report,
        reportType: "INVALID_TYPE" as any,
      },
    });
    expect(result.success).toBe(false);
  });

  it("should accept all valid report types", () => {
    Object.values(REPORT_TYPES).forEach((reportType) => {
      const result = upsertReportWithUserSchema.safeParse({
        ...validData,
        report: {
          ...validData.report,
          reportType,
        },
      });
      expect(result.success).toBe(true);
    });
  });

  it("should default receiveUpdates to false", () => {
    const { receiveUpdates, ...reportRest } = validData.report;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      report: reportRest,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.report.receiveUpdates).toBe(false);
    }
  });

  it("should accept optional report id", () => {
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      report: {
        ...validData.report,
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
    });
    expect(result.success).toBe(true);
  });

  it("should accept optional latitude", () => {
    const { latitude, ...reportRest } = validData.report;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      report: reportRest,
    });
    expect(result.success).toBe(true);
  });

  it("should accept optional longitude", () => {
    const { longitude, ...reportRest } = validData.report;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      report: reportRest,
    });
    expect(result.success).toBe(true);
  });

  it("should require imageKeys array", () => {
    const { imageKeys, ...reportRest } = validData.report;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      report: reportRest,
    });
    expect(result.success).toBe(false);
  });

  it("should accept empty imageKeys array", () => {
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      report: {
        ...validData.report,
        imageKeys: [],
      },
    });
    expect(result.success).toBe(true);
  });

  it("should accept optional conversation", () => {
    const { conversation, ...reportRest } = validData.report;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      report: reportRest,
    });
    expect(result.success).toBe(true);
  });

  it("should accept optional address", () => {
    const { address, ...reportRest } = validData.report;
    const result = upsertReportWithUserSchema.safeParse({
      ...validData,
      report: reportRest,
    });
    expect(result.success).toBe(true);
  });

  it("should validate phone with different country codes", () => {
    const testCases = [
      { countryCode: "RO", phone: "0712345678" },
      { countryCode: "US", phone: "2025550123" },
      { countryCode: "DE", phone: "01512 3456789" },
      { countryCode: "FR", phone: "06 12 34 56 78" },
      { countryCode: "GB", phone: "07911 123456" },
    ];

    testCases.forEach(({ countryCode, phone }) => {
      const result = upsertReportWithUserSchema.safeParse({
        ...validData,
        user: {
          ...validData.user,
          countryCode,
          phone,
        },
      });
      expect(result.success).toBe(true);
    });
  });
});
