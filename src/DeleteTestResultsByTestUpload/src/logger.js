const winston = require("winston");
const { format } = require("logform");
const { combine, timestamp, json } = format;
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const consoleLogFormat = combine(timestamp(), json()); // json format is useful for filtering in CloudWatch

const NODE_ENV = process.env.NODE_ENV ?? "development";
let infoLog = [];

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: consoleLogFormat,
    }),
  ],
});

const clearCurrentLog = () =>{
  infoLog = []
}

logger.on("data", async (info) => {
  if (info && info.level === "info") {
    infoLog.push(info?.message);
  }
});

const uploadInfoLogToS3 = async (s3Client, s3LogPath) => {
  try {
    console.log(infoLog);
    if (infoLog && infoLog.length > 0) {
      const input = {
        Bucket: process.env.BUCKET,
        Key: s3LogPath,
        ContentType: "	text/plain",
        Body: infoLog.join(""),
      };
      const command = new PutObjectCommand(input);
      const response = await s3Client.send(command);
      console.log(response);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`Unable to upload the file into s3. ${error}`);
  }
};

// default to info level except in development, where we want debug
logger.level =
  process.env.LOG_LEVEL || (NODE_ENV === "development" ? "debug" : "info");

module.exports = { logger, uploadInfoLogToS3, clearCurrentLog };
