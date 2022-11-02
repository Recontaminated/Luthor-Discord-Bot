import { closeLogStream } from "../logger.js";
import { loadedModules } from "../../bot/moduleLoader.js";
//export default async function to shutdown

export default async function shutdown() {
  return new Promise<void>(async (resolve, reject) => {
    for (const module of loadedModules) {
      await module.shutdown();
    }
    await closeLogStream();

    resolve();
  });
}
