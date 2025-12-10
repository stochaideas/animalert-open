import { describe, it, expect } from "vitest";
import { cn } from "~/lib/utils";

describe("utils", () => {
  describe("cn (className utility)", () => {
    it("should merge single class name", () => {
      const result = cn("text-red-500");
      expect(result).toBe("text-red-500");
    });

    it("should merge multiple class names", () => {
      const result = cn("text-red-500", "bg-blue-500", "p-4");
      expect(result).toContain("text-red-500");
      expect(result).toContain("bg-blue-500");
      expect(result).toContain("p-4");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toContain("base-class");
      expect(result).toContain("active-class");
    });

    it("should filter out falsy values", () => {
      const result = cn(
        "base-class",
        false && "hidden",
        null,
        undefined,
        "visible",
      );
      expect(result).toContain("base-class");
      expect(result).toContain("visible");
      expect(result).not.toContain("hidden");
    });

    it("should handle objects with conditional classes", () => {
      const result = cn({
        "text-red-500": true,
        "bg-blue-500": false,
        "p-4": true,
      });
      expect(result).toContain("text-red-500");
      expect(result).not.toContain("bg-blue-500");
      expect(result).toContain("p-4");
    });

    it("should merge Tailwind conflicting classes correctly", () => {
      // twMerge should handle conflicts - later classes override earlier ones
      const result = cn("p-4", "p-6");
      expect(result).toBe("p-6");
      expect(result).not.toContain("p-4");
    });

    it("should handle arrays of classes", () => {
      const result = cn(["text-red-500", "bg-blue-500"], "p-4");
      expect(result).toContain("text-red-500");
      expect(result).toContain("bg-blue-500");
      expect(result).toContain("p-4");
    });

    it("should handle empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle whitespace", () => {
      const result = cn("  text-red-500  ", "bg-blue-500");
      expect(result).toContain("text-red-500");
      expect(result).toContain("bg-blue-500");
    });

    it("should merge complex Tailwind utilities", () => {
      const result = cn(
        "hover:bg-red-500",
        "focus:bg-blue-500",
        "active:bg-green-500",
      );
      expect(result).toContain("hover:bg-red-500");
      expect(result).toContain("focus:bg-blue-500");
      expect(result).toContain("active:bg-green-500");
    });
  });
});
