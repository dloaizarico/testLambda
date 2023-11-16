const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const { handlerV1 } = require("./V1");
const { handlerV2 } = require("./V2");
const { validateEvent } = require("./validations");
const event = require('./event.json');

const V2 = "V2";
const V1 = "V1";

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  logger.debug(`EVENT: ${JSON.stringify(event)}`);

  const jobsToProcess = validateEvent(event);

  if (jobsToProcess && jobsToProcess.length > 0) {
    for (let index = 0; index < jobsToProcess.length; index++) {
      if (jobsToProcess[index].processorVersion === V1) {
        await handlerV1(event, jobsToProcess[index]);
      } else if (jobsToProcess[index].processorVersion === V2) {
        await handlerV2(event, jobsToProcess[index]);
      } else {
        logger.error(
          `Verison of the lambda not supported ${jobsToProcess[index].processorVersion}`
        );
      }
    }
  }

  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    statusCode: 200,
    body: JSON.stringify("Process is finsihed!"),
  };
};
