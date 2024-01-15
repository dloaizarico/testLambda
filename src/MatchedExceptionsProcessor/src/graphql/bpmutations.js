"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.createNotification = void 0;
const createNotification = /* GraphQL */ `
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
