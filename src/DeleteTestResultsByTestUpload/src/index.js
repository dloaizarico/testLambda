const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const {
  removeResultsByTestUploadID,
  autidElementsBeforeDeleting,
} = require("./helper");
const { S3Client } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { clearCurrentLog, logger, uploadInfoLogToS3 } = require("./logger");
const { ANSWER_CODES, TABLE_NAMES, OPERATIONS } = require("./utils");
const { v4: uuidv4 } = require("uuid");
const { processInBatchDynamo } = require("./api");
const event = require("./event.json");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handler = async (event) => {
  logger.info(`EVENT: ${JSON.stringify(event)}`);

  const inputData = JSON.parse(event.body);
  if (
    inputData?.testUploadIDs &&
    inputData?.testUploadIDs.length > 0 &&
    inputData?.userID !== ""
  ) {
    const client = new DynamoDBClient({});
    const s3Client = new S3Client({ region: process.env.REGION });

    const testUploadsToRemove = [];
    for (let index = 0; index < inputData?.testUploadIDs.length; index++) {
      const testUploadID = inputData?.testUploadIDs[index];
      const response = await removeResultsByTestUploadID(testUploadID, client);


      if (response.statusCode === ANSWER_CODES.SUCCESS_OPERATIONS) {
        testUploadsToRemove.push({ id: testUploadID });
      }
    }
    // Audit elements before deleting.
    await autidElementsBeforeDeleting(
      testUploadsToRemove,
      TABLE_NAMES.TEST_UPLOAD,
      "deleteTestUploads",
      client
    );
    const response = await processInBatchDynamo(
      testUploadsToRemove,
      TABLE_NAMES.TEST_UPLOAD,
      OPERATIONS.DELETE,
      client
    );
    await uploadInfoLogToS3(
      s3Client,
      `public/adminTasks/deleteByTestUpload/${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}-${uuidv4()}-deleteLog.txt`
    );

    clearCurrentLog();
    console.log(response);
    return response
  } else {
    return {
      statusCode: 422,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify("Payload is incomplete or not enough"),
    };
  }
};

handler(event);
