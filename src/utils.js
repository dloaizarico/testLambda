const fs = require("fs"); // to write the output to a csv

function arrayToJsonTxt(inpArray, name) {
  //now write it to a file.
  fs.writeFile(`./${name}.txt`, JSON.stringify(inpArray), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

module.exports = {
  arrayToJsonTxt,
};
