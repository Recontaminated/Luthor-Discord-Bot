import { log } from "util";

//export a default class for the logger
import * as fs from "fs";
import { createImportSpecifier } from "typescript";
let today = new Date();

let d =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
//check if the file exists
if (!fs.existsSync(`./logs/${d}.txt`)) {
  console.log("creating file at " + `../../logs/${d}.txt`);
  //TODO: check if log directory exists, create if it doesnt
  fs.writeFileSync(`./logs/${d}.txt`, "");
}
let logStream = fs.createWriteStream(`./logs/${d}.txt`, { flags: "a" });
logStream.write("-----------------------------------------------------\n");

export default class Logger {

  //create a method for each loglevel starting with Logger.Info()
  static info(message: string) {
    console.log(`\x1b[42m[INFO]\x1b[40m ${message}`);
    logStream.write("[INFO] " + message + "\n");
  }
  static warn(message: string) {
    console.log(`\x1b[43m[INFO]\x1b[40m ${message}`);
    logStream.write("[WARN] " + message + "\n");
  }
  static error(message: unknown) {
    console.log(`\x1b[41m[ERROR]\x1b[40m ${message}`);
    logStream.write("[ERROR] " + message + "\n");
  }
  static debug(message: unknown) {
    console.log(`\x1b[44m[DEBUG]\x1b[40m ${message}`);
    logStream.write("[DEBUG] " + message + "\n");
  }
}

export async function closeLogStream(callback?: any) {
  return new Promise<void>(async (resolve, reject) => {
    console.log(`\x1b[42m[INFO]\x1b[40m Closing Log.. Goodbye`);
    fs.appendFileSync(`./logs/${d}.txt`, "Closing log... Goodbye");
    await logStream.close();
    resolve();
  });
}

