const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const { request } = require("./appSyncRequest");
const { deleteClassroomStudent } = require("./graphql/bpmutations");
const { WAM_STUDENT_LICENCE_HISTORY_tableName } = require("./utils");

const getWAMStudentLicenceHistoryUsingDynamo = async (ddb, schoolStudentID) => {
  let params;
  params = {
    TableName: `${WAM_STUDENT_LICENCE_HISTORY_tableName}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPU}-${process.env.ENV}`,
    IndexName: "bySchoolStudentID",
    KeyConditionExpression: "schoolStudentID= :schoolStudentID",
    ExpressionAttributeValues: {
      ":schoolStudentID": schoolStudentID,
    },
  };

  const data = [];
  let items;
  do {
    items = await ddb.query(params).promise();
    items.Items.forEach((item) => data.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== "undefined");

  return data;
};

const fetchAllNextTokenData = async (queryName, query, input) => {
  let nextToken = null;
  let data = [];

  try {
    do {
      input.nextToken = nextToken;

      let searchResults = await request({
        query,
        variables: input,
      });
      if (searchResults.data[queryName]) {
        data = [...data, ...searchResults.data[queryName]?.items];
        nextToken = searchResults.data[queryName].nextToken;
      }
    } while (nextToken != null);
  } catch (error) {
    console.log(error);
    throw error;
  }
  return data;
};

const updateStudentDataGeneralMethod = async (
  mutation,
  mutationName,
  records,
  fieldName,
  value
) => {
  try {
    for (let index = 0; index < records.length; index++) {
      const element = records[index];
      const input = {
        ...element,
      };
      input[fieldName] = value;

      const result = await request({
        query: mutation,
        variables: { input },
      });
      if ( result?.errors) {
        console.error(
          `error when updating records ${JSON.stringify(result.errors)}`
        );
      }
    }
  } catch (error) {
    console.error(
      `error when updating by ${mutationName} id:${id} fieldName:${fieldName} value:${value}`,
      error
    );
  }
};

const deleteClassroomsForStudents = async (classroomStudentsRecords) => {
  try {
    for (let index = 0; index < classroomStudentsRecords.length; index++) {
      const classroomStudent = classroomStudentsRecords[index];
      const input = {
        id: classroomStudent.id,
      };

      const result = await request({
        query: deleteClassroomStudent,
        variables: { input },
      });
      if ( result?.errors) {
        console.error(
          `error when deleting the classroom students records ${JSON.stringify(
            result.errors
          )}`
        );
      }
    }
  } catch (error) {
    console.error("error when deleting the classroom students records", error);
  }
};

module.exports = {
  fetchAllNextTokenData,
  updateStudentDataGeneralMethod,
  getWAMStudentLicenceHistoryUsingDynamo,
  deleteClassroomsForStudents,
};
