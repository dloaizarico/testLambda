import path from "path";
import dotenv from "dotenv";
// Load the `.env` file located at "../../../../.env"
dotenv.config({ path: path.resolve(__dirname, "../../env") });
import { v4 as uuidv4 } from "uuid";
import { dynamoDb } from "./clients";
import { logger } from "./logger";
import { TestQuestionItem } from "./types";

const yearLevelsByDescription = new Map<string, string>();
const testTypeIdsByTestId = new Map<string, string>();
const testTypeIdsByName = new Map<string, string>();
const testIdsByName = new Map<string, string>();
const testSubtypeIdsByName = new Map<string, string>();
const learningAreaIdsBySkillCode = new Map<string, string>();
const learningAreaIdsByAreaName = new Map<string, string>();
const skillCodeIdsByCode = new Map<string, string>();
const testQuestionIdsByItemId = new Map<string, string>();
const testUnitIdsByName = new Map<string, string>();
const userIdsByEmail = new Map<string, string>();

export const getUserIdByEmail = async (email: string): Promise<string | null> => {
  const existing = userIdsByEmail.get(email);
  if (existing) {
    return existing;
  }

  const result = await dynamoDb.get({
    TableName: `User-${process.env.apibpedsysgqlGraphQLAPIIdOutput}-${process.env.env}`,
    Key: { email },
    ProjectionExpression: "#userId",
    ExpressionAttributeNames: { "#userId": "userId" },
  });

  const userId = result.Item?.userId ?? null;
  if (userId) {
    userIdsByEmail.set(email, userId);
  }
  return userId;
};

const fetchTestIdById = async (testId: string): Promise<boolean> => {
  try {
    const result = await dynamoDb.get({
      TableName: `Test-${process.env.apibpedsysgqlGraphQLAPIIdOutput}-${process.env.env}`,
      Key: { id: testId },
    });

    if (result.Item) {
      testIdsByName.set(result.Item.testName, testId);
      return true;
    }

    return false;
  } catch (error) {
    logger.error(`Error fetching testID by ID: ${testId}`, error);
    throw error;
  }
};

export const isValidTestId = async (testId: string): Promise<boolean> => {
  // Check cache first
  if (testIdsByName.has(testId)) {
    return true;
  }

  // Fetch from database and cache if valid
  const isValid = await fetchTestIdById(testId);
  return isValid;
};

const fetchLearningAreaIdsByAreaName = async (areaName: string): Promise<string | null> => {
  try {
    const result = await dynamoDb.query({
      TableName: `LearningArea-${process.env.apibpedsysgqlGraphQLAPIIdOutput}-${process.env.env}`,
      IndexName: "byArea",
      KeyConditionExpression: "#areaName = :areaName",
      ProjectionExpression: "#id",
      ExpressionAttributeNames: {
        "#id": "id",
        "#areaName": "areaName"
      },
      ExpressionAttributeValues: {
        ":areaName": areaName
      }
    });

    if (result.Items && result.Items.length > 0) {
      return result.Items[0].id;
    }
    return null;
  } catch (error) {
    logger.error("Error loading learning area cache:", error);
    throw error;
  }
}

export const getLearningAreaByName = async (areaName: string): Promise< string | null> => {
  const cachedLearningAreaId = learningAreaIdsByAreaName.get(areaName);
  if (cachedLearningAreaId ) {
    return cachedLearningAreaId;
  }

  const id = await fetchLearningAreaIdsByAreaName(areaName);
  if (id) {
    learningAreaIdsByAreaName.set(areaName, id);
    return id;
  }
  return null;
};


const fetchLearningAreaAndSkillCodeIds = async (
  questionSkillCode: string
): Promise<{ learningArea: string; skillCode: string } | null> => {
  try {
    const result = await dynamoDb.query({
      TableName: `AcCode-${process.env.apibpedsysgqlGraphQLAPIIdOutput}-${process.env.env}`,
      IndexName: "byAcCode",
      KeyConditionExpression: "#acCode = :acCode",
      ProjectionExpression: "#id, #learningAreaID",
      ExpressionAttributeNames: {
        "#id": "id",
        "#learningAreaID": "learningAreaID",
        "#acCode": "acCode",
      },
      ExpressionAttributeValues: {
        ":acCode": questionSkillCode,
      },
    });

    if (result.Items && result.Items.length > 0) {
      return {
        learningArea: result.Items[0].learningAreaID,
        skillCode: result.Items[0].id,
      };
    }
    return null;
  } catch (error) {
    logger.error("Error loading skill code cache:", error);
    throw error;
  }
};

