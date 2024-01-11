const path = require("path");
const dayjs = require("dayjs");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { logger } = require("../logger");
const { getStudentBySchoolYearAndStudentID } = require("../graphql/bpqueries");
const HANDWRITINGLOG_TABLE_NAME = "HandwritingLog";
const STUDENTS_HANDWRITINGLOG_TABLE_NAME = "StudentHandwritingLog";
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const PDFDocument = require("pdf-lib").PDFDocument;
const {
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
} = require("../api");

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
    const pdfContentPerURL = await downloadOriginalPDFFilesFromS3([
      ...new Set(filesToDownload),
    ], s3Client);
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
    await createFileInBucket(s3Client, s3FileKey, finalPDFBytes);
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
      input.numberOfStudents = updatedStudentItemsWithPages.length

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

        if(!s3UrlFile || s3UrlFile===""){
          s3UrlFile = studentData.attributedPages[0]?.pdfUrl
        }

        const newEssayText = studentData.attributedPages.reduce(
          (prev, page, index) => {
            return prev + page.extractedText;
          },
          "\n"
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
      return studentHandwritingLogs;
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
        handwritingLog.id, ddbClient
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

const getStudentHandwritingLogsByLogParentID = async (logParentID, ddbClient) => {
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
  essays
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

      logger.debug(`Processing student: ${essay.studentID} \n`);
      // Validate essay object, first name, last name and DOB are correct plus the text is a proper one.
      const didEssayPassValidations = validateEssay(essay);

      if (
        essay.studentID &&
        didEssayPassValidations &&
        didEssayPassValidations.length === 0
      ) {
        const schoolStudentQueryInput = {
          schoolID: activity.schoolID,
          schoolYearStudentID: {
            eq: {
              schoolYear: new Date().getFullYear(),
              studentID: essay.studentID,
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
      }
      logger.debug(`Process finish for student: ${essay.studentID}   \n`);
    }
  } else {
    logger.info("No essays were found, please contact the support team. \n");
  }
  logger.debug(
    `Essays process is finished: ${new Date().toLocaleDateString()}   \n`
  );
};

module.exports = {
  createFinalPDFsForStudents,
  UpdateAndCreateLogsForActivityAfterMatching,
  submitFinalEssaysAfterMatching,
};
