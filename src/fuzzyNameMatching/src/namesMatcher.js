const fuzzySoundex = require("talisman/phonetics/fuzzy-soundex");
const lein = require("talisman/phonetics/lein");
const {
  compressString,
  getStudentName,
  constants,
  diceCoefficient,
} = require("./utils");

/**
 * This method uses an index strategy through maps that are built from the list of students to compare. 
 * There are different indexes used like:
  id                               {student}
  firstName, lastName, dob         {student}
  firstName, lastname              {student}
  firstName, Dob                   {student}
  firstName[0], lastname, dob      {student}
  firstName[0-2], lastName, dob    {student}
  firstName, lastName[0,2]         {student}
  If there are multiple matches found after the student is found through the indexes, the method applies talisman fuzzySoundex and lein methods
  to try to find the most accurate student that matches with the provided name. After that, the birthdates of both records are compared using Dice's coefficient
  to identify how similar they are. Then, it finally returns the possible matches after all the filtering process.
  This method should be used when we are quite confident in the record to compare because the indexes are limited combinations. 
  For example, searching for records like jhon smi when we need John Smith probably won't return results using this method. However, the use of this method is more efficient
  than the others provided in this library because the indexes are created and then the search is performed using all the maps.
 * 
 * @param {*} student student record to compare and find possible match.
 * @param {*} maps different maps with indexes (key, array of students data)
 * @returns a list with possible matches of students
 */
const matchStudentNamesByIndexes = (student, maps) => {
  // Prepare the keys
  const FLDKey = compressString(
    student.firstName + student.lastName + student.birthDate
  );
  const FLKey = compressString(student.firstName + student.lastName);
  const F0LDKey = compressString(
    student.firstName.charAt(0) + student.lastName + student.birthDate
  );
  const F03LDKey = compressString(
    student.firstName.slice(0, 3) + student.lastName + student.birthDate
  );
  const FL03DKey = compressString(
    student.firstName + student.lastName.slice(0, 3) + student.birthDate
  );

  // The reverse keys
  const FLDKeyR = compressString(
    student.lastName + student.firstName + student.birthDate
  );
  const FLKeyR = compressString(student.lastName + student.firstName);
  const F0LDKeyR = compressString(
    student.lastName.charAt(0) + student.firstName + student.birthDate
  );
  const F03LDKeyR = compressString(
    student.lastName.slice(0, 3) + student.firstName + student.birthDate
  );
  const FL03DKeyR = compressString(
    student.lastName + student.firstName.slice(0, 3) + student.birthDate
  );

  // Start to find the student received in each of the indexes.
  let foundMsg = "Not Found";
  let foundStudents = [];
  let found = maps.studentByFLD.get(FLDKey); // try firstName, lastName, Dob
  if (found) {
    foundMsg = "FLD";
    foundStudents = [...found];
  } else {
    found = maps.studentByFLD.get(FLDKeyR); // try lastName, firstName, Dob
    if (found) {
      foundMsg = "FLDR";
      foundStudents = [...found];
    } else {
      found =
        maps.studentByF03LD.get(F03LDKey) || maps.studentByFL03D.get(FL03DKey); // try firstName(3), lastName, Dob
      if (found) {
        foundMsg = "F03LD";
        foundStudents = [...found];
      } else {
        found = maps.studentByF0LD.get(F0LDKey); // try firstName(1), lastName, Dob
        if (found) {
          foundMsg = "F0LD";
          foundStudents = [...found];
        } else {
          found =
            maps.studentByF03LD.get(F03LDKeyR) ||
            maps.studentByFL03D.get(FL03DKeyR); // try Name(3), lastName, Dob (FL reversed)
          if (found) {
            foundMsg = "F03LDR";
            foundStudents = [...found];
          } else {
            found = maps.studentByF0LD.get(F0LDKeyR); // try firstName(1), lastName, Dob (FL reversed)
            if (found) {
              foundMsg = "F0LDR";
              foundStudents = [...found];
            } else {
              found = maps.studentByFL.get(FLKey); // try firstName, lastName
              if (found) {
                foundMsg = "FL";
                foundStudents = [...found];
              } else {
                found = maps.studentByFL.get(FLKeyR); // try firstName, lastName (FL reversed)
                if (found) {
                  foundMsg = "FLR";
                  foundStudents = [...found];
                }
              }
            }
          }
        }
      }
    }
  }

  // No possible matches found through indexes strategy
  if (foundStudents.length === 0) {
    return {
      foundStudentsArray: [],
      matchedBy: "No Match Found",
    };
  } else if (foundStudents.length > 1) {
    // If there are more than 1 possible matches.
    const studentNameToCompare = getStudentName(student);
    const filteredPossibleMatches = [];
    // compare names using talisman fuzzySoundex and lein
    for (let index = 0; index < foundStudents.length; index++) {
      const studentFromData = foundStudents[index];
      const possibleMatchName = getStudentName(studentFromData);

      if (
        fuzzySoundex(studentNameToCompare) !== fuzzySoundex(possibleMatchName)
      ) {
        continue;
      }
      if (lein(studentNameToCompare) !== lein(possibleMatchName)) continue;

      

      const birthDateSimiliraryRatio = diceCoefficient(
        student.birthDate,
        studentFromData.birthDate
      );
      if (
        birthDateSimiliraryRatio < constants.acceptedBirthdateSimilarityRatio
      ) {
        continue;
      }
      // if both codes from talisman matches for Lein and fuzzySoundex and the birthdates are similar, the record is added.
      filteredPossibleMatches.push({
        studentFromData,
        birthDateSimiliraryRatio: birthDateSimiliraryRatio,
      });
    }

    // If after talisman comparison, the list length is still bigger than 1, it returns the possible matches.
    if (filteredPossibleMatches.length > 1) {
      return {
        foundStudentsArray: filteredPossibleMatches,
        matchedBy: "Multiple matches found",
      };
    } else if (filteredPossibleMatches.length === 0) {
      return {
        foundStudentsArray: filteredPossibleMatches,
        matchedBy: "No match found even after using talisman",
      };
    } else {
      return {
        foundStudentsArray: filteredPossibleMatches,
        matchedBy: "1 Match found using indexes and talisman",
      };
    }
  } else {
    return {
      foundStudentsArray: foundStudents,
      matchedBy: "1 Match found through indexes.",
    };
  }
};

