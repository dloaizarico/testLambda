const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const event = require("./event copy.json");
const _ = require("lodash");
const AWS = require("aws-sdk");
const dayjs = require("dayjs");
const { v4 } = require("uuid");
AWS.config.update({ region: process.env.REGION });
const envSuffix = `-${process.env.ENV_SUFFIX}-${process.env.ENV}`;

const {
  makeBatches,
  getSchoolYear,
  getSchoolRecord,
  changeStudentName,
  getSchoolStudentsByStudentId,
  createUser,
  updateSchoolStudent,
  updateSchoolStudentUserId,
  cleanupLogin,
  deleteUserByEmail,
  getStudentById,
  getSchoolStudentsBySchoolId,
  getUserFromCognito,
  getUsersBySchoolId,
  deleteUser,
  sleep,
  logToWinstom,
  logErrorsToWinstom,
  getClassroomStudent,
  updateCognitoLoginEnable,
} = require("./helpers");

// some return codes
const UNKNOWN_ACTION_CODE = "unknown action code";
const DONE = "done";
const ENABLE_LOGIN_SUCCESSFUL = "Enable login successful";
const DISABLE_LOGIN_SUCCESSFUL = "Disable login successful";
const DELETE_LOGINS_SUCCESSFUL = "Logins deleted for all students";
const CHANGE_DOMAIN_NAME_SUCCESSFUL = "Update domainName succesfull";
const CHANGE_STUDENT_LOGIN_ENABLED_SUCCESSFUL =
  "Update StudentLoginEnable succesfull";
const CHANGE_LOGIN_ENABLED_SUCCESSFUL =
  "enable/disable student login succesfull";
const UPDATE_STUDENT_ATTRIBUTE_SUCCESSFUL =
  "Change student attribute successful";
const UPDATE_STUDENT_DEPARTED_SUCCESSFUL = "update studentDeparted successful";
const UPDATE_STUDENT_NAME_SUCCESSFUL = "student name changed successfully";
const BAD_STUDENTID = "bad studentID";
const BAD_OR_NO_ATTRIBUTES = "bad or no method parameters provided";
const TEST_METHOD_SUCCESSFUL = "test method executed ok";
const SET_STUDENT_DEPARTED_SUCCESSFUL =
  "set studentDeparted in schoolStudents successful";
const ADD_STUDENT_TO_CLASSROOM_SUCCESSFUL =
  "add student to classroom successful";
const ADD_NEW_STUDENT_TO_SCHOOL_SUCCESSFUL = "add student to school successful";
const REMOVE_STUDENT_FROM_CLASSROOM_SUCCESSFUL =
  "remove student form classroom successful";
const COGNITO_USER_NOTFOUND = "Cognito User not found";

const BATCHSIZE = 20; // for general batches - should not exceed this due to Cognito throttling limits
const DEL_BATCHSIZE = 20; // separate constant for disableStudentLogins
const GET_BATCHSIZE = 100; // separate constant where docClient.batchRead() is used (Max is 100)

// Test function - can be anything but reads the school record for the supplied school
async function testAPIMethod(docClient, props) {
  try {
    let result = await getSchoolRecord(docClient, props.schoolId);
    logToWinstom("School", result);
    return result;
  } catch (error) {
    logErrorsToWinstom("Error getting Test record", error);
    return { err: "Error getting test Record" };
  }
}

// Set or clear the studentDeparted bit in the schoolStudent records of a student
// in the suppplied school
// NOTE: This method may be more useful if the schoolId provided is the new school
//       and we set studentDeparted in all other schools
async function updateStudentDeparted(docClient, props) {
  // Locate the student's schoolStudents
  try {
    let schoolStudents = await getSchoolStudentsByStudentId(
      docClient,
      props.studentId
    );
    logToWinstom("schoolStudents count", schoolStudents.length);
    // update the schoolStudent records where the school matches
    for (const schoolStudent of schoolStudents) {
      if (schoolStudent.schoolID === props.schoolId) {
        let params = {
          TableName: `SchoolStudent${envSuffix}`,
          Key: {
            id: schoolStudent.id,
          },
          UpdateExpression: `set studentDeparted = :studentDeparted, 
                            updatedAt = :updatedAt`,
          ExpressionAttributeValues: {
            ":studentDeparted": props.studentDeparted,
            ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
          },
          ReturnValues: "UPDATED_NEW",
        };
        let response = await docClient.update(params).promise();
        logToWinstom("response", response);
      }
    }
    return DONE;
  } catch (error) {
    logErrorsToWinstom(
      "Error updating studentDeparted in SchoolStudent",
      error
    );
    return { err: "Error updating studentDeparted in SchoolStudent" };
  }
} // end updateStudentDeparted(docClient, props)

// Enable/disable the Cognito "enabled" status in Cognito
async function enableOneStudentLogin(docClient, props) {
  // A student should have only one User record under the new business rules
  // We find the UserId from the current schoolStudent record
  try {
    let schoolStudents = await getSchoolStudentsByStudentId(
      docClient,
      props.studentId
    );
    //logToWinstom("schoolStudents", schoolStudents);

    // Locate the most recent SchoolStudent for this student in the school
    let currentSchoolStudent = {};
    for (const schoolStudent of schoolStudents) {
      if (schoolStudent.schoolID !== props.schoolId) continue;
      if (!currentSchoolStudent.id) {
        currentSchoolStudent = schoolStudent;
        continue;
      }
      if (schoolStudent.schoolYear > currentSchoolStudent.schoolYear) {
        currentSchoolStudent = schoolStudent;
      }
    }
    logToWinstom("current schoolStudent", currentSchoolStudent);

    // bail if there is no userID
    if (
      !currentSchoolStudent.userId ||
      currentSchoolStudent.userId.length < 10
    ) {
      return { err: "Student has no login" };
    }

    // updateCognitoLoginEnable() updates the Cognito enable/disable bit
    let result = await updateCognitoLoginEnable(
      currentSchoolStudent.userId,
      props.enableLogin
    );

    logToWinstom("Updated User", result);
    return result;
  } catch (error) {
    logErrorsToWinstom("Error updating Cognito enabled status", error);
    return { err: "Error updating Cognito enabled status" };
  }
} // end function enableOneStudentLogin()

// Update a student's birthdate
// Need to update the Student record and the lastNameDoB index
async function updateStudentBirthDate(docClient, props) {
  // Read the existing student to get his lastName for the lastName#birthDate index
  let existingStudent = await getStudentById(docClient, props.studentId);
  // Update the students DoB
  let birthDate = props.birthDate;
  let params = {
    TableName: `Student${envSuffix}`,
    Key: {
      id: props.studentId,
    },
    UpdateExpression: `set #lastNameDob = :lastNameDob, 
                        updatedAt = :updatedAt,
                        birthDate = :birthDate`,
    ExpressionAttributeNames: {
      "#lastNameDob": "lastName#birthDate",
    },
    ExpressionAttributeValues: {
      ":lastNameDob": `${existingStudent.lastName}#${birthDate}`,
      ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      ":birthDate": birthDate,
    },
    ReturnValues: "UPDATED_NEW", // returns {birthdate} after the update
  };
  try {
    // update the Student record
    let result = await docClient.update(params).promise();
    logToWinstom("Updated Student BirthDate", result);
    return result;
  } catch (error) {
    logErrorsToWinstom("error updating Student birthDate", error);
    return { err: error };
  }
} // end updateStudentBirthDate()

