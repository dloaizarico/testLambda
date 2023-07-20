"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGapAnalysisData = exports.getStudentTestsForAnalysis = exports.getGapAnalysisTests = exports.getStudentSchoolsForUpdate = exports.getQuestionByTestItemId = exports.getQuestionNoByTest = exports.getClassroom = exports.getTeacherClassroomsForFiltering = exports.getTestUploadsForFilter = exports.getTestResultsByTestLinks = exports.getTestResultsByTestByStudentByTestDate = exports.getTestResultsAnswersByTestResult = exports.getTestResultAnswers = exports.getTestResultLearningAreaMinimal = exports.getTestResultsByStudentByAreaByTypeByYear = exports.getTest = exports.getClassroomYearLevelById = exports.getSchoolClassroomsByYearLevel = exports.getTestResultsByTestUpload = exports.getTestResult = exports.getTestUploadsBySchoolGapFilter = exports.getTestUploadsBySchoolByAreaByTypeByYear = exports.getTestUploadsBySchoolByYearByYearLevelByType = exports.getTestUploadsBySchoolByYearByType = exports.getTestUploadsByYear = exports.listTestUploads = exports.getTestUploadByTestByDate = exports.getTestUploadsBySchoolByYearLevel = exports.getTestUploadsBySchoolByYear = exports.getTestUploadsByTypeByYear = exports.getTestUpload = exports.getStudentDataByAttributeByYear = exports.getQuestionsByTest = exports.getTestQuestion = exports.getTestsByTypeByYearLevel = exports.getTestsByYearLevel = exports.getTestsByType = exports.getTestsSortedByName = exports.listTests = exports.getTestByName = exports.getTestByNameMinimal = exports.getUsersByLastName = exports.getUsersByFirstName = exports.getUsersByEmail = exports.getTeacherClassrooms = exports.getUsersBySchool = exports.getTeachersBySchool = exports.getUserMinimal = exports.getSchoolStudentsByYearAndLevelAndLastName = exports.getSchoolStudentsByYearAndLevelAndFirstName = exports.getSchoolStudentsByYearAndFirstName = exports.getSchoolStudentsByYearAndLastName = exports.getSchoolCohortLinks = exports.getSchoolStudentsByYearAndYearLevel = exports.getStudentDataByYear = exports.getStudentAttributesBySchool = exports.getAttributeCategoryBySchoolByName = exports.getSchoolAttributeCategory = exports.getAttributeCategoriesBySchool = exports.getSchoolsByNetwork = exports.listSchoolNetworks = exports.getSchoolNetwork = exports.getNetworkByName = exports.getClassTeachers = exports.getClassByNameByYearWithStudents = exports.getClassByNameByYear = exports.getQuestionsBySubtrand = exports.getQuestionsByStrand = exports.getQuestionsByYearLevel = exports.getQuestionsByLearningArea = exports.getQuestionsByAcCode = exports.listQuestions = exports.getQuestionMinimal = exports.getStudentBySchoolList = exports.getStudentBySchoolIdOnly = exports.getSchool = exports.getSchoolsSorted = exports.listSchools = exports.getSchoolStudent = exports.getSchoolStudentsByYear = exports.getStudentBySchoolMinimal = exports.getStudentByNameByBirthDate = exports.getClassroomStudentLinks = exports.getStudentsByClassroom = exports.getStudentFull = exports.getStudent = exports.getClassroomDetail = exports.getClassesByTypeByYear = exports.getClassByYear = exports.getSchoolByName = exports.getAcCodeIdByCode = exports.getUserByUserId = exports.getUser = void 0;
const getUser =
/* GraphQL */
`
  query GetUser($email: String!) {
    getUser(email: $email) {
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
      school {
        id
        schoolName
      }
    }
  }
`;
exports.getUser = getUser;
const getUserByUserId =
/* GraphQL */
`
  query GetUserByUserId(
    $userId: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUserByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      }
    }
  }
`;
exports.getUserByUserId = getUserByUserId;
const getAcCodeIdByCode =
/* GraphQL */
`
  query AcCodeByCode(
    $acCode: String
    $sortDirection: ModelSortDirection
    $filter: ModelAcCodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    acCodeByCode(
      acCode: $acCode
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCode
      }
    }
  }
`;
exports.getAcCodeIdByCode = getAcCodeIdByCode;
const getSchoolByName =
/* GraphQL */
`
  query GetSchoolByName(
    $schoolName: String
    $countryID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSchoolByName(
      schoolName: $schoolName
      countryID: $countryID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolName
        motto
        studentLoginEnabled
        logo {
          bucket
          region
          key
        }
      }
    }
  }
`;
exports.getSchoolByName = getSchoolByName;
const getClassByYear =
/* GraphQL */
`
  query GetClassByYear(
    $schoolID: ID
    $schoolYear: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getClassByYear(
      schoolID: $schoolID
      schoolYear: $schoolYear
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        className
      }
    }
  }
`;
exports.getClassByYear = getClassByYear;
const getClassesByTypeByYear =
/* GraphQL */
`
  query GetClassesByTypeByYear(
    $schoolID: ID
    $classTypeSchoolYear: ModelClassroomByTypeBySchoolYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getClassesByTypeByYear(
      schoolID: $schoolID
      classTypeSchoolYear: $classTypeSchoolYear
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classType
        focusGroupType
        className
        schoolYear
        schoolID
        teachers {
          items {
            user {
              firstName
              lastName
              email
            }
            id
          }
        }
        learningAreas {
          items {
            learningArea {
              id
              areaName
            }
            id
          }
        }
        yearLevels {
          items {
            yearLevel {
              id
              description
            }
            id
          }
        }
        students {
          items {
            id
            classroomID
            studentID
          }
        }
      }
      nextToken
    }
  }
`;
exports.getClassesByTypeByYear = getClassesByTypeByYear;
const getClassroomDetail =
/* GraphQL */
`
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      classType
      focusGroupType
      className
      schoolYear
      schoolID
      school {
        id
        schoolName
        networkID
      }
      yearLevels {
        items {
          id
          classroomID
          schoolID
          yearLevelID
        }
      }
      teachers {
        items {
          id
          email
        }
      }
      students {
        items {
          id
          classroomID
          studentID
        }
      }
    }
  }
`;
exports.getClassroomDetail = getClassroomDetail;
const getStudent =
/* GraphQL */
`
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      id
      firstName
      middleName
      lastName
      gender
      birthDate
      photo {
        bucket
        region
        key
      }
      yearLevelID
    }
  }
`;
exports.getStudent = getStudent;
const getStudentFull =
/* GraphQL */
`
  query GetStudentFull($id: ID!) {
    getStudent(id: $id) {
      id
      firstName
      middleName
      lastName
      gender
      birthDate
      photo {
        bucket
        region
        key
      }
      yearLevelID
      currentYear {
        id
        yearCode
        description
        type
        createdAt
        updatedAt
      }
      classrooms {
        items {
          classroom {
            className
            schoolYear
            teachers {
              items {
                user {
                  firstName
                  lastName
                }
              }
            }
          }
        }
        nextToken
      }
    }
  }
`;
exports.getStudentFull = getStudentFull;
const getStudentsByClassroom =
/* GraphQL */
`
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
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
        }
      }
      nextToken
    }
  }
`;
exports.getStudentsByClassroom = getStudentsByClassroom;
const getClassroomStudentLinks =
/* GraphQL */
`
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
exports.getClassroomStudentLinks = getClassroomStudentLinks;
const getStudentByNameByBirthDate =
/* GraphQL */
`
  query GetStudentByNameByBirthDate(
    $firstName: String
    $lastNameBirthDate: ModelStudentByStudentNamesBirthDateCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStudentByNameByBirthDate(
      firstName: $firstName
      lastNameBirthDate: $lastNameBirthDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        firstName
        middleName
        lastName
        birthDate
      }
      nextToken
    }
  }
