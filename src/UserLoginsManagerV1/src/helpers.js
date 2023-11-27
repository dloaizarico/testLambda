const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const AWS = require("aws-sdk");
const dayjs = require("dayjs");
const _ = require("lodash");
const { logger } = require("./logger");

AWS.config.update({ region: process.env.REGION });
let envSuffix = `-${process.env.ENV_SUFFIX}-${process.env.ENV}`;
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

// get region specific school year at now
const REGIONS = {
  Australia: "ap-southeast-2",
  London: "eu-west-2",
};

const COGNITO_USER_NOTFOUND = "Cognito User not found";
const FAILED_TO_CREATE_COGNITO_USER = "Could not create Cognito user";
const FAILED_TO_CREATE_USER_RECORD = "Could not create User record";
const STUDENT_NOT_FOUND = "student not found";

// utility to convert and array into an array of arrays of a nominated size
// used for processing larger arrays in batches
function makeBatches(arr, batchSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += batchSize) {
    const batch = arr.slice(i, i + batchSize);
    res.push(batch);
  }
  return res; // an array of arrays of the required batch size
}

// returns a region specific schoolYear that depends on todays date.
function getSchoolYear() {
  if (process.env.REGION !== REGIONS.Australia && new Date().getMonth() >= 7) {
    return new Date().getFullYear() + 1;
  } else {
    return new Date().getFullYear();
  }
}

// Delete a User record by userID
async function deleteUserByUserId(docClient, userId) {
  // We can only delete User by email the primary key
  let user = await getUserRecord(docClient, userId);
  if (user.Items.length === 0) {
    // Can happen with orphan userIds in schoolStudent
    logToWinstom(`User with userId ${userId} does not exist`);
    return { success: true };
  }
  // if user exists then delete the record
  if (user.Count === 1) {
    let result = await deleteUserByEmail(docClient, user.Items[0].email);
    return result;
  } else {
    logToWinstom("Multiple User records found for the same UserID");
  }
  return { success: false };
} // end deleteUserByUserId

// delete a user by email address
async function deleteUserByEmail(docClient, email) {
  let params = {
    TableName: `User${envSuffix}`,
    Key: {
      email: email,
    },
  };
  try {
    await docClient.delete(params).promise();
    return { success: true };
  } catch (error) {
    logToWinstom("error", error);
    return { success: false };
  }
} // end deleteUserByEmail()

// get a User record by userId
async function getUserRecord(docClient, userId) {
  let params = {
    TableName: `User${envSuffix}`,
    IndexName: "byUserId",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": userId },
    ProjectionExpression: "email, userId",
  };
  try {
    let resp = await docClient.query(params).promise();
    return resp;
  } catch (error) {
    logToWinstom("error", error);
    return { error: error };
  }
}

// function to delete a User and Cognito user by userId
async function deleteUser(docClient, userId) {
  //logToWinstom("Deleting DynamoDB User record", userId);
  let userSuccess = await deleteUserByUserId(docClient, userId); // Delete the User record
  //logToWinstom("Deleting Cognito user", userId);
  let cognitoSuccess = await deleteCognitoUser(userId); // Delete the Cognito record
  if (cognitoSuccess.success && userSuccess.success) {
    return { success: true };
  }
  return { success: false };
}

