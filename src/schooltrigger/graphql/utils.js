"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilter = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getFilter = data => {
  let filter = {};

  if (data) {
    if (!_lodash.default.isArray(data[0])) {
      filter = data[0] ? {
        [data[0]]: {
          [getFilterType(data[1])]: data[2]
        }
      } : data;
    } else {
      data.forEach(d => {
        if (_lodash.default.isObject(d) && !_lodash.default.isArray(d)) {
          for (const [key, value] of Object.entries(d)) {
            filter[key] = value;
          }
        } else {
          if (_lodash.default.isArray(d)) {
            if (_lodash.default.isArray(d[0])) {
              for (const entry of d) {
                if (_lodash.default.isArray(entry)) {
                  filter[entry[0].split(".").length > 1 ? entry[0].split(".")[1] : entry[0]] = {
                    [getFilterType(entry[1])]: entry[2]
                  };
                }
              }
            } else {
              if (d[0]) {
                filter[d[0].split(".").length > 1 ? d[0].split(".")[1] : d[0]] = {
                  [getFilterType(d[1])]: d[2]
                };
              }
            }
          } else {
            if (!_lodash.default.isString(d)) {
              filter[d[0]] = {
                [getFilterType(d[1])]: d[2]
              };
            }
          }
        }
      });
    }
  }

  return filter;
};

exports.getFilter = getFilter;

function getFilterType(data) {
  switch (data) {
    case "=":
      return "eq";

    case "startswith":
      return "beginsWith";

    default:
      return data;
  }
}