const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
// amplify/backend/function/appsyncOperations/opt/appSyncRequest.js
const https = require("https");

const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const region = process.env.REGION;
const appsyncUrl = process.env.API_BPEDSYSGQL_GRAPHQLAPIENDPOINTOUTPUT;

/**
 *
 * @param {Object} queryDetails the query, operationName, and variables
 * @param {String} appsyncUrl url of your AppSync API
 * @param {String} apiKey the api key to include in headers. if null, will sign with SigV4
 */
exports.request = (queryDetails) => {
  const req = new AWS.HttpRequest(appsyncUrl, region);
  const endpoint = new urlParse(appsyncUrl).hostname.toString();

  req.method = "POST";
  req.path = "/graphql";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify(queryDetails);

  const signer = new AWS.Signers.V4(req, "appsync", true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  return new Promise((resolve, reject) => {
    let body = [];

    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      result.on("data", (data) => {
        body.push(data);
      });
      result.on("end", () => {
        body = Buffer.concat(body).toString();
        resolve(JSON.parse(body.toString()));
      });
      result.on("error", (error) => {
        reject(error);
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });
};
