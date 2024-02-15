"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.getStudentByNameByBirthDate = void 0;
const getStudentByNameByBirthDate = /* GraphQL */ `
  query GetStudentByNameByBirthDate(
    $firstName: String
    $lastNameBirthDate: ModelStudentByStudentNamesBirthDateCompositeKeyConditionInput
    $nextToken: String
  ) {
    getStudentByNameByBirthDate(
      firstName: $firstName
      lastNameBirthDate: $lastNameBirthDate
      nextToken: $nextToken
    ) {
      items {
        id
        firstName
        lastName
      }
      nextToken
    }
  }
`;
exports.getStudentByNameByBirthDate = getStudentByNameByBirthDate;
const getSystemParameter = /* GraphQL */ `
  query GetSystemParameter($key: String!) {
    getSystemParameter(key: $key) {
      id
      paramData
      key
    }
  }
`;
exports.getSystemParameter = getSystemParameter;
const getStudentBySchoolYearAndStudentID = /* GraphQL */ `
  query getStudentBySchool(
    $schoolYearStudentID: ModelSchoolStudentBySchoolCompositeKeyConditionInput
    $schoolID: ID!
    $nextToken: String
  ) {
    getStudentBySchool(
      schoolYearStudentID: $schoolYearStudentID
      schoolID: $schoolID
      nextToken: $nextToken
    ) {
      items {
        id
        user {
          items {
            email
          }
        }
        userId
      }
      nextToken
    }
  }
`;
exports.getStudentBySchoolYearAndStudentID = getStudentBySchoolYearAndStudentID;
const getUserByUserId =
/* GraphQL */
`
  query GetUserByUserId(
    $userId: String
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUserByUserId(
      userId: $userId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        userId
        email
      }
    }
  }
`;
exports.getUserByUserId = getUserByUserId;
const getStudentsInAClassroom =
/* GraphQL */
`
  query getStudentsInAClassroom(
    $classroomID: ID!
    $nextToken: String
  ) {
    getStudentsByClassroom(
      classroomID: $classroomID
      nextToken: $nextToken
    ) {
      items {
        classroomID
        id
        student {
          birthDate
          firstName
          lastName
          middleName
          gender
          id
          studentUniqueIdentifier
          yearLevelID
        }
      }
      nextToken
    }
  }
`;
exports.getStudentsInAClassroom = getStudentsInAClassroom;