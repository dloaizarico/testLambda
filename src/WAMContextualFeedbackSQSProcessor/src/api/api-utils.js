const { request } = require("./appSyncRequest");
const { logger } = require("../logger");
const {
  getCognitoTokensWithRefresh,
} = require("../lib/getCognitoTokensForCredentials");

/**
 * common config for axios calls to faculty API
 */
//TODO: we need a better way of authenticating to faculty API e.g. using an API key skipcq
const facultyAxiosCommonConfig = {
  maxBodyLength: Infinity,
  headers: {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
  },
};

// get the common config for axios calls to faculty API
const getFacultyAxiosCommonConfig = async () => {
  const cognitoTokens = await getCognitoTokensWithRefresh();
  if (cognitoTokens?.idToken) {
    facultyAxiosCommonConfig.headers.authorization = `Bearer ${cognitoTokens.idToken}`;
  }
  return facultyAxiosCommonConfig;
};

/**
 * Fetches all data from a query that uses the nextToken pattern
 * @param {string} queryName - the name of the query
 * @param {string} query - the query
 * @param {object} input - the input to the query
 * @returns {object[]} - the list of data
 * @throws {Error} - if there is an error
 */
const fetchAllNextTokenData = async (queryName, query, input) => {
  // console.log("fetchAllNextTokenData", queryName, query, input);
  let nextToken = null;
  let data = [];

  try {
    do {
      input.nextToken = nextToken;

      const searchResults = await request({
        query,
        variables: input,
      });
      if (searchResults?.errors?.length) {
        throw new Error(searchResults.errors[0].message);
      }
      // console.log("searchResults", searchResults);
      if (searchResults.body?.data[queryName]) {
        data = [...data, ...searchResults.body?.data[queryName]?.items];
        nextToken = searchResults.body?.data[queryName].nextToken;
      }
    } while (nextToken);
  } catch (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

/**
 * capitalizes the first letter of each word in a string
 * @param {string} s
 * @returns {string} - the converted string
 */
const convertToPascalCase = (s) => {
  if (!s) return s;

  return s.replace(/\w+/g, (w) => {
    return w[0].toUpperCase() + w.slice(1).toLowerCase();
  });
};

/**
 * Converts a string to have the first letter capitalized and the rest lower case
 * @param {string} s - the string to convert
 * @returns {string} - the converted string
 */
const convertRubricKey = (s) => {
  if (!s) return s;

  return s.replace(/^(.)(.*)$/g, (match, p1, p2) => {
    return (p1.toUpperCase() + p2.toLowerCase()).trim();
  });
};

module.exports = {
  getFacultyAxiosCommonConfig,
  fetchAllNextTokenData,
  convertToPascalCase,
  convertRubricKey,
};
