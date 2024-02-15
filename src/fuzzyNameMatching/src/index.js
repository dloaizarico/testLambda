const { validateStudentInput } = require("./validations");
const { createStudentDataMapIndexes } = require("./keysMapCreator");
const {
  matchStudentNamesByIndexes,
  matchStudentNamesWithSomeEqualityFromTalisman,
  matchStudentNamesWithStrictEqualityFromTalisman,
} = require("./namesMatcher");
const event = require("./event")
const { logger } = require("./logger");

/** This method matches student names with a list using indexes first and then it uses talisman if there's more than one record matching.
 * student, it's the record to match and it should have as mandatory fields: firstName, lastName, birthDate.
 * studentsToCompare, it's the list used to compare the student, it should be a list with at least one element.
 */
const matchStudentByNameUsingIndexes = (student, studentsToCompare) => {
  const { message, passValidations } = validateStudentInput(
    student,
    studentsToCompare
  );

  if (!passValidations) {
    throw new Error(message);
  }

  const indexes = createStudentDataMapIndexes(studentsToCompare);

  return matchStudentNamesByIndexes(student, indexes);
};

const matchStudentByNameWithSomeEquality = (student, studentsToCompare) => {
  const { message, passValidations } = validateStudentInput(
    student,
    studentsToCompare
  );

  if (!passValidations) {
    throw new Error(message);
  }

  return matchStudentNamesWithSomeEqualityFromTalisman(
    student,
    studentsToCompare
  );
};

const matchStudentByNameWithStrictEquality = (student, studentsToCompare) => {
  const { message, passValidations } = validateStudentInput(
    student,
    studentsToCompare
  );

  if (!passValidations) {
    throw new Error(message);
  }

  return matchStudentNamesWithStrictEqualityFromTalisman(
    student,
    studentsToCompare
  );
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const handler = async (event) => {
  logger.debug(`EVENT: ${JSON.stringify(event)}`);

  let eventMessage;
  if (event.message) {
    if (event.message.includes("EVENT")) {
      eventMessage =
        typeof event.message === "string"
          ? JSON.parse(event.message.substring(7))
          : event.message;
    } else {
      eventMessage =
        typeof event.message === "string"
          ? JSON.parse(event.message)
          : event.message;
    }
  } else {
    eventMessage = typeof event === "string" ? JSON.parse(event) : event;
  }

  const { input } = eventMessage;
  logger.debug(`input: ${input}`);

  let response;
  let unknowMethod = false;
  switch (input.method) {
    case "matchStudentByNameUsingIndexes": {
      response = matchStudentByNameUsingIndexes(
        input.student,
        input.matchingList
      );
      break;
    }
    case "matchStudentByNameWithSomeEquality": {
      response = matchStudentByNameWithSomeEquality(
        input.student,
        input.matchingList
      );
      break;
    }
    case "matchStudentByNameWithStrictEquality": {
      response = matchStudentByNameWithStrictEquality(
        input.student,
        input.matchingList
      );
      break;
    }
    default: {
      unknowMethod = true;
    }
  }

  if (unknowMethod) {
    return {
      statusCode: 500,
      body: JSON.stringify("Method not supported!!"),
    };
  } else {
    logger.debug(`result: ${JSON.stringify(response)}`);
    console.log({
      statusCode: 200,
      body: JSON.stringify(response),
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  }
};

handler(event);