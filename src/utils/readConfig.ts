import { readFileSync } from 'fs';
// get enviroment variables all

export function readConfig(): Config {
  
  const configFile = readFileSync('config.json');
  return JSON.parse(configFile.toString());
}

interface Config {
  token: string;
  prefix: string;
  botName: string;
}

const config = readConfig();
export { config as default };