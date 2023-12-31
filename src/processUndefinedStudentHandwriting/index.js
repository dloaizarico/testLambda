const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const event = require("./event.json")
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { logger } = require("./logger");
const { getSystemParameterByKey, processEssays } = require("./api");

const handler = async (event) => {
  try {
    logger.debug(`EVENT: ${JSON.stringify(event)}`);
    const inputData = JSON.parse(event.body);

    const ddbClient = new AWS.DynamoDB.DocumentClient();

    const systemParam = await getSystemParameterByKey(
      "REACT_APP_EMT_API_BASE_URL"
    );
    const ENDPOINT = systemParam?.paramData;

    await processEssays(
      ddbClient,
      inputData.uploadID,
      inputData.activityID,
      inputData.promptID,
      ENDPOINT
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(
        "The process has been finished, please check your essays in a while."
      ),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(
        "The process did not complete successfully, please contact support."
      ),
    };
  }
};

handler(event);