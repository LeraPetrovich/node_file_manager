import fs from "fs";
import zlib from "zlib";
import path from "path";

export async function handleCompress(command, args, currentDir) {
  const src = path.resolve(currentDir, args[0]);
  const dest = path.resolve(currentDir, args[1]);
  const read = fs.createReadStream(src);
  const write = fs.createWriteStream(dest);
  if (command === "compress") {
    const brotli = zlib.createBrotliCompress();
    read.pipe(brotli).pipe(write);
  } else {
    const brotli = zlib.createBrotliDecompress();
    read.pipe(brotli).pipe(write);
  }
}
