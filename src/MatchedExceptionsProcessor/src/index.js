const path = require("path");
const event = require("./event.json");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { logger } = require("./logger");
const {
  getSystemParameterByKey,
  getQueuePayloadByID,
  updateQueuePayloadToRead,
  getPrompt,
  getActivity,
} = require("./api");
const { request } = require("./appSyncRequest");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { processMatchedExceptions } = require("./matchedExceptionsHelper");
const { createNotification } = require("./graphql/bpmutations");

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

      let activity, prompt;
      const genericError =
        "There was an error and the matching didn't finish, please contact support.";

      const s3Client = new S3Client({
        apiVersion: "2006-03-01",
        region: process.env.REGION,
      });

      const systemParam = await getSystemParameterByKey(
        "REACT_APP_EMT_API_BASE_URL"
      );

      const ENDPOINT = systemParam?.paramData;
      // Loading payload from dynamo.
      const payloadRecord = await getQueuePayloadByID(
        ddbClient,
        message?.payloadID
      );
      let result = {};
      let notificationMessage = "";
      if (!payloadRecord || Object.keys(payloadRecord).length === 0) {
        logger.error(`payload received was empty, unable to continue`);
        notificationMessage = genericError;
      } else if (payloadRecord.isRead) {
        logger.error("The payload had been processed already.");
        notificationMessage = genericError;
      } else {
        let payloadData;
        // if the payload is not an object (before 1/5/2024), it's a string with a s3 file key.
        if (typeof payloadRecord.payload === "string") {
          // get the file and transform into object.
          const command = new GetObjectCommand({
            Bucket: process.env.BUCKET,
            Key: payloadRecord.payload,
          });
          // It downloads the original file  with the payload content.
          const response = await s3Client.send(command);
          // it gets the Body to string.
          const jsonString = await response.Body?.transformToString();
          // it parse the information to a JSON.
          payloadData = await JSON.parse(jsonString ?? "");
        } else {
          // If it's stored as an object, get the data as it is.
          payloadData = payloadRecord?.payload;
        }

        prompt = await getPrompt(ddbClient, payloadData?.promptID);
        activity = await getActivity(ddbClient, payloadData?.activityID);

        // If no prompt or activity was found, trigger error.
        if (!prompt || !activity) {
          logger.error("The payload had been processed already.");
          notificationMessage = genericError;
        } else {
          // Match the exceptions.
          result = await processMatchedExceptions(
            ddbClient,
            payloadData,
            s3Client,
            ENDPOINT,
            prompt,
            activity
          );
          await updateQueuePayloadToRead(ddbClient, message?.payloadID);
        }
      }
      // Check if there are any error messages.
      notificationMessage =
        notificationMessage === ""
          ? `The matching has been finished successfully for ${
              prompt?.promptName
            } created on ${new Date(activity?.createdAt).toLocaleDateString()}.`
          : notificationMessage;

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

      // create notification.
      await request({
        query: createNotification,
        variables: { input },
      });
      logger.debug(`Process is finished ${result}`);
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