/* Amplify Params - DO NOT EDIT
	API_BPEDSYSGQL_GRAPHQLAPIENDPOINTOUTPUT
	API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT
	AUTH_BPEDSYSAUTH_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["LAMBDA_FACULTY_COGNITO_USER_PASSWORD"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/

const { setupEMTEndPoint } = require("./api/emtService.js");
const { getConfig, checkConfigAndThrow } = require("./configuration.js");
const { logger, getLoggerEndPromise } = require("./logger");
const {
  processSubmittedEssayRecord,
} = require("./processEssaySubmittedRecord");

let isConfigured = false;
let configParams = {};
const event = require("./event.json");
// ================ handler ================
/**
 * @type {import('@types/aws-lambda').Handler} Handler
 */

const handler = async (event) => {
  // ===== check for required config params =====
  // if we haven't already configured the lambda, do it now
  if (!isConfigured) {
    configParams = await getConfig();
    isConfigured = configParams.isConfigured; // skipcq: JS-0040 // this is not modified anywhere else
  }
  // check for required config params
  checkConfigAndThrow(configParams);

  let { emtServiceUrl } = configParams; // "let" because we may override it below
  // if we're in local dev mode, override the EMT API URL (otherwise it tries to use a VPC endpoint which is inaccessible from local dev)
  if (process.env.DEV_OVERRIDE_EMT_API_URL) {
    emtServiceUrl = process.env.DEV_OVERRIDE_EMT_API_URL;
    logger.debug("Overriding EMT API URL with: ", { emtServiceUrl });
  }

  // setup the URL to call the faculty EMT API
  await setupEMTEndPoint(emtServiceUrl);

  // ====== process the SQS event ======
  const batchItemFailures = [];
  for (const record of event.Records) {
    // event.Records.forEach((record) => {
    const { body, messageId } = record;
    try {
      await processSubmittedEssayRecord(body);
    } catch (err) {
      logger.error(err);
      batchItemFailures.push({
        itemIdentifier: messageId,
      });
    }
  }
  logger.info("Finished processing SQS event", {
    returning: batchItemFailures,
  });
  // wait for all log messages to be written
  await getLoggerEndPromise();
  return { batchItemFailures }; // return the failed items so that SQS can requeue them
};

handler(event);