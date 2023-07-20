const validateStudentInput = (student, studentsToCompare) => {
  let passValidations = true;
  let message = [];
  if (!student) {
    message.push("The student record is null.");
    passValidations = false;
  }

  if (!student.firstName || student.firstName === "") {
    message.push("No firstName found.");
    passValidations = false;
  }

  if (!student.lastName || student.lastName === "") {
    message.push("No lastName found.");
    passValidations = false;
  }

  if (!student.birthDate || student.birthDate === "") {
    message.push("No birthDate found.");
    passValidations = false;
  }

  if (!studentsToCompare || studentsToCompare.length === 0) {
    message.push(
      "student list to compare is empty, please provide a proper list."
    );
    passValidations = false;
  }

  return { message: message.join("\n"), passValidations };
};

module.exports = { validateStudentInput };
