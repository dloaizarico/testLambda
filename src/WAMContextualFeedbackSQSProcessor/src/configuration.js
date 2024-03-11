const { fetchSystemParameter } = require("./api/api");
const { initialiseChatGPT } = require("./api/openai.js");
const { logger } = require("./logger");
const {
  initialise: initialiseCognitoCredentials,
} = require("./lib/getCognitoTokensForCredentials");
const { getSSMSecrets } = require("./lib/getSSMSecrets");

/**
 * private utility function fetches required config params from the system (or env vars if not found in system)
 * @returns {Promise<{emtServiceUrl: string, openAIAPIKey: string, openAIPromptText: string}>}
 */
const getSystemAndEnvParams = async function () {
  const cognitoUsername = process.env.COGNITO_USERNAME;

  const cognitoUserPoolId = process.env.AUTH_BPEDSYSAUTH_USERPOOLID;

  const cognitoAppClientId = process.env.AUTH_BPEDSYSAUTH_APPCLIENTIDWEB;

  const secrets = await getSSMSecrets(["LAMBDA_FACULTY_COGNITO_USER_PASSWORD"]);
  const lambdaFacultyCognitoUserPassword =
    secrets?.LAMBDA_FACULTY_COGNITO_USER_PASSWORD;

  // initialise the cognito tokens for the credentials
  await initialiseCognitoCredentials(
    cognitoUsername,
    lambdaFacultyCognitoUserPassword,
    cognitoUserPoolId,
    cognitoAppClientId
  );
  const emtServiceUrl =
    (await fetchSystemParameter("REACT_APP_EMT_API_BASE_URL")) ||
    process.env.EMT_API_BASE_URL; // get the faculty API URL

  const openAIAPIKey =
    (await fetchSystemParameter("OPEN_AI_API_KEY")) ||
    process.env.OPENAI_API_KEY;

  const openAIPromptText =
    (await fetchSystemParameter("OPEN_AI_PROMPT")) ||
    process.env.OPENAI_PROMPT_TEXT;

  const openAIBaseURL =
    (await fetchSystemParameter("OPEN_AI_BASE_URL")) ||
    process.env.OPEN_AI_BASE_URL;

  const openAIModel =
    (await fetchSystemParameter("OPEN_AI_CONTEXTUAL_FEEDBACK_MODEL")) || process.env.OPEN_AI_MODEL;

  return {
    emtServiceUrl,
    openAIAPIKey,
    openAIPromptText,
    openAIBaseURL,
    openAIModel,
    lambdaFacultyCognitoUserPassword,
    cognitoUsername,
    cognitoUserPoolId,
    cognitoAppClientId,
  };
}

// get config parameters from env or from GraphQL API
const getConfig = async function () {
  const {
    emtServiceUrl,
    openAIAPIKey,
    openAIPromptText,
    openAIBaseURL,
    openAIModel,
    lambdaFacultyCognitoUserPassword,
    cognitoUsername,
    cognitoUserPoolId,
    cognitoAppClientId,
  } = await getSystemAndEnvParams();
  // configure OpenAI with API key
  initialiseChatGPT({
    openAIAPIKey,
    openAIPromptText,
    openAIBaseURL,
    openAIModel,
  });

  return {
    isConfigured: true,
    emtServiceUrl,
    openAIAPIKey,
    openAIPromptText,
    openAIBaseURL,
    openAIModel,
    lambdaFacultyCognitoUserPassword,
    cognitoUsername,
    cognitoUserPoolId,
    cognitoAppClientId,
  };
}

// throw an error if any of the required config params are missing
const checkConfigAndThrow = (configParams) => {
  const {
    emtServiceUrl,
    openAIAPIKey,
    openAIPromptText,
    openAIBaseURL,
    openAIModel,
    lambdaFacultyCognitoUserPassword,
    cognitoUsername,
    cognitoUserPoolId,
    cognitoAppClientId,
  } = configParams;

  if (
    !emtServiceUrl ||
    !openAIAPIKey ||
    !openAIPromptText ||
    !openAIBaseURL ||
    !openAIModel ||
    !lambdaFacultyCognitoUserPassword ||
    !cognitoUsername ||
    !cognitoUserPoolId ||
    !cognitoAppClientId
  ) {
    logger.error(
      "Missing config parameters; check that the cognito session is valid",
      {
        emtServiceUrl,
        openAIAPIKey,
        openAIPromptText,
        openAIBaseURL,
        openAIModel,
        lambdaFacultyCognitoUserPassword,
        cognitoUsername,
        cognitoUserPoolId,
        cognitoAppClientId,
      }
    );
    throw new Error(
      "Missing config parameters; check that the cognito session is valid"
    );
  }
};

module.exports = {
  getConfig,
  getSystemAndEnvParams,
  checkConfigAndThrow,
};
