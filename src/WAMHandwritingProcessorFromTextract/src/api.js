const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { logger } = require("./logger");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const { validateEssay } = require("./validations");
const {
  getStudentByNameByBirthDate,
  getSystemParameter,
  getStudentBySchoolYearAndStudentID,
  getUserByUserId,
  getStudentsInAClassroom,
} = require("./graphql/bpqueries");
const {
  errorHandler,
  getTokenForAuthentication,
  getCurrentStudentUser,
  createEssayObjects,
  getTextFromPagesProcessed,
} = require("./utils");
const { request } = require("./appSyncRequest");
const { createNotification } = require("./graphql/bpmutations");
const ACTIVITY_TABLE_NAME = "Activity";
const PROMPT_TABLE_NAME = "Prompt";

const {
  sysType,
  read,
  sender,
  expiryDaysForNotification,
  notificationMessage,
  fuzzyMatchingLambdaName,
  matchStudentByNameUsingIndexesMethod,
  matchStudentByNameWithStrictEqualityMethod,
} = require("./constants");

/**
 * It takes the previous mapped essays from textract and process them by sending all the data into the different methods of Faculty's api.
 * @param essays: array with all the mapped essays
 * @param activity
 * @param prompt
 * @param ENDPOINT: faculty's API endpoint fetched as a param.
 * @param activityClassroomStudents list of students that are part of the classroom in which the activity was created, this is used for name matching.
 */
