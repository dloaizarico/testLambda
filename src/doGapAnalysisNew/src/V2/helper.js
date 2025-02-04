const path = require("path");
const event = require("./event.json");
const ACCODE_MAPPING_TABLE_NAME = `AcCodeMapping-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`;
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const s3Client = new AWS.S3();
const d3 = require("d3");
const _ = require("lodash");
const dayjs = require("dayjs");

const { request } = require("./appSyncRequest");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const { logger } = require("./logger");
const zlib = require("zlib"); // Compression for S3 uploads

const {
  getTestResultsByTestByStudentByTestDate,
  getSchoolCohortLinks,
  getSchoolIDsFromClassroomID,
  getStudentData,
  getAcCodeData,
  GetTestResultAnswersGA,
  ListYearLevels,
} = require("../graphql/bpqueries.js");

const YEAR_SIX_CODE = "Y6";
const YEAR_SEVEN_CODE = "Y7";

async function getStudentTestResults(studentID, tests, mappingMap) {
  const promises = tests.map(async (test) => {
    const input = {
      testID: test.testID,
      studentIDTestDate: { eq: { studentID, testDate: test.testDate } },
    };

    try {
      const response = await request({
        query: getTestResultsByTestByStudentByTestDate,
        variables: input,
      });

      const results =
        response?.data?.getTestResultsByTestByStudentByTestDate?.items || [];
      return results.length > 0 ? results[0].resultAnswers.items : [];
    } catch (error) {
      logger.error(
        `Error fetching student test results for ${studentID}: ${error}`
      );
      return [];
    }
  });

  // **Execute all test fetches in parallel**
  let response = await Promise.all(promises);
  response = _.flatten(response);

  // **Attach AC Code Mappings to each result**
  response.forEach((result) => {
    const codeMappings = mappingMap.get(result?.testQuestion?.acCode?.id) || [];
    result.testQuestion.acCode.codeMappings = { items: codeMappings };
  });

  return response;
}

//**Write to S3 for Large Data Sets**
async function writeToS3(data) {
  const key = `gapAnalysis/${uuidv4()}-networkResult.json.gz`;
  await s3Client
    .putObject({
      Bucket: process.env.BUCKET,
      Key: `public/${key}`,
      ContentType: "application/gzip",
      Body: zlib.gzipSync(JSON.stringify(data)), // **Use gzip for compression**
    })
    .promise();
  return key;
}

//**Prepare Data for Gap Analysis**
function prepareForGapAnalysis(
  testResultsAnswers,
  uniqueAcCodes,
  uniqueStudents,
  mappingMap
) {
  return testResultsAnswers.map((result) => {
    let acCodeData = uniqueAcCodes.get(result.acCode);
    let studentData = uniqueStudents.get(result.studentID);
    return {
      proficiency: result.proficiency,
      student: studentData,
      acCode: {
        ...acCodeData,
        codeMappings: { items: mappingMap.get(acCodeData.id) },
      },
      learningArea: acCodeData.learningArea,
      yearLevel: acCodeData.yearLevel,
    };
  });
}

//**Batch Fetch Student & AC Code Details**
async function fetchStudentAndAcCodeDetails(uniqueAcCodes, uniqueStudents) {
  const [acCodeData, studentData] = await Promise.all([
    Promise.all(
      [...uniqueAcCodes.keys()].map((id) =>
        request({ query: getAcCodeData, variables: { id } })
      )
    ),
    Promise.all(
      [...uniqueStudents.keys()].map((id) =>
        request({ query: getStudentData, variables: { id } })
      )
    ),
  ]);

  acCodeData.forEach((res) =>
    uniqueAcCodes.set(res.data.getAcCode.id, res.data.getAcCode)
  );
  studentData.forEach((res) =>
    uniqueStudents.set(res.data.getStudent.id, res.data.getStudent)
  );

  return { uniqueAcCodes, uniqueStudents };
}

//**Efficiently Group Data Using Maps**
function processTestResults(testResultsAnswers) {
  let uniqueTests = new Map();
  let uniqueAcCodes = new Map();
  let uniqueStudents = new Map();

  testResultsAnswers.forEach((res) => {
    let key = `${res.studentID}#${res.acCode}`;
    uniqueTests.has(key)
      ? uniqueTests.get(key).push(res)
      : uniqueTests.set(key, [res]);
    uniqueAcCodes.set(res.acCode, res.acCode);
    uniqueStudents.set(res.studentID, res.studentID);
  });

  return { uniqueTests, uniqueAcCodes, uniqueStudents };
}

//**Utility Function: Format Response**
const formatResponse = (data) => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
  body: JSON.stringify(data.length > 0 ? data : ["EMPTY_RESULT"]),
});

//**Fetch Year Levels & AC Code Mappings in Parallel**
async function fetchInitialData(dynamoClient) {
  const [yearLevelsData, mappingMap] = await Promise.all([
    request({ query: ListYearLevels, variables: { limit: 100 } }),
    getAcCodeMappings(dynamoClient),
  ]);
  return {
    yearLevels: yearLevelsData.data.listYearLevels.items,
    mappingMap,
  };
}

