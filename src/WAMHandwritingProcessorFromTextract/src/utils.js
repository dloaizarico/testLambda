const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { SSMClient, GetParametersCommand } = require("@aws-sdk/client-ssm");
const { fromNodeProviderChain } = require("@aws-sdk/credential-providers");
const { CognitoIdentityServiceProvider } = require("aws-sdk");
const PDFDocument = require("pdf-lib").PDFDocument;
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

// This method finds the current user for the current year for each student.
const getCurrentStudentUser = (schoolStudents, logRepo) => {
  if (
    schoolStudents &&
    schoolStudents.length > 0 &&
    schoolStudents[0].user &&
    schoolStudents[0].user.items &&
    schoolStudents[0].user.items.length > 0
  ) {
    return schoolStudents[0].user.items[0].email;
  }
  updateMemoryLog(`No user record found for this student`, logRepo, true);
  return null;
};

// This is used to track the axios responses in a more easier way.
const errorHandler = (error) => {
  const { request, response } = error;
  if (response) {
    const { detail } = response.data;
    const status = response.status;
    return {
      message: detail,
      status,
    };
  } else if (request) {
    return {
      message: "server time out",
      status: 503,
    };
  } else {
    return { message: "Something went wrong while setting up request" };
  }
};

// Get the correct format of stuents birthdate in dynamo.
function getDate(dob) {
  if (!dob) return null;
  let month = "" + (dob.getMonth() + 1);
  if (month.length === 1) {
    month = "0" + month;
  }
  let day = "" + dob.getDate();
  if (day.length === 1) {
    day = "0" + day;
  }
  return dob.getFullYear() + "-" + month + "-" + day;
}

