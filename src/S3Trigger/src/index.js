/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const createThumbnailFromsFromPDFPages = require("./createThumbnailFromsFromPDFPages.js");

// constants that can be overridden with env vars
const INTERCEPT_PREFIX = process.env.INTERCEPT_PREFIX ?? "public/handwriting/"; // process events on this S3 prefix
const INTERCEPT_SUFFIX = process.env.INTERCEPT_SUFFIX ?? ".pdf"; // process events on this S3 suffix
const THUMBNAIL_DESTINATION_PREFIX =
  process.env.THUMBNAIL_DESTINATION_PREFIX ?? "public/thumbnails/handwriting/"; // where to store the thumbnails ; if not set then thumnbnails will be stored to the source bucket.
// also process.env.THUMBNAIL_DESTINATION_BUCKET is available.
const THUMBNAIL_WIDTH = process.env.THUMBNAIL_WIDTH ?? 400; // the (maximum) width of the thumbnails
const THUMBNAIL_HEIGHT = process.env.THUMBNAIL_HEIGHT ?? 400; // the (maximum) height of the thumbnails
const THUMBNAIL_FORMAT = process.env.THUMBNAIL_FORMAT ?? "jpeg"; // the format of the thumbnails
const THUMBNAIL_SUFFIX = process.env.THUMBNAIL_SUFFIX ?? ".jpg"; // the suffix of the thumbnails
const INTERCEPT_S3_EVENTS =
  process.env.INTERCEPT_S3_EVENTS ??
  "ObjectCreated:Put,ObjectCreated:CompleteMultipartUpload"; // a comma-separated list of S3 events to process.