// For one student only - delete User and Cognito records and
// optionally set all his schoolStudent userIds to null
async function cleanupLogin(docClient, schoolStudents, nullifyUser = false) {
  // find the number of unique userIds in the schoolStudent records (should be only 1 max)
  let uniqueUserIdsMap = new Map();

  for (const schoolStudent of schoolStudents) {
    if (schoolStudent.userId && !uniqueUserIdsMap.has(schoolStudent.userId)) {
      uniqueUserIdsMap.set(schoolStudent.userId);
    }
  }
  let uniqueUserIds = Array.from(uniqueUserIdsMap.keys());
  logToWinstom("uniqueUserIds", uniqueUserIds);

  // Delete the User and Cognito records if any exist
  try {
    if (uniqueUserIds.length > 0) {
      let promises = uniqueUserIds.map((userId) => {
        return deleteUser(docClient, userId);
      });
      let returnCodes = await Promise.all(promises);
      logToWinstom("Deletes", returnCodes);

      if (nullifyUser) {
        for (const schoolStudent of schoolStudents) {
          if (schoolStudent.userId) {
            // Update schoolStudent to null userId
            logToWinstom(
              "Setting userId to null in schoolStudent",
              schoolStudent.id
            );
            await updateSchoolStudentUserId(
              docClient,
              schoolStudent.id,
              "" // to set userID to null
            );
          } // end if
        } // end for
      } // end if
    }
    return { success: true };
  } catch (error) {
    logErrorsToWinstom("Error cleaning login", error);
    return { err: error };
  }
} // end cleanupLogin

// Update the schoolStudent's UserId or remove it if empty
async function updateSchoolStudentUserId(docClient, id, userId) {
  let params = {
    TableName: `SchoolStudent${envSuffix}`,
    Key: {
      id,
    },
    ReturnValues: "UPDATED_NEW",
  };

  if (!userId || userId === "" || userId === null) {
    params.UpdateExpression = `remove userId`;
  } else {
    params.UpdateExpression = "set userId = :userId";
    params.ExpressionAttributeValues = { ":userId": userId };
  }

  try {
    let result = await docClient.update(params).promise();
    return result;
  } catch (error) {
    logToWinstom("error updating schoolStudent", error);
    return error;
  }
} // end updateSchoolStudentUserId()

