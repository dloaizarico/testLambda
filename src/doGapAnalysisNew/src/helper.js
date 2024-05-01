const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const ACCODE_MAPPING_TABLE_NAME = `AcCodeMapping-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`;

/**
 * This method loads into a map the whole accode mapping table, it first scan the complete table and then it returns
 * a map key: acCodeID and value all the mapping codes related to that ACCode.
 * It was implemented this way to avoid triggering multiple queries per AcCode.
 * @param {*} docClient
 * @returns
 */
const getAcCodeMappings = async (docClient) => {
  let params;

  params = {
    TableName: ACCODE_MAPPING_TABLE_NAME,
  };

  const data = [];
  let items;
  do {
    items = await docClient.scan(params).promise();
    items.Items.forEach((item) => data.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== "undefined");

  const mappingCodesMap = new Map();
  for (let index = 0; index < data.length; index++) {
    const mapping = data[index];
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
