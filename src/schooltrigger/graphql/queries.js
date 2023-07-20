"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listStudentDatas = exports.getStudentData = exports.getStudentByNameByBirthDate = exports.getStudent = exports.listStudents = exports.getStudentSchools = exports.getSchoolStudentsByYearAndLevelAndLastName = exports.getSchoolStudentsByYearAndLevelAndFirstName = exports.getSchoolStudentsByYearAndFirstName = exports.getSchoolStudentsByYearAndLastName = exports.getSchoolStudentsByYearAndYearLevel = exports.getSchoolStudentsByYear = exports.getStudentBySchool = exports.listSchoolStudents = exports.getSchoolStudent = exports.getStudentsByClassroom = exports.listClassroomStudents = exports.getClassroomStudent = exports.listClassroomLearningAreas = exports.getClassroomLearningArea = exports.getTeacherClassrooms = exports.getClassTeachers = exports.listClassroomTeachers = exports.getClassroomTeacher = exports.getClassroomYearLevelById = exports.getSchoolClassroomsByYearLevel = exports.getClassroomYearLevels = exports.listClassroomYearLevels = exports.getClassroomYearLevel = exports.getClassByNameByYear = exports.getClassesByTypeByYear = exports.getClassByYear = exports.getClassroom = exports.listClassrooms = exports.listStates = exports.getState = exports.getCountry = exports.listCountrys = exports.getIcseaBySchool = exports.listSchoolIcseas = exports.getSchoolIcsea = exports.getStudentAttributeByCategoryByName = exports.getStudentAttributesBySchoolCategory = exports.getStudentAttributesBySchool = exports.getSchoolStudentAttribute = exports.listSchoolStudentAttributes = exports.getAttributeCategoryBySchoolByName = exports.getAttributeCategoriesBySchool = exports.getSchoolAttributeCategory = exports.listSchoolAttributeCategorys = exports.getSchoolsSorted = exports.getSchoolsByNetwork = exports.getSchoolByName = exports.getSchool = exports.listSchools = exports.getNetworkByName = exports.getSchoolNetwork = exports.listSchoolNetworks = exports.getAcCodeByLearningAreaByYear = exports.getAcCodeByLearningArea = exports.acCodeByCurriculumEntry = exports.acCodeByYearLevel = exports.acCodeBySubstrand = exports.acCodeByStrand = exports.getAcCodeSorted = exports.acCodeByCode = exports.getAcCode = exports.listAcCodes = exports.getYearByDescription = exports.getYearCode = exports.getYearLevelsByCode = exports.getYearLevel = exports.listYearLevels = exports.substrandByStrand = exports.substrandByName = exports.getAcSubstrand = exports.listAcSubstrands = exports.strandByLearningArea = exports.strandByName = exports.getAcStrand = exports.listAcStrands = exports.learningAreaByName = exports.getLearningArea = exports.listLearningAreas = exports.listSystemParameters = exports.getSystemParameter = exports.getUserSettingsByKey = exports.getUserSettings = exports.listUserSettingsDatas = exports.getUserSettingsData = exports.getTeachersBySchool = exports.getUserByUserId = exports.getUsersByLastName = exports.getUsersByFirstName = exports.getUsersByEmail = exports.getUsersBySchool = exports.getUser = exports.listUsers = exports.getGapAnalysisData = exports.getGapAnalysisTests = void 0;
exports.getTestResultsAnswersByTestQuestion = exports.getTestResultsAnswersByTestResult = exports.listTestResultAnswerss = exports.getTestResultAnswers = exports.getTestResultsBySchoolByYearLevelByAreaByYear = exports.getTestResultsByYearLevelByAreaByYear = exports.getTestResultsByStudentByAreaByYear = exports.getTestResultsByYearLevelByAreaByTypeByYear = exports.getTestResultsByStudentByAreaByTypeByYear = exports.listTestResultLearningAreas = exports.getTestResultLearningArea = exports.getTestResultsByTestByStudentByTestDate = exports.getTestResultsByTestUpload = exports.getTestResultsByTest = exports.getTestResultsByStudent = exports.getTestResult = exports.listTestResults = exports.getTestUploadByTestByDate = exports.getTestUploadsBySchoolByYearByYearLevelByType = exports.getTestUploadsBySchoolByYearByType = exports.getTestUploadsByTypeByYear = exports.getTestUploadsByYear = exports.getTestUploadsBySchoolByYearLevel = exports.getTestUploadsBySchoolByYear = exports.getTestUpload = exports.listTestUploads = exports.getQuestionByTestItemId = exports.getQuestionNoByTest = exports.getQuestionsByTest = exports.getTestQuestion = exports.listTestQuestions = exports.getTestsByLearingArea = exports.getLearningAreasByTest = exports.listTestLearningAreas = exports.getTestLearningArea = exports.getTestsSortedByName = exports.getTestsByTypeByYearLevel = exports.getTestsByYearLevel = exports.getTestsByYear = exports.searchTestsByName = exports.getTestByName = exports.getTestsByType = exports.getTest = exports.listTests = exports.getTestUnitByName = exports.getTestUnit = exports.listTestUnits = exports.getTestTypeByName = exports.getTestType = exports.listTestTypes = exports.listAnswers = exports.getAnswer = exports.getQuestionsBySubtrand = exports.getQuestionsByStrand = exports.getQuestionsByYearLevel = exports.getQuestionsByLearningArea = exports.getQuestionsByAcCode = exports.listQuestions = exports.getQuestion = exports.listNotificationsByDate = exports.getNotificationsByRecipient = exports.listNotifications = exports.getNotification = exports.getStudentDataByAttributeByYear = exports.getStudentDataByYear = void 0;

/* eslint-disable */
// this is an auto generated file. This will be overwritten
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
      }
    }
  }
`;
exports.getGapAnalysisData = getGapAnalysisData;
const listUsers =
/* GraphQL */
`
  query ListUsers(
    $email: String
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      email: $email
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
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
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.listUsers = listUsers;
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
      dbType
      createdAt
      updatedAt
      school {
        id
        dummy
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
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
        schoolNetwork {
          id
          networkName
          createdAt
          updatedAt
        }
        attributeCategories {
          nextToken
        }
        schoolIcseas {
          nextToken
        }
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
        state {
          id
          name
          stateCode
          countryID
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
      }
    }
  }
`;
exports.getUser = getUser;
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
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getUsersBySchool = getUsersBySchool;
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
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
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
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
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
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getUsersByLastName = getUsersByLastName;
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
        userSchoolID
        lastSignIn
        dbType
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getUserByUserId = getUserByUserId;
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
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getTeachersBySchool = getTeachersBySchool;
const getUserSettingsData =
/* GraphQL */
`
  query GetUserSettingsData($id: ID!) {
    getUserSettingsData(id: $id) {
      id
      email
      settingsKey
      settingsData
      createdAt
      updatedAt
    }
  }