`;
exports.getStudentByNameByBirthDate = getStudentByNameByBirthDate;
const getStudentBySchoolMinimal =
/* GraphQL */
`
  query GetStudentBySchool(
    $schoolID: ID
    $schoolYearStudentID: ModelSchoolStudentBySchoolCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStudentBySchool(
      schoolID: $schoolID
      schoolYearStudentID: $schoolYearStudentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        studentID
        schoolYear
        yearLevelID
      }
      nextToken
    }
  }
`;
exports.getStudentBySchoolMinimal = getStudentBySchoolMinimal;
const getSchoolStudentsByYear =
/* GraphQL */
`
  query GetSchoolStudentsByYear(
    $schoolID: ID
    $schoolYear: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSchoolStudentsByYear(
      schoolID: $schoolID
      schoolYear: $schoolYear
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        studentID
        schoolYear
        yearLevelID
        userId
        firstName
        lastName
        yearLevel {
          description
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
        }
        school {
          schoolName
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolStudentsByYear = getSchoolStudentsByYear;
const getSchoolStudent =
/* GraphQL */
`
  query GetSchoolStudent($id: ID!) {
    getSchoolStudent(id: $id) {
      id
      schoolID
      studentID
      schoolYear
      yearLevelID
      userId
      yearLevel {
        description
      }
      student {
        id
        firstName
        middleName
        lastName
        gender
        birthDate
      }
      school {
        schoolName
      }
    }
  }
`;
exports.getSchoolStudent = getSchoolStudent;
const listSchools =
/* GraphQL */
`
  query ListSchools(
    $filter: ModelSchoolFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSchools(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        schoolName
        motto
        countryID
        stateID
        networkID
        logo {
          bucket
          region
          key
        }
      }
      nextToken
    }
  }
`;
exports.listSchools = listSchools;
const getSchoolsSorted =
/* GraphQL */
`
  query GetSchoolsSorted(
    $dummy: String
    $schoolName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSchoolsSorted(
      dummy: $dummy
      schoolName: $schoolName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
        countryID
        stateID
        networkID
        schoolNetwork {
          id
          networkName
        }
        logo {
          bucket
          region
          key
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolsSorted = getSchoolsSorted;
const getSchool =
/* GraphQL */
`
  query GetSchool($id: ID!) {
    getSchool(id: $id) {
      id
      schoolName
      motto
      studentLoginEnabled
      ealdProgress
      countryID
      stateID
      networkID
      schoolNetwork {
        id
        networkName
      }
      logo {
        bucket
        region
        key
      }
    }
  }
`;
exports.getSchool = getSchool;
const getStudentBySchoolIdOnly =
/* GraphQL */
`
  query GetStudentBySchool(
    $schoolID: ID
    $schoolYearStudentID: ModelSchoolStudentBySchoolCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStudentBySchool(
      schoolID: $schoolID
      schoolYearStudentID: $schoolYearStudentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
      }
      nextToken
    }
  }
`;
exports.getStudentBySchoolIdOnly = getStudentBySchoolIdOnly;
const getStudentBySchoolList =
/* GraphQL */
`
  query GetStudentBySchool(
    $schoolID: ID
    $schoolYearStudentID: ModelSchoolStudentBySchoolCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStudentBySchool(
      schoolID: $schoolID
      schoolYearStudentID: $schoolYearStudentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        studentID
        yearLevelID
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
        }
      }
      nextToken
    }
  }
`;
exports.getStudentBySchoolList = getStudentBySchoolList;
const getQuestionMinimal =
/* GraphQL */
`
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      acCodeID
      yearLevelID
      learningAreaID
      strandID
      subStrandID
      question
      questionType
      image {
        bucket
        region
        key
      }
      imageRow
      answerSelectionType
      answerTitle
      messageForCorrectAnswer
      messageForIncorrectAnswer
      explanation
      points
      difficulty
    }
  }
