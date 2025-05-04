import { createReadStream, createWriteStream } from "fs";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import path from "path";
import { pipeline } from "stream/promises";

export async function handleCompress(command, args, currentDir) {
  const validCommands = ["compress", "decompress"];
  if (!validCommands.find((item) => item === command)) {
    console.log("test1")
    throw new Error();
  }
  const file1 = path.resolve(currentDir, args[0]);
  const file2 = path.resolve(currentDir, args[1]);
  try {
    if (command === "compress") {
      const read = createReadStream(file1);
      const write = createWriteStream(file2);
      const brotli = createBrotliCompress();
      await pipeline(read, brotli, write);
    } else if (command === "decompress") {
      const read = createReadStream(file1);
      const write = createWriteStream(file2);
      const brotli = createBrotliDecompress();
      await pipeline(read, brotli, write);
    }
  } catch {
    throw new Error();
  }
}
