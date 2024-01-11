const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { SSMClient, GetParametersCommand } = require("@aws-sdk/client-ssm");
const { fromNodeProviderChain } = require("@aws-sdk/credential-providers");
const { CognitoIdentityServiceProvider } = require("aws-sdk");
const { logger } = require("./logger");
const axios = require("axios");
const {
  getStudentBySchoolYearAndStudentID,
  getSystemParameter,
} = require("./graphql/bpqueries");
const { request } = require("./appSyncRequest");
const ACTIVITY_TABLE_NAME = "Activity";
const PROMPT_TABLE_NAME = "Prompt";
const STUDENT_HANDWRITING_LOG = "StudentHandwritingLog";

/**
 * It takes the previous mapped essays from textract and process them by sending all the data into the different methods of Faculty's api.
 * @param essays: array with all the mapped essays
 * @param activity
 * @param prompt
 * @param ENDPOINT: faculty's API endpoint fetched as a param.
 */
const processEssays = async (
  ddbClient,
  uploadID,
  activityID,
  promptID,
  ENDPOINT
) => {
  const prompt = await getPrompt(ddbClient, promptID);

  const activity = await getActivity(ddbClient, activityID);

  let essays = await getStudentsHandwritingLog(ddbClient, uploadID);
  essays =
    essays && essays.length > 0
      ? essays.filter((essay) => essay.studentID)
      : [];

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
          schoolID: activity?.schoolID,
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
        const schoolStudentEmail = getCurrentStudentUser(schoolStudents);
        if (schoolStudentEmail && schoolStudentEmail !== "") {
          const token = await getTokenForAuthentication(schoolStudentEmail);
          if (token) {
            const bearerToken = `Bearer ${token}`;
            const essayId = await createEssay(
              activity,
              prompt,
              essay.studentID,
              ENDPOINT,
              bearerToken
            );
            if (essayId) {
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
                "Essay created.",
                true
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
        } else {
          logger.debug(`username for student ${essay.studentID} is null`);

          // Save observations for the essay that couldn't be matched because there's no active student user.
          await updateStudentHandwritingLog(
            ddbClient,
            essay.id,
            "The student does not have an active user in the school, please contact support to get a valid login.",
            false
          );
        }
      } else {
        // Save observations for the essay that couldn't be sent to Faculty for processing because of validation issues.
        await updateStudentHandwritingLog(
          ddbClient,
          essay.id,
          didEssayPassValidations.join("\n"),
          false
        );
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

// This method finds the current user for the current year for each student.
const getCurrentStudentUser = (schoolStudents) => {
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

const getStudentsHandwritingLog = async (ddbClient, uploadID) => {
  const params = {
    TableName: `${STUDENT_HANDWRITING_LOG}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    IndexName: "byLogParentID",
    KeyConditionExpression: "uploadID = :uploadID",
    FilterExpression: "completed = :completedValue",
    ExpressionAttributeValues: {
      ":uploadID": uploadID,
      ":completedValue": false,
    },
  };
  try {
    const queryResult = await ddbClient.query(params).promise();
    if (queryResult?.Items && queryResult.Items.length > 0) {
      return queryResult.Items;
    } else {
      logger.info(
        "There are not studentHandwriting Logs available for the uploadID\n"
      );
      return null;
    }
  } catch (error) {
    logger.error(
      `error while fetching the student handwriting logs ${JSON.stringify(
        error
      )}`
    );
    return null;
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
      TableName: `${STUDENT_HANDWRITING_LOG}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
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

module.exports = {
  processEssays,
  getSystemParameterByKey,
  validateEssay,
  getPrompt,
  getCurrentStudentUser,
  fetchAllNextTokenData,
  getTokenForAuthentication,
  createEssay,
  getActivity,
  updateStudentHandwritingLog,
};
