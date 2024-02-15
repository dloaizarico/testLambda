/***********************************************************
 * Utility to remove all non alphanumeric chars and spaces and convert to lower case
 **********************************************************/
const compressString = (str) => {
  let returnStr = str.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return returnStr;
};

// It creates a proper concatenated name depending on the student middle name.
const getStudentName = (student) => {
  if (student.middleName && student.middleName !== "") {
    return `${student.firstName} ${student.middleName} ${student.lastName}`.toLowerCase();
  } else {
    return `${student.firstName} ${student.lastName}`.toLowerCase();
  }
};

// Ref: https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Dice%27s_coefficient, https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
function getBigrams(str) {
  const bigrams = new Set();
  for (let i = 0; i < str.length - 1; i += 1) {
    bigrams.add(str.substring(i, i + 2));
  }
  return bigrams;
}

// Ref: https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Dice%27s_coefficient, https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
function intersect(set1, set2) {
  return new Set([...set1].filter((x) => set2.has(x)));
}

/**
 * This method applied Dice's coefficient algorithm  to compare two strings.
 * Ref: https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Dice%27s_coefficient, https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
 * @param {*} str1
 * @param {*} str2
 * @returns percentage
 */
function diceCoefficient(str1, str2) {
  if (!str1 || !str2) return 0;
  const bigrams1 = getBigrams(str1);
  const bigrams2 = getBigrams(str2);
  return (
    (2 * intersect(bigrams1, bigrams2).size) / (bigrams1.size + bigrams2.size)
  );
}

const constants = {
  acceptedBirthdateSimilarityRatio: 0.7,
  acceptedNameSimilarityRatio: 0.95,
};

module.exports = {
  compressString,
  getStudentName,
  constants,
  diceCoefficient,
};
