const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const { validateEssay } = require("./validations");
const {
  getStudentByNameByBirthDate,
  getSystemParameter,
  getStudentBySchoolYearAndStudentID,
  getUserByUserId,
} = require("./graphql/bpqueries");
const {
  updateMemoryLog,
  errorHandler,
  createEssayObject,
  getTokenForAuthentication,
  getCurrentStudentUser,
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
} = require("./constants");

/**
 * It takes the previous mapped essays from textract and process them by sending all the data into the different methods of Faculty's api.
 * @param essays: array with all the mapped essays
 * @param activity
 * @param prompt
 * @param ENDPOINT: faculty's API endpoint fetched as a param.
 * @param logRepo: repo with all the logs of the process.
 */
const processEssays = async (essays, activity, prompt, ENDPOINT, logRepo) => {
  console.log(
    `Essay process started: ${new Date().toLocaleDateString()}-${new Date().toTimeString()}  \n`
  );
  const studentsPageMapping = [];
  console.log(`Total essays received: ${essays.length}`);
  if (essays && essays.length > 0) {
    for (let i = 0; i < essays.length; i++) {
      const essay = essays[i];
      console.log(
        `Processing student: ${essay.firstName}, ${essay.lastName}, - DOB ${essay.DOB}   \n`
      );
      // Validate essay object, first name, last name and DOB are correct plus the text is a proper one.
      let didEssayPassValidations = validateEssay(essay, logRepo);
      const student = await getStudentByNameLastNameAndDOB(
        essay.firstName,
        essay.lastName,
        essay.DOB
      );
      if (student && student.id && didEssayPassValidations) {
        const schoolStudentQueryInput = {
          schoolID: activity?.schoolID,
          schoolYearStudentID: {
            eq: { schoolYear: new Date().getFullYear(), studentID: student.id },
          },
        };
        const schoolStudents = await fetchAllNextTokenData(
          "getStudentBySchool",
          getStudentBySchoolYearAndStudentID,
          schoolStudentQueryInput
        );
        const schoolStudentEmail = getCurrentStudentUser(
          schoolStudents,
          logRepo
        );
        const token = await getTokenForAuthentication(
          schoolStudentEmail,
          logRepo
        );
        if (token) {
          const bearerToken = `Bearer ${token}`;
          console.log("the token is", bearerToken);
          studentsPageMapping.push([student.id, essay.essayPageNumber]);
          console.log("Creating student essay.");
          const essayId = await createEssay(
            activity,
            prompt,
            student,
            ENDPOINT,
            bearerToken
          );
          if (essayId) {
            console.log("Saving student's writing");
            await saveEssayText(essayId, essay.text, ENDPOINT, bearerToken);
            console.log("Submitting student's essay");
            await submitEssay(essayId, ENDPOINT, bearerToken);
          } else {
            updateMemoryLog(
              `It was not created the essay for the student ${essay.firstName}, ${essay.lastName}, -DOB ${essay.DOB}, please contact support. \n`,
              logRepo,
              true
            );
          }
        }
      } else {
        updateMemoryLog(
          `Student ${essay.firstName}, ${essay.lastName}, -DOB ${essay.DOB}  was not found in the database, please check first name, last name and DOB in the original file \n`,
          logRepo,
          true
        );
        updateMemoryLog(
          `----------------------------------------------------------------- \n`,
          logRepo,
          true
        );
      }

      console.log(
        `Process finish for student: ${essay.firstName}, ${essay.lastName}, -DOB ${essay.DOB}   \n`
      );
    }
  } else {
    updateMemoryLog(
      `No essays were found, please contact the support team. \n`,
      logRepo,
      true
    );
  }
  console.log(
    `Essays process is finished: ${new Date().toLocaleDateString()}   \n`
  );
  return studentsPageMapping;
};

