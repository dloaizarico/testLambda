const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { logger } = require("./logger");
const {
  getSystemParameterByKey,
  getQueuePayloadByID,
  updateQueuePayloadToRead,
} = require("./api");
const { request } = require("./appSyncRequest");
const { S3Client } = require("@aws-sdk/client-s3");
const { processMatchedExceptions } = require("./matchedExceptionsHelper");
const { createNotification } = require("./graphql/bpmutations");
const event = require("./event.json");

// Constants for notifications.
const sysType = "notify";
const read = false;
const sender = "admin@elastik.com";
const expiryDaysForNotification = 2;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handler = async (event) => {
  logger.info(`EVENT: ${JSON.stringify(event)}`);
  // failure jobs that go to the dead letter queue
  const batchItemFailures = [];

  // Calculating the expiry time of the notification
  const expiryTime = Math.floor(
    new Date().setDate(new Date().getDate() + expiryDaysForNotification) / 1000
  );

  for (const record of event.Records) {
    const { body, messageId } = record;
    try {
      // Getting the payload from the message.
      let message = typeof body === "string" ? JSON.parse(body) : body;

      const ddbClient = new AWS.DynamoDB.DocumentClient();

      const s3Client = new S3Client({
        apiVersion: "2006-03-01",
        region: process.env.REGION,
      });

      const systemParam = await getSystemParameterByKey(
        "REACT_APP_EMT_API_BASE_URL"
      );

      let notificationMessage = "The matching has been finished successfully.";

      const ENDPOINT = systemParam?.paramData;
      // Loading payload from dynamo.
      const payloadRecord = await getQueuePayloadByID(
        ddbClient,
        message?.payloadID
      );
      let result = {};
      if (!payloadRecord || Object.keys(payloadRecord).length === 0) {
        logger.error(`payload received was empty, unable to continue`);
        notificationMessage =
          "There was an error and the matching didn't finish, please contact support.";
      } else {
        // } else if (payloadRecord.isRead) {
        //   logger.error(`The payload had been processed already.`);
        //   notificationMessage =
        //     "There was an error and the matching didn't finish, please contact support.";
        // } else {
        result = await processMatchedExceptions(
          ddbClient,
          payloadRecord.payload,
          s3Client,
          ENDPOINT
        );
        await updateQueuePayloadToRead(ddbClient, message?.payloadID);
      }

      logger.debug(`Process is finished ${result}`);

      // Creating the notification for the user.
      const input = {
        sysType,
        read,
        readDate: "",
        type: "Matched exceptions",
        message: notificationMessage,
        recipient: message.userEmail,
        sender,
        expiryTime,
      };

      await request({
        query: createNotification,
        variables: { input },
      });
    } catch (err) {
      logger.error(
        `The process was not run for the ${messageId} due to ${err}`
      );
      batchItemFailures.push({
        itemIdentifier: messageId,
      });
    }
  }
  return { batchItemFailures };
};

handler(event);
