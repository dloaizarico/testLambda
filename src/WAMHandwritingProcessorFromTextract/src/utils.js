const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { SSMClient, GetParametersCommand } = require("@aws-sdk/client-ssm");
const { fromNodeProviderChain } = require("@aws-sdk/credential-providers");
const { CognitoIdentityServiceProvider } = require("aws-sdk");
const PDFDocument = require("pdf-lib").PDFDocument;
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { logger } = require("./logger");
const dayjs = require("dayjs");

// This method finds the current user for the current year for each student.
const getCurrentStudentUser = (schoolStudents) => {
  if (
    schoolStudents &&
    schoolStudents.length > 0 &&
    schoolStudents[0].user &&
    schoolStudents[0].user.items &&
    schoolStudents[0].user.items.length > 0
  ) {
    return schoolStudents[0].user.items[0].email;
  }
  logger.debug("No user record found for this student\n");
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

// It takes a string and format it into Proper.
function formatToProper(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Method to parse any string date read from the document to a proper date.
const ParseDOB = (readDOB) => {
  if (!readDOB) {
    return null;
  }

  try {
    let splitDate = readDOB.split(/[./-]/);

    const [day, month, year] = splitDate;

    // extract month
    if (month.length === 1) {
      month = `0${month}`;
    }

    // extract day
    if (day.length === 1) {
      day = `0${day}`;
    }
    console.log(`${year}-${month}-${day}`);
    // return the format expected by Elastik.
    return `${year}-${month}-${day}`;
  } catch (error) {
    logger.debug(
      `it was not possible to cast a date, the received value was ${error}`
    );
    return "";
  }
};

const getFirstNameAndLastName = (fullName) => {
  if (fullName && fullName !== "") {
    const splitName = fullName.split(" ");
    if (splitName && splitName.length === 2) {
      firstName = splitName[0];
      lastName = splitName[1];
    } else if (splitName && splitName.length >= 3) {
      firstName = splitName[0];
      lastName = splitName[2];
    }
    return { firstName, lastName };
  }
  return { firstName: "", lastName: "" };
};

const getCharactersToAddBasedOnCurrentDateOrNameString = (string, type) => {
  if (type === "NAME") {
    return string.toUpperCase().includes("NAME :")
      ? 6
      : string.toUpperCase().includes("NAME:")
      ? 5
      : 4;
  } else if (type === "DOB") {
    return string.toUpperCase().includes("DOB :")
      ? 5
      : string.toUpperCase().includes("DOB:")
      ? 4
      : 3;
  }
};

// It maps the textract result to a JSON object.
// lines are per essay and this is the return object from textract.
const createEssayObjects = (pagesContentMap) => {
  const textractEssays = [];
  let essay;
  let isIncorrectTemplate = false;
  console.log("pagesContentMap", pagesContentMap);
  for (let [page, lines] of pagesContentMap) {
    if (validateIfItIsANewEssay(lines)) {
      // Defines if the essay has been read and if it's need to be added to the essay arrays.
      if (page !== 1 && !isIncorrectTemplate) {
        textractEssays.push(essay);
        essay = {};
      } else {
        isIncorrectTemplate = false;
      }

      // Student's data extracted
      let firstName,
        lastName,
        DOB = "";

      // This is used to control from what index it begins the student essay text after textract process.
      let essayStartIndex;
      // index from where the NAME starts in the string, it's used to extract the name of the student.
      let nameIndex;
      // index from where the DOB starts in the string, it's used to extract the DOB of the student.
      let dobIndex;
      let fullName;

      if (
        lines[0] &&
        lines[0].toUpperCase().includes("DOB") &&
        lines[0].toUpperCase().includes("NAME")
      ) {
        extractedDOBLine = lines[0];
        nameIndex = lines[0].toUpperCase().indexOf("NAME");
        dobIndex = lines[0].toUpperCase().indexOf("DOB");
        const numberOfCharatersToAddToTheInitialNameIndex =
          getCharactersToAddBasedOnCurrentDateOrNameString(lines[0], "NAME");
        fullName = lines[0]
          .substring(
            nameIndex + numberOfCharatersToAddToTheInitialNameIndex,
            dobIndex
          )
          .trim();
        const numberOfCharatersToAddToTheInitialDOBIndex =
          getCharactersToAddBasedOnCurrentDateOrNameString(lines[0], "DOB");
        DOB = lines[0]
          .substring(dobIndex + numberOfCharatersToAddToTheInitialDOBIndex)
          .trim();
        essayStartIndex = 1;
      }
      // If the DOB is giving in the second line.
      else if (
        lines[0] &&
        lines[0].toUpperCase().includes("NAME") &&
        lines[1] &&
        lines[1].toUpperCase().includes("DOB")
      ) {
        extractedDOBLine = lines[1];
        nameIndex = lines[0].toUpperCase().indexOf("NAME");
        dobIndex = lines[1].toUpperCase().indexOf("DOB");
        const numberOfCharatersToAddToTheInitialNameIndex =
          getCharactersToAddBasedOnCurrentDateOrNameString(lines[0], "NAME");
        fullName = lines[0]
          .substring(nameIndex + numberOfCharatersToAddToTheInitialNameIndex)
          .trim();
        const numberOfCharatersToAddToTheInitialDOBIndex =
          getCharactersToAddBasedOnCurrentDateOrNameString(lines[1], "DOB");
        DOB = lines[1]
          .substring(dobIndex + numberOfCharatersToAddToTheInitialDOBIndex)
          .trim();
        essayStartIndex = 2;
      } // if the DOB is in the third line because sometimes textract returns the last name in the second line/
      else if (
        lines[0] &&
        lines[0].toUpperCase().includes("NAME") &&
        lines[2] &&
        lines[2].toUpperCase().includes("DOB")
      ) {
        extractedDOBLine = lines[2];
        nameIndex = lines[0].toUpperCase().indexOf("NAME");
        dobIndex = lines[2].toUpperCase().indexOf("DOB");
        const numberOfCharatersToAddToTheInitialNameIndex =
          getCharactersToAddBasedOnCurrentDateOrNameString(lines[0], "NAME");
        fullName = lines[0]
          .substring(nameIndex + numberOfCharatersToAddToTheInitialNameIndex)
          .trim();
        fullName = `${fullName} ${lines[1]?.trim()}`;
        const numberOfCharatersToAddToTheInitialDOBIndex =
          getCharactersToAddBasedOnCurrentDateOrNameString(lines[2], "DOB");
        DOB = lines[2]
          .substring(dobIndex + numberOfCharatersToAddToTheInitialDOBIndex)
          .trim();
        essayStartIndex = 3;
      }
      const nameStructure = getFirstNameAndLastName(fullName?.trim());
      firstName = nameStructure.firstName;
      lastName = nameStructure.lastName;

      firstName = firstName.split(".").join("");
      firstName = firstName.replace(/\n/g, "").trim();
      firstName = firstName.replace(/\s/g, "");
      lastName = lastName.split(".").join("");
      lastName = lastName.replace(/\n/g, "").trim();
      lastName = lastName.replace(/\s/g, "");
      DOB = DOB.split(".").join("");
      // replace any \n from textract.
      DOB = DOB.replace(/\n/g, "").trim();
      DOB = DOB.replace(/\s/g, "");

      console.log(firstName, lastName, DOB);
      if (
        firstName &&
        lastName &&
        DOB &&
        firstName !== "" &&
        lastName !== "" &&
        DOB !== ""
      ) {
        firstName = firstName.replace(/\n/g, "").trim();
        firstName = formatToProper(firstName);
        lastName = lastName.replace(/\n/g, "").trim();
        lastName = formatToProper(lastName);

        if (validateIfDateIsInTheExpectedFormat(DOB)) {
          console.log("emtre aca", DOB);
          // replace any \n from textract.
          DOB = DOB.replace(/\n/g, "").trim();
          console.log("emtre aca", DOB);
          DOB = ParseDOB(DOB);

          // Getting the essay text.
          let textArray = lines.slice(essayStartIndex);
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
        } else {
          isIncorrectTemplate = true;
          logger.info(
            `Unable to continue with the student ${firstName} ${lastName} at page  ${page}, the DOB extracted is not in the expected format (dd/mm/yyyy or dd-mm-yyyy or dd.mm.yyyy), date found: ${DOB} \n`
          );
        }
      } else {
        isIncorrectTemplate = true;
        logger.info(
          `We are unable to identify the student info on page ${page}, please check that your paper does not have any extra information like numbers at the borders or headers at the top.\n`
        );
        logger.debug(
          `Incorrect template, extracted from textract is: ${lines}`
        );
      }

      // it's an extension of an student's essay.
    } else {
      if (lines && lines.length > 0) {
        // Remove any \n from lines.
        let textArray = lines.map((line) => line.replace(/\n/g, "").trim());
        let essayExtension = textArray.join("\n");

        if (essay?.text) {
          // Append the extension to the current text of the essay.
          essay.text = `${essay.text}\n${essayExtension}`;
          essay.pages?.push(page);
        } else {
          isIncorrectTemplate = true;
          logger.info(
            `We are unable to identify the student info on page ${page}, please check that your paper follows the template.\n`
          );
          logger.debug(
            `Incorrect template, extracted from textract is: ${lines}`
          );
        }
      }
    }
  }

  // for the final essay that was processed, it checks if the template is the correct one. Otherwise, the essay is not added to the array.
  if (!isIncorrectTemplate) {
    textractEssays.push(essay);
  }

  return textractEssays;
};

const validateIfDateIsInTheExpectedFormat = (date) => {
  // accepts dd/mm/yyyy or dd.mm.yyyy or dd-mm-yyyy
  const reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
  return Boolean(date?.match(reg));
};

/**
 * This method checks if the page being processed is a new essay or is just an extension of an essay. For example, if a student wrote two pages or more.
 * @param {*} lines
 * @returns
 */
const validateIfItIsANewEssay = (lines) => {
  if (lines && lines.length >= 3) {
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
    logger.error(`Unable to upload the file into s3. ${error}`);
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

    if (tokens?.AuthenticationResult && tokens.AuthenticationResult.IdToken) {
      return tokens.AuthenticationResult.IdToken;
    } else {
      logger.info(`Unable to get the token for this student ${email} \n`);
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
  studentsPageMapping,
  numberOfPagesDetectedInTheDoc
) => {
  try {
    const studentsFileMap = new Map();
    // First it checks if there's only a pdf with an student's essay or a single image file (PNG, JPEG)
    if (studentsPageMapping.size === 1 && numberOfPagesDetectedInTheDoc <= 1) {
      return;
    } else if (fileUrl.toLowerCase().includes(".pdf")) {
      // If it's a pdf with multiple essays...
      const command = new GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: fileUrl,
      });
      // It downloads the original file uploaded by the teacher.
      const response = await s3Client.send(command);

      let pdfString = await response.Body?.transformToString("base64");
      // It upload the content into a PDFDocument so it's easy to manipulate it.
      let pdfContent = await PDFDocument.load(pdfString);
      // each studentPageMapping is an array of [[StudentID, [pages]]]
      for (let [studentID, pages] of studentsPageMapping.entries()) {
        pages.sort((a, b) => a - b);
        // It creates the inidividual essay document.
        const individualEssay = await PDFDocument.create();
        // Each of the pages is copied to the new individual essay pdf.
        for (let index = 0; index < pages.length; index++) {
          const page = pages[index];
          const [copiedPage] = await individualEssay.copyPages(pdfContent, [
            page - 1,
          ]);
          individualEssay.addPage(copiedPage);
        }
        // Save the PDF object to get the bytes.
        const individualEssayBytes = await individualEssay.save();
        // Upload the file to s3.
        const s3FileKey = `public/handwriting/${activityID}/${studentID}/${studentID}.pdf`;
        await createFileInBucket(s3Client, s3FileKey, individualEssayBytes);
        // Return the file key so it's saved in the log record.
        studentsFileMap.set(studentID, s3FileKey);
      }
    }
    return studentsFileMap;
  } catch (err) {
    logger.error(err);
  }
};

module.exports = {
  splitFilePerStudent,
  createEssayObjects,
  ParseDOB,
  errorHandler,
  getTokenForAuthentication,
  getCurrentStudentUser,
};