const processEssays = async (
  essays,
  activity,
  prompt,
  ENDPOINT,
  activityClassroomStudents,
  lambdaService
) => {
  const studentsHandWritingLog = [];
  logger.debug(
    `Essay process started: ${new Date().toLocaleDateString()}-${new Date().toTimeString()}  \n`
  );
  const studentsPageMapping = new Map();

  logger.debug(`Total essays received: ${essays.length}`);
  if (essays && essays.length > 0) {
    for (let i = 0; i < essays.length; i++) {
      const essay = essays[i];
      const studentHandWritingLog = {
        essayFromTextract: essay.text,
        studentNameFromTextract: `${essay.firstName} ${essay.lastName}`,
        dobFromTextract: essay.DOB,
        firstName: essay.firstName,
        lastName: essay.lastName,
        DOB: essay.DOB,
      };
      logger.debug(
        `Processing student: ${essay.firstName}, ${essay.lastName}, - DOB ${essay.DOB}   \n`
      );

      if (essay.unidentified) {
        studentsPageMapping.set(essay.key, essay.pages);

        studentHandWritingLog.studentID = essay.key;

        studentHandWritingLog.completed = false;
      } else {
        // Validate essay object, first name, last name and DOB are correct plus the text is a proper one.
        let didEssayPassValidations = validateEssay(essay);
        let studentID = await getStudentByNameLastNameAndDOB(
          essay.firstName,
          essay.lastName,
          essay.DOB
        );

        // if the studentID was not found through firstName, lastName, birthDate, it's used the fuzzy lambda to try to match the student input with the current classroom.
        if (!studentID || studentID === "") {
          studentID = await fuzzyMatchingToStudents(
            {
              firstName: essay.firstName,
              lastName: essay.lastName,
              birthDate: essay.DOB,
            },
            activityClassroomStudents,
            lambdaService
          );
        }

        if (studentID && didEssayPassValidations) {
          studentHandWritingLog.studentID = studentID;
          const schoolStudentQueryInput = {
            schoolID: activity?.schoolID,
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
          const schoolStudentEmail = getCurrentStudentUser(schoolStudents);
          if (schoolStudentEmail && schoolStudentEmail !== "") {
            const token = await getTokenForAuthentication(schoolStudentEmail);
            if (token) {
              const bearerToken = `Bearer ${token}`;
              studentsPageMapping.set(studentID, essay.pages);
              const essayId = await createEssay(
                activity,
                prompt,
                studentID,
                ENDPOINT,
                bearerToken
              );
              if (essayId) {
                await saveEssayText(essayId, essay.text, ENDPOINT, bearerToken);
                await submitEssay(essayId, ENDPOINT, bearerToken);
                studentHandWritingLog.completed = true;
              } else {
                studentHandWritingLog.studentID = essay.key;
                studentsPageMapping.set(essay.key, essay.pages);
                logger.info(
                  `It was not created the essay for the student ${essay.firstName}, ${essay.lastName}, -DOB ${essay.DOB}, please contact support. \n`
                );
                studentHandWritingLog.completed = false;
              }
            } else {
              studentsPageMapping.set(essay.key, essay.pages);
              studentHandWritingLog.studentID = essay.key;
              logger.info(
                `It was not created the essay for the student ${essay.firstName}, ${essay.lastName}, -DOB ${essay.DOB}, please contact support. \n`
              );
              logger.debug(
                `Token retrieved as undefined.${essay.firstName}, ${essay.lastName}, -DOB ${essay.DOB}, ${token}`
              );
              studentHandWritingLog.completed = false;
            }
          } else {
            logger.info(
              `The student ${essay.firstName}, ${essay.lastName}, -DOB ${essay.DOB} does not have an active user in the school, please contact support to get a valid login. \n`
            );
            logger.debug(
              `username for student ${essay.firstName}, ${essay.lastName}, -DOB ${essay.DOB} is null`
            );
            studentHandWritingLog.studentID = essay.key;
            studentsPageMapping.set(essay.key, essay.pages);

            studentHandWritingLog.completed = false;
          }
        } else {
          studentHandWritingLog.studentID = essay.key;
          studentsPageMapping.set(essay.key, essay.pages);

          logger.info(
            `Student ${essay.firstName}, ${essay.lastName}, -DOB ${essay.DOB}  was not found in the database, please check first name, last name and DOB in the original file \n`
          );
          logger.info(
            `----------------------------------------------------------------- \n`
          );
          studentHandWritingLog.completed = false;
        }
        logger.debug(
          `Process finish for student: ${essay.firstName}, ${essay.lastName}, -DOB ${essay.DOB}   \n`
        );
        logger.info(
          "----------------------------------------------------------------- \n"
        );
      }
      studentsHandWritingLog.push(studentHandWritingLog);
    }
  } else {
    logger.info("No essays were found, please contact the support team. \n");
  }
  logger.debug(
    `Essays process is finished: ${new Date().toLocaleDateString()}   \n`
  );
  return {
    studentsPageMapping,
    studentsHandWritingLog,
  };
};

// It calls faculty's api to create the student essay.
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
    return result?.data?.essayId;
  } catch (error) {
    const { message: errorMessage } = errorHandler(error);
    logger.debug(
      `There was an error while trying to create the essay: ${errorMessage}`
    );
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

const fuzzyMatchingToStudents = async (
  student,
  matchingList,
  lambdaService
) => {
  try {
    let input = {
      method: matchStudentByNameUsingIndexesMethod,
      student: student,
      matchingList: matchingList,
    };
    let params = {
      FunctionName: `${fuzzyMatchingLambdaName}-${process.env.ENV}`,
      Payload: JSON.stringify({
        input,
      }),
    };

    // trying fuzzy matching with indexes method first.
    let result = await lambdaService.invoke(params).promise();
    let payload = JSON.parse(result.Payload);
    let data = JSON.parse(payload.body);
    if (data?.foundStudentsArray && data.foundStudentsArray.length === 1) {
      return data.foundStudentsArray[0].studentID;
    }

    // trying fuzzy matching with strict equality method
    input = {
      method: matchStudentByNameWithStrictEqualityMethod,
      student: student,
      matchingList: matchingList,
    };

    params = {
      FunctionName: `${fuzzyMatchingLambdaName}-${process.env.ENV}`,
      Payload: JSON.stringify({
        input,
      }),
    };

    result = await lambdaService.invoke(params).promise();
    payload = JSON.parse(result.Payload);
    data = JSON.parse(payload.body);

    if (data?.possibleMatches && data.possibleMatches.length === 1) {
      const possibleMatch = data.possibleMatches[0];
      logger.debug(
        `strict equality found: ${possibleMatch.birthDateSimiliratyratio}`
      );
      return possibleMatch.student.studentID;
    }

    logger.debug("Fuzzy matching didn't return any results.");
    return null;
  } catch (error) {
    logger.error(
      `Error when trying to find the fuzzy matching name ${JSON.stringify(
        error
      )} - ${error}`
    );
  }
};

const getStudentByNameLastNameAndDOB = async (firstName, lastName, DOB) => {
  let input = {
    lastNameBirthDate: { eq: { birthDate: DOB, lastName } },
    firstName,
  };
  try {
    const result = await fetchAllNextTokenData(
      "getStudentByNameByBirthDate",
      getStudentByNameByBirthDate,
      input
    );

    if (result && result.length === 1) {
      return result[0].id;
    }
    return null;
  } catch (error) {
    logger.debug(
      `Error when trying to find the student by name, last name and DOB ${JSON.stringify(
        error
      )}, ${error}`
    );
    return null;
  }
};

const getStudentsInAClassroomAPI = async (classroomID) => {
  let input = {
    classroomID,
  };
  try {
    const result = await fetchAllNextTokenData(
      "getStudentsByClassroom",
      getStudentsInAClassroom,
      input
    );

    if (result && result.length > 0) {
      return result
        .filter((classroomStudent) => classroomStudent.student)
        .map((classroomStudent) => {
          return {
            classroomStudentID: classroomStudent.id,
            firstName: classroomStudent.student.firstName,
            lastName: classroomStudent.student.lastName,
            middleName: classroomStudent.student.middleName,
            gender: classroomStudent.student.gender,
            studentID: classroomStudent.student.id,
            studentUniqueIdentifier:
              classroomStudent.student.studentUniqueIdentifier,
            yearLevelID: classroomStudent.student.yearLevelID,
            birthDate: classroomStudent.student.birthDate,
          };
        });
    } else {
      return [];
    }
  } catch (error) {
    logger.debug(
      `Error when trying to find the students in the classroom ${JSON.stringify(
        error
      )}`
    );
    return null;
  }
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

      if (searchResults?.data && searchResults.data[queryName]) {
        data = [...data, ...searchResults.data[queryName].items];
      }

      nextToken = searchResults.data[queryName].nextToken;
    } while (nextToken != null);
  } catch (error) {
    throw error;
  }
  return data;
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
    logger.info("The activity was not found please contact support.  \n");
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
    logger.info(
      "The prompt related to the activity was not found please contact support.  \n"
    );
    logger.error(`error while fetching the prompt ${JSON.stringify(error)}`);
    return null;
  }
};

