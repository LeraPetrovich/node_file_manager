import os from "os";

export function handleOsCommands(arg) {
  const validCommands = ["EOL", "cpus", "homedir", "username", "architecture"];
  if (!validCommands.find((item) => `--${item}` === arg)) {
    throw new Error();
  }

  switch (arg) {
    case "--EOL":
      console.log(JSON.stringify(os.EOL));
      break;
    case "--cpus":
      const cpus = os.cpus();
      console.log(JSON.stringify(os.EOL));
      console.log(`Total CPUs: ${cpus.length}`);
      cpus.forEach((cpu, i) => {
        console.log(`CPU ${i + 1}: ${cpu.model}, ${cpu.speed / 1000} GHz`);
      });
      break;
    case "--homedir":
      const homedir = os.homedir();
      console.log(homedir);
      break;
    case "--username":
      console.log(os.userInfo().username);
      break;
    case "--architecture":
      console.log(os.arch());
      break;
  }
}
