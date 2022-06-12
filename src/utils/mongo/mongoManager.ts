// Create a new MongoClient
import pkg from 'mongoose';
import Logger from "../logger.js";
import config from "../readConfig.js";
const { connect } = pkg;
const uri = config.databaseURL





async function initMongo():Promise<void> {

  const db = await connect(uri)
  
  Logger.info("Connected to MongoDB");

  
}





export { initMongo }

