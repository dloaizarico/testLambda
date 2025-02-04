const path = require("path");
const event = require("./event.json");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
/* Amplify Params - DO NOT EDIT
	API_BPEDSYSGQL_GRAPHQLAPIENDPOINTOUTPUT
	API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

//import { values } from "core-js/core/array";
//import { API, graphqlOperation } from "aws-amplify"; // only for local version
//const { GAreturnObject } = require("GAReturnObject"); // a dummy GA return objects array for tests

const { getAcCodeMappings } = require("./helper.js");
const { fetchInitialData } = require("./helper.js");
const { fetchStudentIDsForSchools } = require("./helper.js");
const { fetchTestResults } = require("./helper.js");
const { processTestResults } = require("./helper.js");
const { fetchStudentAndAcCodeDetails } = require("./helper.js");
const { prepareForGapAnalysis } = require("./helper.js");
const { formatResponse } = require("./helper.js");
const { writeToS3 } = require("./helper.js");
const { doGapAnalysis } = require("./helper.js");
const { getStudentTestResults } = require("./helper.js");
const { getSchoolDataFromClassroomID } = require("./helper.js");
const { getStudentsInCohort } = require("./helper.js");

//**Lambda Handler**
exports.handler = async (event) => {
  try {
    logger.debug(`Event received: ${event?.body}`);
    const inputData = JSON.parse(event.body);
    const {
      studentID,
      classroomID,
      schoolID,
      yearLevelID,
      networkSchools,
      tests,
      allTestUploads: testUploads,
      learningAreas,
      schoolYear,
    } = inputData;

    const dynamoClient = new AWS.DynamoDB.DocumentClient({
      region: process.env.REGION,
    });

    // Fetch initial data
    const { yearLevels, mappingMap } = await fetchInitialData(dynamoClient);
    let studentIDs = new Set();
    let testResultsAnswers = [];

    if (networkSchools && yearLevelID) {
      studentIDs = await fetchStudentIDsForSchools(
        networkSchools,
        yearLevelID,
        schoolYear,
        yearLevels
      );
      testResultsAnswers = await fetchTestResults(studentIDs, testUploads);
      logger.debug(`Completed Network Analysis`);
    } else {
      if (studentID) {
        let results = await getStudentTestResults(studentID, tests, mappingMap);
        return formatResponse(doGapAnalysis(learningAreas, results, false));
      }

      if (classroomID) {
        let resp = await getSchoolDataFromClassroomID(
          classroomID,
          schoolYear ?? parseInt(dayjs().format("YYYY"))
        );
        resp.students.items.forEach((s) => studentIDs.add(s.studentID));
      } else if (schoolID && yearLevelID) {
        let students = await getStudentsInCohort(
          schoolID,
          yearLevelID,
          schoolYear ?? parseInt(dayjs().format("YYYY"))
        );
        students.forEach((s) => studentIDs.add(s.studentID));
      }

      testResultsAnswers = await fetchTestResults(studentIDs, testUploads);
    }

    const { uniqueAcCodes, uniqueStudents } =
      processTestResults(testResultsAnswers);
    const { uniqueAcCodes: acCodeMap, uniqueStudents: studentMap } =
      await fetchStudentAndAcCodeDetails(uniqueAcCodes, uniqueStudents);

    let formattedList = prepareForGapAnalysis(
      testResultsAnswers,
      acCodeMap,
      studentMap,
      mappingMap
    );
    let finalResult = doGapAnalysis(learningAreas, formattedList, true);

    if (networkSchools && yearLevelID) {
      const s3Key = await writeToS3(finalResult);
      return formatResponse({ reportUrl: s3Key });
    }

    return formatResponse(finalResult);
  } catch (error) {
    logger.error(`Error in Lambda: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
