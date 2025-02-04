"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamoDb = exports.s3 = void 0;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var client_s3_1 = require("@aws-sdk/client-s3");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var util_retry_1 = require("@aws-sdk/util-retry");
exports.s3 = new client_s3_1.S3({});
exports.dynamoDb = lib_dynamodb_1.DynamoDBDocument.from(new client_dynamodb_1.DynamoDB({
    maxAttempts: 5,
    retryStrategy: new util_retry_1.ConfiguredRetryStrategy(5, function (attempt) { return Math.pow(attempt, 2); }),
}));