`;
exports.getQuestionMinimal = getQuestionMinimal;
const listQuestions =
/* GraphQL */
`
  query ListQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        acCodeID
        acCode {
          acCode
        }
        yearLevelID
        yearLevel {
          description
        }
        learningAreaID
        learningArea {
          areaName
        }
        strandID
        strand {
          strandName
        }
        substrandID
        subStrand {
          substrandName
        }
        question
        questionType
        image {
          bucket
          region
          key
        }
        imageRow
        answerSelectionType
        answerTitle
        messageForCorrectAnswer
        messageForIncorrectAnswer
        explanation
        points
        difficulty
        answers {
          items {
            id
            questionID
            text
            correct
            image {
              key
              bucket
              region
            }
          }
        }
      }
      nextToken
    }
  }
`;
exports.listQuestions = listQuestions;
const getQuestionsByAcCode =
/* GraphQL */
`
  query GetQuestionsByAcCode(
    $acCodeID: ID
    $difficulty: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getQuestionsByAcCode(
      acCodeID: $acCodeID
      difficulty: $difficulty
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCodeID
        acCode {
          acCode
        }
        yearLevelID
        yearLevel {
          description
        }
        learningAreaID
        learningArea {
          areaName
        }
        strandID
        strand {
          strandName
        }
        substrandID
        subStrand {
          substrandName
        }
        question
        questionType
        image {
          bucket
          region
          key
        }
        imageRow
        answerSelectionType
        answerTitle
        messageForCorrectAnswer
        messageForIncorrectAnswer
        explanation
        points
        difficulty
        answers {
          items {
            id
            questionID
            text
            correct
            image {
              key
              bucket
              region
            }
          }
        }
      }
      nextToken
    }
  }
`;
exports.getQuestionsByAcCode = getQuestionsByAcCode;
const getQuestionsByLearningArea =
/* GraphQL */
`
  query GetQuestionsByLearningArea(
    $learningAreaID: ID
    $difficulty: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getQuestionsByLearningArea(
      learningAreaID: $learningAreaID
      difficulty: $difficulty
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCodeID
        acCode {
          acCode
        }
        yearLevelID
        yearLevel {
          description
        }
        learningAreaID
        learningArea {
          areaName
        }
        strandID
        strand {
          strandName
        }
        substrandID
        subStrand {
          substrandName
        }
        question
        questionType
        image {
          bucket
          region
          key
        }
        imageRow
        answerSelectionType
        answerTitle
        messageForCorrectAnswer
        messageForIncorrectAnswer
        explanation
        points
        difficulty
        answers {
          items {
            id
            questionID
            text
            correct
            image {
              key
              bucket
              region
            }
          }
        }
      }
      nextToken
    }
  }
`;
exports.getQuestionsByLearningArea = getQuestionsByLearningArea;
const getQuestionsByYearLevel =
/* GraphQL */
`
  query GetQuestionsByYearLevel(
    $yearLevelID: ID
    $difficulty: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getQuestionsByYearLevel(
      yearLevelID: $yearLevelID
      difficulty: $difficulty
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCodeID
        acCode {
          acCode
        }
        yearLevelID
        yearLevel {
          description
        }
        learningAreaID
        learningArea {
          areaName
        }
        strandID
        strand {
          strandName
        }
        substrandID
        subStrand {
          substrandName
        }
        question
        questionType
        image {
          bucket
          region
          key
        }
        imageRow
        answerSelectionType
        answerTitle
        messageForCorrectAnswer
        messageForIncorrectAnswer
        explanation
        points
        difficulty
        answers {
          items {
            id
            questionID
            text
            correct
            image {
              key
              bucket
              region
            }
          }
        }
      }
      nextToken
    }
  }
`;
exports.getQuestionsByYearLevel = getQuestionsByYearLevel;
const getQuestionsByStrand =
/* GraphQL */
`
  query GetQuestionsByStrand(
    $strandID: ID
    $difficulty: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getQuestionsByStrand(
      strandID: $strandID
      difficulty: $difficulty
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCodeID
        acCode {
          acCode
        }
        yearLevelID
        yearLevel {
          description
        }
        learningAreaID
        learningArea {
          areaName
        }
        strandID
        strand {
          strandName
        }
        substrandID
        subStrand {
          substrandName
        }
        question
        questionType
        image {
          bucket
          region
          key
        }
        imageRow
        answerSelectionType
        answerTitle
        messageForCorrectAnswer
        messageForIncorrectAnswer
        explanation
        points
        difficulty
        answers {
          items {
            id
            questionID
            text
            correct
            image {
              key
              bucket
              region
            }
          }
        }
      }
      nextToken
    }
  }
`;
exports.getQuestionsByStrand = getQuestionsByStrand;
const getQuestionsBySubtrand =
/* GraphQL */
`
  query GetQuestionsBySubtrand(
    $substrandID: ID
    $difficulty: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getQuestionsBySubtrand(
      substrandID: $substrandID
      difficulty: $difficulty
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCodeID
        acCode {
          acCode
        }
        yearLevelID
        yearLevel {
          description
        }
        learningAreaID
        learningArea {
          areaName
        }
        strandID
        strand {
          strandName
        }
        substrandID
        subStrand {
          substrandName
        }
        question
        questionType
        image {
          bucket
          region
          key
        }
        imageRow
        answerSelectionType
        answerTitle
        messageForCorrectAnswer
        messageForIncorrectAnswer
        explanation
        points
        difficulty
        answers {
          items {
            id
            questionID
            text
            correct
            image {
              key
              bucket
              region
            }
          }
        }
      }
      nextToken
    }
  }
`;
exports.getQuestionsBySubtrand = getQuestionsBySubtrand;
const getClassByNameByYear =
/* GraphQL */
`
  query GetClassByNameByYear(
    $schoolID: ID
    $schoolYearClassName: ModelClassroomByClassNameBySchoolYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getClassByNameByYear(
      schoolID: $schoolID
      schoolYearClassName: $schoolYearClassName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        className
        classType
        schoolYear
        schoolID
      }
    }
  }
