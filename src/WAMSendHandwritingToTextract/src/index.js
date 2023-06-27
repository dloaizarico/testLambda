const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const event = require("./event.json")

const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const textTractClient = new AWS.Textract();
const s3 = new AWS.S3();
const HANDWRITING_ROUTE = "public/handwriting/";

const getFilesKeys = async (activityID) => {
  console.log("activityID", activityID);
  console.log("BUCKET_FOR_TEXTRACT", process.env.BUCKET_FOR_TEXTRACT);
  console.log("prefix", `${HANDWRITING_ROUTE}${activityID}/`);
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
        if (
          (key && key.includes(".PDF")) ||
          key.includes(".PNG") ||
          key.includes(".JPG") ||
          key.includes(".JPEG")
        ) {
          filesKeys.push(file.Key);
        }
      });
    }
    return filesKeys;
  } catch (error) {
    console.log(
      `Error trying to get the files in the folder ${JSON.stringify(
        error
      )}`
    );
    return null;
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const inputData = JSON.parse(event.body);
  if (inputData && inputData.activityID && inputData.userID) {
    const filesKeys = await getFilesKeys(inputData.activityID);
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
        console.log(`JOB ID - ${JSON.stringify(result)}`);
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify(
          "There are no files available to process, please contact support."
        ),
      };
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify("Parameters received were not complete"),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify("Process is finished"),
  };
};

handler(event)