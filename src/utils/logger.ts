//export a default class for the logger
import * as fs from "fs";

const today = new Date();

const d =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs");
}
//check if the file exists
if (!fs.existsSync(`./logs/${d}.txt`)) {
  //TODO: check if log directory exists, create if it doesnt
  fs.writeFileSync(`./logs/${d}.txt`, "");
}
const logStream = fs.createWriteStream(`./logs/${d}.txt`, { flags: "a" });
logStream.write("-----------------------------------------------------\n");

export default class Logger {
  //create a method for each loglevel starting with Logger.Info()
  static info(message: string) {
    const time = new Date().toLocaleTimeString();
    console.log(`\x1b[42m[INFO]\x1b[40m ${message}`);
    logStream.write(new Date().toString());
    logStream.write("[INFO] " + message + "\n");
  }
  static warn(message: string) {
    console.log(`\x1b[43m[INFO]\x1b[40m ${message}`);
    logStream.write(new Date().toString());
    logStream.write("[WARN] " + message + "\n");
  }
  static error(message: unknown) {
    logStream.write(new Date().toString());
    console.log(`\x1b[41m[ERROR]\x1b[40m ${message}`);
    logStream.write("[ERROR] " + message + "\n");
  }
  static debug(message: unknown) {
    // if message is object
    const time = new Date().toLocaleTimeString();
    if (typeof message === "object") {
      const str = JSON.stringify(message);
      console.log(`\x1b[44m[DEBUG]\x1b[40m ${str}`);
      logStream.write(new Date().toString());
      logStream.write("[DEBUG] " + str + "\n");
      return;
    }

    console.log(time + ` \x1b[44m[DEBUG]\x1b[40m ${message}`);
    logStream.write(new Date().toString());
    logStream.write("[DEBUG] " + message + "\n");
  }
}

export async function closeLogStream(callback?: any) {
  return new Promise<void>(async (resolve, reject) => {
    console.log(`\x1b[42m[INFO]\x1b[40m Closing Log.. Goodbye`);
    fs.appendFileSync(
      `./logs/${d}.txt`,
      `\n ${new Date().toString()} Closing log... Goodbye`
    );
    await logStream.close();
    resolve();
  });
}
