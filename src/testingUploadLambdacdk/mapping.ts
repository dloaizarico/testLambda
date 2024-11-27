import { v4 as uuidv4 } from "uuid";
import {
  CategoryOneTestResultRow,
  CategoryTwoTestResultRow,
  TestResultAnswersGaItem,
  TestResultAnswersItem,
  TestResultItem,
  TestResultLearningAreaItem,
  TestUploadItem,
  UnwrappingOptionalKey,
} from "./types";

export const handleTestUpload = (
  key: string,
  testID: string,
  testTypeID: string,
  yearLevelID: string,
  creatorUserID: string,
  row: CategoryTwoTestResultRow,
  uniqueTestUploads: Map<string, string>,
  testUploadItems: TestUploadItem[]
): string => {
  const existingTestUploadId = uniqueTestUploads.get(key);
  if (existingTestUploadId) {
    return existingTestUploadId;
  }

  const now = new Date().toISOString();
  const testUploadID = uuidv4();
  uniqueTestUploads.set(key, testUploadID);
  testUploadItems.push({
    id: testUploadID,
    __typename: "TestUpload",
    testDate: row.test_date,
    testID,
    typeID: testTypeID,
    yearLevelID,
    schoolID: row.school_id,
    schoolYear: row.test_calendar_year,
    "schoolYear#testID#testDate": key,
    "schoolYear#typeID": `${row.test_calendar_year}#${testTypeID}`,
    "schoolYear#yearLevelID": `${row.test_calendar_year}#${yearLevelID}`,
    "schoolYear#yearLevelID#typeID": `${row.test_calendar_year}#${yearLevelID}#${testTypeID}`,
    creatorUserID,
    createdAt: now,
    updatedAt: now,
  });

  return testUploadID;
};

export const handleTestResult = (
  testResultKey: string,
  testUploadKey: string,
  resultID: string,
  testID: string,
  testTypeID: string,
  yearLevelID: string,
  uniqueTestUploads: Map<string, string>,
  row: UnwrappingOptionalKey<CategoryTwoTestResultRow, "student_id">,
  uniqueTestResults: Map<string, string>,
  testResultItems: TestResultItem[]
) => {
  if (uniqueTestResults.has(testResultKey)) {
    return;
  }

  const testUploadID = uniqueTestUploads.get(testUploadKey);
  if (!testUploadID) {
    throw new Error(`Failed to look up test upload ID for key: '${testUploadKey}'`);
  }

  const now = new Date().toISOString();

  uniqueTestResults.set(testResultKey, resultID);
  testResultItems.push({
    id: resultID,
    __typename: "TestResult",
    testID,
    completedDate: row.test_date,
    testDate: row.test_date,
    studentID: row.student_id,
    "studentID#testDate": `${row.student_id}#${row.test_date}`,
    yearLevelID,
    typeID: testTypeID,
    schoolYear: row.test_calendar_year,
    schoolID: row.school_id,
    testUploadID: testUploadID,
    proficiency: "",
    score: row.score_raw,
    scale: row.score_scale,
    stanine: row.score_stanine,
    percentile: row.score_percentile,
    percentage: row.score_percentage,
    nationalBand: undefined,
    minStandard: undefined,
    level: undefined,
    createdAt: now,
    updatedAt: now,
  });
};

export const addLearningAreaResult = (
  testResultLearningAreaItems: TestResultLearningAreaItem[],
  testResultID: string,
  testTypeID: string,
  row: UnwrappingOptionalKey<CategoryTwoTestResultRow, "student_id">,
  learningAreaID: string,
  yearLevelID: string
) => {
  const now = new Date().toISOString();
  testResultLearningAreaItems.push({
    id: uuidv4(),
    __typename: "TestResultLearningArea",
    testResultID,
    studentID: row.student_id,
    learningAreaID,
    "learningAreaID#schoolYear": `${learningAreaID}#${row.test_calendar_year}`,
    "learningAreaID#typeID#schoolYear": `${learningAreaID}#${testTypeID}#${row.test_calendar_year}`,
    "yearLevelID#learningAreaID#schoolYear": `${yearLevelID}#${learningAreaID}#${row.test_calendar_year}`,
    "yearLevelID#learningAreaID#typeID#schoolYear": `${yearLevelID}#${learningAreaID}#${testTypeID}#${row.test_calendar_year}`,
    typeID: testTypeID,
    schoolYear: row.test_calendar_year,
    yearLevelID,
    schoolID: row.school_id,
    testDate: row.test_date,
    createdAt: now,
    updatedAt: now,
  });
};

export const addAnswerItems = (
  answerID: string,
  resultID: string,
  testUploadID: string,
  questionID: string,
  row: UnwrappingOptionalKey<CategoryOneTestResultRow, "student_id">,
  testResultAnswersItems: TestResultAnswersItem[],
  testResultAnswersGaItems: TestResultAnswersGaItem[],
) => {
  const now = new Date().toISOString();
  const proficiency = row.response_correct ? 1 : 0;

  testResultAnswersItems.push({
    id: answerID,
    __typename: "TestResultAnswers",
    testQuestionID: row.question_id,
    testResultID: resultID,
    proficiency,
    createdAt: now,
    updatedAt: now,
  });

  testResultAnswersGaItems.push({
    testResultAnswerID: answerID,
    testResultID: resultID,
    testUploadID,
    studentID: row.student_id,
    acCode: row.question_skill_code,
    proficiency,
    createdAt: now,
    updatedAt: now,
  });
};