const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { SSMClient, GetParametersCommand } = require("@aws-sdk/client-ssm");
const { fromNodeProviderChain } = require("@aws-sdk/credential-providers");
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { CognitoIdentityServiceProvider } = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const dayjs = require("dayjs");
const PDFDocument = require("pdf-lib").PDFDocument;
const {
  getStudentBySchoolYearAndStudentID,
  getSystemParameter,
  getQueuePayload,
} = require("./graphql/bpqueries");
const { request } = require("./appSyncRequest");
const { logger } = require("./logger");

const ACTIVITY_TABLE_NAME = "Activity";
const PROMPT_TABLE_NAME = "Prompt";
const HANDWRITINGLOG_TABLE_NAME = "HandwritingLog";
const STUDENTS_HANDWRITINGLOG_TABLE_NAME = "StudentHandwritingLog";
const QUEUE_PAYLOAD_TABLE_NAME = "QueuePayload";

/**
 * It fetches the payload stored in dynamo to process.
 * @param {*} payloadID
 * @returns
 */
const getQueuePayloadByID = async (ddbClient, payloadID) => {
  let params = {
    TableName: `${QUEUE_PAYLOAD_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    Key: {
      id: payloadID,
    },
    ProjectionExpression: " id,queueName,payload,isRead",
  };
  try {
    let data = await ddbClient.get(params).promise();
    if (data.Item) {
      return data.Item;
    }
    return {};
  } catch (error) {
    logger.error("Error getting Payload by ID", error);
  }
};

/**
 * It updates the payload in dynamo to define that it was processed by the queue.
 * @returns
 */
const updateQueuePayloadToRead = async (ddbClient, payloadID) => {
  let params = {
    TableName: `${QUEUE_PAYLOAD_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    Key: {
      id: payloadID,
    },
    UpdateExpression: "set isRead = :isRead",
    ExpressionAttributeValues: { ":isRead": true },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    let result = await ddbClient.update(params).promise();
    return result;
  } catch (error) {
    logToWinstom("error updating schoolStudent", error);
    return error;
  }
};

// This is used to track the axios responses in a more easier way.
const errorHandler = (error) => {
  const { request, response } = error;
  if (response) {
    const { detail } = response.data;
    const status = response.status;
    return {
      message: detail,
      status,
    };
  } else if (request) {
    return {
      message: "server time out",
      status: 503,
    };
  } else {
    return { message: "Something went wrong while setting up request" };
  }
};

const getSystemParameterByKey = async (key) => {
  try {
    let input = { key };
    const result = await request({
      query: getSystemParameter,
      variables: input,
    });
    const systemParameter = result.data.getSystemParameter;
    return systemParameter;
  } catch (error) {
    logger.error(`error when fetching system param, ${error}`);
    return null;
  }
};

/**
 * This method takes the rearranged pages when dealing with exceptions and it creates the final PDF viewer for each student.
 */
const createFinalPDFsForStudents = async (
  activityID,
  updatedStudentItemsWithPages,
  s3Client
) => {
  const fileUrlsPerStudent = new Map();
  // For each student data...
  for (let index = 0; index < updatedStudentItemsWithPages.length; index++) {
    const studentData = updatedStudentItemsWithPages[index];
    const attributedPages = studentData.attributedPages;
    // get the pdfURLs involved for this student essay after the teacher match exceptions.
    const filesToDownload = attributedPages.map((page) => page.pdfUrl);
    // Download the files from s3, this is done at this point to avoid downloading the same file multiple times as it will download only the unique URLs from the array.
    const pdfContentPerURL = await downloadOriginalPDFFilesFromS3(
      [...new Set(filesToDownload)],
      s3Client
    );
    // It creates the final PDF for this student.
    const finalPDF = await PDFDocument.create();
    for (let index = 0; index < attributedPages.length; index++) {
      // get the page information from the array of pages of the student.
      const page = attributedPages[index];
      // get the pdf content from the map previously created.
      const pdfContent = pdfContentPerURL.get(page.pdfUrl);
      // pdf loaded to get the page that needs to be copied.
      let pdf = await PDFDocument.load(pdfContent);
      // It copies the page from the original file and adds it to the final pdf.
      const [copiedPage] = await finalPDF.copyPages(pdf, [
        page.pdfPageNumber - 1,
      ]);
      finalPDF.addPage(copiedPage);
    }
    const id = uuidv4();
    // Save the PDF object to get the bytes.
    const finalPDFBytes = await finalPDF.save();
    const s3FileKey = `handwriting/${activityID}/${studentData.student.id}/${studentData.student.id}-${id}.pdf`;
    fileUrlsPerStudent.set(studentData.student.id, s3FileKey);
    // upload the final pdf to S3.
    await createFileInBucket(s3Client, `public/${s3FileKey}`, finalPDFBytes);
  }
  return fileUrlsPerStudent;
};

const createFileInBucket = async (s3Client, key, fileContent) => {
  try {
    const input = {
      Bucket: process.env.BUCKET,
      Key: key,
      ContentType: "	text/plain",
      Body: fileContent,
    };
    const command = new PutObjectCommand(input);
    await s3Client.send(command);
  } catch (error) {
    logger.error(`Unable to upload the file into s3. ${error}`);
  }
};

/**
 * This method takes and array of S3 urls and download the files.
 * @returns map with key URL of the file and value the S3 file content.
 */
const downloadOriginalPDFFilesFromS3 = async (fileURLS, s3Client) => {
  const pdfContentPerURL = new Map();
  for (let index = 0; index < fileURLS.length; index++) {
    const url = `public/${fileURLS[index]}`;
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET,
      Key: url,
    });
    // It downloads the original file uploaded by the teacher.
    const response = await s3Client.send(command);

    let pdfString = await response.Body?.transformToString("base64");
    pdfContentPerURL.set(fileURLS[index], pdfString);
  }
  return pdfContentPerURL;
};

