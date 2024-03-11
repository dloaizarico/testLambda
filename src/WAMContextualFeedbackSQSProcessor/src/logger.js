const winston = require("winston");
const { format } = require("logform");
const util = require("util");
const { combine, timestamp, json, errors, prettyPrint } = format;

const LOG_FILE_PATH = "/tmp/getContextualFeedbackForEssay-log.txt";

const consoleLogFormat = combine(timestamp(), json()); // json format is useful for filtering in CloudWatch

const fileLogFormat = combine(
  timestamp(),
  errors({ stack: true }),
  prettyPrint()
);

const NODE_ENV = process.env.NODE_ENV ?? "development";

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: LOG_FILE_PATH,
      format: fileLogFormat,
      options: { flags: "w" },
    }),
    new winston.transports.Console({
      format: consoleLogFormat,
    }),
  ],
});
// default to info level except in development, where we want debug
winstonLogger.level =
  process.env.LOG_LEVEL || (NODE_ENV === "development" ? "debug" : "info");

// returns a new promise that resolves when all log messages have been written
const getLoggerEndPromise = () => {
  return new Promise((resolve, reject) => {
    // Each instance of winston.Logger is also a [Node.js stream]. A finish event will be raised when all logs have flushed to all transports after the stream has been ended.
    winstonLogger.on("finish", (info) => {
      // All `info` log messages has now been logged
      resolve(info);
    });
    // It is also worth mentioning that the logger also emits an 'error' event if an error occurs within the logger itself which you should handle or suppress if you don't want unhandled exceptions:
    winstonLogger.on("error", (err) => {
      // Handle errors originating in the logger itself
      reject(err);
    });
  });
};

// wrap the winston logger to support multiple arguments in log(....) calls
const wrapWinstonLogger = (logLevel) => {
  return function (...params) {
    const args = Array.from(params);
    winstonLogger[logLevel](util.format(...args));
  };
};

const logger = {
  silly: wrapWinstonLogger("silly"),
  debug: wrapWinstonLogger("debug"),
  verbose: wrapWinstonLogger("verbose"),
  info: wrapWinstonLogger("info"),
  warn: wrapWinstonLogger("warn"),
  error: wrapWinstonLogger("error"),
};

module.exports = { logger, LOG_FILE_PATH, getLoggerEndPromise };
