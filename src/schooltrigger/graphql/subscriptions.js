"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onDeleteNotification = exports.onUpdateNotification = exports.onCreateNotification = exports.onDeleteStudentData = exports.onUpdateStudentData = exports.onCreateStudentData = exports.onNotificationByRecipientDelete = exports.onNotificationByRecipientUpdate = exports.onNotificationByRecipient = void 0;

/* eslint-disable */
// this is an auto generated file. This will be overwritten
const onNotificationByRecipient =
/* GraphQL */
`
  subscription OnNotificationByRecipient($recipient: String!) {
    onNotificationByRecipient(recipient: $recipient) {
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
exports.onNotificationByRecipient = onNotificationByRecipient;
const onNotificationByRecipientUpdate =
/* GraphQL */
`
  subscription OnNotificationByRecipientUpdate($recipient: String!) {
    onNotificationByRecipientUpdate(recipient: $recipient) {
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
exports.onNotificationByRecipientUpdate = onNotificationByRecipientUpdate;
const onNotificationByRecipientDelete =
/* GraphQL */
`
  subscription OnNotificationByRecipientDelete($recipient: String!) {
    onNotificationByRecipientDelete(recipient: $recipient) {
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
exports.onNotificationByRecipientDelete = onNotificationByRecipientDelete;
const onCreateStudentData =
/* GraphQL */
`
  subscription OnCreateStudentData {
    onCreateStudentData {
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
exports.onCreateStudentData = onCreateStudentData;
const onUpdateStudentData =
/* GraphQL */
`
  subscription OnUpdateStudentData {
    onUpdateStudentData {
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
exports.onUpdateStudentData = onUpdateStudentData;
const onDeleteStudentData =
/* GraphQL */
`
  subscription OnDeleteStudentData {
    onDeleteStudentData {
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
exports.onDeleteStudentData = onDeleteStudentData;
const onCreateNotification =
/* GraphQL */
`
  subscription OnCreateNotification {
    onCreateNotification {
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
exports.onCreateNotification = onCreateNotification;
const onUpdateNotification =
/* GraphQL */
`
  subscription OnUpdateNotification {
    onUpdateNotification {
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
exports.onUpdateNotification = onUpdateNotification;
const onDeleteNotification =
/* GraphQL */
`
  subscription OnDeleteNotification {
    onDeleteNotification {
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
exports.onDeleteNotification = onDeleteNotification;