"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAnswerItems = exports.addLearningAreaResult = exports.handleTestResult = exports.handleTestUpload = void 0;
var uuid_1 = require("uuid");
var handleTestUpload = function (key, testID, testTypeID, yearLevelID, creatorUserID, row, uniqueTestUploads, testUploadItems) {
    var existingTestUploadId = uniqueTestUploads.get(key);
    if (existingTestUploadId) {
        return existingTestUploadId;
    }
    var now = new Date().toISOString();
    var testUploadID = (0, uuid_1.v4)();
    uniqueTestUploads.set(key, testUploadID);
    testUploadItems.push({
        id: testUploadID,
        __typename: "TestUpload",
        testDate: row.test_date,
        testID: testID,
        typeID: testTypeID,
        yearLevelID: yearLevelID,
        schoolID: row.school_id,
        schoolYear: row.test_calendar_year,
        "schoolYear#testID#testDate": key,
        "schoolYear#typeID": "".concat(row.test_calendar_year, "#").concat(testTypeID),
        "schoolYear#yearLevelID": "".concat(row.test_calendar_year, "#").concat(yearLevelID),
        "schoolYear#yearLevelID#typeID": "".concat(row.test_calendar_year, "#").concat(yearLevelID, "#").concat(testTypeID),
        creatorUserID: creatorUserID,
        createdAt: now,
        updatedAt: now,
    });
    return testUploadID;
};
exports.handleTestUpload = handleTestUpload;
var handleTestResult = function (testResultKey, testUploadKey, resultID, testID, testTypeID, yearLevelID, uniqueTestUploads, row, uniqueTestResults, testResultItems) {
    if (uniqueTestResults.has(testResultKey)) {
        return;
    }
    var testUploadID = uniqueTestUploads.get(testUploadKey);
    if (!testUploadID) {
        throw new Error("Failed to look up test upload ID for key: '".concat(testUploadKey, "'"));
    }
    var now = new Date().toISOString();
    uniqueTestResults.set(testResultKey, resultID);
    testResultItems.push({
        id: resultID,
        __typename: "TestResult",
        testID: testID,
        completedDate: row.test_date,
        testDate: row.test_date,
        studentID: row.student_id,
        "studentID#testDate": "".concat(row.student_id, "#").concat(row.test_date),
        yearLevelID: yearLevelID,
        typeID: testTypeID,
        schoolYear: row.test_calendar_year,
        schoolID: row.school_id,
        testUploadID: testUploadID,
        proficiency: "",
        score: row.score_raw,
        scale: row.score_scale,
        stanine: row.score_stanine,
        percentile: row.score_percentile,
        percentage: row.score_percentage,
        nationalBand: undefined,
        minStandard: undefined,
        level: undefined,
        createdAt: now,
        updatedAt: now,
    });
};
exports.handleTestResult = handleTestResult;
var addLearningAreaResult = function (testResultLearningAreaItems, testResultID, testTypeID, row, learningAreaID, yearLevelID) {
    var now = new Date().toISOString();
    testResultLearningAreaItems.push({
        id: (0, uuid_1.v4)(),
        __typename: "TestResultLearningArea",
        testResultID: testResultID,
        studentID: row.student_id,
        learningAreaID: learningAreaID,
        "learningAreaID#schoolYear": "".concat(learningAreaID, "#").concat(row.test_calendar_year),
        "learningAreaID#typeID#schoolYear": "".concat(learningAreaID, "#").concat(testTypeID, "#").concat(row.test_calendar_year),
        "yearLevelID#learningAreaID#schoolYear": "".concat(yearLevelID, "#").concat(learningAreaID, "#").concat(row.test_calendar_year),
        "yearLevelID#learningAreaID#typeID#schoolYear": "".concat(yearLevelID, "#").concat(learningAreaID, "#").concat(testTypeID, "#").concat(row.test_calendar_year),
        typeID: testTypeID,
        schoolYear: row.test_calendar_year,
        yearLevelID: yearLevelID,
        schoolID: row.school_id,
        testDate: row.test_date,
        createdAt: now,
        updatedAt: now,
    });
};
exports.addLearningAreaResult = addLearningAreaResult;
var addAnswerItems = function (answerID, resultID, testUploadID, questionID, row, testResultAnswersItems, testResultAnswersGaItems) {
    var now = new Date().toISOString();
    var proficiency = row.response_correct ? 1 : 0;
    testResultAnswersItems.push({
        id: answerID,
        __typename: "TestResultAnswers",
        testQuestionID: row.question_id,
        testResultID: resultID,
        proficiency: proficiency,
        createdAt: now,
        updatedAt: now,
    });
    testResultAnswersGaItems.push({
        testResultAnswerID: answerID,
        testResultID: resultID,
        testUploadID: testUploadID,
        studentID: row.student_id,
        acCode: row.question_skill_code,
        proficiency: proficiency,
        createdAt: now,
        updatedAt: now,
    });
};
exports.addAnswerItems = addAnswerItems;
