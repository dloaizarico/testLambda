/* Amplify Params - DO NOT EDIT
	API_BPEDSYSGQL_GRAPHQLAPIENDPOINTOUTPUT
	API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT
	AUTH_BPEDSYSAUTH_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const event = require("./event.json");
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { CognitoIdentityServiceProvider } = require("aws-sdk");
const _ = require("lodash");
const { request } = require("./appSyncRequest");

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const userPoolId = process.env.AUTH_BPEDSYSAUTH_USERPOOLID;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const {
  createUser,
  updateSchoolStudent,
  updateUser,
  deleteUser,
} = require("./graphql/bpmutations");
const { getUser, getSchoolStudentsByYear } = require("./graphql/bpqueries");

const UK_REGION = "eu-west-2";

function getSchoolYear() {
  if (process.env.REGION === UK_REGION && new Date().getMonth() >= 7) {
    return new Date().getFullYear() + 1;
  } else {
    return new Date().getFullYear();
  }
}

async function createStudentUser(schoolStudent, username) {
  // create cognito user
  let params = {
    UserPoolId: userPoolId,
    Username: username,
    ForceAliasCreation: false,
    MessageAction: "SUPPRESS",
    TemporaryPassword: `Student${new Date().getFullYear().toString().slice(2)}`,
    UserAttributes: [
      {
        Name: "email" /* required */,
        Value: username,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
      {
        Name: "name" /* required */,
        Value: `${schoolStudent.student.firstName} ${schoolStudent.student.lastName}`,
      },
    ],
  };

  try {
    const { User } = await cognitoIdentityServiceProvider
      .adminCreateUser(params)
      .promise();

    await sleep(500);

    // set fixed password for student
    params = {
      UserPoolId: userPoolId,
      Username: User.Username,
      Password: `Student${new Date().getFullYear().toString().slice(2)}`,
      Permanent: true,
    };

    await cognitoIdentityServiceProvider.adminSetUserPassword(params).promise();
    await sleep(500);

    // add user to users group
    params = {
      GroupName: "Users",
      UserPoolId: userPoolId,
      Username: User.Username,
    };

    await cognitoIdentityServiceProvider.adminAddUserToGroup(params).promise();
    await sleep(500);

    return User;
  } catch (error) {
    console.error("error creating user", schoolStudent.student, params, error);
    return error;
  }
}

async function createECUserData(schoolStudent, User, username, school) {
  // check if user record exists
  let input = {
    email: username,
  };

  const {
    data: { getUser: userData },
  } = await request({
    query: getUser,
    variables: input,
  });

  if (!userData) {
    // create user record
    input = {
      userId: User.Username,
      enabled: true,
      dbType: "user",
      userGroup: "Users",
      userType: "Student",
      userSchoolID: school.id,
      firstName: schoolStudent.student.firstName,
      lastName: schoolStudent.student.lastName,
      email: username,
    };

    await request({
      query: createUser,
      variables: { input },
    });
  } else {
    // update user record with cognito username
    input = {
      email: username,
      userId: User.Username,
    };

    await request({
      query: updateUser,
      variables: { input },
    });
  }

  // update school student with userid
  input = {
    id: schoolStudent.id,
    studentID: schoolStudent.student.id,
    schoolYear: schoolStudent.schoolYear,
    yearLevelID: schoolStudent.yearLevelID,
    firstName: schoolStudent.student.firstName,
    lastName: schoolStudent.student.lastName,
    userId: User.Username,
  };

  await request({
    query: updateSchoolStudent,
    variables: { input },
  });
}

async function processStudentList(school, schoolStudents) {
  // process each student & create user records
  let promises = [];

  for (const schoolStudent of schoolStudents) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let username = `${_.chain(schoolStudent.student.firstName)
          .toLower()
          .split(" ")
          .join("")
          .replace("-", "")
          .replace("'", "")
          .deburr()
          .value()}${_.chain(schoolStudent.student.lastName)
          .toLower()
          .split(" ")
          .join("")
          .replace("-", "")
          .replace("'", "")
          .deburr()
          .value()}@${_.chain(school.schoolName)
          .toLower()
          .split(" ")
          .join("")
          .value()}`;

        // check if cognito users eixsts
        const params = {
          UserPoolId: userPoolId,
          Username: username,
        };

        try {
          const result = await cognitoIdentityServiceProvider
            .adminGetUser(params)
            .promise();

          await sleep(500);

          // update student record
          await createECUserData(schoolStudent, result, username, school);
        } catch (err) {
          if (err.code === "UserNotFoundException") {
            // create cognito user
            const userData = await createStudentUser(schoolStudent, username);

            await createECUserData(schoolStudent, userData, username, school);
          } else {
            console.error(err);
            throw err;
          }
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });

    promises.push(promise);
  }

  await Promise.all(promises);
}

