//export a default class for the logger
export default class Logger {
    //create a method for each loglevel starting with Logger.Info()
    static info(message: string) {
        console.log(`\x1b[42m[INFO]\x1b[0m ${message}`);
    }
    static warn(message: string) {
        console.log(`[WARN] ${message}`);
    }
    static error(message: string) {
        console.log(`[ERROR] ${message}`);
    }
    static debug(message: string) {
        console.log(`[DEBUG] ${message}`);
    }
}