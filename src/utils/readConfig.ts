import * as dotenv from "dotenv";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      token: string;
      clientID: string;
      prefix: string;
      botNames: string;
      guildID: string;
      databaseURL: string;
      openAIKey: string;
    }
  }
}

dotenv.config();
let config: NodeJS.ProcessEnv;

config = process.env;

export { config as default };
export type configType = NodeJS.ProcessEnv;
