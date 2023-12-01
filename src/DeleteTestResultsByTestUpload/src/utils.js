const expirationThresholdInMonths = 3; // months

const ANSWER_CODES = {
  SUCCESS_OPERATIONS: 200,
  INTERNAL_SERVER_ERROR: 500,
};

const TABLE_NAMES = {
  TEST_RESULT: "TestResult",
  TEST_UPLOAD: "TestUpload",
  TEST_RESULT_LEARNING_AREA: "TestResultLearningArea",
  TEST_RESULT_ANSWERS: "TestResultAnswers",
  TEST_RESULT_ANSWERSGA: "TestResultAnswersGA",
  AUDIT: "UploaderAudit",
};

const OPERATIONS = {
  DELETE: "DELETE",
  CREATE: "CREATE",
};

function generateExpirationTime() {
  const today = new Date();
  today.setMonth(today.getMonth() + expirationThresholdInMonths);
  const epoch = today.getTime();
  return Math.floor(epoch / 1000); // return current epoch time in seconds required by AWS for TTL-enabled table
}

function getTimeStamp() {
  const date_ob = new Date();
  const date = `0${date_ob.getDate()}`.slice(-2);
  const month = `0${date_ob.getMonth() + 1}`.slice(-2);
  const year = date_ob.getFullYear();
  const hours = date_ob.getHours();
  const minutes = date_ob.getMinutes();
  const seconds = date_ob.getSeconds();
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
  TABLE_NAMES,
  OPERATIONS,
  generateExpirationTime,
  getTimeStamp,
  ANSWER_CODES,
};
