const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "/../../.env") });
const {
  fetchAllNextTokenData,
  updateStudentDataGeneralMethod,
  deleteClassroomsForStudents,
} = require("./api");
const dayjs = require("dayjs");

const { request } = require("./appSyncRequest");
const {
  updateTestResult,
  updateTestResultLearningArea,
  updateTestResultAnswersGA,
  updateTeacherLessonPlan,
  updateStudentData,
  updateClassroomStudent,
  updateStudentEALDProgressMap,
  updateAssessment,
  deleteSchoolStudent,
  updateStudent,
  udpateSchoolStudent,
  deleteStudent,
  deleteUser,
} = require("./graphql/bpmutations");
const {
  getSchoolStudent,
  getStudentAssessment,
  getTestResultsByStudent,
  getTestResultsLearningAreaByStudentID,
  getTestResultsAnswersGAByStudentID,
  getStudentLessonPlans,
  getStudentDataByStudentID,
  getClassroomsByStudent,
  getStudentProgressMapByStudentId,
  getStudent,
  getUserByUserId,
  getStudentLicenceHistoryBySchoolStudentID,
  getStudentSchools,
  getSchoolStudentsByStudentID,
} = require("./graphql/bpqueries");
const {
  TESTRESULT_ANSWERS_GA_tableName,
  STUDENT_EALD_PROGRESS_MAP_tableName,
  TESTRESULT_LEARNING_AREA_tableName,
  TESTRESULT_tableName,
  ASSESSMENTS_tableName,
  STUDENT_LESSON_PLANS_tableName,
  STUDENT_DATA_tableName,
  STUDENT_CLASSROOMS_tableName,
  MERGED_STUDENT_tableName,
  getTimeStamp,
  MERGED_STUDENT_DATA_tableName,
  WAM_STUDENT_LICENCE_HISTORY_tableName,
} = require("./utils");
const { v4: uuidv4 } = require("uuid");

/**
 * This method gets all the data related at the moment to the studentID
 * @param {*} schoolStudentID
 * @returns
 */
const getStudentSetOfData = async (schoolStudent) => {
  if (schoolStudent) {
    try {
      let totalRecordsRelatedToTheStudent = 0;
      const studentID = schoolStudent.studentID;
      let input = { studentID };

      const assessments = await fetchAllNextTokenData(
        "getStudentAssessment",
        getStudentAssessment,
        input
      );

      totalRecordsRelatedToTheStudent += assessments?.length;
      const testResults = await fetchAllNextTokenData(
        "getTestResultsByStudent",
        getTestResultsByStudent,
        input
      );

      totalRecordsRelatedToTheStudent += testResults?.length;
      const testResultsLearningAreas = await fetchAllNextTokenData(
        "getTestResultsLearningAreaByStudentID",
        getTestResultsLearningAreaByStudentID,
        input
      );
      totalRecordsRelatedToTheStudent += testResultsLearningAreas?.length;
      let testResultsAnswersGA = await fetchAllNextTokenData(
        "getTestResultsAnswersGAByStudentID",
        getTestResultsAnswersGAByStudentID,
        input
      );
      totalRecordsRelatedToTheStudent += testResultsAnswersGA?.length;
      const studentLessonPlans = await fetchAllNextTokenData(
        "getStudentLessonPlans",
        getStudentLessonPlans,
        input
      );
      totalRecordsRelatedToTheStudent += studentLessonPlans?.length;
      const studentData = await fetchAllNextTokenData(
        "getStudentDataByStudent",
        getStudentDataByStudentID,
        input
      );
      totalRecordsRelatedToTheStudent += studentData?.length;
      const studentClassrooms = await fetchAllNextTokenData(
        "getClassroomsByStudent",
        getClassroomsByStudent,
        input
      );
      totalRecordsRelatedToTheStudent += studentClassrooms?.length;
      const studentEALDProgressMaps = await fetchAllNextTokenData(
        "getStudentProgressMapByStudentId",
        getStudentProgressMapByStudentId,
        input
      );
      totalRecordsRelatedToTheStudent += studentEALDProgressMaps?.length;
      const previousSchoolStudents = await fetchAllNextTokenData(
        "getStudentSchools",
        getStudentSchools,
        input
      );

      return {
        ...schoolStudent,
        assessments,
        testResults,
        testResultsLearningAreas,
        testResultsAnswersGA,
        studentLessonPlans,
        studentData,
        studentClassrooms,
        studentEALDProgressMaps,
        totalRecordsRelatedToTheStudent,
        previousSchoolStudents,
      };
    } catch (error) {
      console.error(
        `Error when trying to fetch school student data ${JSON.stringify(
          error
        )}`
      );
      return null;
    }
  } else {
    console.error(
      "School student ID was not found in the DB, cancelling the process."
    );
    return null;
  }
};

