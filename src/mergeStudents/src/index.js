const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const event = require("./event.json");
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const ddb = new AWS.DynamoDB.DocumentClient();
const { getWAMStudentLicenceHistoryUsingDynamo, fetchAllNextTokenData } = require("./api");

const { validateEvent } = require("./validations");

const { CognitoIdentityServiceProvider } = require("aws-sdk");
const {
  getSchoolStudentByID,
  getStudentByID,
  findStudentToKeptInTheDB,
  createMergedStudentRecord,
  createMergedStudentDataRecords,
  updateDuplicatedRecordsRelatedToStudent,
  deleteSchoolStudentRecord,
  deleteStudentRecord,
  deleteCognitoUser,
  getUserData,
  getStudentSetOfData,
  deleteUserRecord,
  updateWAMStudentLicenceHistory,
  updateStudentRecord,
  updateSchoolStudentRecordFromPreviousYears,
  createMergedStudentDataRecordsGenericMethod,
  updateSchoolStudentsInPreviousYearsForStudentToDelete,
} = require("./controller");
const {
  convertBirthDateToTheRightFormat,
  WAM_STUDENT_LICENCE_HISTORY_tableName,
} = require("./utils");
const { getSchoolStudentsByStudentID } = require("./graphql/bpqueries");

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

const getError = (message) => {
  console.error(message);
  return {
    statusCode: 400,
    body: JSON.stringify(message),
  };
};


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  console.log("Merging students process started.");
  const inputData = { ...event };
  const didItPassValidations = validateEvent(inputData);
  if (didItPassValidations) {
    inputData.mergedData.birthDate = convertBirthDateToTheRightFormat(
      inputData.mergedData.birthDate
    );
    const schoolStudent1 = await getSchoolStudentByID(
      inputData.schoolStudentID1
    );
    const schoolStudent2 = await getSchoolStudentByID(
      inputData.schoolStudentID2
    );

    if (!schoolStudent1) {
      return getError("Unable to find schoolStudent 1");
    }

    if (!schoolStudent2) {
      return getError("Unable to find schoolStudent 2");
    }
    const student1 = await getStudentByID(schoolStudent1.studentID);
    const student2 = await getStudentByID(schoolStudent2.studentID);
    if (!student1) {
      return getError("Unable to find student 1");
    }

    if (!student2) {
      return getError("Unable to find student 2");
    }
    const schoolStudent1Data = await getStudentSetOfData(schoolStudent1);
    const schoolStudent2Data = await getStudentSetOfData(schoolStudent2);

    if (!schoolStudent1Data) {
      return getError("Unable to find school student 1 data");
    }

    if (!schoolStudent2Data) {
      return getError("Unable to find school student 2 data");
    }
    const {
      schoolStudentToKeep,
      studentToKeep,
      schoolStudentToKeepData,
      duplicatedSchoolStudent,
      duplicatedStudent,
      duplicatedSchoolStudentData,
    } = findStudentToKeptInTheDB(
      schoolStudent1Data,
      schoolStudent2Data,
      schoolStudent1,
      student1,
      schoolStudent2,
      student2
    );

    if (
      !schoolStudentToKeep ||
      !studentToKeep ||
      !duplicatedSchoolStudent ||
      !duplicatedStudent
    ) {
      return getError(
        "Unable to define which student record remains in the database."
      );
    }

    const user = await getUserData(duplicatedSchoolStudent.userId);
    console.log(user);

    //TODO remove later when lambda is stable
    console.log({
      assessments: schoolStudent1Data.assessments.length,
      testResults: schoolStudent1Data.testResults.length,
      testResultLearningAreas:
        schoolStudent1Data.testResultsLearningAreas.length,
      answersGA: schoolStudent1Data.testResultsAnswersGA.length,
      lessonPlans: schoolStudent1Data.studentLessonPlans.length,
      studentData: schoolStudent1Data.studentData.length,
      studentClassroom: schoolStudent1Data.studentClassrooms.length,
      studentEALD: schoolStudent1Data.studentEALDProgressMaps.length,
      total: schoolStudent1Data.totalRecordsRelatedToTheStudent,
    });

    //TODO remove later when lambda is stable
    console.log({
      assessments: schoolStudent2Data.assessments.length,
      testResults: schoolStudent2Data.testResults.length,
      testResultLearningAreas:
        schoolStudent2Data.testResultsLearningAreas.length,
      answersGA: schoolStudent2Data.testResultsAnswersGA.length,
      lessonPlans: schoolStudent2Data.studentLessonPlans.length,
      studentData: schoolStudent2Data.studentData.length,
      studentClassroom: schoolStudent2Data.studentClassrooms.length,
      studentEALD: schoolStudent2Data.studentEALDProgressMaps.length,
      total: schoolStudent2Data.totalRecordsRelatedToTheStudent,
    });

    //TODO remove later when lambda is stable
    console.log("schoolStudentToKeepID", schoolStudentToKeep.id);
    console.log("studentToKeepID", studentToKeep.id);
    console.log("duplicatedSchoolStudentID", duplicatedSchoolStudent.id);
    console.log("duplicatedStudentID", duplicatedStudent.id);

    const mergedStudentID = await createMergedStudentRecord(
      ddb,
      schoolStudentToKeep,
      duplicatedSchoolStudent,
      duplicatedStudent,
      studentToKeep
    );

    console.log("creating merged student record");

    if (mergedStudentID && mergedStudentID !== "") {
      if (studentToKeep.id !== duplicatedStudent.id) {
        console.log("creating merged student data records");
        await createMergedStudentDataRecords(
          ddb,
          duplicatedSchoolStudentData,
          mergedStudentID
        );
        console.log("updating duplicated student records");
        // // start with the student ID update.
        await updateDuplicatedRecordsRelatedToStudent(
          studentToKeep.id,
          duplicatedSchoolStudentData,
          schoolStudentToKeepData.studentClassrooms
        );
      }

      // delete duplicated records process
      // Only if school ids are the same for the students, the duplicated school student record is deleted.
      if (duplicatedSchoolStudent.schoolID === schoolStudentToKeep.schoolID) {
        console.log("getting school student licence history");
        const studentLicenceHistory =
          await getWAMStudentLicenceHistoryUsingDynamo(
            ddb,
            duplicatedSchoolStudent.id
          );
        // If there's any wam licence history request, the school student ID is udpated with the school student id record to keep.
        if (studentLicenceHistory && studentLicenceHistory.length > 0) {
          await createMergedStudentDataRecordsGenericMethod(
            ddb,
            studentLicenceHistory,
            WAM_STUDENT_LICENCE_HISTORY_tableName,
            mergedStudentID
          );
          console.log("updating school student licence history for WAM");
          await updateWAMStudentLicenceHistory(
            ddb,
            studentLicenceHistory,
            schoolStudentToKeep.id
          );
        }
        // Delete the school student record that is duplicated.
        console.log("deleting school student record");
        await deleteSchoolStudentRecord(
          duplicatedSchoolStudent.id,
          duplicatedSchoolStudentData.previousSchoolStudents,
          schoolStudentToKeep.id
        );
      }

      // getting previous year school students from the studentToKeepID to update their data.
      const schoolStudentsRecordsFromPreviousYears = await fetchAllNextTokenData(
        "getStudentSchools",
        getSchoolStudentsByStudentID,
        {
          studentID: studentToKeep.id,
        }
      );

      console.log("deleting student record");
      if (studentToKeep.id !== duplicatedStudent.id) {
        // previous to delete a student record, this goes and find any school student records that are attached to that student ID and updates them with the studentID to keep.
        await updateSchoolStudentsInPreviousYearsForStudentToDelete(
          inputData.mergedData,
          duplicatedStudent.id,
          studentToKeep.id
        );

        // Delete the student record.
        await deleteStudentRecord(duplicatedStudent.id);
      }

      if (user) {
        console.log("deleting user record");
        await deleteUserRecord(user?.email);
        console.log("deleting cognito record");
        await deleteCognitoUser(
          duplicatedSchoolStudent.userId,
          cognitoIdentityServiceProvider
        );
      }

      // updating new data in school student and student record
      await updateStudentRecord(
        inputData.mergedData,
        studentToKeep,
        schoolStudentToKeep
      );
      await updateSchoolStudentRecordFromPreviousYears(
        inputData.mergedData,
        schoolStudentsRecordsFromPreviousYears
      );
    } else {
      getError(
        "Unable to create the backup data for the school student and student records."
      );
    }
  }
  console.log("process is finished");
  return {
    statusCode: 200,
    body: JSON.stringify("Merging process has finished"),
  };
};

handler(event);