async function removeStudentLogins(school, schoolStudents) {
  // process each student & create user records
  let promises = [];

  for (const schoolStudent of schoolStudents) {
    if (schoolStudent.userId) {
      const promise = new Promise(async (resolve, reject) => {
        try {
          let username = `${_.chain(schoolStudent.student.firstName)
            .toLower()
            .split(" ")
            .join("")
            .replace("-", "")
            .replace("'", "")
            .deburr()
            .value()}${_.chain(schoolStudent.student.lastName)
            .toLower()
            .split(" ")
            .join("")
            .replace("-", "")
            .replace("'", "")
            .deburr()
            .value()}@${_.chain(school.schoolName)
            .toLower()
            .split(" ")
            .join("")
            .value()}`;

          // check if cognito users eixsts
          const params = {
            UserPoolId: userPoolId,
            Username: username,
          };

          try {
            console.log("deleting");
            await cognitoIdentityServiceProvider
              .adminDeleteUser(params)
              .promise();
            console.log("start await");
            await sleep(5000);
            console.log("finish await");
          } catch (error) {
            if (error.code !== "UserNotFoundException") {
              console.error("error deleting user record", params, error);
              reject(error);
            }
          }

          // update school student userid
          let input = {
            id: schoolStudent.id,
            studentID: schoolStudent.studentID,
            schoolYear: schoolStudent.schoolYear,
            yearLevelID: schoolStudent.yearLevelID,
            firstName: schoolStudent.firstName,
            lastName: schoolStudent.lastName,
            userId: null,
          };

          await request({
            query: updateSchoolStudent,
            variables: { input },
          });

          // delete EC user record
          input = {
            email: username,
          };

          await request({
            query: deleteUser,
            variables: { input },
          });

          resolve();
        } catch (error) {
          reject(error);
        }
      });

      promises.push(promise);
    }
  }

  await Promise.all(promises);
}

function enableSchoolLogins(school) {
  return new Promise(async (resolve, reject) => {
    let process = true;
    let token = null;

    do {
      // get students
      const input = {
        schoolID: school.id,
        schoolYear: { eq: getSchoolYear() },
        nextToken: token,
      };

      try {
        const resp = await request({
          query: getSchoolStudentsByYear,
          variables: input,
        });

        const schoolStudents = resp.data.getSchoolStudentsByYear.items;
        token = resp.data.getSchoolStudentsByYear.nextToken;

        if (schoolStudents.length > 0) {
          await processStudentList(school, schoolStudents);
          process = token ? true : false;
        } else {
          process = false;
        }
      } catch (error) {
        console.error("error getting school users for enabling", error);
        process = false;
        reject();
      }
    } while (process === true);

    resolve();
  });
}

function disableSchoolLogins(school) {
  return new Promise(async (resolve, reject) => {
    let process = true;
    let token = null;

    do {
      // get students
      const input = {
        schoolID: school.id,
        schoolYear: { eq: getSchoolYear() },
        nextToken: token,
      };

      try {
        const resp = await request({
          query: getSchoolStudentsByYear,
          variables: input,
        });

        const schoolStudents = resp.data.getSchoolStudentsByYear.items;
        token = resp.data.getSchoolStudentsByYear.nextToken;

        if (schoolStudents.length > 0) {
          await removeStudentLogins(school, schoolStudents);
          process = token ? true : false;
        } else {
          process = false;
        }
      } catch (error) {
        console.error("error getting students for disable", error);
        process = false;
        reject();
      }
    } while (process === true);

    resolve();
  });
}

const handler = (event) => {
  try {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const records = event.Records.map((record) =>
      AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)
    );

    let schoolPromises = [];

    records.forEach((school) => {
      // if studentLoginEnabled true, get all students for school & current year & create cognito users and EC user records
      if (school.studentLoginEnabled === true) {
        schoolPromises.push(enableSchoolLogins(school));
      } else {
        // if studentLoginEnabled changed to false, delete all cognito users for students & set EC user records to disabled
        schoolPromises.push(disableSchoolLogins(school));
      }
    });

    Promise.all(schoolPromises)
      .then(() => {
        return Promise.resolve(
          "Successfully processed DynamoDB school record(s)"
        );
      })
      .catch((error) => {
        console.error("error processing", error);
        return Promise.resolve("Error processing school updates");
      });
  } catch (error) {
    console.log(error);
  }
};

handler(event);
