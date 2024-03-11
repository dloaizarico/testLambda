// This file is used to make requests to the AppSync API
const { Sha256 } = require("@aws-crypto/sha256-js");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { default: fetch, Request } = require("node-fetch");
const {
  getCognitoTokensPromise,
} = require("../lib/getCognitoTokensForCredentials");
const { logger } = require("../logger");

const GRAPHQL_ENDPOINT = process.env.API_BPEDSYSGQL_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION =
  process.env.REGION ?? process.env.AWS_REGION ?? "ap-southeast-2";

/**
 * makes a request to the AppSync API
 * @param {Object} queryDetails the query, operationName, and variables
 * @param {String} appsyncUrl url of your AppSync API
 * @param {String} apiKey the api key to include in headers. if null, will sign with SigV4
 */
exports.request = async (queryDetails) => {
  let statusCode = 200;
  let body;
  let response;

  try {
    const endpoint = new URL(GRAPHQL_ENDPOINT);

    const requestToBeSigned = new HttpRequest({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        host: endpoint.host,
      },
      hostname: endpoint.host,
      body: JSON.stringify(queryDetails),
      path: endpoint.pathname,
    });

    let possiblySignedRequest = requestToBeSigned; // default to unsigned request

    // cognito user pool auth for appsync (update the ./test/.env.development.sh file with valid credentials)
    if (process.env.USE_COGNITO_FOR_APPSYNC_AUTH) {
      const cognitoTokens = await getCognitoTokensPromise();
      if (cognitoTokens?.idToken) {
        possiblySignedRequest.headers.authorization = cognitoTokens.idToken;
      }
    } else {
      // sign with SigV4 and use IAM auth
      const signer = new SignatureV4({
        credentials: defaultProvider(),
        region: AWS_REGION,
        service: "appsync",
        sha256: Sha256,
      });

      possiblySignedRequest = await signer.sign(requestToBeSigned);
    }
    const fetchRequest = new Request(GRAPHQL_ENDPOINT, possiblySignedRequest);

    response = await fetch(fetchRequest);
    body = await response.json();
    if (body.errors) statusCode = 400;
  } catch (error) {
    logger.error(error);
    statusCode = 500;
    body = {
      errors: [
        {
          message: error.message,
        },
      ],
    };
  }

  return {
    statusCode,
    body,
  };
};
