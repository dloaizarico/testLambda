const {
    compressString,
  } = require("./utils");

// This method populates all the different maps based on the student set of data received as paramter.
const populateKeyMaps = (map, key, studentID) => {
  const existingRecords = map.get(key);
  let valuesToSave = [studentID];
  if (existingRecords) {
    valuesToSave = [...existingRecords, studentID];
  }
  map.set(key, valuesToSave);
};

/**
 * Based on a list received as paramters, it creates a set of maps in representation of indexes to find the students.
 * @param {*} students
 * @returns
 */
const createStudentDataMapIndexes = (students) => {
  // if not in IndexedDB then read from DynamoDB ( takes around 15 secs)
  if (students.length === 0) {
    /*****************************************************
     * Temp code to identify "bad" Student records
     ****************************************************/
    let hasEmbeddedSpaces = []; // like " John"
    let missingNames = []; // firstname or lastName missing
    let badIndexDateFormat = []; // index like "lastName#Sat May 8 etc" instead of "lastName#2001-05-08"
    let badIndices = []; // index like lastName#2001-05-08 but dob is incorrect
    let containsNonAscii = []; // name contains at least one accented charactar
    const isAscii = (str) => /^[\x00-\x7F]+$/.test(str);

    for (const student of students) {
      // test for empty firstName or lastName
      if (!student.lastName || !student.firstName) {
        missingNames.push(student);
        continue;
      }

      // test for non ascii characters
      if (!isAscii(student.lastName) || !isAscii(student.firstName)) {
        containsNonAscii.push(student);
      }

      // test for bad date or bad date format in 'lastName#birthDate' index
      // or possibly this index is empty (see AU dev)
      if (
        `${student.lastName}#${student.birthDate}` !==
        student["lastName#birthDate"]
      ) {
        if (isNaN(student["lastName#birthDate"].split("#")[1].charAt(0))) {
          // bad date format in index
          badIndexDateFormat.push(student);
        } else {
          // probably wrong date in index
          badIndices.push(student);
        }
      }

      // test for embedded spaces in names
      if (
        student.lastName.trim().length < student.lastName.length ||
        student.firstName.trim().length < student.firstName.length
      ) {
        hasEmbeddedSpaces.push(student);
      }
    } // end for
  } // end if

  // When we reach here students[] should have either the indexedDB data or the dynamoDB data
  // Now make all the indices needed for fast searching with following keys and values
  //   id                               {student}
  //   firstName, lastName, dob         {student}
  //   firstName, lastname              {student}
  //   firstName, Dob                   {student}
  //   firstName[0], lastname, dob      {student}
  //   firstName[0-2], lastName, dob    {student}
  //   firstName, lastName[0,2]         {student}

  const studentById = new Map(); // indexed by studentID - to lookup student details
  const studentByFLD = new Map(); // indexrd by firstName, lastName, DoB
  const studentByFL = new Map(); // indexed by firstName
  const studentByF0LD = new Map(); // indexed by firstName[0], lastName, DoB
  const studentByF03LD = new Map(); // indexed by firstName, lastName[0], DoB
  const studentByFL03D = new Map(); // indexed by firstName, lastName[0,1,3], DoB

  for (const student of students) {
    if (!(student.firstName && student.firstName && student.birthDate))
      continue;

    // no dublicates possible on the id
    studentById.set(student.id, { ...student });

    // All the rest may have duplicates so we have to save an array of matches against each key
    let key = compressString(
      student.firstName + student.lastName + student.birthDate
    );
    populateKeyMaps(studentByFLD, key, student);
    key = compressString(student.firstName + student.lastName);
    populateKeyMaps(studentByFL, key, student);
    key = compressString(
      student.firstName.charAt(0) + student.lastName + student.birthDate
    );
    populateKeyMaps(studentByF0LD, key, student);
    key = compressString(
      student.firstName.slice(0, 3) + student.lastName + student.birthDate
    );
    populateKeyMaps(studentByF03LD, key, student);
    key = compressString(
      student.firstName + student.lastName.slice(0, 3) + student.birthDate
    );
    populateKeyMaps(studentByFL03D, key, student);
  }

  return {
    studentById: studentById,
    studentByFLD: studentByFLD,
    studentByFL: studentByFL,
    studentByF0LD: studentByF0LD,
    studentByF03LD: studentByF03LD,
    studentByFL03D : studentByFL03D,
  };
};

module.exports = {
    createStudentDataMapIndexes,
};
