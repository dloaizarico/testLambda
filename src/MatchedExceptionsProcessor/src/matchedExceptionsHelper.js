const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const {
  createFinalPDFsForStudents,
  UpdateAndCreateLogsForActivityAfterMatching,
  submitFinalEssaysAfterMatching,
  getPrompt,
  getActivity,
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
    // save final PDFs for those students that were updated as exceptions in the UI by the teacher.
    const fileUrlsPerStudent = await createFinalPDFsForStudents(
      payload.activityID,
      payload.updatedStudentItemsWithPages,
      s3Client
    );

    console.log("fileUrlsPerStudent",fileUrlsPerStudent);

    

    // Save the new logs in the DB and update the previous ones status.
    const {
      studentHandwritingLogs,
      removedStudents,
      archivedMatchedStudentIDs,
    } = await UpdateAndCreateLogsForActivityAfterMatching(
      payload.handwritingLog,
      ddbClient,
      payload.activityID,
      payload.updatedStudentItemsWithPages,
      fileUrlsPerStudent
    );

    console.log("removedStudents",removedStudents);

  
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
