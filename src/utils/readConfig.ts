import { existsSync } from 'fs';
import Logger from './logger.js';
import * as dotenv from "dotenv";
import * as fs from "fs";
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

const config = process.env;

export { config as default };