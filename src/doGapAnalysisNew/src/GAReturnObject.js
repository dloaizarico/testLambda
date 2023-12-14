// The structure of the response is as below.
// Array of learningAreas
//   Array of YearLevel concepts
//      Array of AcCodes
//          Array of students with gap in that AcCode
// Note the amount of duplication in items[]
//     curriculumEntry/skill substrandID, yearLevelID
// and that all of the data in items[] can be derived from an AcCode lookup
// Also most of the data under students[] can be derived from a studentID lookup
// Also most of the data in students is unused in the gap analysis display.
// See here for documentClient examples
//    https://www.fernandomc.com/posts/eight-examples-of-fetching-data-from-dynamodb-with-node/
module.exports.GAreturnObject = [
  // array of learningAreas
  {
    areaName: "English", //[0].areaName
    colour: "#ee4491",
    learningAreaID: "5bbdc48d-97ed-4f11-9e1a-d91621621c65",
    numStudents: 1,
    summary: [
      // array of YearLevels
      {
        incorrectCodes: 1, //[0].summary[0].incorrectCodes
        studentCount: 1,
        totalCodes: 1,
        year: "year 1",
        items: [
          // array of AcCodes
          {
            acCode: {
              acCode: "ACELY1660",
              curriculumEntry:
                "Use comprehension strategies to build literal and inferred meaning about key events, ideas and information in texts that they listen to, view and read by drawing on growing knowledge of context, text structures and language features",
              learningArea: {
                id: "5bbdc48d-97ed-4f11-9e1a-d91621621c65",
                areaName: "English",
                colour: "#ee4491",
              },
              skill:
                "Use comprehension strategies to build literal and inferred meaning about key events, ideas and information",
              strand: {
                strandName: "Literacy",
              },
              substrand: {
                id: "0df5ee9d-d049-41cc-879a-8dbcdcee6de9",
                substrandName: "Interpreting, analysing, evaluating",
              },
              substrandID: "0df5ee9d-d049-41cc-879a-8dbcdcee6de9",
              yearLevel: {
                id: "6654b93e-7428-4b23-8ecf-ae3a47152ac7",
                yearCode: "Y1",
                description: "Year 1",
              },
              yearLevelID: "6654b93e-7428-4b23-8ecf-ae3a47152ac7",
            },
            students: [
              {
                birthDate: "2010-05-20",
                firstName: "Blaise", // [0].summary[0].items[0].students[0].firstName
                gapRatio: 0.5,
                gender: "Male",
                id: "79ced2ba-73cb-4f4c-ad40-b0af6250c230",
                lastName: "Stewart",
                middleName: "",
                score: "24",
                testDate: "2021-05-24",
                testID: "d6684dac-35a6-435a-a3a1-b57d8424f7e9",
              },
              //{
              //  more: "students",
              //},
            ],
          },
          // {more AcCodes}
        ],
      },
      //{more YearLevels},
    ],
  },
  //{ nextLearningAreaHere: "dummy" },
  //{ nextLearningAreaHere: "dummy" },
];
