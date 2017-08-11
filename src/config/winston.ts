import {join} from "path";
import {configure, Logger, transports} from "winston";
import "winston-daily-rotate-file";
import Stream from "../lib/logger/stream";

const fileRoutesTransport = new transports.DailyRotateFile({
    datePattern: "yyyy-MM-dd.",
    filename: join(__dirname, "../../logs/http.log"),
    level: process.env.ENV === "development" ? "debug" : "info",
    prepend: true,
});
const fileModelsTransport = new transports.DailyRotateFile({
    datePattern: "yyyy-MM-dd.",
    filename: join(__dirname, "../../logs/domain.log"),
    level: process.env.ENV === "development" ? "debug" : "info",
    prepend: true,
});

const consoleTransport = new transports.Console({
    colorize: true,
    json: true,
});

configure({
    transports: [ fileModelsTransport, consoleTransport ],
});

export const logger = new Logger({
    transports: [ fileRoutesTransport, consoleTransport ],
});

export const stream = new Stream(logger);
