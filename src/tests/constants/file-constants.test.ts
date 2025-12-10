import { describe, it, expect } from "vitest";
import {
  IMAGE_MAX_SIZE,
  VIDEO_MAX_SIZE,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
} from "~/constants/file-constants";

describe("file-constants", () => {
  describe("IMAGE_MAX_SIZE", () => {
    it("should be 10MB in bytes", () => {
      expect(IMAGE_MAX_SIZE).toBe(10 * 1024 * 1024);
      expect(IMAGE_MAX_SIZE).toBe(10485760);
    });

    it("should be a positive number", () => {
      expect(IMAGE_MAX_SIZE).toBeGreaterThan(0);
    });
  });

  describe("VIDEO_MAX_SIZE", () => {
    it("should be 200MB in bytes", () => {
      expect(VIDEO_MAX_SIZE).toBe(200 * 1024 * 1024);
      expect(VIDEO_MAX_SIZE).toBe(209715200);
    });

    it("should be larger than IMAGE_MAX_SIZE", () => {
      expect(VIDEO_MAX_SIZE).toBeGreaterThan(IMAGE_MAX_SIZE);
    });

    it("should be a positive number", () => {
      expect(VIDEO_MAX_SIZE).toBeGreaterThan(0);
    });
  });

  describe("ACCEPTED_IMAGE_TYPES", () => {
    it("should contain common image MIME types", () => {
      expect(ACCEPTED_IMAGE_TYPES).toContain("image/png");
      expect(ACCEPTED_IMAGE_TYPES).toContain("image/jpeg");
      expect(ACCEPTED_IMAGE_TYPES).toContain("image/jpg");
    });

    it("should contain modern image formats", () => {
      expect(ACCEPTED_IMAGE_TYPES).toContain("image/webp");
      expect(ACCEPTED_IMAGE_TYPES).toContain("image/svg+xml");
      expect(ACCEPTED_IMAGE_TYPES).toContain("image/gif");
    });

    it("should have exactly 6 accepted image types", () => {
      expect(ACCEPTED_IMAGE_TYPES.length).toBe(6);
    });

    it("should have all MIME types starting with 'image/'", () => {
      ACCEPTED_IMAGE_TYPES.forEach((type) => {
        expect(type).toMatch(/^image\//);
      });
    });

    it("should not have duplicate types", () => {
      const uniqueTypes = new Set(ACCEPTED_IMAGE_TYPES);
      expect(ACCEPTED_IMAGE_TYPES.length).toBe(uniqueTypes.size);
    });

    it("should be an array", () => {
      expect(Array.isArray(ACCEPTED_IMAGE_TYPES)).toBe(true);
    });
  });

  describe("ACCEPTED_VIDEO_TYPES", () => {
    it("should contain common video MIME types", () => {
      expect(ACCEPTED_VIDEO_TYPES).toContain("video/mp4");
      expect(ACCEPTED_VIDEO_TYPES).toContain("video/quicktime");
      expect(ACCEPTED_VIDEO_TYPES).toContain("video/webm");
    });

    it("should contain MKV format", () => {
      expect(ACCEPTED_VIDEO_TYPES).toContain("video/x-matroska");
    });

    it("should have exactly 4 accepted video types", () => {
      expect(ACCEPTED_VIDEO_TYPES.length).toBe(4);
    });

    it("should have all MIME types starting with 'video/'", () => {
      ACCEPTED_VIDEO_TYPES.forEach((type) => {
        expect(type).toMatch(/^video\//);
      });
    });

    it("should not have duplicate types", () => {
      const uniqueTypes = new Set(ACCEPTED_VIDEO_TYPES);
      expect(ACCEPTED_VIDEO_TYPES.length).toBe(uniqueTypes.size);
    });

    it("should be an array", () => {
      expect(Array.isArray(ACCEPTED_VIDEO_TYPES)).toBe(true);
    });
  });

  describe("File type validation helpers", () => {
    it("should allow validation of image MIME types", () => {
      expect(ACCEPTED_IMAGE_TYPES.includes("image/png")).toBe(true);
      expect(ACCEPTED_IMAGE_TYPES.includes("image/bmp")).toBe(false);
    });

    it("should allow validation of video MIME types", () => {
      expect(ACCEPTED_VIDEO_TYPES.includes("video/mp4")).toBe(true);
      expect(ACCEPTED_VIDEO_TYPES.includes("video/avi")).toBe(false);
    });
  });
});
