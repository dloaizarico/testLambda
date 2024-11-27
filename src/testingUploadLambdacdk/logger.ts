import path from "path";
import dotenv from "dotenv";
// Load the `.env` file located at "../../../../.env"
dotenv.config({ path: path.resolve(__dirname, "../../env") });
import { S3 } from "@aws-sdk/client-s3";
import { format } from "logform";
import { createLogger, transports } from "winston";

const consoleLogFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
); // json format is useful for filtering in CloudWatch

const NODE_ENV = process.env.NODE_ENV || "development";
const infoLog: unknown[] = [];

export const logger = createLogger({
  // default to info level except in development, where we want debug
  level: process.env.LOG_LEVEL || (NODE_ENV === "development" ? "debug" : "info"),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
  ],
}).on("data", (info) => {
  if (info) {
    infoLog.push(consoleLogFormat.transform(info));
  }
});

export const clearCurrentLog = () => {
  infoLog.length = 0;
};

export const uploadInfoLogToS3 = async (s3Client: S3, s3Bucket: string, s3LogPath: string) => {
  try {
    if (infoLog && infoLog.length > 0) {
      await s3Client.putObject({
        Bucket: s3Bucket,
        Key: s3LogPath,
        ContentType: "text/plain",
        Body: JSON.stringify(infoLog, undefined, 2),
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Unable to upload the file into s3. ${error}`);
    return null;
  }
};