export const getLearningAreaAndSkillCodeIds = async (
  questionSkillCode: string
): Promise<{ learningArea: string; skillCode: string } | null> => {
  const cachedLearningAreaId = learningAreaIdsBySkillCode.get(questionSkillCode);
  const cachedSkillCodeId = skillCodeIdsByCode.get(questionSkillCode);
  if (cachedLearningAreaId && cachedSkillCodeId) {
    return { learningArea: cachedLearningAreaId, skillCode: cachedSkillCodeId };
  }

  const ids = await fetchLearningAreaAndSkillCodeIds(questionSkillCode);
  if (ids) {
    learningAreaIdsBySkillCode.set(questionSkillCode, ids.learningArea);
    skillCodeIdsByCode.set(questionSkillCode, ids.skillCode);
    return ids;
  }
  return null;
};

const fetchYearLevelId = async (description: string): Promise<string | null> => {
  try {
    const result = await dynamoDb.query({
      TableName: `YearLevel-${process.env.apibpedsysgqlGraphQLAPIIdOutput}-${process.env.env}`,
      IndexName: "ByYearDescription",
      KeyConditionExpression: "#description = :description AND #type = :type",
      ProjectionExpression: "#id",
      ExpressionAttributeNames: {
        "#id": "id",
        "#description": "description",
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":description": description,
        ":type": "YL",
      },
    });

    if (result.Items && result.Items.length > 0) {
      const item = result.Items[0];
      yearLevelsByDescription.set(description, item.id);
      return item.id;
    }

    logger.warn(`No year level found for description "${description}"`);
    return null;
  } catch (error) {
    logger.error("Error loading year level cache:", error);
    throw error;
  }
};

export const getYearLevelId = async (year_level: string): Promise<string | null> => {
  const cachedYearLevelId = yearLevelsByDescription.get(year_level);
  if (cachedYearLevelId) {
    return cachedYearLevelId;
  }
  return await fetchYearLevelId(year_level);
};

const fetchTestTypeIdFromTestId = async (testId: string): Promise<string | null> => {
  try {
    const result = await dynamoDb.get({
      TableName: `Test-${process.env.apibpedsysgqlGraphQLAPIIdOutput}-${process.env.env}`,
      Key: { id: testId },
    });
    if (result.Item) {
      testTypeIdsByTestId.set(testId, result.Item.typeID);
      return result.Item.typeID;
    }
    return null;
  } catch (error) {
    logger.error("Error fetching test type by ID:", error);
    throw error;
  }
};

const fetchTestTypeIdFromName = async (testTypeName: string): Promise<string | null> => {
  try {
    const result = await dynamoDb.query({
      TableName: `TestType-${process.env.apibpedsysgqlGraphQLAPIIdOutput}-${process.env.env}`,
      IndexName: "byType",
      KeyConditionExpression: "#typeName = :typeName",
      ProjectionExpression: "#id",
      ExpressionAttributeNames: {
        "#id": "id",
        "#typeName": "typeName",
      },
      ExpressionAttributeValues: {
        ":typeName": testTypeName,
      },
      Limit: 1,
    });

    if (result.Items && result.Items.length > 0) {
      const item = result.Items[0];
      testTypeIdsByName.set(testTypeName, item.id);
      return item.id;
    }
    return null;
  } catch (error) {
    logger.error("Error fetching test type by ID:", error);
    throw error;
  }
};

const fetchTestIdFromName = async (testName: string): Promise<string | null> => {
  try {
    const result = await dynamoDb.query({
      TableName: `Test-${process.env.apibpedsysgqlGraphQLAPIIdOutput}-${process.env.env}`,
      IndexName: "byName",
      KeyConditionExpression: "#testName = :testName",
      ProjectionExpression: "#id, #typeID",
      ExpressionAttributeNames: {
        "#id": "id",
        "#typeID": "typeID",
        "#testName": "testName",
      },
      ExpressionAttributeValues: {
        ":testName": testName,
      },
      Limit: 1,
    });

    if (result.Items && result.Items.length > 0) {
      const item = result.Items[0];
      testIdsByName.set(testName, item.id);
      testTypeIdsByTestId.set(item.id, item.typeID);
      return item.id;
    }
    return null;
  } catch (error) {
    logger.error("Error fetching test ID by name:", error);
    throw error;
  }
};

export const getTestTypeIdFromName = async (testTypeName: string): Promise<string | null> => {
  const cachedTestTypeId = testTypeIdsByName.get(testTypeName);
  if (cachedTestTypeId) {
    return cachedTestTypeId;
  }
  return await fetchTestTypeIdFromName(testTypeName);
};

export const getTestTypeIdFromTestId = async (testId: string): Promise<string | null> => {
  const cachedTestTypeId = testTypeIdsByTestId.get(testId);
  if (cachedTestTypeId) {
    return cachedTestTypeId;
  }
  return await fetchTestTypeIdFromTestId(testId);
};

export const getTestIdFromTestName = async (testName: string): Promise<string | null> => {
  const cachedTestId = testIdsByName.get(testName);
  if (cachedTestId) {
    return cachedTestId;
  }
  return await fetchTestIdFromName(testName);
};

