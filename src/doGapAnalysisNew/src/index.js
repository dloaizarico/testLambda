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
const { request } = require("./appSyncRequest"); // only for Lambda version
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const { logger } = require("./logger");
AWS.config.update({ region: process.env.REGION });
const s3Client = new AWS.S3();

const d3 = require("d3");
const _ = require("lodash");
const dayjs = require("dayjs");

const FORMATTED = true;
const UNFORMATTED = false;

const {
  getTestResultsByTestByStudentByTestDate, // Frank's GA only
  getClassroomStudentLinks, // Frank's GA only
  getSchoolCohortLinks, // used in Frank's and Brendan's GA
  getSchoolIDsFromClassroomID, // new for Brendan's GA
  getStudentData, // new for Brendan's GA
  getAcCodeData, // new for Brendan's GA
  GetTestResultAnswersGA, // new for Brendan's GA
  ListYearLevels,
} = require("./graphql/bpqueries.js");
const { getAcCodeMappings } = require("./helper.js");

const YEAR_SIX_CODE = "Y6";
const YEAR_SEVEN_CODE = "Y7";

function formatRawResultData(inputData) {
  const result = _.chain(inputData)
    .sortBy("testQuestion.acCode.yearLevel.description")
    .filter((x) => x !== undefined)
    .filter((x) => x.id)
    .map((item) => {
      return {
        testResultAnswerId: item.id,
        acCode: item.testQuestion.acCode,
        learningArea: item.testQuestion.acCode.learningArea,
        yearLevel: item.testQuestion.acCode.yearLevel,
        student: item.testResult.student,
        test: item.testResult.test,
        questionNo: item.testQuestion.questionNo,
        proficiency: item.proficiency,
        studentAnswer: item.studentAnswer,
        score: item.testResult.score,
        testID: item.testResult.testID,
        testDate: item.testResult.testDate,
      };
    })
    .value();
  return result;
}

function getResultsMean(d) {
  return {
    student: d[0].student,
    gapRatio: parseFloat(d3.mean(d, (p) => p.proficiency).toFixed(2)),
    score: d[0].score,
    testID: d[0].testID,
    testDate: d[0].testDate,
  };
}

function getAcCodesByYearLevel(data) {
  return d3
    .groups(data, (d) => d.yearLevel.description)
    .map(([key, values]) => {
      return { year: key, codes: values, totalCodes: values.length };
    });
}

function getAcList(data) {
  return _.chain(data)
    .uniqBy("acCode.acCode")
    .map((a) => {
      return { ...a.acCode };
    })
    .value();
}

function getStudentList(data) {
  return _.chain(data)
    .uniqBy("student.id")
    .map((s) => {
      return { ...s.student };
    })
    .filter((s) => s.id)
    .value();
}

function getAreas(data) {
  return _.chain(data)
    .uniqBy("learningArea.id")
    .map((l) => {
      return { ...l.learningArea };
    })
    .value();
}

function getStudentCount(data) {
  const list = new Set();

  data.forEach((d) =>
    d.students.forEach((s) => {
      list.add(s.id);
    })
  );

  return list.size;
}

