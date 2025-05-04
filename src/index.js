import os from "os";
import readline from "readline";
import { handleNavigation } from "./commands/navigation.js";
import { handleFileOps } from "./commands/fileOps.js";
import { handleOsCommands } from "./commands/osInfo.js";
import { handleHash } from "./commands/hash.js";
import { handleCompress } from "./commands/compress.js";

const usernameArg = process.argv.find((arg) => arg.startsWith("--username="));
const username = usernameArg ? usernameArg.split("=")[1] : "Anonymous";
let currentDir = os.homedir();

console.log(`Welcome to the File Manager, ${username}!`);

const sendCurrentDir = (dir) => {
  console.log(`You are currently in ${dir}`);
};

sendCurrentDir(currentDir);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", async (input) => {
  const trimmed = input.trim();
  if (trimmed === ".exit") {
    exitApp();
  } else {
    const [command, ...args] = trimmed.split(/\s+/);
    try {
      switch (command) {
        case "up":
        case "cd":
        case "ls":
          currentDir = await handleNavigation(command, args, currentDir);
          break;
        case "cat":
        case "add":
        case "rn":
        case "cp":
        case "mv":
        case "rm":
        case "mkdir":
          await handleFileOps(command, args, currentDir);
          break;
        case "os":
          handleOsCommands(args[0]);
          break;
        case "hash":
          await handleHash(args[0], currentDir);
          break;
        case "compress":
        case "decompress":
          await handleCompress(command, args, currentDir);
          break;
        case ".exit":
          exitApp();
          return;
        default:
          console.log("Invalid input");
      }
      sendCurrentDir(currentDir);
    } catch(error) {
      console.log(error)
      console.log("Operation failed");
    }
  }
});

rl.on("SIGINT", exitApp);

function exitApp() {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}