/**
 * This method updates the status of all existing log records for the activity but also creates the logs for the new matched exceptions.
 * @param {*} handwritingLog
 * @param {*} ddbClient
 * @param {*} activityID
 * @param {*} updatedStudentItemsWithPages
 * @param {*} fileUrlsPerStudent
 * @returns an array with all the studentHandwritingLogs that were created.
 */
const UpdateAndCreateLogsForActivityAfterMatching = async (
  handwritingLog,
  ddbClient,
  activityID,
  updatedStudentItemsWithPages,
  fileUrlsPerStudent
) => {
  // Updating status of current logs
  // Get existing logs for both tables for the current activity.
  const { handwritingLogs, studentHandwritingLogs } =
    await getCurrentLogsByActivity(ddbClient, activityID);

  // Archiving handwriting logs.
  for (let index = 0; index < handwritingLogs.length; index++) {
    const handwritingLog = handwritingLogs[index];
    await updateLogRecordStatus(
      ddbClient,
      handwritingLog.id,
      HANDWRITINGLOG_TABLE_NAME
    );
  }

  // Archiving all studentHandwritingLogs
  for (let index = 0; index < studentHandwritingLogs.length; index++) {
    const studentHandwritingLog = studentHandwritingLogs[index];
    await updateLogRecordStatus(
      ddbClient,
      studentHandwritingLog.id,
      STUDENTS_HANDWRITINGLOG_TABLE_NAME
    );
  }

  const currentMatchedStudentIDs = updatedStudentItemsWithPages.map(
    (studentData) => studentData?.student.id
  );

  const archivedMatchedStudentIDs = studentHandwritingLogs.map(
    (studentHandwritingLog) => studentHandwritingLog
  );

  // Students that previously had a writting assigned but they don't have it anymore.
  const removedStudents = [];

  for (let index = 0; index < archivedMatchedStudentIDs.length; index++) {
    if (
      !currentMatchedStudentIDs.includes(
        archivedMatchedStudentIDs[index].studentID
      )
    ) {
      removedStudents.push({
        studentID: archivedMatchedStudentIDs[index].studentID,
        essayID: archivedMatchedStudentIDs[index].essayID,
      });
    }
  }

  // Creating new handwritinglog record
  let createdAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
  let updatedAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;

  if (handwritingLog) {
    try {
      const input = {
        createdAt,
        updatedAt,
        __typename: HANDWRITINGLOG_TABLE_NAME,
        ...handwritingLog,
        recordState: "MATCHED",
      };
      input.numberOfStudents = updatedStudentItemsWithPages.length;

      const params = {
        TableName: `${HANDWRITINGLOG_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
        Item: input,
      };
      const result = await ddbClient.put(params).promise();

      const studentHandwritingLogs = [];
      // Creating new studentHandwritingLogs.
      for (
        let index = 0;
        index < updatedStudentItemsWithPages.length;
        index++
      ) {
        const studentData = updatedStudentItemsWithPages[index];
        logger.debug(`studentData object info: ${JSON.stringify(studentData)}`);

        let s3UrlFile = fileUrlsPerStudent.get(studentData.student.id);

        if (!s3UrlFile || s3UrlFile === "") {
          s3UrlFile = studentData.attributedPages[0]?.splitFileS3URL;
        }

        const newEssayText = studentData.attributedPages.reduce(
          (prev, page, index) => {
            return prev + "\n" + (page.extractedText);
          },
          ""
        );

        // get student name from the student record, fall back to whatever textract gave us
        const studentName = studentData.student?.firstName
          ? `${studentData.student.firstName} ${studentData.student?.lastName}`
          : undefined;

        createdAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
        updatedAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
        const studentHandwritingLogInput = {
          id: uuidv4(),
          uploadID: input.id,
          createdAt,
          updatedAt,
          __typename: STUDENTS_HANDWRITINGLOG_TABLE_NAME,
          essayFromTextract: newEssayText,
          studentNameFromTextract: studentName,
          dobFromTextract: studentData.student?.birthDate,
          splitFileS3URL: s3UrlFile,
          completed: true,
          studentID: studentData?.student.id,
          recordState: "MATCHED",
          essayID: studentData.essayID,
        };

        logger.debug(
          `studentHandwritingLog object info: ${JSON.stringify(
            studentHandwritingLogInput
          )}`
        );
        const params = {
          TableName: `${STUDENTS_HANDWRITINGLOG_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
          Item: studentHandwritingLogInput,
        };
        await ddbClient.put(params).promise();
        studentHandwritingLogs.push(studentHandwritingLogInput);
      }
      return {
        studentHandwritingLogs,
        removedStudents,
        archivedMatchedStudentIDs,
      };
    } catch (error) {
      logger.error(
        `error when creating the log record, ${JSON.stringify(error)}`
      );
    }
  }
};

