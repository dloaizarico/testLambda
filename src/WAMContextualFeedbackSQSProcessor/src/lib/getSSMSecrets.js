const { SSMClient, GetParametersCommand } = require("@aws-sdk/client-ssm");

const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const credentials = defaultProvider(); // use the default credential provider chain
const client = new SSMClient({credentials});

/**
 * Retrieve secrets (API Keys etc) from AWS Systems Manager Parameter Store
 * @param {[String]} secretNames - an array of parameter names to retrieve from Systems Manager
 * @returns {Object} - an object in the format: { secretName: secretValue, ... }
 */

async function getSSMSecrets(secretNames) {

  const params = {
    Names: secretNames.map((secretName) => process.env[secretName]),
    WithDecryption: true,
  };
  const command = new GetParametersCommand(params);

  const { Parameters } = await client.send(command);
  /*
  Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
  */
  const secrets = secretNames
    .map((secretName) => {
      const secretVal = Parameters.find((secretValObj) => {
        return secretValObj.Name === process.env[secretName];
      });
      return { secretName, secretVal };
    })
    .reduce((prev, curr) => {
      return { ...prev, [curr.secretName]: curr.secretVal.Value };
    }, {});
  return secrets;
}
exports.getSSMSecrets = getSSMSecrets;
