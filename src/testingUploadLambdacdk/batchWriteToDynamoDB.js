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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchWriteStudentTests = void 0;
exports.batchWriteToDynamoDB = batchWriteToDynamoDB;
var path_1 = require("path");
var dotenv_1 = require("dotenv");
if (!dotenv_1.default) {
    throw new Error('dotenv is not defined!');
}
// Load the `.env` file located at "../../../../.env"
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
var clients_1 = require("./clients");
var logger_1 = require("./logger");
var BATCH_SIZE = 25;
var batchWriteWithRetry = function (tableName, batch) { return __awaiter(void 0, void 0, void 0, function () {
    var result, unprocessedItems, error_1;
    var _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, clients_1.dynamoDb.batchWrite({
                        RequestItems: (_a = {}, _a[tableName] = batch, _a),
                    })];
            case 1:
                result = _c.sent();
                // Check for unprocessed items
                if (result.UnprocessedItems &&
                    ((_b = result.UnprocessedItems[tableName]) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    unprocessedItems = result.UnprocessedItems[tableName];
                    return [2 /*return*/, unprocessedItems];
                }
                return [2 /*return*/, []];
            case 2:
                error_1 = _c.sent();
                logger_1.logger.error("Error on batch write to ".concat(tableName, ":"), error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
function batchWriteToDynamoDB(tableName, items) {
    return __awaiter(this, void 0, void 0, function () {
        var batches, i, batch, unprocessedItemsResults, unprocessedItems;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    batches = [];
                    // Split items into batches
                    for (i = 0; i < items.length; i += BATCH_SIZE) {
                        batch = items
                            .slice(i, i + BATCH_SIZE)
                            .map(function (item) { return ({ PutRequest: { Item: item } }); });
                        batches.push(batch);
                    }
                    return [4 /*yield*/, Promise.all(batches.map(function (batch) { return batchWriteWithRetry(tableName, batch); }))];
                case 1:
                    unprocessedItemsResults = _a.sent();
                    unprocessedItems = unprocessedItemsResults.flat().filter(Boolean);
                    return [2 /*return*/, unprocessedItems];
            }
        });
    });
}
var batchWriteStudentTests = function (processedData_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([processedData_1], args_1, true), void 0, function (processedData, batchWriteFunction) {
        var apiId, env, tables, _a, tables_1, _b, name_1, items;
        if (batchWriteFunction === void 0) { batchWriteFunction = batchWriteToDynamoDB; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("processedData", processedData);
                    apiId = process.env.apibpedsysgqlGraphQLAPIIdOutput;
                    env = process.env.env;
                    tables = [
                        { name: "Test-".concat(apiId, "-").concat(env), items: processedData.addTestItems },
                        {
                            name: "TestUpload-".concat(apiId, "-").concat(env),
                            items: processedData.testUploadItems,
                        },
                        {
                            name: "TestResult-".concat(apiId, "-").concat(env),
                            items: processedData.testResultItems,
                        },
                        {
                            name: "TestResultLearningArea-".concat(apiId, "-").concat(env),
                            items: processedData.testResultLearningAreaItems,
                        },
                        {
                            name: "TestResultAnswers-".concat(apiId, "-").concat(env),
                            items: processedData.testResultAnswersItems,
                        },
                        {
                            name: "TestResultAnswersGA-".concat(apiId, "-").concat(env),
                            items: processedData.testResultAnswersGaItems,
                        },
                        {
                            name: "TestQuestion-".concat(apiId, "-").concat(env),
                            items: processedData.testQuestions,
                        },
                    ];
                    _a = 0, tables_1 = tables;
                    _c.label = 1;
                case 1:
                    if (!(_a < tables_1.length)) return [3 /*break*/, 4];
                    _b = tables_1[_a], name_1 = _b.name, items = _b.items;
                    console.log("BATCH WRITE", name_1, items);
                    if (items.length === 0) {
                        return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, batchWriteFunction(name_1, items)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.batchWriteStudentTests = batchWriteStudentTests;
