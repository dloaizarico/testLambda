// Elastik GraphQL API
const { fetchAllNextTokenData } = require("./api-utils");
const { request } = require("./appSyncRequest");
const {
  getSystemParameter,
  getContextualFeedbackByEssayID,
  getActivityPrompt,
  getRubricByTaskTypeGQL,
} = require("../graphql/bpqueries");
const {
  createContextualFeedbackStudentEssay,
} = require("../graphql/bpmutations");
const { logger } = require("../logger");

// get the activity prompt for the given activityID
const getActivityPromptByActivityID = async (activityID) => {
  const input = {
    id: activityID,
  };

  const response = await request({
    query: getActivityPrompt,
    variables: input,
  });
  if (response?.errors?.length) {
    throw new Error(response.errors[0].message);
  }

  return response?.body?.data?.getActivity?.prompt ?? null;
};

// get any existing contextual feedback for the given essayID
const getFeedbackByEssayID = async (essayID) => {
  const contextualFeedbackResponse = await fetchAllNextTokenData(
    "getContextualFeedbackByEssayID",
    getContextualFeedbackByEssayID,
    {
      essayID,
      limit: 1000,
    }
  );
  return contextualFeedbackResponse;
};

// get the rubric for the given taskType
const getRubricByTaskType = async (taskType) => {
  const rubricByTaskTypeResponse = await fetchAllNextTokenData(
    "getRubricByTaskType",
    getRubricByTaskTypeGQL,
    { taskType, limit: 500 }
  );
  return rubricByTaskTypeResponse;
};

// fetch the system parameter for the given key
const fetchSystemParameter = async (key) => {
  const input = {
    key,
  };

  const response = await request({
    query: getSystemParameter,
    variables: input,
  });
  if (response?.errors?.length) {
    throw new Error(response.errors[0].message);
  }
  logger.debug(`response: ${JSON.stringify(response)}`);
  return response?.body?.data.getSystemParameter
    ? response.body.data.getSystemParameter.paramData
    : null;
};

// add a new contextual feedback for the given essayID
const insertContextualFeedbackStudentEssay = async (
  chatGptResponse,
  essayMarks
) => {
  if (!chatGptResponse) return false;

  const data = Object.keys(chatGptResponse).map((k) => {
    return {
      contextualFeedback: chatGptResponse[k],
      rubricCategory: k,
    };
  });

  const info = JSON.stringify({
    data,
  });

  const input = {
    activityID: essayMarks.activityId,
    contextualInfo: info,
    essayID: essayMarks.essayId,
    studentID: essayMarks.studentId,
  };

  const requestCallResult = await request({
    query: createContextualFeedbackStudentEssay,
    variables: { input },
  });
  if (requestCallResult?.errors?.length) {
    throw new Error(requestCallResult.errors[0].message);
  }
  return requestCallResult;
};

// =====

module.exports = {
  fetchSystemParameter,
  getActivityPromptByActivityID,
  getFeedbackByEssayID,
  getRubricByTaskType,
  insertContextualFeedbackStudentEssay,
};