// Update a student's middleName
// Need to update the Student record only and no indices are affected
async function updateStudentMiddleName(docClient, props) {
  let params = {
    TableName: `Student${envSuffix}`,
    Key: {
      id: props.studentId,
    },
    UpdateExpression: `set updatedAt = :updatedAt,
                          middleName = :middleName`,
    ExpressionAttributeValues: {
      ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      ":middleName": props.middleName,
    },
    ReturnValues: "UPDATED_NEW", // returns {middleName} after the update
  };
  try {
    // update the Student record
    let result = await docClient.update(params).promise();
    logToWinstom("UpdateStudentMiddleName", result);
    return result;
  } catch (error) {
    logErrorsToWinstom("Error updating Student middleName", error);
    return { err: "Error updating Student middleName" };
  }
} // end updateStudentMiddleName()

// Update a student's photo
// Need to update the Student record only and no indices are affected
async function updateStudentPhoto(docClient, props) {
  let params = {
    TableName: `Student${envSuffix}`,
    Key: {
      id: props.studentId,
    },
    UpdateExpression: `set updatedAt = :updatedAt, photo = :photo`,
    ExpressionAttributeValues: {
      ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      ":photo": props.photo,
    },
    ReturnValues: "UPDATED_NEW", // returns {photo} after the update
  };
  try {
    // update the Student record
    let result = await docClient.update(params).promise();
    logToWinstom("UpdateStudentphoto", result);
    return result;
  } catch (error) {
    logErrorsToWinstom("Error updating Student photo", error);
    return { err: "Error updating Student photo" };
  }
} // end updateStudentphoto()

// Update a student's gender
// Need to update the Student record only and no indices are affected
async function updateStudentGender(docClient, props) {
  let params = {
    TableName: `Student${envSuffix}`,
    Key: {
      id: props.studentId,
    },
    UpdateExpression: `set updatedAt = :updatedAt,
                          gender = :gender`,
    ExpressionAttributeValues: {
      ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      ":gender": props.gender,
    },
    ReturnValues: "UPDATED_NEW", // returns {gender} after the update
  };
  try {
    // update the Student record
    let result = await docClient.update(params).promise();
    logToWinstom("updateStudentGender", result);
    return result;
  } catch (error) {
    logErrorsToWinstom("Error updating student gender", error);
    return { err: "Error updating student gender" };
  }
} // end updateStudentGender()

// Update a student's yearLevelID
// Update the Student record and the most recent SchoolStudent record for the supplied school, and 3 indices
async function updateStudentYearLevelId(docClient, props) {
  let params = {
    TableName: `Student${envSuffix}`,
    Key: {
      id: props.studentId,
    },
    UpdateExpression: `set updatedAt = :updatedAt,
                           yearLevelID = :yearLevelID`,
    ExpressionAttributeValues: {
      ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      ":yearLevelID": props.yearLevelID,
    },
    ReturnValues: "UPDATED_NEW", // returns {yearLevelID} after the update
  };
  try {
    // update the Student record
    let result = await docClient.update(params).promise();
    logToWinstom("UpdateStudent", result);
  } catch (error) {
    logErrorsToWinstom("Error updating Student yearLevelID", error);
    return { err: "Error updating Student yearLevelID" };
  }

  // Locate the current SchoolStudent
  let schoolStudents = await getSchoolStudentsByStudentId(
    docClient,
    props.studentId
  );
  // logToWinstom("schoolStudents", schoolStudents);
  let currentSchoolStudent = {};
  for (const schoolStudent of schoolStudents) {
    if (schoolStudent.schoolID !== props.schoolId) continue;
    if (!currentSchoolStudent.id) {
      currentSchoolStudent = schoolStudent;
      continue;
    }
    if (schoolStudent.schoolYear > currentSchoolStudent.schoolYear) {
      currentSchoolStudent = schoolStudent;
    }
  }
  logToWinstom("current schoolStudent", currentSchoolStudent);
  // now update the schoolStudent
  // Also update indices: schoolYear#yearLevelID,schoolYear#yearLevelID#firstName,schoolYear#yearLevelID#lastName
  params = {
    TableName: `SchoolStudent${envSuffix}`,
    Key: {
      id: currentSchoolStudent.id,
    },
    UpdateExpression: `set #schoolYearYearLevelID = :schoolYearYearLevelID,
                           #schoolYearYearLevelIDFirstName = :schoolYearYearLevelIDFirstName,
                           #schoolYearYearLevelIDLastName = :schoolYearYearLevelIDLastName,
                           yearLevelID = :yearLevelID,
                           updatedAt = :updatedAt`,
    ExpressionAttributeNames: {
      "#schoolYearYearLevelID": "schoolYear#yearLevelID",
      "#schoolYearYearLevelIDFirstName": "schoolYear#yearLevelID#firstName",
      "#schoolYearYearLevelIDLastName": "schoolYear#yearLevelID#lastName",
    },
    ExpressionAttributeValues: {
      ":schoolYearYearLevelID": `${currentSchoolStudent.schoolYear}#${props.yearLevelID}`,
      ":schoolYearYearLevelIDFirstName": `${currentSchoolStudent.schoolYear}#${props.yearLevelID}#${currentSchoolStudent.firstName}`,
      ":schoolYearYearLevelIDLastName": `${currentSchoolStudent.schoolYear}#${props.yearLevelID}#${currentSchoolStudent.lastName}`,
      ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      ":yearLevelID": props.yearLevelID,
    },
    ReturnValues: "UPDATED_NEW", // returns {yearLevelID}
  };
  logToWinstom("params SchoolStudent", params);
  try {
    // update the schoolStudent record
    let result = await docClient.update(params).promise();
    logToWinstom("Update SchoolStudent", result);
    return result;
  } catch (error) {
    logErrorsToWinstom("Error updating Student yearLevelID", error);
    return { err: "Error updating Student yearLevelID" };
  }
} // end updateStudentYearLevel()

/**********************************************************************
 * Change a student's firstName and/or lastName
 * UI should
 * Prevent a previous school from invoking the name change
 * Check that the new name is not a duplicate
 * Clean the name - capitalise and trim
 *   -its easier to compose/enforce these business rules at the UI level
 * If the login exists we update that also, otherwise no login change
 **********************************************************************/