`;
exports.getClassByNameByYear = getClassByNameByYear;
const getClassByNameByYearWithStudents =
/* GraphQL */
`
  query GetClassByNameByYear(
    $schoolID: ID
    $schoolYearClassName: ModelClassroomByClassNameBySchoolYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getClassByNameByYear(
      schoolID: $schoolID
      schoolYearClassName: $schoolYearClassName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        className
        classType
        schoolYear
        schoolID
        teachers {
          items {
            id
            email
          }
        }
        students {
          items {
            id
            classroomID
            studentID
          }
        }
      }
    }
  }
`;
exports.getClassByNameByYearWithStudents = getClassByNameByYearWithStudents;
const getClassTeachers =
/* GraphQL */
`
  query GetClassTeachers(
    $classroomID: ID
    $email: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomTeacherFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getClassTeachers(
      classroomID: $classroomID
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomID
        email
      }
    }
  }
`;
exports.getClassTeachers = getClassTeachers;
const getNetworkByName =
/* GraphQL */
`
  query GetNetworkByName(
    $networkName: String
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolNetworkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getNetworkByName(
      networkName: $networkName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        networkName
      }
      nextToken
    }
  }
`;
exports.getNetworkByName = getNetworkByName;
const getSchoolNetwork =
/* GraphQL */
`
  query GetSchoolNetwork($id: ID!) {
    getSchoolNetwork(id: $id) {
      id
      networkName
    }
  }
`;
exports.getSchoolNetwork = getSchoolNetwork;
const listSchoolNetworks =
/* GraphQL */
`
  query ListSchoolNetworks(
    $filter: ModelSchoolNetworkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSchoolNetworks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        networkName
      }
      nextToken
    }
  }
`;
exports.listSchoolNetworks = listSchoolNetworks;
const getSchoolsByNetwork =
/* GraphQL */
`
  query GetSchoolsByNetwork(
    $networkID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSchoolsByNetwork(
      networkID: $networkID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
        networkID
        countryID
        stateID
      }
      nextToken
    }
  }
`;
exports.getSchoolsByNetwork = getSchoolsByNetwork;
const getAttributeCategoriesBySchool =
/* GraphQL */
`
  query GetAttributeCategoriesBySchool(
    $schoolID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolAttributeCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getAttributeCategoriesBySchool(
      schoolID: $schoolID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        categoryName
      }
      nextToken
    }
  }
`;
exports.getAttributeCategoriesBySchool = getAttributeCategoriesBySchool;
const getSchoolAttributeCategory =
/* GraphQL */
`
  query GetSchoolAttributeCategory($id: ID!) {
    getSchoolAttributeCategory(id: $id) {
      id
      schoolID
      categoryName
    }
  }
`;
exports.getSchoolAttributeCategory = getSchoolAttributeCategory;
const getAttributeCategoryBySchoolByName =
/* GraphQL */
`
  query GetAttributeCategoryBySchoolByName(
    $schoolID: ID
    $categoryName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolAttributeCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getAttributeCategoryBySchoolByName(
      schoolID: $schoolID
      categoryName: $categoryName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        categoryName
      }
      nextToken
    }
  }
`;
exports.getAttributeCategoryBySchoolByName = getAttributeCategoryBySchoolByName;
const getStudentAttributesBySchool =
/* GraphQL */
`
  query GetStudentAttributesBySchool(
    $schoolID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentAttributeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStudentAttributesBySchool(
      schoolID: $schoolID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        categoryID
        category {
          categoryName
        }
        attributeName
        attributeType
        defaultValue
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getStudentAttributesBySchool = getStudentAttributesBySchool;
const getStudentDataByYear =
/* GraphQL */
`
  query GetStudentDataByYear(
    $studentID: ID
    $schoolYear: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStudentDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStudentDataByYear(
      studentID: $studentID
      schoolYear: $schoolYear
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        studentID
        schoolYear
        attributeID
        value
      }
      nextToken
    }
  }
`;
exports.getStudentDataByYear = getStudentDataByYear;
const getSchoolStudentsByYearAndYearLevel =
/* GraphQL */
`
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
        id
        schoolID
        studentID
        schoolYear
        yearLevelID
        userId
        firstName
        lastName
        yearLevel {
          id
          yearCode
          description
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
        }
        school {
          schoolName
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolStudentsByYearAndYearLevel = getSchoolStudentsByYearAndYearLevel;
const getSchoolCohortLinks =
/* GraphQL */
`
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
        id
        schoolID
        studentID
      }
      nextToken
    }
  }
