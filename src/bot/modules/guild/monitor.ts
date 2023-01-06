import Module from "../../../types/module.js";
import fetch, { Headers } from "node-fetch";
import { watch } from "fs/promises";
import Logger from "@utils/logger.js";
import { Message } from "discord.js";
import { textCommand } from "@utils/commandDecorators.js";

import pkg from "mongoose";
import {commandOptions} from '../../../types/command.js'

const { Schema, model } = pkg;
const urls: string[] = [];
const headers = new Headers({ "User-Agent": "Luthor Status Watcher 0.0.1" });

const WatcherSchema = new Schema({
  url: String,
});
const mongooseWatcher = model("Watcher", WatcherSchema);

class Watcher {
  public readonly url: string;
  history: object[];

  constructor(url: string, intervalMS = 5000) {
    this.url = url;
    this.history = [];
  }

  async check(): Promise<string> {
    const timeStart = new Date();
    const request = await fetch(this.url, { headers: headers });
    const elapsedTime = new Date().getTime() - timeStart.getTime();
    this.history.push({
      "start time:": timeStart.toDateString(),
      "request time": elapsedTime,
      "request status": request.status,
    });
    return request.status.toString();
  }
}

export default class watcher implements Module {
  public name = "watcher";
  public watchers: Watcher[] = [];
  public commands = [
    {
      name: "addurl",
      description: "Adds a url to the watcher",
      usage: "addurl <url>",
      category: "misc",
      run: this.addURLFunction,
    },
  ];
  async shutdown() {
    for (const watcher of this.watchers) {
      let data = await mongooseWatcher.findOne({ url: watcher.url });
      if (!data) {
        Logger.info("Creating new watcher in mongoose");
        data = new mongooseWatcher({ url: watcher.url });
        await data.save();
      }
    }
  }
  async addURLFunction(message: Message, args: string[]) {
    await message.channel.send("Adding URL to watcher" + args[0]);
    console.log("this is: " + this);
    const currentWatcher = new Watcher(args[0]);
    this.watchers.push(currentWatcher);
  }

  async checkWatchers(watchers: Watcher[]) {
    for (const watcher of watchers) {
      Logger.info("Checking " + watcher.url);
      Logger.info(await watcher.check());
    }
  }
  async entrypoint() {
    Logger.debug(`atcher module loaded this is ${this}`);
    //load in saved urls
    const data = await mongooseWatcher.find();
    for (const mogooseDaddy of data) {
      urls.push(mogooseDaddy.url);
    }
    for (const url of urls) {
      Logger.debug("Adding URL watcher: " + url);
      const currentWatcher = await new Watcher(url);
      this.watchers.push(currentWatcher);
      Logger.debug(await currentWatcher.check());
    }
    // start watching lol
    setInterval(() => {
      this.checkWatchers(this.watchers);
    }, 5000);
  }
}