async function updateStudentName(docClient, props) {
  // Read the student details and exit if the studentId does not exist
  // The student's wondeId, MSID are needed when recreating User and SchoolStudent records
  // The student's birthDate is needed to recreate the lastName#Dob indext in Student
  let foundStudent = await getStudentById(docClient, props.studentId);
  // returns {id,firstName,lastName,birthDate,wondeID,MISID}
  if (_.isEmpty(foundStudent))
    return { err: `${BAD_STUDENTID}:${props.studentId}` };
  if (foundStudent.err) return { err: foundStudent.err };

  // Read all schoolStudents for this student
  let schoolStudents = await getSchoolStudentsByStudentId(
    docClient,
    props.studentId
  );
  //Locate the current/latest schoolStudent for this school
  let currentSchoolStudent = {};
  for (const schoolStudent of schoolStudents) {
    if (schoolStudent.schoolID !== props.schoolId) continue;
    if (!currentSchoolStudent.id) {
      currentSchoolStudent = schoolStudent;
      continue;
    }
    if (schoolStudent.schoolYear > currentSchoolStudent.schoolYear) {
      currentSchoolStudent = schoolStudent;
    }
  }
  // logToWinstom("schoolStudents", schoolStudents);
  logToWinstom("Current schoolStudent", currentSchoolStudent);

  // "Remember" if the current student has a login ( ie a valid looking userId)
  let createLogin = currentSchoolStudent.userId?.length > 15 ? true : false;

  // If a login is to be created then we must preserve the Cognito "enabled" status
  let loginEnabled = false;
  if (createLogin) {
    let response = await getUserFromCognito(currentSchoolStudent.userId);
    if (response === COGNITO_USER_NOTFOUND) {
      // SsschoolSTudent has a userId but Cognito has no record (should not be)
      logToWinstom("User data", response);
      createLogin = false; // dont recreate a login if one does not exists
    } else {
      loginEnabled = response.Enabled; // as returned by Cognito
    }
  }

  // Clean out ALL the student's logins and any orphans that may exist
  // Rteurns whether a login (User record) already existed and if the User loginEnabled exists and is true or false
  let nullifyUserIds = true;
  let cleanUpResponse = await cleanupLogin(
    docClient,
    schoolStudents,
    nullifyUserIds
  );

  logToWinstom("CleanUp response", cleanUpResponse);

  // There was some code to check for duplicate names, but now we assume no duplicates exist in teh school
  // The responsibility to check for duplicates and make adjustments is now with the UI

  // Update the student's name schoolStudents (userId remains undefined for now)
  let promises = schoolStudents.map((schoolStudent) => {
    return updateSchoolStudent(
      docClient,
      "", // holder for a userId if needed, either "" or a valid userId
      schoolStudent,
      props.firstName ? props.firstName : foundStudent.firstName,
      props.lastName ? props.lastName : foundStudent.lastName
    );
  });
  let results = await Promise.all(promises);
  logToWinstom("Updated SchoolStudents", results);

  // Update the Student table with the new student name, and recreate indices as needed
  let newStudent = {
    id: props.studentId,
    firstName: props.firstName ? props.firstName : foundStudent.firstName,
    lastName: props.lastName ? props.lastName : foundStudent.lastName,
    birthDate: foundStudent.birthDate,
    wondeID: foundStudent.wondeID ? foundStudent.wondeID : undefined,
    MISID: foundStudent.MISID ? foundStudent.MISID : undefined,
  };
  let updatedStudent = await changeStudentName(docClient, newStudent);
  logToWinstom("Updated Student", updatedStudent);

  // If the student had a login then recreate it with the new name
  // We also have to make sure the Cognito "enabled" status is not changed
  if (createLogin) {
    // Retrieve the school record by Id
    let school = await getSchoolRecord(docClient, props.schoolId);
    // returns {id,schoolName,studentLoginEnabled, domainName} {error:error.msg} if failed
    //logToWinstom("school", school);

    // Add additional student attributes that we need to create the new User
    newStudent.wondeID = foundStudent.wondeID ? foundStudent.wondeID : null; // needed for the new User record
    newStudent.MISID = foundStudent.MISID ? foundStudent.MISID : null;
    newStudent.firstName = props.firstName
      ? props.firstName
      : foundStudent.firstName;
    newStudent.lastName = props.lastName
      ? props.lastName
      : foundStudent.lastName;

    // create a new Cognito and new User record and return the new userId
    let newUser = await createUser(docClient, newStudent, school);
    logToWinstom("New user", newUser);

    if (newUser.err) {
      logErrorsToWinstom("Error creating new User", newUser.err);
      return { err: "Error creating new User" };
    }

    // now update the Cognito enabled status to match what previously existed
    let response = await updateCognitoLoginEnable(newUser.userId, loginEnabled);
    if (response.err) {
      // just log it - not serious enough to bail
      logErrorsToWinstom(
        "Error updating Cognito 'enabled' status",
        response.err
      );
    }

    // Update the schoolStudent userId for the latest schoolStudent only
    response = await updateSchoolStudentUserId(
      docClient,
      currentSchoolStudent.id,
      newUser.userId
    );
    if (response.err) {
      logErrorsToWinstom("Error updating schoolStudent", response.err);
      return {
        err: `UPDATE_SCHOOLSTUDENT_USERID_FAILED ${response.schoolStudentId}`,
      };
    }
  } // end if studentLoginEnabled

  return UPDATE_STUDENT_NAME_SUCCESSFUL;
} // end updateStudentName()

// Change the domainName of a school
async function updateDomainName(docClient, props) {
  let params = {
    TableName: `School${envSuffix}`,
    Key: {
      id: props.schoolId,
    },
    UpdateExpression: `set domainName = :domainName,
                           updatedAt = :updatedAt`,
    ExpressionAttributeValues: {
      ":domainName": props.domainName ? props.domainName : "",
      ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
    },
    ReturnValues: "UPDATED_NEW",
  };
  try {
    let result = await docClient.update(params).promise();
    logToWinstom("Changed domainName", result);
    return result;
  } catch (error) {
    logErrorsToWinstom("error updating domainName", error);
    return { err: "error updating domainName" };
  }
} // end updateDomainName()

/**********************************************************************
 * Create login for a single student - clean up old logins as needed
 **********************************************************************/
