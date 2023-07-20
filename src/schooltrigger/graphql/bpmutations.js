"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteSchool = exports.updateSchool = exports.createSchool = exports.createTestResultLearningArea = exports.deleteTestLearningArea = exports.createTestLearningArea = exports.createTestResultAnswers = exports.createTestResult = exports.updateClassroomTeacher = exports.createClassroomStudent = exports.updateClassroomYearLevel = exports.createClassroomYearLevel = exports.deleteClassroomYearLevel = exports.deleteTestResultLearningArea = exports.deleteTestResultAnswers = exports.deleteTestResult = exports.deleteTestUpload = exports.updateTestUpload = exports.createTestUpload = exports.deleteTestQuestion = exports.updateTestQuestion = exports.createTestQuestion = exports.deleteTest = exports.updateTest = exports.createTest = exports.createUser = exports.updateUser = exports.deleteClassroomTeacher = exports.deleteUser = exports.deleteSchoolStudent = exports.deleteStudent = exports.updateStudent = exports.deleteStudentData = exports.updateStudentData = exports.createStudentData = exports.updateSchoolAttributeCategory = exports.createSchoolAttributeCategory = exports.updateSchoolNetworkId = exports.deleteClassroomStudent = exports.updateSchoolStudent = exports.updateSchoolStudentNames = exports.createSchoolStudent = void 0;
const createSchoolStudent =
/* GraphQL */
`
  mutation CreateSchoolStudent(
    $input: CreateSchoolStudentInput!
    $condition: ModelSchoolStudentConditionInput
  ) {
    createSchoolStudent(input: $input, condition: $condition) {
      id
      schoolID
      studentID
      schoolYear
      yearLevelID
      createdAt
      updatedAt
    }
  }
`;
exports.createSchoolStudent = createSchoolStudent;
const updateSchoolStudentNames =
/* GraphQL */
`
  mutation UpdateSchoolStudent(
    $input: UpdateSchoolStudentInput!
    $condition: ModelSchoolStudentConditionInput
  ) {
    updateSchoolStudent(input: $input, condition: $condition) {
      id
      firstName
      lastName
    }
  }
`;
exports.updateSchoolStudentNames = updateSchoolStudentNames;
const updateSchoolStudent =
/* GraphQL */
`
  mutation UpdateSchoolStudent(
    $input: UpdateSchoolStudentInput!
    $condition: ModelSchoolStudentConditionInput
  ) {
    updateSchoolStudent(input: $input, condition: $condition) {
      id
      schoolID
      studentID
      schoolYear
      yearLevelID
      firstName
      lastName
      userId
    }
  }
`;
exports.updateSchoolStudent = updateSchoolStudent;
const deleteClassroomStudent =
/* GraphQL */
`
  mutation DeleteClassroomStudent(
    $input: DeleteClassroomStudentInput!
    $condition: ModelClassroomStudentConditionInput
  ) {
    deleteClassroomStudent(input: $input, condition: $condition) {
      id
      classroomID
      studentID
    }
  }
`;
exports.deleteClassroomStudent = deleteClassroomStudent;
const updateSchoolNetworkId =
/* GraphQL */
`
  mutation UpdateSchool(
    $input: UpdateSchoolInput!
    $condition: ModelSchoolConditionInput
  ) {
    updateSchool(input: $input, condition: $condition) {
      id
      schoolName
      networkID
    }
  }
`;
exports.updateSchoolNetworkId = updateSchoolNetworkId;
const createSchoolAttributeCategory =
/* GraphQL */
`
  mutation CreateSchoolAttributeCategory(
    $input: CreateSchoolAttributeCategoryInput!
    $condition: ModelSchoolAttributeCategoryConditionInput
  ) {
    createSchoolAttributeCategory(input: $input, condition: $condition) {
      id
      schoolID
      categoryName
    }
  }
`;
exports.createSchoolAttributeCategory = createSchoolAttributeCategory;
const updateSchoolAttributeCategory =
/* GraphQL */
`
  mutation UpdateSchoolAttributeCategory(
    $input: UpdateSchoolAttributeCategoryInput!
    $condition: ModelSchoolAttributeCategoryConditionInput
  ) {
    updateSchoolAttributeCategory(input: $input, condition: $condition) {
      id
      schoolID
      categoryName
    }
  }
`;
exports.updateSchoolAttributeCategory = updateSchoolAttributeCategory;
const createStudentData =
/* GraphQL */
`
  mutation CreateStudentData(
    $input: CreateStudentDataInput!
    $condition: ModelStudentDataConditionInput
  ) {
    createStudentData(input: $input, condition: $condition) {
      id
      studentID
      schoolYear
      attributeID
      value
    }
  }
`;
exports.createStudentData = createStudentData;
const updateStudentData =
/* GraphQL */
`
  mutation UpdateStudentData(
    $input: UpdateStudentDataInput!
    $condition: ModelStudentDataConditionInput
  ) {
    updateStudentData(input: $input, condition: $condition) {
      id
      studentID
      schoolYear
      attributeID
      value
    }
  }
`;
exports.updateStudentData = updateStudentData;
const deleteStudentData =
/* GraphQL */
`
  mutation DeleteStudentData(
    $input: DeleteStudentDataInput!
    $condition: ModelStudentDataConditionInput
  ) {
    deleteStudentData(input: $input, condition: $condition) {
      id
    }
  }
`;
exports.deleteStudentData = deleteStudentData;
const updateStudent =
/* GraphQL */
`
  mutation UpdateStudent(
    $input: UpdateStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    updateStudent(input: $input, condition: $condition) {
      id
    }
  }
`;
exports.updateStudent = updateStudent;
const deleteStudent =
/* GraphQL */
`
  mutation DeleteStudent(
    $input: DeleteStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    deleteStudent(input: $input, condition: $condition) {
      id
      firstName
      lastName
      photo {
        bucket
        region
        key
      }
      classrooms {
        items {
          id
        }
      }
      schoolYears {
        items {
          id
        }
      }
      studentData {
        items {
          id
        }
      }
    }
  }
`;
exports.deleteStudent = deleteStudent;
const deleteSchoolStudent =
/* GraphQL */
`
  mutation DeleteSchoolStudent(
    $input: DeleteSchoolStudentInput!
    $condition: ModelSchoolStudentConditionInput
  ) {
    deleteSchoolStudent(input: $input, condition: $condition) {
      id
      schoolID
      studentID
      schoolYear
      userId
    }
  }
`;
exports.deleteSchoolStudent = deleteSchoolStudent;
const deleteUser =
/* GraphQL */
`
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      userId
      firstName
      lastName
      email
      userGroup
      userType
      enabled
      avatar {
        bucket
        region
        key
      }
      userSchoolID
      lastSignIn
      dbType
      createdAt
      updatedAt
    }
  }
`;
exports.deleteUser = deleteUser;
const deleteClassroomTeacher =
/* GraphQL */
`
  mutation DeleteClassroomTeacher(
    $input: DeleteClassroomTeacherInput!
    $condition: ModelClassroomTeacherConditionInput
  ) {
    deleteClassroomTeacher(input: $input, condition: $condition) {
      id
      classroomID
      email
    }
  }
`;
exports.deleteClassroomTeacher = deleteClassroomTeacher;
const updateUser =
/* GraphQL */
`
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      userId
      firstName
      lastName
      email
      userGroup
      userType
      enabled
      userSchoolID
      lastSignIn
      dbType
    }
  }
`;
exports.updateUser = updateUser;
const createUser =
/* GraphQL */
`
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      userId
      firstName
      lastName
      email
      userGroup
      userType
      enabled
      userSchoolID
      lastSignIn
      dbType
    }
  }
`;
exports.createUser = createUser;
const createTest =
/* GraphQL */
`
  mutation CreateTest(
    $input: CreateTestInput!
    $condition: ModelTestConditionInput
  ) {
    createTest(input: $input, condition: $condition) {
      id
      dataType
      typeID
      testName
      testYearLevelId
      year
      nationalMean
      testUnitID
      yearLevel {
        id
        description
      }
      testType {
        id
        typeName
      }
      testUnit {
        id
        unitName
      }
    }
  }
`;
exports.createTest = createTest;
const updateTest =
/* GraphQL */
`
  mutation UpdateTest(
    $input: UpdateTestInput!
    $condition: ModelTestConditionInput
  ) {
    updateTest(input: $input, condition: $condition) {
      id
      typeID
      testName
      testYearLevelId
      year
      nationalMean
      testUnitID
      yearLevel {
        id
        description
      }
      testType {
        id
        typeName
      }
      testUnit {
        id
        unitName
      }
    }
  }
`;
exports.updateTest = updateTest;
const deleteTest =
/* GraphQL */
`
  mutation DeleteTest(
    $input: DeleteTestInput!
    $condition: ModelTestConditionInput
  ) {
    deleteTest(input: $input, condition: $condition) {
      id
      testName
      questions {
        items {
          id
        }
        nextToken
      }
    }
  }
`;
exports.deleteTest = deleteTest;
const createTestQuestion =
/* GraphQL */
`
  mutation CreateTestQuestion(
    $input: CreateTestQuestionInput!
    $condition: ModelTestQuestionConditionInput
  ) {
    createTestQuestion(input: $input, condition: $condition) {
      id
      testID
      questionNo
      maxScore
      nationalMean
      expectedMean
      correctAnswer
      acCodeID
      difficulty
      answerType
      acCode {
        id
        acCode
        skill
        learningArea {
          id
          areaName
        }
        strand {
          id
          strandName
        }
        substrand {
          id
          substrandName
        }
        yearLevel {
          id
          description
        }
      }
    }
  }
`;
exports.createTestQuestion = createTestQuestion;
const updateTestQuestion =
/* GraphQL */
`
  mutation UpdateTestQuestion(
    $input: UpdateTestQuestionInput!
    $condition: ModelTestQuestionConditionInput
  ) {
    updateTestQuestion(input: $input, condition: $condition) {
      id
      testID
      questionNo
      maxScore
      nationalMean
      expectedMean
      correctAnswer
      acCodeID
      difficulty
      answerType
      acCode {
        id
        acCode
        skill
        learningArea {
          id
          areaName
        }
        strand {
          id
          strandName
        }
        substrand {
          id
          substrandName
        }
        yearLevel {
          id
          description
        }
      }
    }
  }
`;
exports.updateTestQuestion = updateTestQuestion;
const deleteTestQuestion =
/* GraphQL */
`
  mutation DeleteTestQuestion(
    $input: DeleteTestQuestionInput!
    $condition: ModelTestQuestionConditionInput
  ) {
    deleteTestQuestion(input: $input, condition: $condition) {
      id
      testID
    }
  }
`;
exports.deleteTestQuestion = deleteTestQuestion;
const createTestUpload =
/* GraphQL */
`
  mutation CreateTestUpload(
    $input: CreateTestUploadInput!
    $condition: ModelTestUploadConditionInput
  ) {
    createTestUpload(input: $input, condition: $condition) {
      id
      testDate
      testID
      typeID
      yearLevelID
      schoolID
      schoolYear
      resultFile {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
exports.createTestUpload = createTestUpload;
const updateTestUpload =
/* GraphQL */
`
  mutation UpdateTestUpload(
    $input: UpdateTestUploadInput!
    $condition: ModelTestUploadConditionInput
  ) {
    updateTestUpload(input: $input, condition: $condition) {
      id
      testDate
      testID
      typeID
      yearLevelID
      schoolID
      schoolYear
      resultFile {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
exports.updateTestUpload = updateTestUpload;
const deleteTestUpload =
/* GraphQL */
`
  mutation DeleteTestUpload(
    $input: DeleteTestUploadInput!
    $condition: ModelTestUploadConditionInput
  ) {
    deleteTestUpload(input: $input, condition: $condition) {
      id
      testDate
      resultFile {
        bucket
        region
        key
      }
      testResults {
        items {
          id
          resultAnswers {
            items {
              id
            }
          }
          learningAreas {
            items {
              id
            }
          }
        }
      }
    }
  }
`;
exports.deleteTestUpload = deleteTestUpload;
const deleteTestResult =
/* GraphQL */
`
  mutation DeleteTestResult(
    $input: DeleteTestResultInput!
    $condition: ModelTestResultConditionInput
  ) {
    deleteTestResult(input: $input, condition: $condition) {
      id
    }
  }
`;
exports.deleteTestResult = deleteTestResult;
const deleteTestResultAnswers =
/* GraphQL */
`
  mutation DeleteTestResultAnswers(
    $input: DeleteTestResultAnswersInput!
    $condition: ModelTestResultAnswersConditionInput
  ) {
    deleteTestResultAnswers(input: $input, condition: $condition) {
      id
    }
  }
`;
exports.deleteTestResultAnswers = deleteTestResultAnswers;
const deleteTestResultLearningArea =
/* GraphQL */
`
  mutation DeleteTestResultLearningArea(
    $input: DeleteTestResultLearningAreaInput!
    $condition: ModelTestResultLearningAreaConditionInput
  ) {
    deleteTestResultLearningArea(input: $input, condition: $condition) {
      id
    }
  }
`;
exports.deleteTestResultLearningArea = deleteTestResultLearningArea;
const deleteClassroomYearLevel =
/* GraphQL */
`
  mutation DeleteClassroomYearLevel(
    $input: DeleteClassroomYearLevelInput!
    $condition: ModelClassroomYearLevelConditionInput
  ) {
    deleteClassroomYearLevel(input: $input, condition: $condition) {
      id
      classroomID
      schoolID
      yearLevelID
    }
  }
`;
exports.deleteClassroomYearLevel = deleteClassroomYearLevel;
const createClassroomYearLevel =
/* GraphQL */
`
  mutation CreateClassroomYearLevel(
    $input: CreateClassroomYearLevelInput!
    $condition: ModelClassroomYearLevelConditionInput
  ) {
    createClassroomYearLevel(input: $input, condition: $condition) {
      id
      classroomID
      schoolID
      yearLevelID
    }
  }
`;
exports.createClassroomYearLevel = createClassroomYearLevel;
const updateClassroomYearLevel =
/* GraphQL */
`
  mutation UpdateClassroomYearLevel(
    $input: UpdateClassroomYearLevelInput!
    $condition: ModelClassroomYearLevelConditionInput
  ) {
    updateClassroomYearLevel(input: $input, condition: $condition) {
      id
      classroomID
      schoolID
      yearLevelID
      yearLevel {
        id
        yearCode
        description
      }
    }
  }
`;
exports.updateClassroomYearLevel = updateClassroomYearLevel;
const createClassroomStudent =
/* GraphQL */
`
  mutation CreateClassroomStudent(
    $input: CreateClassroomStudentInput!
    $condition: ModelClassroomStudentConditionInput
  ) {
    createClassroomStudent(input: $input, condition: $condition) {
      id
      classroomID
      studentID
      createdAt
      updatedAt
    }
  }
`;
exports.createClassroomStudent = createClassroomStudent;
const updateClassroomTeacher =
/* GraphQL */
`
  mutation UpdateClassroomTeacher(
    $input: UpdateClassroomTeacherInput!
    $condition: ModelClassroomTeacherConditionInput
  ) {
    updateClassroomTeacher(input: $input, condition: $condition) {
      id
      classroomID
      email
      createdAt
      updatedAt
    }
  }
`;
exports.updateClassroomTeacher = updateClassroomTeacher;
const createTestResult =
/* GraphQL */
`
  mutation CreateTestResult(
    $input: CreateTestResultInput!
    $condition: ModelTestResultConditionInput
  ) {
    createTestResult(input: $input, condition: $condition) {
      id
      testID
      testDate
      completedDate
      studentID
      typeID
      schoolYear
      yearLevelID
      schoolID
      score
      scale
      stanine
      percentile
      testUploadID
      createdAt
      updatedAt
    }
  }
`;
exports.createTestResult = createTestResult;
const createTestResultAnswers =
/* GraphQL */
`
  mutation CreateTestResultAnswers(
    $input: CreateTestResultAnswersInput!
    $condition: ModelTestResultAnswersConditionInput
  ) {
    createTestResultAnswers(input: $input, condition: $condition) {
      id
      testResultID
      testQuestionID
      studentAnswer
      proficiency
      createdAt
      updatedAt
    }
  }
`;
exports.createTestResultAnswers = createTestResultAnswers;
const createTestLearningArea =
/* GraphQL */
`
  mutation CreateTestLearningArea(
    $input: CreateTestLearningAreaInput!
    $condition: ModelTestLearningAreaConditionInput
  ) {
    createTestLearningArea(input: $input, condition: $condition) {
      id
      testID
      learningAreaID
      createdAt
      updatedAt
    }
  }
`;
exports.createTestLearningArea = createTestLearningArea;
const deleteTestLearningArea =
/* GraphQL */
`
  mutation DeleteTestLearningArea(
    $input: DeleteTestLearningAreaInput!
    $condition: ModelTestLearningAreaConditionInput
  ) {
    deleteTestLearningArea(input: $input, condition: $condition) {
      id
      testID
      learningAreaID
    }
  }
`;
exports.deleteTestLearningArea = deleteTestLearningArea;
const createTestResultLearningArea =
/* GraphQL */
`
  mutation CreateTestResultLearningArea(
    $input: CreateTestResultLearningAreaInput!
    $condition: ModelTestResultLearningAreaConditionInput
  ) {
    createTestResultLearningArea(input: $input, condition: $condition) {
      id
      testResultID
      studentID
      learningAreaID
      typeID
      schoolYear
      yearLevelID
      schoolID
      testDate
      createdAt
      updatedAt
    }
  }
`;
exports.createTestResultLearningArea = createTestResultLearningArea;
const createSchool =
/* GraphQL */
`
  mutation CreateSchool(
    $input: CreateSchoolInput!
    $condition: ModelSchoolConditionInput
  ) {
    createSchool(input: $input, condition: $condition) {
      id
      schoolName
      motto
      studentLoginEnabled
      networkID
      countryID
      stateID
      logo {
        bucket
        region
        key
      }
      createdAt
      updatedAt
      country {
        id
        name
        countryCode
      }
      state {
        id
        name
        stateCode
      }
    }
  }
`;
exports.createSchool = createSchool;
const updateSchool =
/* GraphQL */
`
  mutation UpdateSchool(
    $input: UpdateSchoolInput!
    $condition: ModelSchoolConditionInput
  ) {
    updateSchool(input: $input, condition: $condition) {
      id
      schoolName
      motto
      studentLoginEnabled
      networkID
      countryID
      stateID
      logo {
        bucket
        region
        key
      }
      createdAt
      updatedAt
      country {
        id
        name
        countryCode
      }
      state {
        id
        name
        stateCode
      }
    }
  }
`;
exports.updateSchool = updateSchool;
const deleteSchool =
/* GraphQL */
`
  mutation DeleteSchool(
    $input: DeleteSchoolInput!
    $condition: ModelSchoolConditionInput
  ) {
    deleteSchool(input: $input, condition: $condition) {
      id
      schoolName
      logo {
        bucket
        region
        key
      }
      attributeCategories {
        items {
          id
        }
      }
      schoolIcseas {
        items {
          id
        }
      }
      students {
        items {
          id
          schoolID
          studentID
          schoolYear
        }
        nextToken
      }
    }
  }
`;
exports.deleteSchool = deleteSchool;