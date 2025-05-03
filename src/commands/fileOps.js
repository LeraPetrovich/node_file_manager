import fs from "fs";
import fsp from "fs/promises";
import path from "path";

export async function handleFileOps(command, args, currentDir) {
  const validCommand = ["cat", "add", "mkdir", "rn", "rm", "cp", "mv"];
  if (!validCommand.includes(command)) {
    throw new Error("Invalid navigation command");
  }

  const resolvePath = (p) => path.resolve(currentDir, p);

  switch (command) {
    case "cat":
      try {
        const stream = fs.createReadStream(resolvePath(args[0]), "utf-8");
        stream.pipe(process.stdout);
        stream.on("error", () => console.log("Operation failed"));
      } catch {
        console.log("Operation failed");
      }
      break;

    case "add":
      try {
        await fsp.writeFile(resolvePath(args[0]), "");
      } catch {
        console.log("Operation failed");
      }
      break;

    case "mkdir":
      try {
        await fsp.mkdir(resolvePath(args[0]), { recursive: false });
      } catch {
        console.log("Operation failed");
      }
      break;

    case "rn":
      try {
        const oldPath = resolvePath(args[0]);
        const newPath = path.join(path.dirname(oldPath), args[1]);
        await fsp.rename(oldPath, newPath);
      } catch {
        console.log("Operation failed");
      }
      break;

    case "rm":
      try {
        await fsp.rm(resolvePath(args[0]));
      } catch {
        console.log("Operation failed");
      }
      break;

    case "cp":
      try {
        const src = resolvePath(args[0]);
        const dest = path.join(resolvePath(args[1]), path.basename(src));
        await new Promise((resolve, reject) => {
          fs.createReadStream(src)
            .pipe(fs.createWriteStream(dest))
            .on("finish", resolve)
            .on("error", reject);
        });
      } catch {
        console.log("Operation failed");
      }
      break;

    case "mv":
      try {
        const src = resolvePath(args[0]);
        const dest = path.join(resolvePath(args[1]), path.basename(src));
        await new Promise((resolve, reject) => {
          fs.createReadStream(src)
            .pipe(fs.createWriteStream(dest))
            .on("finish", async () => {
              try {
                await fsp.rm(src);
                resolve();
              } catch {
                reject();
              }
            })
            .on("error", reject);
        });
      } catch {
        console.log("Operation failed");
      }
      break;

    default:
      throw new Error("Unsupported command");
  }
}
