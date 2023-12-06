const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
// Get the correct format of stuents birthdate in dynamo.
function getDate(dob) {
  if (!dob) return null;
  let month = "" + (dob.getMonth() + 1);
  if (month.length === 1) {
    month = "0" + month;
  }
  let day = "" + dob.getDate();
  if (day.length === 1) {
    day = "0" + day;
  }
  return dob.getFullYear() + "-" + month + "-" + day;
}

// Table names constants required for transactions
const ASSESSMENTS_tableName = "Assessment";
const TESTRESULT_tableName = "TestResult";
const TESTRESULT_LEARNING_AREA_tableName = "TestResultLearningArea";
const TESTRESULT_ANSWERS_GA_tableName = "TestResultAnswersGA";
const STUDENT_LESSON_PLANS_tableName = "TeacherLessonPlan";
const STUDENT_DATA_tableName = "StudentData";
const STUDENT_CLASSROOMS_tableName = "ClassroomStudent";
const STUDENT_EALD_PROGRESS_MAP_tableName = "StudentEALDProgressMap";
const MERGED_STUDENT_tableName = "MergedStudent";
const MERGED_STUDENT_DATA_tableName = "MergedStudentData";
const WAM_STUDENT_LICENCE_HISTORY_tableName = "WAMStudentLicenceHistory";

// It returns current date in expected format by Daynamo
function getTimeStamp() {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  return (
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );
}

function getDate(dob) {
  if (!dob) return null;
  let month = "" + (dob.getMonth() + 1);
  if (month.length === 1) {
    month = "0" + month;
  }
  let day = "" + dob.getDate();
  if (day.length === 1) {
    day = "0" + day;
  }
  return dob.getFullYear() + "-" + month + "-" + day;
}
// Convert any date into the format expected by dynamo.
const convertBirthDateToTheRightFormat = (dob) => {
  if (!dob) {
    return null;
  }
  let finalDate;
  if (typeof dob === "string") {
    finalDate = new Date(dob);
  } else {
    finalDate = dob;
  }

  try {
    return getDate(finalDate);
  } catch (error) {
    console.log(
      `it was not possible to cast a date, the received value was ${dob}${error}`
    );
  }
};

module.exports = {
  ASSESSMENTS_tableName,
  TESTRESULT_tableName,
  TESTRESULT_LEARNING_AREA_tableName,
  TESTRESULT_ANSWERS_GA_tableName,
  STUDENT_LESSON_PLANS_tableName,
  STUDENT_DATA_tableName,
  STUDENT_CLASSROOMS_tableName,
  STUDENT_EALD_PROGRESS_MAP_tableName,
  MERGED_STUDENT_tableName,
  MERGED_STUDENT_DATA_tableName,
  WAM_STUDENT_LICENCE_HISTORY_tableName,
  convertBirthDateToTheRightFormat,
  getTimeStamp,
};