/**
 * This method takes a list of students and compare a specific name against that list.
 * In order to compare, the method iterates through the list and get a fuzzySoundex of each name. Then, it compares that fuzzySoundex codes to check how similar they are,
 * this will cover codes returned from talisman like J595 and J696 because the names were jhon smi and john smith.
 * If the Dice's coefficient for both the names and birthdate are greater than the expected coefficient (constants defined)
 * Use case:
 *  - This method will be good to use when the input student record contains incomplete names or misspelled names. However, it could lead to more inaccuracy because whatever is returned by 
 * talisman is compared to find similarity, it does not validate talisman result as strict equality.
 * For example:
 *  Given the name: Jhon Smith and having in the list Jaymes Wynne, when calling fuzzySoundex(talisman), one Jhon's code from talisman will be and Jaymes' code will be , as you can see those two codes
 * from talisman look quite similar. Therefore, Jaymes Wynne will be returned as a possible match.
 * 
 * @param {*} student record to compare
 * @param {*} students list in which the student is going to be compared.
 * @returns list with possible matches of students with nameSimilarityRatio and birtDateSimilarityRatio, the ratio is a percentage 0-1
 */
const matchStudentNamesWithSomeEqualityFromTalisman = (student, students) => {
  const possibleMatches = [];
  const studentNameToCompare = getStudentName(student);

  students.forEach((studentFromList) => {
    const studentName = getStudentName(studentFromList);

    // get names similarity using Dice's coefficient.
    const namesSimilarityRatio = diceCoefficient(
      fuzzySoundex(studentNameToCompare),
      fuzzySoundex(studentName)
    );

    // Get birthdate similarity y using Dice's coefficient.
    const birtDateSimilarityRatio = diceCoefficient(
      student.birthDate,
      studentFromList.birthDate
    );

    // If they are greater than the constant references, the record is added as a possible match.
    if (
      namesSimilarityRatio > constants.acceptedNameSimilarityRatio &&
      birtDateSimilarityRatio > constants.acceptedBirthdateSimilarityRatio
    ) {
      possibleMatches.push({
        student: { ...studentFromList },
        namesSimilarityRatio,
        birtDateSimilarityRatio,
      });
    }
  });

  return {
    possibleMatches,
  };
};

/**
 * This method takes a list of students and compare a specific name against that list, the only different with matchStudentNamesWithTalismanAndDiceCoefficient is that 
 * the codes returned from talismnan must match completly. Otherwise, the record from the list to compare is skipped.
 * For example:
 * Having the name Jhon Smit and found in the list Jaymes Smit, the codes returned form talisman are lein(J2 5 and J25), fuzzySoundex(J5953 and J5953) because they don't strictly match,
 * Jaymes Smit will not be returned as a possible match.
 * @param {*} student 
 * @param {*} students 
 * @returns list with possible matches of students with birtDateSimilarityRatio, the ratio is a percentage 0-1
 */
const matchStudentNamesWithStrictEqualityFromTalisman = (student, students) => {
  const possibleMatches = [];
  const studentNameToCompare = getStudentName(student);

  students.forEach((studentTC) => {
    const studentName = getStudentName(studentTC);
    // if codes from talisman strictly match, this will filter lots of homophones.
    if (
      fuzzySoundex(studentNameToCompare) === fuzzySoundex(studentName) &&
      lein(studentNameToCompare) === lein(studentName)
    ) {
      const birthDateSimiliratyratio = diceCoefficient(
        studentTC.birthDate,
        student.birthDate
      );
      // and the birthdates are similar, the record is considered a possible match.

      if (
        birthDateSimiliratyratio > constants.acceptedBirthdateSimilarityRatio
      ) {
        possibleMatches.push({
          student: { ...studentTC },
          birthDateSimiliratyratio,
        });
      }
    }
  });

  return {
    possibleMatches,
  };
};

module.exports = {
  matchStudentNamesByIndexes,
  matchStudentNamesWithSomeEqualityFromTalisman,
  matchStudentNamesWithStrictEqualityFromTalisman,
};
