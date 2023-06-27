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
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const event = require("./event.json");
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
// const { S3Client } = require("@aws-sdk/client-s3");
const { GetObjectCommand, PutObjectCommand, S3Client} = require("@aws-sdk/client-s3");
const PDFDocument = require("pdf-lib").PDFDocument;

const {
  getSystemParameterByKey,
  processEssays,
  getActivity,
  getPrompt,
  processTextactResult,
  createLogRecord,
  createUserNotification,
} = require("./api");

const { createLogFileInS3Bucket, splitFilePerStudent } = require("./utils");

const { validateEvent } = require("./validations");
const { createNotification } = require("./graphql/bpmutations");



/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handler = async (event) => {
//   const s3Client = new S3Client({
//     apiVersion: "2006-03-01",
//     region: process.env.REGION,
//   });
//   try {
//     const command = new GetObjectCommand({
//       Bucket: process.env.BUCKET,
//       Key: "public/handwriting/189b2e21-f26f-407e-b392-89e6a0e1b390/scan2.pdf",
//     });
//     // It downloads the original file uploaded by the teacher.
//     const response = await s3Client.send(command);

    

//     let pdfString = await response.Body?.transformToString("base64");

    

    
//     console.log("Original S3 file downloaded.");
//     let pdfContent = await PDFDocument.load(pdfString);
//   } catch (error) {
//     console.log(error);
//   }
// return
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
  let studentsPageMapping;
  const logRepo = [];
  const jobsToProcess = validateEvent(event);
  if (jobsToProcess && jobsToProcess.length > 0) {
    const ddbClient = new AWS.DynamoDB.DocumentClient();
    const textractClient = new AWS.Textract();
    // const s3Client = new AWS.S3();
    const s3Client = new S3Client({
      apiVersion: "2006-03-01",
      region: process.env.REGION,
    });
    const systemParam = await getSystemParameterByKey(
      "REACT_APP_EMT_API_BASE_URL"
    );
    console.log("system param", systemParam);
    const ENDPOINT = systemParam.paramData;
    for (let index = 0; index < jobsToProcess.length; index++) {
      const job = jobsToProcess[index];
      logObject.fileUrl = job.fileURL;
      logObject.uploadUserID = job.userID;
      const activity = await getActivity(ddbClient, job.activityID, logRepo);
      if (activity) {
        logObject.activityID = activity.id;
        logObject.schoolID = activity.schoolID;
        const prompt = await getPrompt(ddbClient, activity.promptID, logRepo);
        if (prompt) {
          const essays = await processTextactResult(textractClient, job.jobID);
          console.log("essays------------------->", essays);
          logObject.numberOfStudents = essays ? essays.length : 0;
          studentsPageMapping = await processEssays(
            essays,
            activity,
            prompt,
            ENDPOINT,
            logRepo
          );
          console.log(
            "studentsPageMapping------------------->",
            studentsPageMapping
          );
        }
      }
      const keyWithoutPublicPrefix = await createLogFileInS3Bucket(
        s3Client,
        activity.id,
        logRepo
      );
      const studentsFileMap = await splitFilePerStudent(
        s3Client,
        logObject.fileUrl,
        activity.id,
        studentsPageMapping
      );
      logObject.studentsPageMapping = studentsFileMap;
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