async function createOneStudentLogin(docClient, props) {
  // Read the student details and bail if missing or other dynamo error
  // TODO - check for no student returned or error
  let foundStudent = await getStudentById(docClient, props.studentId);
  if (_.isEmpty(foundStudent))
    return { err: `${BAD_STUDENTID}:${props.studentId}` };
  if (foundStudent.err) return { err: foundStudent.err };
  logToWinstom("foundStudent", foundStudent);

  // Read all schoolStudents for this student, and locate the current/latest one for this school
  let schoolStudents = await getSchoolStudentsByStudentId(
    docClient,
    props.studentId
  );
  let currentSchoolStudent = {};
  for (const schoolStudent of schoolStudents) {
    if (schoolStudent.schoolID !== props.schoolId) continue;
    if (!currentSchoolStudent.id) {
      currentSchoolStudent = schoolStudent;
      continue;
    }
    if (schoolStudent.schoolYear > currentSchoolStudent.schoolYear) {
      currentSchoolStudent = schoolStudent;
    }
  }
  if (_.isEmpty(currentSchoolStudent))
    return { err: `No matching schoolStudent records` };

  logToWinstom("current schoolStudent", currentSchoolStudent);

  // Clean out the login and any orphans that may exist
  let nullifyUserIds = true;
  await cleanupLogin(docClient, schoolStudents, nullifyUserIds);

  let school = await getSchoolRecord(docClient, props.schoolId); //{id,schoolName,studentLoginEnabled,domainName}
  logToWinstom("school", school);
  // Create the new Cognito user and DynamoDB User record and return the new userId
  let newUser = await createUser(docClient, foundStudent, school);
  // returns { studentId: student.id, userId: newUser.userId }
  logToWinstom("new user", newUser);
  if (newUser.err) {
    return { err: newUser.err }; // newUser.err is a string message
  }

  // Update only the latest schoolStudent in this school to the new userId
  let response = await updateSchoolStudentUserId(
    docClient,
    currentSchoolStudent.id,
    newUser.userId
  );
  if (response.err) {
    return {
      err: `UPDATE_SCHOOLSTUDENT_USERID_FAILED ${response.schoolStudentId}`,
    };
  }
  return ENABLE_LOGIN_SUCCESSFUL;
} // end function createOneStudentLogin()

/**********************************************************************
 * Delete student login for a single student - clean up as needed
 **********************************************************************/
async function deleteOneStudentLogin(docClient, props) {
  logToWinstom("Deleting login for student", props.studentId);
  // Read the student details and exit if the studentId does not exist
  let foundStudent = await getStudentById(docClient, props.studentId);
  if (_.isEmpty(foundStudent))
    return { err: `${BAD_STUDENTID}:${props.studentId}` };
  if (foundStudent.err) return { err: foundStudent.err };

  // Read all schoolStudents for this student
  let schoolStudents = await getSchoolStudentsByStudentId(
    docClient,
    props.studentId
  );

  // clean out the logins
  let nullifyUserIds = true;
  await cleanupLogin(docClient, schoolStudents, nullifyUserIds);
  return DISABLE_LOGIN_SUCCESSFUL;
} // end deleteOneStudentLogin()

/**********************************************************************
 * Create student logins for a whole school
 * NOTE: side effect - Will set "studentLoginEnabled" to true in the School record
 * NOTE: Only adds the userId to the most recent schoolStudent
 * NOTE: "studentDeparted".
 *       We assume when running this command that the "setStudentDepartedInSchool" method
 *       has already been run.
 *       We only create logins for students who have "studentDeparted" === false
 *       If it has not been run, then all students in the school will get logins
 **********************************************************************/
async function createStudentLogins(docClient, props) {
  // Read the schoolStudents for the school (all records will need to be updated)
  console.time("createStudentLogins");
  // Clean out any existing Cognito users and User records
  console.time("Cleanout");
  await deleteStudentLogins(docClient, props); // maybe inefficent but simple
  console.timeEnd("Cleanout");

  // Read the schoolStudents for the school (all records will need to be updated)
  let schoolStudents = await getSchoolStudentsBySchoolId(
    docClient,
    props.schoolId
  );
  // returns {id, userId, studentID, schoolYear, studentDeparted}
  logToWinstom("No of schoolStudents", schoolStudents.length);
  logToWinstom("schoolStudent[0]", schoolStudents[0]);

  let uniqueStudentsMap = new Map(); // map of unique studentIds - not departed
  let schoolStudentsToUpdateMap = new Map(); // map of latest (by createdAt) schoolStudents - not departed - in the selected school
  for (const schoolStudent of schoolStudents) {
    // skip departed students
    if (
      schoolStudent.hasOwnProperty("studentDeparted") &&
      schoolStudent.studentDeparted === true
    ) {
      console.log(" skipping departed student", schoolStudent);
      continue;
    }
    // Make the unique studentId map
    if (!uniqueStudentsMap.has(schoolStudent.studentID)) {
      uniqueStudentsMap.set(schoolStudent.studentID); // studentId keys only
    }
    // Make the map of schoolStudents to be updated
    if (!schoolStudentsToUpdateMap.get(schoolStudent.studentID)) {
      schoolStudentsToUpdateMap.set(schoolStudent.studentID, schoolStudent);
      continue;
    }
    let savedSchoolStudent = schoolStudentsToUpdateMap.get(
      schoolStudent.studentID
    );
    if (savedSchoolStudent.createdAt < schoolStudent.createdAt) {
      schoolStudentsToUpdateMap.set(schoolStudent.studentID, schoolStudent);
    }
  }
  let schoolStudentsToUpdate = Array.from(schoolStudentsToUpdateMap.values());
  logToWinstom("schoolStudentsToUpdate", schoolStudentsToUpdate.length);
  logToWinstom("schoolStudents", schoolStudents.length);

  let uniqueStudents = Array.from(uniqueStudentsMap.keys());
  logToWinstom("no of uniqueStudents", uniqueStudents.length);

  // Read the student records in batches of GET_BATCHSIZE (100)
  // We need these to get the wondeId and MISID for the User records
  let studentIdBatches = makeBatches(uniqueStudents, GET_BATCHSIZE); // array of arrays of studentIds
  logToWinstom("student batches", studentIdBatches.length);
  console.time("readStudents");
  let page = 1;
  let students = [];
  for (const studentIdBatch of studentIdBatches) {
    let Keys = [];
    for (const studentId of studentIdBatch) {
      Keys.push({ id: studentId });
    }
    let params = {
      RequestItems: {
        [`Student${envSuffix}`]: {
          Keys,
          ProjectionExpression: "id,firstName,lastName,wondeID,MISID",
        },
      },
    };
    try {
      logToWinstom(
        `Reading page ${page++} of ${studentIdBatches.length} student pages`
      );
      let response = await docClient.batchGet(params).promise();
      let studentBatch = response.Responses[`Student${envSuffix}`];
      students = [...students, ...studentBatch]; // each student {id,firstName,lastName,wondeID,MISID}
    } catch (error) {
      logToWinstom("error reading students", error);
      break;
    }
  }
  logToWinstom("No of students", students.length);
  console.timeEnd("readStudents");

  // Batch up the unique students into BATCHSIZE (25) to create the Cognito and User records
  let studentBatches = makeBatches(students, BATCHSIZE); // an array of student arrays
  logToWinstom("student batches", studentBatches.length);
  logToWinstom("student batches", studentBatches[0]);

  let school = await getSchoolRecord(docClient, props.schoolId);

  console.time("creatingUsers");
  let userMap = new Map(); //{key studentId, value userId}
  let n = 1;
  for (const studentBatch of studentBatches) {
    logToWinstom(
      `Creating users for batch ${n++} of ${
        studentBatches.length
      } student batches`
    );
    let promises = studentBatch.map((student) => {
      return createUser(docClient, student, school); //student = {id,firstName,lastName,wondeID,MISID}
    });
    let returnCodes = await Promise.all(promises); 
    await sleep(500); // throttle to say under Cognito 20 transactions per sec
    logToWinstom("createUser returnCodes", returnCodes);
    for (const returnCode of returnCodes) {
      if (returnCode.userId && returnCode.studentId) {
        userMap.set(returnCode.studentId, returnCode.userId); // map of userIds keyed by studentId
      } else {
        userMap.set(returnCode.studentId, "");
        logToWinstom(`No user created for student ${returnCode.studentId}`);
      }
    }
  } // end for
  console.timeEnd("creatingUsers");

  // Add userIds to the latest schoolStudent for each student
  let schoolStudentBatches = makeBatches(schoolStudentsToUpdate, BATCHSIZE); // an array of schoolStudent arrays
  logToWinstom("schoolStudent batches", schoolStudentBatches.length);
  console.time("updatingSchoolStudents");
  let i = 1;
  for (const schoolStudentBatch of schoolStudentBatches) {
    logToWinstom(
      `Updating schoolStudents batch ${i++} of ${schoolStudentBatches.length}`
    );
    let promises = schoolStudentBatch.map((schoolStudent) => {
      return updateSchoolStudentUserId(
        docClient,
        schoolStudent.id,
        userMap.get(schoolStudent.studentID) // returns the userId (or possibly "", if no user was created)
      );
    });
    let responses = await Promise.all(promises);
    logToWinstom(responses);
  } // end for

  console.timeEnd("updatingSchoolStudents");

  // set the school's studentLoginsEnabled bit
  await updateStudentLogins(docClient, {
    schoolId: props.schoolId,
    enableLogins: true,
  });

  console.timeEnd("createStudentLogins");
  return DONE;
} // createStudentLogins()

