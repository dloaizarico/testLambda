const sysType = "notify";
const read = false;
const notificationMessage =
  "The handwriting has been uploaded, please don't forget to check the logs.";
const sender = "admin@elastik.com";
const expiryDaysForNotification = 5;
const fuzzyMatchingLambdaName = "fuzzyNameMatching"
const matchStudentByNameWithStrictEqualityMethod = "matchStudentByNameWithStrictEquality"
const matchStudentByNameUsingIndexesMethod = "matchStudentByNameUsingIndexes"
// Every transaction sent to textract will be paused for 3 secs until the next one is sent.
const TEXTRACT_WAIT_TO_AVOID_REACHING_LIMIT = 3000;

module.exports = {
  sysType,
  read,
  sender,
  expiryDaysForNotification,
  notificationMessage,
  fuzzyMatchingLambdaName,
  matchStudentByNameWithStrictEqualityMethod,
  matchStudentByNameUsingIndexesMethod,
  TEXTRACT_WAIT_TO_AVOID_REACHING_LIMIT
};
