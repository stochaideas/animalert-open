import { type Readable } from "stream";

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    const bufferChunk: Buffer = Buffer.isBuffer(chunk)
      ? chunk
      : Buffer.from(chunk as ArrayBufferLike);
    chunks.push(bufferChunk);
  }
  return Buffer.concat(chunks);
}
