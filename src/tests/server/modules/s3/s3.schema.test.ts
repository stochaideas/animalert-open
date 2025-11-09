import { describe, it, expect } from "vitest";
import { presignedUrlSchema } from "~/server/api/modules/s3/s3.schema";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  IMAGE_MAX_SIZE,
  VIDEO_MAX_SIZE,
} from "~/constants/file-constants";

describe("presignedUrlSchema", () => {
  it("should validate correct image upload", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.jpg",
      fileType: "image/jpeg",
      fileSize: 1024 * 1024, // 1MB
    });
    expect(result.success).toBe(true);
  });

  it("should validate correct video upload", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.mp4",
      fileType: "video/mp4",
      fileSize: 50 * 1024 * 1024, // 50MB
    });
    expect(result.success).toBe(true);
  });

  it("should require fileName", () => {
    const result = presignedUrlSchema.safeParse({
      fileType: "image/jpeg",
      fileSize: 1024,
    });
    expect(result.success).toBe(false);
  });

  it("should require fileType", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.jpg",
      fileSize: 1024,
    });
    expect(result.success).toBe(false);
  });

  it("should require fileSize", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.jpg",
      fileType: "image/jpeg",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid file type", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.txt",
      fileType: "text/plain",
      fileSize: 1024,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("fileType"))).toBe(
        true,
      );
    }
  });

  it("should reject negative file size", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.jpg",
      fileType: "image/jpeg",
      fileSize: -1,
    });
    expect(result.success).toBe(false);
  });

  it("should reject zero file size", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.jpg",
      fileType: "image/jpeg",
      fileSize: 0,
    });
    expect(result.success).toBe(false);
  });

  it("should reject non-integer file size", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.jpg",
      fileType: "image/jpeg",
      fileSize: 1024.5,
    });
    expect(result.success).toBe(false);
  });

  it("should reject image larger than IMAGE_MAX_SIZE", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.jpg",
      fileType: "image/jpeg",
      fileSize: IMAGE_MAX_SIZE + 1,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("fileSize"))).toBe(
        true,
      );
    }
  });

  it("should accept image at exactly IMAGE_MAX_SIZE", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.jpg",
      fileType: "image/jpeg",
      fileSize: IMAGE_MAX_SIZE,
    });
    expect(result.success).toBe(true);
  });

  it("should reject video larger than VIDEO_MAX_SIZE", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.mp4",
      fileType: "video/mp4",
      fileSize: VIDEO_MAX_SIZE + 1,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("fileSize"))).toBe(
        true,
      );
    }
  });

  it("should accept video at exactly VIDEO_MAX_SIZE", () => {
    const result = presignedUrlSchema.safeParse({
      fileName: "test.mp4",
      fileType: "video/mp4",
      fileSize: VIDEO_MAX_SIZE,
    });
    expect(result.success).toBe(true);
  });

  it("should accept all valid image types", () => {
    ACCEPTED_IMAGE_TYPES.forEach((fileType) => {
      const result = presignedUrlSchema.safeParse({
        fileName: `test.${fileType.split("/")[1]}`,
        fileType,
        fileSize: 1024,
      });
      expect(result.success).toBe(true);
    });
  });

  it("should accept all valid video types", () => {
    ACCEPTED_VIDEO_TYPES.forEach((fileType) => {
      const result = presignedUrlSchema.safeParse({
        fileName: `test.${fileType.split("/")[1]}`,
        fileType,
        fileSize: 1024 * 1024,
      });
      expect(result.success).toBe(true);
    });
  });
});