// It calls faculty's api to create the student essay.
const createEssay = async (
  activity,
  prompt,
  student,
  ENDPOINT,
  bearerToken
) => {
  const url = `${ENDPOINT}essay/`;

  const body = {
    activityId: activity?.id,
    classroomId: activity?.classroomID,
    schoolId: activity?.schoolID,
    studentId: student?.id,
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

    console.log("essayId returned", result?.data?.essayId);
    return result?.data?.essayId;
  } catch (error) {
    const { message: errorMessage } = errorHandler(error);
    console.log(
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
    console.log("essayId", result?.data?.essayId);
    return result?.data?.essayId;
  } catch (error) {
    const { message: errorMessage } = errorHandler(error);
    console.log(
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
    console.log("essayId", result?.data?.essayId);
    return result?.data?.essayId;
  } catch (error) {
    const { message: errorMessage } = errorHandler(error);
    console.log(
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
    console.log("sysparam result", result);
    const systemParameter = result.data.getSystemParameter;
    return systemParameter;
  } catch (error) {
    console.log("error when fetching system param", error);
    return null;
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

    if (result.length === 1) {
      return result[0];
    }
  } catch (error) {
    console.log(
      `Error when trying to find the student by name, last name and DOB ${JSON.stringify(
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

      data = [...data, ...searchResults.data[queryName].items];

      nextToken = searchResults.data[queryName].nextToken;
    } while (nextToken != null);
  } catch (error) {
    throw error;
  }
  return data;
};

const getActivity = async (ddbClient, activityID, logRepo) => {
  const params = {
    TableName: `${ACTIVITY_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    KeyConditionExpression: `id = :id`,
    ExpressionAttributeValues: {
      ":id": activityID,
    },
  };
  try {
    const queryResult = await ddbClient.query(params).promise();

    if (queryResult && queryResult.Items && queryResult.Items.length > 0) {
      return queryResult.Items[0];
    } else {
      updateMemoryLog(
        `The activity was not found please contact support.  \n`,
        logRepo,
        true
      );
      return null;
    }
  } catch (error) {
    updateMemoryLog(
      `The activity was not found please contact support.  \n`,
      logRepo,
      true
    );
    console.error(`error while fetching the activity ${JSON.stringify(error)}`);
    return null;
  }
};

const getPrompt = async (ddbClient, promptID, logRepo) => {
  const params = {
    TableName: `${PROMPT_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    KeyConditionExpression: `id = :id`,
    ExpressionAttributeValues: {
      ":id": promptID,
    },
  };
  try {
    const queryResult = await ddbClient.query(params).promise();

    if (queryResult && queryResult.Items && queryResult.Items.length > 0) {
      return queryResult.Items[0];
    } else {
      updateMemoryLog(
        `The prompt related to the activity was not found please contact support.  \n`,
        logRepo,
        true
      );
      return null;
    }
  } catch (error) {
    updateMemoryLog(
      `The prompt related to the activity was not found please contact support.  \n`,
      logRepo,
      true
    );
    console.error(`error while fetching the prompt ${JSON.stringify(error)}`);
    return null;
  }
};

// This method process the textract result for the JOB received in the handler and that was sent by the topic.
const processTextactResult = async (textractClient, jobId) => {
  let nextToken = null;
  const maxResults = 100;
  const pagesContentMap = new Map();
  // Getting all the info for the job by iterating through nextToken.
  do {
    const result = await textractClient
      .getDocumentTextDetection({
        JobId: jobId,
        MaxResults: maxResults,
        NextToken: nextToken,
      })
      .promise();
    if (result.Blocks) {
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
    nextToken = result.NextToken;
  } while (nextToken);
  const essays = [];
  // iterating through the map to get the final essays.
  // eslint-disable-next-line no-unused-vars
  for (let [page, essayInLines] of pagesContentMap) {
    // mapping textract lines to essay objects.
    const essayObject = createEssayObject(essayInLines, page);
    essays.push(essayObject);
  }
  return essays;
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
    console.error(
      `error when creating the notification record, ${JSON.stringify(error)}`
    );
  }
};

const createLogRecord = async (ddb, logObject, keyWithoutPublicPrefix) => {
  let createdAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
  let updatedAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
  const HANDWRITINGLOG_TABLE_NAME = "HandwritingLog";
  if (logObject) {
    try {
      const input = {
        id: uuidv4(),
        createdAt,
        updatedAt,
        __typename: HANDWRITINGLOG_TABLE_NAME,
        activityID: logObject.activityID,
        uploadUserID: logObject.uploadUserID,
        schoolID: logObject.schoolID,
        numberOfStudents: logObject.numberOfStudents,
        fileUrl: keyWithoutPublicPrefix,
        studentsPageMapping: JSON.stringify(logObject.studentsPageMapping),
      };
      const params = {
        TableName: `${HANDWRITINGLOG_TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
        Item: input,
      };
      await ddb.put(params).promise();
    } catch (error) {
      console.error(
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
};
