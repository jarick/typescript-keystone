import {StreamOptions} from "morgan";
import {LoggerInstance} from "winston";

export default class Stream implements StreamOptions {
    private logger: LoggerInstance;

    constructor(logger: LoggerInstance) {
        this.logger = logger;
    }

    public write(text: string) {
        this.logger.info(text);
    }
}
