import { describe, it, expect } from "vitest";
import { Readable } from "stream";
import { streamToBuffer } from "~/lib/stream-to-buffer";

describe("stream-to-buffer", () => {
  describe("streamToBuffer", () => {
    it("should convert a readable stream with Buffer chunks to a single Buffer", async () => {
      const chunks = [
        Buffer.from("Hello "),
        Buffer.from("World"),
        Buffer.from("!"),
      ];
      const stream = Readable.from(chunks);

      const result = await streamToBuffer(stream);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.toString()).toBe("Hello World!");
    });

    it("should convert a readable stream with string chunks to Buffer", async () => {
      const chunks = ["Hello", " ", "Stream"];
      const stream = Readable.from(chunks);

      const result = await streamToBuffer(stream);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.toString()).toBe("Hello Stream");
    });

    it("should handle empty stream", async () => {
      const stream = Readable.from([]);

      const result = await streamToBuffer(stream);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.length).toBe(0);
      expect(result.toString()).toBe("");
    });

    it("should handle stream with single chunk", async () => {
      const stream = Readable.from([Buffer.from("SingleChunk")]);

      const result = await streamToBuffer(stream);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.toString()).toBe("SingleChunk");
    });

    it("should handle binary data", async () => {
      const binaryData = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
      const stream = Readable.from([binaryData]);

      const result = await streamToBuffer(stream);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.toString()).toBe("Hello");
    });

    it("should concatenate multiple chunks correctly", async () => {
      const chunks = [
        Buffer.from("Chunk1"),
        Buffer.from("Chunk2"),
        Buffer.from("Chunk3"),
        Buffer.from("Chunk4"),
      ];
      const stream = Readable.from(chunks);

      const result = await streamToBuffer(stream);

      expect(result.toString()).toBe("Chunk1Chunk2Chunk3Chunk4");
      expect(result.length).toBe(24); // 6 * 4
    });

    it("should handle large chunks", async () => {
      const largeChunk = Buffer.alloc(1024 * 1024, "a"); // 1MB of 'a'
      const stream = Readable.from([largeChunk]);

      const result = await streamToBuffer(stream);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.length).toBe(1024 * 1024);
    });

    it("should preserve UTF-8 encoding", async () => {
      const chunks = [
        Buffer.from("Hello "),
        Buffer.from("世界"), // Chinese for "world"
        Buffer.from(" 🌍"), // Earth emoji
      ];
      const stream = Readable.from(chunks);

      const result = await streamToBuffer(stream);

      expect(result.toString("utf-8")).toBe("Hello 世界 🌍");
    });
  });
});
