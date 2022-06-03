// Create a new MongoClient
import { MongoClient } from "mongodb";
import Logger from "./logger.js";
const uri = "mongodb://admin:giDb7hAa5P5ePm%21P@192.168.1.133:24575/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const DBClient = new MongoClient(uri);
DBClient.connect(function (err) {
  Logger.info("Connected successfully to Database");
});
export default DBClient;