function doGapAnalysis(learningAreas, data, formatted) {
  let list = [];
  if (!formatted) {
    list = formatRawResultData(data); // format test results for analysis
  } else {
    list = data;
  }
  const acList = getAcList(list); // extract unique list of ac codes tested
  const acByYear = getAcCodesByYearLevel(acList); // extract list of ac codes by year level
  const students = getStudentList(list); // extract list of students
  const areaList = getAreas(acList); // extract learningArea details

  // get summarised data
  const grp = d3
    .rollups(
      list,
      (v) => getResultsMean(v),
      (d) => d.learningArea.id,
      (d) => d.acCode.yearLevel.description,
      (d) => d.acCode.acCode,
      (d) => d.student.id
    )
    .map(([key, values]) => {
      const area = areaList.find((a) => a.id === key);

      return {
        learningAreaID: key,
        areaName: area.areaName,
        colour: area.colour,
        numStudents: students.length,
        summary: values.map(([key, values]) => {
          const yearData = acByYear.find((y) => y.year === key);

          const clist = values
            .map(([key, values]) => {
              const codeData = acList.find((c) => c.acCode === key);

              const slist = values
                .filter(([key, val]) => {
                  return val.gapRatio <= 0.5;
                })
                .map(([key, values]) => {
                  return {
                    ...values.student,
                    gapRatio: values.gapRatio,
                    score: values.score,
                    testID: values.testID,
                    testDate: values.testDate,
                  };
                });

              return {
                acCode: codeData,
                students: slist,
              };
            })
            .filter((x) => {
              return x.students.length > 0;
            });

          return {
            year: key,
            totalCodes: yearData.totalCodes,
            incorrectCodes: clist.length,
            studentCount: getStudentCount(clist),
            items: clist,
          };
        }),
      };
    });

  return grp
    .filter((g) => learningAreas.find((a) => a === g.learningAreaID))
    .filter((g) => g.summary.filter((s) => s.incorrectCodes > 0).length > 0);
}

async function getStudentTestResults(studentID, tests, mappingMap) {
  let response = [];
  let promises = [];

  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];

    const promise = new Promise(async (resolve) => {
      const input = {
        testID: test.testID,
        studentIDTestDate: {
          eq: {
            studentID,
            testDate: test.testDate,
          },
        },
      };
      try {
        const resp = await request({
          query: getTestResultsByTestByStudentByTestDate,
          variables: input,
        });

        if (
          resp.data.getTestResultsByTestByStudentByTestDate.items.length > 0
        ) {
          resolve(
            resp.data.getTestResultsByTestByStudentByTestDate.items[0]
              .resultAnswers.items
          );
        } else {
          resolve([]);
        }
      } catch (error) {
        logger.error(`error getting student results, ${input}, ${error}`);
        resolve([]);
      }
    });

    promises.push(promise);
  }

  const data = await Promise.all(promises);
  response = _.flatten(data);
  // For each result answer, taking the test question related and the accode and find the accode mappings to the new curriculum, then assign it to the final return object.
  for (let index = 0; index < response.length; index++) {
    const result = response[index];
    const codeMappings = mappingMap.get(result?.testQuestion?.acCode.id);
    result.testQuestion.acCode.codeMappings = { items: codeMappings };
  }
  return response;
}

// **************************************
// Below is all New Faster gap Analysis
// **************************************

// Note: A student may have multiple schoolIDs in a single year
//Note: A classroom may be either a classroom or a Focus Group
//      if classroom then the array of yearLevelIDs is usually provided
//      If focus group we have to find the yearLevels from the students
async function getSchoolDataFromClassroomID(classroomID, schoolYear) {
  let schoolData;

  const input = {
    id: classroomID,
  };
  try {
    const resp = await request({
      query: getSchoolIDsFromClassroomID,
      variables: input,
    });
    schoolData = resp.data.getClassroom;
  } catch (error) {
    logger.error(`error getting schoolData from classroomID, ${error}`);
    throw error;
  }
  return schoolData; // a single schoolID and and array of students
}

//Find the students in a cohort
async function getStudentsInCohort(schoolID, yearLevelID, schoolYear) {
  let studentIDs = [];

  try {
    const input = {
      schoolID,
      schoolYearYearLevelID: {
        eq: {
          schoolYear: schoolYear,
          yearLevelID: yearLevelID,
        },
      },
      limit: 1000,
    };
    const resp = await request({
      query: getSchoolCohortLinks,
      variables: input,
    });
    studentIDs = resp.data.getSchoolStudentsByYearAndYearLevel.items;
  } catch (error) {
    logger.error(
      `error finding cohort students
      ${schoolID},
      ${yearLevelID},
      ${error}`
    );
  }
  return studentIDs; //this is an array of {studentID:"djhasdhhhh"}
}

