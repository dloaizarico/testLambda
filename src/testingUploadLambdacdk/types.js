"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResultRowSchema = exports.CategoryOneTestResultRowSchema = exports.CategoryTwoTestResultRowSchema = void 0;
var zod_1 = require("zod");
var utils = require("./utils");
// Input
exports.CategoryTwoTestResultRowSchema = zod_1.default.object({
    school_name: zod_1.default.string(),
    school_id: zod_1.default.string(),
    user_id: zod_1.default.string().optional(),
    student_id: zod_1.default.string().optional(),
    student_number: zod_1.default.string().optional(),
    name: zod_1.default.string(),
    birth_date: zod_1.default.string().optional(),
    year_level: zod_1.default.string(),
    test_type: zod_1.default.string(),
    sub_test_type: zod_1.default.string().optional(),
    test_short_name: zod_1.default.string().optional(),
    test_name: zod_1.default.string(),
    test_learning_area: zod_1.default.string(),
    test_date: zod_1.default.string(),
    display_date: zod_1.default.string(),
    test_segment_week: zod_1.default
        .string()
        .optional()
        .transform(function (val) { return (val === undefined ? undefined : utils.tryParseInt(val, 10)); }),
    test_segment_term: zod_1.default
        .string()
        .optional()
        .transform(function (val) { return (val === undefined ? undefined : utils.tryParseInt(val, 10)); }),
    test_calendar_year: zod_1.default.string().transform(function (val) { return utils.tryParseInt(val, 10); }),
    score_raw: zod_1.default
        .string()
        .optional()
        .transform(function (val) { return (val === undefined ? undefined : utils.tryParseFloat(val)); }),
    score_scale: zod_1.default
        .string()
        .optional()
        .transform(function (val) { return (val === undefined ? undefined : utils.tryParseFloat(val)); }),
    score_percentile: zod_1.default
        .string()
        .optional()
        .transform(function (val) { return (val === undefined ? undefined : utils.tryParseFloat(val)); }),
    score_percentage: zod_1.default
        .string()
        .optional()
        .transform(function (val) { return (val === undefined ? undefined : utils.tryParseFloat(val)); }),
    score_stanine: zod_1.default
        .string()
        .optional()
        .transform(function (val) { return (val === undefined ? undefined : utils.tryParseFloat(val)); }),
    score_total: zod_1.default
        .string()
        .optional()
        .transform(function (val) { return (val === undefined ? undefined : utils.tryParseFloat(val)); }),
});
exports.CategoryOneTestResultRowSchema = exports.CategoryTwoTestResultRowSchema.extend({
    question_position: zod_1.default.string().transform(function (val) { return utils.tryParseInt(val, 10); }),
    response_correct: zod_1.default.string().transform(function (val) {
        if (val === "TRUE") {
            return true;
        }
        else if (val === "FALSE") {
            return false;
        }
        throw new Error("Invalid value: ".concat(val, ", expected 'TRUE' or 'FALSE'"));
    }),
    question_id: zod_1.default.string(),
    question_skill_code: zod_1.default.string(),
});
exports.TestResultRowSchema = zod_1.default.union([exports.CategoryOneTestResultRowSchema, exports.CategoryTwoTestResultRowSchema]);
