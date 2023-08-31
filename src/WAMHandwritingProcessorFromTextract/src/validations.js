const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { logger } = require("./logger");

// It validates essay mapped to an object after textract process.
const validateEssay = (essay) => {
  let result = [];
  if (!essay) {
    result.push("Essay has not been processed, please contact support.\n");
  }

  if (essay && (!essay.firstName || essay.firstName === "")) {
    result.push("The student first name was not found in the file.\n");
  }

  if (essay && (!essay.lastName || essay.lastName === "")) {
    result.push("The student last name was not found in the file.\n");
  }

  if (essay && (!essay.DOB || essay.DOB === "")) {
    result.push("The student birthdate was not found in the file.\n");
  }

  if (essay && (!essay.text || essay.text === "")) {
    result.push("The writting was not found in the file.\n");
  }

  if (!/^\d{4}\-\d{2}\-\d{2}$/.test(essay.DOB)) {
    result.push("The DOB is not in the expected format YYYY-MM-DD.\n");
  }

  // Validate that the essay has five unique words.
  if ( essay?.text) {
    const wordsArray = essay.text.split(" ");
    const uniqueWords = [];
    wordsArray.forEach((word) => {
      if (!uniqueWords.includes(word)) {
        uniqueWords.push(word);
      }
    });

    if (uniqueWords.length < 5) {
      result.push("Essay must have at least 5 different words.");
    }
  }

  if (result.length === 0) {
    return true;
  }
  // updating log.
  logger.info(
    `Essay by ${essay.firstName} ${essay.lastName} ${
      essay.DOB
    } didn't pass validations: \n ${result.join("\n")}`
  );

  return false;
};

/**
 * This method has two purposes: 1. validate the event data and get the job ids to be processed.
 * @param event data
 *
 */
const validateEvent = (event) => {
  const jobsToProcess = [];
  if ( event?.Records) {
    for (let index = 0; index < event.Records.length; index++) {
      const jobData = event.Records[index];
      if (jobData.Sns) {
        let activityID;
        const message = jobData.Sns.Message;
        const objectData = JSON.parse(message);
        if (objectData.DocumentLocation.S3ObjectName) {
          const documentLocation =
            objectData.DocumentLocation.S3ObjectName.split("/");
          if (documentLocation && documentLocation.length === 4) {
            activityID = documentLocation[2];
            jobsToProcess.push({
              jobID: objectData.JobId,
              activityID,
              fileURL: objectData.DocumentLocation.S3ObjectName,
              userID: objectData.JobTag,
              uploadedFileName: documentLocation[3]
            });
          } else {
            logger.error(
              "The document key does not meet the valid format -public/handwriting/activityID/fileName-  \n"
            );
          }
        } else {
          logger.error(
            "The event data does not contain information of the s3 object processed  \n"
          );
        }
      } else {
        logger.error(
          "The event data does not contain the attribute Sns, that is required to continue.  \n"
        );
      }
    }
  } else {
    logger.error("The lambda didn't receive any even data from the SNS.  \n");
  }
  return jobsToProcess;
};

module.exports = {
  validateEssay,
  validateEvent,
};