//**Fetch Student Cohort for Schools in Parallel**
async function fetchStudentIDsForSchools(
  networkSchools,
  yearLevelID,
  schoolYear,
  yearLevels
) {
  const studentIDs = new Set();
  await Promise.all(
    networkSchools.map(async (schoolID) => {
      let students = await getStudentsInCohort(
        schoolID,
        yearLevelID,
        schoolYear ?? parseInt(dayjs().format("YYYY"))
      );
      students.forEach((s) => studentIDs.add(s.studentID));
    })
  );
  return [...studentIDs];
}

//**Fetch Student & Test Result Data in Parallel**
async function fetchTestResults(studentIDs, testUploads) {
  return await findTestResultAnswers(studentIDs, testUploads);
}
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

function doGapAnalysis(learningAreas, data, formatted) {
  // Format raw test results only if not already formatted
  const list = formatted ? data : formatRawResultData(data);

  const acList = _.uniqBy(list, "acCode.acCode").map((a) => ({ ...a.acCode }));
  const acByYear = d3
    .groups(acList, (d) => d.yearLevel.description)
    .map(([key, values]) => ({
      year: key,
      codes: values,
      totalCodes: values.length,
    }));

  const students = _.uniqBy(list, "student.id").map((s) => ({ ...s.student }));
  const areaList = _.uniqBy(acList, "learningArea.id").map((l) => ({
    ...l.learningArea,
  }));

  // Group data and summarize proficiency per student
  const groupedResults = d3.rollups(
    list,
    (v) => ({
      student: v[0].student,
      gapRatio: parseFloat(d3.mean(v, (p) => p.proficiency).toFixed(2)),
      score: v[0].score,
      testID: v[0].testID,
      testDate: v[0].testDate,
    }),
    (d) => d.learningArea.id,
    (d) => d.acCode.yearLevel.description,
    (d) => d.acCode.acCode,
    (d) => d.student.id
  );

  return groupedResults
    .map(([learningAreaID, yearData]) => {
      const area = areaList.find((a) => a.id === learningAreaID);
      return {
        learningAreaID,
        areaName: area.areaName,
        colour: area.colour,
        numStudents: students.length,
        summary: yearData.map(([year, codeData]) => {
          const yearDetails = acByYear.find((y) => y.year === year);
          const clist = codeData
            .map(([acCode, studentResults]) => ({
              acCode,
              students: studentResults
                .filter(([_, val]) => val.gapRatio <= 0.5)
                .map(([_, values]) => ({
                  ...values.student,
                  gapRatio: values.gapRatio,
                  score: values.score,
                  testID: values.testID,
                  testDate: values.testDate,
                })),
            }))
            .filter((x) => x.students.length > 0);

          return {
            year,
            totalCodes: yearDetails?.totalCodes || 0,
            incorrectCodes: clist.length,
            studentCount: new Set(
              clist.flatMap((c) => c.students.map((s) => s.id))
            ).size,
            items: clist,
          };
        }),
      };
    })
    .filter((g) => learningAreas.includes(g.learningAreaID))
    .filter((g) => g.summary.some((s) => s.incorrectCodes > 0));
}

async function getSchoolDataFromClassroomID(classroomID, schoolYear) {
  const input = { id: classroomID };

  try {
    const { data } = await request({
      query: getSchoolIDsFromClassroomID,
      variables: input,
    });

    if (!data || !data.getClassroom) {
      throw new Error("No school data found for the given classroom ID");
    }

    return data.getClassroom; // Returning school ID and students array
  } catch (error) {
    logger.error(
      `Error getting school data for classroom ID ${classroomID}, ${error.message}`
    );
    throw new Error(`Failed to get school data: ${error.message}`);
  }
}

async function getStudentsInCohort(schoolID, yearLevelID, schoolYear) {
    try {
      const input = {
        schoolID,
        schoolYearYearLevelID: {
          eq: {
            schoolYear,
            yearLevelID,
          },
        },
        limit: 1000,
      };
  
      const { data } = await request({
        query: getSchoolCohortLinks,
        variables: input,
      });
  
      if (!data || !data.getSchoolStudentsByYearAndYearLevel) {
        throw new Error('No student data found for the given school and cohort');
      }
  
      return data.getSchoolStudentsByYearAndYearLevel.items; // Returning an array of student IDs
    } catch (error) {
      logger.error(`Error finding cohort students for schoolID: ${schoolID}, yearLevelID: ${yearLevelID}, ${error.message}`);
      return []; // Return an empty array in case of error
    }
  }

module.exports = {
  getAcCodeMappings,
  writeToS3,
  prepareForGapAnalysis,
  fetchStudentAndAcCodeDetails,
  processTestResults,
  formatResponse,
  fetchInitialData,
  fetchStudentIDsForSchools,
  fetchTestResults,
  doGapAnalysis,
  getStudentTestResults,
  getSchoolDataFromClassroomID,
  getStudentsInCohort
};