// This method process the textract result for the JOB received in the handler and that was sent by the topic.
const processTextactResult = async (textractClient, jobId) => {
  let nextToken = null;
  const maxResults = 100;
  const pagesContentMap = new Map();
  let pages = 0;
  // Getting all the info for the job by iterating through nextToken.
  do {
    const result = await textractClient
      .getDocumentTextDetection({
        JobId: jobId,
        MaxResults: maxResults,
        NextToken: nextToken,
      })
      .promise();
    if (result?.Blocks) {
      result.Blocks.forEach((block) => {
        // processing only lines.
        if (block.BlockType === "LINE") {
          // getting the page and grouping lines by page inside a map.
          let pageContent = pagesContentMap.get(block.Page);
          pageContent = pageContent
            ? [...pageContent, block.Text]
            : [block.Text];
          pagesContentMap.set(block.Page, pageContent);
        }
      });
    }
    if (result?.DocumentMetadata) {
      pages =
        pages + result.DocumentMetadata.Pages
          ? result.DocumentMetadata.Pages
          : 0;
    }
    nextToken = result.NextToken;
  } while (nextToken);

  // iterating through the map to get the final essays.
  // eslint-disable-next-line no-unused-vars
  const { textractEssays, pagesContentMapWithProperText } =
    createEssayObjects(pagesContentMap);
  const numberOfPagesDetected = pages;
  return {
    processedPages: textractEssays,
    numberOfPagesDetected,
    pagesContentMapWithProperText,
  };
};

