import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export async function handleHash(file, currentDir) {
  const hash = crypto.createHash('sha256');
  const stream = fs.createReadStream(path.resolve(currentDir, file));
  stream.on('data', chunk => hash.update(chunk));
  stream.on('end', () => {
    console.log(hash.digest('hex'));
  });
}
