const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");

/**
 * @typedef {string} PDFFilePath - a path to a PDF file
 */

/**
 * @typedef {Object} OutputFileNameOptions - Rules which will determine the
 * filenames that are output, based on a (separately) specified input (usually a
 * PDF file path)
 * @property {string} [matchExpressionPattern = ".pdf"]
 * - a string which will be treated as the pattern to match against the filename of the input PDF file. This will be
 *   passed to the RegExp constructor.
 * @property {string} [matchExpressionFlags = "i"] - a string which will be treated as the
 * flags to pass to the RegExp constructor specified by the [matchExpressionPattern]{@link matchExpressionPattern}
 * @property {string} [pageNumberExpressionPattern = ".p#PAGE_NUMBER#"] - A string into which
 * the thumbnail page number will be substituted for the `"#PAGE_NUMBER#"` token (e.g. becoming `".p2"`), and whose
 * resulting value will then be available as the token `#PAGE_NUMBER_EXPRESSION#` in [replacementExpression]{@link replacementExpression}
 * @property {string} [replacementExpression = "#PAGE_NUMBER_EXPRESSION#.jpg"] - A
 * replacement expression which will be passed to String.prototype.replace to determine the output filename for each
 * thumbnail image, based on the combination of the input (usually the full PDF file path),
 * the {@link matchExpressionPattern}, the {@link pageNumberExpressionPattern},
 * and the value provided to this parameter.
 */

/**
 * @typedef {import("sharp").ResizeOptions} ResizeOptions
 */

/**
 * @typedef {Object} ThumbnailOptions
 * @property {number} [thumbnailWidth = 200] - The width of the thumbnail image
 * @property {number} [thumbnailHeight = 200] - The height of the thumbnail image
 * @property {string} [thumbnailFormat = "jpeg"] - The format of the thumbnail image
 * @property {object} [thumbnailFormatOptions] - Options to pass through to sharp's .toFormat() method
 * @property {ResizeOptions} [thumbnailResizeOptions = {fit: "inside"}] - Options to pass through to sharp's .toFormat() method
 * @property {OutputFileNameOptions} [outputFilenameOptions] - rules to determine the path and filenames for the output thumbnail
 * images
 */

/** @type {ThumbnailOptions} - defaults */
const defaultThumbnailOptions = {
  thumbnailWidth: 200,
  thumbnailHeight: 200,
  thumbnailFormat: "jpeg",
  thumbnailResizeOptions: { fit: "inside" },
  outputFilenameOptions: {
    matchExpressionPattern: ".pdf",
    matchExpressionFlags: "i",
    pageNumberExpressionPattern: ".p#PAGE_NUMBER#",
    replacementExpression: "#PAGE_NUMBER_EXPRESSION#.jpg",
  },
};

const PAGE_NUMBER_TOKEN = new RegExp("#PAGE_NUMBER#");
const PAGE_NUMBER_EXPRESSION_TOKEN = new RegExp("#PAGE_NUMBER_EXPRESSION#");

/**
 * Uses the [sharp]{@link https://sharp.pixelplumbing.com/} library to create a thumbnail image for each page.
 * @param {PDFFilePath} pdfFilePath - The path (including filename) of the PDF
 * file to be converted to a thumbnail as a string
 * @param {ThumbnailOptions} options - The options for the output thumbnail image
 * @returns {Promise<string[]>} - An array of paths to the output thumbnail images
 */
const createThumbnailsFromPDFPages = async function (
  pdfFilePath,
  options = {}
) {
  // combine the input parameters with the defaults, also combining nested
  // properties with nested defaults
  const combinedThumbnailOptions = {
    ...defaultThumbnailOptions,
    ...(options ?? {}),
  };
  combinedThumbnailOptions.outputFilenameOptions = {
    ...defaultThumbnailOptions.outputFilenameOptions,
    ...(options?.outputFilenameOptions ?? {}),
  };
  combinedThumbnailOptions.thumbnailResizeOptions = {
    ...defaultThumbnailOptions.thumbnailResizeOptions,
    ...(options?.thumbnailResizeOptions ?? {}),
  };

  // read the file into a buffer once (it will be used twice)
  const pdfBuffer = await fs.promises.readFile(pdfFilePath);

  // get shorthand constants by deconstructing our combined input + defaults
  const {
    thumbnailWidth,
    thumbnailHeight,
    thumbnailFormat,
    thumbnailFormatOptions,
    thumbnailResizeOptions,
    outputFilenameOptions,
  } = combinedThumbnailOptions;
  const {
    matchExpressionPattern,
    matchExpressionFlags,
    pageNumberExpressionPattern,
    replacementExpression,
  } = outputFilenameOptions;

  // build a RegExp used as a match expression when replacing the input filename
  const matchExpression = new RegExp(
    matchExpressionPattern,
    matchExpressionFlags
  );

  // ensure we treat the thumbnail width and height as integers
  const widthParsed = parseInt(thumbnailWidth);
  const heightParsed = parseInt(thumbnailHeight);

  // load the file first time to get the number of pages
  const metadata = await sharp(pdfBuffer, { pages: -1 }).metadata();
  const numPages = metadata.pages;
  const outputThumbnailArray = [];
  for (let pageNum = 0; pageNum < numPages; pageNum++) {
    const thisPageReplaceExpressionPageNum =
      pageNumberExpressionPattern.replace(PAGE_NUMBER_TOKEN, pageNum + 1); // takes e.g. ".p#PAGE_NUMBER#" and converts it to ".p1" for the first page
    const thisPageReplaceExpression = replacementExpression.replace(
      PAGE_NUMBER_EXPRESSION_TOKEN,
      thisPageReplaceExpressionPageNum
    ); // takes e.g. "#PAGE_NUMBER_EXPRESSION#.jpg" and converts it to ".p1.jpg" for the first page

    const outputFilePath = pdfFilePath.replace(
      matchExpression,
      thisPageReplaceExpression
    ); // takes e.g. "C:/Users/user/Desktop/test.pdf" and converts it to "C:/Users/user/Desktop/test.p1.jpg" for the first page
    // console.log("Output file path:", outputFilePath);

    const outputFilePathDir = path.dirname(outputFilePath);
    await fs.promises.mkdir(outputFilePathDir, { recursive: true });
    await sharp(pdfBuffer, { pages: 1, page: pageNum })
      .resize(widthParsed, heightParsed, thumbnailResizeOptions)
      .toFormat(thumbnailFormat, thumbnailFormatOptions)
      .toFile(outputFilePath);

    outputThumbnailArray.push(outputFilePath);
  }
  return outputThumbnailArray;
};

module.exports = createThumbnailsFromPDFPages;

// This code is only executed if the module is run directly, not if it is
// imported. Useful for testing e.g. : "node ./createThumbnailFromsFromPDFPages.js /path/to/input.pdf"
if (require?.main === module) {
  createThumbnailsFromPDFPages(...process.argv.slice(2));
}
