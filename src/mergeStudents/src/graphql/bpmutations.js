"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.updateSchoolStudent =
  exports.updateAssessment =
  exports.updateTestResult =
  exports.updateTestResultLearningArea =
  exports.updateTestResultAnswersGA =
  exports.updateTeacherLessonPlan =
  exports.updateStudentData =
  exports.updateClassroomStudent =
  exports.updateStudentEALDProgressMap =
  exports.deleteStudent =
  exports.deleteSchoolStudent =
  exports.createMergedStudent =
  exports.createMergedStudentData =
  exports.deleteUser =
  exports.updateWAMStudentLicenceHistory =
  exports.updateSchoolStudent =
  exports.updateStudent =
  exports.deleteClassroomStudent =
    void 0;
const updateSchoolStudent =
  /* GraphQL */
  `
    mutation UpdateSchoolStudent(
      $input: UpdateSchoolStudentInput!
      $condition: ModelSchoolStudentConditionInput
    ) {
      updateSchoolStudent(input: $input, condition: $condition) {
        id
      }
    }
  `;
exports.updateSchoolStudent = updateSchoolStudent;

const updateAssessment =
  /* GraphQL */
  `
    mutation UpdateSchoolStudent(
      $input: UpdateAssessmentInput!
      $condition: ModelAssessmentConditionInput
    ) {
      updateAssessment(input: $input, condition: $condition) {
        id
      }
    }
  `;
exports.updateAssessment = updateAssessment;

const updateTestResult =
  /* GraphQL */
  `
    mutation MyMutation(
      $condition: ModelTestResultConditionInput
      $input: UpdateTestResultInput!
    ) {
      updateTestResult(condition: $condition, input: $input) {
        id
      }
    }
  `;
exports.updateTestResult = updateTestResult;

const updateTestResultLearningArea =
  /* GraphQL */
  `
    mutation MyMutation(
      $input: UpdateTestResultLearningAreaInput!
      $condition: ModelTestResultLearningAreaConditionInput
    ) {
      updateTestResultLearningArea(input: $input, condition: $condition) {
        id
      }
    }
  `;
exports.updateTestResultLearningArea = updateTestResultLearningArea;

const updateTestResultAnswersGA =
  /* GraphQL */
  `
    mutation MyMutation(
      $condition: ModelTestResultAnswersGAConditionInput
      $input: UpdateTestResultAnswersGAInput!
    ) {
      updateTestResultAnswersGA(input: $input, condition: $condition) {
        testResultAnswerID
      }
    }
  `;
exports.updateTestResultAnswersGA = updateTestResultAnswersGA;

const updateTeacherLessonPlan =
  /* GraphQL */
  `
    mutation MyMutation(
      $condition: ModelTeacherLessonPlanConditionInput
      $input: UpdateTeacherLessonPlanInput!
    ) {
      updateTeacherLessonPlan(condition: $condition, input: $input) {
        id
      }
    }
  `;
exports.updateTeacherLessonPlan = updateTeacherLessonPlan;

const updateStudentData =
  /* GraphQL */
  `
    mutation MyMutation(
      $condition: ModelStudentDataConditionInput
      $input: UpdateStudentDataInput!
    ) {
      updateStudentData(condition: $condition, input: $input) {
        id
      }
    }
  `;
exports.updateStudentData = updateStudentData;

const updateClassroomStudent =
  /* GraphQL */
  `
    mutation MyMutation(
      $input: UpdateClassroomStudentInput!
      $condition: ModelClassroomStudentConditionInput
    ) {
      updateClassroomStudent(input: $input, condition: $condition) {
        id
      }
    }
  `;
exports.updateClassroomStudent = updateClassroomStudent;
const updateStudentEALDProgressMap =
  /* GraphQL */
  `
    mutation MyMutation(
      $condition: ModelStudentEALDProgressMapConditionInput
      $input: UpdateStudentEALDProgressMapInput!
    ) {
      updateStudentEALDProgressMap(condition: $condition, input: $input) {
        id
      }
    }
  `;
exports.updateStudentEALDProgressMap = updateStudentEALDProgressMap;
const updateWAMStudentLicenceHistory =
  /* GraphQL */
  `
    mutation UpdateWAMStudentLicenceHistory(
      $input: UpdateWAMStudentLicenceHistoryInput!
      $condition: ModelWAMStudentLicenceHistoryConditionInput
    ) {
      updateWAMStudentLicenceHistory(input: $input) {
        id
      }
    }
  `;
exports.updateWAMStudentLicenceHistory = updateWAMStudentLicenceHistory;
const deleteStudent =
  /* GraphQL */
  `
    mutation MyMutation(
      $condition: ModelStudentConditionInput
      $input: DeleteStudentInput!
    ) {
      deleteStudent(condition: $condition, input: $input) {
        id
      }
    }
  `;
exports.deleteStudent = deleteStudent;

const deleteSchoolStudent =
  /* GraphQL */
  `
    mutation MyMutation(
      $condition: ModelSchoolStudentConditionInput
      $input: DeleteSchoolStudentInput!
    ) {
      deleteSchoolStudent(condition: $condition, input: $input) {
        id
      }
    }
  `;
exports.deleteSchoolStudent = deleteSchoolStudent;
const createMergedStudent =
  /* GraphQL */
  `
    mutation CreateMergedStudent($input: CreateMergedStudentInput!) {
      createMergedStudent(input: $input) {
        id
      }
    }
  `;
exports.createMergedStudent = createMergedStudent;

const createMergedStudentData =
  /* GraphQL */
  `
    mutation CreateMergedStudentData($input: CreateMergedStudentDataInput!) {
      createMergedStudentData {
        id
      }
    }
  `;
exports.createMergedStudentData = createMergedStudentData;
const deleteUser =
  /* GraphQL */
  `
    mutation DeleteUser(
      $condition: ModelUserConditionInput
      $input: DeleteUserInput!
    ) {
      deleteUser(condition: $condition, input: $input) {
        email
      }
    }
  `;
exports.deleteUser = deleteUser;
const updateStudent =
  /* GraphQL */
  `
    mutation UpdateStudent(
      $input: UpdateStudentInput!
      $condition: ModelStudentConditionInput
    ) {
      updateStudent(condition: $condition, input: $input) {
        id
      }
    }
  `;
exports.updateStudent = updateStudent;

const udpateSchoolStudent =
  /* GraphQL */
  `
    mutation UpdateSchoolStudent(
      $input: UpdateSchoolStudentInput!
      $condition: ModelSchoolStudentConditionInput
    ) {
      updateSchoolStudent(input: $input, condition: $condition) {
        id
      }
    }
  `;
exports.udpateSchoolStudent = udpateSchoolStudent;

const deleteClassroomStudent =
  /* GraphQL */
  `
    mutation DeleteClassroomStudent(
      $input: DeleteClassroomStudentInput!
      $condition: ModelClassroomStudentConditionInput
    ) {
      deleteClassroomStudent(input: $input, condition: $condition) {
        id
      }
    }
  `;
exports.deleteClassroomStudent = deleteClassroomStudent;