const INTERCEPT_S3_EVENTS_ARRAY = INTERCEPT_S3_EVENTS.split(",");
console.log(
  `Intercepting S3 events ${INTERCEPT_S3_EVENTS_ARRAY.join(
    ", "
  )} on prefix ${INTERCEPT_PREFIX} and suffix ${INTERCEPT_SUFFIX}`
);
exports.handler = async function (event) {
  /* An S3 event looks like this (with more properties):
    {
      "Records": [
        {
          "awsRegion": "us-east-1",
          "eventName": "ObjectCreated:Put",
          "s3": {
            "bucket": {
              "name": "my-bucket",
              "arn": "arn:aws:s3:::my-bucket",
            },
            "object": {
              "key": "/path/to/my-pdf-file.pdf",
            }
          }
        }
      ]
    }

  */
  console.log("Received S3 event:", JSON.stringify(event, null, 2));
  const bucket = event.Records[0].s3.bucket.name;
  // Object key may have spaces or unicode non-ASCII characters
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  console.log(`Bucket: ${bucket}`, `Key: ${key}`);
  if (!INTERCEPT_S3_EVENTS_ARRAY.includes(event.Records[0].eventName)) {
    console.log(
      `Event ${
        event.Records[0].eventName
      } is not one of the monitored events: ${INTERCEPT_S3_EVENTS_ARRAY.join(
        ","
      )}, skipping...`
    );
    return null;
  }

  if (!key.startsWith(INTERCEPT_PREFIX)) {
    console.log(
      `S3 key ${key} does not begin with ${INTERCEPT_PREFIX} ; skipping.`
    );
    return null;
  }

  if (!key.endsWith(INTERCEPT_SUFFIX)) {
    console.log(
      `S3 key ${key} does not end with ${INTERCEPT_SUFFIX} ; skipping.`
    );
    return null;
  }
  // --- if we get to this point, we want to process the PDF ---
  console.log("downloading the pdf from s3");
  const s3Client = new S3Client({ region: process.env.AWS_REGION });

  const getObjectCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  /** @type {GetObjectCommandOutput} */
  const pdfObject = await s3Client.send(getObjectCommand);

  // save the pdf to a local file
  const tmpdir = os.tmpdir();
  const pdfPath = path.join(tmpdir, key);
  const pdfDirname = path.dirname(pdfPath);
  await fs.promises.mkdir(pdfDirname, { recursive: true });
  await new Promise((resolve, reject) => {
    pdfObject.Body.pipe(fs.createWriteStream(pdfPath))
      .on("error", (err) => reject(err))
      .on("close", () => resolve());
  });
  console.log("pdf saved to local file", pdfPath);

  // create the thumbnails
  console.log("creating the thumbnails");
  const thumbnailsPaths = await createThumbnailFromsFromPDFPages(pdfPath, {
    thumbnailWidth: THUMBNAIL_WIDTH,
    thumbnailHeight: THUMBNAIL_HEIGHT,
    thumbnailFormat: THUMBNAIL_FORMAT,
    thumbnailResizeOptions: { fit: "inside" },
    outputFilenameOptions: {
      matchExpressionPattern: INTERCEPT_SUFFIX, // ".pdf"
      matchExpressionFlags: "i",
      pageNumberExpressionPattern: ".p#PAGE_NUMBER#",
      replacementExpression: `#PAGE_NUMBER_EXPRESSION#${THUMBNAIL_SUFFIX}`,
    },
  });
  console.log("thumbnails created.", thumbnailsPaths);
  console.log("uploading the thumbnails to s3");

  const THUMBNAIL_DESTINATION_BUCKET =
    process.env.THUMBNAIL_DESTINATION_BUCKET ?? bucket; // where to store the thumbnails ; if not set then thumnbnails will be stored to the source bucket.

  // upload the thumbnails to S3
  const thumbnailUploadPromises = [];
  console.log(
    `uploading thumbnails to bucket ${THUMBNAIL_DESTINATION_BUCKET} with prefix ${THUMBNAIL_DESTINATION_PREFIX}`
  );

  for (let thumbnailPath of thumbnailsPaths) {
    // the new S3 key should be the same as the thumbnailPath,
    // with the tmpdir removed from the start, then
    // INTERCEPT_PREFIX replaced with THUMBNAIL_DESTINATION_PREFIX,
    // and finally the leading slash removed.
    // e.g. if thumbnailPath is /tmp/public/thumbnails/example_from_diego/da5d81e6-b3ba-4d16-87cf-bfe2c7749387/da5d81e6-b3ba-4d16-87cf-bfe2c7749387.p4.jpg ,
    //       with INTERCEPT_PREFIX = /public/handwriting/ and THUMBNAIL_DESTINATION_PREFIX = /public/thumbnails/
    //       then the new key will be /public/thumbnails/example_from_diego/da5d81e6-b3ba-4d16-87cf-bfe2c7749387/da5d81e6-b3ba-4d16-87cf-bfe2c7749387.p4.jpg
    //       and the thumbnail will be uploaded to /public/thumbnails/example_from_diego/da5d81e6-b3ba-4d16-87cf-bfe2c7749387/da5d81e6-b3ba-4d16-87cf-bfe2c7749387.p4.jpg
    const thumbnailKey = thumbnailPath
      .replace(tmpdir, "")
      .replace(INTERCEPT_PREFIX, THUMBNAIL_DESTINATION_PREFIX)
      .replace(/^\//, "");

    console.log(
      `uploading thumbnail ${thumbnailKey} to bucket ${THUMBNAIL_DESTINATION_BUCKET}`
    );

    //TODO we need a new thumbnail key
    const putObjectCommand = new PutObjectCommand({
      Bucket: THUMBNAIL_DESTINATION_BUCKET,
      Key: thumbnailKey,
      Body: fs.readFileSync(thumbnailPath),
    });

    const thumbnailUploadPromise = s3Client.send(putObjectCommand);
    thumbnailUploadPromises.push(thumbnailUploadPromise);
    // log a message when it's done
    thumbnailUploadPromise.then(() => {
      console.log(`thumbnail ${thumbnailKey} uploaded`);
    });
  }
  // wait for all uploads to complete
  await Promise.all(thumbnailUploadPromises);
  console.log("all thumbnails uploaded");
  return null; // return null to indicate success.
};

/**
 * @typedef {import("@aws-sdk/client-s3").GetObjectCommandOutput} GetObjectCommandOutput
 */
