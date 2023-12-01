const { TABLE_NAMES } = require("./utils");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const getTestResultsCommand = (testUploadID) => {
  return {
    TableName: `${TABLE_NAMES.TEST_RESULT}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    IndexName: "byTestUpload",
    ExpressionAttributeValues: {
      ":testUploadID": { S: testUploadID },
    },
    KeyConditionExpression: "testUploadID = :testUploadID",
  };
};

const getTestResultsAnswersCommand = (testResultID) => {
  return {
    TableName: `${TABLE_NAMES.TEST_RESULT_ANSWERS}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    IndexName: "byTestResult",
    ExpressionAttributeValues: {
      ":testResultID": { S: testResultID },
    },
    KeyConditionExpression: "testResultID = :testResultID",
  };
};

const getTestResultsLearningAreaCommand = (testResultID) => {
  return {
    TableName: `${TABLE_NAMES.TEST_RESULT_LEARNING_AREA}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    IndexName: "byTestResult",
    ExpressionAttributeValues: {
      ":testResultID": { S: testResultID },
    },
    KeyConditionExpression: "testResultID = :testResultID",
  };
};

module.exports = {
  getTestResultsAnswersCommand,
  getTestResultsLearningAreaCommand,
  getTestResultsCommand,
};
