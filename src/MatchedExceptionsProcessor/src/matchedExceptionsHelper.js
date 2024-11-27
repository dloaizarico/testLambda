const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const {
  createFinalPDFsForStudents,
  UpdateAndCreateLogsForActivityAfterMatching,
  submitFinalEssaysAfterMatching,
} = require("./api");
const { logger } = require("./logger");

const processMatchedExceptions = async (
  ddbClient,
  payload,
  s3Client,
  ENDPOINT,
  prompt,
  activity
) => {
  try {
    const validStudentItemsWithPages =
      payload.updatedStudentItemsWithPages.filter(
        (item) => !["UNIDENTIFIED", "DISCARD"].includes(item?.matchingStatus)
      );

    // save final PDFs for those students that were updated as exceptions in the UI by the teacher.
    const fileUrlsPerStudent = await createFinalPDFsForStudents(
      payload.activityID,
      validStudentItemsWithPages,
      s3Client
    );

    // Save the new logs in the DB and update the previous ones status.
    const {
      studentHandwritingLogs,
      removedStudents,
      archivedMatchedStudentIDs,
    } = await UpdateAndCreateLogsForActivityAfterMatching(
      payload.handwritingLog,
      ddbClient,
      payload.activityID,
      validStudentItemsWithPages,
      fileUrlsPerStudent
    );

    await submitFinalEssaysAfterMatching(
      ddbClient,
      activity,
      prompt,
      ENDPOINT,
      studentHandwritingLogs,
      removedStudents,
      archivedMatchedStudentIDs
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(
        "The process has been finished, please check your essays in a while."
      ),
    };
  } catch (error) {
    logger.error(`Error while processing the payload ${error}`);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(
        "The process did not complete successfully, please contact support."
      ),
    };
  }
};

module.exports = {
  processMatchedExceptions,
};
