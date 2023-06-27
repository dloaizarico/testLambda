/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["COGNITO_STUDENT_PASSWORD"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const event = require("./event.json")
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });

const {
  getSystemParameterByKey,
  processEssays,
  getActivity,
  getPrompt,
  processTextactResult,
  createLogRecord,
  createUserNotification,
} = require("./api");

const { createLogFileInS3Bucket } = require("./utils");

const { validateEvent } = require("./validations");
const { createNotification } = require("./graphql/bpmutations");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  // This object is used to create the log record in dynamo.
  const logObject = {
    activityID: "",
    uploadDate: "",
    uploadUserID: "",
    schoolID: "",
    numberOfStudents: "",
    fileUrl: "",
    studentsPageMapping: "",
  };
  const logRepo = [];
  const jobsToProcess = validateEvent(event);
  if (jobsToProcess && jobsToProcess.length > 0) {
    const ddbClient = new AWS.DynamoDB.DocumentClient();
    const textractClient = new AWS.Textract();
    const s3Client = new AWS.S3();
    
    const systemParam = await getSystemParameterByKey(
      "REACT_APP_EMT_API_BASE_URL"
    );
    console.log("system param", systemParam);
    const ENDPOINT = systemParam.paramData;
    logObject.fileUrl = jobsToProcess[0].fileURL;
    logObject.uploadUserID = jobsToProcess[0].userID;
    for (let index = 0; index < jobsToProcess.length; index++) {
      const job = jobsToProcess[index];
      const activity = await getActivity(ddbClient, job.activityID, logRepo);
      if (activity) {
        logObject.activityID = activity.id;
        logObject.schoolID = activity.schoolID;
        const prompt = await getPrompt(ddbClient, activity.promptID, logRepo);
        if (prompt) {
          const essays = await processTextactResult(textractClient, job.jobID);
          logObject.numberOfStudents = essays ? essays.length : 0;
          const studentsPageMapping = await processEssays(
            essays,
            activity,
            prompt,
            ENDPOINT,
            logRepo
          );
          logObject.studentsPageMapping = studentsPageMapping;
        }
      }
      const keyWithoutPublicPrefix = await createLogFileInS3Bucket(s3Client, activity.id, logRepo);
      await createLogRecord(ddbClient, logObject, keyWithoutPublicPrefix);
      await createUserNotification(logObject.uploadUserID);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
};


handler(event);