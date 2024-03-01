const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { logger } = require("./logger");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});

// It fetches all the schoolNames and domains from the school table.
const getSchoolsData = async () => {
  try {
    const command = new ScanCommand({
      ProjectionExpression: "id, schoolName, domainName",
      TableName: `School-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
    });

    const response = await client.send(command);
    return response?.Items.map(item=>unmarshall(item));
  } catch (error) {
    logger.error(
      `There was an error while executing the school scan query ${error}`
    );
    return [];
  }
};

/**
 * This lambda returns to the client the list of domain suggestions as per the school table.
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handler = async (event) => {
  logger.debug(`EVENT: ${JSON.stringify(event)}`);

  // Getting data from schools.
  const schools = await getSchoolsData();
  logger.debug(`schoolsData : ${schools}`);
  

  // If the school has the domain field it will take it. Otherwise, it will take the schoolName.
  const schoolsDomains = schools?.map((schoolData) => {
    let domain =
      schoolData?.domainName && schoolData?.domainName !== ""
        ? schoolData.domainName
        : schoolData?.schoolName;
    domain = domain.split(" ").join("").toLowerCase();
    return domain
  });

  console.log(schoolsDomains);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(schoolsDomains),
  };
};

handler({});
