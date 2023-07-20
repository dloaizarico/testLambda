"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTestResultLearningArea = exports.deleteTestResult = exports.updateTestResult = exports.createTestResult = exports.deleteTestUpload = exports.updateTestUpload = exports.createTestUpload = exports.deleteTestQuestion = exports.updateTestQuestion = exports.createTestQuestion = exports.deleteTestLearningArea = exports.updateTestLearningArea = exports.createTestLearningArea = exports.deleteTest = exports.updateTest = exports.createTest = exports.deleteTestUnit = exports.updateTestUnit = exports.createTestUnit = exports.deleteTestType = exports.updateTestType = exports.createTestType = exports.deleteAnswer = exports.updateAnswer = exports.createAnswer = exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.deleteNotification = exports.updateNotification = exports.createNotification = exports.deleteStudentData = exports.updateStudentData = exports.createStudentData = exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.deleteSchoolStudent = exports.updateSchoolStudent = exports.createSchoolStudent = exports.deleteClassroomStudent = exports.updateClassroomStudent = exports.createClassroomStudent = exports.deleteClassroomLearningArea = exports.updateClassroomLearningArea = exports.createClassroomLearningArea = exports.deleteClassroomTeacher = exports.updateClassroomTeacher = exports.createClassroomTeacher = exports.deleteClassroomYearLevel = exports.updateClassroomYearLevel = exports.createClassroomYearLevel = exports.deleteClassroom = exports.updateClassroom = exports.createClassroom = exports.deleteState = exports.updateState = exports.createState = exports.deleteCountry = exports.updateCountry = exports.createCountry = exports.deleteSchoolIcsea = exports.updateSchoolIcsea = exports.createSchoolIcsea = exports.deleteSchoolStudentAttribute = exports.updateSchoolStudentAttribute = exports.createSchoolStudentAttribute = exports.deleteSchoolAttributeCategory = exports.updateSchoolAttributeCategory = exports.createSchoolAttributeCategory = exports.deleteSchool = exports.updateSchool = exports.createSchool = exports.deleteSchoolNetwork = exports.updateSchoolNetwork = exports.createSchoolNetwork = exports.deleteAcCode = exports.updateAcCode = exports.createAcCode = exports.deleteYearLevel = exports.updateYearLevel = exports.createYearLevel = exports.deleteAcSubstrand = exports.updateAcSubstrand = exports.createAcSubstrand = exports.deleteAcStrand = exports.updateAcStrand = exports.createAcStrand = exports.deleteLearningArea = exports.updateLearningArea = exports.createLearningArea = exports.deleteSystemParameter = exports.updateSystemParameter = exports.createSystemParameter = exports.deleteUserSettingsData = exports.updateUserSettingsData = exports.createUserSettingsData = exports.deleteUser = exports.updateUser = exports.createUser = void 0;
exports.deleteTestResultAnswers = exports.updateTestResultAnswers = exports.createTestResultAnswers = exports.deleteTestResultLearningArea = exports.updateTestResultLearningArea = void 0;

