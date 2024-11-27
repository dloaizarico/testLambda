import { Handler } from "aws-lambda";
import { batchWriteStudentTests } from "./batchWriteToDynamoDB";
import { s3 } from "./clients";
import { clearCurrentLog, logger, uploadInfoLogToS3 } from "./logger";
import { processStudentTests } from "./processStudentTests";
import { readCsvFromS3 } from "./readCSVFromS3";

interface Event {
  readonly bucketName: string;
  readonly fileKeys: string[];
}

export const handler: Handler<Event> = async (event) => {
  try {
    for (const fileKey of new Set(event.fileKeys)) {
      const csvData = await readCsvFromS3(event.bucketName, fileKey);
      logger.info("Found %d rows in file at '%s'", csvData.length, fileKey);

      const fileResults = await processStudentTests(csvData);
      logger.info("Found %d results, %d test uploads", fileResults.numberOfProcessedResults, fileResults.testUploadItems.length);
      await batchWriteStudentTests(fileResults);
    }

    const generalLogFileKey = `dataUploader/${new Date().toISOString()}-UploadsLog.txt`;
    await uploadInfoLogToS3(s3, event.bucketName, `logs/${generalLogFileKey}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data processed successfully" }),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error processing CSVs", error: errorMessage }),
    };
  } finally {
    clearCurrentLog();
  }
};