/**
 * How we decide if a student is departed from a school:
 * Set studentDeparted in a schoolStudent record for a student in a specific school if:
 * a) The lastest schoolStudent record for the student is in another school
 * b) The lastest schoolStudent record for the student has a schoolYear less than the current schoolYear in this region
 * c) If any schoolStudent in the school for that student has already been set to studentDeparted (manually via the UI).
 * The Algorithm is:
 * - get the current schoolYear
 * - read the all the schoolSTudent records for the school getSchoolStudentsBySchoolId()
 * - For each schoolStudent in the school
 *     - read all the schoolStudents for that student (avoiding multiple reads per student)
 *     - make a map of students who have departed  (departedStudentsMap)
 *     - make a map of students in the current school (currentStudentMap)
 *     - locate the most recent schoolStudent and see if it matches this school
 *     - If matches
 *         set studentDeparted = false
 *     - else
 *         set studentDeparted = true
 */
async function setStudentDepartedInSchool(docClient, props) {
  // Read the schoolStudents for the school (all records will need to be updated)
  let schoolStudents = await getSchoolStudentsBySchoolId(
    docClient,
    props.schoolId
  );
  console.log("schoolStudents", schoolStudents);

  let departedStudentsMap = new Map();
  let currentStudentMap = new Map();
  let index = 0;
  for (let schoolStudent of schoolStudents) {
    // "Check if this student's status has already been tested
    //  and if so set the "studentDeparted" bit.
    if (departedStudentsMap.has(schoolStudent.studentID)) {
      schoolStudent.studentDepartedPending = true;
      continue;
    }
    if (currentStudentMap.has(schoolStudent.studentID)) {
      schoolStudent.studentDepartedPending = false;
      continue;
    }
    // Student's transfer status is not known so we read all schoolStudents for this student
    if (index++ % 50 === 0) console.log(`Getting schoolstudent ${index} by ID`); // just logging to show progress
    let studentsSchools = await getSchoolStudentsByStudentId(
      docClient,
      schoolStudent.studentID
    );
    //logToWinstom("students schools", studentsSchools);

    // Find the most recent schoolstudent for this student
    // (could do this more clearly using a sort by createdAt)
    let mostRecentSchoolStudent = null;
    for (const studentSchool of studentsSchools) {
      if (!mostRecentSchoolStudent) {
        mostRecentSchoolStudent = studentSchool;
        continue;
      }
      if (studentSchool.createdAt > mostRecentSchoolStudent.createdAt) {
        mostRecentSchoolStudent = studentSchool;
      }
    }
    //console.log("mostRecentSchoolStudent", mostRecentSchoolStudent);
    if (mostRecentSchoolStudent.schoolID === props.schoolId) {
      // not departed
      schoolStudent.studentDepartedPending = false;
      if (!currentStudentMap.has(schoolStudent.studentID)) {
        currentStudentMap.set(schoolStudent.studentID);
      }
    } else {
      // departed
      schoolStudent.studentDepartedPending = true;
      if (!departedStudentsMap.has(schoolStudent.studentID)) {
        departedStudentsMap.set(schoolStudent.studentID);
      }
    }
  } // end for every schoolStudent

  // Now update any schoolstudents where
  //   studentDeparted does not exist
  //   studentDeparted exists and is different from latest assessment
  let schoolStudentsToUpdate = [];
  for (let schoolStudent of schoolStudents) {
    if (!schoolStudent.hasOwnProperty("StudentDeparted")) {
      schoolStudent.studentDeparted = schoolStudent.studentDepartedPending;
      delete schoolStudent.studentDepartedPending;
      schoolStudentsToUpdate.push(schoolStudent);
    } else {
      if (
        schoolStudent.studentDeparted !== schoolStudent.studentDepartedPending
      ) {
        schoolStudent.studentDeparted = schoolStudent.studentDepartedPending;
        delete schoolStudent.studentDepartedPending;
        schoolStudentsToUpdate.push(schoolStudent);
      }
    }
  } // end for
  console.log("SchoolStudents to update", schoolStudentsToUpdate.length);

  // now update in batches of 20
  let i = 1;
  let schoolStudentBatches = makeBatches(schoolStudentsToUpdate, BATCHSIZE); // an array of student arrays
  for (const schoolStudentBatch of schoolStudentBatches) {
    logToWinstom(
      `Updating schoolStudents for batch ${i++} of ${
        schoolStudentBatches.length
      } student batches`
    );
    let promises = schoolStudentBatch.map(async (schoolStudent) => {
      let params = {
        TableName: `SchoolStudent${envSuffix}`,
        Key: {
          id: schoolStudent.id,
        },
        UpdateExpression: `set studentDeparted = :studentDeparted, 
                          updatedAt = :updatedAt`,
        ExpressionAttributeValues: {
          ":studentDeparted": schoolStudent.studentDeparted,
          ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
        },
        ReturnValues: "UPDATED_NEW",
      };
      return await docClient.update(params).promise();
    });
    await Promise.all(promises);
  } // end for

  return DONE;
} // end setStudentDepartedInSchool(docClient, props)

