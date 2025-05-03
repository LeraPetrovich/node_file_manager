import fs from "fs/promises";
import path from "path";

export async function handleNavigation(command, args, currentDir) {
  const validCommand = ["up", "cd", "ls"];
  if (!validCommand.includes(command)) {
    throw new Error("Invalid navigation command");
  }
  let newPath = currentDir;

  if (command == "up") {
    const parent = path.dirname(currentDir);
    if (parent !== currentDir) {
      newPath = parent;
    }
  } else if (command === "cd") {
    if (args.length === 0) {
      throw new Error("No path provided for 'cd'");
    }

    const targetPath = path.isAbsolute(args[0])
      ? args[0]
      : path.resolve(currentDir, args[0]);

    try {
      const stats = await fs.stat(targetPath);
      if (stats.isDirectory()) {
        newPath = targetPath;
      } else {
        throw new Error("Not a directory");
      }
    } catch (err) {
      throw new Error("Invalid path");
    }
  } else if (command === "ls") {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    const folders = entries
      .filter((e) => e.isDirectory())
      .map((e) => ({ Name: e.name, Type: "directory" }));

    const files = entries
      .filter((item) => item.isFile())
      .map((el) => ({ Name: el.name, Type: "file" }));
    console.table([...folders.sort(), ...files.sort()]);
  }

  return newPath;
}
