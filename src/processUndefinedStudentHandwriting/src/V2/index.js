const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { S3Client } = require("@aws-sdk/client-s3");
const {
  createFinalPDFsForStudents,
  submitFinalEssaysAfterMatching,
  UpdateAndCreateLogsForActivityAfterMatching,
} = require("./api");

const handlerV2 = async (event, ddbClient, ENDPOINT) => {
  try {

    const s3Client = new S3Client({
      apiVersion: "2006-03-01",
      region: process.env.REGION,
    });

    // save final PDFs for those students that were updated as exceptions in the UI by the teacher.
    const fileUrlsPerStudent = await createFinalPDFsForStudents(
      event.activityID,
      event.updatedStudentItemsWithPages?.filter(
        (studentData) => studentData.hasPendingModifications
      ),
      s3Client
    );

    // Save the new logs in the DB and update the previous ones status.
    const studentHandwritingLogs =
      await UpdateAndCreateLogsForActivityAfterMatching(
        event.handwritingLog,
        ddbClient,
        event.activityID,
        event.updatedStudentItemsWithPages,
        fileUrlsPerStudent
      );

    await submitFinalEssaysAfterMatching(
      ddbClient,
      event.activityID,
      event.promptID,
      ENDPOINT,
      studentHandwritingLogs
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
    console.log(error);
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
  handlerV2,
};
