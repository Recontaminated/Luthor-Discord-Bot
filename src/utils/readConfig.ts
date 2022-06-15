import { existsSync } from 'fs';
import Logger from './logger.js';
import * as dotenv from "dotenv";
import * as fs from "fs";
import isDocker from 'is-docker';
declare global {
  namespace NodeJS {
    interface ProcessEnv  {
      token: string;
      clientID: string;
      prefix: string;
      botNames: string;
      guildID: string
      databaseURL: string;
    }
  }
}

dotenv.config();
let config: NodeJS.ProcessEnv;

config = process.env;

export { config as default };
