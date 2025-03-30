import * as path from "path";
import * as winston from "winston";
import "winston-daily-rotate-file";

const logsDirectoryPath = path.join(__dirname, "..", "..", "..", "logs");

interface Config {
  ERROR_LOGS_MAX_SIZE?: string;
  ERROR_LOGS_MAX_DAYS?: string;
  ERROR_LOGS_DATE_PATTERN?: string;

  COMBINED_LOGS_MAX_SIZE?: string;
  COMBINED_LOGS_MAX_DAYS?: string;
  COMBINED_LOGS_DATE_PATTERN?: string;

  isDev?: boolean;
}

export default (
  logLevelMain: "error" | "warn" | "info" | "verbose" | "debug" | "silly",
  config: Config
): winston.Logger => {
  const {
    ERROR_LOGS_MAX_SIZE = "20m",
    ERROR_LOGS_MAX_DAYS = "14d",
    ERROR_LOGS_DATE_PATTERN = "YYYY-MM-DD-HH",

    COMBINED_LOGS_MAX_SIZE = "20m",
    COMBINED_LOGS_MAX_DAYS = "14d",
    COMBINED_LOGS_DATE_PATTERN = "YYYY-MM-DD-HH",
  } = config;

  const mainProdFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  );

  const combinedTransport = new winston.transports.DailyRotateFile({
    level: logLevelMain,
    filename: path.join(logsDirectoryPath, "main-combined-%DATE%.log"),
    datePattern: COMBINED_LOGS_DATE_PATTERN,
    zippedArchive: true,
    maxSize: COMBINED_LOGS_MAX_SIZE,
    maxFiles: COMBINED_LOGS_MAX_DAYS,
    format: mainProdFormat,
  });

  const errorTransport = new winston.transports.DailyRotateFile({
    level: "error",
    filename: path.join(logsDirectoryPath, "main-error-%DATE%.log"),
    datePattern: ERROR_LOGS_DATE_PATTERN ?? "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: ERROR_LOGS_MAX_SIZE,
    maxFiles: ERROR_LOGS_MAX_DAYS,
    format: mainProdFormat,
  });

  winston.addColors({
    error: "red",
    warn: "magenta",
    info: "green",
    verbose: "gray",
    debug: "blue",
    silly: "grey",
  });

  const main = winston.createLogger({
    level: logLevelMain,
    format: winston.format.timestamp(),
    transports: [],
  });

  if (config.isDev) {
    main.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      })
    );
  } else {
    main.add(combinedTransport);
    main.add(errorTransport);
  }

  return main;
};