// Update the firstName, lastName in an array of schoolStudents (also affected indices etc)
async function updateSchoolStudent(
  docClient,
  userId, // "" = set to undefined, otherwise assume a valid userId
  schoolStudent,
  firstName,
  lastName
) {
  logToWinstom("schoolStudent at 212", schoolStudent);
  logToWinstom("userId at 213", userId === "" ? "empty" : userId);
  // have to accommodate that userID attribute may need to be deleted
  let updateExpression = `set #schoolYearfirstName = :schoolYearfirstName, 
  #schoolYearlastName = :schoolYearlastName,
  #schoolYearyearLevelIDfirstName = :schoolYearyearLevelIDfirstName,
  #schoolYearyearLevelIDlastName = :schoolYearyearLevelIDlastName,
  updatedAt = :updatedAt, 
  firstName = :firstName, 
  lastName = :lastName`;

  let expressionAttributeValues = {
    ":schoolYearfirstName": `${schoolStudent.schoolYear}#${firstName}`,
    ":schoolYearlastName": `${schoolStudent.schoolYear}#${lastName}`,
    ":schoolYearyearLevelIDfirstName": `${schoolStudent.schoolYear}#${schoolStudent.yearLevelID}#${firstName}`,
    ":schoolYearyearLevelIDlastName": `${schoolStudent.schoolYear}#${schoolStudent.yearLevelID}#${lastName}`,
    ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
    ":firstName": firstName,
    ":lastName": lastName,
  };

  if (userId === "") {
    updateExpression = `${updateExpression} \n remove userId`;
  } else {
    updateExpression = `${updateExpression}, \n userId = :userId`;
    expressionAttributeValues = {
      ...expressionAttributeValues,
      ":userId": userId,
    };
  }

  let params = {
    TableName: `SchoolStudent${envSuffix}`,
    Key: {
      id: schoolStudent.id,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: {
      "#schoolYearfirstName": "schoolYear#firstName",
      "#schoolYearlastName": "schoolYear#lastName",
      "#schoolYearyearLevelIDfirstName": "schoolYear#yearLevelID#firstName",
      "#schoolYearyearLevelIDlastName": "schoolYear#yearLevelID#lastName",
    },
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW",
  };
  logToWinstom("params", params);

  try {
    let result = await docClient.update(params).promise();
    //logToWinstom("result", result);
    return result;
  } catch (error) {
    logToWinstom("error updating schoolStudent", error);
    return error;
  }
} // end updateSchoolStudent()

// change a student's name in table Student
async function changeStudentName(docClient, newStudent) {
  //logToWinstom("newStudent", newStudent);
  let birthDate = dayjs(newStudent.birthDate).format("YYYY-MM-DD");
  let params = {
    TableName: `Student${envSuffix}`,
    Key: {
      id: newStudent.id,
    },
    UpdateExpression: `set #lastNameDob = :lastNameDob, 
                      updatedAt = :updatedAt, 
                      firstName = :firstName, 
                      lastName = :lastName`,
    ExpressionAttributeNames: {
      "#lastNameDob": "lastName#birthDate",
    },
    ExpressionAttributeValues: {
      ":lastNameDob": `${newStudent.lastName}#${birthDate}`,
      ":updatedAt": `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
      ":firstName": newStudent.firstName,
      ":lastName": newStudent.lastName,
    },
    ReturnValues: "UPDATED_NEW", // returns {firstName,lastName} after the update
  };

  try {
    let response = await docClient.update(params).promise();
    return response.Attributes;
  } catch (error) {
    logToWinstom("Error updating Student Name", error);
    return { error: error };
  }
} // end changeStudentName(docClient, student)

// Retrieve an array of school students by studentId
async function getSchoolStudentsByStudentId(docClient, studentId) {
  let schoolStudents = [];
  let params = {
    TableName: `SchoolStudent${envSuffix}`,
    IndexName: "byStudent",
    KeyConditionExpression: "studentID = :studentID",
    ExpressionAttributeValues: {
      ":studentID": studentId,
    },
    ProjectionExpression:
      "createdAt, id, studentID, firstName, lastName, schoolID, schoolYear, yearLevelID, userId",
  };
  try {
    let resp = await docClient.query(params).promise();
    schoolStudents = resp.Items;
    return schoolStudents;
  } catch (error) {
    logToWinstom("error", error);
    return [];
  }
} /// end getSchoolStudentsByStudentId()

// Locate a classroomStudent using index byStudent
async function getClassroomStudent(docClient, props) {
  // check if student is already in the classroom, and if so then just return
  let params = {
    TableName: `ClassroomStudent${envSuffix}`,
    IndexName: "byStudent",
    KeyConditionExpression:
      "studentID = :studentID and classroomID = :classroomID ",
    ExpressionAttributeValues: {
      ":studentID": props.studentId,
      ":classroomID": props.classroomId,
    },
    ProjectionExpression: "id", // returns the classroomStudent.id only
  };
  try {
    let response = await docClient.query(params).promise();
    logToWinstom("response", response);
    if (response.Count === 1) {
      return { classroomStudentId: response.Items[0].id };
    }
    return {};
  } catch (error) {
    logToWinstom("Error reading classroomStudent", error);
    return { err: "Error reading classroomStudent" };
  }
} // end getClassroomStudent(docClient,props)

// Check for duplicate student names but different studentIds in schoolStudent
// NOTE: There is no index of schoolStudent by firstName, lastName so use the Student index
async function getMatchingSchoolStudents(
  docClient,
  firstName,
  lastName,
  schoolId
) {
  // Read the ids of all students in table Student with the same firstName, lastname
  let matchingStudents = [];
  let params = {
    TableName: `Student${envSuffix}`,
    IndexName: "byStudentNamesBirthDate",
    KeyConditionExpression:
      "firstName = :firstName and begins_with(#sortKey, :lastName)",
    ExpressionAttributeNames: { "#sortKey": "lastName#birthDate" },
    ExpressionAttributeValues: {
      ":firstName": firstName,
      ":lastName": `${lastName}#`, // any birthDate
    },
    ProjectionExpression: "id", // returns the student.id only
  };
  try {
    let resp = await docClient.query(params).promise();
    matchingStudents = resp.Items;
    logToWinstom(
      `Students matching ${firstName} ${lastName} (all Schools)`,
      resp.Items
    );
  } catch (error) {
    logToWinstom("error", error);
    return [];
  }
  if (matchingStudents.length === 0) {
    return [];
  }

  // Find schoolstudents matching the above studentIds
  params = {
    TableName: `SchoolStudent${envSuffix}`,
    IndexName: "byStudent",
    KeyConditionExpression: "studentID = :studentId",
    ExpressionAttributeValues: {}, // filled in below
    ProjectionExpression:
      "id, studentID, firstName, lastName, schoolID, schoolYear",
  };
  let promises = matchingStudents.map((matchingStudent) => {
    params.ExpressionAttributeValues = { ":studentId": matchingStudent.id };
    return docClient.query(params).promise();
  });
  let nameMatchesArray = await Promise.all(promises); // will return an array of arrays

  // Pick out unique studentIds for the school.
  let schoolMatchesMap = new Map();
  for (const match of nameMatchesArray) {
    for (const schoolStudent of match.Items) {
      if (schoolStudent.schoolID === schoolId) {
        if (!schoolMatchesMap.get(schoolStudent.studentID)) {
          schoolMatchesMap.set(schoolStudent.studentID, schoolStudent);
        }
      }
    }
  }
  return Array.from(schoolMatchesMap.values());
} // end getMatchingSchoolStudents()

// locate all schoolStudents for this studentId
async function getSchoolStudents(docClient, studentId) {
  let params = {
    TableName: `SchoolStudent${envSuffix}`,
    IndexName: "byStudent",
    KeyConditionExpression: "studentID = :studentID",
    ExpressionAttributeValues: { ":studentID": studentId },
  };
  try {
    let resp = await docClient.query(params).promise();
    // Locate the record for the current schoolYear
    let schoolStudent = {};
    for (const item of resp.Items) {
      if (item.schoolYear === getSchoolYear()) {
        schoolStudent = item;
        break;
      }
    }
    if (schoolStudent.studentID) {
      return schoolStudent;
    } else {
      return { studentId }; // return {studentId:studnetId} if not found
    }
  } catch (error) {
    logToWinstom("error", error);
    return { error: error.msg };
  }
} // end async function getSchoolStudents()

// read the schools data to see the status of studentLoginEnabled
async function getSchoolRecord(docClient, schoolId) {
  let params = {
    TableName: `School${envSuffix}`,
    Key: {
      id: schoolId,
    },
    ProjectionExpression: "id,schoolName,studentLoginEnabled,domainName",
  };
  try {
    let data = await docClient.get(params).promise();
    return data.Item;
  } catch (error) {
    logToWinstom("error", error);
    return { error: error.msg };
  }
} // end getSchoolRecord()

async function getStudentById(docClient, studentId) {
  let params = {
    TableName: `Student${envSuffix}`,
    Key: {
      id: studentId,
    },
    ProjectionExpression: "id,firstName,lastName,birthDate,wondeID,MISID",
  };
  try {
    let data = await docClient.get(params).promise();
    if (data.Item) {
      return data.Item; // returns undefined if no student
    }
    return {};
  } catch (error) {
    logErrorsToWinstom("Error getting SudentById", error);
    return { err: "Error getting SudentById" };
  }
} // end getStudentById(studentId)

// create a new record in the User table
async function createNewUserRecord(
  docClient,
  wondeID,
  MISID,
  firstName,
  lastName,
  userId,
  email,
  schoolId
) {
  let now = `${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;
  let Item = {
    wondeID: wondeID === "" ? undefined : wondeID,
    MISID: MISID === "" ? undefined : MISID,
    userId: userId,
    enabled: true,
    dbType: "user",
    userGroup: "Users",
    userType: "Student",
    userSchoolID: schoolId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    createdAt: now,
    updatedAt: now,
  };
  try {
    await docClient
      .put({
        TableName: `User${envSuffix}`,
        Item,
      })
      .promise();
    return { userId };
  } catch (error) {
    logToWinstom("Failed to create new User record", error);
    return { err: "Failed to create new User record" };
  }
} // end  createNewUserRecord()

// Read all the school students in a school (ids only)
async function getSchoolStudentsBySchoolId(docClient, schoolId) {
  logToWinstom("schoolId", schoolId);
  let result, ExclusiveStartKey;
  let schoolStudents = [];
  try {
    do {
      result = await docClient
        .query({
          TableName: `SchoolStudent${envSuffix}`,
          IndexName: "bySchoolID",
          ExclusiveStartKey,
          Limit: 400,
          KeyConditionExpression: "schoolID = :schoolID",
          ExpressionAttributeValues: {
            ":schoolID": schoolId,
          },
          ProjectionExpression:
            "id,userId,studentID,schoolYear,studentDeparted,createdAt",
        })
        .promise();

      ExclusiveStartKey = result.LastEvaluatedKey;
      schoolStudents = [...schoolStudents, ...result.Items];
    } while (result.LastEvaluatedKey);
    return schoolStudents;
  } catch (error) {
    logToWinstom("error", error);
    return [];
  }
} // end getSchoolStudentsBySchoolId()

// get a user from Cognito if exists
async function getUserFromCognito(Username) {
  const params = {
    UserPoolId: process.env.USER_POOL,
    Username,
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminGetUser(params)
      .promise();
    return result;
  } catch (err) {
    if (err.code === "UserNotFoundException") return COGNITO_USER_NOTFOUND;
    else return err;
  }
} // end getUserFromCognito(Username)

// This is Frank's original way to clean out strange characters
function buildUsername(firstName, lastName, schoolName) {
  return `${_.chain(firstName)
    .toLower()
    .split(" ")
    .join("")
    .replace("-", "")
    .replace("'", "")
    .deburr()
    .value()}${_.chain(lastName)
    .toLower()
    .split(" ")
    .join("")
    .replace("-", "")
    .replace("'", "")
    .deburr()
    .value()}@${_.chain(schoolName).toLower().split(" ").join("").value()}`;
}

// Update a user's Cognito email address
// Not using this as yet.
async function updateCognitoEmail(userId, newEmail) {
  const params = {
    UserPoolId: process.env.USER_POOL,
    Username: userId,
    UserAttributes: [
      {
        Name: "email",
        Value: newEmail,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
  };

  try {
    await cognitoIdentityServiceProvider
      .adminUpdateUserAttributes(params)
      .promise();
    return { success: true };
  } catch (err) {
    console.error("error updating cognito email", err);
    return { error: err };
  }
} // end updateCognitoEmail()

// deletes user by email from Cognito
async function deleteCognitoUser(username) {
  const params = {
    UserPoolId: process.env.USER_POOL,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminDeleteUser(params)
      .promise();
    return { success: true };
  } catch (error) {
    if (error.code === "UserNotFoundException") {
      logToWinstom(`Cognito user ${username} does not exist`);
      return { success: true };
    } else {
      console.error("error deleting user", params, error);
      return { success: false };
    }
  }
} // function deleteCognitoUser()

// makeUniqueUserName() makes a user name and then searches for it, to make sure it does not already exist
// If found it tries again with an increments digit attached, and returns when not found in Cognito
async function makeUniqueUserName(firstName, lastName, domainName) {
  let emailIndexCounter = 1;
  const params = {
    UserPoolId: process.env.USER_POOL,
    Username: buildUsername(firstName, lastName, domainName),
  };

  try {
    do {
      let result = await cognitoIdentityServiceProvider
        .adminGetUser(params)
        .promise();
      params.Username = buildUsername(
        firstName,
        lastName + emailIndexCounter++,
        domainName
      );
    } while (true); // ie until an error occurs
  } catch (error) {
    if (error.code === "UserNotFoundException") {
      return params.Username; // 1st email address for the supplied email and school
    } else {
      logToWinstom("error", error);
      return "error";
    }
  }
} // end makeUniqueUserName()

// Create the next available Cognito user
async function createNextAvailableCognitoUser(firstName, lastName, domainName) {
  let email = await makeUniqueUserName(firstName, lastName, domainName);
  logToWinstom("email", email);
  let newCognitoUser = await createStudentCognitoUser(
    `${firstName} ${lastName}`,
    email
  );
  return newCognitoUser;
}

// Creates a Cognito student user
// Have already tested that the email does not exist in Cognito
async function createStudentCognitoUser(studentName, email) {
  // create cognito user
  let params = {
    UserPoolId: process.env.USER_POOL,
    Username: email,
    ForceAliasCreation: false,
    MessageAction: "SUPPRESS",
    TemporaryPassword: `Student${getSchoolYear().toString().slice(2)}`,
    UserAttributes: [
      {
        Name: "email" /* required */,
        Value: email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
      {
        Name: "name" /* required */,
        Value: studentName,
      },
    ],
  };

  try {
    const { User } = await cognitoIdentityServiceProvider
      .adminCreateUser(params)
      .promise();

    // set fixed password for student
    params = {
      UserPoolId: process.env.USER_POOL,
      Username: User.Username, // uuid returned by Cognito above
      Password: `Student${new Date().getFullYear().toString().slice(2)}`, // like "Student23"
      Permanent: true,
    };

    await cognitoIdentityServiceProvider.adminSetUserPassword(params).promise();

    // add user to users group
    params = {
      GroupName: "Users",
      UserPoolId: process.env.USER_POOL,
      Username: User.Username,
    };

    await cognitoIdentityServiceProvider.adminAddUserToGroup(params).promise();
    return { ...User, success: true };
  } catch (error) {
    console.error("error creating user:", studentName);
    logToWinstom("params:", params);
    console.error("Error message:", error);
    return { success: false };
  }
} // end createStudentCognitoUser()

async function getUsersBySchoolId(docClient, schoolId) {
  let result, ExclusiveStartKey;
  let users = [];
  try {
    do {
      result = await docClient
        .query({
          TableName: `User${envSuffix}`,
          IndexName: "bySchool",
          ExclusiveStartKey,
          Limit: 400,
          KeyConditionExpression: "userSchoolID = :schoolID",
          ExpressionAttributeValues: {
            ":schoolID": schoolId,
          },
          ProjectionExpression: "email,userId,userType",
        })
        .promise();

      ExclusiveStartKey = result.LastEvaluatedKey;
      users = [...users, ...result.Items];
    } while (result.LastEvaluatedKey);
    return users;
  } catch (error) {
    logToWinstom("error", error);
    return [];
  }
} // end getUsersBySchoolId()

//
async function createUser(docClient, student, school) {
  // Create the next available user in Cognito
  // factor in teh domain name if it exists
  let domainName =
    school.domainName && school.domainName.length > 2
      ? school.domainName
      : school.schoolName; // default

  let newCognitoUser = await createNextAvailableCognitoUser(
    student.firstName,
    student.lastName,
    domainName
  );
  logToWinstom("domainName", domainName);
  logToWinstom("newCognitoUser", newCognitoUser);
  if (!newCognitoUser.success) {
    logErrorsToWinstom(
      "Failed to create new Cognito User",
      student.firstName,
      student.lastName
    );
    return {
      err: FAILED_TO_CREATE_COGNITO_USER,
    };
  }

  // check if the new email contains a digit before the @ character
  // This could indicate either a duplicate name exists in the school
  // or previous Cognito user was not deleted properly
  if (/\d@/.test(newCognitoUser.Attributes[3].Value)) {
    logToWinstom("Email alert", newCognitoUser.Attributes[3].Value);
  }

  // Make a new User record - returns {success:true, userId}
  let newUser = await createNewUserRecord(
    docClient,
    student.wondeID ? student.wondeID : "",
    student.MISID ? student.MISID : "",
    student.firstName,
    student.lastName,
    newCognitoUser.Username, // like '18dd59b2-1d04-4b28-b46d-19312e5a5884'
    newCognitoUser.Attributes[3].Value, // email
    school.id
  );
  if (!newUser.err) {
    //logToWinstom("new Cognito and User created", newUser.userId);
    return {
      studentId: student.id,
      userId: newUser.userId,
    };
  } else {
    logToWinstom(
      "Aborting. Failed to create new User record",
      newCognitoUser.Username
    );
    // TODO: Delete the Cognito user created above (low probability)
    return {
      err: FAILED_TO_CREATE_USER_RECORD,
    };
  }
} // end createUser(docClient, student,school)

// To insert between Cognito calls to enforce rate limits
// ie overcome the TooManyRequestsException error
async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} // end sleep

// Verify that the student does not have an active login in another school
// Also report is the student does not exist in the supplied school
// ...This can happen if an incorrect schoolId is passed
async function checkOtherSchoolLogin(docClient, schoolStudents, schoolId) {
  let uniqueUserIdsMap = new Map(); // excludes where school matches
  let studentExistsInSchool = false;
  for (const schoolStudent of schoolStudents) {
    if (schoolStudent.schoolID === schoolId) {
      studentExistsInSchool = true;
    } else if (
      schoolStudent.userId &&
      !uniqueUserIdsMap.has(schoolStudent.userId)
    ) {
      uniqueUserIdsMap.set(schoolStudent.userId, {
        userId: schoolStudent.userId,
        schoolId: schoolStudent.schoolID,
      });
    }
  }
  let uniqueUserIds = Array.from(uniqueUserIdsMap.values());
  if (!studentExistsInSchool) {
    return { studentExistsInSchool, otherSchoolsWithLogins: [] };
  }
  if (uniqueUserIds.length === 0) {
    return { studentExistsInSchool, otherSchoolsWithLogins: [] };
  } else {
    // then there are userIds for other schools so test if the userIds are valid
    let promises = uniqueUserIds.map((user) => {
      return verifyUserId(docClient, user.userId, user.schoolId);
    });
    let schoolIds = await Promise.all(promises);
    let retArr = [];
    for (const schoolId of schoolIds) {
      if (schoolId) retArr.push(schoolId);
    }
    return { studentExistsInSchool, otherSchoolsWithLogins: retArr };
  } // end else
} // end checkOtherSchoolLogin(docClient, schoolStudents, schoolId)

async function verifyUserId(docClient, userId, schoolId) {
  // check if the userId exists
  let user = await getUserRecord(docClient, userId);
  if (user.Items.length === 0) {
    return false; // no users
  }
  // check if the Cognito user exists
  let userFound = await getUserFromCognito(userId);
  if (userFound === COGNITO_USER_NOTFOUND) {
    return false;
  } else {
    return schoolId;
  }
} // end verifyUserId()

async function setLatestSchoolStudentUserId(
  docClient,
  schoolStudents,
  schoolId,
  userId
) {
  // Update only the latest schoolStudent in this school to the new userId
  // schoolStudent has
  //     {"id, studentID, firstName, lastName, schoolID, schoolYear, yearLevelID, userId",
  let latestSchoolStudent = { id: "", schoolYear: 1999 };
  for (const schoolStudent of schoolStudents) {
    if (
      schoolStudent.schoolID === schoolId &&
      schoolStudent.schoolYear > latestSchoolStudent.schoolYear
    ) {
      latestSchoolStudent = {
        id: schoolStudent.id,
        schoolYear: schoolStudent.schoolYear,
      };
    }
  }
  logToWinstom("latest schoolStudent is", latestSchoolStudent);
  logToWinstom("Updating userId in schoolstudent to", userId);
  try {
    await updateSchoolStudentUserId(docClient, latestSchoolStudent.id, userId);
    return {};
  } catch (err) {
    logToWinstom("Err", err);
    return { err, schoolStudentId: latestSchoolStudent.id };
  }
} // end setLatestSchoolSTudentUserId()

// check if studentId exists and if so return the details
async function existsStudentId(docClient, studentId) {
  let foundStudent = await getStudentById(docClient, studentId);
  // returns {id,firstName,lastName,birthDate,wondeID}
  if (foundStudent.err) {
    logToWinstom(`StudentId ${studentId} not found in table Students`);
    return { err: `${STUDENT_NOT_FOUND} ${studentId}` };
  } else {
    return { foundStudent };
  }
} // end existsStudentId(docClient,studentId)

// update the Cognito record's "enabled" bit
async function updateCognitoLoginEnable(userId, enableLogin) {
  try {
    // add user to users group
    let params = {
      UserPoolId: process.env.USER_POOL,
      Username: userId,
    };

    let response;
    if (enableLogin) {
      logToWinstom("Enabling User", userId);
      response = await cognitoIdentityServiceProvider
        .adminEnableUser(params)
        .promise();
    } else {
      logToWinstom("Disabling User", userId);
      response = await cognitoIdentityServiceProvider
        .adminDisableUser(params)
        .promise();
    }
    logToWinstom("Cognito Enable/DisableUser response", response);
    return response;
  } catch (error) {
    logErrorsToWinstom("error Enabling/Disabling user:", userId);
    return { err: error };
  }
} // end updateCognitoLoginEnable()

// This method takes any string/objects arguments and log them into the winstom logger.
const logToWinstom = (...args) => {
  const finalResult = [];
  if (args && args.length > 0) {
    for (let index = 0; index < args.length; index++) {
      const input = args[index];
      // If it's an object, it stringify it to make clear the values it has.
      if (
        typeof input === "object" &&
        !Array.isArray(input) &&
        input !== null
      ) {
        finalResult.push(`${JSON.stringify(input)} `);
      } else {
        // If it's not an object, it just push the normal string.
        finalResult.push(`${input} `);
      }
    }
    // Using special .debug from winstom only for dev.
    logger.debug(finalResult.toString());
  }
};

// This method takes any string/objects arguments and log them into the winstom logger.
const logErrorsToWinstom = (...args) => {
  const finalResult = [];
  if (args && args.length > 0) {
    for (let index = 0; index < args.length; index++) {
      const input = args[index];
      // If it's an object, it stringify it to make clear the values it has.
      if (
        typeof input === "object" &&
        !Array.isArray(input) &&
        input !== null
      ) {
        finalResult.push(`${JSON.stringify(input)} `);
      } else {
        // If it's not an object, it just push the normal string.
        finalResult.push(`${input} `);
      }
    }
    // Using special .error from winstom for prod and dev.
    logger.error(finalResult.toString());
  }
};

module.exports = {
  makeBatches, //
  getSchoolYear, //
  getSchoolRecord, //
  changeStudentName, //
  getSchoolStudentsByStudentId,
  createUser, //
  updateSchoolStudent, //
  updateSchoolStudentUserId, //
  cleanupLogin, //
  deleteUserByEmail, //
  getStudentById, //
  getSchoolStudentsBySchoolId, //
  getUserFromCognito, //
  getUsersBySchoolId, //
  deleteUser, //
  sleep, //
  logToWinstom, //
  logErrorsToWinstom, //
  getClassroomStudent, //
  updateCognitoLoginEnable, //
};