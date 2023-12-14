const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const ACCODE_MAPPING_TABLE_NAME =
  "AcCodeMapping-xuuhgbt2kzebrpxdv67rr5pmze-develop";

const getAcCodeMappings = async (docClient) => {
  const command = new ScanCommand({
    TableName: ACCODE_MAPPING_TABLE_NAME,
  });

  let response = null;
  let result = [];
  do {
    response = await docClient.send(command);

    result = [...result, ...response.Items];
    command.ExclusiveStartKey = response.LastEvaluatedKey;
  } while (typeof response.LastEvaluatedKey !== "undefined");

  const unmarshalledData = result.map((item) => unmarshall(item));
  const mappingCodesMap = new Map();
  for (let index = 0; index < unmarshalledData.length; index++) {
    const mapping = unmarshalledData[index];
    let mappings = mappingCodesMap.get(mapping.acCodeID);
    if (!mappings) {
      mappings = [];
    }
    mappings = [
      ...mappings,
      {
        code: mapping.code,
        codeMappingType: mapping.codeMappingType,
        urlPrefix: mapping.urlPrefix,
      },
    ];
    mappingCodesMap.set(mapping.acCodeID, mappings);
  }
  return mappingCodesMap;
};

module.exports = {
  getAcCodeMappings,
};
