const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const {
  getTestResultsCommand,
  getTestResultsAnswersCommand,
  getTestResultsLearningAreaCommand,
} = require("./commands");
const { logger } = require("./logger");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const {
  getTimeStamp,
  generateExpirationTime,
  TABLE_NAMES,
  OPERATIONS,
  ANSWER_CODES,
} = require("./utils");
const { processInBatchDynamo, executeQuery } = require("./api");

const removeResultsByTestUploadID = async (testUploadID, client) => {
  try {
    if (testUploadID && testUploadID !== "") {
      // Get first testResults for that testUploadID
      const testResults = await executeQuery(
        getTestResultsCommand(testUploadID),
        client
      );

      const testResultsIds = testResults.map((testResult) => {
        return { id: testResult.id };
      });
      // For all the test Results get the testResultAnswers and the testResultLearningAreas

      let testResultLearningAreas = [];
      let testResultAnswers = [];
      let testResultAnswersGA = [];

      for (let index = 0; index < testResultsIds.length; index++) {
        const testResult = testResultsIds[index];
        const tras = await executeQuery(
          getTestResultsAnswersCommand(testResult.id),
          client
        );
        const trlas = await executeQuery(
          getTestResultsLearningAreaCommand(testResult.id),
          client
        );

        testResultLearningAreas = [
          ...testResultLearningAreas,
          ...trlas.map((trla) => {
            return {
              id: trla.id,
            };
          }),
        ];
        testResultAnswers = [
          ...testResultAnswers,
          ...tras.map((tra) => {
            return {
              id: tra.id,
            };
          }),
        ];
      }

      // TestResultAnswersGA is a copy of the normal testResultAnswers, so it needs an identical array for deletion.
      testResultAnswersGA = testResultAnswers.map((tra) => {
        return {
          testResultAnswerID: tra.id,
        };
      });

      // Audit elements before deleting.
      await autidElementsBeforeDeleting(
        testResultAnswers,
        TABLE_NAMES.TEST_RESULT_ANSWERS,
        "deleteTestResultAnswers",
        client
      );
      await autidElementsBeforeDeleting(
        testResultAnswersGA,
        TABLE_NAMES.TEST_RESULT_ANSWERSGA,
        "deleteTestResultAnswersGA",
        client
      );
      await autidElementsBeforeDeleting(
        testResultLearningAreas,
        TABLE_NAMES.TEST_RESULT_LEARNING_AREA,
        "deleteTestResultLearningAreas",
        client
      );
      await autidElementsBeforeDeleting(
        testResultsIds,
        TABLE_NAMES.TEST_RESULT,
        "deleteTestResult",
        client
      );

      // deleting data by testUploadID

      const traResponse = await processInBatchDynamo(
        testResultAnswers,
        TABLE_NAMES.TEST_RESULT_ANSWERS,
        OPERATIONS.DELETE,
        client
      );
      const traGAResponse = await processInBatchDynamo(
        testResultAnswersGA,
        TABLE_NAMES.TEST_RESULT_ANSWERSGA,
        OPERATIONS.DELETE,
        client
      );
      const trlResponse = await processInBatchDynamo(
        testResultLearningAreas,
        TABLE_NAMES.TEST_RESULT_LEARNING_AREA,
        OPERATIONS.DELETE,
        client
      );
      const testResultResponse = await processInBatchDynamo(
        testResultsIds,
        TABLE_NAMES.TEST_RESULT,
        OPERATIONS.DELETE,
        client
      );

      if (
        traResponse.statusCode === ANSWER_CODES.SUCCESS_OPERATIONS &&
        traGAResponse.statusCode === ANSWER_CODES.SUCCESS_OPERATIONS &&
        trlResponse.statusCode === ANSWER_CODES.SUCCESS_OPERATIONS &&
        testResultResponse.statusCode === ANSWER_CODES.SUCCESS_OPERATIONS
      ) {
        return {
          statusCode: ANSWER_CODES.SUCCESS_OPERATIONS,
          body: JSON.stringify("Items were processed succesfully"),
        };
      }
    } else {
      logger.error(
        `${testUploadID} is not valid. Therefore, it's not possible to continue`
      );
      return {
        statusCode: ANSWER_CODES.INTERNAL_SERVER_ERROR,
        body: JSON.stringify(
          `TestUploadID is not valid. Therefore, it's not possible to continue`
        ),
      };
    }
  } catch (error) {
    return {
      statusCode: ANSWER_CODES.INTERNAL_SERVER_ERROR,
      body: JSON.stringify(
        `Error ocurred while deleting data for the testUpload ${JSON.stringify(
          error
        )}`
      ),
    };
  }
};

const autidElementsBeforeDeleting = async (
  items,
  tableName,
  functionName,
  client
) => {
  try {
    const elements = [];
    for (let index = 0; index < items.length; index++) {
      const element = items[index];

      const id =
        tableName === TABLE_NAMES.TEST_RESULT_ANSWERSGA
          ? element.testResultAnswerID
          : element.id;
      elements.push({
        id: uuidv4(),
        createdAt: `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
        description: `Item deleted from table ${tableName} with ID: ${id}`,
        envSuffix: `${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
        expirationTime: generateExpirationTime(),
        file: "deleteByTestUploadID",
        function: functionName,
        itemId: id,
        itemTypeName: tableName,
        __typename: "UploaderAudit",
      });
    }

    return await processInBatchDynamo(
      elements,
      TABLE_NAMES.AUDIT,
      OPERATIONS.CREATE,
      client
    );
  } catch (error) {
    logger.error(`Error when mapping the audit elements ${error}`);
  }
};

module.exports = { removeResultsByTestUploadID, autidElementsBeforeDeleting };
