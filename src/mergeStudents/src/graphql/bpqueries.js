"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.getSchoolStudent =
  exports.getStudentAssessment =
  exports.getTestResultsByStudent =
  exports.getTestResultsLearningAreaByStudentID =
  exports.getTestResultsAnswersGAByStudentID =
  exports.getStudentLessonPlans =
  exports.getStudentDataByStudentID =
  exports.getClassroomsByStudent =
  exports.getStudentProgressMapByStudentId =
  exports.getUserByUserId =
  exports.getStudent =
  exports.getStudentSchools =
    void 0;
const getStudent = /* GraphQL */ `
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      MISID
      birthDate
      createdAt
      gender
      firstName
      id
      lastName
      middleName
      studentUniqueIdentifier
      updatedAt
      wondeID
      yearLevelID
    }
  }
`;
exports.getStudent = getStudent;
const getSchoolStudent = /* GraphQL */ `
  query GetSchoolStudent($id: ID!) {
    getSchoolStudent(id: $id) {
      assignedDateToPremiumAssessment
      assignedDateToWAM
      createdAt
      firstName
      hasAccessToPremiumAssessment
      hasAccessToWAM
      id
      lastName
      schoolID
      schoolYear
      studentID
      updatedAt
      userId
      yearLevelID
    }
  }
`;
exports.getSchoolStudent = getSchoolStudent;
const getStudentSchools = /* GraphQL */ `
  query GetStudentSchools($limit: Int, $nextToken: String, $studentID: ID!) {
    getStudentSchools(
      studentID: $studentID
      nextToken: $nextToken
      limit: $limit
    ) {
      items {
        id
        studentID
      }
      nextToken
    }
  }
`;

const getSchoolStudentsByStudentID = /* GraphQL */ `
  query GetStudentSchools($limit: Int, $nextToken: String, $studentID: ID!) {
    getStudentSchools(
      studentID: $studentID
      nextToken: $nextToken
      limit: $limit
    ) {
      items {
        id
        studentID
        schoolYear
        schoolID
        yearLevelID
      }
      nextToken
    }
  }
`;
exports.getSchoolStudentsByStudentID = getSchoolStudentsByStudentID;

exports.getStudentSchools = getStudentSchools;
const getStudentAssessment = /* GraphQL */ `
  query GetStudentAssessment($studentID: ID!, $limit: Int, $nextToken: String) {
    getStudentAssessment(
      studentID: $studentID
      nextToken: $nextToken
      limit: $limit
    ) {
      items {
        id
        studentID
      }
      nextToken
    }
  }
`;
exports.getStudentAssessment = getStudentAssessment;
const getTestResultsByStudent = /* GraphQL */ `
  query GetTestResultsByStudent(
    $studentID: ID!
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsByStudent(
      studentID: $studentID
      nextToken: $nextToken
      limit: $limit
    ) {
      items {
        id
        studentID
        testDate
      }
      nextToken
    }
  }
`;
exports.getTestResultsByStudent = getTestResultsByStudent;
const getTestResultsLearningAreaByStudentID = /* GraphQL */ `
  query GetTestResultsLearningAreaByStudentID(
    $studentID: ID!
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsLearningAreaByStudentID(
      studentID: $studentID
      nextToken: $nextToken
      limit: $limit
    ) {
      items {
        id
        studentID
      }
      nextToken
    }
  }
`;
//"919b4695-3b84-4703-b98e-fe5db3b8b156"
exports.getTestResultsLearningAreaByStudentID =
  getTestResultsLearningAreaByStudentID;
const getTestResultsAnswersGAByStudentID = /* GraphQL */ `
  query GetTestResultsAnswersGAByStudentID(
    $studentID: ID!
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsAnswersGAByStudentID(
      studentID: $studentID
      nextToken: $nextToken
      limit: $limit
    ) {
      items {
        testResultAnswerID
        studentID
      }
      nextToken
    }
  }
`;
exports.getTestResultsAnswersGAByStudentID = getTestResultsAnswersGAByStudentID;
const getStudentLessonPlans = /* GraphQL */ `
  query GetStudentLessonPlans(
    $studentID: ID!
    $limit: Int
    $nextToken: String
  ) {
    getStudentLessonPlans(
      studentID: $studentID
      nextToken: $nextToken
      limit: $limit
    ) {
      items {
        id
        studentID
      }
      nextToken
    }
  }
`;
exports.getStudentLessonPlans = getStudentLessonPlans;
const getStudentDataByStudentID = /* GraphQL */ `
  query GetStudentDataByStudent(
    $studentID: ID!
    $limit: Int
    $nextToken: String
  ) {
    getStudentDataByStudent(
      studentID: $studentID
      nextToken: $nextToken
      limit: $limit
    ) {
      items {
        id
        studentID
      }
      nextToken
    }
  }
`;
exports.getStudentDataByStudentID = getStudentDataByStudentID;
const getClassroomsByStudent = /* GraphQL */ `
  query GetClassroomsByStudent(
    $studentID: ID!
    $limit: Int
    $nextToken: String
  ) {
    getClassroomsByStudent(
      studentID: $studentID
      nextToken: $nextToken
      limit: $limit
    ) {
      items {
        id
        studentID
        classroomID
      }
      nextToken
    }
  }
`;
exports.getClassroomsByStudent = getClassroomsByStudent;
const getStudentProgressMapByStudentId = /* GraphQL */ `
  query GetStudentProgressMapByStudentId(
    $studentID: ID!
    $limit: Int
    $nextToken: String
  ) {
    getStudentProgressMapByStudentId(
      studentId: $studentID
      nextToken: $nextToken
      limit: $limit
    ) {
      items {
        id
        studentId
      }
      nextToken
    }
  }
`;
exports.getStudentProgressMapByStudentId = getStudentProgressMapByStudentId;
const getUserByUserId = /* GraphQL */ `
  query GetUserByUserId($limit: Int, $nextToken: String, $userId: String) {
    getUserByUserId(userId: $userId, nextToken: $nextToken, limit: $limit) {
      items {
        email
        firstName
        lastName
      }
      nextToken
    }
  }
`;
exports.getUserByUserId = getUserByUserId;
const getStudentLicenceHistoryBySchoolStudentID = /* GraphQL */ `
  query GetStudentLicenceHistoryBySchoolStudentID(
    $limit: Int
    $nextToken: String
    $schoolStudentID: ID
  ) {
    getStudentLicenceHistoryBySchoolStudentID(
      schoolStudentID: $schoolStudentID
      nextToken: $nextToken
      limit: $limit
    ) {
      items {
        id
        allocatorEmail
        createdAt
        schoolID
        schoolStudentID
        schoolYear
        schoolYear #allocatorEmail
        schoolYear #schoolStudentID
        schoolYear #transactionType
        transactionType
        updatedAt
        __typename
      }
      nextToken
    }
  }
`;
exports.getStudentLicenceHistoryBySchoolStudentID =
  getStudentLicenceHistoryBySchoolStudentID;