const createUserNotification = async (userId) => {
  try {
    // Getting the email of the user.
    const userInput = {
      userId,
    };
    const result = await fetchAllNextTokenData(
      "getUserByUserId",
      getUserByUserId,
      userInput
    );
    let email;
    if (result.length > 0) {
      email = result[0].email;
    }

    const expiryTime = Math.floor(
      new Date().setDate(new Date().getDate() + expiryDaysForNotification) /
        1000
    );
    // Creating the notification for the user.
    const input = {
      sysType,
      read,
      readDate: "",
      type: "Handwriting uploader",
      message: notificationMessage,
      recipient: email,
      sender,
      expiryTime,
    };

    await request({
      query: createNotification,
      variables: { input },
    });
  } catch (error) {
    logger.error(
      `error when creating the notification record, ${JSON.stringify(error)}`
    );
  }
};

const createLogRecord = async (
  ddb,
  logObject,
  generalLogFileKey,
  studentsHandWritingLog,
  pagesContentMapWithProperText,
  studentsPageMapping,
  studentsFileMap,
  originalFileURL,
  wasLogUploaded
) => {
  let createdAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
  let updatedAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
  const uploadID = uuidv4();
  const HANDWRITINGLOG_TABLE_NAME = "HandwritingLog";
  const STUDENTS_HANDWRITINGLOG_TABLE_NAME = "StudentHandwritingLog";
  if (logObject) {
    try {
      const input = {
        id: uploadID,
        createdAt,
        updatedAt,
        __typename: HANDWRITINGLOG_TABLE_NAME,
        activityID: logObject.activityID,
        uploadUserID: logObject.uploadUserID,
        schoolID: logObject.schoolID,
        numberOfStudents: logObject.numberOfStudents,
        fileUrl: wasLogUploaded ? generalLogFileKey : "",
        uploadedFileName: logObject.uploadedFileName,
      };
      const params = {
        TableName: `${HANDWRITINGLOG_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
        Item: input,
      };
      await ddb.put(params).promise();

      for (let index = 0; index < studentsHandWritingLog.length; index++) {
        const studentHandwritingLog = studentsHandWritingLog[index];

        logger.debug(
          `studentHandwritingLog object info: ${JSON.stringify(
            studentHandwritingLog
          )}`
        );
        logger.debug(
          `studentHandwritingLog object info: ${studentHandwritingLog.studentID}`
        );

        const key = studentHandwritingLog.studentID;

        let pagesContentMap;
        if (studentHandwritingLog.completed) {
          
          const pagesFound = studentsPageMapping.get(key);
          pagesContentMap = getTextFromPagesProcessed(
            pagesContentMapWithProperText,
            pagesFound
          );
        }

        logger.debug(`key: ${key}`);
        let splitFileURL = studentsFileMap?.get(key);
        if (splitFileURL) {
          splitFileURL = splitFileURL.replace("public/", "");
        } else {
          splitFileURL = originalFileURL.replace("public/", "");
        }
        createdAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
        updatedAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
        const studentHandwritingLogInput = {
          id: uuidv4(),
          uploadID: uploadID,
          createdAt,
          updatedAt,
          __typename: STUDENTS_HANDWRITINGLOG_TABLE_NAME,
          essayFromTextract: studentHandwritingLog.essayFromTextract,
          studentNameFromTextract:
            studentHandwritingLog.studentNameFromTextract,
          dobFromTextract: studentHandwritingLog.dobFromTextract,
          splitFileS3URL: splitFileURL,
          completed: studentHandwritingLog.completed,
        };

        if (pagesContentMap) {
          studentHandwritingLogInput.pagesContentMap = JSON.stringify(pagesContentMap);
        }

        if (studentHandwritingLog.studentID) {
          studentHandwritingLogInput.studentID =
            studentHandwritingLog.studentID;
        }

        logger.debug(
          `studentHandwritingLog object info: ${JSON.stringify(
            studentHandwritingLogInput
          )}`
        );
        const params = {
          TableName: `${STUDENTS_HANDWRITINGLOG_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
          Item: studentHandwritingLogInput,
        };
        await ddb.put(params).promise();
      }
    } catch (error) {
      logger.error(
        `error when creating the log record, ${JSON.stringify(error)}`
      );
    }
  }
};
module.exports = {
  getStudentByNameLastNameAndDOB,
  getPrompt,
  getActivity,
  fetchAllNextTokenData,
  processEssays,
  getSystemParameterByKey,
  processTextactResult,
  createLogRecord,
  createUserNotification,
  getStudentsInAClassroomAPI,
};