const fetchTestSubtypeIdFromName = async (subTestTypeName: string): Promise<string | null> => {
  try {
    const result = await dynamoDb.query({
      TableName: `SubTestType-${process.env.apibpedsysgqlGraphQLAPIIdOutput}-${process.env.env}`,
      IndexName: "bySubTestType",
      KeyConditionExpression: "#subTestTypeName = :subTestTypeName",
      ProjectionExpression: "#id",
      ExpressionAttributeNames: {
        "#id": "id",
        "#subTestTypeName": "subTestTypeName",
      },
      ExpressionAttributeValues: {
        ":subTestTypeName": subTestTypeName,
      },
      Limit: 1,
    });

    if (result.Items && result.Items.length > 0) {
      testTypeIdsByTestId.set(subTestTypeName, result.Items[0].id);
      return result.Items[0].id;
    }
    return null;
  } catch (error) {
    logger.error("Error loading subType cache:", error);
    throw error;
  }
};

export const getTestSubtypeIdFromName = async (subTestTypeName: string | undefined): Promise<string | null> => {
  if (!subTestTypeName || subTestTypeName.length === 0) {
    return null;
  }

  const cachedSubTypeId = testSubtypeIdsByName.get(subTestTypeName);
  if (cachedSubTypeId) {
    return cachedSubTypeId;
  }
  return await fetchTestSubtypeIdFromName(subTestTypeName);
};

const fetchTestUnitIdFromName = async (testUnitName: string): Promise<string | null> => {
  try {
    const result = await dynamoDb.query({
      TableName: `TestUnit-${process.env.apibpedsysgqlGraphQLAPIIdOutput}-${process.env.env}`,
      IndexName: "byUnit",
      KeyConditionExpression: "#unitName = :unitName",
      ProjectionExpression: "#id",
      ExpressionAttributeNames: {
        "#id": "id",
        "#unitName": "unitName",
      },
      ExpressionAttributeValues: {
        ":unitName": testUnitName,
      },
      Limit: 1,
    });

    if (result.Items && result.Items.length > 0) {
      return result.Items[0].id;
    }
    return null;
  } catch (error) {
    logger.error(`Failed to look up ID for test unit named ${testUnitName}`);
    throw error;
  }
};

export const getTestUnitIdFromName = async (testUnitName: string): Promise<string | null> => {
  const cachedTestUnitId = testUnitIdsByName.get(testUnitName);
  if (cachedTestUnitId) {
    return cachedTestUnitId;
  }

  const testUnitId = await fetchTestUnitIdFromName(testUnitName);
  if (testUnitId) {
    testUnitIdsByName.set(testUnitName, testUnitId);
  }
  return testUnitId;
};

const fetchTestQuestionIdFromItemId = async (testID: string, itemId: string): Promise<string | null> => {
  try {
    const result = await dynamoDb.query({
      TableName: `TestQuestion-${process.env.apibpedsysgqlGraphQLAPIIdOutput}-${process.env.env}`,
      IndexName: "byTestQuestionItemId",
      KeyConditionExpression: "#testID = :testID AND #itemId =:itemId",
      ProjectionExpression: "#id",
      ExpressionAttributeNames: {
        "#id": "id",
        "#testID": "testID",
        "#itemId": "itemId",
      },
      ExpressionAttributeValues: {
        ":testID": testID,
        ":itemId": itemId,
      },
      Limit: 1,
    });

    if (result.Items && result.Items.length > 0) {
      return result.Items[0].id;
    }
    return null;
  } catch (error) {
    logger.error(
      `There is no a question created in EdCompanion that matches with the item ID ${itemId}, the reason could be that the question is attached to an ACCODE that does not exist at the moment`,
      error
    );
    throw error;
  }
};

export const findOrCreateTestQuestion = async (
  testId: string,
  itemId: string,
  acCodeId: string,
  newTestQuestions: TestQuestionItem[]
): Promise<string> => {
  const cachedTestQuestionId = testQuestionIdsByItemId.get(itemId);
  if (cachedTestQuestionId) {
    return cachedTestQuestionId;
  }

  const existingTestQuestionId = await fetchTestQuestionIdFromItemId(testId, itemId);
  if (existingTestQuestionId) {
    testQuestionIdsByItemId.set(itemId, existingTestQuestionId);
    return existingTestQuestionId;
  }

  const questionId = uuidv4();
  const now = new Date().toISOString();
  newTestQuestions.push({
    id: questionId,
    acCodeID: acCodeId,
    testID: testId,
    itemId,
    correctAnswer: "NA",
    answerType: "CORRECT/INCORRECT",
    __typename: "TestQuestion",
    difficulty: 0,
    expectedMean: 0,
    maxScore: 0,
    nationalMean: 0,
    questionNo: 0,
    createdAt: now,
    updatedAt: now,
  });

  return questionId;
};