async function findTestResultAnswers(studentIDs, testUploads) {
  /**
  * Note: testUploads has this structure (TestUploadID has been added with new GetTests)
  *   learningAreaID: "7996cf16-ca38-4b46-9bcb-9eee6a50d104"
      testDate: "2021-07-30"
      testID: "5d438f04-91d1-4887-af56-6160d16468d4"
      testName: "Danie image test 2 - acmna027"
      testUploadID: "413a94d0-4e06-4487-842d-d7678168dd87"
      schoolID:"413a94d0-4e06-4487-842d-d7678168dd87"
  */
  /**
   * The gap analysis algoritm depends on a new table called TestResultAnswersGA
        id (primary index)  its a testUploadID
        studentID
        acCodeID     (sadly its called acCode in the schema)
        proficiency
   *
   */
  /**
   * Gap Analysis Algorithm
   * Note: Since we are passed TestUploads from the criteria we dont need to worry
   * about testDate or learningArea
   * This will save filtering through long lists of students that cannot be part of the testUplaod
   *
   * For each testUpload
   *    retrieve all the testResultAnswers for that TestUpload
   *    filter out students that are not selected
   *    push the remainder to an array of rawResultAnswers[]
   *
   */
  let rawTestResults = [];

  // Put a message into the promise queue
  async function printMessage(message) {
    return message;
  }

  // Note: This function has side effect of updating allTestResults
  async function getOneTestUpload(testUpload) {
    let nextToken = null;
    try {
      let n = 0;
      do {
        let input = {
          testUploadID: testUpload.testUploadID,
          nextToken: nextToken,
        };
        const resp = await request({
          query: GetTestResultAnswersGA,
          variables: input,
        });
        let allTestResults =
          resp.data.getTestResultsAnswersGAByTestUpload.items;
        nextToken = resp.data.getTestResultsAnswersGAByTestUpload.nextToken;
        allTestResults.forEach((testResult) => {
          if (studentIDs.includes(testResult.studentID))
            rawTestResults.push(testResult);
        });
        n++;
      } while (nextToken != null);
      return `Done ${testUpload.testUploadID} in ${n} queries`;
    } catch (error) {
      logger.error(`error getting testResults data, ${error}`);
      return error;
    }
  }

  // create an array of "functions that returns a promise" so we can execute them in sequence
  let fnArray = [];
  testUploads.forEach((testUpload) => {
    fnArray.push(() =>
      printMessage(`getting data for upload ${testUpload.testUploadID}`)
    );
    fnArray.push(() => getOneTestUpload(testUpload));
  });

  // now execute all functions in sequence, waiting for each to finish before proceeding
  try {
    for (const fn of fnArray) {
      await fn(); // execute the function
    }
  } catch (err) {
    logger.error(err);
  }

  return rawTestResults;
}

/**
 * this function formats the final response of the lambda and return it to the browser, it receives the array with the gaps, if there are no gaps then the lambda returns EMPTY_RESULT
 * @param {*} finalResult
 * @returns
 */
function formatResponse(finalResult) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  if (finalResult.length > 0) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(finalResult),
    };
    // Network report scenario
  } else if (finalResult?.reportUrl) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(finalResult),
    };
  } else {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(["EMPTY_RESULT"]),
    };
  }
}

// This method find if the year level id received as parameter is the year 7 -> this applies only for high schools receiving students from primary schools and trying to see gap analysis for those ones.
function isYearSevenSelected(yearLevels, yearLevelId) {
  const yearLevel = yearLevels.find((item) => item.id === yearLevelId);

  if (yearLevel === undefined) {
    return false;
  }

  return yearLevel.yearCode === YEAR_SEVEN_CODE;
}