/**********************************************************************
 * Delete student login for a whole school
 * NOTE: side effect - Sets studentLoginEnabled to false in the School table
 *       all Cognito records are deleted, as well as User records and schoolStudent UserIds are set to null
 * NOTE: One or more students in the school may have left the school
 *       If so, we still delete the login for that school assuming it still exists
 *       This should not impact the students login in a later school
 * NOTE: Can take mins to run depending on no of students (typical 2 mins)
 * *********************************************************************/
async function deleteStudentLogins(docClient, props) {
  console.time("deleteStudentLogins");
  // Read the schoolStudents for the school (all records may need to be updated)
  let schoolStudents = await getSchoolStudentsBySchoolId(
    docClient,
    props.schoolId
  ); // returns {id,userId,studentID}
  logToWinstom("No of schoolStudents", schoolStudents.length);

  // Extract a list of unique userIds and make them into batches
  let uniqueUserIdsMap = new Map();
  let schoolStudentsWithUserIds = [];
  for (const schoolStudent of schoolStudents) {
    if (schoolStudent.userId) {
      schoolStudentsWithUserIds.push(schoolStudent); // to remove the userIds below
      if (!uniqueUserIdsMap.has(schoolStudent.userId)) {
        uniqueUserIdsMap.set(schoolStudent.userId); // to remove the User and Cognito user below
      }
    }
  }
  let uniqueUserIds = Array.from(uniqueUserIdsMap.keys());
  logToWinstom("No of uniqueUserIds", uniqueUserIds.length);
  let userIdBatches = makeBatches(uniqueUserIds, DEL_BATCHSIZE);
  logToWinstom("No of uniqueUserIds batches", userIdBatches.length);

  // for each userId - delete User and Cognito record
  console.time("CleaningUsers");
  let n = 1;
  for (const userIdBatch of userIdBatches) {
    logToWinstom(
      `**********Cleaning User batch ${n++} of ${userIdBatches.length} batches`
    );
    let promises = userIdBatch.map((userId) => {
      return deleteUser(docClient, userId);
    });
    let returnCodes = await Promise.all(promises);
    await sleep(500); // Cant exceed 20 transactions/sec for Cognito
    logToWinstom("deletes", returnCodes);
  }
  console.timeEnd("CleaningUsers");

  // Remove the userId from all schoolStudents that have a userId
  let schoolStudentBatches = makeBatches(schoolStudentsWithUserIds, BATCHSIZE);
  logToWinstom("schoolStudentBatches", schoolStudentBatches.length);
  console.time("CleaningSchoolStudents");
  let i = 1;
  for (const schoolStudentBatch of schoolStudentBatches) {
    logToWinstom(
      `**********Removing UserIds schoolStudent batch ${i++} of ${
        schoolStudentBatches.length
      } batches`
    );
    let promises = schoolStudentBatch.map((schoolStudent) => {
      return updateSchoolStudentUserId(docClient, schoolStudent.id, null); // clears the userId in the schoolStudent
    });
    await Promise.all(promises);
  }
  console.timeEnd("CleaningSchoolStudents");

  // Check if there are orphan student Users and associated Cognito records that need to be deleted
  let users = await getUsersBySchoolId(docClient, props.schoolId); // returns {email,userId,userType}
  let studentUsers = users.filter(
    (user) => user.userId && user.userType === "Student"
  );
  let studentUsersWithoutUserIds = users.filter(
    (user) => !user.userId && user.userType === "Student"
  );
  logToWinstom(
    `No of orphan Users still left with no userIds for schoolID ${props.schoolId}`,
    studentUsersWithoutUserIds.length
  );
  logToWinstom(
    `No of orphan Users still left with userIds for schoolID ${props.schoolId}`,
    studentUsers.length
  );
  if (studentUsers.length > 0) {
    // Batch them up for deletion
    let userBatches = makeBatches(studentUsers, DEL_BATCHSIZE);
    console.time("CleaningStudentUsers");
    let n = 1;
    let returnCodes;
    for (const userBatch of userBatches) {
      console.time("cc");
      logToWinstom(
        `**********Cleaning Orphan User batch ${n++} of ${
          userBatches.length
        } batches`
      );
      let promises = userBatch.map((user) => {
        return deleteUser(docClient, user.userId);
      });
      returnCodes = await Promise.all(promises);
      console.timeEnd("cc");
      console.log("waiting for 500 ms");
      await sleep(500); // Cant exceed 20 transactions/sec for Cognito
      logToWinstom("deletes", returnCodes);
    }
    console.timeEnd("CleaningStudentUsers");
  } // end if

  // Delete any users without userIds
  if (studentUsersWithoutUserIds.length > 0) {
    for (const user of studentUsersWithoutUserIds) {
      await deleteUserByEmail(docClient, user.email);
    }
  }
  console.timeEnd("deleteStudentLogins");

  // clear the school's studentLoginsEnabled bit
  await updateStudentLogins(docClient, {
    schoolId: props.schoolId,
    enableLogins: false,
  });

  return DONE;
} // end deleteStudentLogins()

// Enable/disable the studentLoginEnable bit in a School record
async function updateStudentLogins(docClient, props) {
  let params = {
    TableName: `School${envSuffix}`,
    Key: {
      id: props.schoolId,
    },
    UpdateExpression: `set studentLoginEnabled = :studentLoginEnabled,
                           updatedAt = :updatedAt`,
    ExpressionAttributeValues: {
      ":studentLoginEnabled": props.enableLogins,
      ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
    },
    ReturnValues: "UPDATED_NEW",
  };
  try {
    let result = await docClient.update(params).promise();
    logToWinstom("updated studentLoginEnabled in School", result);
    return result;
  } catch (error) {
    logErrorsToWinstom("error updating studentLoginEnabled", error);
    return { err: "error updating studentLoginEnabled" };
  }
} // end updateStudentLogins()

// temp method to fix a problem where the schoolStudents were not updated with any userIds
async function deOrphanLogins(docClient, props) {
  let result, ExclusiveStartKey;
  let users = [];
  let page = 0;
  do {
    console.log(`reading users page ${page++}`);
    result = await docClient
      .scan({
        TableName: `User${envSuffix}`,
        ExclusiveStartKey,
        Limit: 400,
        ProjectionExpression: "email,userId,createdAt",
      })
      .promise();

    ExclusiveStartKey = result.LastEvaluatedKey;
    for (const user of result.Items) {
      if (user.email.includes(props.domainName)) {
        users.push(user);
      }
    }
  } while (result.LastEvaluatedKey);
  console.log("users", users.length);

  let userIdBatches = makeBatches(users, DEL_BATCHSIZE);
  // for each userId - delete User and Cognito record
  console.time("CleaningUsers");
  let n = 1;
  for (const userIdBatch of userIdBatches) {
    logToWinstom(
      `**********Cleaning User batch ${n++} of ${userIdBatches.length} batches`
    );
    let promises = userIdBatch.map((user) => {
      return deleteUser(docClient, user.userId);
    });
    let returnCodes = await Promise.all(promises);
    await sleep(500); // Cant exceed 20 transactions/sec for Cognito
    logToWinstom("deletes", returnCodes);
  }
  console.timeEnd("CleaningUsers");
  return DONE;
} // end

