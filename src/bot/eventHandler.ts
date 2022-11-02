import * as Discord from "discord.js";
import { readdir } from "fs/promises";
import Logger from "@utils/logger.js";

export default async function eventHandler(
  client: Discord.Client,
  pathAdditions = ""
) {
  const eventFiles = await readdir("./dist/bot/events" + pathAdditions);

  for (const file of eventFiles) {
    if (file.startsWith("_") || (file.includes(".") && !file.endsWith(".js")))
      continue;

    if (!file.endsWith(".js")) {
      await eventHandler(client, pathAdditions + "/" + file);
      continue;
    }
    const event = await import(`./events${pathAdditions}/${file}`);

    if (event.settings?.event === undefined) {
      let eventName = file.split(".")[0];
      Logger.debug("Registering event: " + eventName);
      if (event.settings.once)
        client.once(eventName, (...args: string[]) => event.default(...args));
      else client.on(eventName, (...args: string[]) => event.default(...args));
    } else {
      let eventName = event.settings.event;
      Logger.debug(
        "Registering event using file description: " +
          file.split(".")[0] +
          ` - ` +
          eventName
      );
      if (event.settings.once)
        client.once(eventName, (...args: string[]) => event.default(...args));
      else client.on(eventName, (...args: string[]) => event.default(...args));
    }
  }
}
