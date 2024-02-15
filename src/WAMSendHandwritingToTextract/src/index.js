const path = require("path");
const event = require("./event.json");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const AWS = require("aws-sdk");
const { getActivityHandwritingLogs } = require("./api");
AWS.config.update({ region: process.env.REGION });
const textTractClient = new AWS.Textract();
const s3 = new AWS.S3();
const HANDWRITING_ROUTE = "public/handwriting/";
const { logger } = require("./logger");

// Every transaction sent to textract will be paused for 3 secs until the next one is sent.
const TEXTRACT_WAIT_TO_AVOID_REACHING_LIMIT = 3000;

const getFilesKeys = async (activityID, filesProcessed) => {
  logger.debug(`activityID ${activityID}`);
  logger.debug(`BUCKET_FOR_TEXTRACT ${process.env.BUCKET_FOR_TEXTRACT}`);
  logger.debug("prefix", `${HANDWRITING_ROUTE}${activityID}/`);
  logger.debug(`files processed: ${filesProcessed}`);
  const params = {
    Bucket: process.env.BUCKET_FOR_TEXTRACT,
    Prefix: `${HANDWRITING_ROUTE}${activityID}/`,
  };
  try {
    const s3QueryResult = await s3.listObjectsV2(params).promise();
    const filesKeys = [];
    if (s3QueryResult?.Contents) {
      const filesList = s3QueryResult.Contents;
      filesList.forEach((file) => {
        const key = file.Key.toUpperCase();
        logger.debug(`Key ${key}`);
        logger.debug(`condition ${filesProcessed.includes(key)}`);
        if (
          key?.includes(".PDF") ||
          key.includes(".PNG") ||
          key.includes(".JPG") ||
          key.includes(".JPEG")
        ) {
          // get name of the file, structure should be always public/handwriting/activityID/filename.ext
          const keyStructure = key.split("/");
          if (keyStructure && keyStructure.length === 4) {
            const fileName = keyStructure[3];
            if (filesProcessed.includes(fileName)) {
              logger.debug(`file already processed ${key}`);
            } else {
              logger.debug(`file added ${key}`);
              filesKeys.push(file.Key);
            }
          } else {
            logger.debug(
              "Unable to process the file, it does not fulfill the proper structure."
            );
          }
        }
      });
    }
    return filesKeys;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Error trying to get the files in the folder ${JSON.stringify(error)}`
    );
  }
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handler = async (event) => {
  logger.debug(`EVENT: ${JSON.stringify(event)}`);
  // failure jobs that go to the dead letter queue
  const batchItemFailures = [];
  for (const record of event.Records) {
    const { body, messageId } = record;

    try {
      // Getting the payload from the message.
      const inputData = typeof body === "string" ? JSON.parse(body) : body;
      if (inputData?.activityID && inputData.userID) {
        const ddbClient = new AWS.DynamoDB.DocumentClient();
        const handwritingLogs = await getActivityHandwritingLogs(
          ddbClient,
          inputData.activityID
        );
        let filesProcessed = [];
        if (handwritingLogs && handwritingLogs.length > 0) {
          filesProcessed = handwritingLogs?.map((handwritingLog) =>
            handwritingLog.uploadedFileName?.toUpperCase()
          );
        }

        const filesKeys = await getFilesKeys(
          inputData.activityID,
          filesProcessed
        );
        if (filesKeys && filesKeys.length > 0) {
          const ROLE_ARN = process.env.TEXTRACT_ROLE_ARN;
          const SNS_TOPIC_ARN = process.env.TEXTRACT_TOPIC_ARN;

          for (let i = 0; i < filesKeys.length; i++) {
            const input = {
              DocumentLocation: {
                S3Object: {
                  Bucket: process.env.BUCKET_FOR_TEXTRACT,
                  Name: filesKeys[i],
                },
              },
              // userID - followed by the version of the lambda that will process the request.
              JobTag: `${inputData.userID}_${inputData.processorVersion}`,
              NotificationChannel: {
                RoleArn: ROLE_ARN,
                SNSTopicArn: SNS_TOPIC_ARN,
              },
            };
            const result = await textTractClient
              .startDocumentTextDetection(input)
              .promise();
            await sleep(TEXTRACT_WAIT_TO_AVOID_REACHING_LIMIT);
            logger.debug(`JOB ID generated - ${JSON.stringify(result)}`);
          }
        } else {
          throw new Error(
            "There are no files available to process, please contact support."
          );
        }
      } else {
        throw new Error("Parameters received were not complete");
      }
    } catch (error) {
      logger.error(
        `Error while sending information to textract from message ${messageId} ${error}`
      );
      batchItemFailures.push({
        itemIdentifier: messageId,
      });
    }
  }
  return { batchItemFailures };
};

handler(event);
