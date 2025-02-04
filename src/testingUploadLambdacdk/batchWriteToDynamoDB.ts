import path from "path";
import dotenv from "dotenv";
if (!dotenv) {
  throw new Error('dotenv is not defined!');
}
// Load the `.env` file located at "../../../../.env"
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
import { DeleteRequest, PutRequest } from "@aws-sdk/client-dynamodb";
import { NativeAttributeValue } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "./clients";
import { logger } from "./logger";
import { ProcessedData } from "./types";

const BATCH_SIZE = 25;

interface WriteRequest {
  PutRequest?: Omit<PutRequest, "Item"> & {
    Item: Record<string, NativeAttributeValue> | undefined;
  };
  DeleteRequest?: Omit<DeleteRequest, "Key"> & {
    Key: Record<string, NativeAttributeValue> | undefined;
  };
}

const batchWriteWithRetry = async (
  tableName: string,
  batch: WriteRequest[]
): Promise<WriteRequest[]> => {
  try {
    const result = await dynamoDb.batchWrite({
      RequestItems: { [tableName]: batch },
    });

    // Check for unprocessed items
    if (
      result.UnprocessedItems &&
      result.UnprocessedItems[tableName]?.length > 0
    ) {
      const unprocessedItems = result.UnprocessedItems[tableName];
      return unprocessedItems;
    }

    return [];
  } catch (error) {
    logger.error(`Error on batch write to ${tableName}:`, error);
    throw error;
  }
};

export async function batchWriteToDynamoDB(
  tableName: string,
  items: Record<string, NativeAttributeValue>[]
): Promise<WriteRequest[]> {
  const batches: WriteRequest[][] = [];

  // Split items into batches
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items
      .slice(i, i + BATCH_SIZE)
      .map((item) => ({ PutRequest: { Item: item } }));
    batches.push(batch);
  }

  // Process all batches concurrently
  const unprocessedItemsResults = await Promise.all(
    batches.map((batch) => batchWriteWithRetry(tableName, batch))
  );

  // Filter out any undefined values and flatten the array
  const unprocessedItems = unprocessedItemsResults.flat().filter(Boolean);
  return unprocessedItems;
}

export const batchWriteStudentTests = async (
  processedData: ProcessedData,
  batchWriteFunction = batchWriteToDynamoDB
): Promise<void> => {
  console.log("processedData", processedData);
  const apiId = process.env.apibpedsysgqlGraphQLAPIIdOutput;
  const env = process.env.env;

  const tables = [
    { name: `Test-${apiId}-${env}`, items: processedData.addTestItems },
    {
      name: `TestUpload-${apiId}-${env}`,
      items: processedData.testUploadItems,
    },
    {
      name: `TestResult-${apiId}-${env}`,
      items: processedData.testResultItems,
    },
    {
      name: `TestResultLearningArea-${apiId}-${env}`,
      items: processedData.testResultLearningAreaItems,
    },
    {
      name: `TestResultAnswers-${apiId}-${env}`,
      items: processedData.testResultAnswersItems,
    },
    {
      name: `TestResultAnswersGA-${apiId}-${env}`,
      items: processedData.testResultAnswersGaItems,
    },
    {
      name: `TestQuestion-${apiId}-${env}`,
      items: processedData.testQuestions,
    },
  ];

  for (const { name, items } of tables) {
    console.log("BATCH WRITE", name, items);
    if (items.length === 0) {
      continue;
    }
    await batchWriteFunction(name, items);
  }
};