/**
 * This method will return the studentID that needs to be kept in the DB.
 * @returns
 */
const findStudentToKeptInTheDB = (
  schoolStudent1Data,
  schoolStudent2Data,
  schoolStudent1,
  student1,
  schoolStudent2,
  student2
) => {
  if (
    schoolStudent1Data?.totalRecordsRelatedToTheStudent >
    schoolStudent2Data.totalRecordsRelatedToTheStudent
  ) {
    return {
      schoolStudentToKeep: schoolStudent1,
      studentToKeep: student1,
      schoolStudentToKeepData: schoolStudent1Data,
      duplicatedSchoolStudent: schoolStudent2,
      duplicatedStudent: student2,
      duplicatedSchoolStudentData: schoolStudent2Data,
    };
  } else {
    return {
      schoolStudentToKeep: schoolStudent2,
      studentToKeep: student2,
      schoolStudentToKeepData: schoolStudent2Data,
      duplicatedSchoolStudent: schoolStudent1,
      duplicatedStudent: student1,
      duplicatedSchoolStudentData: schoolStudent1Data,
    };
  }
};

const getStudentByID = async (studentID) => {
  let input = { id: studentID };

  const queryResult = await request({
    query: getStudent,
    variables: input,
  });

  return queryResult?.data?.getStudent;
};

const getSchoolStudentByID = async (schoolStudentID) => {
  let input = { id: schoolStudentID };

  const queryResult = await request({
    query: getSchoolStudent,
    variables: input,
  });

  return queryResult?.data?.getSchoolStudent;
};

const getUserData = async (userID) => {
  let input = { userId: userID };

  const users = await fetchAllNextTokenData(
    "getUserByUserId",
    getUserByUserId,
    input
  );

  return users && users.length === 1 ? users[0] : null;
};

/**
 * This method returns all the WAMLicenceHistory for the student.
 * @param {*} schoolStudentID
 * @returns
 */
const getWAMLicenceHistory = async (schoolStudentID) => {
  let input = { schoolStudentID };

  const studentLicenceHistoryBySchoolStudentID = await fetchAllNextTokenData(
    "getStudentLicenceHistoryBySchoolStudentID",
    getStudentLicenceHistoryBySchoolStudentID,
    input
  );

  return studentLicenceHistoryBySchoolStudentID;
};

/**
 * This method takes the data inside the schoolStudent object and updates the field StudentID using appsync.
 * @param {*} newStudentID
 * @param {*} schoolStudent
 */