/* eslint-disable */
// this is an auto generated file. This will be overwritten
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
exports.createUser = createUser;
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
exports.updateUser = updateUser;
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
exports.deleteUser = deleteUser;
const createUserSettingsData =
/* GraphQL */
`
  mutation CreateUserSettingsData(
    $input: CreateUserSettingsDataInput!
    $condition: ModelUserSettingsDataConditionInput
  ) {
    createUserSettingsData(input: $input, condition: $condition) {
      id
      email
      settingsKey
      settingsData
      createdAt
      updatedAt
    }
  }
`;
exports.createUserSettingsData = createUserSettingsData;
const updateUserSettingsData =
/* GraphQL */
`
  mutation UpdateUserSettingsData(
    $input: UpdateUserSettingsDataInput!
    $condition: ModelUserSettingsDataConditionInput
  ) {
    updateUserSettingsData(input: $input, condition: $condition) {
      id
      email
      settingsKey
      settingsData
      createdAt
      updatedAt
    }
  }
`;
exports.updateUserSettingsData = updateUserSettingsData;
const deleteUserSettingsData =
/* GraphQL */
`
  mutation DeleteUserSettingsData(
    $input: DeleteUserSettingsDataInput!
    $condition: ModelUserSettingsDataConditionInput
  ) {
    deleteUserSettingsData(input: $input, condition: $condition) {
      id
      email
      settingsKey
      settingsData
      createdAt
      updatedAt
    }
  }
`;
exports.deleteUserSettingsData = deleteUserSettingsData;
const createSystemParameter =
/* GraphQL */
`
  mutation CreateSystemParameter(
    $input: CreateSystemParameterInput!
    $condition: ModelSystemParameterConditionInput
  ) {
    createSystemParameter(input: $input, condition: $condition) {
      id
      key
      paramData
      createdAt
      updatedAt
    }
  }
`;
exports.createSystemParameter = createSystemParameter;
const updateSystemParameter =
/* GraphQL */
`
  mutation UpdateSystemParameter(
    $input: UpdateSystemParameterInput!
    $condition: ModelSystemParameterConditionInput
  ) {
    updateSystemParameter(input: $input, condition: $condition) {
      id
      key
      paramData
      createdAt
      updatedAt
    }
  }
`;
exports.updateSystemParameter = updateSystemParameter;
const deleteSystemParameter =
/* GraphQL */
`
  mutation DeleteSystemParameter(
    $input: DeleteSystemParameterInput!
    $condition: ModelSystemParameterConditionInput
  ) {
    deleteSystemParameter(input: $input, condition: $condition) {
      id
      key
      paramData
      createdAt
      updatedAt
    }
  }
`;
exports.deleteSystemParameter = deleteSystemParameter;
const createLearningArea =
/* GraphQL */
`
  mutation CreateLearningArea(
    $input: CreateLearningAreaInput!
    $condition: ModelLearningAreaConditionInput
  ) {
    createLearningArea(input: $input, condition: $condition) {
      id
      areaName
      colour
      createdAt
      updatedAt
    }
  }
`;
exports.createLearningArea = createLearningArea;
const updateLearningArea =
/* GraphQL */
`
  mutation UpdateLearningArea(
    $input: UpdateLearningAreaInput!
    $condition: ModelLearningAreaConditionInput
  ) {
    updateLearningArea(input: $input, condition: $condition) {
      id
      areaName
      colour
      createdAt
      updatedAt
    }
  }
`;
exports.updateLearningArea = updateLearningArea;
const deleteLearningArea =
/* GraphQL */
`
  mutation DeleteLearningArea(
    $input: DeleteLearningAreaInput!
    $condition: ModelLearningAreaConditionInput
  ) {
    deleteLearningArea(input: $input, condition: $condition) {
      id
      areaName
      colour
      createdAt
      updatedAt
    }
  }
`;
exports.deleteLearningArea = deleteLearningArea;
const createAcStrand =
/* GraphQL */
`
  mutation CreateAcStrand(
    $input: CreateAcStrandInput!
    $condition: ModelAcStrandConditionInput
  ) {
    createAcStrand(input: $input, condition: $condition) {
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
exports.createAcStrand = createAcStrand;
const updateAcStrand =
/* GraphQL */
`
  mutation UpdateAcStrand(
    $input: UpdateAcStrandInput!
    $condition: ModelAcStrandConditionInput
  ) {
    updateAcStrand(input: $input, condition: $condition) {
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
exports.updateAcStrand = updateAcStrand;
const deleteAcStrand =
/* GraphQL */
`
  mutation DeleteAcStrand(
    $input: DeleteAcStrandInput!
    $condition: ModelAcStrandConditionInput
  ) {
    deleteAcStrand(input: $input, condition: $condition) {
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
exports.deleteAcStrand = deleteAcStrand;
const createAcSubstrand =
/* GraphQL */
`
  mutation CreateAcSubstrand(
    $input: CreateAcSubstrandInput!
    $condition: ModelAcSubstrandConditionInput
  ) {
    createAcSubstrand(input: $input, condition: $condition) {
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
exports.createAcSubstrand = createAcSubstrand;
const updateAcSubstrand =
/* GraphQL */
`
  mutation UpdateAcSubstrand(
    $input: UpdateAcSubstrandInput!
    $condition: ModelAcSubstrandConditionInput
  ) {
    updateAcSubstrand(input: $input, condition: $condition) {
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
exports.updateAcSubstrand = updateAcSubstrand;
const deleteAcSubstrand =
/* GraphQL */
`
  mutation DeleteAcSubstrand(
    $input: DeleteAcSubstrandInput!
    $condition: ModelAcSubstrandConditionInput
  ) {
    deleteAcSubstrand(input: $input, condition: $condition) {
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
exports.deleteAcSubstrand = deleteAcSubstrand;
const createYearLevel =
/* GraphQL */
`
  mutation CreateYearLevel(
    $input: CreateYearLevelInput!
    $condition: ModelYearLevelConditionInput
  ) {
    createYearLevel(input: $input, condition: $condition) {
      id
      yearCode
      description
      type
      createdAt
      updatedAt
    }
  }
`;
exports.createYearLevel = createYearLevel;
const updateYearLevel =
/* GraphQL */
`
  mutation UpdateYearLevel(
    $input: UpdateYearLevelInput!
    $condition: ModelYearLevelConditionInput
  ) {
    updateYearLevel(input: $input, condition: $condition) {
      id
      yearCode
      description
      type
      createdAt
      updatedAt
    }
  }
`;
exports.updateYearLevel = updateYearLevel;
const deleteYearLevel =
/* GraphQL */
`
  mutation DeleteYearLevel(
    $input: DeleteYearLevelInput!
    $condition: ModelYearLevelConditionInput
  ) {
    deleteYearLevel(input: $input, condition: $condition) {
      id
      yearCode
      description
      type
      createdAt
      updatedAt
    }
  }
`;
exports.deleteYearLevel = deleteYearLevel;
const createAcCode =
/* GraphQL */
`
  mutation CreateAcCode(
    $input: CreateAcCodeInput!
    $condition: ModelAcCodeConditionInput
  ) {
    createAcCode(input: $input, condition: $condition) {
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
exports.createAcCode = createAcCode;
const updateAcCode =
/* GraphQL */
`
  mutation UpdateAcCode(
    $input: UpdateAcCodeInput!
    $condition: ModelAcCodeConditionInput
  ) {
    updateAcCode(input: $input, condition: $condition) {
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
exports.updateAcCode = updateAcCode;
const deleteAcCode =
/* GraphQL */
`
  mutation DeleteAcCode(
    $input: DeleteAcCodeInput!
    $condition: ModelAcCodeConditionInput
  ) {
    deleteAcCode(input: $input, condition: $condition) {
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
exports.deleteAcCode = deleteAcCode;
const createSchoolNetwork =
/* GraphQL */
`
  mutation CreateSchoolNetwork(
    $input: CreateSchoolNetworkInput!
    $condition: ModelSchoolNetworkConditionInput
  ) {
    createSchoolNetwork(input: $input, condition: $condition) {
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
exports.createSchoolNetwork = createSchoolNetwork;
const updateSchoolNetwork =
/* GraphQL */
`
  mutation UpdateSchoolNetwork(
    $input: UpdateSchoolNetworkInput!
    $condition: ModelSchoolNetworkConditionInput
  ) {
    updateSchoolNetwork(input: $input, condition: $condition) {
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
exports.updateSchoolNetwork = updateSchoolNetwork;
const deleteSchoolNetwork =
/* GraphQL */
`
  mutation DeleteSchoolNetwork(
    $input: DeleteSchoolNetworkInput!
    $condition: ModelSchoolNetworkConditionInput
  ) {
    deleteSchoolNetwork(input: $input, condition: $condition) {
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
exports.deleteSchoolNetwork = deleteSchoolNetwork;
const createSchool =
/* GraphQL */
`
  mutation CreateSchool(
    $input: CreateSchoolInput!
    $condition: ModelSchoolConditionInput
  ) {
    createSchool(input: $input, condition: $condition) {
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
exports.deleteSchool = deleteSchool;
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
exports.updateSchoolAttributeCategory = updateSchoolAttributeCategory;
const deleteSchoolAttributeCategory =
/* GraphQL */
`
  mutation DeleteSchoolAttributeCategory(
    $input: DeleteSchoolAttributeCategoryInput!
    $condition: ModelSchoolAttributeCategoryConditionInput
  ) {
    deleteSchoolAttributeCategory(input: $input, condition: $condition) {
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
exports.deleteSchoolAttributeCategory = deleteSchoolAttributeCategory;
const createSchoolStudentAttribute =
/* GraphQL */
`
  mutation CreateSchoolStudentAttribute(
    $input: CreateSchoolStudentAttributeInput!
    $condition: ModelSchoolStudentAttributeConditionInput
  ) {
    createSchoolStudentAttribute(input: $input, condition: $condition) {
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
exports.createSchoolStudentAttribute = createSchoolStudentAttribute;
const updateSchoolStudentAttribute =
/* GraphQL */
`
  mutation UpdateSchoolStudentAttribute(
    $input: UpdateSchoolStudentAttributeInput!
    $condition: ModelSchoolStudentAttributeConditionInput
  ) {
    updateSchoolStudentAttribute(input: $input, condition: $condition) {
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
exports.updateSchoolStudentAttribute = updateSchoolStudentAttribute;
const deleteSchoolStudentAttribute =
/* GraphQL */
`
  mutation DeleteSchoolStudentAttribute(
    $input: DeleteSchoolStudentAttributeInput!
    $condition: ModelSchoolStudentAttributeConditionInput
  ) {
    deleteSchoolStudentAttribute(input: $input, condition: $condition) {
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
exports.deleteSchoolStudentAttribute = deleteSchoolStudentAttribute;
const createSchoolIcsea =
/* GraphQL */
`
  mutation CreateSchoolIcsea(
    $input: CreateSchoolIcseaInput!
    $condition: ModelSchoolIcseaConditionInput
  ) {
    createSchoolIcsea(input: $input, condition: $condition) {
      id
      schoolID
      schoolYear
      icsea
      createdAt
      updatedAt
    }
  }
`;
exports.createSchoolIcsea = createSchoolIcsea;
const updateSchoolIcsea =
/* GraphQL */
`
  mutation UpdateSchoolIcsea(
    $input: UpdateSchoolIcseaInput!
    $condition: ModelSchoolIcseaConditionInput
  ) {
    updateSchoolIcsea(input: $input, condition: $condition) {
      id
      schoolID
      schoolYear
      icsea
      createdAt
      updatedAt
    }
  }
`;
exports.updateSchoolIcsea = updateSchoolIcsea;
const deleteSchoolIcsea =
/* GraphQL */
`
  mutation DeleteSchoolIcsea(
    $input: DeleteSchoolIcseaInput!
    $condition: ModelSchoolIcseaConditionInput
  ) {
    deleteSchoolIcsea(input: $input, condition: $condition) {
      id
      schoolID
      schoolYear
      icsea
      createdAt
      updatedAt
    }
  }
`;
exports.deleteSchoolIcsea = deleteSchoolIcsea;
const createCountry =
/* GraphQL */
`
  mutation CreateCountry(
    $input: CreateCountryInput!
    $condition: ModelCountryConditionInput
  ) {
    createCountry(input: $input, condition: $condition) {
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
exports.createCountry = createCountry;
const updateCountry =
/* GraphQL */
`
  mutation UpdateCountry(
    $input: UpdateCountryInput!
    $condition: ModelCountryConditionInput
  ) {
    updateCountry(input: $input, condition: $condition) {
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
exports.updateCountry = updateCountry;
const deleteCountry =
/* GraphQL */
`
  mutation DeleteCountry(
    $input: DeleteCountryInput!
    $condition: ModelCountryConditionInput
  ) {
    deleteCountry(input: $input, condition: $condition) {
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
exports.deleteCountry = deleteCountry;
const createState =
/* GraphQL */
`
  mutation CreateState(
    $input: CreateStateInput!
    $condition: ModelStateConditionInput
  ) {
    createState(input: $input, condition: $condition) {
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
exports.createState = createState;
const updateState =
/* GraphQL */
`
  mutation UpdateState(
    $input: UpdateStateInput!
    $condition: ModelStateConditionInput
  ) {
    updateState(input: $input, condition: $condition) {
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
exports.updateState = updateState;
const deleteState =
/* GraphQL */
`
  mutation DeleteState(
    $input: DeleteStateInput!
    $condition: ModelStateConditionInput
  ) {
    deleteState(input: $input, condition: $condition) {
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
exports.deleteState = deleteState;
const createClassroom =
/* GraphQL */
`
  mutation CreateClassroom(
    $input: CreateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    createClassroom(input: $input, condition: $condition) {
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
exports.createClassroom = createClassroom;
const updateClassroom =
/* GraphQL */
`
  mutation UpdateClassroom(
    $input: UpdateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    updateClassroom(input: $input, condition: $condition) {
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
exports.updateClassroom = updateClassroom;
const deleteClassroom =
/* GraphQL */
`
  mutation DeleteClassroom(
    $input: DeleteClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    deleteClassroom(input: $input, condition: $condition) {
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
exports.deleteClassroom = deleteClassroom;
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
exports.updateClassroomYearLevel = updateClassroomYearLevel;
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
exports.deleteClassroomYearLevel = deleteClassroomYearLevel;
const createClassroomTeacher =
/* GraphQL */
`
  mutation CreateClassroomTeacher(
    $input: CreateClassroomTeacherInput!
    $condition: ModelClassroomTeacherConditionInput
  ) {
    createClassroomTeacher(input: $input, condition: $condition) {
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
exports.createClassroomTeacher = createClassroomTeacher;
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
exports.updateClassroomTeacher = updateClassroomTeacher;
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
exports.deleteClassroomTeacher = deleteClassroomTeacher;
const createClassroomLearningArea =
/* GraphQL */
`
  mutation CreateClassroomLearningArea(
    $input: CreateClassroomLearningAreaInput!
    $condition: ModelClassroomLearningAreaConditionInput
  ) {
    createClassroomLearningArea(input: $input, condition: $condition) {
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
exports.createClassroomLearningArea = createClassroomLearningArea;
const updateClassroomLearningArea =
/* GraphQL */
`
  mutation UpdateClassroomLearningArea(
    $input: UpdateClassroomLearningAreaInput!
    $condition: ModelClassroomLearningAreaConditionInput
  ) {
    updateClassroomLearningArea(input: $input, condition: $condition) {
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
exports.updateClassroomLearningArea = updateClassroomLearningArea;
const deleteClassroomLearningArea =
/* GraphQL */
`
  mutation DeleteClassroomLearningArea(
    $input: DeleteClassroomLearningAreaInput!
    $condition: ModelClassroomLearningAreaConditionInput
  ) {
    deleteClassroomLearningArea(input: $input, condition: $condition) {
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
exports.deleteClassroomLearningArea = deleteClassroomLearningArea;
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
exports.createClassroomStudent = createClassroomStudent;
const updateClassroomStudent =
/* GraphQL */
`
  mutation UpdateClassroomStudent(
    $input: UpdateClassroomStudentInput!
    $condition: ModelClassroomStudentConditionInput
  ) {
    updateClassroomStudent(input: $input, condition: $condition) {
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
exports.updateClassroomStudent = updateClassroomStudent;
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
exports.deleteClassroomStudent = deleteClassroomStudent;
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
exports.createSchoolStudent = createSchoolStudent;
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
exports.updateSchoolStudent = updateSchoolStudent;
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
exports.deleteSchoolStudent = deleteSchoolStudent;
const createStudent =
/* GraphQL */
`
  mutation CreateStudent(
    $input: CreateStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    createStudent(input: $input, condition: $condition) {
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
exports.createStudent = createStudent;
const updateStudent =
/* GraphQL */
`
  mutation UpdateStudent(
    $input: UpdateStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    updateStudent(input: $input, condition: $condition) {
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
exports.deleteStudent = deleteStudent;
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
exports.deleteStudentData = deleteStudentData;
const createNotification =
/* GraphQL */
`
  mutation CreateNotification(
    $input: CreateNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    createNotification(input: $input, condition: $condition) {
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
exports.createNotification = createNotification;
const updateNotification =
/* GraphQL */
`
  mutation UpdateNotification(
    $input: UpdateNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    updateNotification(input: $input, condition: $condition) {
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
exports.updateNotification = updateNotification;
const deleteNotification =
/* GraphQL */
`
  mutation DeleteNotification(
    $input: DeleteNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    deleteNotification(input: $input, condition: $condition) {
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
exports.deleteNotification = deleteNotification;
const createQuestion =
/* GraphQL */
`
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
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
exports.createQuestion = createQuestion;
const updateQuestion =
/* GraphQL */
`
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
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
exports.updateQuestion = updateQuestion;
const deleteQuestion =
/* GraphQL */
`
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
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
exports.deleteQuestion = deleteQuestion;
const createAnswer =
/* GraphQL */
`
  mutation CreateAnswer(
    $input: CreateAnswerInput!
    $condition: ModelAnswerConditionInput
  ) {
    createAnswer(input: $input, condition: $condition) {
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
exports.createAnswer = createAnswer;
const updateAnswer =
/* GraphQL */
`
  mutation UpdateAnswer(
    $input: UpdateAnswerInput!
    $condition: ModelAnswerConditionInput
  ) {
    updateAnswer(input: $input, condition: $condition) {
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
exports.updateAnswer = updateAnswer;
const deleteAnswer =
/* GraphQL */
`
  mutation DeleteAnswer(
    $input: DeleteAnswerInput!
    $condition: ModelAnswerConditionInput
  ) {
    deleteAnswer(input: $input, condition: $condition) {
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
exports.deleteAnswer = deleteAnswer;
const createTestType =
/* GraphQL */
`
  mutation CreateTestType(
    $input: CreateTestTypeInput!
    $condition: ModelTestTypeConditionInput
  ) {
    createTestType(input: $input, condition: $condition) {
      id
      typeName
      createdAt
      updatedAt
    }
  }
`;
exports.createTestType = createTestType;
const updateTestType =
/* GraphQL */
`
  mutation UpdateTestType(
    $input: UpdateTestTypeInput!
    $condition: ModelTestTypeConditionInput
  ) {
    updateTestType(input: $input, condition: $condition) {
      id
      typeName
      createdAt
      updatedAt
    }
  }
`;
exports.updateTestType = updateTestType;
const deleteTestType =
/* GraphQL */
`
  mutation DeleteTestType(
    $input: DeleteTestTypeInput!
    $condition: ModelTestTypeConditionInput
  ) {
    deleteTestType(input: $input, condition: $condition) {
      id
      typeName
      createdAt
      updatedAt
    }
  }
`;
exports.deleteTestType = deleteTestType;
const createTestUnit =
/* GraphQL */
`
  mutation CreateTestUnit(
    $input: CreateTestUnitInput!
    $condition: ModelTestUnitConditionInput
  ) {
    createTestUnit(input: $input, condition: $condition) {
      id
      unitName
      createdAt
      updatedAt
    }
  }
`;
exports.createTestUnit = createTestUnit;
const updateTestUnit =
/* GraphQL */
`
  mutation UpdateTestUnit(
    $input: UpdateTestUnitInput!
    $condition: ModelTestUnitConditionInput
  ) {
    updateTestUnit(input: $input, condition: $condition) {
      id
      unitName
      createdAt
      updatedAt
    }
  }
`;
exports.updateTestUnit = updateTestUnit;
const deleteTestUnit =
/* GraphQL */
`
  mutation DeleteTestUnit(
    $input: DeleteTestUnitInput!
    $condition: ModelTestUnitConditionInput
  ) {
    deleteTestUnit(input: $input, condition: $condition) {
      id
      unitName
      createdAt
      updatedAt
    }
  }
`;
exports.deleteTestUnit = deleteTestUnit;
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
exports.deleteTest = deleteTest;
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
exports.createTestLearningArea = createTestLearningArea;
const updateTestLearningArea =
/* GraphQL */
`
  mutation UpdateTestLearningArea(
    $input: UpdateTestLearningAreaInput!
    $condition: ModelTestLearningAreaConditionInput
  ) {
    updateTestLearningArea(input: $input, condition: $condition) {
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
exports.updateTestLearningArea = updateTestLearningArea;
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
exports.deleteTestLearningArea = deleteTestLearningArea;
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
exports.deleteTestUpload = deleteTestUpload;
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
exports.createTestResult = createTestResult;
const updateTestResult =
/* GraphQL */
`
  mutation UpdateTestResult(
    $input: UpdateTestResultInput!
    $condition: ModelTestResultConditionInput
  ) {
    updateTestResult(input: $input, condition: $condition) {
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
exports.updateTestResult = updateTestResult;
const deleteTestResult =
/* GraphQL */
`
  mutation DeleteTestResult(
    $input: DeleteTestResultInput!
    $condition: ModelTestResultConditionInput
  ) {
    deleteTestResult(input: $input, condition: $condition) {
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
exports.deleteTestResult = deleteTestResult;
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
exports.createTestResultLearningArea = createTestResultLearningArea;
const updateTestResultLearningArea =
/* GraphQL */
`
  mutation UpdateTestResultLearningArea(
    $input: UpdateTestResultLearningAreaInput!
    $condition: ModelTestResultLearningAreaConditionInput
  ) {
    updateTestResultLearningArea(input: $input, condition: $condition) {
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
exports.updateTestResultLearningArea = updateTestResultLearningArea;
const deleteTestResultLearningArea =
/* GraphQL */
`
  mutation DeleteTestResultLearningArea(
    $input: DeleteTestResultLearningAreaInput!
    $condition: ModelTestResultLearningAreaConditionInput
  ) {
    deleteTestResultLearningArea(input: $input, condition: $condition) {
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
exports.deleteTestResultLearningArea = deleteTestResultLearningArea;
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
exports.createTestResultAnswers = createTestResultAnswers;
const updateTestResultAnswers =
/* GraphQL */
`
  mutation UpdateTestResultAnswers(
    $input: UpdateTestResultAnswersInput!
    $condition: ModelTestResultAnswersConditionInput
  ) {
    updateTestResultAnswers(input: $input, condition: $condition) {
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
exports.updateTestResultAnswers = updateTestResultAnswers;
const deleteTestResultAnswers =
/* GraphQL */
`
  mutation DeleteTestResultAnswers(
    $input: DeleteTestResultAnswersInput!
    $condition: ModelTestResultAnswersConditionInput
  ) {
    deleteTestResultAnswers(input: $input, condition: $condition) {
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
exports.deleteTestResultAnswers = deleteTestResultAnswers;