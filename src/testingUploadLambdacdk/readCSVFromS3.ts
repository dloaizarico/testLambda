import { createInterface } from "readline";
import { Readable } from "stream";
import { s3 } from "./clients";
import { TestResultRow, TestResultRowSchema } from "./types";

export async function readCsvFromS3(bucketName: string, key: string): Promise<TestResultRow[]> {
  const s3Object = await s3.getObject({
    Bucket: bucketName,
    Key: key,
  });

  if (!s3Object.Body || !(s3Object.Body instanceof Readable)) {
    // Body should always be a Readable stream when running in Node.js
    throw new Error("Failed to retrieve readable stream from S3 object");
  }

  const csvData: TestResultRow[] = [];
  const rl = createInterface({ input: s3Object.Body, crlfDelay: Infinity });

  let headers: string[] = [];
  let headerRowIndex = -1;
  let rowIndex = 0;

  for await (const line of rl) {
    const row = line.split(",");
    if (headerRowIndex === -1 && row.some((cell) => isNaN(Number(cell.trim())))) {
      headers = row;
      headerRowIndex = rowIndex;
    } else if (rowIndex > headerRowIndex && headers.length > 0) {
      const dataRow: Record<string, string | undefined> = {};
      headers.forEach((header, colIndex) => {
        const value = row[colIndex].trim();
        dataRow[header.trim()] = value ? value : undefined;
      });
      csvData.push(TestResultRowSchema.parse(dataRow));
    }
    rowIndex++;
  }

  return csvData;
}
