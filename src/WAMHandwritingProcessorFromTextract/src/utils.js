const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const { SSMClient, GetParametersCommand } = require("@aws-sdk/client-ssm");
const { fromNodeProviderChain } = require("@aws-sdk/credential-providers");
const { CognitoIdentityServiceProvider } = require("aws-sdk");
const PDFDocument = require("pdf-lib").PDFDocument;
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { logger } = require("./logger");
const _ = require("lodash");

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
  logger.debug(`No user record found for this student\n`);
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

  try {
    let finalDate;
    // validate if the received dob is type date or not.
    if (dob instanceof Date && !isNaN(dob)) {
      finalDate = dob;
    } else {
      let separator;
      if (dob.includes(".")) {
        separator = ".";
      } else if (dob.includes("-")) {
        separator = "-";
      } else if (dob.includes("/")) {
        separator = "/";
      } else {
        logger.debug(
          "The format of the date is not the expected (dd/mm/yyyy or dd-mm-yyyy or dd.mm.yyyy)"
        );
        return null;
      }

      if (typeof dob === "string") {
        finalDate = new Date(dob);
        let dateParts = dob.split(separator);
        // month is 0-based, that's why we need dataParts[1] - 1
        finalDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      } else {
        finalDate = dob;
      }
    }
    return getDate(finalDate);
  } catch (error) {
    logger.debug(
      `it was not possible to cast a date, the received value was ${dob}${error}`
    );
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
  } else if (type === "PAGE") {
    return string.toUpperCase().includes("PAGE :")
      ? 6
      : string.toUpperCase().includes("PAGE:")
      ? 5
      : 4;
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
    const studentDataLineIndex = validateFirstLineOfPage(lines);
    if (studentDataLineIndex > 0) {
      // Student's data extracted
      let firstName,
        lastName,
        DOB = "";
      let essayPage;

      // This is used to control from what index it begins the student essay text after textract process.
      let essayStartIndex;
      // index from where the NAME starts in the string, it's used to extract the name of the student.
      let nameIndex;
      // index from where the DOB starts in the string, it's used to extract the DOB of the student.
      let dobIndex;
      let pageIndex;
      let fullName;

      nameIndex = lines[studentDataLineIndex].toUpperCase().indexOf("NAME");
      dobIndex = lines[studentDataLineIndex].toUpperCase().indexOf("DOB");
      pageIndex = lines[studentDataLineIndex].toUpperCase().indexOf("PAGE");
      // get number of characters to omit when reading name.
      const numberOfCharatersToAddToTheInitialNameIndex =
        getCharactersToAddBasedOnCurrentDateOrNameString(
          lines[studentDataLineIndex],
          "NAME"
        );
      fullName = lines[studentDataLineIndex]
        .substring(
          nameIndex + numberOfCharatersToAddToTheInitialNameIndex,
          dobIndex
        )
        .trim();
      const numberOfCharatersToAddToTheInitialDOBIndex =
        getCharactersToAddBasedOnCurrentDateOrNameString(
          lines[studentDataLineIndex],
          "DOB"
        );
      DOB = lines[studentDataLineIndex]
        .substring(
          dobIndex + numberOfCharatersToAddToTheInitialDOBIndex,
          pageIndex
        )
        .trim();
      const numberOfCharatersToAddToTheInitialPageIndex =
        getCharactersToAddBasedOnCurrentDateOrNameString(
          lines[studentDataLineIndex],
          "PAGE"
        );
      essayPage = lines[studentDataLineIndex]
        .substring(pageIndex + numberOfCharatersToAddToTheInitialPageIndex)
        .trim();
      essayStartIndex = studentDataLineIndex;

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
      essayPage = essayPage.split(".").join("");
      // replace any \n from textract.
      essayPage = essayPage.replace(/\n/g, "").trim();
      essayPage = essayPage.replace(/\s/g, "");
      if (
        firstName &&
        lastName &&
        DOB &&
        page &&
        firstName !== "" &&
        lastName !== "" &&
        DOB !== "" &&
        page !== ""
      ) {
        firstName = firstName.replace(/\n/g, "").trim();
        firstName = formatToProper(firstName);
        lastName = lastName.replace(/\n/g, "").trim();
        lastName = formatToProper(lastName);

        if (validateIfDateIsInTheExpectedFormat(DOB)) {
          if (isNumeric(essayPage)) {
            // replace any \n from textract.
            DOB = DOB.replace(/\n/g, "").trim();
            DOB = ParseDOB(DOB);

            // Getting the essay text.
            let textArray = lines.slice(essayStartIndex);
            let cleanedEssayText = "";
            if (textArray && textArray.length > 0) {
              // Remove any \n from lines.
              textArray = textArray.map((line) =>
                line.replace(/\n/g, "").trim()
              );
              cleanedEssayText = textArray.join("\n");
            }

            essay = {
              firstName,
              lastName,
              DOB,
              text: cleanedEssayText,
              page: {
                studentPage: essayPage,
                pageInDocument: page,
              },
              key: `${firstName}${lastName}${DOB}${essayPage}`,
            };
          } else {
            isIncorrectTemplate = true;
            logger.info(
              `Unable to continue with the student ${firstName} ${lastName} at page  ${page} of the document, the page extracted is not a number, page found: ${essayPage} \n`
            );
            logger.debug(
              `Unable to continue with the student ${firstName} ${lastName} at page  ${page} of the document, the page extracted is not a number, page found: ${essayPage} \n`
            );
          }
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
      isIncorrectTemplate = true;
      logger.info(
        `We are unable to identify the student info on page ${page}, please check that your paper follows the template.\n`
      );
      logger.debug(`Incorrect template, extracted from textract is: ${lines}`);
    }

    if (isIncorrectTemplate && lines && lines.length > 0) {
      // Remove first line from the unidentified page, we have to assume that the first line comes with student data and we don't want that in the essay text.
      let linesWithoutFirstRow = lines.slice(1);
      // Remove any \n from lines.
      let textArray = linesWithoutFirstRow
        .map((line) => line.replace(/\n/g, "").trim())
        .join("\n");
      essay = {
        text: textArray,
        firstName: "unidentifiedName",
        lastName: "unidentifiedLastName",
        DOB: "unidentifiedDOB",
        page: {
          studentPage: page,
          pageInDocument: page,
        },
        key: `unidentified${page}`,
        unidentified: true,
      };
    }
    textractEssays.push(essay);
  }

  return textractEssays;
};

const validateIfDateIsInTheExpectedFormat = (date) => {
  // accepts dd/mm/yyyy or dd.mm.yyyy or dd-mm-yyyy
  const reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
  return !!date?.match(reg);
};

/**
 * This method checks if the page being processed is a new essay or is just an extension of an essay. For example, if a student wrote two pages or more.
 * @param {*} lines
 * @returns
 */
const validateFirstLineOfPage = (lines) => {
  if (lines && lines.length >= 3) {
    return lines[0].toLowerCase().includes("name") &&
      lines[0].toLowerCase().includes("dob") &&
      lines[0].toLowerCase().includes("page")
      ? 1
      : lines[1].toLowerCase().includes("name") ||
        lines[1].toLowerCase().includes("dob") ||
        lines[1].toLowerCase().includes("page")
      ? 2
      : lines[2].toLowerCase().includes("name") ||
        lines[2].toLowerCase().includes("dob") ||
        lines[2].toLowerCase().includes("page")
      ? 3
      : 0;
  }
  return 0;
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

    if (
      tokens &&
      tokens.AuthenticationResult &&
      tokens.AuthenticationResult.IdToken
    ) {
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
        const sortedPages = _.sort(pages, "studentPage", "ASC");

        // It creates the inidividual essay document.
        const individualEssay = await PDFDocument.create();
        // Each of the pages is copied to the new individual essay pdf.
        for (let index = 0; index < sortedPages.length; index++) {
          const page = sortedPages[index];
          const [copiedPage] = await individualEssay.copyPages(pdfContent, [
            page.pageInDocument - 1,
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

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

/**
 * This method takes the processed array of pages and combine them by student, it also organises them
 * by page provided by the student.
 * For those pages unidentified, this method generate a single entry for the page.
 * @param {*} processedPages
 * @returns
 */
const groupEssayPagesByStudent = (processedPages) => {
  // get the pages that were marked as unidentified.
  const unidentifiedPages = processedPages.filter((page) => page.unidentified);
  // get pages that followed the proper template name, dob, page.
  const identifiedPages = processedPages.filter((page) => !page.unidentified);
  // sort identified pages by these attributes so it's easy to combine them by student.
  const sortedIdentifiedPages = _.sortBy(
    identifiedPages,
    ["firstName", "lastName", "DOB", "essayPage"],
    ["ASC", "ASC", "ASC", "ASC"]
  );

  // this is the array of final essays when the pages are combined.
  const essayObjects = [];
  /**
   * axuRecord: will keep the previous record in the sorted list, it's used to compare if it's the same student or not.
   * text: variable use to append the text found in each page of the student's essay.
   * pages: array to save the different pages identified by the student in the paper.
   */
  let auxRecord, text, pages;

  // This method add an essay that contains all the pages per student, it saved the object in the essayObjects array of the main function.
  // preSavedRecord: it refers to the current identified page that is being processed, it's used to take values that are not combine such as firstName, lastName, DOB.
  // textValue: it's the combined text of all essays related to one student.
  // pages: array with all the pages defined by the student on paper, it will be in order.
  // unidentified: defines if the essay is identified because it follows the template or not.
  const addEssay = (preSavedRecord, textValue, pages, unidentified) => {
    const essay = {
      text: textValue,
      pages: pages,
      firstName: preSavedRecord.firstName,
      lastName: preSavedRecord.lastName,
      DOB: preSavedRecord.DOB,
      key: preSavedRecord.key,
    };
    if (unidentified) {
      essay.unidentified = true;
    }
    essayObjects.push(essay);
  };

  // this method initialise the auxRecord variable that will be used to compare if the following records are related to the same student or not.
  const initialiseAuxRecord = (record) => {
    auxRecord = record;
    console.log(auxRecord);
    text = auxRecord.text;
    pages = [auxRecord.page];
  };
  if (identifiedPages && identifiedPages.length > 0) {
    // Take first record to compare.
    initialiseAuxRecord(sortedIdentifiedPages[0]);

    for (let i = 1; i < sortedIdentifiedPages.length; i++) {
      const element = sortedIdentifiedPages[i];
      // If it's referring to the same student.
      if (element.key === auxRecord.key) {
        // append text, essayPages and documentPages.
        text = `${text}\n${element.text}`;
        pages.push(element.page);
      } else {
        // If it's a different student, add the combined essay
        addEssay(auxRecord, text, pages);
        // Erase and initialise the auxRecord to compare with the current page processed.
        initialiseAuxRecord(sortedIdentifiedPages[i]);
      }
    }
    // If by the end of the previous cycle, the aux record is not null, the essay is added to the list.
    if (auxRecord) {
      addEssay(auxRecord, text, pages);
    }
  }

  if (unidentifiedPages && unidentifiedPages.length > 0) {
    // For those unidentified pages, it's created essays in the array, no need to combine pages because they didn't follow the templates and the algorithm is not able to recognise the students.
    unidentifiedPages.forEach((unidentifiedPage) => {
      addEssay(
        unidentifiedPage,
        unidentifiedPage.text,
        unidentifiedPage.page,
        true
      );
    });
  }

  return essayObjects;
};

module.exports = {
  splitFilePerStudent,
  createEssayObjects,
  ParseDOB,
  errorHandler,
  getTokenForAuthentication,
  getCurrentStudentUser,
  groupEssayPagesByStudent,
};