`;
exports.getSchoolCohortLinks = getSchoolCohortLinks;
const getSchoolStudentsByYearAndLastName =
/* GraphQL */
`
  query GetSchoolStudentsByYearAndLastName(
    $schoolID: ID
    $schoolYearLastName: ModelSchoolStudentBySchoolYearAndLastNameCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSchoolStudentsByYearAndLastName(
      schoolID: $schoolID
      schoolYearLastName: $schoolYearLastName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        studentID
        schoolYear
        yearLevelID
        userId
        firstName
        lastName
        yearLevel {
          id
          yearCode
          description
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
        }
        school {
          schoolName
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolStudentsByYearAndLastName = getSchoolStudentsByYearAndLastName;
const getSchoolStudentsByYearAndFirstName =
/* GraphQL */
`
  query GetSchoolStudentsByYearAndFirstName(
    $schoolID: ID
    $schoolYearFirstName: ModelSchoolStudentBySchoolYearAndFirstNameCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSchoolStudentsByYearAndFirstName(
      schoolID: $schoolID
      schoolYearFirstName: $schoolYearFirstName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        studentID
        schoolYear
        yearLevelID
        userId
        yearLevel {
          id
          yearCode
          description
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
        }
        school {
          schoolName
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolStudentsByYearAndFirstName = getSchoolStudentsByYearAndFirstName;
const getSchoolStudentsByYearAndLevelAndFirstName =
/* GraphQL */
`
  query GetSchoolStudentsByYearAndLevelAndFirstName(
    $schoolID: ID
    $schoolYearYearLevelIDFirstName: ModelSchoolStudentBySchoolYearAndLevelAndFirstNameCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSchoolStudentsByYearAndLevelAndFirstName(
      schoolID: $schoolID
      schoolYearYearLevelIDFirstName: $schoolYearYearLevelIDFirstName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        studentID
        schoolYear
        yearLevelID
        userId
        firstName
        lastName
        yearLevel {
          id
          yearCode
          description
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
        }
        school {
          schoolName
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolStudentsByYearAndLevelAndFirstName = getSchoolStudentsByYearAndLevelAndFirstName;
const getSchoolStudentsByYearAndLevelAndLastName =
/* GraphQL */
`
  query GetSchoolStudentsByYearAndLevelAndLastName(
    $schoolID: ID
    $schoolYearYearLevelIDLastName: ModelSchoolStudentBySchoolYearAndLevelAndlastNameCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSchoolStudentsByYearAndLevelAndLastName(
      schoolID: $schoolID
      schoolYearYearLevelIDLastName: $schoolYearYearLevelIDLastName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        studentID
        schoolYear
        yearLevelID
        userId
        firstName
        lastName
        yearLevel {
          id
          yearCode
          description
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
        }
        school {
          schoolName
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolStudentsByYearAndLevelAndLastName = getSchoolStudentsByYearAndLevelAndLastName;
const getUserMinimal =
/* GraphQL */
`
  query GetUser($email: String!) {
    getUser(email: $email) {
      userId
      firstName
      lastName
      email
      userGroup
      userType
      enabled
      userSchoolID
      lastSignIn
    }
  }
`;
exports.getUserMinimal = getUserMinimal;
const getTeachersBySchool =
/* GraphQL */
`
  query GetTeachersBySchool(
    $userSchoolID: ID
    $userType: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTeachersBySchool(
      userSchoolID: $userSchoolID
      userType: $userType
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        userId
        firstName
        lastName
        email
        userGroup
        userType
        enabled
        userSchoolID
        lastSignIn
      }
      nextToken
    }
  }
`;
exports.getTeachersBySchool = getTeachersBySchool;
const getUsersBySchool =
/* GraphQL */
`
  query GetUsersBySchool(
    $userSchoolID: ID
    $lastName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUsersBySchool(
      userSchoolID: $userSchoolID
      lastName: $lastName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        userId
        firstName
        lastName
        email
        userGroup
        userType
        enabled
        userSchoolID
        lastSignIn
      }
      nextToken
    }
  }
`;
exports.getUsersBySchool = getUsersBySchool;
const getTeacherClassrooms =
/* GraphQL */
`
  query GetTeacherClassrooms(
    $email: String
    $classroomID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomTeacherFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTeacherClassrooms(
      email: $email
      classroomID: $classroomID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
      }
    }
  }
`;
exports.getTeacherClassrooms = getTeacherClassrooms;
const getUsersByEmail =
/* GraphQL */
`
  query GetUsersByEmail(
    $dbType: String
    $email: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUsersByEmail(
      dbType: $dbType
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      }
      nextToken
    }
  }
`;
exports.getUsersByEmail = getUsersByEmail;
const getUsersByFirstName =
/* GraphQL */
`
  query GetUsersByFirstName(
    $dbType: String
    $firstName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUsersByFirstName(
      dbType: $dbType
      firstName: $firstName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      }
      nextToken
    }
  }
`;
exports.getUsersByFirstName = getUsersByFirstName;
const getUsersByLastName =
/* GraphQL */
`
  query GetUsersByLastName(
    $dbType: String
    $lastName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUsersByLastName(
      dbType: $dbType
      lastName: $lastName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      }
      nextToken
    }
  }
`;
exports.getUsersByLastName = getUsersByLastName;
const getTestByNameMinimal =
/* GraphQL */
`
  query GetTestByName(
    $testName: String
    $sortDirection: ModelSortDirection
    $filter: ModelTestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestByName(
      testName: $testName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testName
      }
    }
  }
