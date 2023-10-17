const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const sysType = "notify";
const read = false;
const notificationMessage =
  "The handwriting has been uploaded, please don't forget to check the logs.";
const sender = "admin@elastik.com";
const expiryDaysForNotification = 5;
const fuzzyMatchingLambdaName = "fuzzyNameMatching"
const matchStudentByNameWithStrictEqualityMethod = "matchStudentByNameWithStrictEquality"
const matchStudentByNameUsingIndexesMethod = "matchStudentByNameUsingIndexes"

module.exports = {
  sysType,
  read,
  sender,
  expiryDaysForNotification,
  notificationMessage,
  fuzzyMatchingLambdaName,
  matchStudentByNameWithStrictEqualityMethod,
  matchStudentByNameUsingIndexesMethod
};
