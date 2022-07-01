// Create a new MongoClient
import pkg from "mongoose";
import Logger from "../logger.js";
import client from "../../index.js";
const { connect } = pkg;

async function initMongo(): Promise<void> {
    const uri = client.config.databaseURL;
    const db = await connect(uri);

    Logger.info("Connected to MongoDB");
}

export { initMongo };
