module.exports.getTestResultsByTestByStudentByTestDate = /* GraphQL */ `
  query GetTestResultsByTestByStudentByTestDate(
    $testID: ID
    $studentIDTestDate: ModelTestResultByTestByStudentByTestDateCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsByTestByStudentByTestDate(
      testID: $testID
      studentIDTestDate: $studentIDTestDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        resultAnswers {
          items {
            id
            testResultID
            testQuestionID
            studentAnswer
            proficiency
            testQuestion {
              id
              questionNo
              itemId
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
                strandID
                substrandID
                yearLevelID
                curriculumEntry
                skill
                learningArea {
                  id
                  areaName
                  colour
                }
                strand {
                  strandName
                }
                substrand {
                  id
                  substrandName
                }
                yearLevel {
                  id
                  yearCode
                  description
                }
              }
            }
            testResult {
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
              student {
                id
                firstName
                middleName
                lastName
                gender
                birthDate
              }
              test {
                testName
              }
            }
          }
        }
      }
      nextToken
    }
  }
`;

module.exports.getClassroomStudentLinks = /* GraphQL */ `
  query GetStudentsByClassroom(
    $classroomID: ID
    $studentID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStudentsByClassroom(
      classroomID: $classroomID
      studentID: $studentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomID
        studentID
      }
      nextToken
    }
  }
`;

module.exports.getSchoolCohortLinks = /* GraphQL */ `
  query GetSchoolStudentsByYearAndYearLevel(
    $schoolID: ID
    $schoolYearYearLevelID: ModelSchoolStudentBySchoolYearAnYearLevelCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSchoolStudentsByYearAndYearLevel(
      schoolID: $schoolID
      schoolYearYearLevelID: $schoolYearYearLevelID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        studentID
      }
      nextToken
    }
  }
`;

module.exports.getStudentTestsForAnalysis = /* GraphQL */ `
  query GetTestResultsByStudent(
    $studentID: ID
    $testDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsByStudent(
      studentID: $studentID
      testDate: $testDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testID
        testDate
        studentID
        typeID
        schoolYear
        yearLevelID
        test {
          testName
        }
        resultAnswers {
          items {
            studentAnswer
            proficiency
            testQuestion {
              questionNo
              correctAnswer
              difficulty
              acCode {
                acCode
              }
            }
          }
        }
        learningAreas {
          items {
            learningAreaID
          }
        }
      }
      nextToken
    }
  }
`;

module.exports.getTestUploadsForAnalysis = /* GraphQL */ `
  query GetTestUploadsBySchoolByYear(
    $schoolID: ID
    $schoolYear: ModelIntKeyConditionInput
  ) {
    getTestUploadsBySchoolByYear(schoolID: $schoolID, schoolYear: $schoolYear) {
      items {
        id
        testDate
        testID
        schoolYear
        schoolID
        school {
          schoolName
        }
        testResults(limit: 1000) {
          items {
            studentID
          }
        }
        test {
          testName
          typeID
          learningAreas {
            items {
              learningArea {
                id
              }
            }
          }
        }
      }
    }
  }
`;

module.exports.getSchoolIDsFromStudentID = /* GraphQL */ `
  query GetStudentSchools($studentID: ID) {
    getStudentSchools(studentID: $studentID) {
      items {
        schoolID
        schoolYear
        yearLevelID
      }
    }
  }
`;

module.exports.getSchoolIDsFromClassroomID = /* GraphQL */ `
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      schoolYear
      schoolID
      students {
        items {
          studentID
        }
      }
    }
  }
`;

module.exports.getStudentData = /* GraphQL */ `
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      id
      birthDate
      firstName
      lastName
      gender
      middleName
    }
  }
`;

module.exports.getAcCodeData = /* GraphQL */ `
  query GetAcCode($id: ID!) {
    getAcCode(id: $id) {
      id
      acCode
      curriculumEntry
      skill
      learningArea {
        id
        areaName
        colour
      }
      skill
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
        yearCode
        description
      }
    }
  }
`;

// temp query for newGapAnalysis ( until new table is constructed)
module.exports.dummyGetTestResultAnswersGA = /* GraphQL */ `
  query getTestResultsByTestUpload($testUploadID: ID!, $nextToken: String) {
    getTestResultsByTestUpload(
      testUploadID: $testUploadID
      limit: 50
      nextToken: $nextToken
    ) {
      items {
        studentID
        resultAnswers {
          items {
            proficiency
            testQuestion {
              acCode {
                acCode
              }
            }
          }
        }
      }
      nextToken
    }
  }
`;

// final query for newGapAnalysis ( after new table was constructed)
module.exports.GetTestResultAnswersGA = /* GraphQL */ `
  query getTestResultsAnswersGAByTestUpload(
    $testUploadID: ID!
    $nextToken: String
  ) {
    getTestResultsAnswersGAByTestUpload(
      testUploadID: $testUploadID
      nextToken: $nextToken
      limit: 5000
    ) {
      items {
        studentID
        acCode
        proficiency
      }
      nextToken
    }
  }
`;

module.exports.ListYearLevels = /* GraphQL */ `
  query listYearLevels(
    $filter: ModelYearLevelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listYearLevels(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        yearCode
        description
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
