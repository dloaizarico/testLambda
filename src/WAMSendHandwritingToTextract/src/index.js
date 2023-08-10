const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const AWS = require("aws-sdk");
const { getActivityHandwritingLogs } = require("./api");
AWS.config.update({ region: process.env.REGION });
const textTractClient = new AWS.Textract();
const s3 = new AWS.S3();
const HANDWRITING_ROUTE = "public/handwriting/";
const { logger } = require("./logger");
const event = require('./event.json');

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
    if (s3QueryResult && s3QueryResult.Contents) {
      const filesList = s3QueryResult.Contents;
      filesList.forEach((file) => {
        const key = file.Key.toUpperCase();
        logger.debug(`Key ${key}`);
        logger.debug(`condition ${filesProcessed.includes(key)}`);
        if (
          (key && key.includes(".PDF")) ||
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
            logger.error("Unable to process the file, it does not fulfill the proper structure.")
          }
        }
      });
    }
    return filesKeys;
  } catch (error) {
    logger.error(
      `Error trying to get the files in the folder ${JSON.stringify(error)}`
    );
    return null;
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handler = async (event) => {
  logger.debug(`EVENT: ${JSON.stringify(event)}`);
  const inputData = JSON.parse(event.body);
  if (inputData && inputData.activityID && inputData.userID) {
    const ddbClient = new AWS.DynamoDB.DocumentClient();
    const handwritingLogs = await getActivityHandwritingLogs(
      ddbClient,
      inputData.activityID
    );
    let filesProcessed = [];
    if (handwritingLogs && handwritingLogs.length > 0) {
      console.log(handwritingLogs);
      filesProcessed = handwritingLogs?.map((handwritingLog) =>
        handwritingLog.uploadedFileName?.toUpperCase()
      );
    }

    const filesKeys = await getFilesKeys(inputData.activityID, filesProcessed);
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
          JobTag: inputData.userID,
          NotificationChannel: {
            RoleArn: ROLE_ARN,
            SNSTopicArn: SNS_TOPIC_ARN,
          },
        };
        const result = await textTractClient
          .startDocumentTextDetection(input)
          .promise();
        logger.debug(`JOB ID generated - ${JSON.stringify(result)}`);
      }
    } else {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify(
          "There are no files available to process, please contact support."
        ),
      };
    }
  } else {
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      statusCode: 400,
      body: JSON.stringify("Parameters received were not complete"),
    };
  }
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    statusCode: 200,
    body: JSON.stringify("Process is finished"),
  };
};


handler(event)