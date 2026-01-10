import { Buffer, SlowBuffer as ImportedSlowBuffer } from "buffer";

const SlowBuffer = ImportedSlowBuffer ?? Buffer;
const globalBuffer = globalThis as typeof globalThis & {
  Buffer?: typeof Buffer;
  SlowBuffer?: typeof Buffer;
};

globalBuffer.Buffer = Buffer;
globalBuffer.SlowBuffer = SlowBuffer;
