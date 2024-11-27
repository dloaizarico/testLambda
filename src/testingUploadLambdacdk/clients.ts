import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { S3 } from "@aws-sdk/client-s3";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { ConfiguredRetryStrategy } from "@aws-sdk/util-retry";

export const s3 = new S3({});

export const dynamoDb = DynamoDBDocument.from(
  new DynamoDB({
    maxAttempts: 5,
    retryStrategy: new ConfiguredRetryStrategy(5, (attempt) => attempt ** 2),
  })
);