const updateLogRecordStatus = async (ddbClient, id, tableName) => {
  try {
    const params = {
      Key: {
        id,
      },
      TableName: `${tableName}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
      UpdateExpression: "set recordState = :recordState",
      ExpressionAttributeValues: {
        ":recordState": "ARCHIVED",
      },
    };

    const result = await ddbClient.update(params).promise();
    logger.debug("Record updated", result);
  } catch (error) {
    logger.error(`error when updating the log record ${JSON.stringify(error)}`);
  }
};

const getCurrentLogsByActivity = async (ddbClient, activityID) => {
  try {
    const params = {
      TableName: `${HANDWRITINGLOG_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
      IndexName: "byActivity",
      KeyConditionExpression: "activityID = :activityID",
      ExpressionAttributeValues: {
        ":activityID": activityID,
      },
    };
    let handwritingLogs = [];
    let studentHandwritingLogs = [];
    do {
      const queryResult = await ddbClient.query(params).promise();
      handwritingLogs = [...handwritingLogs, ...queryResult.Items];

      params.ExclusiveStartKey = queryResult.LastEvaluatedKey;
    } while (typeof params.ExclusiveStartKey !== "undefined");

    for (let index = 0; index < handwritingLogs.length; index++) {
      const handwritingLog = handwritingLogs[index];
      const data = await getStudentHandwritingLogsByLogParentID(
        handwritingLog.id,
        ddbClient
      );
      studentHandwritingLogs = [...studentHandwritingLogs, ...data];
    }

    return { handwritingLogs, studentHandwritingLogs };
  } catch (error) {
    logger.error(
      `error while fetching the handwriting logs ${JSON.stringify(error)}`
    );
    return null;
  }
};

const getStudentHandwritingLogsByLogParentID = async (
  logParentID,
  ddbClient
) => {
  try {
    const params = {
      TableName: `${STUDENTS_HANDWRITINGLOG_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
      IndexName: "byLogParentID",
      KeyConditionExpression: "uploadID = :uploadID",
      ExpressionAttributeValues: {
        ":uploadID": logParentID,
      },
    };
    let studentHandwritingLogs = [];
    do {
      const queryResult = await ddbClient.query(params).promise();

      studentHandwritingLogs = [
        ...studentHandwritingLogs,
        ...queryResult.Items,
      ];

      params.ExclusiveStartKey = queryResult.LastEvaluatedKey;
    } while (typeof params.ExclusiveStartKey !== "undefined");
    return studentHandwritingLogs;
  } catch (error) {
    logger.error(
      `error while fetching the studentHandwritingLogs logs ${JSON.stringify(
        error
      )}`
    );
    return null;
  }
};

const getToken = async (activity, studentID) => {
  const schoolStudentQueryInput = {
    schoolID: activity.schoolID,
    schoolYearStudentID: {
      eq: {
        schoolYear: new Date().getFullYear(),
        studentID: studentID,
      },
    },
  };
  const schoolStudents = await fetchAllNextTokenData(
    "getStudentBySchool",
    getStudentBySchoolYearAndStudentID,
    schoolStudentQueryInput
  );
  // Get current users for the student.
  const schoolStudentEmail = getCurrentStudentUser(schoolStudents);
  if (schoolStudentEmail && schoolStudentEmail !== "") {
    const token = await getTokenForAuthentication(schoolStudentEmail);
    return token;
  }
  return null;
};

/**
 * This method process all the essays after matching exceptions, update related logs and submits the new values to Faculty.
 * @param {*} ddbClient
 * @param {*} activityID
 * @param {*} schoolID
 * @param {*} promptID
 * @param {*} ENDPOINT
 * @param {*} essays
 */
const submitFinalEssaysAfterMatching = async (
  ddbClient,
  activityID,
  promptID,
  ENDPOINT,
  essays,
  removedStudents,
  archivedMatchedStudentIDs
) => {
  const activity = await getActivity(ddbClient, activityID);
  const prompt = await getPrompt(ddbClient, promptID);

  logger.debug(
    `Essay process started: ${new Date().toLocaleDateString()}-${new Date().toTimeString()}  \n`
  );

  logger.debug(`Total essays received: ${essays.length}`);

  if (essays && essays.length > 0) {
    for (let i = 0; i < essays.length; i++) {
      const essay = essays[i];
      logger.debug("studentHandwritingLogID", essay.id);

      logger.debug(
        `Processing student: ${essay.studentID} , name:${essay.studentNameFromTextract} \n`
      );
      // Validate essay object, first name, last name and DOB are correct plus the text is a proper one.
      const didEssayPassValidations = validateEssay(essay);

      if (
        essay.studentID &&
        didEssayPassValidations &&
        didEssayPassValidations.length === 0
      ) {
        const token = await getToken(activity, essay.studentID);
        if (token) {
          const bearerToken = `Bearer ${token}`;
          let essayId;
          // If the essay was not created before for that student, it's created.
          if (!essay.essayID) {
            essayId = await createEssay(
              activity,
              prompt,
              essay.studentID,
              ENDPOINT,
              bearerToken
            );
          } else {
            essayId = essay.essayID;
          }

          if (essayId) {
            // Calls faculty, submits the essay again and update the log.
            await saveEssayText(
              essayId,
              essay.essayFromTextract,
              ENDPOINT,
              bearerToken
            );
            await submitEssay(essayId, ENDPOINT, bearerToken);
            await updateStudentHandwritingLog(
              ddbClient,
              essay.id,
              "Essay submitted.",
              true,
              essayId
            );
          } else {
            logger.info(
              `It was not created the essay for the student ${essay.studentID}, please contact support. \n`
            );
            await updateStudentHandwritingLog(
              ddbClient,
              essay.id,
              "It was not created the essay for the student, please contact support. \n",
              false
            );
          }
        } else {
          logger.debug(
            `Token retrieved as undefined for student ${essay.studentID}, ${token}`
          );
          // Save observations for the essay that couldn't be matched because there's no active student user.
          await updateStudentHandwritingLog(
            ddbClient,
            essay.id,
            "It was not created the essay for the student, please contact support.",
            false
          );
        }
      }
      logger.debug(`Process finish for student: ${essay.studentID}   \n`);
    }

    for (let i = 0; i < removedStudents?.length; i++) {
      const removedStudent = removedStudents[i];
      if (removedStudent.studentID && removedStudent.essayID) {
        const token = await getToken(activity, removedStudent.studentID);
        if (token) {
          const bearerToken = `Bearer ${token}`;
          await deleteEssay(removedStudent.essayID, ENDPOINT, bearerToken);
        }
      }
    }
  } else {
    logger.info("No essays were found, please contact the support team. \n");
  }
  logger.debug(
    `Essays process is finished: ${new Date().toLocaleDateString()}   \n`
  );
};

// It validates essay mapped to an object after textract process.
const validateEssay = (essay) => {
  let result = [];
  if (!essay) {
    result.push("Essay has not been processed, please contact support.\n");
  }

  if (essay && (!essay.essayFromTextract || essay.essayFromTextract === "")) {
    result.push("The writting was not found in the file.\n");
  }

  if (!essay.studentID || essay.studentID === "") {
    result.push("The studentID was not found in the essay.\n");
  }

  // Validate that the essay has five unique words.
  if (essay?.essayFromTextract) {
    const wordsArray = essay.essayFromTextract.split(" ");
    const uniqueWords = [];
    wordsArray.forEach((word) => {
      if (!uniqueWords.includes(word)) {
        uniqueWords.push(word);
      }
    });

    if (uniqueWords.length < 5) {
      result.push("Essay must have at least 5 different words.");
    }
  }

  // updating log.
  logger.debug(
    `Essay by ${essay.studentID}
     validations: \n ${result.join("\n")}`
  );

  return result;
};

const getActivity = async (ddbClient, activityID) => {
  const params = {
    TableName: `${ACTIVITY_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": activityID,
    },
  };
  try {
    const queryResult = await ddbClient.query(params).promise();

    if (queryResult?.Items && queryResult.Items.length > 0) {
      return queryResult.Items[0];
    } else {
      logger.info("The activity was not found please contact support.  \n");
      return null;
    }
  } catch (error) {
    logger.error(`error while fetching the activity ${JSON.stringify(error)}`);
    return null;
  }
};

const getPrompt = async (ddbClient, promptID) => {
  const params = {
    TableName: `${PROMPT_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": promptID,
    },
  };
  try {
    const queryResult = await ddbClient.query(params).promise();
    if (queryResult?.Items && queryResult.Items.length > 0) {
      return queryResult.Items[0];
    } else {
      logger.info(
        "The prompt related to the activity was not found please contact support.  \n"
      );
      return null;
    }
  } catch (error) {
    logger.error(`error while fetching the prompt ${JSON.stringify(error)}`);
    return null;
  }
};

// This method finds the current user for the current year for each student.
const getCurrentStudentUser = (schoolStudents) => {
  console.log(schoolStudents);
  if (
    schoolStudents &&
    schoolStudents.length > 0 &&
    schoolStudents[0].user &&
    schoolStudents[0].user.items &&
    schoolStudents[0].user.items.length > 0
  ) {
    return schoolStudents[0].user.items[0].email;
  }
  logger.debug("No user record found for this student");
  return null;
};

const fetchAllNextTokenData = async (queryName, query, input) => {
  let nextToken = null;
  let data = [];

  try {
    do {
      input.nextToken = nextToken;

      let searchResults = await request({
        query,
        variables: input,
      });

      data = [...data, ...searchResults.data[queryName].items];

      nextToken = searchResults.data[queryName].nextToken;
    } while (nextToken != null);
  } catch (error) {
    throw error;
  }
  return data;
};

async function getSSMSecrets(secretNames) {
  const credentials = fromNodeProviderChain(); // use the default credential provider chain
  const client = new SSMClient({ credentials });

  const params = {
    Names: secretNames.map((secretName) => process.env[secretName]),
    WithDecryption: true,
  };
  const command = new GetParametersCommand(params);

  const { Parameters } = await client.send(command);
  /*
    Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
    */
  const secrets = secretNames
    .map((secretName) => {
      const secretVal = Parameters.find((secretValObj) => {
        return secretValObj.Name === process.env[secretName];
      });
      return { secretName: secretName, secretVal: secretVal };
    })
    .reduce((prev, curr, i) => {
      return { ...prev, [curr.secretName]: curr.secretVal.Value };
    }, {});
  return secrets;
}

const getTokenForAuthentication = async (email) => {
  const secrets = await getSSMSecrets(["AUTHENTICATION_KEY"]);
  const authenticationKey = secrets?.AUTHENTICATION_KEY;

  const identityProvider = new CognitoIdentityServiceProvider();

  const params = {
    AuthFlow: "CUSTOM_AUTH",
    UserPoolId: process.env.AUTH_BPEDSYSAUTH_USERPOOLID,
    ClientId: process.env.AUTH_BPEDSYSAUTH_APPCLIENTIDWEB,
    AuthParameters: {
      USERNAME: email,
      CHALLENGE_NAME: "CUSTOM_CHALLENGE",
    },
  };

  const result = await identityProvider.adminInitiateAuth(params).promise();
  if (result) {
    const params2 = {
      ChallengeName: result.ChallengeName,
      ClientId: process.env.AUTH_BPEDSYSAUTH_APPCLIENTIDWEB,
      ChallengeResponses: { USERNAME: email, ANSWER: authenticationKey },
      Session: result.Session,
    };

    const tokens = await identityProvider
      .respondToAuthChallenge(params2)
      .promise();

    if (tokens?.AuthenticationResult && tokens.AuthenticationResult.IdToken) {
      return tokens.AuthenticationResult.IdToken;
    } else {
      logger.info(`Unable to get the token for this student ${email} \n`);
      return null;
    }
  }
};

const createEssay = async (
  activity,
  prompt,
  studentID,
  ENDPOINT,
  bearerToken
) => {
  const url = `${ENDPOINT}essay/`;

  const body = {
    activityId: activity?.id,
    classroomId: activity?.classroomID,
    schoolId: activity?.schoolID,
    studentId: studentID,
    taskDetails: {
      taskType: prompt?.taskType?.toUpperCase(),
      essayPrompt: prompt?.promptName,
    },
  };

  try {
    const result = await axios.post(url, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        authorization: bearerToken,
      },
    });

    logger.debug(`essayId returned,${result?.data?.essayId}`);
    return result?.data?.essayId;
  } catch (error) {
    const { message: errorMessage } = errorHandler(error);
    logger.debug(
      `There was an error while trying to create the essay: ${errorMessage}`
    );
  }
};

const updateStudentHandwritingLog = async (
  ddbClient,
  studentHandwritingLogID,
  observations,
  completed,
  essayID
) => {
  logger.debug(`observations, ${observations}`);
  logger.debug(`studentHandwritingLogID, ${studentHandwritingLogID}`);
  try {
    const params = {
      Key: {
        id: studentHandwritingLogID,
      },
      TableName: `${STUDENTS_HANDWRITINGLOG_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
      UpdateExpression: essayID
        ? "set observations = :observations, completed = :completed, essayID =:essayID"
        : "set observations = :observations, completed = :completed",
      ExpressionAttributeValues: essayID
        ? {
            ":observations": observations,
            ":completed": completed,
            ":essayID": essayID,
          }
        : {
            ":observations": observations,
            ":completed": completed,
          },
    };

    const result = await ddbClient.update(params).promise();
    logger.debug("result", result);
  } catch (error) {
    logger.error(
      `error when updating the student handwriting log ${JSON.stringify(error)}`
    );
  }
};

// It deletes the essay for the student.
const deleteEssay = async (essayId, ENDPOINT, bearerToken) => {
  const url = `${ENDPOINT}essay/${essayId}`;
  try {
    const result = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        authorization: bearerToken,
      },
    });
    console.log("result here------------->", result);
    console.log(result?.data);
  } catch (error) {
    console.log(error);
    const { message: errorMessage } = errorHandler(error);
    logger.debug(
      `There was an error while trying to delete the essay: ${errorMessage}`
    );
  }
};