const updateDuplicatedRecordsRelatedToStudent = async (
  newStudentID,
  schoolStudent,
  studentToKeepClassrooms
) => {
  console.log(
    `duplicated student classrooms length ${schoolStudent.studentClassrooms.length}`
  );
  // This array is used to defined if the student to keep already belongs to a classroom of the duplicatedStudent record, if that's the case, the classroomStudent record of the duplicated is deleted.
  const currentClassroomsIDs = studentToKeepClassrooms.map(
    (studentToKeepClassroom) => studentToKeepClassroom.classroomID
  );

  console.log(`currentClassroomsIDs ${currentClassroomsIDs.length}`);
  try {
    if (schoolStudent.assessments && schoolStudent.assessments.length > 0) {
      console.log("updating the assessment records");
      await updateStudentDataGeneralMethod(
        updateAssessment,
        "updateAssessment",
        schoolStudent.assessments,
        "studentID",
        newStudentID
      );
    }
    if (schoolStudent.testResults && schoolStudent.testResults.length > 0) {
      console.log("updating the test results records");
      await updateStudentDataGeneralMethod(
        updateTestResult,
        "updateTestResult",
        schoolStudent.testResults,
        "studentID",
        newStudentID
      );
    }
    if (
      schoolStudent.testResultsLearningAreas &&
      schoolStudent.testResultsLearningAreas.length > 0
    ) {
      console.log("updating the test result Learning area records");
      await updateStudentDataGeneralMethod(
        updateTestResultLearningArea,
        "updateTestResultLearningArea",
        schoolStudent.testResultsLearningAreas,
        "studentID",
        newStudentID
      );
    }
    if (
      schoolStudent.testResultsAnswersGA &&
      schoolStudent.testResultsAnswersGA.length > 0
    ) {
      console.log("updating the answers GA records");
      await updateStudentDataGeneralMethod(
        updateTestResultAnswersGA,
        "updateTestResultAnswersGA",
        schoolStudent.testResultsAnswersGA,
        "studentID",
        newStudentID
      );
    }
    if (
      schoolStudent.studentLessonPlans &&
      schoolStudent.studentLessonPlans.length > 0
    ) {
      console.log("updating the lesson plans records");
      await updateStudentDataGeneralMethod(
        updateTeacherLessonPlan,
        "updateTeacherLessonPlan",
        schoolStudent.studentLessonPlans,
        "studentID",
        newStudentID
      );
    }
    if (schoolStudent.studentData && schoolStudent.studentData.length > 0) {
      console.log("updating the student data records");
      await updateStudentDataGeneralMethod(
        updateStudentData,
        "updateStudentData",
        schoolStudent.studentData,
        "studentID",
        newStudentID
      );
    }
    if (
      schoolStudent.studentClassrooms &&
      schoolStudent.studentClassrooms.length > 0
    ) {
      const classroomStudentToDelete = [];
      const classroomStudentToUpdate = [];

      // Check what classroomStudents need to be updated and deleted.
      for (let i = 0; i < schoolStudent.studentClassrooms.length; i++) {
        const classroomStudent = schoolStudent.studentClassrooms[i];
        if (currentClassroomsIDs.includes(classroomStudent.classroomID)) {
          classroomStudentToDelete.push(classroomStudent);
        } else {
          classroomStudentToUpdate.push(classroomStudent);
        }
      }

      console.log(
        `classroomStudentToDelete ${classroomStudentToDelete.length}, classroomStudentToUpdate ${classroomStudentToUpdate.length}`
      );

      // Deleting unnecessary classroomStudent records.
      console.log("Deleting unnecessary classroomStudent records");
      await deleteClassroomsForStudents(classroomStudentToDelete);

      // Updating classrooms that need to include the student ID to keep in the database.
      console.log("updating the classroom records");
      await updateStudentDataGeneralMethod(
        updateClassroomStudent,
        "updateClassroomStudent",
        classroomStudentToUpdate,
        "studentID",
        newStudentID
      );
    }
    if (
      schoolStudent.studentEALDProgressMaps &&
      schoolStudent.studentEALDProgressMaps.length > 0
    ) {
      console.log("updating the EALD progress map records");
      await updateStudentDataGeneralMethod(
        updateStudentEALDProgressMap,
        "updateStudentEALDProgressMap",
        schoolStudent.studentEALDProgressMaps,
        "studentId",
        newStudentID
      );
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

const createMergedStudentRecord = async (
  ddb,
  schoolStudentToKeep,
  duplicatedSchoolStudentObject,
  duplicatedStudentObject,
  studentToKeep
) => {
  const id = uuidv4();
  let createdAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
  let updatedAt = `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
  const input = {
    id: id,
    createdAt,
    updatedAt,
    __typename: MERGED_STUDENT_tableName,
    originalSchoolStudentID: schoolStudentToKeep.id,
    originalStudentID: schoolStudentToKeep.studentID,
    duplicatedSchoolStudentID: duplicatedSchoolStudentObject.id,
    duplicatedSchoolStudentObject: JSON.stringify(
      duplicatedSchoolStudentObject
    ),
    originalStudentObjectBeforeMerge: JSON.stringify(studentToKeep),
    duplicatedStudentID: duplicatedStudentObject.id,
    duplicatedStudentObject: JSON.stringify(duplicatedStudentObject),
  };

  const params = {
    TableName: `${MERGED_STUDENT_tableName}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPU}-${process.env.ENV}`,
    Item: input,
  };

  console.log(params);
  try {
    await ddb.put(params).promise();
    return id;
  } catch (error) {
    console.error(
      `error when creating merged student record, ${JSON.stringify(error)}`,
      error
    );
  }
  return null;
};

/**
 * This method creates all the student data records that will be altered once the program is finished
 * @param {*} ddb dynamo client
 * @param {*} recordsToUpdate
 * @param {*} tableName
 * @param {*} mergedStudentID
 */
const createMergedStudentDataRecordsGenericMethod = async (
  ddb,
  recordsToUpdate,
  tableName,
  mergedStudentID
) => {
  if (recordsToUpdate && recordsToUpdate.length > 0) {
    try {
      for (let i = 0; i < recordsToUpdate.length; i++) {
        const record = recordsToUpdate[i];
        let originalStudentID;
        if (tableName === STUDENT_EALD_PROGRESS_MAP_tableName) {
          originalStudentID = record.studentId;
        } else if (tableName === WAM_STUDENT_LICENCE_HISTORY_tableName) {
          originalStudentID = record.schoolStudentID;
        } else {
          originalStudentID = record.studentID;
        }

        let createdAt = `${dayjs(new Date()).format(
          "YYYY-MM-DDTHH:mm:ss.SSS"
        )}Z`;
        let updatedAt = `${dayjs(new Date()).format(
          "YYYY-MM-DDTHH:mm:ss.SSS"
        )}Z`;
        const input = {
          id: uuidv4(),
          createdAt,
          updatedAt,
          __typename: MERGED_STUDENT_DATA_tableName,
          tableName,
          recordID:
            tableName === TESTRESULT_ANSWERS_GA_tableName
              ? record.testResultAnswerID
              : record.id,
          originalStudentID,
          mergedStudentID,
        };
        const params = {
          TableName: `${MERGED_STUDENT_DATA_tableName}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPU}-${process.env.ENV}`,
          Item: input,
        };
        await ddb.put(params).promise();
      }
    } catch (error) {
      console.error(
        `error when creating merged student data record, ${JSON.stringify(
          error
        )}`
      );
    }
  }
};
/**
 * This method updates all the WAMLicenceHistory records in the school.
 * @param {*} ddb
 * @param {*} studentLicenceHistoryRecords
 * @param {*} schoolStudentToKeepID
 */
const updateWAMStudentLicenceHistory = async (
  ddb,
  studentLicenceHistoryRecords,
  schoolStudentToKeepID
) => {
  if (studentLicenceHistoryRecords && studentLicenceHistoryRecords.length > 0) {
    try {
      for (let i = 0; i < studentLicenceHistoryRecords.length; i++) {
        const record = studentLicenceHistoryRecords[i];
        const input = {
          ...record,
        };
        input.schoolStudentID = schoolStudentToKeepID;
        const params = {
          TableName: `${WAM_STUDENT_LICENCE_HISTORY_tableName}-${process.env.API_BPEDSYSGQL_GRAPHQLAPIIDOUTPU}-${process.env.ENV}`,
          Item: input,
        };

        await ddb.put(params).promise();
      }
    } catch (error) {
      console.error(
        `error when creating WAMStudentLicencyHistory record, ${JSON.stringify(
          error
        )}`
      );
    }
  }
};
/**
 * This calls the generic method to save student data records for each related table set of data.
 * @param {*} ddb
 * @param {*} duplicatedSchoolStudentData
 * @param {*} mergedStudentID
 */
const createMergedStudentDataRecords = async (
  ddb,
  duplicatedSchoolStudentData,
  mergedStudentID
) => {
  await createMergedStudentDataRecordsGenericMethod(
    ddb,
    duplicatedSchoolStudentData.assessments,
    ASSESSMENTS_tableName,
    mergedStudentID
  );
  await createMergedStudentDataRecordsGenericMethod(
    ddb,
    duplicatedSchoolStudentData.testResults,
    TESTRESULT_tableName,
    mergedStudentID
  );
  await createMergedStudentDataRecordsGenericMethod(
    ddb,
    duplicatedSchoolStudentData.testResultsLearningAreas,
    TESTRESULT_LEARNING_AREA_tableName,
    mergedStudentID
  );
  await createMergedStudentDataRecordsGenericMethod(
    ddb,
    duplicatedSchoolStudentData.testResultsAnswersGA,
    TESTRESULT_ANSWERS_GA_tableName,
    mergedStudentID
  );
  await createMergedStudentDataRecordsGenericMethod(
    ddb,
    duplicatedSchoolStudentData.studentLessonPlans,
    STUDENT_LESSON_PLANS_tableName,
    mergedStudentID
  );
  await createMergedStudentDataRecordsGenericMethod(
    ddb,
    duplicatedSchoolStudentData.studentData,
    STUDENT_DATA_tableName,
    mergedStudentID
  );
  await createMergedStudentDataRecordsGenericMethod(
    ddb,
    duplicatedSchoolStudentData.studentClassrooms,
    STUDENT_CLASSROOMS_tableName,
    mergedStudentID
  );
  await createMergedStudentDataRecordsGenericMethod(
    ddb,
    duplicatedSchoolStudentData.studentEALDProgressMaps,
    STUDENT_EALD_PROGRESS_MAP_tableName,
    mergedStudentID
  );
};

const deleteSchoolStudentRecord = async (
  schoolStudentID,
  previousDuplicatedSchoolStudentRecords,
  schoolStudentToKeepID
) => {
  console.log(
    `previousDuplicatedSchoolStudentRecords ${previousDuplicatedSchoolStudentRecords.length}`
  );
  const schoolStudentIDsToDelete =
    previousDuplicatedSchoolStudentRecords.filter(
      (schoolStudent) => schoolStudent.id !== schoolStudentToKeepID
    );
  console.log(`schoolStudentIDsToDelete ${schoolStudentIDsToDelete.length}`);
  schoolStudentIDsToDelete.push(schoolStudentID);
  console.log(
    `total school students to delete ${schoolStudentIDsToDelete.length}`
  );

  for (let index = 0; index < schoolStudentIDsToDelete.length; index++) {
    const schoolStudentID = schoolStudentIDsToDelete[index];
    if (schoolStudentID && schoolStudentID !== "") {
      try {
        const input = {
          id: schoolStudentID,
        };
        const result = await request({
          query: deleteSchoolStudent,
          variables: { input },
        });
        if (result?.errors) {
          console.error(
            `error when deleting the school student record ${JSON.stringify(
              result.errors
            )}`
          );
        }
      } catch (error) {
        console.error(
          `error when deleting school student record, ${JSON.stringify(error)}`,
          error
        );
      }
    } else {
      console.error(
        "School student was not deleted, becuase the id received is null."
      );
    }
  }
};

const deleteStudentRecord = async (studentID) => {
  if (studentID && studentID !== "") {
    try {
      const input = {
        id: studentID,
      };
      const result = await request({
        query: deleteStudent,
        variables: { input },
      });

      if (result?.errors) {
        console.error(
          `error when deleting the student record ${JSON.stringify(
            result.errors
          )}`
        );
      }
    } catch (error) {
      console.error(
        `error when deleting school student record, ${JSON.stringify(error)}`,
        error
      );
    }
  } else {
    console.error("Student was not deleted, becuase the id received is null.");
  }
};

const deleteUserRecord = async (studentEmail) => {
  if (studentEmail && studentEmail !== "") {
    try {
      const input = {
        email: studentEmail,
      };
      const result = await request({
        query: deleteUser,
        variables: { input },
      });
      if (result?.errors) {
        console.error(
          `error when deleting the user record ${JSON.stringify(result.errors)}`
        );
      }
    } catch (error) {
      console.error(
        `error when deleting user record, ${JSON.stringify(error)}`,
        error
      );
    }
  } else {
    console.error("User was not deleted, becuase the email received is null.");
  }
};

const deleteCognitoUser = async (username, cognitoIdentityServiceProvider) => {
  const params = {
    UserPoolId: process.env.USERPOOL,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminDeleteUser(params)
      .promise();
    console.log(`Finished deleting cognito user ${JSON.stringify(result)}`);
  } catch (err) {
    console.error("error deleting user", params, err);
  }
};

const updateStudentRecord = async (
  mergedData,
  student,
  schoolStudentToKeep
) => {
  try {
    const input = {
      birthDate: mergedData.birthDate,
      gender: mergedData.gender,
      firstName: mergedData.firstName,
      lastName: mergedData.lastName,
      yearLevelID: student.yearLevelID,
      id: student.id,
    };

    if (
      schoolStudentToKeep &&
      schoolStudentToKeep.schoolYear === new Date().getFullYear()
    ) {
      input.yearLevelID = mergedData.yearLevelID;
    }

    const result = await request({
      query: updateStudent,
      variables: { input },
    });
    if (result?.errors) {
      console.error(
        `error when updating student records ${JSON.stringify(result.errors)}`
      );
    }
  } catch (error) {
    console.error("error when updating student record", error);
  }
};

const updateSchoolStudentRecord = async (mergedData, schoolStudent) => {
  try {
    const input = {
      firstName: mergedData.firstName,
      lastName: mergedData.lastName,
      yearLevelID: mergedData.yearLevelID,
      id: schoolStudent.id,
      schoolID: schoolStudent.schoolID,
      studentID: schoolStudent.studentID,
      schoolYear: schoolStudent.schoolYear,
    };

    const result = await request({
      query: udpateSchoolStudent,
      variables: { input },
    });
    if (result?.errors) {
      console.error(
        `error when updating school student records ${JSON.stringify(
          result.errors
        )}`
      );
    }
  } catch (error) {
    console.error("error when updating school student record", error);
  }
};

const updateSchoolStudentsInPreviousYearsForStudentToDelete = async (
  mergedData,
  studentID,
  studentIDToKeep
) => {
  try {
    const schoolStudentRecords = await fetchAllNextTokenData(
      "getStudentSchools",
      getSchoolStudentsByStudentID,
      {
        studentID,
      }
    );

    console.log(schoolStudentRecords?.length);

    for (let index = 0; index < schoolStudentRecords.length; index++) {
      const schoolStudent = schoolStudentRecords[index];
      const input = {
        firstName: mergedData.firstName,
        lastName: mergedData.lastName,
        yearLevelID: schoolStudent.yearLevelID,
        id: schoolStudent.id,
        schoolID: schoolStudent.schoolID,
        studentID: studentIDToKeep,
        schoolYear: schoolStudent.schoolYear,
      };

      const result = await request({
        query: udpateSchoolStudent,
        variables: { input },
      });

      console.log(
        `Updating school student ${schoolStudent.id} - studentID: ${studentIDToKeep} - result: ${JSON.stringify(result)}`
      );
    }
  } catch (error) {
    console.error(
      `There was an issue while updating the school student records. ${error}`
    );
  }
};

module.exports = {
  getStudentSetOfData,
  findStudentToKeptInTheDB,
  updateDuplicatedRecordsRelatedToStudent,
  createMergedStudentRecord,
  deleteSchoolStudentRecord,
  deleteStudentRecord,
  deleteUserRecord,
  deleteCognitoUser,
  getSchoolStudentByID,
  getStudentByID,
  getUserData,
  getWAMLicenceHistory,
  createMergedStudentDataRecords,
  updateWAMStudentLicenceHistory,
  updateSchoolStudentRecord,
  updateStudentRecord,
  createMergedStudentDataRecordsGenericMethod,
  updateSchoolStudentsInPreviousYearsForStudentToDelete,
};