// Add a new existing student to a classroom
async function addNewStudentToClassroom(docClient, props) {
  let response = await addNewStudentToSchool(docClient, props);
  if (response.err) {
    return response;
  }
  // the new studentId is returned above and passed as below
  response = await addExistingStudentToClassroom(docClient, {
    studentId: response.studentId,
    classroomId: props.classroomId,
  });

  return response;
} // end addNewStudentToClassroom(docClient, props)

// Add a new student to a school
async function addNewStudentToSchool(docClient, props) {
  // we asume that basic checks for duplicate student has already been done at the UI
  //    ie check that the student does not exist in the database (by lastName#dob#firstName)
  // We assume that the name has been properly formatted ie title case, no special chars

  // Save to the Student table
  let dob = props.birthDate;
  let studentID = v4();
  logToWinstom("studentID", studentID);
  let params = {
    Item: {
      id: studentID,
      firstName: props.firstName,
      lastName: props.lastName,
      middleName: props.middleName ? props.middleName : "",
      gender: props.gender,
      birthDate: dob, // assume its in YYYY-MM-DD format
      yearLevelID: props.yearLevelID,
      __typename: "Student", // used hard coded as tableName may change with env
      createdAt: `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      updatedAt: `${dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      "lastName#birthDate": `${props.lastName}#${dob}`,
    },
    TableName: `Student${envSuffix}`,
  };
  let response;
  try {
    response = await docClient.put(params).promise();
    logToWinstom("response", response);
  } catch (error) {
    logToWinstom("Error adding student", error);
    return { err: "Error adding student" };
  }

  // Save to the SchoolStudent table
  let schoolYear = getSchoolYear();
  let schoolStudentId = v4();
  logToWinstom("schoolStudentId", schoolStudentId);
  params = {
    Item: {
      id: schoolStudentId,
      schoolID: props.schoolId,
      studentID: studentID,
      schoolYear: schoolYear,
      yearLevelID: props.yearLevelID,
      firstName: props.firstName,
      lastName: props.lastName,
      __typename: "SchoolStudent",
      createdAt: `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      updatedAt: `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      "schoolYear#firstName": `${schoolYear}#${props.firstName}`,
      "schoolYear#lastName": `${schoolYear}#${props.lastName}`,
      "schoolYear#studentID": `${schoolYear}#${studentID}`,
      "schoolYear#yearLevelID": `${schoolYear}#${props.yearLevelID}`,
      "schoolYear#yearLevelID#firstName": `${schoolYear}#${props.yearLevelID}#${props.firstName}`,
      "schoolYear#yearLevelID#lastName": `${schoolYear}#${props.yearLevelID}#${props.lastName}`,
      userId: undefined,
    },
    TableName: `SchoolStudent${envSuffix}`,
  };
  try {
    response = await docClient.put(params).promise();
    logToWinstom("response", response);
    return { studentId: studentID }; // Note: we may need this to add the student to a classroom
  } catch (error) {
    logToWinstom("Error adding schoolStudent", error);
    // TODO delete the above Student on schoolStudent failure (or will have orphan student)
    return { err: "Error adding schoolStudent" };
  }
} // end addStudentToSchool(docClient, props)

// Add an existing student to a classroom - ie we have a studentId and classroomId
// If the stduent is already in the classroom, return success code
async function addExistingStudentToClassroom(docClient, props) {
  // check if student is already in the classroom, and if so then just return
  let response = await getClassroomStudent(docClient, props);
  if (response.classroomStudentId || response.err) {
    if (response.classroomStudentId) {
      logToWinstom("student already in classroom");
    }
    return response;
  }

  // student is not already in the class so we can proceed
  logToWinstom("student not found in classroom so adding");

  let id = v4();
  logToWinstom("classroomStudentId", id);
  let params = {
    Item: {
      id,
      classroomID: props.classroomId,
      studentID: props.studentId,
      __typename: "ClassroomStudent",
      createdAt: `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      updatedAt: `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
    },
    TableName: `ClassroomStudent${envSuffix}`,
  };
  try {
    response = await docClient.put(params).promise();
    logToWinstom("response", response);
    return response;
  } catch (error) {
    logToWinstom("Error adding classroomStudent", error);
    return { err: "Error adding classroomStudent" };
  }
} // end addExistingStudentToClassroom(docClient, props)

async function removeStudentFromClassroom(docClient, props) {
  // get the classroomStudentID if it exists
  let response = await getClassroomStudent(docClient, props);
  if (!response.hasOwnProperty("classroomStudentId") || response.err) {
    return response;
  }
  logToWinstom(`Deleting classroomStudent id: ${response.classroomStudentId}`);

  let params = {
    TableName: `ClassroomStudent${envSuffix}`,
    Key: {
      id: response.classroomStudentId, // id is the Partition Key, '123' is the value of it
    },
  };
  try {
    response = await docClient.delete(params).promise();
    logToWinstom("response", response);
    return response;
  } catch (error) {
    logToWinstom("Error deleting classroomStudent", error);
    return { err: "Error deleting classroomStudent" };
  }
} // end removeStudentFromClassroom(docClient, props)

/***************************
 *  Lambda Entry Point
 ***************************/
const handler = async (event) => {
  // Thelambda may be be invoked by APIGateway either synchronously or asynchronously
  // The synchronous event has a body of type string that needs to be parsed
  // The asynchronous event is an object that may be used directly
  logToWinstom("event", event);
  let props = event;
  if (event.hasOwnProperty("body")) {
    // body has type string so we JSON parse to get the object
    props = JSON.parse(event.body);
  }

  let docClient = new AWS.DynamoDB.DocumentClient();

  let retVal; // what we return as the result
  switch (props.actionCode) {
    /******************************
     * Single student methods
     ******************************/
    case "getLoginEnabledStatus": {
      // get the current login status of a student
      break;
    }
    case "updateStudentDeparted": {
      // NEW: sets or clears "studentDeparted" bit in all schoolStudent records for a student
      //      in a school
      if (
        !(
          props.studentId &&
          props.schoolId &&
          props.hasOwnProperty("studentDeparted")
        )
      ) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await updateStudentDeparted(docClient, props);
      retVal = result.err ? result.err : UPDATE_STUDENT_DEPARTED_SUCCESSFUL;
      break;
    }
    case "enableOneStudentLogin": {
      // NEW: enables / disables the Cognito "enabled" status
      if (
        !(
          props.studentId &&
          props.schoolId &&
          props.hasOwnProperty("enableLogin")
        )
      ) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await enableOneStudentLogin(docClient, props); // Changed 12/8/2023 to be tested
      retVal = result.err
        ? result.err
        : result.msg // in this case there was not exactly one User record
        ? result.msg
        : CHANGE_LOGIN_ENABLED_SUCCESSFUL;
      break;
    }

    // Create login for one student at nominated school
    case "createOneStudentLogin": {
      if (!(props.studentId && props.schoolId)) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await createOneStudentLogin(docClient, props); // tested 4/8/2023 BC
      retVal = result.err ? result.err : ENABLE_LOGIN_SUCCESSFUL;
      break;
    }
    // Delete login for one student at nominated school
    case "deleteOneStudentLogin": {
      if (!props.studentId) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await deleteOneStudentLogin(docClient, props); // tested 4/8/2023 BC
      result.err ? (retVal = result.err) : (retVal = DISABLE_LOGIN_SUCCESSFUL);
      break;
    }
    /******************************
     * Whole School Login control
     ******************************/
    case "setStudentDepartedInSchool": {
      // NEW: sets studentDeparted bit in all schoolSTudent records for a school
      if (!props.schoolId) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await setStudentDepartedInSchool(docClient, props); // tested 7/8/2023 BC
      retVal = result.err ? result.err : SET_STUDENT_DEPARTED_SUCCESSFUL;
      break;
    }
    case "updateStudentLogins": {
      // NEW: sets studentLoginEnabled to true in the School table
      if (!(props.schoolId && props.enableLogins)) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await updateStudentLogins(docClient, props); // changed 12/8/2023 BC
      retVal = result.err
        ? result.err
        : CHANGE_STUDENT_LOGIN_ENABLED_SUCCESSFUL;
      break;
    }
    // create logins for a school
    case "createStudentLogins": {
      if (!props.schoolId) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await createStudentLogins(docClient, props); // tested 7/8/2023
      retVal = result.err
        ? result.err
        : CHANGE_STUDENT_LOGIN_ENABLED_SUCCESSFUL;
      break;
    }

    // Disable logins for a school
    case "deleteStudentLogins": {
      if (!props.schoolId) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await deleteStudentLogins(docClient, props); // tested 7/8/2023
      retVal = result.err ? result.err : DELETE_LOGINS_SUCCESSFUL;
      break;
    }
    /******************************
     * Adding a student to school or classroom
     * remove student from classroom
     ******************************/
    // Add a new student to a school - ie new Student and schoolStudent
    // Does not create login
    case "addNewStudentToSchool": {
      if (
        !(
          props.schoolId &&
          props.firstName &&
          props.lastName &&
          props.birthDate &&
          props.gender &&
          props.yearLevelID
        )
      ) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await addNewStudentToSchool(docClient, props);
      retVal = result.err ? result.err : ADD_NEW_STUDENT_TO_SCHOOL_SUCCESSFUL;
      break;
    }
    // Add a new student to a classroom - ie new classroomStudent
    // The use case is when a new student arrives and the teachers wants to put him in a
    // classroom as a first transaction
    // This is implements by first calling  "addNewStudentToSchool" then "addExistingStudentToClassroom"
    case "addNewStudentToClassroom": {
      if (
        !(
          props.schoolId &&
          props.firstName &&
          props.lastName &&
          props.birthDate &&
          props.gender &&
          props.yearLevelID &&
          props.classroomId
        )
      ) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await addNewStudentToClassroom(docClient, props);
      retVal = result.err ? result.err : ADD_STUDENT_TO_CLASSROOM_SUCCESSFUL;
      break;
    }

    // Here we know the studentId already so we just need the classroom id to add the student
    case "addExistingStudentToClassroom": {
      if (!(props.classroomId && props.studentId)) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await addExistingStudentToClassroom(docClient, props);
      retVal = result.err ? result.err : ADD_STUDENT_TO_CLASSROOM_SUCCESSFUL;
      break;
    }
    // If it exists - remove student from classroom
    case "removeStudentFromClassroom": {
      if (!(props.classroomId && props.studentId)) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await removeStudentFromClassroom(docClient, props);
      retVal = result.err
        ? result.err
        : REMOVE_STUDENT_FROM_CLASSROOM_SUCCESSFUL;
      break;
    }
    /******************************
     * Other Methods
     ******************************/
    case "deOrphanLogins": {
      let result = await deOrphanLogins(docClient, props);
      retVal = result.err ? result.err : "deOrphanLogins successful";
      break;
    }
    // NEW: simple testMethod to very API calling and returns
    case "testAPIMethod": {
      if (!props.schoolId) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await testAPIMethod(docClient, props); // Tested 3/8/2023 BC
      retVal = result.err ? result.err : TEST_METHOD_SUCCESSFUL;
      break;
    }
    // NEW: updates the domainName of the passed in school
    case "updateDomainName": {
      if (!(props.schoolId && props.domainName)) {
        retVal = BAD_OR_NO_ATTRIBUTES;
        break;
      }
      let result = await updateDomainName(docClient, props); // Tested 3/8/2023 BC
      retVal = result.err ? result.err : CHANGE_DOMAIN_NAME_SUCCESSFUL;
      break;
    }
    // Change one student's attributes - there are several cases needing different treatment
    // but several could be changed at once but providing enough props
    case "updateStudentDetails": {
      // if birthdate                    - update Student record only including the dob index
      // if middleName                   - update the student record only - middelName index not used
      // if yealLevelID                  - update Student record and current SchoolStudent record only
      // if firstName and/or lastName    - update Student, SchoolStudent, User, Cognito and all SchoolStudents
      // if photo                        - update student record photoattribute only
      let result = null;
      if (props.studentId && props.birthDate) {
        result = await updateStudentBirthDate(docClient, props); // tested 2/8/2023 BC
      }

      if (props.studentId && props.photo) {
        result = await updateStudentPhoto(docClient, props); // new 9/9/2023
      }

      if (props.studentId && props.hasOwnProperty("middleName")) {
        result = await updateStudentMiddleName(docClient, props); // tested 2/8/2023 BC
      }

      if (props.studentId && props.gender) {
        result = await updateStudentGender(docClient, props); // new at 27/08/2023
      }

      if (props.studentId && props.yearLevelID && props.schoolId) {
        result = await updateStudentYearLevelId(docClient, props); // tested 2/8/2023 BC
      }

      if (
        props.studentId &&
        props.schoolId &&
        (props.firstName || props.lastName)
      ) {
        result = await updateStudentName(docClient, props); // tested 4/8/2023 BC
      }
      if (result === null) {
        retVal = BAD_OR_NO_ATTRIBUTES;
      } else {
        retVal = result.err ? result.err : UPDATE_STUDENT_ATTRIBUTE_SUCCESSFUL;
      }
      break;
    }
    // bad action code
    default: {
      retVal = UNKNOWN_ACTION_CODE + ": " + props.actionCode;
    }
  }
  logToWinstom(`Final Result ${JSON.stringify(retVal)}`);
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    statusCode: 200,
    body: JSON.stringify(retVal),
  };
}; // end of handler

handler(event);