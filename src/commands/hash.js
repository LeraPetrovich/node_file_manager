import crypto from "crypto";
import fs, { createReadStream } from "fs";
import path from "path";

export async function handleHash(file, currentDir) {
  const hash = crypto.createHash("sha256");
  const currentFile = path.resolve(currentDir, file);
  const stream = createReadStream(currentFile);
  stream.on("data", (chunk) => {
    hash.update(chunk);
  });
  stream.on("end", () => {
    console.log(hash.digest("hex"));
  });
}
