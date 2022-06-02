//export a default class for the logger
export default class Logger {
    //create a method for each loglevel starting with Logger.Info()
    static info(message: string) {
        console.log(`\x1b[42m[INFO]\x1b[40m ${message}`);
    }
    static warn(message: string) {
        console.log(`\x1b[43m[INFO]\x1b[40m ${message}`);
    }
    static error(message: unknown) {
        console.log(`\x1b[41m[ERROR]\x1b[40m ${message}`);
    }
    static debug(message: unknown) {
        console.log(`\x1b[44m[DEBUG]\x1b[40m ${message}`);
    }
}