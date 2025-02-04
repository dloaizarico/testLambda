"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParseInt = tryParseInt;
exports.tryParseFloat = tryParseFloat;
/**
 * Converts a string to an integer, throwing an error if the string is not an integer.
 *
 * @export
 * @param {string} value A string to convert into a number.
 * @param {?number} [radix] A value between 2 and 36 that specifies the base of the number in string. If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal. All other strings are considered decimal.
 * @returns {number}
 */
function tryParseInt(value, radix) {
    var parsed = parseInt(value, radix);
    if (isNaN(parsed)) {
        throw new Error("Invalid integer string: ".concat(value));
    }
    return parsed;
}
/**
 * Converts a string to a floating-point number, throwing an error if the string is not a number.
 *
 * @export
 * @param {string} value A string to convert into a number.
 * @returns {number}
 */
function tryParseFloat(value) {
    var parsed = parseFloat(value);
    if (isNaN(parsed)) {
        throw new Error("Invalid float string: ".concat(value));
    }
    return parsed;
}
