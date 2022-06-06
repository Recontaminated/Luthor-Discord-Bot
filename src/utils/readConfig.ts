import { existsSync } from 'fs';
import Logger from './logger.js';
import * as dotenv from "dotenv";
import * as fs from "fs";
import isDocker from 'is-docker';
declare global {
  namespace NodeJS {
    interface ProcessEnv  {
      token: string;
      prefix: string;
      botNames: string;
      database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
      };
    }
  }
}

dotenv.config();
let config: NodeJS.ProcessEnv;

// if (isDocker()) {
  
// 	//load config.json
//   config = JSON.parse(fs.readFileSync('../../env.json', 'utf8'));
// }

config = process.env;

export { config as default };