// It save the text of the essay.
const saveEssayText = async (essayId, text, ENDPOINT, bearerToken) => {
  const url = `${ENDPOINT}essay/${essayId}`;

  try {
    const result = await axios.put(url, JSON.stringify({ essayText: text }), {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        authorization: bearerToken,
      },
    });
    logger.debug(`essayId, ${result?.data?.essayId}`);
    console.log(result?.data);
    return result?.data?.essayId;
  } catch (error) {
    const { message: errorMessage } = errorHandler(error);
    logger.debug(
      `There was an error while trying to create the essay: ${errorMessage}`
    );
  }
};

// It submits the student essay after creating and saving the text.
const submitEssay = async (essayId, ENDPOINT, bearerToken) => {
  const url = `${ENDPOINT}essay/submit/${essayId}`;
  try {
    const result = await axios.post(url, JSON.stringify({ essayId }), {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        authorization: bearerToken,
      },
    });
    logger.debug(`essayId, ${result?.data?.essayId}`);
    console.log(result?.data);
    return result?.data?.essayId;
  } catch (error) {
    const { message: errorMessage } = errorHandler(error);
    logger.debug(
      `There was an error while trying to create the essay: ${errorMessage}`
    );
  }
};

module.exports = {
  createFinalPDFsForStudents,
  UpdateAndCreateLogsForActivityAfterMatching,
  submitFinalEssaysAfterMatching,
  getSystemParameterByKey,
  validateEssay,
  getPrompt,
  getCurrentStudentUser,
  fetchAllNextTokenData,
  getTokenForAuthentication,
  createEssay,
  getActivity,
  updateStudentHandwritingLog,
  saveEssayText,
  submitEssay,
  getQueuePayloadByID,
  updateQueuePayloadToRead,
};
