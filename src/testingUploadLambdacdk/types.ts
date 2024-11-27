import z from "zod";
import * as utils from "./utils";

// Misc

export type UnwrappingOptionalKey<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Input

export const CategoryTwoTestResultRowSchema = z.object({
  school_name: z.string(),
  school_id: z.string(),
  user_id: z.string().optional(),
  student_id: z.string().optional(),
  student_number: z.string().optional(),
  name: z.string(),
  birth_date: z.string().optional(),
  year_level: z.string(),
  test_type: z.string(),
  sub_test_type: z.string().optional(),
  test_short_name: z.string().optional(),
  test_name: z.string(),
  test_learning_area: z.string(),
  test_date: z.string(),
  display_date: z.string(),
  test_segment_week: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : utils.tryParseInt(val, 10))),
  test_segment_term: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : utils.tryParseInt(val, 10))),
  test_calendar_year: z.string().transform((val) => utils.tryParseInt(val, 10)),
  score_raw: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : utils.tryParseFloat(val))),
  score_scale: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : utils.tryParseFloat(val))),
  score_percentile: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : utils.tryParseFloat(val))),
  score_percentage: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : utils.tryParseFloat(val))),
  score_stanine: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : utils.tryParseFloat(val))),
  score_total: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : utils.tryParseFloat(val))),
});

export const CategoryOneTestResultRowSchema = CategoryTwoTestResultRowSchema.extend({
  question_position: z.string().transform((val) => utils.tryParseInt(val, 10)),
  response_correct: z.string().transform((val) => {
    if (val === "TRUE") {
      return true;
    } else if (val === "FALSE") {
      return false;
    }
    throw new Error(`Invalid value: ${val}, expected 'TRUE' or 'FALSE'`);
  }),
  question_id: z.string(),
  question_skill_code: z.string(),
});

export const TestResultRowSchema = z.union([CategoryOneTestResultRowSchema, CategoryTwoTestResultRowSchema]);
export type CategoryOneTestResultRow = z.infer<typeof CategoryOneTestResultRowSchema>;
export type CategoryTwoTestResultRow = z.infer<typeof CategoryTwoTestResultRowSchema>;
export type TestResultRow = z.infer<typeof TestResultRowSchema>;

// DynamoDB Items

export interface TestItem {
  id: string;
  __typename: "Test";
  dataType: "test";
  schoolID: string;
  shortName?: string;
  testName: string;
  nationalMean?: number;
  testYearLevelId: string;
  testUnitID: string;
  totalMarks?: number;
  typeID: string;
  subTestTypeID: string | undefined;
  year: number;
  thresholdScaledBottom?: number;
  thresholdScaledTop?: number;
  thresholdScoreBottom?: number;
  thresholdScoreTop?: number;
  thresholdStanineBottom?: number;
  thresholdStanineTop?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestUploadItem {
  id: string;
  __typename: "TestUpload";
  testDate: string;
  testID: string;
  typeID: string;
  yearLevelID: string;
  schoolID: string;
  schoolYear: number;
  "schoolYear#testID#testDate": string;
  "schoolYear#typeID": string;
  "schoolYear#yearLevelID": string;
  "schoolYear#yearLevelID#typeID": string;
  creatorUserID: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestResultItem {
  id: string;
  __typename: "TestResult";
  completedDate: string;
  testDate: string;
  testID: string;
  studentID: string;
  "studentID#testDate": string;
  typeID: string;
  yearLevelID: string;
  schoolYear: number;
  schoolID: string;
  testUploadID: string;
  score: number | undefined;
  scale: number | undefined;
  stanine: number | undefined;
  percentile: number | undefined;
  percentage: number | undefined;
  nationalBand: number | undefined;
  minStandard: number | undefined;
  proficiency: "";
  level: number | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface TestResultLearningAreaItem {
  id: string;
  __typename: "TestResultLearningArea";
  testResultID: string;
  studentID: string;
  learningAreaID: string;
  "learningAreaID#schoolYear": string;
  "learningAreaID#typeID#schoolYear": string;
  "yearLevelID#learningAreaID#schoolYear": string;
  "yearLevelID#learningAreaID#typeID#schoolYear": string;
  typeID: string;
  schoolYear: number;
  yearLevelID: string;
  schoolID: string;
  testDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestResultAnswersItem {
  id: string;
  __typename: "TestResultAnswers";
  testQuestionID: string;
  testResultID: string;
  proficiency: 0 | 1;
  createdAt: string;
  updatedAt: string;
}

export interface TestResultAnswersGaItem {
  testResultAnswerID: string;
  testUploadID: string;
  testResultID: string;
  studentID: string;
  acCode: string;
  proficiency: 0 | 1;
  createdAt: string;
  updatedAt: string;
}

interface BaseTestQuestionItem {
  id: string;
  acCodeID: string;
  testID: string;
  correctAnswer: "NA";
  answerType: "CORRECT/INCORRECT";
  __typename: "TestQuestion";
  difficulty: number;
  expectedMean: number;
  maxScore: number;
  nationalMean: number;
  createdAt: string;
  updatedAt: string;
}

interface StandardTestQuestionItem extends BaseTestQuestionItem {
  questionNo: number;
}

interface AdaptiveTestQuestionItem extends BaseTestQuestionItem {
  questionNo: 0;
  itemId: string;
}

export type TestQuestionItem = StandardTestQuestionItem | AdaptiveTestQuestionItem;

export interface ProcessedData {
  readonly numberOfProcessedResults: number;
  readonly addTestItems: TestItem[];
  readonly testUploadItems: TestUploadItem[];
  readonly testResultItems: TestResultItem[];
  readonly testResultLearningAreaItems: TestResultLearningAreaItem[];
  readonly testResultAnswersItems: TestResultAnswersItem[];
  readonly testResultAnswersGaItems: TestResultAnswersGaItem[];
  readonly testQuestions: TestQuestionItem[];
  readonly failedStudents: FailedStudent[];
}

export interface FailedStudent {
  readonly name: string;
  readonly studentId?: string;
  readonly userId?: string;
  readonly reason: string;
}
