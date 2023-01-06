import client from "../index.js";
import fs from "fs/promises";
import Logger from "@utils/logger.js";

// let modules = await fs.readdir("./dist/bot/modules")
// for (let module of modules) {
//     const moduleFile = await import(`../bot/modules/${module}`);
//     let moduleObject = new moduleFile();
//     moduleObject = moduleFile.default;
//     moduleObject.entrypoint(client);
//     Logger.info(`Loaded module: ${moduleObject.name}`);
// }
//    use code above but when find directory recurse
const loadedModules: any = [];
async function moduleLoader(pathAdditions = ""): Promise<void> {
  const moduleFiles = await fs.readdir("./dist/bot/modules" + pathAdditions);
  for (const file of moduleFiles) {
    if (file.startsWith("_") || (file.includes(".") && !file.endsWith(".js"))) {
      continue;
    }
    if (!file.endsWith(".js")) {
      await moduleLoader(pathAdditions + "/" + file);
      continue;
    }
    const moduleFile = await import(`../bot/modules${pathAdditions}/${file}`);
    let moduleObject = moduleFile.default;
    moduleObject = new moduleObject(client);
    moduleObject.entrypoint(client);
    moduleObject.commands?.forEach((command: any) => {
      command.run = command.run.bind(moduleObject);
      client.commands.text.set(command.name, command);
    });
    Logger.info(`Loaded module: ${moduleObject.name}`);
    loadedModules.push(moduleObject);
  }
}

export async function loadModules() {
  await moduleLoader();
}
export { loadedModules };
