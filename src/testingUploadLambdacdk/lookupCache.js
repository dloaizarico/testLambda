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
exports.findOrCreateTestQuestion = exports.getTestUnitIdFromName = exports.getTestSubtypeIdFromName = exports.getTestIdFromTestName = exports.getTestTypeIdFromTestId = exports.getTestTypeIdFromName = exports.getYearLevelId = exports.getLearningAreaAndSkillCodeIds = exports.getLearningAreaByName = exports.isValidTestId = exports.getUserIdByEmail = void 0;
var path_1 = require("path");
var dotenv_1 = require("dotenv");
// Load the `.env` file located at "../../../../.env"
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
var uuid_1 = require("uuid");
var clients_1 = require("./clients");
var logger_1 = require("./logger");
var yearLevelsByDescription = new Map();
var testTypeIdsByTestId = new Map();
var testTypeIdsByName = new Map();
var testIdsByName = new Map();
var testSubtypeIdsByName = new Map();
var learningAreaIdsBySkillCode = new Map();
var learningAreaIdsByAreaName = new Map();
var skillCodeIdsByCode = new Map();
var testQuestionIdsByItemId = new Map();
var testUnitIdsByName = new Map();
var userIdsByEmail = new Map();
var getUserIdByEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var existing, result, userId;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                existing = userIdsByEmail.get(email);
                if (existing) {
                    return [2 /*return*/, existing];
                }
                return [4 /*yield*/, clients_1.dynamoDb.get({
                        TableName: "User-".concat(process.env.apibpedsysgqlGraphQLAPIIdOutput, "-").concat(process.env.env),
                        Key: { email: email },
                        ProjectionExpression: "#userId",
                        ExpressionAttributeNames: { "#userId": "userId" },
                    })];
            case 1:
                result = _c.sent();
                userId = (_b = (_a = result.Item) === null || _a === void 0 ? void 0 : _a.userId) !== null && _b !== void 0 ? _b : null;
                if (userId) {
                    userIdsByEmail.set(email, userId);
                }
                return [2 /*return*/, userId];
        }
    });
}); };
exports.getUserIdByEmail = getUserIdByEmail;
var fetchTestIdById = function (testId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, clients_1.dynamoDb.get({
                        TableName: "Test-".concat(process.env.apibpedsysgqlGraphQLAPIIdOutput, "-").concat(process.env.env),
                        Key: { id: testId },
                    })];
            case 1:
                result = _a.sent();
                if (result.Item) {
                    testIdsByName.set(result.Item.testName, testId);
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
            case 2:
                error_1 = _a.sent();
                logger_1.logger.error("Error fetching testID by ID: ".concat(testId), error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
var isValidTestId = function (testId) { return __awaiter(void 0, void 0, void 0, function () {
    var isValid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Check cache first
                if (testIdsByName.has(testId)) {
                    return [2 /*return*/, true];
                }
                return [4 /*yield*/, fetchTestIdById(testId)];
            case 1:
                isValid = _a.sent();
                return [2 /*return*/, isValid];
        }
    });
}); };
exports.isValidTestId = isValidTestId;
var fetchLearningAreaIdsByAreaName = function (areaName) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, clients_1.dynamoDb.query({
                        TableName: "LearningArea-".concat(process.env.apibpedsysgqlGraphQLAPIIdOutput, "-").concat(process.env.env),
                        IndexName: "byArea",
                        KeyConditionExpression: "#areaName = :areaName",
                        ProjectionExpression: "#id",
                        ExpressionAttributeNames: {
                            "#id": "id",
                            "#areaName": "areaName"
                        },
                        ExpressionAttributeValues: {
                            ":areaName": areaName
                        }
                    })];
            case 1:
                result = _a.sent();
                if (result.Items && result.Items.length > 0) {
                    return [2 /*return*/, result.Items[0].id];
                }
                return [2 /*return*/, null];
            case 2:
                error_2 = _a.sent();
                logger_1.logger.error("Error loading learning area cache:", error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
var getLearningAreaByName = function (areaName) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedLearningAreaId, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedLearningAreaId = learningAreaIdsByAreaName.get(areaName);
                if (cachedLearningAreaId) {
                    return [2 /*return*/, cachedLearningAreaId];
                }
                return [4 /*yield*/, fetchLearningAreaIdsByAreaName(areaName)];
            case 1:
                id = _a.sent();
                if (id) {
                    learningAreaIdsByAreaName.set(areaName, id);
                    return [2 /*return*/, id];
                }
                return [2 /*return*/, null];
        }
    });
}); };
exports.getLearningAreaByName = getLearningAreaByName;
var fetchLearningAreaAndSkillCodeIds = function (questionSkillCode) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, clients_1.dynamoDb.query({
                        TableName: "AcCode-".concat(process.env.apibpedsysgqlGraphQLAPIIdOutput, "-").concat(process.env.env),
                        IndexName: "byAcCode",
                        KeyConditionExpression: "#acCode = :acCode",
                        ProjectionExpression: "#id, #learningAreaID",
                        ExpressionAttributeNames: {
                            "#id": "id",
                            "#learningAreaID": "learningAreaID",
                            "#acCode": "acCode",
                        },
                        ExpressionAttributeValues: {
                            ":acCode": questionSkillCode,
                        },
                    })];
            case 1:
                result = _a.sent();
                if (result.Items && result.Items.length > 0) {
                    return [2 /*return*/, {
                            learningArea: result.Items[0].learningAreaID,
                            skillCode: result.Items[0].id,
                        }];
                }
                return [2 /*return*/, null];
            case 2:
                error_3 = _a.sent();
                logger_1.logger.error("Error loading skill code cache:", error_3);
                throw error_3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var getLearningAreaAndSkillCodeIds = function (questionSkillCode) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedLearningAreaId, cachedSkillCodeId, ids;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedLearningAreaId = learningAreaIdsBySkillCode.get(questionSkillCode);
                cachedSkillCodeId = skillCodeIdsByCode.get(questionSkillCode);
                if (cachedLearningAreaId && cachedSkillCodeId) {
                    return [2 /*return*/, { learningArea: cachedLearningAreaId, skillCode: cachedSkillCodeId }];
                }
                return [4 /*yield*/, fetchLearningAreaAndSkillCodeIds(questionSkillCode)];
            case 1:
                ids = _a.sent();
                if (ids) {
                    learningAreaIdsBySkillCode.set(questionSkillCode, ids.learningArea);
                    skillCodeIdsByCode.set(questionSkillCode, ids.skillCode);
                    return [2 /*return*/, ids];
                }
                return [2 /*return*/, null];
        }
    });
}); };
exports.getLearningAreaAndSkillCodeIds = getLearningAreaAndSkillCodeIds;
var fetchYearLevelId = function (description) { return __awaiter(void 0, void 0, void 0, function () {
    var result, item, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, clients_1.dynamoDb.query({
                        TableName: "YearLevel-".concat(process.env.apibpedsysgqlGraphQLAPIIdOutput, "-").concat(process.env.env),
                        IndexName: "ByYearDescription",
                        KeyConditionExpression: "#description = :description AND #type = :type",
                        ProjectionExpression: "#id",
                        ExpressionAttributeNames: {
                            "#id": "id",
                            "#description": "description",
                            "#type": "type",
                        },
                        ExpressionAttributeValues: {
                            ":description": description,
                            ":type": "YL",
                        },
                    })];
            case 1:
                result = _a.sent();
                if (result.Items && result.Items.length > 0) {
                    item = result.Items[0];
                    yearLevelsByDescription.set(description, item.id);
                    return [2 /*return*/, item.id];
                }
                logger_1.logger.warn("No year level found for description \"".concat(description, "\""));
                return [2 /*return*/, null];
            case 2:
                error_4 = _a.sent();
                logger_1.logger.error("Error loading year level cache:", error_4);
                throw error_4;
            case 3: return [2 /*return*/];
        }
    });
}); };
var getYearLevelId = function (year_level) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedYearLevelId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedYearLevelId = yearLevelsByDescription.get(year_level);
                if (cachedYearLevelId) {
                    return [2 /*return*/, cachedYearLevelId];
                }
                return [4 /*yield*/, fetchYearLevelId(year_level)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getYearLevelId = getYearLevelId;
var fetchTestTypeIdFromTestId = function (testId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, clients_1.dynamoDb.get({
                        TableName: "Test-".concat(process.env.apibpedsysgqlGraphQLAPIIdOutput, "-").concat(process.env.env),
                        Key: { id: testId },
                    })];
            case 1:
                result = _a.sent();
                if (result.Item) {
                    testTypeIdsByTestId.set(testId, result.Item.typeID);
                    return [2 /*return*/, result.Item.typeID];
                }
                return [2 /*return*/, null];
            case 2:
                error_5 = _a.sent();
                logger_1.logger.error("Error fetching test type by ID:", error_5);
                throw error_5;
            case 3: return [2 /*return*/];
        }
    });
}); };
var fetchTestTypeIdFromName = function (testTypeName) { return __awaiter(void 0, void 0, void 0, function () {
    var result, item, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, clients_1.dynamoDb.query({
                        TableName: "TestType-".concat(process.env.apibpedsysgqlGraphQLAPIIdOutput, "-").concat(process.env.env),
                        IndexName: "byType",
                        KeyConditionExpression: "#typeName = :typeName",
                        ProjectionExpression: "#id",
                        ExpressionAttributeNames: {
                            "#id": "id",
                            "#typeName": "typeName",
                        },
                        ExpressionAttributeValues: {
                            ":typeName": testTypeName,
                        },
                        Limit: 1,
                    })];
            case 1:
                result = _a.sent();
                if (result.Items && result.Items.length > 0) {
                    item = result.Items[0];
                    testTypeIdsByName.set(testTypeName, item.id);
                    return [2 /*return*/, item.id];
                }
                return [2 /*return*/, null];
            case 2:
                error_6 = _a.sent();
                logger_1.logger.error("Error fetching test type by ID:", error_6);
                throw error_6;
            case 3: return [2 /*return*/];
        }
    });
}); };
var fetchTestIdFromName = function (testName) { return __awaiter(void 0, void 0, void 0, function () {
    var result, item, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, clients_1.dynamoDb.query({
                        TableName: "Test-".concat(process.env.apibpedsysgqlGraphQLAPIIdOutput, "-").concat(process.env.env),
                        IndexName: "byName",
                        KeyConditionExpression: "#testName = :testName",
                        ProjectionExpression: "#id, #typeID",
                        ExpressionAttributeNames: {
                            "#id": "id",
                            "#typeID": "typeID",
                            "#testName": "testName",
                        },
                        ExpressionAttributeValues: {
                            ":testName": testName,
                        },
                        Limit: 1,
                    })];
            case 1:
                result = _a.sent();
                if (result.Items && result.Items.length > 0) {
                    item = result.Items[0];
                    testIdsByName.set(testName, item.id);
                    testTypeIdsByTestId.set(item.id, item.typeID);
                    return [2 /*return*/, item.id];
                }
                return [2 /*return*/, null];
            case 2:
                error_7 = _a.sent();
                logger_1.logger.error("Error fetching test ID by name:", error_7);
                throw error_7;
            case 3: return [2 /*return*/];
        }
    });
}); };
var getTestTypeIdFromName = function (testTypeName) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedTestTypeId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedTestTypeId = testTypeIdsByName.get(testTypeName);
                if (cachedTestTypeId) {
                    return [2 /*return*/, cachedTestTypeId];
                }
                return [4 /*yield*/, fetchTestTypeIdFromName(testTypeName)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getTestTypeIdFromName = getTestTypeIdFromName;
var getTestTypeIdFromTestId = function (testId) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedTestTypeId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedTestTypeId = testTypeIdsByTestId.get(testId);
                if (cachedTestTypeId) {
                    return [2 /*return*/, cachedTestTypeId];
                }
                return [4 /*yield*/, fetchTestTypeIdFromTestId(testId)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getTestTypeIdFromTestId = getTestTypeIdFromTestId;
var getTestIdFromTestName = function (testName) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedTestId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedTestId = testIdsByName.get(testName);
                if (cachedTestId) {
                    return [2 /*return*/, cachedTestId];
                }
                return [4 /*yield*/, fetchTestIdFromName(testName)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getTestIdFromTestName = getTestIdFromTestName;
var fetchTestSubtypeIdFromName = function (subTestTypeName) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, clients_1.dynamoDb.query({
                        TableName: "SubTestType-".concat(process.env.apibpedsysgqlGraphQLAPIIdOutput, "-").concat(process.env.env),
                        IndexName: "bySubTestType",
                        KeyConditionExpression: "#subTestTypeName = :subTestTypeName",
                        ProjectionExpression: "#id",
                        ExpressionAttributeNames: {
                            "#id": "id",
                            "#subTestTypeName": "subTestTypeName",
                        },
                        ExpressionAttributeValues: {
                            ":subTestTypeName": subTestTypeName,
                        },
                        Limit: 1,
                    })];
            case 1:
                result = _a.sent();
                if (result.Items && result.Items.length > 0) {
                    testTypeIdsByTestId.set(subTestTypeName, result.Items[0].id);
                    return [2 /*return*/, result.Items[0].id];
                }
                return [2 /*return*/, null];
            case 2:
                error_8 = _a.sent();
                logger_1.logger.error("Error loading subType cache:", error_8);
                throw error_8;
            case 3: return [2 /*return*/];
        }
    });
}); };
var getTestSubtypeIdFromName = function (subTestTypeName) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedSubTypeId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!subTestTypeName || subTestTypeName.length === 0) {
                    return [2 /*return*/, null];
                }
                cachedSubTypeId = testSubtypeIdsByName.get(subTestTypeName);
                if (cachedSubTypeId) {
                    return [2 /*return*/, cachedSubTypeId];
                }
                return [4 /*yield*/, fetchTestSubtypeIdFromName(subTestTypeName)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getTestSubtypeIdFromName = getTestSubtypeIdFromName;
var fetchTestUnitIdFromName = function (testUnitName) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, clients_1.dynamoDb.query({
                        TableName: "TestUnit-".concat(process.env.apibpedsysgqlGraphQLAPIIdOutput, "-").concat(process.env.env),
                        IndexName: "byUnit",
                        KeyConditionExpression: "#unitName = :unitName",
                        ProjectionExpression: "#id",
                        ExpressionAttributeNames: {
                            "#id": "id",
                            "#unitName": "unitName",
                        },
                        ExpressionAttributeValues: {
                            ":unitName": testUnitName,
                        },
                        Limit: 1,
                    })];
            case 1:
                result = _a.sent();
                if (result.Items && result.Items.length > 0) {
                    return [2 /*return*/, result.Items[0].id];
                }
                return [2 /*return*/, null];
            case 2:
                error_9 = _a.sent();
                logger_1.logger.error("Failed to look up ID for test unit named ".concat(testUnitName));
                throw error_9;
            case 3: return [2 /*return*/];
        }
    });
}); };
var getTestUnitIdFromName = function (testUnitName) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedTestUnitId, testUnitId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedTestUnitId = testUnitIdsByName.get(testUnitName);
                if (cachedTestUnitId) {
                    return [2 /*return*/, cachedTestUnitId];
                }
                return [4 /*yield*/, fetchTestUnitIdFromName(testUnitName)];
            case 1:
                testUnitId = _a.sent();
                if (testUnitId) {
                    testUnitIdsByName.set(testUnitName, testUnitId);
                }
                return [2 /*return*/, testUnitId];
        }
    });
}); };
exports.getTestUnitIdFromName = getTestUnitIdFromName;
var fetchTestQuestionIdFromItemId = function (testID, itemId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, clients_1.dynamoDb.query({
                        TableName: "TestQuestion-".concat(process.env.apibpedsysgqlGraphQLAPIIdOutput, "-").concat(process.env.env),
                        IndexName: "byTestQuestionItemId",
                        KeyConditionExpression: "#testID = :testID AND #itemId =:itemId",
                        ProjectionExpression: "#id",
                        ExpressionAttributeNames: {
                            "#id": "id",
                            "#testID": "testID",
                            "#itemId": "itemId",
                        },
                        ExpressionAttributeValues: {
                            ":testID": testID,
                            ":itemId": itemId,
                        },
                        Limit: 1,
                    })];
            case 1:
                result = _a.sent();
                if (result.Items && result.Items.length > 0) {
                    return [2 /*return*/, result.Items[0].id];
                }
                return [2 /*return*/, null];
            case 2:
                error_10 = _a.sent();
                logger_1.logger.error("There is no a question created in EdCompanion that matches with the item ID ".concat(itemId, ", the reason could be that the question is attached to an ACCODE that does not exist at the moment"), error_10);
                throw error_10;
            case 3: return [2 /*return*/];
        }
    });
}); };
var findOrCreateTestQuestion = function (testId, itemId, acCodeId, newTestQuestions) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedTestQuestionId, existingTestQuestionId, questionId, now;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedTestQuestionId = testQuestionIdsByItemId.get(itemId);
                if (cachedTestQuestionId) {
                    return [2 /*return*/, cachedTestQuestionId];
                }
                return [4 /*yield*/, fetchTestQuestionIdFromItemId(testId, itemId)];
            case 1:
                existingTestQuestionId = _a.sent();
                if (existingTestQuestionId) {
                    testQuestionIdsByItemId.set(itemId, existingTestQuestionId);
                    return [2 /*return*/, existingTestQuestionId];
                }
                questionId = (0, uuid_1.v4)();
                now = new Date().toISOString();
                newTestQuestions.push({
                    id: questionId,
                    acCodeID: acCodeId,
                    testID: testId,
                    itemId: itemId,
                    correctAnswer: "NA",
                    answerType: "CORRECT/INCORRECT",
                    __typename: "TestQuestion",
                    difficulty: 0,
                    expectedMean: 0,
                    maxScore: 0,
                    nationalMean: 0,
                    questionNo: 0,
                    createdAt: now,
                    updatedAt: now,
                });
                return [2 /*return*/, questionId];
        }
    });
}); };
exports.findOrCreateTestQuestion = findOrCreateTestQuestion;
