const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { logger, uploadInfoLogToS3, clearCurrentLog } = require("../logger");
const { S3Client } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const {
  getSystemParameterByKey,
  processEssays,
  getActivity,
  getPrompt,
  processTextactResult,
  createLogRecord,
  createUserNotification,
  getStudentsInAClassroomAPI,
} = require("./api");

const { splitFilePerStudent } = require("./utils");

const { validateEvent } = require("../validations");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handlerV1 = async (event, job) => {
  logger.debug(`EVENT V1: ${JSON.stringify(event)}`);

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
  let studentsHandWritingLog;
  let numberOfPagesDetectedInTheDoc = 0;

  const ddbClient = new AWS.DynamoDB.DocumentClient();
  const textractClient = new AWS.Textract();
  const lambdaService = new AWS.Lambda();
  const s3Client = new S3Client({
    apiVersion: "2006-03-01",
    region: process.env.REGION,
  });
  const systemParam = await getSystemParameterByKey(
    "REACT_APP_EMT_API_BASE_URL"
  );
  const ENDPOINT = systemParam.paramData;

  logObject.fileUrl = job.fileURL;
  logObject.uploadUserID = job.userID;
  logObject.uploadedFileName = job.uploadedFileName;
  const activity = await getActivity(ddbClient, job.activityID);
  if (activity) {
    logObject.activityID = activity.id;
    logObject.schoolID = activity.schoolID;
    const prompt = await getPrompt(ddbClient, activity.promptID);
    if (prompt) {
      const { essayObjects, numberOfPagesDetected } =
        await processTextactResult(textractClient, job.jobID);
      numberOfPagesDetectedInTheDoc = numberOfPagesDetected;
      logObject.numberOfStudents = essayObjects ? essayObjects.length : 0;
      const activityClassroomStudents = await getStudentsInAClassroomAPI(
        activity.classroomID
      );
      const result = await processEssays(
        essayObjects,
        activity,
        prompt,
        ENDPOINT,
        activityClassroomStudents,
        lambdaService
      );
      // adding the student page mapping.
      studentsPageMapping = result.studentsPageMapping;
      studentsHandWritingLog = result.studentsHandWritingLog;
    }
  }
  const generalLogFileKey = `handwriting/${
    activity.id
  }/${new Date().toLocaleDateString()}-${uuidv4()}-UploadsLog.txt`;
  const wasLogUploaded = await uploadInfoLogToS3(
    s3Client,
    `public/${generalLogFileKey}`
  );
  const studentsFileMap = await splitFilePerStudent(
    s3Client,
    logObject.fileUrl,
    logObject.uploadedFileName,
    activity.id,
    studentsPageMapping,
    numberOfPagesDetectedInTheDoc,
  );
  await createLogRecord(
    ddbClient,
    logObject,
    generalLogFileKey,
    studentsHandWritingLog,
    studentsFileMap,
    logObject.fileUrl,
    wasLogUploaded
  );
  await createUserNotification(logObject.uploadUserID);

  clearCurrentLog();
};

module.exports = {
  handlerV1,
};
