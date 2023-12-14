const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
// It validates the event data received, it must contain two school student IDs and the data to update.
const validateEvent = (event) => {
  let didItPassValidations = true;
  if (!event) {
    console.error("The event data is null");
    didItPassValidations = false;
  }

  if (!event.schoolStudentID1 || event.schoolStudentID1 === "") {
    console.error("The schoolStudentID1 is empty");
    didItPassValidations = false;
  }

  if (!event.schoolStudentID2 || event.schoolStudentID2 === "") {
    console.error("The schoolStudentID2 is empty");
    didItPassValidations = false;
  }

  if(event.schoolStudentID2 === event.schoolStudentID1){
    console.error("Both school students IDs must be different");
    didItPassValidations = false;
  }
  if (!event.mergedData) {
    console.error("Merged data object is required.");
    didItPassValidations = false;
  } else if (
    !event.mergedData.birthDate ||
    !event.mergedData.birthDate === "" ||
    !event.mergedData.firstName ||
    !event.mergedData.firstName === "" ||
    !event.mergedData.lastName ||
    !event.mergedData.lastName === "" ||
    !event.mergedData.gender ||
    !event.mergedData.gender === "" ||
    !event.mergedData.yearLevelID ||
    !event.mergedData.yearLevelID === ""
  ) {
    console.error(
      "All fields birthDate, firstName, lastName, gender, yearLevelID are required."
    );
    didItPassValidations = false;
  }

  if (
    
    event?.mergedData &&
    event.mergedData.birthDate &&
    isNaN(Date.parse(event.mergedData.birthDate)) == true
  ) {
    console.error("Birtdate must be a valid date.");
    didItPassValidations = false;
  }
  return didItPassValidations;
};

module.exports = { validateEvent };
