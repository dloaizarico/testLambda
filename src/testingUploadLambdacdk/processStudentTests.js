"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processStudentTests = void 0;
var uuid_1 = require("uuid");
var logger_1 = require("./logger");
var lookupCache_1 = require("./lookupCache");
var mapping_1 = require("./mapping");
var hasStudentId = function (v) {
    return v.student_id !== undefined;
};
/**
 * Type guard function to check if a `TestResultRow` is for a Category One test.
 *
 * @param {UnwrappingOptionalKey<TestResultRow, "student_id">} v A `TestResultRow` with a non-null "student_id" value.
 * @returns {v is UnwrappingOptionalKey<CategoryOneTestResultRow, "student_id">}
 */
var isCategoryOne = function (v) {
    return ["question_position", "response_correct", "question_id", "question_skill_code"].every(function (k) { return k in v; });
};
var processStudentTests = function (csvData) { return __awaiter(void 0, void 0, void 0, function () {
    var numberOfProcessedResults, addTestItems, testUploadItems, testResultItems, testResultLearningAreaItems, testResultAnswersItems, testResultAnswersGaItems, testQuestions, failedStudents, uniqueTestUploads, uniqueTestResults, creatorUserID, _i, csvData_1, row, yearLevelID, learningAreaIds, testID, testTypeID, existingTestID, existingTestTypeID, existingTestUnitID, existingTestTypeID, existingSubTypeID, subTypeID, now, testResultID, testUploadKey, testResultKey, skillCodeAndLearningAreaIds, learningAreaId, learningAreaId, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                numberOfProcessedResults = 0;
                addTestItems = [];
                testUploadItems = [];
                testResultItems = [];
                testResultLearningAreaItems = [];
                testResultAnswersItems = [];
                testResultAnswersGaItems = [];
                testQuestions = [];
                failedStudents = [];
                uniqueTestUploads = new Map();
                uniqueTestResults = new Map();
                return [4 /*yield*/, (0, lookupCache_1.getUserIdByEmail)("admin@bestperformance.com.au")];
            case 1:
                creatorUserID = _a.sent();
                if (!creatorUserID) {
                    throw new Error("Failed to fetch ID for admin user.");
                }
                _i = 0, csvData_1 = csvData;
                _a.label = 2;
            case 2:
                if (!(_i < csvData_1.length)) return [3 /*break*/, 18];
                row = csvData_1[_i];
                if (!hasStudentId(row)) {
                    failedStudents.push({
                        name: row.name,
                        reason: "The student was not name matched",
                    });
                    return [3 /*break*/, 17];
                }
                return [4 /*yield*/, (0, lookupCache_1.getYearLevelId)(row.year_level)];
            case 3:
                yearLevelID = _a.sent();
                if (!yearLevelID) {
                    failedStudents.push({
                        name: row.name,
                        studentId: row.student_id,
                        userId: row.user_id,
                        reason: "Failed to look up ID for year level: '".concat(row.year_level, "'"),
                    });
                    return [3 /*break*/, 17];
                }
                return [4 /*yield*/, (0, lookupCache_1.getLearningAreaByName)(row.test_learning_area)];
            case 4:
                learningAreaIds = _a.sent();
                if (!learningAreaIds) {
                    failedStudents.push({
                        name: row.name,
                        studentId: row.student_id,
                        userId: row.user_id,
                        reason: "Failed to look up learning area: '".concat(row.test_learning_area, "'"),
                    });
                    return [3 /*break*/, 17];
                }
                testID = null;
                testTypeID = null;
                return [4 /*yield*/, (0, lookupCache_1.getTestIdFromTestName)(row.test_name)];
            case 5:
                existingTestID = _a.sent();
                if (!existingTestID) return [3 /*break*/, 7];
                testID = existingTestID;
                return [4 /*yield*/, (0, lookupCache_1.getTestTypeIdFromTestId)(testID)];
            case 6:
                existingTestTypeID = _a.sent();
                if (!existingTestTypeID) {
                    failedStudents.push({
                        name: row.name,
                        studentId: row.student_id,
                        userId: row.user_id,
                        reason: "Failed to look up ID for test type from test ID: '".concat(testID, "'"),
                    });
                    return [3 /*break*/, 17];
                }
                testTypeID = existingTestTypeID;
                return [3 /*break*/, 11];
            case 7: return [4 /*yield*/, (0, lookupCache_1.getTestUnitIdFromName)("Raw Score")];
            case 8:
                existingTestUnitID = _a.sent();
                return [4 /*yield*/, (0, lookupCache_1.getTestTypeIdFromName)(row.test_type)];
            case 9:
                existingTestTypeID = _a.sent();
                return [4 /*yield*/, (0, lookupCache_1.getTestSubtypeIdFromName)(row.sub_test_type)];
            case 10:
                existingSubTypeID = _a.sent();
                if (!existingTestUnitID || !existingTestTypeID) {
                    failedStudents.push({
                        name: row.name,
                        studentId: row.student_id,
                        userId: row.user_id,
                        reason: "Failed to look up ID for test type: '".concat(row.test_type, "'"),
                    });
                    return [3 /*break*/, 17];
                }
                testID = (0, uuid_1.v4)();
                testTypeID = existingTestTypeID;
                subTypeID = existingSubTypeID;
                now = new Date().toISOString();
                addTestItems.push({
                    id: testID,
                    __typename: "Test",
                    dataType: "test",
                    schoolID: row.school_id,
                    subTestTypeID: subTypeID !== null && subTypeID !== void 0 ? subTypeID : undefined,
                    testUnitID: existingTestUnitID,
                    testName: row.test_name,
                    testYearLevelId: yearLevelID,
                    typeID: testTypeID,
                    year: row.test_calendar_year,
                    createdAt: now,
                    updatedAt: now,
                });
                _a.label = 11;
            case 11:
                testResultID = (0, uuid_1.v4)();
                testUploadKey = "".concat(row.test_calendar_year, "#").concat(testID, "#").concat(row.test_date);
                testResultKey = "".concat(row.student_id, "#").concat(testTypeID, "#").concat(row.test_date);
                _a.label = 12;
            case 12:
                _a.trys.push([12, 16, , 17]);
                if (!isCategoryOne(row)) return [3 /*break*/, 14];
                return [4 /*yield*/, (0, lookupCache_1.getLearningAreaAndSkillCodeIds)(row.question_skill_code)];
            case 13:
                skillCodeAndLearningAreaIds = _a.sent();
                if (!skillCodeAndLearningAreaIds) {
                    failedStudents.push({
                        name: row.name,
                        studentId: row.student_id,
                        userId: row.user_id,
                        reason: "Failed to look up skill code: '".concat(row.question_skill_code, "'"),
                    });
                    return [3 /*break*/, 17];
                }
                learningAreaId = skillCodeAndLearningAreaIds.learningArea;
                (0, mapping_1.handleTestResult)(testResultKey, testUploadKey, testResultID, testID, testTypeID, yearLevelID, uniqueTestUploads, row, uniqueTestResults, testResultItems);
                (0, mapping_1.addLearningAreaResult)(testResultLearningAreaItems, testResultID, testTypeID, row, learningAreaId, yearLevelID);
                return [3 /*break*/, 15];
            case 14:
                learningAreaId = learningAreaIds;
                (0, mapping_1.handleTestUpload)(testUploadKey, testID, testTypeID, yearLevelID, creatorUserID, row, uniqueTestUploads, testUploadItems);
                (0, mapping_1.handleTestResult)(testResultKey, testUploadKey, testResultID, testID, testTypeID, yearLevelID, uniqueTestUploads, row, uniqueTestResults, testResultItems);
                (0, mapping_1.addLearningAreaResult)(testResultLearningAreaItems, testResultID, testTypeID, row, learningAreaId, yearLevelID);
                _a.label = 15;
            case 15:
                numberOfProcessedResults += 1;
                return [3 /*break*/, 17];
            case 16:
                error_1 = _a.sent();
                logger_1.logger.error("Failed to upload results for '".concat(row.name, "' - '").concat(row.test_name, "' (").concat(row.display_date, ")"));
                failedStudents.push({
                    name: row.name,
                    studentId: row.student_id,
                    userId: row.user_id,
                    reason: "Unknown error: ".concat(error_1),
                });
                return [3 /*break*/, 17];
            case 17:
                _i++;
                return [3 /*break*/, 2];
            case 18:
                if (failedStudents.length > 0) {
                    logger_1.logger.error("Some students failed to upload", failedStudents);
                }
                return [2 /*return*/, {
                        numberOfProcessedResults: numberOfProcessedResults,
                        addTestItems: addTestItems,
                        testUploadItems: testUploadItems,
                        testResultItems: testResultItems,
                        testResultLearningAreaItems: testResultLearningAreaItems,
                        testResultAnswersItems: testResultAnswersItems,
                        testResultAnswersGaItems: testResultAnswersGaItems,
                        testQuestions: testQuestions,
                        failedStudents: failedStudents
                    }];
        }
    });
}); };
exports.processStudentTests = processStudentTests;
