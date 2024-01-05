const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const event = require("./event.json");
const winston = require("winston");
const { format } = require("logform");
const { combine, timestamp, json } = format;

const consoleLogFormat = combine(timestamp(), json()); // json format is useful for filtering in CloudWatch

const NODE_ENV = process.env.NODE_ENV || "development";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: consoleLogFormat,
    }),
  ],
});
// default to info level except in development, where we want debug
logger.level =
  process.env.LOG_LEVEL || (NODE_ENV === "development" ? "debug" : "info");

module.exports = { logger };
