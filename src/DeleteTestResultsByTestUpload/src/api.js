const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const { logger } = require("./logger");
const { OPERATIONS, ANSWER_CODES, TABLE_NAMES } = require("./utils");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const {
  QueryCommand,
  BatchWriteItemCommand,
} = require("@aws-sdk/client-dynamodb");

const executeQuery = async (command, client) => {
  try {
    const commandToSend = new QueryCommand(command);
    let response = null;
    let result = [];
    do {
      response = await client.send(commandToSend);

      result = [...result, ...response.Items];
      command.ExclusiveStartKey = response.LastEvaluatedKey;
    } while (typeof response.LastEvaluatedKey !== "undefined");

    return result.map((item) => unmarshall(item));
  } catch (error) {
    logger.error(`There was an error while executing the query ${error}`);
  }
};

const processInBatchDynamo = async (items, TABLE_NAME, operation, client) => {
  let leftItems = items.length;
  let group = [];
  let groupNumber = 0;

  logger.info(`Total items to be ${operation}: ${leftItems} - ${TABLE_NAME}`);

  try {
    for (const item of items) {
      const req = {
        [operation === OPERATIONS.DELETE ? "DeleteRequest" : "PutRequest"]: {
          [operation === OPERATIONS.DELETE ? "Key" : "Item"]: marshall(item),
        },
      };

      group.push(req);
      leftItems--;

      if (group.length === 25 || leftItems < 1) {
        groupNumber++;

        logger.info(`Batch ${groupNumber} to be ${operation}.`);

        const params = {
          RequestItems: {
            [TABLE_NAME === TABLE_NAMES.AUDIT
              ? TABLE_NAME
              : `${TABLE_NAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`]:
              group,
          },
        };

        const command = new BatchWriteItemCommand(params);

        await client.send(command);

        logger.info(
          `Batch ${groupNumber} processed. Left items: ${leftItems} `
        );

        // reset
        group = [];
      }
    }

    return {
      statusCode: ANSWER_CODES.SUCCESS_OPERATIONS,
      body: JSON.stringify("Items were processed succesfully"),
    };
  } catch (error) {
    logger.error(`error while processing in batch ${JSON.stringify(error)}`);
    return {
      statusCode: ANSWER_CODES.INTERNAL_SERVER_ERROR,
      body: JSON.stringify("Internal error while processing items."),
    };
  }
};

module.exports = {
  processInBatchDynamo,
  executeQuery,
};
