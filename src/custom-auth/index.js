const AWS = require("aws-sdk");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

AWS.config.update({
  region: "ap-southeast-2",
  credentials: new AWS.SharedIniFileCredentials({ profile: "default" }),
});

const { fromNodeProviderChain } = require("@aws-sdk/credential-providers");
const { SSMClient, GetParametersCommand } = require("@aws-sdk/client-ssm");

const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  try {
    const identityProvider = new AWS.CognitoIdentityServiceProvider();

    const secretNames = ["AUTHENTICATION_KEY"];

    const credentials = fromNodeProviderChain(); // use the default credential provider chain
    const client = new SSMClient({ credentials });

    const secretP = {
      Names: secretNames.map((secretName) => process.env[secretName]),
      WithDecryption: true,
    };
    const command = new GetParametersCommand(secretP);

    const { Parameters } = await client.send(command);

    console.log(Parameters);
    /*
    Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
    */
    const secrets = secretNames
      .map((secretName) => {
        const secretVal = Parameters.find((secretValObj) => {
          return secretValObj.Name === process.env[secretName];
        });
        return { secretName: secretName, secretVal: secretVal };
      })
      .reduce((prev, curr, i) => {
        return { ...prev, [curr.secretName]: curr.secretVal.Value };
      }, {});

    const key = secrets?.AUTHENTICATION_KEY;

    console.log(key);
    
    const params = {
      AuthFlow: "CUSTOM_AUTH",
      UserPoolId: "ap-southeast-2_zX8wczoks",
      ClientId: "6gpsk6286776ha8576ths1b7p",
      AuthParameters: {
        USERNAME: "diego.loaiza",
        CHALLENGE_NAME: "CUSTOM_CHALLENGE",
      },
    };

    const result = await identityProvider.adminInitiateAuth(params).promise();
    console.log(result);
    if (result) {
      const params2 = {
        ChallengeName: result.ChallengeName,
        ClientId: "6gpsk6286776ha8576ths1b7p",
        ChallengeResponses: { USERNAME: "diego.loaiza", ANSWER: key },
        Session: result.Session,
      };

      const result2 = await identityProvider
        .respondToAuthChallenge(params2)
        .promise();
      console.log(result2);
      // if (result.data && result.data.AuthenticationResult) {
      //   const authenticationResult = result.data.AuthenticationResult;
      // }
    }

    return {
      statusCode: 200,
      //  Uncomment below to enable CORS requests
      //  headers: {
      //      "Access-Control-Allow-Origin": "*",
      //      "Access-Control-Allow-Headers": "*"
      //  },
      body: JSON.stringify("Hello from Lambda!"),
    };
  } catch (error) {
    console.log(error);
  }
};

handler({});
