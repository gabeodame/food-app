import * as buffer from "buffer";

const bufferModule = buffer as typeof buffer & { SlowBuffer?: typeof Buffer };

if (!bufferModule.SlowBuffer) {
  bufferModule.SlowBuffer = bufferModule.Buffer as typeof Buffer;
}
