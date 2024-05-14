import * as xlsx from "xlsx";
/* load 'fs' for readFile and writeFile support */
import * as fs from "fs";
/* load the codepage support library for extended support with older formats  */
import * as cpexcel from "xlsx/dist/cpexcel.full.mjs";

xlsx.set_fs(fs);
xlsx.set_cptable(cpexcel);

export function jsonToXlsx(inputData: string, outputPath: string) {
  try {
    const input = JSON.parse(inputData);
    // TODO: we will have to manually convert json structure with
    // nested arrays to array of arrays of values,
    // where items of first sub-array will be headers
    // then use this input to `aoa_to_sheet` method
    const worksheet = xlsx.utils.aoa_to_sheet(input);
    const workbook = xlsx.utils.book_new(worksheet);

    xlsx.writeFile(workbook, outputPath);
  } catch (err) {
    throw new Error(`func jsonToXlsx failed: ${err}`);
  }
}

export function tsvToCsv(inputData: string) {
  try {
    return inputData.trim().replaceAll("\t", ",");
  } catch (error) {
    throw new Error(`func tsvToCsv failed: ${error}`);
  }
}
// TODO: this is for debugging
(async () => {
  const fs = await import("fs");
  const inputFileString = fs.readFileSync("tests/test-data/json-output.json", { encoding: "utf-8" });
  jsonToXlsx(inputFileString, "output.xlsx");
})();