`;
exports.getUserSettingsData = getUserSettingsData;
const listUserSettingsDatas =
/* GraphQL */
`
  query ListUserSettingsDatas(
    $filter: ModelUserSettingsDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserSettingsDatas(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        email
        settingsKey
        settingsData
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listUserSettingsDatas = listUserSettingsDatas;
const getUserSettings =
/* GraphQL */
`
  query GetUserSettings(
    $email: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserSettingsDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUserSettings(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        email
        settingsKey
        settingsData
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getUserSettings = getUserSettings;
const getUserSettingsByKey =
/* GraphQL */
`
  query GetUserSettingsByKey(
    $email: String
    $settingsKey: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserSettingsDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUserSettingsByKey(
      email: $email
      settingsKey: $settingsKey
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        email
        settingsKey
        settingsData
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getUserSettingsByKey = getUserSettingsByKey;
const getSystemParameter =
/* GraphQL */
`
  query GetSystemParameter($key: String!) {
    getSystemParameter(key: $key) {
      id
      key
      paramData
      createdAt
      updatedAt
    }
  }
`;
exports.getSystemParameter = getSystemParameter;
const listSystemParameters =
/* GraphQL */
`
  query ListSystemParameters(
    $key: String
    $filter: ModelSystemParameterFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listSystemParameters(
      key: $key
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        key
        paramData
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listSystemParameters = listSystemParameters;
const listLearningAreas =
/* GraphQL */
`
  query ListLearningAreas(
    $filter: ModelLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLearningAreas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        areaName
        colour
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listLearningAreas = listLearningAreas;
const getLearningArea =
/* GraphQL */
`
  query GetLearningArea($id: ID!) {
    getLearningArea(id: $id) {
      id
      areaName
      colour
      createdAt
      updatedAt
    }
  }
`;
exports.getLearningArea = getLearningArea;
const learningAreaByName =
/* GraphQL */
`
  query LearningAreaByName(
    $areaName: String
    $sortDirection: ModelSortDirection
    $filter: ModelLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    learningAreaByName(
      areaName: $areaName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        areaName
        colour
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.learningAreaByName = learningAreaByName;
const listAcStrands =
/* GraphQL */
`
  query ListAcStrands(
    $filter: ModelAcStrandFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAcStrands(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        strandName
        learningAreaID
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        substrands {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.listAcStrands = listAcStrands;
const getAcStrand =
/* GraphQL */
`
  query GetAcStrand($id: ID!) {
    getAcStrand(id: $id) {
      id
      strandName
      learningAreaID
      createdAt
      updatedAt
      learningArea {
        id
        areaName
        colour
        createdAt
        updatedAt
      }
      substrands {
        items {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
exports.getAcStrand = getAcStrand;
const strandByName =
/* GraphQL */
`
  query StrandByName(
    $strandName: String
    $sortDirection: ModelSortDirection
    $filter: ModelAcStrandFilterInput
    $limit: Int
    $nextToken: String
  ) {
    strandByName(
      strandName: $strandName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        strandName
        learningAreaID
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        substrands {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.strandByName = strandByName;
const strandByLearningArea =
/* GraphQL */
`
  query StrandByLearningArea(
    $learningAreaID: ID
    $strandName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAcStrandFilterInput
    $limit: Int
    $nextToken: String
  ) {
    strandByLearningArea(
      learningAreaID: $learningAreaID
      strandName: $strandName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        strandName
        learningAreaID
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        substrands {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.strandByLearningArea = strandByLearningArea;
const listAcSubstrands =
/* GraphQL */
`
  query ListAcSubstrands(
    $filter: ModelAcSubstrandFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAcSubstrands(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        substrandName
        strandID
        image {
          bucket
          region
          key
        }
        createdAt
        updatedAt
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.listAcSubstrands = listAcSubstrands;
const getAcSubstrand =
/* GraphQL */
`
  query GetAcSubstrand($id: ID!) {
    getAcSubstrand(id: $id) {
      id
      substrandName
      strandID
      image {
        bucket
        region
        key
      }
      createdAt
      updatedAt
      strand {
        id
        strandName
        learningAreaID
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        substrands {
          nextToken
        }
      }
    }
  }
`;
exports.getAcSubstrand = getAcSubstrand;
const substrandByName =
/* GraphQL */
`
  query SubstrandByName(
    $substrandName: String
    $sortDirection: ModelSortDirection
    $filter: ModelAcSubstrandFilterInput
    $limit: Int
    $nextToken: String
  ) {
    substrandByName(
      substrandName: $substrandName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        substrandName
        strandID
        image {
          bucket
          region
          key
        }
        createdAt
        updatedAt
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.substrandByName = substrandByName;
const substrandByStrand =
/* GraphQL */
`
  query SubstrandByStrand(
    $strandID: ID
    $substrandName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAcSubstrandFilterInput
    $limit: Int
    $nextToken: String
  ) {
    substrandByStrand(
      strandID: $strandID
      substrandName: $substrandName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        substrandName
        strandID
        image {
          bucket
          region
          key
        }
        createdAt
        updatedAt
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.substrandByStrand = substrandByStrand;
const listYearLevels =
/* GraphQL */
`
  query ListYearLevels(
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
exports.listYearLevels = listYearLevels;
const getYearLevel =
/* GraphQL */
`
  query GetYearLevel($id: ID!) {
    getYearLevel(id: $id) {
      id
      yearCode
      description
      type
      createdAt
      updatedAt
    }
  }
`;
exports.getYearLevel = getYearLevel;
const getYearLevelsByCode =
/* GraphQL */
`
  query GetYearLevelsByCode(
    $type: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelYearLevelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getYearLevelsByCode(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
exports.getYearLevelsByCode = getYearLevelsByCode;
const getYearCode =
/* GraphQL */
`
  query GetYearCode(
    $type: String
    $yearCode: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelYearLevelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getYearCode(
      type: $type
      yearCode: $yearCode
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
exports.getYearCode = getYearCode;
const getYearByDescription =
/* GraphQL */
`
  query GetYearByDescription(
    $type: String
    $description: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelYearLevelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getYearByDescription(
      type: $type
      description: $description
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
exports.getYearByDescription = getYearByDescription;
const listAcCodes =
/* GraphQL */
`
  query ListAcCodes(
    $filter: ModelAcCodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAcCodes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        acCode
        strandID
        substrandID
        yearLevelID
        learningAreaID
        curriculumEntry
        skill
        criteria
        elaboration
        type
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        substrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.listAcCodes = listAcCodes;
const getAcCode =
/* GraphQL */
`
  query GetAcCode($id: ID!) {
    getAcCode(id: $id) {
      id
      acCode
      strandID
      substrandID
      yearLevelID
      learningAreaID
      curriculumEntry
      skill
      criteria
      elaboration
      type
      createdAt
      updatedAt
      learningArea {
        id
        areaName
        colour
        createdAt
        updatedAt
      }
      strand {
        id
        strandName
        learningAreaID
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        substrands {
          nextToken
        }
      }
      substrand {
        id
        substrandName
        strandID
        image {
          bucket
          region
          key
        }
        createdAt
        updatedAt
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
      }
      yearLevel {
        id
        yearCode
        description
        type
        createdAt
        updatedAt
      }
    }
  }
`;
exports.getAcCode = getAcCode;
const acCodeByCode =
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
        strandID
        substrandID
        yearLevelID
        learningAreaID
        curriculumEntry
        skill
        criteria
        elaboration
        type
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        substrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.acCodeByCode = acCodeByCode;
const getAcCodeSorted =
/* GraphQL */
`
  query GetAcCodeSorted(
    $type: String
    $acCode: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAcCodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getAcCodeSorted(
      type: $type
      acCode: $acCode
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCode
        strandID
        substrandID
        yearLevelID
        learningAreaID
        curriculumEntry
        skill
        criteria
        elaboration
        type
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        substrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getAcCodeSorted = getAcCodeSorted;
const acCodeByStrand =
/* GraphQL */
`
  query AcCodeByStrand(
    $strandID: ID
    $acCode: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAcCodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    acCodeByStrand(
      strandID: $strandID
      acCode: $acCode
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCode
        strandID
        substrandID
        yearLevelID
        learningAreaID
        curriculumEntry
        skill
        criteria
        elaboration
        type
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        substrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.acCodeByStrand = acCodeByStrand;
const acCodeBySubstrand =
/* GraphQL */
`
  query AcCodeBySubstrand(
    $substrandID: ID
    $acCode: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAcCodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    acCodeBySubstrand(
      substrandID: $substrandID
      acCode: $acCode
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCode
        strandID
        substrandID
        yearLevelID
        learningAreaID
        curriculumEntry
        skill
        criteria
        elaboration
        type
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        substrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.acCodeBySubstrand = acCodeBySubstrand;
const acCodeByYearLevel =
/* GraphQL */
`
  query AcCodeByYearLevel(
    $yearLevelID: ID
    $acCode: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAcCodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    acCodeByYearLevel(
      yearLevelID: $yearLevelID
      acCode: $acCode
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCode
        strandID
        substrandID
        yearLevelID
        learningAreaID
        curriculumEntry
        skill
        criteria
        elaboration
        type
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        substrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.acCodeByYearLevel = acCodeByYearLevel;
const acCodeByCurriculumEntry =
/* GraphQL */
`
  query AcCodeByCurriculumEntry(
    $curriculumEntry: String
    $acCode: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAcCodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    acCodeByCurriculumEntry(
      curriculumEntry: $curriculumEntry
      acCode: $acCode
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCode
        strandID
        substrandID
        yearLevelID
        learningAreaID
        curriculumEntry
        skill
        criteria
        elaboration
        type
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        substrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.acCodeByCurriculumEntry = acCodeByCurriculumEntry;
const getAcCodeByLearningArea =
/* GraphQL */
`
  query GetAcCodeByLearningArea(
    $learningAreaID: ID
    $acCode: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAcCodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getAcCodeByLearningArea(
      learningAreaID: $learningAreaID
      acCode: $acCode
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCode
        strandID
        substrandID
        yearLevelID
        learningAreaID
        curriculumEntry
        skill
        criteria
        elaboration
        type
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        substrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getAcCodeByLearningArea = getAcCodeByLearningArea;
const getAcCodeByLearningAreaByYear =
/* GraphQL */
`
  query GetAcCodeByLearningAreaByYear(
    $learningAreaID: ID
    $yearLevelID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAcCodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getAcCodeByLearningAreaByYear(
      learningAreaID: $learningAreaID
      yearLevelID: $yearLevelID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        acCode
        strandID
        substrandID
        yearLevelID
        learningAreaID
        curriculumEntry
        skill
        criteria
        elaboration
        type
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        substrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getAcCodeByLearningAreaByYear = getAcCodeByLearningAreaByYear;
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
        createdAt
        updatedAt
        schools {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.listSchoolNetworks = listSchoolNetworks;
const getSchoolNetwork =
/* GraphQL */
`
  query GetSchoolNetwork($id: ID!) {
    getSchoolNetwork(id: $id) {
      id
      networkName
      createdAt
      updatedAt
      schools {
        items {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
exports.getSchoolNetwork = getSchoolNetwork;
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
        createdAt
        updatedAt
        schools {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getNetworkByName = getNetworkByName;
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
        dummy
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
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
        schoolNetwork {
          id
          networkName
          createdAt
          updatedAt
        }
        attributeCategories {
          nextToken
        }
        schoolIcseas {
          nextToken
        }
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
        state {
          id
          name
          stateCode
          countryID
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.listSchools = listSchools;
const getSchool =
/* GraphQL */
`
  query GetSchool($id: ID!) {
    getSchool(id: $id) {
      id
      dummy
      schoolName
      motto
      studentLoginEnabled
      ealdProgress
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
      schoolNetwork {
        id
        networkName
        createdAt
        updatedAt
        schools {
          nextToken
        }
      }
      attributeCategories {
        items {
          id
          schoolID
          categoryName
          createdAt
          updatedAt
        }
        nextToken
      }
      schoolIcseas {
        items {
          id
          schoolID
          schoolYear
          icsea
          createdAt
          updatedAt
        }
        nextToken
      }
      country {
        id
        name
        countryCode
        createdAt
        updatedAt
        states {
          nextToken
        }
      }
      state {
        id
        name
        stateCode
        countryID
        createdAt
        updatedAt
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
      }
      students {
        items {
          id
          schoolID
          studentID
          schoolYear
          yearLevelID
          firstName
          lastName
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
exports.getSchool = getSchool;
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
        dummy
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
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
        schoolNetwork {
          id
          networkName
          createdAt
          updatedAt
        }
        attributeCategories {
          nextToken
        }
        schoolIcseas {
          nextToken
        }
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
        state {
          id
          name
          stateCode
          countryID
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolByName = getSchoolByName;
const getSchoolsByNetwork =
/* GraphQL */
`
  query GetSchoolsByNetwork(
    $networkID: ID
    $schoolName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getSchoolsByNetwork(
      networkID: $networkID
      schoolName: $schoolName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        dummy
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
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
        schoolNetwork {
          id
          networkName
          createdAt
          updatedAt
        }
        attributeCategories {
          nextToken
        }
        schoolIcseas {
          nextToken
        }
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
        state {
          id
          name
          stateCode
          countryID
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolsByNetwork = getSchoolsByNetwork;
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
        dummy
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
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
        schoolNetwork {
          id
          networkName
          createdAt
          updatedAt
        }
        attributeCategories {
          nextToken
        }
        schoolIcseas {
          nextToken
        }
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
        state {
          id
          name
          stateCode
          countryID
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolsSorted = getSchoolsSorted;
const listSchoolAttributeCategorys =
/* GraphQL */
`
  query ListSchoolAttributeCategorys(
    $filter: ModelSchoolAttributeCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSchoolAttributeCategorys(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        categoryName
        createdAt
        updatedAt
        attributes {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.listSchoolAttributeCategorys = listSchoolAttributeCategorys;
const getSchoolAttributeCategory =
/* GraphQL */
`
  query GetSchoolAttributeCategory($id: ID!) {
    getSchoolAttributeCategory(id: $id) {
      id
      schoolID
      categoryName
      createdAt
      updatedAt
      attributes {
        items {
          id
          schoolID
          categoryID
          attributeName
          attributeType
          defaultValue
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
exports.getSchoolAttributeCategory = getSchoolAttributeCategory;
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
        createdAt
        updatedAt
        attributes {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getAttributeCategoriesBySchool = getAttributeCategoriesBySchool;
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
        createdAt
        updatedAt
        attributes {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getAttributeCategoryBySchoolByName = getAttributeCategoryBySchoolByName;
const listSchoolStudentAttributes =
/* GraphQL */
`
  query ListSchoolStudentAttributes(
    $filter: ModelSchoolStudentAttributeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSchoolStudentAttributes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        categoryID
        attributeName
        attributeType
        defaultValue
        createdAt
        updatedAt
        category {
          id
          schoolID
          categoryName
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.listSchoolStudentAttributes = listSchoolStudentAttributes;
const getSchoolStudentAttribute =
/* GraphQL */
`
  query GetSchoolStudentAttribute($id: ID!) {
    getSchoolStudentAttribute(id: $id) {
      id
      schoolID
      categoryID
      attributeName
      attributeType
      defaultValue
      createdAt
      updatedAt
      category {
        id
        schoolID
        categoryName
        createdAt
        updatedAt
        attributes {
          nextToken
        }
      }
    }
  }
`;
exports.getSchoolStudentAttribute = getSchoolStudentAttribute;
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
        attributeName
        attributeType
        defaultValue
        createdAt
        updatedAt
        category {
          id
          schoolID
          categoryName
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getStudentAttributesBySchool = getStudentAttributesBySchool;
const getStudentAttributesBySchoolCategory =
/* GraphQL */
`
  query GetStudentAttributesBySchoolCategory(
    $categoryID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentAttributeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStudentAttributesBySchoolCategory(
      categoryID: $categoryID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        categoryID
        attributeName
        attributeType
        defaultValue
        createdAt
        updatedAt
        category {
          id
          schoolID
          categoryName
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getStudentAttributesBySchoolCategory = getStudentAttributesBySchoolCategory;
const getStudentAttributeByCategoryByName =
/* GraphQL */
`
  query GetStudentAttributeByCategoryByName(
    $categoryID: ID
    $attributeName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolStudentAttributeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStudentAttributeByCategoryByName(
      categoryID: $categoryID
      attributeName: $attributeName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        schoolID
        categoryID
        attributeName
        attributeType
        defaultValue
        createdAt
        updatedAt
        category {
          id
          schoolID
          categoryName
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getStudentAttributeByCategoryByName = getStudentAttributeByCategoryByName;
const getSchoolIcsea =
/* GraphQL */
`
  query GetSchoolIcsea($id: ID!) {
    getSchoolIcsea(id: $id) {
      id
      schoolID
      schoolYear
      icsea
      createdAt
      updatedAt
    }
  }
`;
exports.getSchoolIcsea = getSchoolIcsea;
const listSchoolIcseas =
/* GraphQL */
`
  query ListSchoolIcseas(
    $filter: ModelSchoolIcseaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSchoolIcseas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        schoolID
        schoolYear
        icsea
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listSchoolIcseas = listSchoolIcseas;
const getIcseaBySchool =
/* GraphQL */
`
  query GetIcseaBySchool(
    $schoolID: ID
    $schoolYear: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSchoolIcseaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getIcseaBySchool(
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
        schoolYear
        icsea
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getIcseaBySchool = getIcseaBySchool;
const listCountrys =
/* GraphQL */
`
  query ListCountrys(
    $filter: ModelCountryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCountrys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        countryCode
        createdAt
        updatedAt
        states {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.listCountrys = listCountrys;
const getCountry =
/* GraphQL */
`
  query GetCountry($id: ID!) {
    getCountry(id: $id) {
      id
      name
      countryCode
      createdAt
      updatedAt
      states {
        items {
          id
          name
          stateCode
          countryID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
exports.getCountry = getCountry;
const getState =
/* GraphQL */
`
  query GetState($id: ID!) {
    getState(id: $id) {
      id
      name
      stateCode
      countryID
      createdAt
      updatedAt
      country {
        id
        name
        countryCode
        createdAt
        updatedAt
        states {
          nextToken
        }
      }
    }
  }
`;
exports.getState = getState;
const listStates =
/* GraphQL */
`
  query ListStates(
    $filter: ModelStateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        stateCode
        countryID
        createdAt
        updatedAt
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.listStates = listStates;
const listClassrooms =
/* GraphQL */
`
  query ListClassrooms(
    $filter: ModelClassroomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassrooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classType
        focusGroupType
        className
        schoolYear
        schoolID
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        yearLevels {
          nextToken
        }
        teachers {
          nextToken
        }
        learningAreas {
          nextToken
        }
        students {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.listClassrooms = listClassrooms;
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
      createdAt
      updatedAt
      school {
        id
        dummy
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
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
        schoolNetwork {
          id
          networkName
          createdAt
          updatedAt
        }
        attributeCategories {
          nextToken
        }
        schoolIcseas {
          nextToken
        }
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
        state {
          id
          name
          stateCode
          countryID
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
      }
      yearLevels {
        items {
          id
          classroomID
          schoolID
          yearLevelID
          createdAt
          updatedAt
        }
        nextToken
      }
      teachers {
        items {
          id
          classroomID
          email
          createdAt
          updatedAt
        }
        nextToken
      }
      learningAreas {
        items {
          id
          classroomID
          learningAreaID
          createdAt
          updatedAt
        }
        nextToken
      }
      students {
        items {
          id
          classroomID
          studentID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
exports.getClassroom = getClassroom;
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
        classType
        focusGroupType
        className
        schoolYear
        schoolID
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        yearLevels {
          nextToken
        }
        teachers {
          nextToken
        }
        learningAreas {
          nextToken
        }
        students {
          nextToken
        }
      }
      nextToken
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
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        yearLevels {
          nextToken
        }
        teachers {
          nextToken
        }
        learningAreas {
          nextToken
        }
        students {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getClassesByTypeByYear = getClassesByTypeByYear;
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
        classType
        focusGroupType
        className
        schoolYear
        schoolID
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        yearLevels {
          nextToken
        }
        teachers {
          nextToken
        }
        learningAreas {
          nextToken
        }
        students {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getClassByNameByYear = getClassByNameByYear;
const getClassroomYearLevel =
/* GraphQL */
`
  query GetClassroomYearLevel($id: ID!) {
    getClassroomYearLevel(id: $id) {
      id
      classroomID
      schoolID
      yearLevelID
      createdAt
      updatedAt
      yearLevel {
        id
        yearCode
        description
        type
        createdAt
        updatedAt
      }
      school {
        id
        dummy
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
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
        schoolNetwork {
          id
          networkName
          createdAt
          updatedAt
        }
        attributeCategories {
          nextToken
        }
        schoolIcseas {
          nextToken
        }
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
        state {
          id
          name
          stateCode
          countryID
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
      }
      classroom {
        id
        classType
        focusGroupType
        className
        schoolYear
        schoolID
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        yearLevels {
          nextToken
        }
        teachers {
          nextToken
        }
        learningAreas {
          nextToken
        }
        students {
          nextToken
        }
      }
    }
  }
`;
exports.getClassroomYearLevel = getClassroomYearLevel;
const listClassroomYearLevels =
/* GraphQL */
`
  query ListClassroomYearLevels(
    $filter: ModelClassroomYearLevelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomYearLevels(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomID
        schoolID
        yearLevelID
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        classroom {
          id
          classType
          focusGroupType
          className
          schoolYear
          schoolID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.listClassroomYearLevels = listClassroomYearLevels;
const getClassroomYearLevels =
/* GraphQL */
`
  query GetClassroomYearLevels(
    $classroomID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomYearLevelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getClassroomYearLevels(
      classroomID: $classroomID
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
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        classroom {
          id
          classType
          focusGroupType
          className
          schoolYear
          schoolID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getClassroomYearLevels = getClassroomYearLevels;
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
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        classroom {
          id
          classType
          focusGroupType
          className
          schoolYear
          schoolID
          createdAt
          updatedAt
        }
      }
      nextToken
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
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        classroom {
          id
          classType
          focusGroupType
          className
          schoolYear
          schoolID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getClassroomYearLevelById = getClassroomYearLevelById;
const getClassroomTeacher =
/* GraphQL */
`
  query GetClassroomTeacher($id: ID!) {
    getClassroomTeacher(id: $id) {
      id
      classroomID
      email
      createdAt
      updatedAt
      user {
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
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
      }
      classroom {
        id
        classType
        focusGroupType
        className
        schoolYear
        schoolID
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        yearLevels {
          nextToken
        }
        teachers {
          nextToken
        }
        learningAreas {
          nextToken
        }
        students {
          nextToken
        }
      }
    }
  }
`;
exports.getClassroomTeacher = getClassroomTeacher;
const listClassroomTeachers =
/* GraphQL */
`
  query ListClassroomTeachers(
    $filter: ModelClassroomTeacherFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomTeachers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomID
        email
        createdAt
        updatedAt
        user {
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
          createdAt
          updatedAt
        }
        classroom {
          id
          classType
          focusGroupType
          className
          schoolYear
          schoolID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.listClassroomTeachers = listClassroomTeachers;
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
        createdAt
        updatedAt
        user {
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
          createdAt
          updatedAt
        }
        classroom {
          id
          classType
          focusGroupType
          className
          schoolYear
          schoolID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getClassTeachers = getClassTeachers;
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
        classroomID
        email
        createdAt
        updatedAt
        user {
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
          createdAt
          updatedAt
        }
        classroom {
          id
          classType
          focusGroupType
          className
          schoolYear
          schoolID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getTeacherClassrooms = getTeacherClassrooms;
const getClassroomLearningArea =
/* GraphQL */
`
  query GetClassroomLearningArea($id: ID!) {
    getClassroomLearningArea(id: $id) {
      id
      classroomID
      learningAreaID
      createdAt
      updatedAt
      learningArea {
        id
        areaName
        colour
        createdAt
        updatedAt
      }
      classroom {
        id
        classType
        focusGroupType
        className
        schoolYear
        schoolID
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        yearLevels {
          nextToken
        }
        teachers {
          nextToken
        }
        learningAreas {
          nextToken
        }
        students {
          nextToken
        }
      }
    }
  }
`;
exports.getClassroomLearningArea = getClassroomLearningArea;
const listClassroomLearningAreas =
/* GraphQL */
`
  query ListClassroomLearningAreas(
    $filter: ModelClassroomLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomLearningAreas(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomID
        learningAreaID
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        classroom {
          id
          classType
          focusGroupType
          className
          schoolYear
          schoolID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.listClassroomLearningAreas = listClassroomLearningAreas;
const getClassroomStudent =
/* GraphQL */
`
  query GetClassroomStudent($id: ID!) {
    getClassroomStudent(id: $id) {
      id
      classroomID
      studentID
      createdAt
      updatedAt
      classroom {
        id
        classType
        focusGroupType
        className
        schoolYear
        schoolID
        createdAt
        updatedAt
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        yearLevels {
          nextToken
        }
        teachers {
          nextToken
        }
        learningAreas {
          nextToken
        }
        students {
          nextToken
        }
      }
      student {
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
        createdAt
        updatedAt
        currentYear {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        classrooms {
          nextToken
        }
        schoolYears {
          nextToken
        }
        studentData {
          nextToken
        }
      }
    }
  }
`;
exports.getClassroomStudent = getClassroomStudent;
const listClassroomStudents =
/* GraphQL */
`
  query ListClassroomStudents(
    $filter: ModelClassroomStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomStudents(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomID
        studentID
        createdAt
        updatedAt
        classroom {
          id
          classType
          focusGroupType
          className
          schoolYear
          schoolID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.listClassroomStudents = listClassroomStudents;
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
        createdAt
        updatedAt
        classroom {
          id
          classType
          focusGroupType
          className
          schoolYear
          schoolID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getStudentsByClassroom = getStudentsByClassroom;
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
      firstName
      lastName
      userId
      createdAt
      updatedAt
      yearLevel {
        id
        yearCode
        description
        type
        createdAt
        updatedAt
      }
      school {
        id
        dummy
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
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
        schoolNetwork {
          id
          networkName
          createdAt
          updatedAt
        }
        attributeCategories {
          nextToken
        }
        schoolIcseas {
          nextToken
        }
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
        state {
          id
          name
          stateCode
          countryID
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
      }
      student {
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
        createdAt
        updatedAt
        currentYear {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        classrooms {
          nextToken
        }
        schoolYears {
          nextToken
        }
        studentData {
          nextToken
        }
      }
    }
  }
`;
exports.getSchoolStudent = getSchoolStudent;
const listSchoolStudents =
/* GraphQL */
`
  query ListSchoolStudents(
    $filter: ModelSchoolStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSchoolStudents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        schoolID
        studentID
        schoolYear
        yearLevelID
        firstName
        lastName
        userId
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.listSchoolStudents = listSchoolStudents;
const getStudentBySchool =
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
        firstName
        lastName
        userId
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getStudentBySchool = getStudentBySchool;
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
        firstName
        lastName
        userId
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolStudentsByYear = getSchoolStudentsByYear;
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
        firstName
        lastName
        userId
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolStudentsByYearAndYearLevel = getSchoolStudentsByYearAndYearLevel;
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
        firstName
        lastName
        userId
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
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
        firstName
        lastName
        userId
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
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
        firstName
        lastName
        userId
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
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
        firstName
        lastName
        userId
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getSchoolStudentsByYearAndLevelAndLastName = getSchoolStudentsByYearAndLevelAndLastName;
const getStudentSchools =
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
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getStudentSchools = getStudentSchools;
const listStudents =
/* GraphQL */
`
  query ListStudents(
    $filter: ModelStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStudents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        currentYear {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        classrooms {
          nextToken
        }
        schoolYears {
          nextToken
        }
        studentData {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.listStudents = listStudents;
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
      createdAt
      updatedAt
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
          id
          classroomID
          studentID
          createdAt
          updatedAt
        }
        nextToken
      }
      schoolYears {
        items {
          id
          schoolID
          studentID
          schoolYear
          yearLevelID
          firstName
          lastName
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
      studentData {
        items {
          id
          studentID
          schoolYear
          attributeID
          value
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
exports.getStudent = getStudent;
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
        gender
        birthDate
        photo {
          bucket
          region
          key
        }
        yearLevelID
        createdAt
        updatedAt
        currentYear {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        classrooms {
          nextToken
        }
        schoolYears {
          nextToken
        }
        studentData {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getStudentByNameByBirthDate = getStudentByNameByBirthDate;
const getStudentData =
/* GraphQL */
`
  query GetStudentData($id: ID!) {
    getStudentData(id: $id) {
      id
      studentID
      schoolYear
      attributeID
      value
      createdAt
      updatedAt
      attribute {
        id
        schoolID
        categoryID
        attributeName
        attributeType
        defaultValue
        createdAt
        updatedAt
        category {
          id
          schoolID
          categoryName
          createdAt
          updatedAt
        }
      }
      student {
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
        createdAt
        updatedAt
        currentYear {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        classrooms {
          nextToken
        }
        schoolYears {
          nextToken
        }
        studentData {
          nextToken
        }
      }
    }
  }
`;
exports.getStudentData = getStudentData;
const listStudentDatas =
/* GraphQL */
`
  query ListStudentDatas(
    $filter: ModelStudentDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStudentDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        studentID
        schoolYear
        attributeID
        value
        createdAt
        updatedAt
        attribute {
          id
          schoolID
          categoryID
          attributeName
          attributeType
          defaultValue
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.listStudentDatas = listStudentDatas;
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
        createdAt
        updatedAt
        attribute {
          id
          schoolID
          categoryID
          attributeName
          attributeType
          defaultValue
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getStudentDataByYear = getStudentDataByYear;
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
        schoolYear
        attributeID
        value
        createdAt
        updatedAt
        attribute {
          id
          schoolID
          categoryID
          attributeName
          attributeType
          defaultValue
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
exports.getStudentDataByAttributeByYear = getStudentDataByAttributeByYear;
const getNotification =
/* GraphQL */
`
  query GetNotification($id: ID!) {
    getNotification(id: $id) {
      id
      type
      sysType
      message
      recipient
      sender
      read
      readDate
      createdAt
      expiryTime
      updatedAt
    }
  }
`;
exports.getNotification = getNotification;
const listNotifications =
/* GraphQL */
`
  query ListNotifications(
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        sysType
        message
        recipient
        sender
        read
        readDate
        createdAt
        expiryTime
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listNotifications = listNotifications;
const getNotificationsByRecipient =
/* GraphQL */
`
  query GetNotificationsByRecipient(
    $recipient: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getNotificationsByRecipient(
      recipient: $recipient
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        sysType
        message
        recipient
        sender
        read
        readDate
        createdAt
        expiryTime
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getNotificationsByRecipient = getNotificationsByRecipient;
const listNotificationsByDate =
/* GraphQL */
`
  query ListNotificationsByDate(
    $sysType: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotificationsByDate(
      sysType: $sysType
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        sysType
        message
        recipient
        sender
        read
        readDate
        createdAt
        expiryTime
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listNotificationsByDate = listNotificationsByDate;
const getQuestion =
/* GraphQL */
`
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      acCodeID
      yearLevelID
      learningAreaID
      strandID
      substrandID
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
      createdAt
      updatedAt
      learningArea {
        id
        areaName
        colour
        createdAt
        updatedAt
      }
      strand {
        id
        strandName
        learningAreaID
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        substrands {
          nextToken
        }
      }
      subStrand {
        id
        substrandName
        strandID
        image {
          bucket
          region
          key
        }
        createdAt
        updatedAt
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
      }
      yearLevel {
        id
        yearCode
        description
        type
        createdAt
        updatedAt
      }
      acCode {
        id
        acCode
        strandID
        substrandID
        yearLevelID
        learningAreaID
        curriculumEntry
        skill
        criteria
        elaboration
        type
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        substrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
      }
      answers {
        items {
          id
          questionID
          text
          correct
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
exports.getQuestion = getQuestion;
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
        yearLevelID
        learningAreaID
        strandID
        substrandID
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
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        subStrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        acCode {
          id
          acCode
          strandID
          substrandID
          yearLevelID
          learningAreaID
          curriculumEntry
          skill
          criteria
          elaboration
          type
          createdAt
          updatedAt
        }
        answers {
          nextToken
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
        yearLevelID
        learningAreaID
        strandID
        substrandID
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
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        subStrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        acCode {
          id
          acCode
          strandID
          substrandID
          yearLevelID
          learningAreaID
          curriculumEntry
          skill
          criteria
          elaboration
          type
          createdAt
          updatedAt
        }
        answers {
          nextToken
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
        yearLevelID
        learningAreaID
        strandID
        substrandID
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
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        subStrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        acCode {
          id
          acCode
          strandID
          substrandID
          yearLevelID
          learningAreaID
          curriculumEntry
          skill
          criteria
          elaboration
          type
          createdAt
          updatedAt
        }
        answers {
          nextToken
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
        yearLevelID
        learningAreaID
        strandID
        substrandID
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
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        subStrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        acCode {
          id
          acCode
          strandID
          substrandID
          yearLevelID
          learningAreaID
          curriculumEntry
          skill
          criteria
          elaboration
          type
          createdAt
          updatedAt
        }
        answers {
          nextToken
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
        yearLevelID
        learningAreaID
        strandID
        substrandID
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
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        subStrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        acCode {
          id
          acCode
          strandID
          substrandID
          yearLevelID
          learningAreaID
          curriculumEntry
          skill
          criteria
          elaboration
          type
          createdAt
          updatedAt
        }
        answers {
          nextToken
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
        yearLevelID
        learningAreaID
        strandID
        substrandID
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
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        subStrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        acCode {
          id
          acCode
          strandID
          substrandID
          yearLevelID
          learningAreaID
          curriculumEntry
          skill
          criteria
          elaboration
          type
          createdAt
          updatedAt
        }
        answers {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getQuestionsBySubtrand = getQuestionsBySubtrand;
const getAnswer =
/* GraphQL */
`
  query GetAnswer($id: ID!) {
    getAnswer(id: $id) {
      id
      questionID
      text
      image {
        bucket
        region
        key
      }
      correct
      createdAt
      updatedAt
    }
  }
`;
exports.getAnswer = getAnswer;
const listAnswers =
/* GraphQL */
`
  query ListAnswers(
    $filter: ModelAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        questionID
        text
        image {
          bucket
          region
          key
        }
        correct
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listAnswers = listAnswers;
const listTestTypes =
/* GraphQL */
`
  query ListTestTypes(
    $filter: ModelTestTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTestTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        typeName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listTestTypes = listTestTypes;
const getTestType =
/* GraphQL */
`
  query GetTestType($id: ID!) {
    getTestType(id: $id) {
      id
      typeName
      createdAt
      updatedAt
    }
  }
`;
exports.getTestType = getTestType;
const getTestTypeByName =
/* GraphQL */
`
  query GetTestTypeByName(
    $typeName: String
    $sortDirection: ModelSortDirection
    $filter: ModelTestTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestTypeByName(
      typeName: $typeName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        typeName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getTestTypeByName = getTestTypeByName;
const listTestUnits =
/* GraphQL */
`
  query ListTestUnits(
    $filter: ModelTestUnitFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTestUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        unitName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.listTestUnits = listTestUnits;
const getTestUnit =
/* GraphQL */
`
  query GetTestUnit($id: ID!) {
    getTestUnit(id: $id) {
      id
      unitName
      createdAt
      updatedAt
    }
  }
`;
exports.getTestUnit = getTestUnit;
const getTestUnitByName =
/* GraphQL */
`
  query GetTestUnitByName(
    $unitName: String
    $sortDirection: ModelSortDirection
    $filter: ModelTestUnitFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestUnitByName(
      unitName: $unitName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        unitName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getTestUnitByName = getTestUnitByName;
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
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        questions {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.listTests = listTests;
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
        type
        createdAt
        updatedAt
      }
      testType {
        id
        typeName
        createdAt
        updatedAt
      }
      testUnit {
        id
        unitName
        createdAt
        updatedAt
      }
      learningAreas {
        items {
          id
          testID
          learningAreaID
          createdAt
          updatedAt
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
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
exports.getTest = getTest;
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
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        questions {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestsByType = getTestsByType;
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
          description
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
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
const searchTestsByName =
/* GraphQL */
`
  query SearchTestsByName(
    $dataType: String
    $sortDirection: ModelSortDirection
    $filter: ModelTestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    searchTestsByName(
      dataType: $dataType
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
          description
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        questions {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.searchTestsByName = searchTestsByName;
const getTestsByYear =
/* GraphQL */
`
  query GetTestsByYear(
    $year: Int
    $sortDirection: ModelSortDirection
    $filter: ModelTestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestsByYear(
      year: $year
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
          description
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        questions {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestsByYear = getTestsByYear;
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
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        questions {
          nextToken
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
        createdAt
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        questions {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestsByTypeByYearLevel = getTestsByTypeByYearLevel;
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
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        questions {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestsSortedByName = getTestsSortedByName;
const getTestLearningArea =
/* GraphQL */
`
  query GetTestLearningArea($id: ID!) {
    getTestLearningArea(id: $id) {
      id
      testID
      learningAreaID
      createdAt
      updatedAt
      learningArea {
        id
        areaName
        colour
        createdAt
        updatedAt
      }
      test {
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
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        questions {
          nextToken
        }
      }
    }
  }
`;
exports.getTestLearningArea = getTestLearningArea;
const listTestLearningAreas =
/* GraphQL */
`
  query ListTestLearningAreas(
    $filter: ModelTestLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTestLearningAreas(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testID
        learningAreaID
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        test {
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
        }
      }
      nextToken
    }
  }
`;
exports.listTestLearningAreas = listTestLearningAreas;
const getLearningAreasByTest =
/* GraphQL */
`
  query GetLearningAreasByTest(
    $testID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTestLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getLearningAreasByTest(
      testID: $testID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testID
        learningAreaID
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        test {
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
        }
      }
      nextToken
    }
  }
`;
exports.getLearningAreasByTest = getLearningAreasByTest;
const getTestsByLearingArea =
/* GraphQL */
`
  query GetTestsByLearingArea(
    $learningAreaID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTestLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestsByLearingArea(
      learningAreaID: $learningAreaID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        testID
        learningAreaID
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        test {
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
        }
      }
      nextToken
    }
  }
`;
exports.getTestsByLearingArea = getTestsByLearingArea;
const listTestQuestions =
/* GraphQL */
`
  query ListTestQuestions(
    $filter: ModelTestQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTestQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
          strandID
          substrandID
          yearLevelID
          learningAreaID
          curriculumEntry
          skill
          criteria
          elaboration
          type
          createdAt
          updatedAt
        }
        test {
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
        }
      }
      nextToken
    }
  }
`;
exports.listTestQuestions = listTestQuestions;
const getTestQuestion =
/* GraphQL */
`
  query GetTestQuestion($id: ID!) {
    getTestQuestion(id: $id) {
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
        strandID
        substrandID
        yearLevelID
        learningAreaID
        curriculumEntry
        skill
        criteria
        elaboration
        type
        createdAt
        updatedAt
        learningArea {
          id
          areaName
          colour
          createdAt
          updatedAt
        }
        strand {
          id
          strandName
          learningAreaID
          createdAt
          updatedAt
        }
        substrand {
          id
          substrandName
          strandID
          createdAt
          updatedAt
        }
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
      }
      test {
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
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        questions {
          nextToken
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
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getQuestionsByTest(
      testID: $testID
      createdAt: $createdAt
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
          strandID
          substrandID
          yearLevelID
          learningAreaID
          curriculumEntry
          skill
          criteria
          elaboration
          type
          createdAt
          updatedAt
        }
        test {
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
        }
      }
      nextToken
    }
  }
`;
exports.getQuestionsByTest = getQuestionsByTest;
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
          strandID
          substrandID
          yearLevelID
          learningAreaID
          curriculumEntry
          skill
          criteria
          elaboration
          type
          createdAt
          updatedAt
        }
        test {
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
        }
      }
      nextToken
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
          strandID
          substrandID
          yearLevelID
          learningAreaID
          curriculumEntry
          skill
          criteria
          elaboration
          type
          createdAt
          updatedAt
        }
        test {
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
        }
      }
      nextToken
    }
  }
`;
exports.getQuestionByTestItemId = getQuestionByTestItemId;
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
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testResults {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.listTestUploads = listTestUploads;
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
      updatedAt
      yearLevel {
        id
        yearCode
        description
        type
        createdAt
        updatedAt
      }
      school {
        id
        dummy
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
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
        schoolNetwork {
          id
          networkName
          createdAt
          updatedAt
        }
        attributeCategories {
          nextToken
        }
        schoolIcseas {
          nextToken
        }
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
        state {
          id
          name
          stateCode
          countryID
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
      }
      testType {
        id
        typeName
        createdAt
        updatedAt
      }
      test {
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
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        questions {
          nextToken
        }
      }
      testResults {
        items {
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
        nextToken
      }
    }
  }
`;
exports.getTestUpload = getTestUpload;
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
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testResults {
          nextToken
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
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testResults {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsBySchoolByYearLevel = getTestUploadsBySchoolByYearLevel;
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
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testResults {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsByYear = getTestUploadsByYear;
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
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testResults {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsByTypeByYear = getTestUploadsByTypeByYear;
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
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testResults {
          nextToken
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
        updatedAt
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testResults {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadsBySchoolByYearByYearLevelByType = getTestUploadsBySchoolByYearByYearLevelByType;
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
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testResults {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestUploadByTestByDate = getTestUploadByTestByDate;
const listTestResults =
/* GraphQL */
`
  query ListTestResults(
    $filter: ModelTestResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTestResults(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testUpload {
          id
          testDate
          testID
          typeID
          yearLevelID
          schoolID
          schoolYear
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        resultAnswers {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.listTestResults = listTestResults;
const getTestResult =
/* GraphQL */
`
  query GetTestResult($id: ID!) {
    getTestResult(id: $id) {
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
      yearLevel {
        id
        yearCode
        description
        type
        createdAt
        updatedAt
      }
      school {
        id
        dummy
        schoolName
        motto
        studentLoginEnabled
        ealdProgress
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
        schoolNetwork {
          id
          networkName
          createdAt
          updatedAt
        }
        attributeCategories {
          nextToken
        }
        schoolIcseas {
          nextToken
        }
        country {
          id
          name
          countryCode
          createdAt
          updatedAt
        }
        state {
          id
          name
          stateCode
          countryID
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
      }
      student {
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
        createdAt
        updatedAt
        currentYear {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        classrooms {
          nextToken
        }
        schoolYears {
          nextToken
        }
        studentData {
          nextToken
        }
      }
      testType {
        id
        typeName
        createdAt
        updatedAt
      }
      test {
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
          type
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        testUnit {
          id
          unitName
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        questions {
          nextToken
        }
      }
      testUpload {
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
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testResults {
          nextToken
        }
      }
      learningAreas {
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
          createdAt
          updatedAt
        }
        nextToken
      }
      resultAnswers {
        items {
          id
          testResultID
          testQuestionID
          studentAnswer
          proficiency
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
exports.getTestResult = getTestResult;
const getTestResultsByStudent =
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
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testUpload {
          id
          testDate
          testID
          typeID
          yearLevelID
          schoolID
          schoolYear
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        resultAnswers {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsByStudent = getTestResultsByStudent;
const getTestResultsByTest =
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
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testUpload {
          id
          testDate
          testID
          typeID
          yearLevelID
          schoolID
          schoolYear
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        resultAnswers {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsByTest = getTestResultsByTest;
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
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testUpload {
          id
          testDate
          testID
          typeID
          yearLevelID
          schoolID
          schoolYear
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        resultAnswers {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsByTestUpload = getTestResultsByTestUpload;
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
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testUpload {
          id
          testDate
          testID
          typeID
          yearLevelID
          schoolID
          schoolYear
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        resultAnswers {
          nextToken
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsByTestByStudentByTestDate = getTestResultsByTestByStudentByTestDate;
const getTestResultLearningArea =
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
      createdAt
      updatedAt
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
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testUpload {
          id
          testDate
          testID
          typeID
          yearLevelID
          schoolID
          schoolYear
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        resultAnswers {
          nextToken
        }
      }
    }
  }
`;
exports.getTestResultLearningArea = getTestResultLearningArea;
const listTestResultLearningAreas =
/* GraphQL */
`
  query ListTestResultLearningAreas(
    $filter: ModelTestResultLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTestResultLearningAreas(
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
        createdAt
        updatedAt
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
        }
      }
      nextToken
    }
  }
`;
exports.listTestResultLearningAreas = listTestResultLearningAreas;
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
        createdAt
        updatedAt
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
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsByStudentByAreaByTypeByYear = getTestResultsByStudentByAreaByTypeByYear;
const getTestResultsByYearLevelByAreaByTypeByYear =
/* GraphQL */
`
  query GetTestResultsByYearLevelByAreaByTypeByYear(
    $yearLevelID: ID
    $learningAreaIDTypeIDSchoolYear: ModelTestResultLearningAreaByYearLevelByAreaByTypeByYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestResultLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsByYearLevelByAreaByTypeByYear(
      yearLevelID: $yearLevelID
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
        createdAt
        updatedAt
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
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsByYearLevelByAreaByTypeByYear = getTestResultsByYearLevelByAreaByTypeByYear;
const getTestResultsByStudentByAreaByYear =
/* GraphQL */
`
  query GetTestResultsByStudentByAreaByYear(
    $studentID: ID
    $learningAreaIDSchoolYear: ModelTestResultLearningAreaByStudentByAreaByYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestResultLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsByStudentByAreaByYear(
      studentID: $studentID
      learningAreaIDSchoolYear: $learningAreaIDSchoolYear
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
        createdAt
        updatedAt
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
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsByStudentByAreaByYear = getTestResultsByStudentByAreaByYear;
const getTestResultsByYearLevelByAreaByYear =
/* GraphQL */
`
  query GetTestResultsByYearLevelByAreaByYear(
    $yearLevelID: ID
    $learningAreaIDSchoolYear: ModelTestResultLearningAreaByYearLevelByAreaByYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestResultLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsByYearLevelByAreaByYear(
      yearLevelID: $yearLevelID
      learningAreaIDSchoolYear: $learningAreaIDSchoolYear
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
        createdAt
        updatedAt
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
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsByYearLevelByAreaByYear = getTestResultsByYearLevelByAreaByYear;
const getTestResultsBySchoolByYearLevelByAreaByYear =
/* GraphQL */
`
  query GetTestResultsBySchoolByYearLevelByAreaByYear(
    $schoolID: ID
    $yearLevelIDLearningAreaIDSchoolYear: ModelTestResultLearningAreaBySchoolByYearLevelByAreaByYearCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTestResultLearningAreaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsBySchoolByYearLevelByAreaByYear(
      schoolID: $schoolID
      yearLevelIDLearningAreaIDSchoolYear: $yearLevelIDLearningAreaIDSchoolYear
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
        createdAt
        updatedAt
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
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsBySchoolByYearLevelByAreaByYear = getTestResultsBySchoolByYearLevelByAreaByYear;
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
      createdAt
      updatedAt
      testQuestion {
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
          strandID
          substrandID
          yearLevelID
          learningAreaID
          curriculumEntry
          skill
          criteria
          elaboration
          type
          createdAt
          updatedAt
        }
        test {
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
        yearLevel {
          id
          yearCode
          description
          type
          createdAt
          updatedAt
        }
        school {
          id
          dummy
          schoolName
          motto
          studentLoginEnabled
          ealdProgress
          networkID
          countryID
          stateID
          createdAt
          updatedAt
        }
        student {
          id
          firstName
          middleName
          lastName
          gender
          birthDate
          yearLevelID
          createdAt
          updatedAt
        }
        testType {
          id
          typeName
          createdAt
          updatedAt
        }
        test {
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
        }
        testUpload {
          id
          testDate
          testID
          typeID
          yearLevelID
          schoolID
          schoolYear
          createdAt
          updatedAt
        }
        learningAreas {
          nextToken
        }
        resultAnswers {
          nextToken
        }
      }
    }
  }
`;
exports.getTestResultAnswers = getTestResultAnswers;
const listTestResultAnswerss =
/* GraphQL */
`
  query ListTestResultAnswerss(
    $filter: ModelTestResultAnswersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTestResultAnswerss(
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
        createdAt
        updatedAt
        testQuestion {
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
        }
      }
      nextToken
    }
  }
`;
exports.listTestResultAnswerss = listTestResultAnswerss;
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
        createdAt
        updatedAt
        testQuestion {
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
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsAnswersByTestResult = getTestResultsAnswersByTestResult;
const getTestResultsAnswersByTestQuestion =
/* GraphQL */
`
  query GetTestResultsAnswersByTestQuestion(
    $testQuestionID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTestResultAnswersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTestResultsAnswersByTestQuestion(
      testQuestionID: $testQuestionID
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
        createdAt
        updatedAt
        testQuestion {
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
        }
      }
      nextToken
    }
  }
`;
exports.getTestResultsAnswersByTestQuestion = getTestResultsAnswersByTestQuestion;