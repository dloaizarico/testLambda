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

const {
  splitFilePerStudent,
  ParseDOB,
  groupEssayPagesByStudent,
} = require("./utils");

const { validateEvent } = require("../validations");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handlerV2 = async (event, job) => {
  logger.debug(`EVENT V2: ${JSON.stringify(event)}`);

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
  let pagesContentMapProperText;

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
      const {
        processedPages,
        numberOfPagesDetected,
        pagesContentMapWithProperText,
      } = await processTextactResult(textractClient, job.jobID);

      pagesContentMapProperText = pagesContentMapWithProperText;
      const essayObjects = groupEssayPagesByStudent(processedPages);
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
      studentsPageMapping = result.studentsPageMapping;
      studentsHandWritingLog = result.studentsHandWritingLog;
    }
  }
  // return
  const generalLogFileKey = `handwriting/${activity.id}/${ParseDOB(
    new Date()
  )}-${uuidv4()}-UploadsLog.txt`;
  const wasLogUploaded = await uploadInfoLogToS3(
    s3Client,
    `public/${generalLogFileKey}`
  );
  const studentsFileMap = await splitFilePerStudent(
    s3Client,
    logObject.fileUrl,
    activity.id,
    studentsPageMapping,
    numberOfPagesDetectedInTheDoc
  );

  await createLogRecord(
    ddbClient,
    logObject,
    generalLogFileKey,
    studentsHandWritingLog,
    pagesContentMapProperText,
    studentsPageMapping,
    studentsFileMap,
    logObject.fileUrl,
    wasLogUploaded
  );
  await createUserNotification(logObject.uploadUserID);

  clearCurrentLog();
};

module.exports = {
  handlerV2,
};