`;
exports.getTestByNameMinimal = getTestByNameMinimal;
const getTestByName =
/* GraphQL */
`
  query GetTestByName(
    $testName: String
    $sortDirection: ModelSortDirection
    $filter: ModelTestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestByName(
      testName: $testName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        dataType
        typeID
        testName
        testYearLevelId
        year
        nationalMean
        testUnitID
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
        }
        testType {
          id
          typeName
        }
        testUnit {
          id
          unitName
        }
        learningAreas {
          items {
            id
          }
        }
        questions {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestByName = getTestByName;
const listTests =
/* GraphQL */
`
  query ListTests(
    $filter: ModelTestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTests(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        typeID
        testName
        testYearLevelId
        year
        learningAreaID
        nationalMean
        testUnitID
        learningArea {
          id
          areaName
        }
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
      nextToken
    }
  }
`;
exports.listTests = listTests;
const getTestsSortedByName =
/* GraphQL */
`
  query GetTestsSortedByName(
    $dataType: String
    $testName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestsSortedByName(
      dataType: $dataType
      testName: $testName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.getTestsSortedByName = getTestsSortedByName;
const getTestsByType =
/* GraphQL */
`
  query GetTestsByType(
    $typeID: ID
    $testName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestsByType(
      typeID: $typeID
      testName: $testName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.getTestsByType = getTestsByType;
const getTestsByYearLevel =
/* GraphQL */
`
  query GetTestsByYearLevel(
    $testYearLevelId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestsByYearLevel(
      testYearLevelId: $testYearLevelId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.getTestsByYearLevel = getTestsByYearLevel;
const getTestsByTypeByYearLevel =
/* GraphQL */
`
  query GetTestsByTypeByYearLevel(
    $typeID: ID
    $testYearLevelId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestsByTypeByYearLevel(
      typeID: $typeID
      testYearLevelId: $testYearLevelId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.getTestsByTypeByYearLevel = getTestsByTypeByYearLevel;
const getTestQuestion =
/* GraphQL */
`
  query GetTestQuestion($id: ID!) {
    getTestQuestion(id: $id) {
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
        yearLevelID
        learningAreaID
        curriculumEntry
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
exports.getTestQuestion = getTestQuestion;
const getQuestionsByTest =
/* GraphQL */
`
  query GetQuestionsByTest(
    $testID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTestQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getQuestionsByTest(
      testID: $testID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testID
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
          learningAreaID
          skill
        }
      }
      nextToken
    }
  }
`;
exports.getQuestionsByTest = getQuestionsByTest;
const getStudentDataByAttributeByYear =
/* GraphQL */
`
  query GetStudentDataByAttributeByYear(
    $studentID: ID
    $attributeIDSchoolYear: ModelStudentDataByAttributeByYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStudentDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStudentDataByAttributeByYear(
      studentID: $studentID
      attributeIDSchoolYear: $attributeIDSchoolYear
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        studentID
        attributeID
        value
      }
    }
  }
`;
exports.getStudentDataByAttributeByYear = getStudentDataByAttributeByYear;
const getTestUpload =
/* GraphQL */
`
  query GetTestUpload($id: ID!) {
    getTestUpload(id: $id) {
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
      yearLevel {
        description
      }
      school {
        id
        schoolName
      }
      testType {
        id
        typeName
      }
      test {
        id
        testName
        learningAreas {
          items {
            learningAreaID
          }
        }
      }
    }
  }
`;
exports.getTestUpload = getTestUpload;
const getTestUploadsByTypeByYear =
/* GraphQL */
`
  query GetTestUploadsByTypeByYear(
    $typeID: ID
    $schoolYear: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestUploadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestUploadsByTypeByYear(
      typeID: $typeID
      schoolYear: $schoolYear
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        yearLevel {
          description
        }
        school {
          id
          schoolName
        }
        testType {
          id
          typeName
        }
        test {
          id
          testName
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsByTypeByYear = getTestUploadsByTypeByYear;
const getTestUploadsBySchoolByYear =
/* GraphQL */
`
  query GetTestUploadsBySchoolByYear(
    $schoolID: ID
    $schoolYear: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestUploadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestUploadsBySchoolByYear(
      schoolID: $schoolID
      schoolYear: $schoolYear
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        yearLevel {
          description
        }
        school {
          id
          schoolName
        }
        testType {
          id
          typeName
        }
        test {
          id
          testName
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsBySchoolByYear = getTestUploadsBySchoolByYear;
const getTestUploadsBySchoolByYearLevel =
/* GraphQL */
`
  query GetTestUploadsBySchoolByYearLevel(
    $schoolID: ID
    $schoolYearYearLevelID: ModelTestUploadBySchoolYearLevelCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestUploadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestUploadsBySchoolByYearLevel(
      schoolID: $schoolID
      schoolYearYearLevelID: $schoolYearYearLevelID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        yearLevel {
          description
        }
        school {
          id
          schoolName
        }
        testType {
          id
          typeName
        }
        test {
          id
          testName
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsBySchoolByYearLevel = getTestUploadsBySchoolByYearLevel;
const getTestUploadByTestByDate =
/* GraphQL */
`
  query GetTestUploadByTestByDate(
    $schoolID: ID
    $schoolYearTestIDTestDate: ModelTestUploadExistUploadCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestUploadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestUploadByTestByDate(
      schoolID: $schoolID
      schoolYearTestIDTestDate: $schoolYearTestIDTestDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
  }
`;
exports.getTestUploadByTestByDate = getTestUploadByTestByDate;
const listTestUploads =
/* GraphQL */
`
  query ListTestUploads(
    $filter: ModelTestUploadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTestUploads(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        learningAreaID
        learningArea {
          areaName
        }
        yearLevel {
          description
        }
        school {
          id
          schoolName
        }
        testType {
          id
          typeName
        }
        test {
          id
          testName
        }
      }
      nextToken
    }
  }
`;
exports.listTestUploads = listTestUploads;
const getTestUploadsByYear =
/* GraphQL */
`
  query GetTestUploadsByYear(
    $schoolYear: Int
    $testDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestUploadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestUploadsByYear(
      schoolYear: $schoolYear
      testDate: $testDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        yearLevel {
          description
        }
        school {
          id
          schoolName
        }
        testType {
          id
          typeName
        }
        test {
          id
          testName
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsByYear = getTestUploadsByYear;
const getTestUploadsBySchoolByYearByType =
/* GraphQL */
`
  query GetTestUploadsBySchoolByYearByType(
    $schoolID: ID
    $schoolYearTypeID: ModelTestUploadBySchoolByTypeByYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestUploadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestUploadsBySchoolByYearByType(
      schoolID: $schoolID
      schoolYearTypeID: $schoolYearTypeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        yearLevel {
          description
        }
        school {
          id
          schoolName
        }
        testType {
          id
          typeName
        }
        test {
          id
          testName
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsBySchoolByYearByType = getTestUploadsBySchoolByYearByType;
const getTestUploadsBySchoolByYearByYearLevelByType =
/* GraphQL */
`
  query GetTestUploadsBySchoolByYearByYearLevelByType(
    $schoolID: ID
    $schoolYearYearLevelIDTypeID: ModelTestUploadBySchoolByTypeByYearLevelByYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestUploadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestUploadsBySchoolByYearByYearLevelByType(
      schoolID: $schoolID
      schoolYearYearLevelIDTypeID: $schoolYearYearLevelIDTypeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        learningAreaID
        learningArea {
          areaName
        }
        yearLevel {
          description
        }
        school {
          id
          schoolName
        }
        testType {
          id
          typeName
        }
        test {
          id
          testName
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsBySchoolByYearByYearLevelByType = getTestUploadsBySchoolByYearByYearLevelByType;
const getTestUploadsBySchoolByAreaByTypeByYear =
/* GraphQL */
`
  query GetTestUploadsBySchoolByAreaByTypeByYear(
    $schoolID: ID
    $learningAreaIDTypeIDSchoolYear: ModelTestUploadBySchoolByAreaByTypeByYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestUploadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestUploadsBySchoolByAreaByTypeByYear(
      schoolID: $schoolID
      learningAreaIDTypeIDSchoolYear: $learningAreaIDTypeIDSchoolYear
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        learningAreaID
        learningArea {
          areaName
        }
        yearLevel {
          description
        }
        school {
          id
          schoolName
        }
        testType {
          id
          typeName
        }
        test {
          id
          testName
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsBySchoolByAreaByTypeByYear = getTestUploadsBySchoolByAreaByTypeByYear;
const getTestUploadsBySchoolGapFilter =
/* GraphQL */
`
  query GetTestUploadsBySchoolByAreaByTypeByYear(
    $schoolID: ID
    $learningAreaIDTypeIDSchoolYear: ModelTestUploadBySchoolByAreaByTypeByYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestUploadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestUploadsBySchoolByAreaByTypeByYear(
      schoolID: $schoolID
      learningAreaIDTypeIDSchoolYear: $learningAreaIDTypeIDSchoolYear
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testDate
        testID
        typeID
        yearLevelID
        schoolID
        schoolYear
        test {
          id
          testName
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsBySchoolGapFilter = getTestUploadsBySchoolGapFilter;
const getTestResult =
/* GraphQL */
`
  query GetTestResult($id: ID!) {
    getTestResult(id: $id) {
      id
      testID
      testDate
      studentID
      testType {
        id
        typeName
      }
      test {
        id
        testName
        learningAreas {
          items {
            learningAreaID
          }
        }
      }
    }
  }
`;
exports.getTestResult = getTestResult;
const getTestResultsByTestUpload =
/* GraphQL */
`
  query GetTestResultsByTestUpload(
    $testUploadID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTestResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsByTestUpload(
      testUploadID: $testUploadID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testID
        testDate
        completedDate
        studentID
        yearLevelID
        schoolID
        score
        scale
        stanine
        percentile
        testUploadID
        yearLevel {
          id
          description
        }
        school {
          id
          schoolName
          networkID
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
        }
        test {
          id
          typeID
          testName
          year
          nationalMean
          testUnitID
        }
        resultAnswers {
          items {
            id
            testResultID
            testQuestionID
            studentAnswer
            proficiency
            testQuestion {
              id
              testID
              questionNo
              maxScore
              nationalMean
              expectedMean
              correctAnswer
              acCodeID
              acCode {
                id
                acCode
                strandID
                strand {
                  strandName
                }
                substrandID
                substrand {
                  substrandName
                }
              }
              difficulty
              answerType
            }
          }
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsByTestUpload = getTestResultsByTestUpload;
const getSchoolClassroomsByYearLevel =
/* GraphQL */
`
  query GetSchoolClassroomsByYearLevel(
    $schoolID: ID
    $yearLevelID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomYearLevelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSchoolClassroomsByYearLevel(
      schoolID: $schoolID
      yearLevelID: $yearLevelID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomID
        schoolID
        yearLevelID
      }
    }
  }
`;
exports.getSchoolClassroomsByYearLevel = getSchoolClassroomsByYearLevel;
const getClassroomYearLevelById =
/* GraphQL */
`
  query GetClassroomYearLevelById(
    $classroomID: ID
    $yearLevelID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomYearLevelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getClassroomYearLevelByID(
      classroomID: $classroomID
      yearLevelID: $yearLevelID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomID
        schoolID
        yearLevelID
      }
    }
  }
`;
exports.getClassroomYearLevelById = getClassroomYearLevelById;
const getTest =
/* GraphQL */
`
  query GetTest($id: ID!) {
    getTest(id: $id) {
      id
      dataType
      typeID
      testName
      testYearLevelId
      year
      nationalMean
      testUnitID
      createdAt
      updatedAt
      yearLevel {
        id
        yearCode
        description
      }
      testType {
        id
        typeName
      }
      learningAreas {
        items {
          id
          testID
          learningAreaID
        }
        nextToken
      }
      questions {
        items {
          id
          testID
          questionNo
          itemId
          maxScore
          nationalMean
          expectedMean
          correctAnswer
          acCodeID
          difficulty
          answerType
        }
      }
    }
  }
`;
exports.getTest = getTest;
const getTestResultsByStudentByAreaByTypeByYear =
/* GraphQL */
`
  query GetTestResultsByStudentByAreaByTypeByYear(
    $studentID: ID
    $learningAreaIDTypeIDSchoolYear: ModelTestResultLearningAreaByStudentByAreaByTypeByYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestResultLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsByStudentByAreaByTypeByYear(
      studentID: $studentID
      learningAreaIDTypeIDSchoolYear: $learningAreaIDTypeIDSchoolYear
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testResultID
        studentID
        learningAreaID
        typeID
        schoolYear
        yearLevelID
        schoolID
        testDate
        testResult {
          id
          testID
          test {
            testName
          }
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsByStudentByAreaByTypeByYear = getTestResultsByStudentByAreaByTypeByYear;
const getTestResultLearningAreaMinimal =
/* GraphQL */
`
  query GetTestResultLearningArea($id: ID!) {
    getTestResultLearningArea(id: $id) {
      id
      testResultID
      studentID
      learningAreaID
      typeID
      schoolYear
      yearLevelID
      schoolID
      testDate
      testResult {
        id
        testID
        test {
          id
          testName
        }
      }
    }
  }
`;
exports.getTestResultLearningAreaMinimal = getTestResultLearningAreaMinimal;
const getTestResultAnswers =
/* GraphQL */
`
  query GetTestResultAnswers($id: ID!) {
    getTestResultAnswers(id: $id) {
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
          acCode
          strandID
          substrandID
          yearLevelID
          strand {
            strandName
          }
          substrand {
            id
            substrandName
          }
          yearLevel {
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
        learningAreaID
        typeID
        schoolYear
        yearLevelID
        schoolID
        score
        scale
        stanine
        percentile
        testUploadID
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
        }
      }
    }
  }
`;
exports.getTestResultAnswers = getTestResultAnswers;
const getTestResultsAnswersByTestResult =
/* GraphQL */
`
  query GetTestResultsAnswersByTestResult(
    $testResultID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTestResultAnswersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsAnswersByTestResult(
      testResultID: $testResultID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
      nextToken
    }
  }
`;
exports.getTestResultsAnswersByTestResult = getTestResultsAnswersByTestResult;
const getTestResultsByTestByStudentByTestDate =
/* GraphQL */
`
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
exports.getTestResultsByTestByStudentByTestDate = getTestResultsByTestByStudentByTestDate;
const getTestResultsByTestLinks =
/* GraphQL */
`
  query GetTestResultsByTest(
    $testID: ID
    $testDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsByTest(
      testID: $testID
      testDate: $testDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        studentID
      }
      nextToken
    }
  }
`;
exports.getTestResultsByTestLinks = getTestResultsByTestLinks;
const getTestUploadsForFilter =
/* GraphQL */
`
  query GetTestUploadsBySchoolByYearByType(
    $schoolID: ID
    $schoolYearTypeID: ModelTestUploadBySchoolByTypeByYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestUploadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestUploadsBySchoolByYearByType(
      schoolID: $schoolID
      schoolYearTypeID: $schoolYearTypeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testDate
        test {
          id
          testName
          testType {
            id
            typeName
          }
          learningAreas {
            items {
              learningAreaID
              learningArea {
                areaName
                colour
              }
            }
          }
        }
        testResults {
          items {
            id
            studentID
          }
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsForFilter = getTestUploadsForFilter;
const getTeacherClassroomsForFiltering =
/* GraphQL */
`
  query GetTeacherClassrooms(
    $email: String
    $classroomID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomTeacherFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTeacherClassrooms(
      email: $email
      classroomID: $classroomID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomID
        email
        user {
          firstName
          lastName
          email
        }
        classroom {
          id
          classType
          focusGroupType
          className
          schoolYear
          schoolID
          yearLevels {
            items {
              yearLevel {
                id
                description
              }
              id
            }
          }
        }
      }
      nextToken
    }
  }
`;
exports.getTeacherClassroomsForFiltering = getTeacherClassroomsForFiltering;
const getClassroom =
/* GraphQL */
`
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      classType
      focusGroupType
      className
      schoolYear
      schoolID
      school {
        id
        schoolName
        networkID
      }
      yearLevels {
        items {
          id
          classroomID
          schoolID
          yearLevelID
          yearLevel {
            description
          }
        }
      }
      teachers {
        items {
          id
          classroomID
          email
        }
      }
      learningAreas {
        items {
          id
          classroomID
          learningAreaID
          learningArea {
            areaName
          }
        }
      }
      students {
        items {
          id
          classroomID
          studentID
        }
        nextToken
      }
    }
  }
`;
exports.getClassroom = getClassroom;
const getQuestionNoByTest =
/* GraphQL */
`
  query GetQuestionNoByTest(
    $testID: ID
    $questionNo: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getQuestionNoByTest(
      testID: $testID
      questionNo: $questionNo
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testID
        questionNo
        itemId
        maxScore
        nationalMean
        expectedMean
        correctAnswer
        acCodeID
        difficulty
        answerType
        createdAt
        updatedAt
        acCode {
          id
          acCode
        }
      }
    }
  }
`;
exports.getQuestionNoByTest = getQuestionNoByTest;
const getQuestionByTestItemId =
/* GraphQL */
`
  query GetQuestionByTestItemId(
    $testID: ID
    $itemId: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getQuestionByTestItemId(
      testID: $testID
      itemId: $itemId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testID
        questionNo
        itemId
        maxScore
        nationalMean
        expectedMean
        correctAnswer
        acCodeID
        difficulty
        answerType
        createdAt
        updatedAt
        acCode {
          id
          acCode
        }
      }
    }
  }
`;
exports.getQuestionByTestItemId = getQuestionByTestItemId;
const getStudentSchoolsForUpdate =
/* GraphQL */
`
  query GetStudentSchools(
    $studentID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStudentSchools(
      studentID: $studentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
  }
`;
exports.getStudentSchoolsForUpdate = getStudentSchoolsForUpdate;
const getGapAnalysisTests =
/* GraphQL */
`
  query GetGapAnalysisTests(
    $studentID: String
    $classroomID: String
    $schoolID: String
    $yearLevelID: String
    $networkSchools: [String]
    $learningAreas: [String]
    $testTypes: [String]
    $startYear: Int
    $endYear: Int
    $testDate: String
  ) {
    getGapAnalysisTests(
      studentID: $studentID
      classroomID: $classroomID
      schoolID: $schoolID
      yearLevelID: $yearLevelID
      networkSchools: $networkSchools
      learningAreas: $learningAreas
      testTypes: $testTypes
      startYear: $startYear
      endYear: $endYear
      testDate: $testDate
    ) {
      id
      testID
      testName
      testDate
      learningAreaID
      testKey
    }
  }
`;
exports.getGapAnalysisTests = getGapAnalysisTests;
const getStudentTestsForAnalysis =
/* GraphQL */
`
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
exports.getStudentTestsForAnalysis = getStudentTestsForAnalysis;
const getGapAnalysisData =
/* GraphQL */
`
  query GetGapAnalysisData(
    $studentID: String
    $classroomID: String
    $schoolID: String
    $yearLevelID: String
    $networkSchools: [String]
    $tests: [String]
    $learningAreas: [String]
  ) {
    getGapAnalysisData(
      studentID: $studentID
      classroomID: $classroomID
      schoolID: $schoolID
      yearLevelID: $yearLevelID
      networkSchools: $networkSchools
      tests: $tests
      learningAreas: $learningAreas
    ) {
      learningAreaID
      areaName
      colour
      numStudents
      summary {
        year
        totalCodes
        incorrectCodes
        studentCount
        items {
          acCode {
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
          students {
            id
            firstName
            middleName
            lastName
            gender
            birthDate
            gapRatio
          }
        }
      }
    }
  }
`;
exports.getGapAnalysisData = getGapAnalysisData;