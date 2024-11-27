import { v4 as uuidv4 } from "uuid";
import { logger } from "./logger";
import {
  getLearningAreaAndSkillCodeIds,
  getLearningAreaByName,
  getTestIdFromTestName,
  getTestSubtypeIdFromName,
  getTestTypeIdFromName,
  getTestTypeIdFromTestId,
  getTestUnitIdFromName,
  getUserIdByEmail,
  getYearLevelId,
} from "./lookupCache";
import { addLearningAreaResult, handleTestResult, handleTestUpload } from "./mapping";
import {
  CategoryOneTestResultRow,
  FailedStudent,
  ProcessedData,
  TestItem,
  TestQuestionItem,
  TestResultAnswersGaItem,
  TestResultAnswersItem,
  TestResultItem,
  TestResultLearningAreaItem,
  TestResultRow,
  TestUploadItem,
  UnwrappingOptionalKey,
} from "./types";

const hasStudentId = (v: TestResultRow): v is UnwrappingOptionalKey<TestResultRow, "student_id"> =>
  v.student_id !== undefined;

/**
 * Type guard function to check if a `TestResultRow` is for a Category One test.
 *
 * @param {UnwrappingOptionalKey<TestResultRow, "student_id">} v A `TestResultRow` with a non-null "student_id" value.
 * @returns {v is UnwrappingOptionalKey<CategoryOneTestResultRow, "student_id">}
 */
const isCategoryOne = (
  v: UnwrappingOptionalKey<TestResultRow, "student_id">
): v is UnwrappingOptionalKey<CategoryOneTestResultRow, "student_id"> => {
  return ["question_position", "response_correct", "question_id", "question_skill_code"].every((k) => k in v);
};

export const processStudentTests = async (csvData: TestResultRow[]): Promise<ProcessedData> => {
  let numberOfProcessedResults = 0;
  const addTestItems: TestItem[] = [];
  const testUploadItems: TestUploadItem[] = [];
  const testResultItems: TestResultItem[] = [];
  const testResultLearningAreaItems: TestResultLearningAreaItem[] = [];
  const testResultAnswersItems: TestResultAnswersItem[] = [];
  const testResultAnswersGaItems: TestResultAnswersGaItem[] = [];
  const testQuestions: TestQuestionItem[] = [];


  const failedStudents: FailedStudent[] = [];
  const uniqueTestUploads = new Map<string, string>();
  const uniqueTestResults = new Map<string, string>();

  const creatorUserID = await getUserIdByEmail("admin@bestperformance.com.au");
  if (!creatorUserID) {
    throw new Error("Failed to fetch ID for admin user.");
  }

  for (const row of csvData) {
    if (!hasStudentId(row)) {
      failedStudents.push({
        name: row.name,
        reason: "The student was not name matched",
      });
      continue;
    }

    const yearLevelID = await getYearLevelId(row.year_level);
    if (!yearLevelID) {
      failedStudents.push({
        name: row.name,
        studentId: row.student_id,
        userId: row.user_id,
        reason: `Failed to look up ID for year level: '${row.year_level}'`,
      });
      continue;
    }

    const learningAreaIds = await getLearningAreaByName(row.test_learning_area)
        if (!learningAreaIds) {
          failedStudents.push({
            name: row.name,
            studentId: row.student_id,
            userId: row.user_id,
            reason: `Failed to look up learning area: '${row.test_learning_area}'`,
          });
          continue;
        }

    let testID: string | null = null;
    let testTypeID: string | null = null;

    const existingTestID = await getTestIdFromTestName(row.test_name);

    if (existingTestID) {
      testID = existingTestID;
      const existingTestTypeID = await getTestTypeIdFromTestId(testID);

      if (!existingTestTypeID) {
        failedStudents.push({
          name: row.name,
          studentId: row.student_id,
          userId: row.user_id,
          reason: `Failed to look up ID for test type from test ID: '${testID}'`,
        });
        continue;
      }

      testTypeID = existingTestTypeID;
    } else {
      // Create a new test if it doesn't exist
      const existingTestUnitID = await getTestUnitIdFromName("Raw Score");
      const existingTestTypeID = await getTestTypeIdFromName(row.test_type);
      const existingSubTypeID = await getTestSubtypeIdFromName(row.sub_test_type);

      if (!existingTestUnitID || !existingTestTypeID) {
        failedStudents.push({
          name: row.name,
          studentId: row.student_id,
          userId: row.user_id,
          reason: `Failed to look up ID for test type: '${row.test_type}'`,
        });
        continue;
      }

      testID = uuidv4();
      testTypeID = existingTestTypeID;
      const subTypeID = existingSubTypeID;

      const now = new Date().toISOString();
      addTestItems.push({
        id: testID,
        __typename: "Test",
        dataType: "test",
        schoolID: row.school_id,
        subTestTypeID: subTypeID ?? undefined,
        testUnitID: existingTestUnitID,
        testName: row.test_name,
        testYearLevelId: yearLevelID,
        typeID: testTypeID,
        year: row.test_calendar_year,
        createdAt: now,
        updatedAt: now,
      });
    }

    const testResultID = uuidv4();
    const testUploadKey = `${row.test_calendar_year}#${testID}#${row.test_date}`;
    const testResultKey = `${row.student_id}#${testTypeID}#${row.test_date}`;

    try {
      if (isCategoryOne(row)) {
        const skillCodeAndLearningAreaIds = await getLearningAreaAndSkillCodeIds(row.question_skill_code);
        if (!skillCodeAndLearningAreaIds) {
          failedStudents.push({
            name: row.name,
            studentId: row.student_id,
            userId: row.user_id,
            reason: `Failed to look up skill code: '${row.question_skill_code}'`,
          });
          continue;
        }

        const { learningArea: learningAreaId } = skillCodeAndLearningAreaIds;

        handleTestResult(
          testResultKey,
          testUploadKey,
          testResultID,
          testID,
          testTypeID,
          yearLevelID,
          uniqueTestUploads,
          row,
          uniqueTestResults,
          testResultItems
        );
        addLearningAreaResult(testResultLearningAreaItems, testResultID, testTypeID, row, learningAreaId, yearLevelID);

      } else {

        const learningAreaId  = learningAreaIds;
        handleTestUpload(
          testUploadKey,
          testID,
          testTypeID,
          yearLevelID,
          creatorUserID,
          row,
          uniqueTestUploads,
          testUploadItems
        );
        handleTestResult(
          testResultKey,
          testUploadKey,
          testResultID,
          testID,
          testTypeID,
          yearLevelID,
          uniqueTestUploads,
          row,
          uniqueTestResults,
          testResultItems
        );
        addLearningAreaResult(
          testResultLearningAreaItems,
          testResultID,
          testTypeID,
          row,
          learningAreaId,
          yearLevelID
        );
      }

      numberOfProcessedResults += 1;
    } catch (error) {
      logger.error(`Failed to upload results for '${row.name}' - '${row.test_name}' (${row.display_date})`);
      failedStudents.push({
        name: row.name,
        studentId: row.student_id,
        userId: row.user_id,
        reason: `Unknown error: ${error}`,
      });
    }
  }

  if (failedStudents.length > 0) {
    logger.error("Some students failed to upload", failedStudents);
  }

  return {
    numberOfProcessedResults,
    addTestItems,
    testUploadItems,
    testResultItems,
    testResultLearningAreaItems,
    testResultAnswersItems,
    testResultAnswersGaItems,
    testQuestions,
    failedStudents
  };
};
