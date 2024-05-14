import * as xlsx from "xlsx";

/* load 'fs' for readFile and writeFile support */
import * as fs from "fs";
xlsx.set_fs(fs);

export function jsonToXlsx(inputData: string) {
  try {
    const input = JSON.parse(inputData);
  } catch (err) {}
}

export function tsvToCsv(inputData: string) {
  try {
    return inputData.trim().replaceAll("\t", ",");
  } catch (error) {
    throw new Error(`func tsvToCsv failed: ${error}`);
  }
}
