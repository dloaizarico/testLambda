const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const { logger } = require("./logger");
const HANDWRITING_LOGS_TABLENAME = "HandwritingLog";

const getActivityHandwritingLogs = async (ddbClient, activityID) => {
  const params = {
    TableName: `${HANDWRITING_LOGS_TABLENAME}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    IndexName: "byActivity",
    KeyConditionExpression: "activityID = :activityID",
    ExpressionAttributeValues: {
      ":activityID": activityID,
    },
  };
  try {
    const queryResult = await ddbClient.query(params).promise();
    if ( queryResult?.Items && queryResult.Items.length > 0) {
      return queryResult.Items;
    } else {
      logger.debug(
        "There are not handwriting Logs available for the activityID\n"
      );
      return null;
    }
  } catch (error) {
    logger.error(
      `error while fetching the  handwriting Logs ${JSON.stringify(error)}`
    );
    return null;
  }
};

module.exports = {
  getActivityHandwritingLogs,
};