// This method returns the year six level id in the database -> this applies only for high schools receiving students from primary schools and trying to see gap analysis for those ones.
const findYearSixId = (yearLevels) => {
  const yearLevel = yearLevels.find((item) => item.yearCode === YEAR_SIX_CODE);

  if (yearLevel === undefined) {
    return false;
  }

  return yearLevel.id;
};

const handler = async (event) => {
  try {
    // you cant pass a "request body" with GET requests so the ApiGateway request is a PUT
    logger.debug(`event received ${event?.body}`);
    const inputData = JSON.parse(event.body);
    const studentID = inputData.studentID;
    const classroomID = inputData.classroomID;
    const schoolID = inputData.schoolID;
    const yearLevelID = inputData.yearLevelID;
    const networkSchools = inputData.networkSchools;
    // Note array of objects need to be parsed twice
    const tests = inputData.tests; //( for old Gap Analysis)
    const testUploads = inputData.allTestUploads; // (for new Gap Analysis)
    const learningAreas = inputData.learningAreas;
    const schoolYear = inputData.schoolYear;

    let response = [];
    let results = [];

    //let rawTestResults = [];
    let testResultsAnswers = [];

    let yearLevels = [];

    const dynamoClient = new AWS.DynamoDB.DocumentClient({
      region: process.env.REGION,
    });

    // Getting the existing mapping for each ACCODE.
    const mappingMap = await getAcCodeMappings(dynamoClient);

    logger.debug(`mapping map ${mappingMap?.size}`);

    try {
      const yearLevelResponse = await request({
        query: ListYearLevels,
        variables: { limit: 100 },
      });
      yearLevels = yearLevelResponse.data.listYearLevels.items;
    } catch (error) {
      logger.error(`error getting the year levels, ${error}`);
      throw error;
    }

    logger.debug(`Get the year levels`);

    if (networkSchools && yearLevelID) {
      // do this once for every schoolID
      let promises = networkSchools.map(async (schoolID) => {
        // these have to be local variables inside the asyn
        // or timing of initialisations will be off if global
        let studentIDs = [];
        // find the student list in each school
        try {
          // find the student list in each school
          let resp;

          // Check if the year level selected is Seven.
          if (isYearSevenSelected(yearLevels, yearLevelID)) {
            // get the students of that school that were in year 6 in the previous school year - this is only valid for high schools that receives students from primary
            resp = await getStudentsInCohort(
              schoolID,
              findYearSixId(yearLevels),
              dayjs().subtract(1, "year").format("YYYY").toString()
            );
          } else {
            resp = await getStudentsInCohort(
              schoolID,
              yearLevelID,
              schoolYear
                ? schoolYear
                : parseInt(dayjs().format("YYYY").toString())
            );
          }

          resp.forEach((response) => {
            studentIDs.push(response.studentID);
          });
        } catch (error) {
          logger.error("error finding students in cohort");
          return error;
        }

        // testUploads are school specific, so remove any not for this school
        let thisSchoolTestUploads = testUploads.filter((testUpload) => {
          if (testUpload.schoolID === schoolID) return true;
          return false;
        });

        let thisSchoolResults = [];

        if (thisSchoolTestUploads.length > 0) {
          try {
            thisSchoolResults = await findTestResultAnswers(
              studentIDs,
              thisSchoolTestUploads
            );
          } catch (error) {
            logger.error("error finding testResultAnswers");
            return error;
          }
        }
        thisSchoolResults.forEach((result) => {
          testResultsAnswers.push(result);
        });
      });
      await Promise.all(promises);
      logger.debug(`Network analysis`);
    } else {
      // Here we find the list of students to match the selected group
      let studentIDs = [];

      if (studentID) {
        // for a single student - just use Franks method and return
        try {
          results = await getStudentTestResults(studentID, tests, mappingMap);
          response = doGapAnalysis(learningAreas, results, UNFORMATTED);
        } catch (error) {
          logger.error(`error doing student Gap Analysis ${error}`);
          return error;
        }

        // let responseObj = {
        //   statusCode: 200,
        //   headers,
        //   body: JSON.stringify(response),
        // };
        logger.error(`response: ${formatResponse(response)}`);
        return formatResponse(response);
      } else if (classroomID) {
        // classroomIDs are unique so we find the schoolID, and the list of students in the class
        let resp = [];
        try {
          resp = await getSchoolDataFromClassroomID(
            classroomID,
            schoolYear
              ? schoolYear
              : parseInt(dayjs().format("YYYY").toString())
          );

          logger.debug(`got the students from the classroom.`);
        } catch (error) {
          logger.error(`error doing classroom Gap Analysis ${error}`);
          return error;
        }
        // resp is one schoolID and an array of students
        resp.students.items.forEach((item) => {
          studentIDs.push(item.studentID);
        });
        logger.debug(`too many students ${resp?.students?.items?.length}`);
      } else if (schoolID && yearLevelID) {
        // now find the list of students in that cohort
        let resp = [];
        try {
          resp = await getStudentsInCohort(
            schoolID,
            yearLevelID,
            schoolYear
              ? schoolYear
              : parseInt(dayjs().format("YYYY").toString())
          );
        } catch (error) {
          logger.error(`error getting student in cohort ${error}`);
          return error;
        }

        resp.forEach((response) => {
          studentIDs.push(response.studentID);
        });
      }
      // now get the testResultAnswers for the selected students
      testResultsAnswers = await findTestResultAnswers(studentIDs, testUploads);
      logger.debug(`Student, classroom or cohort analysis`);
    }

    // when we reach here we have a giant array of TestResultAnswers
    // with each element
    //   {
    //    studentID
    //    acCodeID
    //    proficiency
    //   }
    // Next we need to create a map with keys studentID#acCode ( will have multiple proficiency values)
    // and calculate the GapRatio from the proficiency for each value and reduce to one value with the GapRatio
    // Then for each gap record
    //    pad out the student data (already looked up at the start)
    //    pad out the acCode data ( has to be looked up)

    // now make a new array to mimic testResultAnswersGA
    // This step is redundant and should have been removed.
    //;
    //rawTestResults.forEach((testResult) => {
    //  let op = {};
    //  op.studentID = testResult.studentID;
    //  op.acCode = testResult.acCode; // this is really acCodeID
    //  op.proficiency = testResult.proficiency;
    //  testResultsAnswers.push(op);
    //});

    // now map by studentID,acCode
    let uniqueTests = new Map();
    testResultsAnswers.forEach((resultAnswer) => {
      let key = `${resultAnswer.studentID}#${resultAnswer.acCode}`;
      let value = uniqueTests.get(key);
      if (value === undefined) {
        uniqueTests.set(key, [resultAnswer]);
      } else {
        value.push(resultAnswer);
        uniqueTests.set(key, value);
      }
    });

    logger.debug(`finished mapping by studentID`);

    // Find a unique list of acCodes, and look up details
    let uniqueAcCodes = new Map();
    testResultsAnswers.forEach((item) => {
      if (uniqueAcCodes.get(item.acCode) === undefined) {
        uniqueAcCodes.set(item.acCode, item.acCode);
      }
    });

    //look up the acCodeData
    let uniqueAcCodesArray = Array.from(uniqueAcCodes.values());

    let promises = uniqueAcCodesArray.map(async (acCodeID) => {
      let input = {
        id: acCodeID,
      };
      try {
        //const resp = await API.graphql(graphqlOperation(getAcCodeData, input));
        const resp = await request({
          query: getAcCodeData,
          variables: input,
        });
        uniqueAcCodes.set(acCodeID, resp.data.getAcCode);
      } catch (error) {
        logger.error(`error getting acCodeData from acCode, ${error}`);
        throw error;
      }
      return "done";
    });
    await Promise.all(promises);

    // find a unique list of students to minimise data lookup
    let uniqueStudents = new Map();
    testResultsAnswers.forEach((item) => {
      if (uniqueStudents.get(item.studentID) === undefined) {
        uniqueStudents.set(item.studentID, item.studentID);
      }
    });

    //lookup the student data
    // Note:We may be looking up data for some students that have no gaps -
    // but in a large test, probably every student has at least one gap - so maybe not so bad
    let uniqueStudentsArray = Array.from(uniqueStudents.values());
    let promises1 = uniqueStudentsArray.map(async (studentID) => {
      let input = {
        id: studentID,
      };
      try {
        //const resp = await API.graphql(graphqlOperation(getStudentData, input));
        const resp = await request({
          query: getStudentData,
          variables: input,
        });
        let studentData = resp.data.getStudent;
        uniqueStudents.set(studentID, studentData);
      } catch (error) {
        logger.error(`error getting StudentData from studentID, ${error}`);
        throw error;
      }
      return "done";
    });
    await Promise.all(promises1);

    // Make Franks "list" structure
    let unsortedList = [];
    testResultsAnswers.forEach((result) => {
      let o = {}; // o for output
      let acCodeData = uniqueAcCodes.get(result.acCode);
      let studentData = uniqueStudents.get(result.studentID);
      const codeMappings = mappingMap.get(acCodeData.id);
      o.proficiency = result.proficiency;
      o.questionNo = 99;
      o.score = "99";
      o.testDate = "2021-01-01";
      o.testID = "99";
      o.testResultAnswer = "99";
      o.studentAnswer = "99";
      o.student = studentData;
      o.acCode = {
        acCode: acCodeData.acCode,
        curriculumEntry: acCodeData.curriculumEntry,
        learningArea: acCodeData.learningArea,
        skill: acCodeData.skill,
        strand: acCodeData.strand,
        strandID: acCodeData.strand.id,
        substrand: acCodeData.substrand,
        substrandID: acCodeData.substrand.id,
        yearLevel: acCodeData.yearLevel,
        yearLevelID: acCodeData.yearLevel.id,
        codeMappings: { items: codeMappings },
      };
      o.learningArea = acCodeData.learningArea;
      o.test = { testName: "TestName 99" };
      o.yearLevel = acCodeData.yearLevel;
      unsortedList.push(o);
    });
    // now sort by yearLevel description ( for the final UI display)
    // this sort is incorrect becasue it lists Y10 ahead of y2
    //let list = _.sortBy(unsortedList, "yearLevel.description");
    // so need a function that will return a field that represents the desired sort order
    function sortByYL(o) {
      switch (o.yearLevel.yearCode) {
        case "K":
          return 1;
        case "FY":
          return 2;
        // otherwise its something like "Y1" or "Y11"
        default: {
          return parseInt(o.yearLevel.yearCode.substr(1, 3)) + 2;
        }
      }
    }

    let list = _.sortBy(unsortedList, sortByYL);
    let finalResult = doGapAnalysis(learningAreas, list, FORMATTED);
    const returnData = formatResponse(finalResult);

    logger.debug(`finished all the list creation.`);

    // If the analysis is by network, it saves the result in an s3 file because of the size and it returns the key of the file to the client.
    if (networkSchools && yearLevelID) {
      const key = `gapAnalysis/${uuidv4()}-networkResult.txt`;
      await s3Client
        .putObject({
          Bucket: process.env.BUCKET,
          Key: `public/${key}`,
          ContentType: "text/plain",
          Body: JSON.stringify(returnData),
        })
        .promise();
      logger.debug(
        `response: ${formatResponse({
          reportUrl: key,
        })}`
      );
      return formatResponse({
        reportUrl: key,
      });
    } else {
      logger.debug(returnData);
      return returnData;
    }
  } catch (error) {
    logger.error(`error running GA ${error}`);
  }
};

handler(event);
