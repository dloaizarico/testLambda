// faculty API interface
const axios = require("axios");
const { getFacultyAxiosCommonConfig } = require("./api-utils");
let emt = null;

// setup the axios instance for the faculty EMT API
exports.setupEMTEndPoint = async (baseURL) => {
  const facultyCommonConfig = await getFacultyAxiosCommonConfig();
  emt = axios.create({
    ...facultyCommonConfig,
    baseURL,
  });
};

// get the essay for the given essayId from the faculty EMT API
exports.getEssay = async (essayId) => {
  const response = await emt.get(`/essay/${essayId}`);
  return response.data;
};

// get the essay mark for the given essayId from the faculty EMT API
exports.getEssayMark = async (essayId) => {
  const response = await emt.get(`/mark/essay/${essayId}`);
  return response.data;
};