// It takes a string and format it into Proper.
function formatToProper(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const ParseDOB = (dob) => {
  if (!dob) {
    return null;
  }
  let finalDate;
  if (typeof dob === "string") {
    finalDate = new Date(dob);
    let dateParts = dob.split("/");
    // month is 0-based, that's why we need dataParts[1] - 1
    finalDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  } else {
    finalDate = dob;
  }

  try {
    return getDate(finalDate);
  } catch (error) {
    console.log(
      `it was not possible to cast a date, the received value was ${dob}${error}`
    );
  }
};

// It maps the textract result to a JSON object.
// lines are per essay and this is the return object from textract.
const createEssayObjects = (pagesContentMap) => {
  const textractEssays = [];
  let essay;
  for (let [page, lines] of pagesContentMap) {
    console.log(validateIfItIsANewEssay(lines));
    if (validateIfItIsANewEssay(lines)) {
      // Defines if the essay has been read and if it's need to be added to the essay arrays.
      if (page !== 1) {
        textractEssays.push(essay);
        essay = {};
      }

      let firstName,
        lastName,
        DOB = "";

      // This is used to control from what index it begins the student essay text after textract process.
      let startIndex;
      // If the DOB is giving in the second line.
      if (lines[1] && lines[1].toUpperCase().includes("DOB")) {
        const name = lines[0].split(" ");
        // Omitting middle names.
        if (name.length === 3) {
          firstName = name[1];
          lastName = name[2];
        } else if (name.length === 4) {
          // Omitting :,=, " " after NAME
          if (name[1] === ":" || name[1] === "=" || name[1] === " ") {
            firstName = name[2];
          } else {
            firstName = name[1];
          }

          lastName = name[3];
        }
        const dobArray = lines[1].split(" ");
        if (dobArray.length === 3) {
          // Omitting :,=, " " after DOB
          if (
            dobArray[1] === ":" ||
            dobArray[1] === "=" ||
            dobArray[1] === " "
          ) {
            DOB = dobArray[2];
          } else {
            if (dobArray[0].toUpperCase().includes("DOB")) {
              DOB = dobArray[1];
            }
          }
        } else {
          DOB = dobArray[1].toUpperCase();
        }

        startIndex = 2;
      } // if the DOB is in the third line because sometimes textract returns the last name in the second line/
      else if (lines[2] && lines[2].toUpperCase().includes("DOB")) {
        const name = lines[0].split(" ");

        if (name && name.length === 2) {
          firstName = name[1];
        } else {
          if (name[0].toUpperCase().includes("NAME")) {
            firstName = name.slice(1).join("");
          }
        }
        let lastNameArray = lines[1].split(" ");
        if (lastNameArray && lastNameArray.length === 1) {
          lastName = lastNameArray[0];
        }
        if (lastNameArray && lastNameArray.length === 2) {
          lastName = lastNameArray[1];
        }
        const dobArray = lines[2].split(" ");

        if (dobArray.length === 3) {
          // Omitting :,=, " " after DOB
          if (
            dobArray[1] === ":" ||
            dobArray[1] === "=" ||
            dobArray[1] === " "
          ) {
            DOB = dobArray[2];
          }
        } else {
          DOB = dobArray[1];
        }
        startIndex = 3;
      }
      if (firstName) {
        firstName = firstName.split(".").join("");
        // replace any \n from textract.
        firstName = firstName.replace(/\n/g, "").trim();
        firstName = formatToProper(firstName);
      }
      if (lastName) {
        lastName = lastName.split(".").join("");
        // replace any \n from textract.
        lastName = lastName.replace(/\n/g, "").trim();
        lastName = formatToProper(lastName);
      }
      if (DOB) {
        DOB = DOB.split(".").join("");
        // replace any \n from textract.
        DOB = DOB.replace(/\n/g, "").trim();
        DOB = ParseDOB(DOB);
      }
      // Getting the essay text.
      let textArray = lines.slice(startIndex);
      let cleanedEssayText = "";
      if (textArray && textArray.length > 0) {
        // Remove any \n from lines.
        textArray = textArray.map((line) => line.replace(/\n/g, "").trim());
        cleanedEssayText = textArray.join("\n");
      }

      essay = {
        firstName,
        lastName,
        DOB,
        text: cleanedEssayText,
        pages: [page],
      };
      // it's an extension of an student's essay.
    } else {
      if (essayInLines && essayInLines.length > 0) {
        // Remove any \n from lines.
        let textArray = essayInLines.map((line) =>
          line.replace(/\n/g, "").trim()
        );
        let essayExtension = textArray.join("\n");
        // Append the extension to the current text of the essay.
        essay.text = `${essay.text}\n${essayExtension}`;
        essay.pages?.push(page);
      }
    }
  }
  textractEssays.push(essay);
  return textractEssays;
};

/**
 * This method checks if the page being processed is a new essay or is just an extension of an essay. For example, if a student wrote two pages or more.
 * @param {*} lines
 * @returns
 */
const validateIfItIsANewEssay = (lines) => {
  if (lines && lines.length > 0) {
    return (
      lines[0].toLowerCase().includes("name") ||
      lines[0].toLowerCase().includes("dob") ||
      lines[1].toLowerCase().includes("name") ||
      lines[1].toLowerCase().includes("dob") ||
      lines[2].toLowerCase().includes("name") ||
      lines[2].toLowerCase().includes("dob")
    );
  }
  return false;
};

/** This method is used for logging events during the process
 * message: log
 * repository: array that is shared across all methods.
 * shouldUpdateConsole: if it's true, it will print the log in the console.
 */

const updateMemoryLog = (message, repository, shouldUpdateConsole) => {
  if (repository) {
    repository.push(message);
  }
  if (shouldUpdateConsole) {
    console.log(message);
  }
};

// This method creates the final log in the s3 activity folder.
const createLogFileInS3Bucket = async (s3Client, activityID, logRepo) => {
  try {
    if (logRepo && logRepo.length > 0) {
      const key = `public/handwriting/${activityID}/${ParseDOB(
        new Date()
      )}-${new Date().toTimeString()}-UploadsLog.txt`;
      const keyWithoutPublicPrefix = `handwriting/${activityID}/${ParseDOB(
        new Date()
      )}-${new Date().toTimeString()}-UploadsLog.txt`;

      await createFileInBucket(s3Client, key, logRepo.join(""));
      return keyWithoutPublicPrefix;
    } else {
      console.log("The log repo is empty.");
      return "";
    }
  } catch (error) {
    console.log(`Unable to upload the log file of the process. ${error}`);
  }
};

const createFileInBucket = async (s3Client, key, fileContent) => {
  try {
    const input = {
      Bucket: process.env.BUCKET,
      Key: key,
      ContentType: "	text/plain",
      Body: fileContent,
    };
    const command = new PutObjectCommand(input);
    await s3Client.send(command);
  } catch (error) {
    console.log(`Unable to upload the file into s3. ${error}`);
  }
};

async function getSSMSecrets(secretNames) {
  const credentials = fromNodeProviderChain(); // use the default credential provider chain
  const client = new SSMClient({ credentials });

  const params = {
    Names: secretNames.map((secretName) => process.env[secretName]),
    WithDecryption: true,
  };
  const command = new GetParametersCommand(params);

  const { Parameters } = await client.send(command);
  /*
  Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
  */
  const secrets = secretNames
    .map((secretName) => {
      const secretVal = Parameters.find((secretValObj) => {
        return secretValObj.Name === process.env[secretName];
      });
      return { secretName: secretName, secretVal: secretVal };
    })
    .reduce((prev, curr, i) => {
      return { ...prev, [curr.secretName]: curr.secretVal.Value };
    }, {});
  return secrets;
}

const getTokenForAuthentication = async (email) => {
  const secrets = await getSSMSecrets(["AUTHENTICATION_KEY"]);
  const authenticationKey = secrets?.AUTHENTICATION_KEY;

  const identityProvider = new CognitoIdentityServiceProvider();

  const params = {
    AuthFlow: "CUSTOM_AUTH",
    UserPoolId: process.env.AUTH_BPEDSYSAUTH_USERPOOLID,
    ClientId: process.env.AUTH_BPEDSYSAUTH_APPCLIENTIDWEB,
    AuthParameters: {
      USERNAME: email,
      CHALLENGE_NAME: "CUSTOM_CHALLENGE",
    },
  };

  const result = await identityProvider.adminInitiateAuth(params).promise();
  if (result) {
    const params2 = {
      ChallengeName: result.ChallengeName,
      ClientId: process.env.AUTH_BPEDSYSAUTH_APPCLIENTIDWEB,
      ChallengeResponses: { USERNAME: email, ANSWER: authenticationKey },
      Session: result.Session,
    };

    const tokens = await identityProvider
      .respondToAuthChallenge(params2)
      .promise();

    if (
      tokens &&
      tokens.AuthenticationResult &&
      tokens.AuthenticationResult.IdToken
    ) {
      return tokens.AuthenticationResult.IdToken;
    } else {
      updateMemoryLog(
        `Unable to get the token for this student ${email} \n`,
        logRepo,
        true
      );
      return null;
    }
  }
};

/**
 * This method takes the original file and if it's a pdf with multiple essays of students, it generates single pdf files for each student.
 * @param {*} s3Client
 * @param {*} fileUrl
 * @param {*} activityID
 * @param {*} studentsPageMapping
 * @returns
 */
const splitFilePerStudent = async (
  s3Client,
  fileUrl,
  activityID,
  studentsPageMapping
) => {
  try {
    const studentsFileMap = [];
    // First it checks if there's only a pdf with an student's essay or a single image file (PNG, JPEG)
    if (studentsPageMapping.length === 1) {
      console.log(
        "The job is related to a single file, returning original file URL"
      );
      return [[studentEssay[0][0], fileUrl]];
    } else {
      // If it's a pdf with multiple essays...
      const command = new GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: fileUrl,
      });
      // It downloads the original file uploaded by the teacher.
      const response = await s3Client.send(command)
      
      let pdfString =await response.Body?.transformToString("base64");
      
      console.log(fileUrl);
      console.log("Original S3 file downloaded.");
      // It upload the content into a PDFDocument so it's easy to manipulate it.
      let pdfContent = await PDFDocument.load(pdfString);
      // each studentPageMapping is an array of [[StudentID, [pages]]]
      studentsPageMapping.forEach(async (studentEssay) => {
        const pages = studentEssay[1];
        console.log(
          `Student ${studentEssay[0]}, number of pages: ${pages.length}`
        );
        pages.sort((a, b) => a - b);
        // It creates the inidividual essay document.
        const individualEssay = await PDFDocument.create();
        // Each of the pages is copied to the new individual essay pdf.
        for (let index = 0; index < pages.length; index++) {
          const page = pages[index];
          const [copiedPage] = await individualEssay.copyPages(pdfContent, [
            page,
          ]);
          individualEssay.addPage(copiedPage);
        }
        // Save the PDF object to get the bytes.
        const individualEssayBytes = await individualEssay.save();
        console.log(`individualEssayBytes saved`);
        // Upload the file to s3.
        const s3FileKey = `public/handwriting/${activityID}/${studentEssay[0]}/${studentEssay[0]}.pdf`;
        console.log(`key ${s3FileKey}`);
        await createFileInBucket(s3Client, s3FileKey, individualEssayBytes);
        console.log(`file saved in s3`);
        // Return the file key so it's saved in the log record.
        studentsFileMap.push([studentEssay[0], s3FileKey]);
      });
    }
    console.log(`studentsFileMap ${studentsFileMap}`);
    return studentsFileMap;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  splitFilePerStudent,
  createEssayObjects,
  updateMemoryLog,
  ParseDOB,
  errorHandler,
  createLogFileInS3Bucket,
  getTokenForAuthentication,
  getCurrentStudentUser,
};
