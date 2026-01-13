const bufferModule = require("buffer") as {
  Buffer: typeof Buffer;
  SlowBuffer?: typeof Buffer;
};

if (!bufferModule.SlowBuffer) {
  bufferModule.SlowBuffer = bufferModule.Buffer;
}
