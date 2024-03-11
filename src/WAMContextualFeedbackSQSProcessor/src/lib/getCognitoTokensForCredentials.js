require("cross-fetch/polyfill");

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const EventEmitter = require("events");
const { logger } = require("../logger");

let cognitoTokens = null;
const _cognitoTokensLoadedEventEmitter = new EventEmitter(); // will emit a "loaded" event when the cognito tokens have been loaded
const COGNITO_TOKENS_LOADED_EVENT = "loaded";
const COGNITO_TOKENS_LOAD_TIMEOUT = 10000; // 10 seconds
const COGNITO_TOKENS_LOAD_ERROR_EVENT = "error";
const COGNITO_TOKENS_LOAD_TIMEOUT_EVENT = "timeout";

/**
 * singleton function to return a promise that resolves to the cognito tokens, so auth details are shared by modules that require this module
 * @returns {{idToken: string, accessToken: string, refreshToken: string}} - Cognito tokens
 */
const getCognitoTokensPromise = () => {
  if (cognitoTokens) {
    return Promise.resolve(cognitoTokens);
  }
  // if the cognito tokens haven't been loaded yet, wait for them to be loaded
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      _cognitoTokensLoadedEventEmitter.emit(COGNITO_TOKENS_LOAD_TIMEOUT_EVENT); // notify any listeners that our cognito tokens loading timed out
    }, COGNITO_TOKENS_LOAD_TIMEOUT);

    _cognitoTokensLoadedEventEmitter.once(
      COGNITO_TOKENS_LOAD_TIMEOUT_EVENT,
      () => {
        clearTimeout(timeout);
        reject(new Error("cognito auth timed out"));
      }
    ); // clear the timeout if we get an error

    _cognitoTokensLoadedEventEmitter.once(COGNITO_TOKENS_LOADED_EVENT, () => {
      clearTimeout(timeout);
      resolve(cognitoTokens);
    });
    _cognitoTokensLoadedEventEmitter.once(
      COGNITO_TOKENS_LOAD_ERROR_EVENT,
      () => {
        clearTimeout(timeout);
        reject(new Error("Error loading cognito tokens"));
      }
    );
  });
};

/**
 * Gets Cognito tokens for a user
 * @param {string} username - Cognito username
 * @param {string} password - Cognito password
 * @param {string} userPoolId - Cognito user pool ID
 * @param {string} clientId - Cognito client ID
 * @returns {{idToken: string, accessToken: string, refreshToken: string}} - Cognito tokens
 * @example
 * const { idToken, accessToken, refreshToken } =
 *  await getCognitoTokensForCredentials(
 *    "mike@bestperformance.com.au",
 *    "Password",
 *    "ap-southeast-2_bjwWhJw4s",
 *    "65k24rpr15ii43qllc58riargu"
 *   );
 */
const getCognitoTokensForCredentials = (
  username,
  password,
  userPoolId,
  clientId
) => {
  const authenticationData = {
    Username: username,
    Password: password,
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );
  const poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId,
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const userData = {
    Username: username,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      _cognitoTokensLoadedEventEmitter.emit(COGNITO_TOKENS_LOAD_TIMEOUT_EVENT); // notify any listeners that our cognito tokens loading timed out
    }, COGNITO_TOKENS_LOAD_TIMEOUT);

    _cognitoTokensLoadedEventEmitter.once(
      COGNITO_TOKENS_LOAD_TIMEOUT_EVENT,
      () => {
        clearTimeout(timeout);
        reject(new Error("cognito auth timed out"));
      }
    ); // clear the timeout if we get an error
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess(result) {
        clearTimeout(timeout);
        //var accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        const accessToken = result.getAccessToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        resolve({ idToken, accessToken, refreshToken, cognitoUser });
      },

      onFailure(err) {
        clearTimeout(timeout);
        logger.error("rejecting with error", err);
        reject(err);
      },
    });
  });
};

// initialise the cognito tokens for the credentials if they haven't already been initialised
const initialise = async (
  cognitoUsername,
  cognitoPassword,
  cognitoUserPoolId,
  cognitoClientId
) => {
  if (!cognitoTokens) {
    try {
      // timeout if it takes too long
      const timeout = setTimeout(() => {
        _cognitoTokensLoadedEventEmitter.emit(
          COGNITO_TOKENS_LOAD_TIMEOUT_EVENT
        ); // notify any listeners that our cognito tokens loading timed out
      }, COGNITO_TOKENS_LOAD_TIMEOUT);

      // get cognito tokens
      cognitoTokens = await getCognitoTokensForCredentials(
        // skipcq: JS-0040 // this is not modified anywhere else
        cognitoUsername,
        cognitoPassword,
        cognitoUserPoolId,
        cognitoClientId
      );
      clearTimeout(timeout);
      _cognitoTokensLoadedEventEmitter.emit(COGNITO_TOKENS_LOADED_EVENT); // notify any listeners that our cognito tokens are loaded
    } catch (err) {
      logger.error("error getting cognito tokens", err);
      _cognitoTokensLoadedEventEmitter.emit(COGNITO_TOKENS_LOAD_ERROR_EVENT); // notify any listeners that our cognito tokens are loaded
      throw err;
    }
  }
  return cognitoTokens;
};

/**
 * Gets Cognito tokens with a refresh if the tokens have expired
 * @returns {{idToken: string, accessToken: string, refreshToken: string}} - Cognito tokens
 */
const getCognitoTokensWithRefresh = (
  cognitoUsername,
  cognitoPassword,
  cognitoUserPoolId,
  cognitoClientId
) => {
  if (cognitoTokens?.cognitoUser) {
    return new Promise((resolve, reject) => {
      cognitoTokens.cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
        } else {
          cognitoTokens.idToken = session.getIdToken().getJwtToken();
          cognitoTokens.accessToken = session.getAccessToken().getJwtToken();
          cognitoTokens.refreshToken = session.getRefreshToken().getToken();
          resolve(cognitoTokens);
        }
      });
    });
  } else {
    // initialise returns a promise
    return initialise(
      cognitoUsername,
      cognitoPassword,
      cognitoUserPoolId,
      cognitoClientId
    );
  }
};

module.exports = {
  getCognitoTokensForCredentials,
  getCognitoTokensPromise,
  getCognitoTokensWithRefresh,
  initialise,
};
